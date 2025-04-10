import React from 'react';
import './ProjectModal.css';
import { useRef } from 'react';
import { useEffect } from 'react';

const ProjectModal = ({ setModal, allProjects, projectId }) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  const onClose = () => {
    setModal(false);
  }
  const filterprojectbyId = allProjects && allProjects?.filter(project => project._id === projectId);
  const project = filterprojectbyId && filterprojectbyId[0];


  useEffect(() => {
    // Animation on mount
    if (modalRef.current && backdropRef.current) {
      backdropRef.current.style.opacity = '0';
      modalRef.current.style.transform = 'translateY(20px)';
      modalRef.current.style.opacity = '0';

      setTimeout(() => {
        backdropRef.current.style.transition = 'opacity 0.3s ease-out';
        modalRef.current.style.transition = 'all 0.3s ease-out';
        backdropRef.current.style.opacity = '1';
        modalRef.current.style.transform = 'translateY(0)';
        modalRef.current.style.opacity = '1';
      }, 10);
    }

    return () => {
      // Cleanup animations
      if (modalRef.current && backdropRef.current) {
        backdropRef.current.style.transition = '';
        modalRef.current.style.transition = '';
      }
    };
  }, []);

  const handleClose = () => {
    if (modalRef.current && backdropRef.current) {
      backdropRef.current.style.transition = 'opacity 0.3s ease-out';
      modalRef.current.style.transition = 'all 0.3s ease-out';
      backdropRef.current.style.opacity = '0';
      modalRef.current.style.transform = 'translateY(20px)';
      modalRef.current.style.opacity = '0';

      setTimeout(onClose, 300);
    } else {
      onClose();
    }
  };
  return (
    <div className="modal-modal-backdrop" ref={backdropRef}>
      <div className="modal-project-modal" ref={modalRef}>
        {/* Header with image, name, and close button */}
        <div className="modal-modal-header">
          <div className="modal-user-info">
            <img
              src="http://res.cloudinary.com/du6ukwxhb/image/upload/v1742047691/avatars/ng5crl4qk4gv3vej2rns.webp"
              alt="User"
              className="modal-user-avatar"
            />
            <span className="modal-username">Vishal Yadav</span>
          </div>
          <button style={{
            width: "fit-content"
          }} onClick={handleClose} className="modal-close-btn">
            &times;
          </button>
        </div>
        <div className='modal-content-part'>
          {/* Date and contact button */}
          <div className="modal-meta-info">
            <span className="modal-date">Posted:  {new Date(project?.timeframe.start).toISOString().split('T')[0]}</span>
            <button style={{
              width: "fit-content"
            }} className="modal-contact-btn">Contact</button>
          </div>

          {/* Project title and description */}
          <div className="modal-project-content">
            <h2 className="modal-project-title">{project?.title}</h2>
            <p className="modal-project-description">
              {project?.desc}
            </p>
          </div>

          {/* Project details in single line */}
          <div className="modal-project-details">
            <div className="modal-detail-item">
              <span className="modal-detail-label">Price range</span>
              <span className="modal-detail-value">₹{project?.priceRange.min}-₹{project?.priceRange.max}</span>
            </div>
            <div className="modal-detail-item">
              <span className="modal-detail-label">Project duration</span>
              <span className="modal-detail-value">1{
                (new Date(project?.timeframe.start) - new Date(project?.timeframe.end)) / (1000 * 60 * 60 * 24)
              } days</span>
            </div>
            <div className="modal-detail-item">
              <span className="modal-detail-label">Industries</span>
              <span className="modal-detail-value">{project?.type}</span>
            </div>
          </div>

          {/* Full width image */}
          <div className="modal-project-image">
            <img
              src={project?.img}
              alt="Ecommerce Website"
            />
          </div>

          {/* Project category and tags */}
          <div className="modal-project-footer">
            <h6 className="modal-project-category">TECH Development</h6>
            <div className="modal-skill-tags">
              {project?.tech?.map((tech) => (
                <span key={tech} className="modal-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;