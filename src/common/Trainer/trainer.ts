import path from 'node:path'
import fs from 'node:fs'
import * as tf from '@tensorflow/tfjs-node';

import { CacheLog } from 'src/types/logTypes';


class MLTrainer {

    LOG_PATH = path.resolve(`../../trainingLogs/data.json`)
    MODEL_PATH = `file://${path.resolve('../../mlModel/model')}`

    constructor() { }

    loadTrainingData(): CacheLog[] {
        const raw = fs.readFileSync(this.LOG_PATH, 'utf-8');
        return JSON.parse(raw);
    }

    async trainModel() {
        const rawData = this.loadTrainingData();

        const inputs = rawData.map(e => [
            e.frequency / 100,
            Math.min(e.timeSinceLastAccess / 3600, 1),
            (e.size ?? 0) / 1024
        ]);
        const labels = rawData.map(e => [e.evicted ? 1 : 0]);

        const inputTensor = tf.tensor2d(inputs);
        const outputTensor = tf.tensor2d(labels);

        const model = tf.sequential();
        model.add(tf.layers.dense({ inputShape: [3], units: 5, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

        model.compile({
            optimizer: tf.train.adam(0.01),
            loss: tf.losses.meanSquaredError
        });

        console.log('🔁 Training...');
        await model.fit(inputTensor, outputTensor, {
            epochs: 30,
            batchSize: 8,
            shuffle: true,
            verbose: 1
        });

        console.log('✅ Training complete. Saving model...');
        await model.save(this.MODEL_PATH);
    }

}

export default MLTrainer