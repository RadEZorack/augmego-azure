// src/components/Header.js
import React from 'react';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { assetPrefix } = publicRuntimeConfig;

const Header = () => {
  // console.log("Mailto link:", "mailto:support@augmego.com");

  return (
    <header>
      <nav>
        <ul>
          <li><span className="logo"><img src={`${assetPrefix}/icons/augmego-icon.webp`} alt="Augmego Logo" /></span></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="mailto:support@augmego.com">Contact</a></li>
          <li><a href="start/"><button className="cta">Get Started</button></a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
