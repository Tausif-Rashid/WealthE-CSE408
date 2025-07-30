import React from 'react';
import { Link } from 'react-router';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* Header with Logo */}
        <header className="landing-header">
          <div className="logo">
            <img 
              src="/trending-up-svgrepo-com.svg" 
              alt="Trending Up" 
              className="logo-icon"
              width="40" 
              height="40"
            />
            <h1>WealthE</h1>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h3 className="hero-title">
              Take Control of Your<br/>
              <span className="highlight"> Financial Future</span>
            </h3>
            <p className="hero-description">
              WealthE is a financial and tax management platform. Track expenses, 
              manage income, calculate and pay taxes.
            </p>
            
            {/* Key Features */}
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🪙</div>
                <h3>Fincance Tracking</h3>
                <p>Get insights into your spending patterns</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💵</div>
                <h3>Tax Estimation</h3>
                <p>Estimate your tax liabilities with ease</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✨</div>
                <h3>AI Assistance</h3>
                <p>Get Answers on Your Tax Related queries</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="cta-section">
              <h3>Get started Today!</h3>
              <div className="cta-buttons">
                <Link to="/register" className="cta-button primary">
                  Sign Up
                </Link>
                <Link to="/login" className="cta-button secondary">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>&copy; 2025 WealthE. Your trusted financial companion.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
