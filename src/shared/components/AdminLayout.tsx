import { Outlet } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";
import { usePushNotifications } from "../hooks/usePushNotifications";

export const AdminLayout = () => {
  usePushNotifications();

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden relative">
      <Sidebar />
      <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col relative z-0">
        <main className="flex-1 h-full overflow-y-auto p-4 md:p-6 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
