import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';

interface ProgressChartProps {
  data: {
    weeklyProgress?: Array<{
      week: string;
      completed: number;
      timeSpent: number;
      score: number;
    }>;
    subjectPerformance?: Array<{
      subject: string;
      score: number;
      average: number;
      target: number;
    }>;
    gradeDistribution?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    attendanceData?: Array<{
      date: string;
      present: boolean;
      late?: boolean;
    }>;
  };
  type: 'weekly' | 'subjects' | 'distribution' | 'attendance';
  title?: string;
  showControls?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  type,
  title,
  showControls = true
}) => {
  const [timeRange, setTimeRange] = React.useState('30d');
  const [chartType, setChartType] = React.useState<'area' | 'bar' | 'line'>('area');

  // Time range options for select
  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'year', label: 'This year' }
  ];

  // Chart type options for select
  const chartTypeOptions = [
    { value: 'area', label: 'Area' },
    { value: 'bar', label: 'Bar' },
    { value: 'line', label: 'Line' }
  ];

  // Custom label renderer for pie charts
  const renderPieLabel = (entry: any) => {
    const percent = entry.percent;
    if (percent === undefined) return entry.name;
    return `${entry.name}: ${(percent * 100).toFixed(0)}%`;
  };

  const renderAttendanceLabel = (entry: any) => {
    const percent = entry.percent;
    if (percent === undefined) return entry.name;
    return `${entry.name}: ${(percent * 100).toFixed(1)}%`;
  };

  const renderWeeklyChart = () => {
    const chartData = data.weeklyProgress || [];

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="completed" fill="#3b82f6" name="Completed Lessons" />
            <Bar yAxisId="right" dataKey="timeSpent" fill="#10b981" name="Time Spent (hours)" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="timeSpent" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Area yAxisId="left" type="monotone" dataKey="completed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCompleted)" />
          <Area yAxisId="right" type="monotone" dataKey="timeSpent" stroke="#10b981" fillOpacity={1} fill="url(#colorTime)" />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderSubjectChart = () => {
    const chartData = data.subjectPerformance || [];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="subject" type="category" width={100} />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#3b82f6" name="Your Score">
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={entry.score >= entry.target ? '#10b981' : 
                       entry.score >= entry.average ? '#3b82f6' : '#f59e0b'}
              />
            ))}
          </Bar>
          <Bar dataKey="average" fill="#94a3b8" name="Class Average" />
          <Bar dataKey="target" fill="#f59e0b" name="Target Score" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderDistributionChart = () => {
    const chartData = data.gradeDistribution || [];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderPieLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderAttendanceChart = () => {
    const attendance = data.attendanceData || [];
    
    // Calculate statistics
    const present = attendance.filter(d => d.present).length;
    const late = attendance.filter(d => d.late).length;
    const absent = attendance.filter(d => !d.present).length;
    const total = attendance.length;

    const stats = [
      { name: 'Present', value: present, color: '#10b981' },
      { name: 'Late', value: late, color: '#f59e0b' },
      { name: 'Absent', value: absent, color: '#ef4444' }
    ].filter(s => s.value > 0);

    return (
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{present}</div>
            <div className="text-xs text-gray-600">Present</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{late}</div>
            <div className="text-xs text-gray-600">Late</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{absent}</div>
            <div className="text-xs text-gray-600">Absent</div>
          </div>
        </div>

        {/* Attendance Rate */}
        {total > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Attendance Rate</span>
              <span className="font-medium">{((present + late) / total * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500"
                style={{ width: `${(present / total * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Pie Chart */}
        {stats.length > 0 && (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={renderAttendanceLabel}
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        
        {showControls && (
          <div className="flex space-x-2">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={timeRangeOptions}
              className="w-32"
            />

            {type === 'weekly' && (
              <Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as any)}
                options={chartTypeOptions}
                className="w-32"
              />
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <div>
        {type === 'weekly' && renderWeeklyChart()}
        {type === 'subjects' && renderSubjectChart()}
        {type === 'distribution' && renderDistributionChart()}
        {type === 'attendance' && renderAttendanceChart()}
      </div>
    </Card>
  );
};