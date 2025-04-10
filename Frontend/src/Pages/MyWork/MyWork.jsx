import React, { useEffect, useState } from 'react'
import AboutMe from '../../Components/AboutMe/AboutMe'
import MyClientProject from '../../Components/MyClientProject/MyClientProject.jsx'
import './MyWork.css'
import axios from 'axios'
import toast from 'react-hot-toast'

const MyWork = ({ setDropdownOpen }) => {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchClientProject = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/v1/client/get-project');
        if (response.data.success) {
          setAllProjects(response.data.data)
        }

      } catch (error) {
        console.log(error)
        toast.error('Failed to fetch client project')
      } finally {
        setLoading(false);
      }
    }
    fetchClientProject();
  }, [])


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div id='MyWork' onClick={() => setDropdownOpen(false)}>
      <AboutMe />
      <MyClientProject  allProjects={allProjects} loading={loading} />
    </div>
  )
}

export default MyWork
