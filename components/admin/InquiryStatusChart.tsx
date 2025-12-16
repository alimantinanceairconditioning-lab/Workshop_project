"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface InquiryStatusChartProps {
  stats: {
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}

const InquiryStatusChart: React.FC<InquiryStatusChartProps> = ({ stats }) => {
  const total = stats.pending + stats.inProgress + stats.completed + stats.cancelled || 1;
  
  const data = [
    { name: "Pending", value: stats.pending, color: "#F59E0B" },
    { name: "In Progress", value: stats.inProgress, color: "#3B82F6" },
    { name: "Completed", value: stats.completed, color: "#10B981" },
    { name: "Cancelled", value: stats.cancelled, color: "#EF4444" },
  ];

  const COLORS = ["#F59E0B", "#3B82F6", "#10B981", "#EF4444"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value} ({((payload[0].value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-primaryBlue mb-6 flex items-center gap-2">
        <span className="text-heroBlue">📊</span>
        Inquiry Status Distribution
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-around gap-8">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Stats */}
        <div className="space-y-3">
          <div className="mb-4 text-center lg:text-left">
            <div className="text-3xl font-bold text-gray-800">{total}</div>
            <div className="text-sm text-gray-500">Total Inquiries</div>
          </div>
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4 min-w-[180px]">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 font-medium text-sm">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-bold">{item.value}</span>
                <span className="text-gray-500 text-xs">
                  ({((item.value / total) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InquiryStatusChart;
