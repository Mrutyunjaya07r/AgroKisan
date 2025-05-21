import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const classLabel = ['healthy', 'rot', 'blotch', 'scab'];
const IMAGE_SIZE = 64;

function PlantDisease() {
  const [model, setModel] = useState(null);
  const [preview, setPreview] = useState();
  const [prediction, setPrediction] = useState();

  const loadImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE])
            .toFloat()
            .sub(0.5)
            .div(0.5)
            .expandDims();
          resolve(tensor);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const train = async () => {
    const files = document.getElementById('TrainImage').files;
    if (!files.length) return alert('Upload Training Images');

    const xs = [];
    const ys = [];
    for (const file of files) {
      const tensor = await loadImage(file);
      xs.push(tensor);
      const fileName = file.name.toLowerCase();
      const label = [
        fileName.includes('healthy') ? 1 : 0,
        fileName.includes('rot') ? 1 : 0,
        fileName.includes('blotch') ? 1 : 0,
        fileName.includes('scab') ? 1 : 0,
      ];
      ys.push(label);
    }

    const xTrain = tf.concat(xs);
    const yTrain = tf.tensor2d(ys);

    const newModel = tf.sequential();
    newModel.add(tf.layers.conv2d({ inputShape: [IMAGE_SIZE, IMAGE_SIZE, 3], kernelSize: 3, filters: 32, activation: 'relu' }));
    newModel.add(tf.layers.batchNormalization());
    newModel.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    newModel.add(tf.layers.dropout({ rate: 0.25 }));

    newModel.add(tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }));
    newModel.add(tf.layers.batchNormalization());
    newModel.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    newModel.add(tf.layers.dropout({ rate: 0.25 }));

    newModel.add(tf.layers.flatten());
    newModel.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    newModel.add(tf.layers.dropout({ rate: 0.5 }));
    newModel.add(tf.layers.dense({ units: classLabel.length, activation: 'softmax' }));

    newModel.compile({ loss: 'categoricalCrossentropy', optimizer: tf.train.adam(0.001), metrics: ['accuracy'] });

    await newModel.fit(xTrain, yTrain, {
      batchSize: 8,
      epochs: 20,
      callbacks: {
        onEpochEnd: (epochs, logs) => {
          console.log(`Epoch ${epochs + 1} - Loss: ${logs.loss.toFixed(4)}, Accuracy: ${logs.acc.toFixed(4)}`);
        }
      }
    });

    setModel(newModel);
    alert('Training Complete');
    xTrain.dispose();
    yTrain.dispose();
  };

  const predict = async () => {
    if (!model) return alert('Model not loaded');
    const file = document.getElementById('TestImage').files[0];
    if (!file) return alert('Upload a test image');
    const inputTensor = await loadImage(file);
    const prediction = model.predict(inputTensor).dataSync();
    const predictedIndex = prediction.indexOf(Math.max(...prediction));
    setPrediction(classLabel[predictedIndex]);
  };

  const handleTestImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Plant Disease Prediction</h2>
      <input type="file" id="TrainImage" multiple className="mb-4" />
      <button onClick={train} className="bg-blue-500 text-white px-4 py-2 rounded">Train Model</button>
      <br /><br />
      <input type="file" id="TestImage" onChange={handleTestImageChange} className="mb-4" />
      <button onClick={predict} className="bg-green-500 text-white px-4 py-2 rounded">Predict</button>
      {preview && <img src={preview} alt="preview" className="w-32 h-32 my-4" />}
      {prediction && <p className="text-xl">Prediction: {prediction}</p>}
    </div>
  );
}

export default PlantDisease;
