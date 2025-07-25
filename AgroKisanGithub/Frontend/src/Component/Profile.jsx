import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function Profile() {
  const navigate = useNavigate();
  const [N, setN] = useState('');
  const [P, setP] = useState('');
  const [K, setK] = useState('');
  const [PH, setPH] = useState('');

  const setData = async () => {
    try {
      const result = await fetch("http://localhost:8080/addnpk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ N, P, K, PH })
      });

      const data = await result.json();
      console.log(data);
      localStorage.setItem('N',N);
      localStorage.setItem('P',P);
      localStorage.setItem('K',K);
      localStorage.setItem('PH',PH);
      navigate('/');
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Enter NPK and pH Data of your Soil</h2>

      <div className="mb-3">
        <label className="form-label">Nitrogen (N)</label>
        <input type="number" className="form-control" value={N} onChange={(e) => setN(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Phosphorus (P)</label>
        <input type="number" className="form-control" value={P} onChange={(e) => setP(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Potassium (K)</label>
        <input type="number" className="form-control" value={K} onChange={(e) => setK(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">pH Level</label>
        <input type="number" className="form-control" value={PH} onChange={(e) => setPH(e.target.value)} />
      </div>

      <button className="btn btn-primary" onClick={setData}>Submit</button>
    </div>
  );
}

export default Profile;
