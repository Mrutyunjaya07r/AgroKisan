import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const classLabel = [
  'Urea', 'DAP', 'Fourteen-Thirty Five-Fourteen',
  'Twenty Eight-Twenty Eight', 'Seventeen-Seventeen-Seventeen',
  'Twenty-Twenty', 'Ten-Twenty Six-Twenty Six'
];

function FertiliserPrediction() {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [features, setFeatures] = useState({ Nitrogen: 0, Potassium: 0, Phosphorous: 0 });
  const [featureMax, setFeatureMax] = useState(null);
  const [featureMin, setFeatureMin] = useState(null);

  useEffect(() => {
    const N = parseFloat(localStorage.getItem('N')) || 0;
    const P = parseFloat(localStorage.getItem('P')) || 0;
    const K = parseFloat(localStorage.getItem('K')) || 0;
    setFeatures({ Nitrogen: N, Phosphorous: P, Potassium: K });
  }, []);

  const handleFeature = (e) => {
    setFeatures({ ...features, [e.target.name]: parseFloat(e.target.value) });
  };

  function normalise(tensor, min, max) {
    return tensor.sub(min).div(max.sub(min));
  }

  async function loadData() {
    const response = await fetch('/FertilizerPrediction.csv');
    const data = await response.text();
    const rows = data.trim().split("\n").slice(1);
    const cleaned = rows.map(row => {
      const cols = row.split(",");
      return {
        x: cols.slice(0, 3).map(Number),
        y: classLabel.indexOf(cols[3].trim())
      };
    });
    const features = cleaned.map(p => p.x);
    const labels = cleaned.map(p => p.y);
    return { features, labels };
  }

  async function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({
      units: 64, activation: 'relu', inputShape: [3], kernelInitializer: 'heNormal'
    }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({
      units: 32, activation: 'relu', kernelInitializer: 'heNormal'
    }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({
      units: classLabel.length, activation: 'softmax'
    }));
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
    return model;
  }

  async function trainModel() {
    const { features: trainX, labels } = await loadData();
    const featureTensor = tf.tensor2d(trainX);
    const min = featureTensor.min();
    const max = featureTensor.max();
    setFeatureMin(min);
    setFeatureMax(max);
    const normalisedFeatures = normalise(featureTensor, min, max);
    const labelTensor = tf.oneHot(tf.tensor1d(labels, 'int32'), classLabel.length);

    const model = await createModel();
    setModel(model);

    await model.fit(normalisedFeatures, labelTensor, {
      batchSize: 32,
      epochs: 20,
    });

    alert('✅ Training completed');
  }

  async function predict() {
    if (!model || !featureMin || !featureMax) {
      alert("⚠️ Please train the model first.");
      return;
    }

    const inputTensor = tf.tensor2d([[
      features.Nitrogen, features.Potassium, features.Phosphorous
    ]]);
    const normalisedInput = normalise(inputTensor, featureMin, featureMax);
    const predictionResult = model.predict(normalisedInput).dataSync();

    const results = Array.from(predictionResult).map((prob, idx) => ({
      label: classLabel[idx],
      prob: (prob * 100).toFixed(2) + '%'
    }));

    setPrediction(results);
  }

  return (
    <div className="container mt-5">
      <h2 className="text-success mb-4">🌿 Fertiliser Prediction</h2>

      <div className="row g-3 mb-3">
        {['Nitrogen', 'Potassium', 'Phosphorous'].map((key) => (
          <div key={key} className="col-md-4">
            <label className="form-label">{key}</label>
            <input
              type="number"
              name={key}
              className="form-control"
              value={features[key]}
              onChange={handleFeature}
            />
          </div>
        ))}
      </div>

      <div className="d-flex gap-3 mb-4">
        <button onClick={trainModel} className="btn btn-warning px-4">Train</button>
        <button onClick={predict} className="btn btn-primary px-4">Predict</button>
      </div>

      {prediction && (
        <div className="mt-3">
          <h4>Prediction Results:</h4>
          <ul className="list-group">
            {prediction
              .sort((a, b) => parseFloat(b.prob) - parseFloat(a.prob))
              .slice(0, 3)
              .map((p, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between">
                  <strong>{p.label}</strong>
                  <span>{p.prob}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FertiliserPrediction;
