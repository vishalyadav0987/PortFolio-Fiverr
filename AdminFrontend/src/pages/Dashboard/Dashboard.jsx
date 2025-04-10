import React, { useState } from "react";
import "./Dashboard.css";
import { FaMoon, FaSun, FaUsers, FaStar, FaCode, FaDollarSign } from "react-icons/fa";
import { Bar, Doughnut, Pie, Radar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { motion } from "framer-motion";
import { FaRupeeSign } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa";
import { useOrderContext } from "../../Context/OrderContext";
import useFetchAllReview from '../../CustomHook/useFetchAllReview'
import useFetchAllOrder from '../../CustomHook/useFetchAllOrder'
import useFetchAllUser from '../../CustomHook/useFetchAllUser'
import Numeral from 'react-numeral';
import { useUserContext } from "../../Context/UserContext";


const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { allReviews, totalEarnPayment,allOrder } = useOrderContext();
  const { allRegisteredUser } = useUserContext();

  /*-----------Get all reviews of a gig-----------*/
  useFetchAllReview();
  useFetchAllOrder()
  useFetchAllUser()
  /*-----------Get all reviews of a gig-----------*/



  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      {/* Topbar */}


      {/* Dashboard Content */}
      <motion.section
        className="dashboard-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="stats-grid">
          {[
            { title: "Users", value: `${allRegisteredUser?.length}`, icon: <FaUsers /> },
            { title: "Reviews", value: allReviews?.length, icon: <FaStar /> }, // ✅
            { title: "Tech Insights", value: "89%", icon: <FaCode /> }, // ✅
            { title: "Projects", value: `${8+4+allOrder?.length}+`, icon: <FaProjectDiagram /> }, // ✅
            { title: "Income", value: `${totalEarnPayment}`, icon: <FaRupeeSign /> }, // ✅
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08, rotate: 2 }}
              className="stat-card"
            >
              <div className="stat-icon">{stat.icon}</div>
              <h2>{stat.title}</h2>
              <p>{stat.title === "Income" && "₹"}{
                stat.title !== "Tech Insights" ? (
                  <Numeral
                    value={stat.value}
                    format={"0,0"}
                  />
                ) : (stat.value)}
                {(stat.title === "Projects") && '+'}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="charts">
          <motion.div
            className="bar-chart"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >

            <Bar
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                  label: "Users",
                  data: [10, 20, 40, 10, 34, 12, 15, 12, 65, 54, 11, 54],
                  backgroundColor: [
                    "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFC300", "#DAF7A6",
                    "#581845", "#900C3F", "#C70039", "#FF5733", "#1ABC9C", "#2ECC71"
                  ],
                  borderColor: "#ffffff",
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    ticks: { color: "#ffffff" }, // X-axis text color
                    grid: { color: "rgba(255, 255, 255, 0.2)" }
                  },
                  y: {
                    ticks: { color: "#ffffff" },
                    grid: { color: "rgba(255, 255, 255, 0.2)" }
                  }
                },
                plugins: {
                  legend: { labels: { color: "#ffffff" } } // Legend text color
                }
              }}
            />

          </motion.div>
          <motion.div
            className="pie-chart"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* <Pie
              data={{
                labels: ["React.js", "MERN", "HTML&CSS", "Node.js", "WordPress"],
                datasets: [{ data: [25, 30, 10, 30, 5], backgroundColor: ["#58c4dc", "#00ee64", "#244bde", "#77ad65", "#01a9db"] }]
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            /> */}
            {/* <Doughnut
  data={{
    labels: ["React.js", "MERN", "HTML&CSS", "Node.js", "WordPress"],
    datasets: [{ data: [25, 30, 10, 30, 5], backgroundColor: ["#58c4dc", "#00ee64", "#244bde", "#77ad65", "#01a9db"] }]
  }}
  options={{ responsive: true, maintainAspectRatio: false }}
/> */}
            {/* <Bar
  data={{
    labels: ["React.js", "MERN", "HTML&CSS", "Node.js", "WordPress"],
    datasets: [{ label: "Tech Usage", data: [25, 30, 10, 30, 5], backgroundColor: "#00ee64" }]
  }}
  options={{ responsive: true, maintainAspectRatio: false }}
/> */}

            <Radar
              data={{
                labels: ["React.js", "MERN", "HTML&CSS", "Node.js", "WordPress"],
                datasets: [{
                  label: "Tech Popularity",
                  data: [25, 30, 10, 30, 5],
                  backgroundColor: "rgba(0, 238, 100, 0.4)",
                  borderColor: "#00ee64",
                  pointBackgroundColor: "#fff",
                  pointBorderColor: "#00ee64"
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    grid: { color: "rgba(255, 255, 255, 0.2)" }, // ग्रिड को हल्का व्हाइट करने के लिए
                    angleLines: { color: "rgba(255, 255, 255, 0.5)" }, // रेडियल लाइन्स व्हाइट
                    ticks: { color: "#ffffff", backdropColor: "rgba(0,0,0,0)" }, // वैल्यूज़ व्हाइट और बैकग्राउंड हटा दिया
                    pointLabels: { color: "#ffffff" } // टेक्स्ट लेबल्स को व्हाइट किया
                  }
                },
                plugins: {
                  legend: { labels: { color: "#ffffff" } } // लेजेंड टेक्स्ट व्हाइट
                }
              }}
            />

          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;
