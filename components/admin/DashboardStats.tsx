"use client";
import React from "react";
import { FaTools, FaEnvelope, FaClock, FaCheckCircle } from "react-icons/fa";

interface DashboardStatsProps {
  stats: {
    totalServices: number;
    totalInquiries: number;
    pending: number;
    completed: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: "Total Services",
      value: stats.totalServices.toString(),
      icon: <FaTools className="text-3xl" />,
      bgColor: "bg-white",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
      borderColor: "border-l-4 border-blue-500",
    },
    {
      title: "Total Inquiries",
      value: stats.totalInquiries.toString(),
      icon: <FaEnvelope className="text-3xl" />,
      bgColor: "bg-white",
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50",
      borderColor: "border-l-4 border-purple-500",
    },
    {
      title: "Pending Requests",
      value: stats.pending.toString(),
      icon: <FaClock className="text-3xl" />,
      bgColor: "bg-white",
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-50",
      borderColor: "border-l-4 border-yellow-500",
    },
    {
      title: "Completed",
      value: stats.completed.toString(),
      icon: <FaCheckCircle className="text-3xl" />,
      bgColor: "bg-white",
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
      borderColor: "border-l-4 border-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} ${stat.borderColor} rounded-lg shadow-md hover:shadow-xl p-6 transform hover:scale-105 transition duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.iconBg} p-4 rounded-lg`}>
              <div className={stat.iconColor}>{stat.icon}</div>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
            <h3 className="text-4xl font-bold text-gray-800">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
