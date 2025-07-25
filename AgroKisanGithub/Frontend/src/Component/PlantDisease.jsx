import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const classLabel = ['healthy', 'rot', 'blotch', 'scab'];
const IMAGE_SIZE = 64;

function PlantDisease() {
  const [model, setModel] = useState(null);
  const [preview, setPreview] = useState();
  const [prediction, setPrediction] = useState();

  const loadImageFromURL = async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const tensor = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE])
          .toFloat()
          .sub(0.5)
          .div(0.5)
          .expandDims();
        resolve(tensor);
      };
      img.onerror = () => {
        console.error("Error loading image:", url);
        resolve(null);
      };
      img.src = url;
    });
  };

  const train = async () => {
    const xs = [];
    const ys = [];

    for (let i = 0; i < classLabel.length; i++) {
      const label = classLabel[i];
      for (let j = 1; j <= 32; j++) { // adjust how many images per class you want
        const path = `/plant_train/${label}/${label}${j}.jpeg`; // 👈 folder in public
        const imgTensor = await loadImageFromURL(path);
        if (imgTensor) {
          xs.push(imgTensor);
          const oneHot = new Array(classLabel.length).fill(0);
          oneHot[i] = 1;
          ys.push(oneHot);
        }
      }
    }

    if (xs.length === 0) {
      alert("No training images found in /public/plant_train/");
      return;
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

    newModel.compile({
      loss: 'categoricalCrossentropy',
      optimizer: tf.train.adam(0.001),
      metrics: ['accuracy']
    });

    await newModel.fit(xTrain, yTrain, {
      batchSize: 8,
      epochs: 10,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1} - Loss: ${logs.loss.toFixed(4)}, Accuracy: ${logs.acc?.toFixed(4)}`);
        }
      }
    });

    setModel(newModel);
    alert("Training Complete");

    xTrain.dispose();
    yTrain.dispose();
  };

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

  const predict = async () => {
    if (!model) return alert('Model not loaded');
    const file = document.getElementById('TestImage').files[0];
    if (!file) return alert('Upload a test image');
    const inputTensor = await loadImage(file);
    const pred = model.predict(inputTensor).dataSync();
    const predictedIndex = pred.indexOf(Math.max(...pred));
    setPrediction(classLabel[predictedIndex]);
  };

  const handleTestImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-4">
      <div className="container bg-white rounded-3 shadow p-4 mt-4">
        <h2 className="text-center text-success mb-4">🌿 Plant Disease Prediction</h2>

        <div className="mb-4">
          <p><strong>Training Images Loaded Automatically from:</strong> <code>/public/plant_train/[label]/img1.jpg</code></p>
          <button onClick={train} className="btn btn-success w-100 mt-2">Train Model</button>
        </div>

        <div className="mb-4">
          <label htmlFor="TestImage" className="form-label">Upload Test Image:</label>
          <input type="file" id="TestImage" onChange={handleTestImageChange} className="form-control" />
          <button onClick={predict} className="btn btn-primary w-100 mt-3">Predict</button>
        </div>

        {preview && <img src={preview} alt="preview" className="d-block mx-auto mb-3 rounded shadow" style={{ width: '130px', height: '130px', objectFit: 'cover' }} />}

        {prediction && <div className="alert alert-info text-center">🌱 Prediction: <strong>{prediction}</strong></div>}
      </div>
    </div>
  );
}

export default PlantDisease;
