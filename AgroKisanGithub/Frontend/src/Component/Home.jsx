import React from 'react';
import { Link } from 'react-router';

function Home() {
  const cardData = [
    {
      title: 'Weather Prediction',
      description: 'Predict future weather using advanced climate analysis.',
      image: 'https://wallpaperaccess.com/full/1540016.jpg',
      link: '/weather',
    },
    {
      title: 'Crop Suggestion',
      description: 'Get best-suited crop suggestions based on data.',
      image: 'https://wallpaperaccess.com/full/3543885.jpg',
      link: '/crop',
    },
    {
      title: 'Fertiliser Advisor',
      description: 'Use smart recommendations for ideal fertilisers.',
      image: 'https://cdn.shopify.com/s/files/1/0004/7756/0883/files/fertilizer_soil_600x600.jpg?v=1636430972',
      link: '/fertiliser',
    },
    {
      title: 'Plant Disease Detector',
      description: 'Upload images to detect plant issues instantly.',
      image: 'https://theprofarmer.com/wp-content/uploads/2022/07/image-31.png',
      link: '/plant',
    },
    {
      title: 'Pest Identifier',
      description: 'Find and classify crop pests through detection models.',
      image: 'https://www.farmersalmanac.com/wp-content/uploads/2020/11/garden-pests-japanese-beetle-F_24851439.jpg',
      link: '/pest',
    },
    {
      title: 'Set NPK',
      description: 'Here User can set the Nitrogen Phosphorus and Potassium of the soil.',
      image: 'https://5.imimg.com/data5/SELLER/Default/2023/11/360279509/DY/PX/YA/52915942/gg-500x500.jpg',
      link: '/profile',
    },
  ];

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 fw-bold">Explore Smart Agro Tools</h1>
      <div className="row g-4">
        {cardData.map((card, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <Link to={card.link} className="text-decoration-none">
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 255, 100, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                <div
                  style={{
                    height: '200px',
                    backgroundImage: `url(${card.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="p-4">
                  <h5 className="fw-bold text-dark">{card.title}</h5>
                  <p className="text-muted">{card.description}</p>
                  <span className="text-success fw-semibold">Explore →</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
