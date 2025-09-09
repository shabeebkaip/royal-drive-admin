import { Outlet } from "react-router";

export default function AppRoute() {
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <Outlet />
    </div>
  );
}
