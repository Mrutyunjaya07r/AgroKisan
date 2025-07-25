import React from 'react';

function Aboutus() {
  return (
    <div className="min-h-screen bg-light p-5">
      <div className="container bg-white shadow-lg rounded-3 p-4 mt-4">
        <h1 className="text-center text-success mb-4">🌾 About This Application</h1>
             <div className="con">
<div className="profilepic">
        </div>
        </div>
       

        <p className="lead">
          Hello! I am <strong>Mrutyunjaya Swain</strong>, a passionate tech enthusiast currently in my pre-final year of
          <strong> B.Tech in Computer Science and Information Technology</strong> at <strong>Siksha 'O' Anusandhan University</strong>.
        </p>

        <p>
          With a deep interest in Artificial Intelligence, Machine Learning, and their real-world applications, I developed this
          agricultural assistant platform to bridge the gap between farmers and smart farming technologies.
        </p>

        <hr />

        <h4 className="mt-4">🌦 Weather Monitoring & Crop Recommendation</h4>
        <p>
          This application analyzes <strong>real-time weather data</strong> and local soil conditions to recommend the
          <strong> most suitable crops</strong> for a farmer's location. Whether it's rainfall, temperature, or humidity, the model considers
          environmental factors before suggesting what to grow.
        </p>

        <h4 className="mt-4">🌱 Fertilizer Guidance System</h4>
        <p>
          Based on the user's input and soil health, the app suggests <strong>optimal fertilizers</strong> tailored to specific crop needs,
          promoting better yield and sustainable agriculture practices.
        </p>

        <h4 className="mt-4">🦠 Plant Disease & Pest Detection</h4>
        <p>
          One of the key highlights of the app is the integration of a <strong>Convolutional Neural Network (CNN)</strong> to detect
          <strong> plant diseases and pest infestations</strong> using image inputs. Farmers can simply upload photos of affected crops,
          and the system will analyze and identify:
        </p>
        <ul className="ms-4">
          <li>✅ The disease affecting the plant (e.g., <em>scab, rot, blotch</em>)</li>
          <li>✅ The pest attacking the crops (e.g., <em>aphids, beetles</em>)</li>
          <li>✅ The severity level (if applicable)</li>
        </ul>

        <h4 className="mt-4">🚀 Technology Stack Used</h4>
        <ul className="ms-4">
          <li><strong>Frontend:</strong> React.js + Bootstrap / Tailwind CSS</li>
          <li><strong>Machine Learning:</strong> TensorFlow.js for in-browser model training and prediction</li>
          <li><strong>Image Processing:</strong> HTML Canvas + tf.browser.fromPixels()</li>
          <li><strong>APIs:</strong> Weather API for real-time climatic data</li>
        </ul>

        <h4 className="mt-4">🎯 Vision Behind the Project</h4>
        <p>
          The aim of this application is to provide <strong>affordable, AI-powered assistance</strong> to Indian farmers,
          enabling them to make informed decisions regarding crop selection, soil treatment, and disease management.
        </p>
        <p>
          By combining AI with agriculture, we can help reduce losses, improve yields, and promote tech awareness among farming communities.
        </p>

        <hr />
        <p className="text-center text-muted mt-4">
          Developed with ❤️ by <strong>Mrutyunjaya Swain</strong><br />
          Pre-final Year, B.Tech CSE & IT<br />
          Siksha 'O' Anusandhan University
        </p>
      </div>
    </div>
  );
}

export default Aboutus;
