import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const classLabel = [
  'aphide', 'armyworm', 'beetle', 'bollworm', 'grasshoper',
  'mites', 'mosquito', 'sawfly', 'stem_borer'
];

function PestPrediction() {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [preview, setPreview] = useState(null);
  const IMAGE_SIZE = 64;

  const loadImageFromURL = async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const tensor = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE])
          .toFloat()
          .div(tf.scalar(255))
          .expandDims();
        resolve(tensor);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
        resolve(null);
      };
      img.src = url;
    });
  };

  const handleTestImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
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
            .div(tf.scalar(255))
            .expandDims();
          resolve(tensor);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const train = async () => {
    const xs = [];
    const ys = [];

    for (let i = 0; i < classLabel.length; i++) {
      const label = classLabel[i];
      for (let j = 1; j <= 50; j++) { // adjust number of images per class
        const imgPath = `/train/${label}/${label}${j}.jpg`;
        const imgTensor = await loadImageFromURL(imgPath);
        if (imgTensor) {
          xs.push(imgTensor);
          const oneHot = new Array(classLabel.length).fill(0);
          oneHot[i] = 1;
          ys.push(oneHot);
        }
      }
    }

    if (xs.length === 0) {
      alert("No training images loaded. Make sure they are placed in public/train/[label]/imgX.jpg format.");
      return;
    }

    const xTrain = tf.concat(xs);
    const yTrain = tf.tensor2d(ys);

    const newModel = tf.sequential();
    newModel.add(tf.layers.conv2d({
      inputShape: [IMAGE_SIZE, IMAGE_SIZE, 3],
      filters: 32,
      kernelSize: 3,
      activation: 'relu'
    }));
    newModel.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    newModel.add(tf.layers.flatten());
    newModel.add(tf.layers.dense({
      units: classLabel.length,
      activation: 'softmax'
    }));

    newModel.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    await newModel.fit(xTrain, yTrain, {
      batchSize: 4,
      epochs: 10,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}`);
        }
      }
    });

    setModel(newModel);
    alert('Training complete');
    xTrain.dispose();
    yTrain.dispose();
  };

  const predict = async () => {
    if (!model) return alert('Model not trained yet');
    const file = document.getElementById('TestImage').files[0];
    if (!file) return alert('Please upload a test image');

    const inputTensor = await loadImage(file);
    const predictions = model.predict(inputTensor).dataSync();
    const predictedIndex = predictions.indexOf(Math.max(...predictions));
    setPrediction(classLabel[predictedIndex]);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Pest Prediction</h2>

      <button onClick={train} className="btn btn-success mb-4">
        Train Model (Auto from public/train)
      </button>

      <label>Upload Test Image:</label>
      <input
        type="file"
        id="TestImage"
        className="form-control mb-3"
        onChange={handleTestImageChange}
      />

      {preview && (
        <div className="mb-3 text-center">
          <img
            src={preview}
            alt="Test Preview"
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
              border: '1px solid #ccc'
            }}
          />
        </div>
      )}

      <button onClick={predict} className="btn btn-primary mb-3">Predict</button>

      {prediction && (
        <h4 className="alert alert-info text-center">
          Prediction: {prediction}
        </h4>
      )}
    </div>
  );
}

export default PestPrediction;
