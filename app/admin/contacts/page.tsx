"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { FaEnvelope, FaUser, FaPhone, FaEye, FaTrash } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchContacts, updateContactStatus, deleteContact } from "@/lib/store/slices/contactsSlice";

const ContactsPage = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  
  const dispatch = useAppDispatch();
  const { contacts, loading, error } = useAppSelector((state) => state.contacts);

  // Verify authentication on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        
        if (!data.authenticated) {
          router.push("/admin/login?redirect=/admin/contacts");
          return;
        }
        
        setIsAuthenticating(false);
      } catch (error) {
        router.push("/admin/login?redirect=/admin/contacts");
      }
    };

    verifyAuth();
  }, [router]);

  // Fetch contacts on mount
  useEffect(() => {
    if (!isAuthenticating) {
      dispatch(fetchContacts());
    }
  }, [dispatch, isAuthenticating]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the inquiry from "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await dispatch(deleteContact(id)).unwrap();
      alert("✅ Contact deleted successfully!");
    } catch (error: any) {
      alert(`❌ Error: ${error}`);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string, name: string, currentStatus: string) => {
    // Prevent changes if already completed or cancelled
    if (currentStatus === "Completed" || currentStatus === "Cancelled") {
      alert("⚠️ Cannot change status of Completed or Cancelled inquiries!");
      return;
    }

    try {
      await dispatch(updateContactStatus({ id, status: newStatus })).unwrap();
    } catch (error: any) {
      alert(`❌ Error: ${error}`);
      // Refresh to revert UI on error
      dispatch(fetchContacts());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
                <h1 className="text-2xl md:text-3xl font-bold text-primaryBlue">Contact Submissions</h1>
                <p className="text-sm text-gray-600 mt-1">View and manage customer inquiries</p>
              </div>
            </div>
          </div>
        </header>

        {/* Contacts Content */}
        <main className="p-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Contacts Yet</h3>
              <p className="text-gray-500">Contact submissions will appear here</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primaryBlue text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Service Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Message</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-heroBlue" />
                            <span className="font-medium text-gray-900">{contact.fullName || `${contact.firstName} ${contact.lastName}`}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {contact.serviceType}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaPhone className="text-xs" />
                              <span>{contact.phoneNumber}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs">
                          <p className="truncate">{contact.message}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <select
                              value={contact.status}
                              onChange={(e) => handleStatusChange(contact._id, e.target.value, contact.fullName || `${contact.firstName} ${contact.lastName}`, contact.status)}
                              disabled={contact.status === "Completed" || contact.status === "Cancelled"}
                              className={`px-3 py-1 rounded-full text-xs font-semibold outline-none transition-all border-2 border-transparent ${
                                contact.status === "Completed" || contact.status === "Cancelled"
                                  ? "cursor-not-allowed opacity-60 bg-gray-100"
                                  : "cursor-pointer hover:border-primaryBlue"
                              } ${getStatusColor(contact.status)}`}
                              title={contact.status === "Completed" || contact.status === "Cancelled" ? "Status is locked and cannot be changed" : "Click to change status"}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            {(contact.status === "Completed" || contact.status === "Cancelled") && (
                              <span className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-gray-400" title="Locked">
                                🔒
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleDelete(contact._id, contact.fullName || `${contact.firstName} ${contact.lastName}`)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete inquiry"
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

export default ContactsPage;
