"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import DashboardStats from "@/components/admin/DashboardStats";
import InquiryStatusChart from "@/components/admin/InquiryStatusChart";
import InquiryOverviewChart from "@/components/admin/InquiryOverviewChart";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchServices } from "@/lib/store/slices/servicesSlice";
import { fetchContacts } from "@/lib/store/slices/contactsSlice";

const DashboardPage = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  
  const dispatch = useAppDispatch();
  const { services, loading: servicesLoading } = useAppSelector((state) => state.services);
  const { contacts, loading: contactsLoading } = useAppSelector((state) => state.contacts);
  
  const loading = servicesLoading || contactsLoading;

  // Verify authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        
        if (!data.authenticated) {
          router.push("/admin/login?redirect=/admin/dashboard");
          return;
        }
        
        setIsAuthenticating(false);
      } catch (error) {
        router.push("/admin/login?redirect=/admin/dashboard");
      }
    };

    verifyAuth();
  }, [router]);

  // Fetch data from APIs using Redux
  useEffect(() => {
    if (!isAuthenticating) {
      dispatch(fetchServices());
      dispatch(fetchContacts());
    }
  }, [dispatch, isAuthenticating]);

  // Calculate stats from Redux state
  const stats = {
    totalServices: services.length,
    totalInquiries: contacts.length,
    pending: contacts.filter((c: any) => c.status === "Pending").length,
    completed: contacts.filter((c: any) => c.status === "Completed").length,
    inProgress: contacts.filter((c: any) => c.status === "In Progress").length,
    cancelled: contacts.filter((c: any) => c.status === "Cancelled").length,
  };

  // Show loading while authenticating
  if (isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-primaryBlue"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primaryBlue">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back, Admin!
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <DashboardStats stats={stats} />

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inquiry Status Distribution - Pie Chart */}
                <InquiryStatusChart stats={stats} />

                {/* Inquiry Overview - Bar Chart */}
                <InquiryOverviewChart stats={stats} />
              </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
