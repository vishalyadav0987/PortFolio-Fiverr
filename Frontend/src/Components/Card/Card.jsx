import React from "react";
import "./Card.css";

const Card = ({ svgs ,heading }) => {
  return (
    <div className="card">
      <h3 className="card-title">{heading}</h3>
      <div className="card-grid">
        {svgs.map((tool, index) => (
          <div key={index} className="card-item">
            <span className="" dangerouslySetInnerHTML={{ __html: tool.icon }}></span>
            <span className="">{tool.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
