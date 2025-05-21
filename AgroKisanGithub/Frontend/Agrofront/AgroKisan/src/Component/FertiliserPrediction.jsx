import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

let classLabel = ['Urea', 'DAP', 'Fourteen-Thirty Five-Fourteen', 'Twenty Eight-Twenty Eight', 'Seventeen-Seventeen-Seventeen', 'Twenty-Twenty', 'Ten-Twenty Six-Twenty Six'];

function FertiliserPrediction() {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [features, setFeatures] = useState({ Nitrogen: 0, Potassium: 0, Phosphorous: 0 });
  const [featureMax, setFeatureMax] = useState(null);
  const [featureMin, setFeatureMin] = useState(null);

  const handleFeature = (e) => {
    setFeatures({ ...features, [e.target.name]: parseFloat(e.target.value) });
  };

  function normalise(tensor, min, max) {
    return tensor.sub(min).div(max.sub(min));
  }

  async function loadData() {
    try {
      const response = await fetch('/FertilizerPrediction.csv');
      const data = await response.text();
      const rows = data.trim().split("\n").slice(1);
      const cleaned = rows.map(row => {
        const cols = row.split(",");
        return { x: cols.slice(0, 3).map(Number), y: classLabel.indexOf(cols[3]) };
      });
      const features = cleaned.map(p => p.x);
      const labels = cleaned.map(p => p.y);
      return { features, labels };
    } catch (error) {
      alert('Error loading data: ' + error);
    }
  }

  async function createModel() {
    const model = tf.sequential();
   model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [3],
      kernelInitializer: 'heNormal'
    }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
      kernelInitializer: 'heNormal'
    }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    
    model.add(tf.layers.dense({
      units: classLabel.length,
      activation: 'softmax'
    }));
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  async function trainModel() {
    const { features, labels } = await loadData();
    const featureTensor = tf.tensor2d(features);
    setFeatureMax(featureTensor.max());
    setFeatureMin(featureTensor.min());
    const normalisedFeatures = normalise(featureTensor, featureTensor.min(), featureTensor.max());
    const labelTensor = tf.oneHot(tf.tensor1d(labels, 'int32'), classLabel.length);
    const model = await createModel();
    setModel(model);

    await model.fit(normalisedFeatures, labelTensor, {
      batchSize: 32,
      epochs: 20,
      callbacks: tfvis.show.fitCallbacks({ name: 'Training Performance' }, ['loss', 'acc'])
    });
    alert('Training completed');
  }

  async function predict() {
    const inputTensor = tf.tensor2d([[features.Nitrogen, features.Potassium, features.Phosphorous]]);
    const normalisedInput = normalise(inputTensor, featureMin, featureMax);
    const prediction = model.predict(normalisedInput).dataSync();
    const results = Array.from(prediction).map((prob, idx) => ({ label: classLabel[idx], prob: (prob * 100).toFixed(2) + '%' }));
    setPrediction(results);
  }

  return (
    <div className="container mt-5">
      <h2>Fertiliser Prediction</h2>
      <div className="form-group">
        <label>Nitrogen:</label>
        <input type="number" name="Nitrogen" onChange={handleFeature} className="form-control" />
        <label>Potassium:</label>
        <input type="number" name="Potassium" onChange={handleFeature} className="form-control" />
        <label>Phosphorous:</label>
        <input type="number" name="Phosphorous" onChange={handleFeature} className="form-control" />
      </div>
      <button onClick={trainModel} className="btn btn-success m-2">Train</button>
      <button onClick={predict} className="btn btn-primary m-2">Predict</button>
      {prediction && (
        <div className="mt-3">
          <h4>Prediction Results:</h4>
          <ul>
            {prediction.map((p, idx) => (
              <li key={idx}>{p.label}: {p.prob}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FertiliserPrediction;
