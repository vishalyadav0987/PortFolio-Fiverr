import React, { useState, useEffect } from 'react';
import './ProjectManagementTable.css';
import { FiEdit, FiTrash2, FiEye, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ProjectManagementTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8;

  // Sample data - replace with API call in real implementation
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Simulate API call
        const response = await axios.get('/api/v1/client/get-project')
        setTimeout(() => {
    

          if (response.data.success) {
            setProjects(response.data.data);
            setLoading(false);
          }
        }, 1000);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  
  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  console.log(currentProjects);


  // Handle project deletion
  const handleDelete = async (projectId) => {
    try {
      const response = await axios.delete(`/api/v1/client/delete-project/${projectId}`);
      if (response.data.success) {
        toast.success(response.data.message)
        setProjects(projects.filter(project => project._id !== projectId));
      }

    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error('Error deleting project');
    }

  };



  // Type badge component
  const TypeBadge = ({ type }) => {
    const typeMap = {
      Web: {
        text: 'Web',
        backgroundColor: '#1e1b4b',  // bg-purple-900
        textColor: '#c4b5fd'        // text-purple-300
      },
      Ecommerce: {
        text: 'Ecommerce',
        backgroundColor: '#1e1b4b',  // bg-indigo-900
        textColor: '#a5b4fc'        // text-indigo-300
      },
      Bussiness: {
        text: 'Bussiness',
        backgroundColor: '#164e63',  // bg-cyan-900
        textColor: '#67e8f9'        // text-cyan-300
      },
      PortFolio: {
        text: 'PortFolio',
        backgroundColor: '#1e3a8a',  // bg-blue-900
        textColor: '#93c5fd'        // text-blue-300
      },
      Embedded: {
        text: 'Embedded',
        backgroundColor: '#78350f',  // bg-amber-900
        textColor: '#fcd34d'        // text-amber-300
      },
      LandingPage: {
        text: 'Landing Page',
        backgroundColor: '#374151',  // bg-gray-700
        textColor: '#d1d5db'        // text-gray-300
      }
    };


    const { text, backgroundColor, textColor } = typeMap[type];

    return (
      <span
        style={{
          display: "inline-block",
          padding: "3px 6px",
          fontSize: "0.8rem",
          borderRadius: "0.25rem",
          backgroundColor,
          color: textColor
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <div className="project-management-container">
      <div className="header-section">
        <h1 className="page-title">Manage Projects</h1>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading projects...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th className="w-12">ID</th>
                  <th>Project Title</th>
                  <th>Type</th>
                  <th>Technologies</th>
                  <th>Timeframe</th>
                  <th>Price Range</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects && currentProjects?.length > 0 ? (
                  
                  currentProjects?.map((project) => (
                    <tr key={project.id}>
                      <td>#{project._id?.toString().slice(-6)}</td>
                      <td className="project-title">{project.title}</td>
                      <td><TypeBadge type={project?.type} /></td>
                      <td>
                        <div className="tech-tags">
                          {project.tech.slice(0, 3).map((tech, index) => (
                            <span key={index} className="tech-tag">{tech}</span>
                          ))}
                          {project.tech.length > 3 && (
                            <span className="tech-tag-more">+{project.tech.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="timeframe">
                          <div>{new Date(project.timeframe.start).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">to</div>
                          <div>{new Date(project.timeframe.end).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td>
                        ₹{project.priceRange.min.toLocaleString()} - ₹{project.priceRange.max.toLocaleString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="view-btn" title="View">
                            <FiEye />
                          </button>
                         <Link to={`/update-project/${project?._id}`}>
                         <button className="edit-btn" 
                          title="Edit"
                          >
                            <FiEdit />
                          </button>
                         </Link>
                          <button
                            className="delete-btn"
                            title="Delete"
                            onClick={() => handleDelete(project?._id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-projects">
                      No projects found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredProjects.length > projectsPerPage && (
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <FiChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectManagementTable;