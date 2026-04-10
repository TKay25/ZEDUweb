import React from 'react';
import {
  DollarSign, TrendingUp, TrendingDown,
  Calendar, Download, Eye, CreditCard,
  Clock, CheckCircle, XCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface Transaction {
  id: string;
  date: Date;
  student: string;
  course: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
}

interface EarningsCardProps {
  data: {
    totalEarnings: number;
    pendingEarnings: number;
    totalPayouts: number;
    nextPayout: number;
    nextPayoutDate: Date;
    monthlyEarnings: Array<{
      month: string;
      amount: number;
    }>;
    recentTransactions: Transaction[];
    courseEarnings: Array<{
      course: string;
      amount: number;
      students: number;
    }>;
  };
  onWithdraw: () => void;
  onViewTransaction: (id: string) => void;
  onExport: () => void;
}

// ProgressBar color type
type ProgressColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';

export const EarningsCard: React.FC<EarningsCardProps> = ({
  data,
  onWithdraw,
  onViewTransaction,
  onExport
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const maxEarning = Math.max(...data.monthlyEarnings.map(e => e.amount));

  // Get progress bar color based on percentage
  const getProgressColor = (percentage: number): ProgressColor => {
    if (percentage >= 80) return 'green';
    if (percentage >= 50) return 'blue';
    if (percentage >= 25) return 'yellow';
    return 'red';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.totalEarnings)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5% from last month
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(data.pendingEarnings)}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Will be available in 3 days
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Next Payout</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.nextPayout)}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {data.nextPayoutDate.toLocaleDateString()}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Payouts</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(data.totalPayouts)}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Lifetime payouts
          </div>
        </Card>
      </div>

      {/* Withdraw Button */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={onWithdraw}>
          <DollarSign className="w-4 h-4 mr-2" />
          Withdraw Earnings
        </Button>
      </div>

      {/* Monthly Earnings Chart */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Monthly Earnings</h3>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="space-y-3">
          {data.monthlyEarnings.map((month) => {
            const percentage = (month.amount / maxEarning) * 100;
            return (
              <div key={month.month}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{month.month}</span>
                  <span className="font-medium">{formatCurrency(month.amount)}</span>
                </div>
                <ProgressBar
                  value={percentage}
                  color={getProgressColor(percentage)}
                  className="h-2"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Course Earnings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Earnings by Course</h3>
        <div className="space-y-4">
          {data.courseEarnings.map((course) => (
            <div key={course.course} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{course.course}</p>
                <p className="text-sm text-gray-500">{course.students} students</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(course.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {data.recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => onViewTransaction(transaction.id)}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{transaction.student}</p>
                  <span className="font-bold">{formatCurrency(transaction.amount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">{transaction.course}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {transaction.date.toLocaleDateString()}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{transaction.paymentMethod}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(transaction.status)}`}>
                    {getStatusIcon(transaction.status)}
                    <span className="ml-1 capitalize">{transaction.status}</span>
                  </span>
                </div>
              </div>
              <Eye className="w-5 h-5 text-gray-400 ml-4" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};