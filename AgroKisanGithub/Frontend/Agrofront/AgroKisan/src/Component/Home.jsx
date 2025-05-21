import React from 'react';
import { Link } from 'react-router';

function Home() {
  const divStyle = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.9,
    height: '250px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  };

  const hoverStyle = {
    transform: 'scale(1.08)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
    filter: 'brightness(1.1)'
  };

  const resetStyle = {
    transform: 'scale(1)',
    boxShadow: 'none',
    filter: 'brightness(1)'
  };

  return (
    <div className='container mt-4 bg-light p-5 rounded'>
      <div
        className='p-4 mb-3 bg-primary text-dark rounded'
        style={{ ...divStyle, backgroundImage: 'url(https://wallpaperaccess.com/full/1540016.jpg)' }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, {...divStyle, ...resetStyle})}
      >
        <h2>Weather Prediction</h2>
        <p>Predict weather conditions based on various inputs.</p>
        <button className='btn btn-outline-primary'>
          <Link to='/weather' style={{ color: "whitesmoke", textDecoration: "none" }}>Weather Prediction</Link>
        </button>
      </div>

      <div
        className='p-4 mb-3 bg-success text-dark rounded'
        style={{ ...divStyle, backgroundImage: 'url(https://wallpaperaccess.com/full/3543885.jpg)' }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, {...divStyle, ...resetStyle})}
      >
        <h2>Suitable Crop Prediction</h2>
        <p>Suggest the most suitable crops based on soil and weather data.</p>
        <button className='btn btn-outline-primary'>
          <Link to='/crop' style={{ color: "Whitesmoke", textDecoration: "none" }}>Suitable Crop</Link>
        </button>
      </div>

      <div
        className='p-4 mb-3 bg-warning text-white rounded'
        style={{ ...divStyle, backgroundImage: 'url(https://cdn.shopify.com/s/files/1/0004/7756/0883/files/fertilizer_soil_600x600.jpg?v=1636430972)' }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, {...divStyle, ...resetStyle})}
      >
        <h2>Fertilizer Prediction</h2>
        <p>Recommend the best fertilizers for optimal growth.</p>
        <button className='btn btn-outline-primary'>
          <Link to='/fertiliser' style={{ color: "Whitesmoke", textDecoration: "none" }}>Fertilizer Prediction</Link>
        </button>
      </div>

      <div
        className='p-4 mb-3 bg-danger text-dark rounded'
        style={{ ...divStyle, backgroundImage: 'url(https://theprofarmer.com/wp-content/uploads/2022/07/image-31.png)' }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, {...divStyle, ...resetStyle})}
      >
        <h2>Plant Disease Detection</h2>
        <p>Identify plant diseases from uploaded images.</p>
        <button className='btn btn-outline-primary'>
          <Link to='/plant' style={{ color: "Whitesmoke", textDecoration: "none" }}>Plant Disease</Link>
        </button>
      </div>

      <div
        className='p-4 mb-3 bg-info text-white rounded'
        style={{ ...divStyle, backgroundImage: 'url(https://www.farmersalmanac.com/wp-content/uploads/2020/11/garden-pests-japanese-beetle-F_24851439.jpg)' }}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, {...divStyle, ...resetStyle})}
      >
        <h2>Pest Detection</h2>
        <p>Detect common pests affecting crops.</p>
        <button className='btn btn-outline-primary'>
          <Link to='/pest' style={{ color: "Whitesmoke", textDecoration: "none" }}>Pest Detection</Link>
        </button>
      </div>
    </div>
  );
}

export default Home;
