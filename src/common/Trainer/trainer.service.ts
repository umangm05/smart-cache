import * as path from 'path';
import * as fs from 'node:fs'
import * as tf from '@tensorflow/tfjs-node';

import { CacheLog, CacheLogEntry, TrainingSample } from 'src/types/logTypes';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MLTrainer {

    LOG_PATH = path.resolve(`./src/trainingLogs/data.json`)
    MODEL_PATH = `file://${path.resolve('./src/mlModel')}`

    constructor() { }

    loadTrainingData(): TrainingSample[] {
        const raw = fs.readFileSync(this.LOG_PATH, 'utf-8');
        return this.processLogsToTraining(JSON.parse(raw));
    }

    processLogsToTraining(logs: CacheLogEntry[]): TrainingSample[] {
        const samples: TrainingSample[] = [];
        const evictionMap: Map<string, Date> = new Map();

        // Sort logs by time
        logs.sort((a, b) => new Date(a.accessedOn).getTime() - new Date(b.accessedOn).getTime());

        for (const log of logs) {
            const time = new Date(log.accessedOn);

            if (log.evicted) {
                evictionMap.set(log.key, time);
            }

            if (!log.cacheHit && evictionMap.has(log.key)) {
                const evictTime = evictionMap.get(log.key)!;
                const diff = (time.getTime() - evictTime.getTime()) / 1000; // in seconds

                if (diff > 0 && diff <= 600) { // within 10 minutes
                    // Bad eviction — used again soon after
                    samples.push({
                        timeOfDay: (time.getUTCHours() * 60 + time.getUTCMinutes()) / 1440,
                        dayOfWeek: time.getUTCDay(),
                        keyHash: this.hashKeyToBucket(log.key),
                        evictionWasBad: true
                    });
                    evictionMap.delete(log.key); // prevent multiple hits
                }
            }

            // Add good eviction samples too
            if (log.evicted) {
                samples.push({
                    timeOfDay: (time.getUTCHours() * 60 + time.getUTCMinutes()) / 1440,
                    dayOfWeek: time.getUTCDay(),
                    keyHash: this.hashKeyToBucket(log.key),
                    evictionWasBad: false
                });
            }
        }

        return samples;
    }

    hashKeyToBucket(key: string, buckets = 20): number {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % buckets;
    }

    async trainModel() {
        const rawData = this.loadTrainingData(); // load processed TrainingSample[]

        // Normalize input features
        const inputs = rawData.map(e => [
            e.timeOfDay,               // already normalized [0–1]
            e.dayOfWeek / 6,           // normalize day (0–6) to [0–1]
            e.keyHash / 20             // assuming keyHash is bucketed to 0–20
        ]);

        // Target: 1 if bad eviction, 0 if safe eviction
        const labels = rawData.map(e => [e.evictionWasBad ? 1 : 0]);

        const inputTensor = tf.tensor2d(inputs);
        const outputTensor = tf.tensor2d(labels);

        const model = tf.sequential();
        model.add(tf.layers.dense({ inputShape: [3], units: 6, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

        model.compile({
            optimizer: tf.train.adam(0.01),
            loss: tf.losses.logLoss,  // better for binary classification
            metrics: ['accuracy']
        });

        console.log('🔁 Training...');
        await model.fit(inputTensor, outputTensor, {
            epochs: 50,
            batchSize: 8,
            shuffle: true,
            verbose: 1
        });

        console.log('✅ Training complete. Saving model...');
        await model.save(this.MODEL_PATH);
    }

}