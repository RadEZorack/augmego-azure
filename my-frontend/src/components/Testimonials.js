// src/components/Testimonials.js
import React from 'react';

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials">
      <h2>What Our Users Say</h2>
      <div className="testimonial-list">
        <div className="testimonial-item">
          <p>"This app is amazing!"</p>
          <p>- User 1</p>
        </div>
        <div className="testimonial-item">
          <p>"I love using this app every day."</p>
          <p>- User 2</p>
        </div>
        <div className="testimonial-item">
          <p>"Highly recommend to everyone."</p>
          <p>- User 3</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
