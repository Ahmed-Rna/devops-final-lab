import React from 'react'
import '../styles/Home.css'

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to MediCare</h1>
        <p>Your trusted online pharmacy for quality medicines</p>
        <button className="cta-button">Shop Now</button>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🏥 Quality Assured</h3>
          <p>All medicines are verified and quality-checked</p>
        </div>
        <div className="feature-card">
          <h3>🚚 Fast Delivery</h3>
          <p>Quick delivery to your doorstep</p>
        </div>
        <div className="feature-card">
          <h3>💰 Affordable Prices</h3>
          <p>Best prices for all your medical needs</p>
        </div>
        <div className="feature-card">
          <h3>📞 Customer Support</h3>
          <p>24/7 support for your queries</p>
        </div>
      </section>

      <section className="info">
        <h2>About MediCare</h2>
        <p>
          MediCare is your one-stop solution for all pharmaceutical needs. 
          We provide a wide range of medicines, supplements, and health products 
          sourced from certified manufacturers. Our mission is to make quality 
          healthcare accessible and affordable for everyone.
        </p>
      </section>
    </div>
  )
}

export default Home
