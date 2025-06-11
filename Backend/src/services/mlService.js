const tf = require('@tensorflow/tfjs');
const { createCanvas, loadImage } = require('canvas');

let model = null;

const loadModel = async () => {
    if (!model) {
        const modelPath = 'http://localhost:3000/models/model.json';
        console.log("Loading model from:", modelPath);
        try {
            model = await tf.loadGraphModel(modelPath);
            console.log("Model loaded successfully");
            console.log("Model input shape:", model.inputs[0].shape);

            if (model.modelTopology && model.modelTopology.metadata) {
                console.log("Model metadata:", model.modelTopology.metadata);
            }

            if (model.signature) {
                console.log("Model signature:", model.signature);
            }

        } catch (error) {
            console.error('Error loading model:', error);
            throw new Error(`Failed to load model: ${error.message}`);
        }
    }
    return model;
};

const processImage = async (imagePath) => {
    try {
        const image = await loadImage(imagePath);
        console.log(`Original image size: ${image.width}x${image.height}`);

        const canvas = createCanvas(256, 256); 
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, 256, 256); 

        const imageData = ctx.getImageData(0, 0, 256, 256); 
        const data = imageData.data;

        const rgbData = new Uint8Array(256 * 256 * 3); 
        let rgbIndex = 0;

        for (let i = 0; i < data.length; i += 4) {
            rgbData[rgbIndex++] = data[i];     
            rgbData[rgbIndex++] = data[i + 1]; 
            rgbData[rgbIndex++] = data[i + 2]; 
        }

        const imgTensor = tf.tensor3d(rgbData, [256, 256, 3]); 

        const floatTensor = imgTensor.toFloat();
        const normalizedTensor = floatTensor.div(tf.scalar(255));

        const inputTensor = normalizedTensor.expandDims(0);

        console.log("Input tensor shape:", inputTensor.shape);

        imgTensor.dispose();
        floatTensor.dispose();
        normalizedTensor.dispose();

        return inputTensor;
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error(`Failed to process image: ${error.message}`);
    }
};

const predictDisease = async (imagePath) => {
    try {
        console.log("Starting prediction for:", imagePath);

        let attempts = 0;
        const maxAttempts = 3;

        while (!model && attempts < maxAttempts) {
            attempts++;
            console.log(`Loading model attempt ${attempts}/${maxAttempts}`);

            try {
                await loadModel();
                if (model) {
                    console.log("Model loaded successfully on attempt", attempts);
                    break;
                }
            } catch (error) {
                console.error(`Model loading attempt ${attempts} failed:`, error.message);
                if (attempts === maxAttempts) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (!model) {
            throw new Error("Failed to load model after multiple attempts");
        }

        console.log("Processing image...");
        const inputTensor = await processImage(imagePath);

        console.log("Making prediction...");
        console.log("Final input shape before prediction:", inputTensor.shape);

        const predictions = model.predict(inputTensor);

        const predData = await predictions.data();
        const predictedClass = predData.indexOf(Math.max(...predData));
        const confidence = predData[predictedClass];

        if (confidence < 0.75) {
            return { diseaseId: null, diseaseName: 'Unclear', confidence };
        }

        const diseaseMapping = {
            0: { diseaseId: 1, diseaseName: 'Bercak', confidence }, 
            1: { diseaseId: 2, diseaseName: 'Hawar', confidence },   
            2: { diseaseId: 3, diseaseName: 'Karat', confidence },   
            3: { diseaseId: 4, diseaseName: 'Sehat', confidence }    
        };

        inputTensor.dispose();
        predictions.dispose();

        return diseaseMapping[predictedClass] || { diseaseId: null, diseaseName: 'Unknown', confidence: 0 };

    } catch (error) {
        console.error('Error in predictDisease:', error);
        throw error;
    }
};

module.exports = {
    predictDisease,
};