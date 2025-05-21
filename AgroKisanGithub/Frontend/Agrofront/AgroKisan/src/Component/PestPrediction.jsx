import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const classLabel = ['aphids', 'armyworm', 'beetle', 'bollworm', 'grasshopper', 'mites', 'mosquito', 'sawfly', 'stem_borer'];

function PestPrediction() {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [preview, setPreview] = useState(null);
  const IMAGE_SIZE = 64;

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

  // Handle preview for test image
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

  // Train the model
  const train = async () => {
    const files = document.getElementById('TrainImage').files;
    if (!files.length) return alert('Load the Train Images');

    let xs = [];
    let ys = [];
    for (const file of files) {
      let label = null;
      const lowerName = file.name.toLowerCase();
      if (lowerName.includes('aphids')) label = [1, 0, 0, 0, 0, 0, 0, 0, 0];
      else if (lowerName.includes('armyworm')) label = [0, 1, 0, 0, 0, 0, 0, 0, 0];
      else if (lowerName.includes('beetle')) label = [0, 0, 1, 0, 0, 0, 0, 0, 0];
      else if (lowerName.includes('bollworm')) label = [0, 0, 0, 1, 0, 0, 0, 0, 0];
      else if (lowerName.includes('grasshopper')) label = [0, 0, 0, 0, 1, 0, 0, 0, 0];
      else if (lowerName.includes('mites')) label = [0, 0, 0, 0, 0, 1, 0, 0, 0];
      else if (lowerName.includes('mosquito')) label = [0, 0, 0, 0, 0, 0, 1, 0, 0];
      else if (lowerName.includes('sawfly')) label = [0, 0, 0, 0, 0, 0, 0, 1, 0];
      else if (lowerName.includes('stem_borer')) label = [0, 0, 0, 0, 0, 0, 0, 0, 1];
      if (!label) continue;

      const tensor = await loadImage(file);
      xs.push(tensor);
      ys.push(label);
    }

    const xTrain = tf.concat(xs);
    const yTrain = tf.tensor2d(ys);

    const newModel = tf.sequential();
    newModel.add(tf.layers.conv2d({ inputShape: [IMAGE_SIZE, IMAGE_SIZE, 3], filters: 32, kernelSize: 3, activation: 'relu' }));
    newModel.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    newModel.add(tf.layers.flatten());
    newModel.add(tf.layers.dense({ units: classLabel.length, activation: 'softmax' }));
    newModel.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

    await newModel.fit(xTrain, yTrain, {
      batchSize: 8,
      epochs: 10,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch: ${epoch}, Loss: ${logs.loss.toFixed(4)}`);
        }
      }
    });
    setModel(newModel);
    alert('Training Complete');
    xTrain.dispose();
    yTrain.dispose();
  };

  // Predict pest class from test image
  const predict = async () => {
    if (!model) return alert('Model not loaded');
    const file = document.getElementById('TestImage').files[0];
    if (!file) return alert('Load a test image');

    const inputTensor = await loadImage(file);
    const predictions = model.predict(inputTensor).dataSync();
    const predictedIndex = predictions.indexOf(Math.max(...predictions));
    setPrediction(classLabel[predictedIndex]);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Pest Prediction</h2>

      <label>Upload Training Images (multiple):</label>
      <input type="file" id="TrainImage" multiple className="form-control mb-3" />

      <button onClick={train} className="btn btn-success mb-4">Train Model</button>

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
            alt="Image Preview"
            style={{ maxWidth: '300px', maxHeight: '300px', border: '1px solid #ccc' }}
          />
        </div>
      )}

      <button onClick={predict} className="btn btn-primary mb-3">Predict</button>

      {prediction && (
        <h4 className="alert alert-info text-center">Prediction: {prediction}</h4>
      )}
    </div>
  );
}

export default PestPrediction;
