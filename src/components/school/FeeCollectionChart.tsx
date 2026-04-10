import React, { useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import {
  DollarSign, TrendingUp,
  Calendar, Download,
  Percent, Wallet
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Tabs } from '../ui/Tabs';

interface FeeCollectionData {
  summary: {
    totalCollected: number;
    totalExpected: number;
    collectionRate: number;
    outstanding: number;
    overdue: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  trends: {
    daily: Array<{ date: string; collected: number; expected: number }>;
    monthly: Array<{ month: string; collected: number; expected: number }>;
    yearly: Array<{ year: string; collected: number; expected: number }>;
  };
  byGrade: Array<{
    grade: string;
    total: number;
    collected: number;
    pending: number;
    students: number;
  }>;
  byPaymentMethod: Array<{
    method: string;
    amount: number;
    count: number;
  }>;
  byStatus: Array<{
    status: string;
    amount: number;
    count: number;
  }>;
  recentTransactions: Array<{
    id: string;
    date: Date;
    student: string;
    grade: string;
    amount: number;
    method: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
  topDefaulters: Array<{
    student: string;
    grade: string;
    amount: number;
    daysOverdue: number;
  }>;
}

interface FeeCollectionChartProps {
  data: FeeCollectionData;
  timeRange: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onTimeRangeChange: (range: string) => void;
  onExportReport: (format: 'pdf' | 'excel') => void;
  onSendReminders: () => void;
  onViewTransaction: (transactionId: string) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const FeeCollectionChart: React.FC<FeeCollectionChartProps> = ({
  data,
  timeRange,
  onTimeRangeChange,
  onExportReport,
  onSendReminders,
  onViewTransaction
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Time range options for select
  const timeRangeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  // Tabs configuration
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'by-grade', label: 'By Grade' },
    { key: 'by-method', label: 'By Payment Method' },
    { key: 'transactions', label: 'Transactions' },
    { key: 'defaulters', label: 'Defaulters' }
  ];

  // Custom label renderer for pie charts
  const renderPieLabel = (entry: any) => {
    const percent = entry.percent;
    if (percent === undefined) return entry.status || entry.method;
    return `${entry.status || entry.method} (${(percent * 100).toFixed(0)}%)`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fee Collection Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            options={timeRangeOptions}
            className="w-32"
          />
          <Button variant="outline" onClick={() => onExportReport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="primary" onClick={onSendReminders}>
            <Calendar className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Collected</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.summary.totalCollected)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+{data.summary.growth}%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Collection Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {data.summary.collectionRate}%
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Percent className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {formatCurrency(data.summary.totalCollected)} of {formatCurrency(data.summary.totalExpected)}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Outstanding</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(data.summary.outstanding)}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-red-600">
            {formatCurrency(data.summary.overdue)} overdue
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(data.summary.thisMonth)}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Last month: {formatCurrency(data.summary.lastMonth)}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        items={tabs}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Collection Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Collection Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.trends.monthly}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorCollected)"
                  name="Collected"
                />
                <Area
                  type="monotone"
                  dataKey="expected"
                  stroke="#f59e0b"
                  fillOpacity={0.3}
                  fill="#f59e0b"
                  name="Expected"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Status Distribution */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.byStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="amount"
                    label={renderPieLabel}
                  >
                    {data.byStatus.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.byPaymentMethod}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    label={renderPieLabel}
                  >
                    {data.byPaymentMethod.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {/* By Grade Tab */}
      {activeTab === 'by-grade' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Collection by Grade</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.byGrade}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="collected" stackId="a" fill="#3b82f6" name="Collected" />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-3">
            {data.byGrade.map((grade) => (
              <div key={grade.grade} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Grade {grade.grade}</span>
                    <span className="text-sm">
                      {formatCurrency(grade.collected)} of {formatCurrency(grade.total)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(grade.collected / grade.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{grade.students} students</span>
                    <span>Pending: {formatCurrency(grade.pending)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {data.recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => onViewTransaction(transaction.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{transaction.student}</span>
                    <span className={`font-bold ${getStatusColor(transaction.status)}`}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">Grade {transaction.grade}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{transaction.method}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {formatDate(transaction.date)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className={`capitalize ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Defaulters Tab */}
      {activeTab === 'defaulters' && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Top Defaulters</h3>
            <Button variant="outline" size="sm" onClick={onSendReminders}>
              <Calendar className="w-4 h-4 mr-2" />
              Send Reminders
            </Button>
          </div>
          <div className="space-y-3">
            {data.topDefaulters.map((defaulter, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">{defaulter.student}</p>
                  <p className="text-sm text-gray-600">Grade {defaulter.grade}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{formatCurrency(defaulter.amount)}</p>
                  <p className="text-sm text-red-600">{defaulter.daysOverdue} days overdue</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};