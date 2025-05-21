import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

const classLabel = ["rice", "wheat", "maize", "cotton", "chickpea", "kidneybeans", "pigeonpeas", "mothbeans", "mungbean", "blackgram", "lentil", "pomegranate", "banana", "mango", "grapes", "watermelon", "muskmelon", "apple", "orange", "papaya", "coconut", "jute", "coffee"];

function CropRecommendation() {
  const [prediction, setPrediction] = useState([]);
  const [model, setModel] = useState(null);
  const [features, setFeatures] = useState({ N: 0, P: 0, K: 0, temperature: 0, humidity: 0, ph: 0, rainfall: 0 });
  const [featureMin, setFeatureMin] = useState(null);
  const [featureMax, setFeatureMax] = useState(null);

  useEffect(() => {
    run();
  }, []);

  const handleChange = (e) => {
    setFeatures({ ...features, [e.target.name]: parseFloat(e.target.value) });
  };

  function normalize(tensor, min, max) {
    return tensor.sub(min).div(max.sub(min));
  }

  async function loadDataset() {
    const response = await fetch("/Crop_recommendation.csv");
    const data = await response.text();
    const rows = data.trim().split("\n").slice(1);
    const cleaned = rows.map(row => {
      const cols = row.split(",");
      if (cols.length < 8 || !classLabel.includes(cols[7]?.trim())) return null;
      return { x: cols.slice(0, 7).map(parseFloat), y: classLabel.indexOf(cols[7].trim()) };
    }).filter(p => p !== null);
    const features = cleaned.map(p => p.x);
    const labels = cleaned.map(p => p.y);
    return { features, labels };
  }

  async function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [7] }));
    model.add(tf.layers.dense({ units: classLabel.length, activation: 'softmax' }));
    model.compile({ loss: 'categoricalCrossentropy', optimizer: tf.train.adam(0.01), metrics: ['accuracy'] });
    return model;
  }

  async function train() {
    const { features, labels } = await loadDataset();
    const featureTensor = tf.tensor2d(features);
    setFeatureMin(featureTensor.min());
    setFeatureMax(featureTensor.max());
    const normalizedFeatures = normalize(featureTensor, featureTensor.min(), featureTensor.max());
    const labelTensor = tf.oneHot(tf.tensor1d(labels, 'int32'), classLabel.length);
    const model = await createModel();
    setModel(model);
    const { onEpochEnd } = tfvis.show.fitCallbacks({ name: 'Training Performance' }, ['loss', 'acc'], { height: 200 });
    await model.fit(normalizedFeatures, labelTensor, { epochs: 20, batchSize: 32, callbacks: { onEpochEnd } });
    alert('Training complete!');
  }

  async function predict() {
    const inputTensor = tf.tensor2d([[features.N, features.P, features.K, features.temperature, features.humidity, features.ph, features.rainfall]]);
    const normalizedInput = normalize(inputTensor, featureMin, featureMax);
    const prediction = await model.predict(normalizedInput).data();
    const results = Array.from(prediction).map((prob, idx) => ({ label: classLabel[idx], prob: (prob * 100).toFixed(2) + '%' }));
    setPrediction(results);
  }

  async function run() {
    try {
      await loadDataset();
      alert("Dataset loaded successfully.");
    } catch (error) {
      alert("Error loading dataset: " + error.message);
    }
  }

  return (
    <div className="container p-4">
      <h1 className="display-4 text-center text-primary">🌱 Crop Recommendation</h1>
      <div className="row g-3 mb-4">
        {Object.keys(features).map(key => (
          <div key={key} className="col-md-6">
            <label className="form-label">{key}:</label>
            <input type="number" name={key} value={features[key]} onChange={handleChange} className="form-control" />
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center gap-3">
        <button onClick={train} className="btn btn-primary">Train</button>
        <button onClick={predict} className="btn btn-success">Predict</button>
      </div>
      {prediction.length > 0 && (
        <div className="mt-4">
          <h2 className="h4">Prediction:</h2>
          <ul className="list-group">
            {prediction.map((p, idx) => (
              <li key={idx} className="list-group-item">{p.label}: {p.prob}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CropRecommendation;
