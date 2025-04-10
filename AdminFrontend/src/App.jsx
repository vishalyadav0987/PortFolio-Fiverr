import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import UsersList from "./components/UsersList/UsersList";
import ReviewsFeedback from "./components/ReviewsFeedback/ReviewsFeedback";
import CreateGig from "./pages/CreateGig/CreateGig";
import "./App.css";
import AllGigs from "./pages/AllGigs/AllGigs";
import { Toaster } from 'react-hot-toast'
import ChatPage from "./pages/ChatPage/ChatPage";
import OrderDetailsAdmin from "./pages/OrderDetailsAdmin/OrderDetailsAdmin";
import AdminOrderList from "./pages/AdminOrderList/AdminOrderList";
import Notify from "./pages/Notify/Notify";
import UpdateGig from "./pages/UpdateGig/UpdateGig";
import AddProjectForm from "./pages/AddProjectForm/AddProjectForm";
import ProjectManagementTable from "./pages/ProjectManagementTable/ProjectManagementTable";
import UpdateProjectForm from "./components/UpdateProjectForm/UpdateProjectForm";



function App() {
  const location = useLocation();
  return (
    <div className="admin-container">
      <Toaster position="top-right"
        toastOptions={{ className: 'toaster' }}
      />
      <Sidebar />
      <div className="main-content">
        {
          location.pathname !== '/chat-page' && (
            <Topbar />
          )
        }
        <div className="page-content" style={{
          padding: `${location.pathname === '/chat-page' ? "0" : "20px"}`
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/reviews" element={<ReviewsFeedback />} />
            <Route path="/create-gig" element={<CreateGig />} />
            <Route path="/all-gig" element={<AllGigs />} />
            <Route path="/chat-page" element={<ChatPage />} />
            <Route path="/manage-orderlist" element={<AdminOrderList />} />
            <Route path="/manage-order/:orderId" element={<OrderDetailsAdmin />} />
            <Route path="/notify-page" element={<Notify />} />
            <Route path="/update-gig/:id" element={<UpdateGig />} />
            <Route path="/add-project" element={<AddProjectForm />} />
            <Route path="/all-project" element={<ProjectManagementTable />} />
            <Route path="/update-project/:id" element={<UpdateProjectForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
