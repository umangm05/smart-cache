import * as tf from '@tensorflow/tfjs-node';
import * as path from 'path';

const MODEL_PATH = `file://${path.resolve('./src/mlModel')}`;

export default class SmartEviction {

    private model: tf.LayersModel | null = null;

    constructor() {
        this.loadModel();
    }

    async loadModel() {
        try {
            this.model = await tf.loadLayersModel(MODEL_PATH + '/model.json');
            console.log('✅ AI Model loaded.');
        } catch (err) {
            console.warn('⚠️ Could not load model:', err.message);
        }
    }

}
