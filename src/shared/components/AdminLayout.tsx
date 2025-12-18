import { Outlet } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";
import { Header } from "./layout/Header";

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
