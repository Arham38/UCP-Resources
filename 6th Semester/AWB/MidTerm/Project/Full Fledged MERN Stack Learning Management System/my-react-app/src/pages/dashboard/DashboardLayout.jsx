import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const DashboardLayout = ({ sidebarItems }) => (
  <div className="d-flex">
    <Sidebar items={sidebarItems} />
    <main className="flex-grow-1 p-4 bg-background" style={{ minHeight: '100vh' }}>
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
