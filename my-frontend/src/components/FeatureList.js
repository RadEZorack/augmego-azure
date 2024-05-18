// components/FeatureList.js

import FeatureItem from './FeatureItem';

const FeatureList = ({ features }) => {
  return (
    <div className="feature-list">
      {features.map((feature, index) => (
        <FeatureItem
          key={index}
          title={feature.title}
          description={feature.description}
          gifUrl={feature.gifUrl}
        />
      ))}
    </div>
  );
};

export default FeatureList;
