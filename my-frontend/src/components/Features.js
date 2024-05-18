// components/Features.js
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { assetPrefix } = publicRuntimeConfig;

import FeatureList from './FeatureList';

const Features = () => {
  const features = [
    { title: 'PWA', description: 'A PWA (Progressive Web App) can be installed on your computer or mobile device for better performance and ease of access.', gifUrl: `${assetPrefix}/featureGifs/augmegoInstall.gif` },
    { title: 'Feature 2', description: 'Description of feature 2.' },
    { title: 'Feature 3', description: 'Description of feature 3.' },
  ];

  return (
    <section id="features" className="features">
      <h2>Features</h2>
      <FeatureList features={features} />
    </section>
  );
};

export default Features;
