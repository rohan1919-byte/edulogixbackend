import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">About Us</h3>
            <p className="text-purple-100">
              EDULOGIX helps students manage and showcase their academic achievements,
              certifications, and internships in one place.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-purple-100 hover:text-white transition duration-150">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-purple-100 hover:text-white transition duration-150">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-purple-100 hover:text-white transition duration-150">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-purple-100 hover:text-white transition duration-150">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">Contact</h3>
            <ul className="space-y-2 text-purple-100">
              <li>Email: support@EDULOGIX.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 EDULOGIX Street</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-purple-700 mt-8 pt-8 text-center text-purple-200">
          <p>EDULOGIX</p> {/*@copy;{new Date().getFullYear()}*/}
        </div>
      </div>
    </footer>
  );
};

export default Footer; 