import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const classLabel = ['rain', 'snow', 'drizzle', 'sun', 'fog'];

function WeatherPrediction() {
  const [tempmax, setTempmax] = useState();
  const [tempmin, setTempMin] = useState();
  const [precipitation, setPrecipitation] = useState();
  const [wind, setWind] = useState();
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState();
  const [features, setFeatures] = useState({
    precipitation: 0.0,
    temp_max: 0.0,
    temp_min: 0.0,
    wind: 0.0,
  });

  const weatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Bhubaneswar&appid=edde7fec2090b109f39ea3975daa74fc`
      );
      const result = await response.json();
      const max = (result.main.temp_max - 273).toFixed(2);
      const min = (result.main.temp_min - 273).toFixed(2);
      const windSpeed = result.wind.speed;

      setTempmax(max);
      setTempMin(min);
      setPrecipitation(0.0); // Default value since OpenWeatherMap may not have direct value
      setWind(windSpeed);

      setFeatures({
        precipitation: 0.0,
        temp_max: parseFloat(max),
        temp_min: parseFloat(min),
        wind: parseFloat(windSpeed),
      });

      localStorage.setItem('temperature', max);
      localStorage.setItem('humidity', result.main.humidity);
    } catch (error) {
      alert('Failed to fetch weather data: ' + error.message);
    }
  };

  const normalise = (tensor, min, max) => tensor.sub(min).div(max.sub(min));

  async function loadData() {
    const response = await fetch('/seattle-weather.csv');
    const data = await response.text();
    const rows = data.trim().split('\n').slice(1);
    const cleaned = rows
      .map((row) => {
        const cols = row.split(',');
        return {
          x: cols.slice(0, 4).map(parseFloat),
          y: parseInt(cols[4]),
        };
      })
      .filter((p) => !isNaN(p.x[0]));

    const feature = cleaned.map((p) => p.x);
    const label = cleaned.map((p) => p.y);
    return { feature, label };
  }

  async function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [4] }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: classLabel.length, activation: 'softmax' }));
    model.compile({
      loss: 'categoricalCrossentropy',
      optimizer: tf.train.adam(0.001),
      metrics: ['accuracy'],
    });
    return model;
  }

  async function train() {
    const { feature, label } = await loadData();
    const featureTensor = tf.tensor2d(feature);
    const normalizedFeatures = normalise(featureTensor, featureTensor.min(), featureTensor.max());
    const labelTensor = tf.oneHot(tf.tensor1d(label, 'int32'), classLabel.length);

    const model = await createModel();
    setModel(model);

    try {
      await model.fit(normalizedFeatures, labelTensor, {
        batchSize: 32,
        epochs: 20,
        validationSplit: 0.2,
      });
      alert('Training completed');
    } catch (error) {
      alert('Training failed: ' + error.message);
    }
  }

  async function predict() {
    const inputTensor = tf.tensor2d([
      [features.precipitation, features.temp_max, features.temp_min, features.wind],
    ]);
    const prediction = model.predict(inputTensor).dataSync();
    const result = Array.from(prediction).map((prob, idx) => ({
      label: classLabel[idx],
      prob: (prob * 100).toFixed(2) + '%',
    }));
    setPrediction(result);
  }

  useEffect(() => {
    weatherData();
    train();
  }, []);

  return (
    <div className="container p-4 bg-light text-center rounded">
      <h2 className="display-4 text-success mb-4">Weather Prediction</h2>
      <div className="card p-3 mb-4">
        <div className="alert alert-info">🌬 Wind Speed: {wind} m/s</div>
        <div className="alert alert-warning">🌡 Max Temperature: {tempmax} °C</div>
        <div className="alert alert-danger">🌡 Min Temperature: {tempmin} °C</div>
        <div className="alert alert-success">🌧 Precipitation: {precipitation} mm</div>
        <button className="btn btn-success mt-2" onClick={predict}>
          🔍 Predict Weather
        </button>
      </div>

      {prediction && (
        <div className="card bg-success text-white p-3">
          <h3>Prediction Results:</h3>
          {prediction.map((p, idx) => (
            <div key={idx} className="alert alert-light text-dark fw-bold">
              {p.label}: {p.prob}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherPrediction;
