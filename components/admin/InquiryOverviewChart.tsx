"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface InquiryOverviewChartProps {
  stats: {
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}

const InquiryOverviewChart: React.FC<InquiryOverviewChartProps> = ({ stats }) => {
  const data = [
    { name: "Pending", value: stats.pending, fill: "#F59E0B" },
    { name: "In Progress", value: stats.inProgress, fill: "#3B82F6" },
    { name: "Completed", value: stats.completed, fill: "#10B981" },
    { name: "Cancelled", value: stats.cancelled, fill: "#EF4444" },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-primaryBlue mb-6 flex items-center gap-2">
        <span className="text-heroBlue">📈</span>
        Inquiry Overview
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              label={{
                value: "Number of Inquiries",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#6B7280", fontSize: 12 },
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              maxBarSize={80}
            >
              {data.map((entry, index) => (
                <Bar key={`bar-${index}`} dataKey="value" fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InquiryOverviewChart;
