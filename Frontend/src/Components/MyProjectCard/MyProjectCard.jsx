import React from "react";
import "./MyProjectCard.css";
import { FaGithub, FaLink } from "react-icons/fa";


const MyProjectCard = ({ img, projectName, tech, description, liveLink, githubLink }) => {



  return (
    <div className="my-project-card">
      <img src={img} alt="Twitter Valentine" className="my-project-image" />
      <div className="my-project-content">
        <h3 className="my-project-title">{projectName}</h3>
        <p className="my-project-tech">
         {
          tech.map((tec,i)=>{
            return(
              <span key={i}>{tec}</span>
            )
          })
         }
        </p>
        <p className="my-project-description">
          {description}
        </p>
        <div className="my-project-links">
          <a href={liveLink} className="my-live-link" target="_blank" rel="noopener noreferrer"><FaLink /> Live</a>
          <a href={githubLink} className="my-github-link" target="_blank" rel="noopener noreferrer"><FaGithub /> GitHub</a>
        </div>
      </div>
    </div>
  );
};

export default MyProjectCard;
