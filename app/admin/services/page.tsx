"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AddServiceModal from "@/components/admin/AddServiceModal";
import { FaTools, FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchServices, addService, deleteService, updateServiceStatus } from "@/lib/store/slices/servicesSlice";

const ServicesPage = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  
  const dispatch = useAppDispatch();
  const { services, loading, error } = useAppSelector((state) => state.services);

  // Verify authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        
        if (!data.authenticated) {
          router.push("/admin/login?redirect=/admin/services");
          return;
        }
        
        setIsAuthenticating(false);
      } catch (error) {
        router.push("/admin/login?redirect=/admin/services");
      }
    };

    verifyAuth();
  }, [router]);

  // Fetch services on mount
  useEffect(() => {
    if (!isAuthenticating) {
      dispatch(fetchServices());
    }
  }, [dispatch, isAuthenticating]);

  const handleAddService = async (formData: FormData) => {
    try {
      await dispatch(addService(formData)).unwrap();
      setIsModalOpen(false);
    } catch (error: any) {
      alert(`Error: ${error}`);
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await dispatch(deleteService(id)).unwrap();
      alert("✅ Service deleted successfully!");
    } catch (error: any) {
      alert(`❌ Error: ${error}`);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    
    if (!confirm(`Change status of "${name}" to ${newStatus}?`)) {
      return;
    }

    try {
      await dispatch(updateServiceStatus({ id, status: newStatus })).unwrap();
    } catch (error: any) {
      alert(`❌ Error: ${error}`);
    }
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
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-primaryBlue"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primaryBlue">Services</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your services</p>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-accentYellow text-primaryBlue px-4 py-2 rounded-lg font-semibold hover:bg-primaryBlue hover:text-accentYellow transition"
            >
              <FaPlus />
              <span className="hidden sm:inline">Add Service</span>
            </button>
          </div>
        </header>

        {/* Add Service Modal */}
        <AddServiceModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddService}
        />

        {/* Services Content */}
        <main className="p-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaTools className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Services Yet</h3>
              <p className="text-gray-500 mb-6">Start by adding your first service</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-accentYellow text-primaryBlue px-6 py-3 rounded-lg font-semibold hover:bg-primaryBlue hover:text-accentYellow transition"
              >
                <FaPlus />
                Add First Service
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primaryBlue text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Service Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.name}
                              className="w-16 h-16 object-cover rounded-lg shadow"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FaTools className="text-gray-400 text-2xl" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaTools className="text-heroBlue" />
                            <span className="font-medium text-gray-900">{service.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-md">{service.shortDescription }</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            service.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {service.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleToggleStatus(service._id, service.status, service.name)}
                              className={`p-2 rounded transition ${
                                service.status === "Active"
                                  ? "text-green-600 hover:bg-green-50"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                              title={`Toggle to ${service.status === "Active" ? "Inactive" : "Active"}`}
                            >
                              {service.status === "Active" ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                            </button>
                            <button 
                              onClick={() => handleDeleteService(service._id, service.name)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete service"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ServicesPage;
