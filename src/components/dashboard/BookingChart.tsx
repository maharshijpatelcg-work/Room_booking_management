"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface BookingChartProps {
  monthlyData: Array<{ month: string; count: number }>;
  categoryData: Array<{ category: string; count: number }>;
  statusData?: Record<string, number>;
  totalResources?: number;
  availableResources?: number;
}

const PALETTE = [
  "#0F766E", // Teal primary
  "#1B1A2E", // Dark ink
  "#55536B", // Muted slate
  "#0B5F58", // Deep teal
  "#D97706", // Amber
  "#64748B", // Slate
  "#0284C7", // Sky blue
];

export default function BookingChart({
  monthlyData,
  categoryData,
  statusData = {},
  totalResources = 0,
  availableResources = 0,
}: BookingChartProps) {
  const formattedMonthly = monthlyData.map((d) => {
    const [y, m] = d.month.split("-");
    const dateObj = new Date(Number(y), Number(m) - 1, 1);
    return {
      ...d,
      monthName: dateObj.toLocaleDateString("en-US", { month: "short" }),
    };
  });

  const bookedResources = Math.max(0, totalResources - availableResources);
  const availabilityData = [
    { name: "Available in Stock", value: availableResources, color: "#0F766E" },
    { name: "Currently Booked / Issued", value: bookedResources, color: "#55536B" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Monthly Booking Trends (Bar Chart) - 7 cols */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E2DA]/50">
          <div>
            <h3 className="text-sm font-bold text-[#1B1A2E]">
              Monthly Reservation Volume
            </h3>
            <p className="text-xs text-[#55536B] mt-0.5">
              Equipment reservations recorded over past 6 months
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E3F2EF] text-[#0B5F58]">
            Timeline
          </span>
        </div>

        {formattedMonthly.length === 0 ? (
          <div className="h-60 flex items-center justify-center text-[#55536B] text-xs italic">
            No booking trend history recorded yet
          </div>
        ) : (
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedMonthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DA" vertical={false} />
                <XAxis
                  dataKey="monthName"
                  tick={{ fontSize: 11, fill: "#55536B" }}
                  axisLine={{ stroke: "#E4E2DA" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#55536B" }}
                  axisLine={{ stroke: "#E4E2DA" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E4E2DA",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "#F4F3EF" }}
                />
                <Bar
                  dataKey="count"
                  fill="#0F766E"
                  radius={[6, 6, 0, 0]}
                  name="Bookings"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Category Distribution (Donut Chart) - 5 cols */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E2DA]/50">
          <div>
            <h3 className="text-sm font-bold text-[#1B1A2E]">
              Resources by Category
            </h3>
            <p className="text-xs text-[#55536B] mt-0.5">
              Inventory share across campus departments
            </p>
          </div>
        </div>

        {categoryData.length === 0 ? (
          <div className="h-60 flex items-center justify-center text-[#55536B] text-xs italic">
            No category metrics cataloged
          </div>
        ) : (
          <div className="h-60 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="category"
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PALETTE[index % PALETTE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E4E2DA",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={7}
                  formatter={(val: string) => (
                    <span className="text-[11px] text-[#55536B]">{val}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
