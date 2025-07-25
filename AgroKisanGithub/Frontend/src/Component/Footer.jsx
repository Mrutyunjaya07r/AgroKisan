import React from "react";
import { Link } from "react-router";

function Footer() {
  return (
    <div>
      <div className="container">
        
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          
          <p className="col-md-4 mb-0 text-body-secondary">
            © 2025 Company, Inc
          </p>
          <a
            href="/"
            className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
            aria-label="Bootstrap"
          >
            
          </a>
          <ul className="nav col-md-4 justify-content-end">
            
            <li className="nav-item">
              <Link to="/" className="nav-link px-2 text-body-secondary">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/crop" className="nav-link px-2 text-body-secondary">
                Crops
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/weather" className="nav-link px-2 text-body-secondary">
                Weather
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/fertiliser" className="nav-link px-2 text-body-secondary">
                Fertiliser
              </Link>
            </li>
            <li className="nav-item">
              <a href="/aboutus" className="nav-link px-2 text-body-secondary">
                About
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
