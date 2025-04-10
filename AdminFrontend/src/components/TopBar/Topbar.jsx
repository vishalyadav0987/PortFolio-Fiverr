import React from 'react';
import './Topbar.css';
import NotificationCenter from '../NotificationCenter/NotificationCenter';
import { MdAdminPanelSettings } from 'react-icons/md';

const Topbar = () => {
    return (
        <div className="topbar" style={{ background: "#18181f",alignItems:"center" }}>
            <h1>Dashboard</h1>
            <div className="actions" style={{
                display: "flex",
                alignItems: "center",
                gap:"0.7rem"
            }}>
                <NotificationCenter />
                <span style={{
                    display: "flex",
                    alignItems: "center",
                    gap:"6px"
                }}>
                    <MdAdminPanelSettings fontSize={"26px"} color='#5eead4' />
                   <span style={{
                    display: "flex",
                    alignItems: "center",
                    gap:"6px"
                }}> Admin</span>
                </span>
            </div>
        </div>
    );
};

export default Topbar;
