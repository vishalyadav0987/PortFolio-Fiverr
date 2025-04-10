import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, MessageSquare, FilePlus } from "lucide-react";
import "./Sidebar.css";
import { MdAddBox, MdBorderAll, MdMessage, MdPanTool, MdProductionQuantityLimits } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import VyIcon from "../VyIcon/VyIcon";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo" style={{
        paddingLeft:"0px"
      }}>
        <VyIcon />
      </h2>
      <nav>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} end>
          <button>
            <Home /> Dashboard
          </button>
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => (isActive ? "active" : "")}>
          <button>
            <Users /> Users List
          </button>
        </NavLink>
        <NavLink to="/reviews" className={({ isActive }) => (isActive ? "active" : "")}>
          <button>
            <MessageSquare /> Reviews
          </button>
        </NavLink>
        <NavLink to="/create-gig" className={({ isActive }) => (isActive ? "active" : "")}>
          <button>
            <FilePlus /> Create Gig
          </button>
        </NavLink>
        <NavLink to="/all-gig" className={({ isActive }) => (isActive ? "active" : "")}>
          <button>
            <MdBorderAll fontSize={"24px"} /> All Gig
          </button>
        </NavLink>
        <NavLink to="/chat-page" className={({ isActive }) => (isActive ? "active" : "")}>
          <button>
            <MdMessage fontSize={"24px"}/> Customer Support
          </button>
        </NavLink>
        <NavLink to="/manage-orderlist" className={({ isActive }) => (isActive ? "active" : "")}>
          <button>
            <MdProductionQuantityLimits fontSize={"24px"}/> Manage Order
          </button>
        </NavLink>
        <NavLink to="/add-project" className={({ isActive }) => (isActive ? "active" : "")}>
          <button>
            <MdAddBox fontSize={"24px"}/> Add Project
          </button>
        </NavLink>
        <NavLink to="/all-project" className={({ isActive }) => (isActive ? "active" : "")}>
          <button>
            <MdPanTool fontSize={"24px"}/> Manage Project
          </button>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
