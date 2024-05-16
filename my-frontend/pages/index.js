import React, { useEffect } from 'react';
import Header from '../src/components/Header';
import Hero from '../src/components/Hero';
import Features from '../src/components/Features';
import Testimonials from '../src/components/Testimonials';
import Footer from '../src/components/Footer';

const HomePage = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceworker.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomePage;
