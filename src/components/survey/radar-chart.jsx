"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function BurnoutRadarChart({ data }) {
  const chartData = data.map(item => ({
    subject: item.category,
    score: item.score,
    fullMark: 100,
  }));

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-center">Dimensional Analysis</h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#FFFFFF", fontSize: 16 }}
               
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload || !payload[0]) return null;
                return (
                  <div className="bg-gray-800 p-2 rounded-lg shadow-lg border">
                    <p className="font-medium">{payload[0].payload.subject}</p>
                    <p className="text-sm text-gray-500">
                      Score: {Math.round(payload[0].value)}%
                    </p>
                  </div>
                );
              }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#4F46E5" 
              fill="#4F46E5" 
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
