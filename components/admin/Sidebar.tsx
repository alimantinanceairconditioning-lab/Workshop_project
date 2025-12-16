"use client";
import React from "react";
import { FaTachometerAlt, FaTools, FaEnvelope, FaSignOutAlt, FaTimes, FaBars, FaImages, FaSearch } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to login page
        router.push("/admin/login");
      } else {
        // Still redirect to login even if API fails
        router.push("/admin/login");
      }
    } catch (error) {
      // Still redirect to login even if there's an error
      router.push("/admin/login");
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Services", icon: <FaTools />, path: "/admin/services" },
    { name: "Projects", icon: <FaImages />, path: "/admin/projects" },
    { name: "Contact Submissions", icon: <FaEnvelope />, path: "/admin/contacts" },
    { name: "SEO Settings", icon: <FaSearch />, path: "/admin/seo" },
    { name: "Page SEO", icon: <FaSearch />, path: "/admin/page-seo" },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-linear-to-b from-primaryBlue to-heroBlue text-white transition-all duration-300 ease-in-out z-30 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Close Button (Mobile) & Toggle Collapse (Desktop) */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white hover:text-accentYellow"
          >
            <FaTimes className="text-2xl" />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block text-white hover:text-accentYellow ml-auto"
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        {/* Admin Profile Section */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-12 h-12 rounded-full bg-accentYellow flex items-center justify-center shrink-0">
              <span className="text-primaryBlue font-bold text-xl">A</span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h3 className="font-semibold text-base truncate">Admin</h3>
                <p className="text-xs text-gray-300 truncate">alimantinanceairconditioning@gmail.com</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                title={isCollapsed ? item.name : ""}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                  isActive
                    ? "bg-accentYellow text-primaryBlue font-semibold"
                    : "text-white hover:bg-white/10"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button 
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ""}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-red-500 transition duration-200 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <FaSignOutAlt className="text-xl shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
