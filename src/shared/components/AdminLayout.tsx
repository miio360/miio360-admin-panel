import { Outlet } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";
import { MobileHeader } from "./layout/MobileHeader";

export const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileHeader />
        <main className="flex-1 h-full overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
