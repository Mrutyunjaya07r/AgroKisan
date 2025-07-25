import React from 'react';
import { Link, useNavigate } from 'react-router';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('AgroKisan');

  const logout = () => {
    localStorage.removeItem('AgroKisan');
    navigate('/signin');
  };

  return (
    <header className="bg-white shadow-sm sticky-top">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <img
            src="https://admin.agrokisan.co.in/Images/logo.png"
            alt="AgroKisan"
            style={{ height: '50px', width: 'auto' }}
            className="me-2"
          />
          <span className="fs-4 fw-bold text-success">AgroKisan</span>
        </Link>

        <nav className="d-flex gap-4">
          <NavLink to="/" label="Home" />
          <NavLink to="/weather" label="Weather" />
          <NavLink to="/crop" label="Crop" />
          <NavLink to="/fertiliser" label="Fertiliser" />
          <NavLink to="/plant" label="Plant Disease" />
          <NavLink to="/pest" label="Pest" />
          <NavLink to="/profile" label="NPK" />
          <NavLink to="/aboutus" label="Aboutus" />
        </nav>

        <div className="d-flex align-items-center gap-2">
          {isLoggedIn ? (
            <button className="btn btn-danger px-3 py-1" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/signin" className="btn btn-primary px-3 py-1">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary px-3 py-1">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="text-success text-decoration-none fw-medium"
      style={{
        position: 'relative',
        padding: '4px 0',
        transition: 'color 0.3s',
      }}
    >
      {label}
    </Link>
  );
}

export default Navbar;
