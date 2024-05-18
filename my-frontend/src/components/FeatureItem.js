// components/FeatureItem.js

const FeatureItem = ({ title, description, gifUrl }) => {
    return (
      <div className="feature-item">
        <h3>{title}</h3>
        <p>{description}</p>
        {gifUrl && <img src={gifUrl} alt={`${title} GIF`} />}
      </div>
    );
  };
  
  export default FeatureItem;
  