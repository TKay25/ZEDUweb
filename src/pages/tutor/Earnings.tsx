import React, { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, Download, Clock,
  CheckCircle, XCircle, AlertCircle, ArrowDownRight,
  Wallet
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from 'axios';

// Simple Select component
const Select: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  children: React.ReactNode;
}> = ({ value, onChange, className, children }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
    >
      {children}
    </select>
  );
};

// Simple Tabs component
const Tabs: React.FC<{
  tabs: { id: string; label: string; }[];
  activeTab: string;
  onChange: (tabId: string) => void;
}> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

interface EarningsSummary {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  nextPayout: number;
  nextPayoutDate: Date;
  lifetimeEarnings: number;
  averageMonthly: number;
  growthRate: number;
  currency: string;
}

interface Transaction {
  id: string;
  date: Date;
  description: string;
  course: string;
  student: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'sale' | 'refund' | 'payout' | 'fee';
  paymentMethod: string;
  paymentId: string;
}

interface Payout {
  id: string;
  date: Date;
  amount: number;
  status: 'processing' | 'completed' | 'failed';
  method: string;
  account: string;
  reference: string;
  estimatedArrival: Date;
}

interface CourseEarnings {
  courseId: string;
  courseName: string;
  students: number;
  revenue: number;
  refunds: number;
  netRevenue: number;
  averagePrice: number;
  conversionRate: number;
}

interface MonthlyEarnings {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  students: number;
}

export const Earnings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [courseEarnings, setCourseEarnings] = useState<CourseEarnings[]>([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarnings[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState('bank');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const API_BASE_URL = (window as any).process?.env?.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    loadEarningsData();
  }, [dateRange]);

  const loadEarningsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/tutor/earnings`, {
        params: { period: dateRange },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data;
      setSummary(data.summary);
      setTransactions(data.transactions);
      setPayouts(data.payouts);
      setCourseEarnings(data.courseEarnings);
      setMonthlyEarnings(data.monthlyEarnings);
    } catch (error) {
      console.error('Failed to load earnings data:', error);
      toast.error('Failed to load earnings data');
      // Set mock data for demo
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setSummary({
      totalEarnings: 12500,
      pendingEarnings: 2500,
      paidEarnings: 10000,
      nextPayout: 2500,
      nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      lifetimeEarnings: 45000,
      averageMonthly: 3750,
      growthRate: 15,
      currency: 'USD'
    });

    setTransactions([
      {
        id: '1',
        date: new Date(),
        description: 'Course Sale',
        course: 'Advanced Mathematics',
        student: 'John Doe',
        amount: 199,
        fee: 10,
        netAmount: 189,
        status: 'completed',
        type: 'sale',
        paymentMethod: 'Credit Card',
        paymentId: 'PAY-123'
      },
      {
        id: '2',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        description: 'Course Sale',
        course: 'Web Development Bootcamp',
        student: 'Jane Smith',
        amount: 299,
        fee: 15,
        netAmount: 284,
        status: 'completed',
        type: 'sale',
        paymentMethod: 'PayPal',
        paymentId: 'PAY-456'
      }
    ]);

    setPayouts([
      {
        id: '1',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        amount: 5000,
        status: 'completed',
        method: 'Bank Transfer',
        account: '****1234',
        reference: 'PO-001',
        estimatedArrival: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ]);

    setCourseEarnings([
      {
        courseId: '1',
        courseName: 'Advanced Mathematics',
        students: 342,
        revenue: 25000,
        refunds: 500,
        netRevenue: 24500,
        averagePrice: 199,
        conversionRate: 15
      },
      {
        courseId: '2',
        courseName: 'Web Development Bootcamp',
        students: 567,
        revenue: 45000,
        refunds: 1000,
        netRevenue: 44000,
        averagePrice: 299,
        conversionRate: 22
      }
    ]);

    setMonthlyEarnings([
      { month: 'Jan', revenue: 3000, expenses: 300, profit: 2700, students: 45 },
      { month: 'Feb', revenue: 3500, expenses: 350, profit: 3150, students: 52 },
      { month: 'Mar', revenue: 4000, expenses: 400, profit: 3600, students: 60 }
    ]);
  };

  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/tutor/earnings/withdraw`, {
        amount: withdrawAmount,
        method: selectedPayoutMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Payout requested successfully');
      setShowWithdrawModal(false);
      loadEarningsData();
    } catch (error) {
      console.error('Failed to request payout:', error);
      toast.error('Failed to request payout');
    }
  };

  const handleExportStatement = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/tutor/earnings/export`, {
        params: { period: dateRange },
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `earnings-statement-${dateRange}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Statement exported successfully');
    } catch (error) {
      console.error('Failed to export statement:', error);
      toast.error('Failed to export statement');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <ArrowDownRight className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: summary?.currency || 'USD'
    }).format(amount);
  };

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Earnings Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your revenue and manage payouts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-32"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </Select>
          <Button variant="outline" onClick={handleExportStatement}>
            <Download className="w-4 h-4 mr-2" />
            Statement
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalEarnings)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            {summary.growthRate}% vs last period
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(summary.pendingEarnings)}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Next payout: {format(new Date(summary.nextPayoutDate), 'MMM d, yyyy')}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(summary.paidEarnings)}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Lifetime earnings: {formatCurrency(summary.lifetimeEarnings)}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Average</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(summary.averageMonthly)}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Over last 12 months
          </div>
        </Card>
      </div>

      {/* Withdraw Card */}
      <Card className="p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Available for Withdrawal</h3>
            <p className="text-3xl font-bold mb-2">{formatCurrency(summary.nextPayout)}</p>
            <p className="text-sm opacity-90">
              Next automatic payout: {format(new Date(summary.nextPayoutDate), 'MMMM d, yyyy')}
            </p>
          </div>
          <Button
            className="bg-white text-primary-600 hover:bg-gray-100"
            onClick={() => setShowWithdrawModal(true)}
          >
            <Wallet className="w-4 h-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'transactions', label: 'Transactions' },
          { id: 'payouts', label: 'Payout History' },
          { id: 'courses', label: 'Course Earnings' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Monthly Chart - Simple table view instead of chart to avoid dependencies */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Earnings Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Month</th>
                    <th className="px-4 py-2 text-right">Revenue</th>
                    <th className="px-4 py-2 text-right">Expenses</th>
                    <th className="px-4 py-2 text-right">Profit</th>
                    <th className="px-4 py-2 text-right">Students</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyEarnings.map((month) => (
                    <tr key={month.month} className="border-t">
                      <td className="px-4 py-3 font-medium">{month.month}</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatCurrency(month.revenue)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(month.expenses)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatCurrency(month.profit)}</td>
                      <td className="px-4 py-3 text-right">{month.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Course Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Earning Courses</h3>
            <div className="space-y-4">
              {courseEarnings.slice(0, 5).map((course) => (
                <div key={course.courseId}>
                  <div className="flex justify-between mb-1">
                    <div>
                      <span className="font-medium">{course.courseName}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({course.students} students)
                      </span>
                    </div>
                    <span className="font-semibold">{formatCurrency(course.netRevenue)}</span>
                  </div>
                  <ProgressBar
                    value={(course.netRevenue / courseEarnings[0].netRevenue) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <Card className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </Select>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Course</th>
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-right py-3 px-4">Fee</th>
                  <th className="text-right py-3 px-4">Net</th>
                  <th className="text-center py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter(t => 
                    (statusFilter === 'all' || t.status === statusFilter) &&
                    (t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     t.student.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(transaction => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4">{transaction.description}</td>
                      <td className="py-3 px-4">{transaction.course}</td>
                      <td className="py-3 px-4">{transaction.student}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500">
                        -{formatCurrency(transaction.fee)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        {formatCurrency(transaction.netAmount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={getStatusColor(transaction.status)}>
                          <span className="flex items-center justify-center">
                            {getStatusIcon(transaction.status)}
                            <span className="ml-1 capitalize">{transaction.status}</span>
                          </span>
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payout History</h3>
          <div className="space-y-4">
            {payouts.map(payout => (
              <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payout.status === 'completed' ? 'bg-green-100' :
                    payout.status === 'processing' ? 'bg-blue-100' : 'bg-red-100'
                  }`}>
                    {payout.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : payout.status === 'processing' ? (
                      <Clock className="w-5 h-5 text-blue-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Payout #{payout.reference}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(payout.date), 'MMM d, yyyy')} • {payout.method}
                    </p>
                    <p className="text-xs text-gray-400">
                      Account: {payout.account}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{formatCurrency(payout.amount)}</p>
                  <Badge className={getStatusColor(payout.status)}>
                    {payout.status}
                  </Badge>
                  {payout.status === 'processing' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Est. arrival: {format(new Date(payout.estimatedArrival), 'MMM d')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Earnings by Course</h3>
          <div className="space-y-4">
            {courseEarnings.map(course => (
              <div key={course.courseId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3 flex-wrap gap-4">
                  <div>
                    <h4 className="font-semibold">{course.courseName}</h4>
                    <p className="text-sm text-gray-500">{course.students} students enrolled</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(course.netRevenue)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Revenue: {formatCurrency(course.revenue)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Average Price</p>
                    <p className="font-medium">{formatCurrency(course.averagePrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Refunds</p>
                    <p className="font-medium text-red-600">{formatCurrency(course.refunds)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Conversion Rate</p>
                    <p className="font-medium">{course.conversionRate}%</p>
                  </div>
                </div>

                <ProgressBar
                  value={(course.netRevenue / courseEarnings[0].netRevenue) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Request Payout</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    max={summary.nextPayout}
                    min={10}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Available: {formatCurrency(summary.nextPayout)} (Minimum: $10)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Payout Method</label>
                <Select
                  value={selectedPayoutMethod}
                  onChange={(e) => setSelectedPayoutMethod(e.target.value)}
                  className="w-full"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="ecocash">EcoCash</option>
                </Select>
              </div>

              {selectedPayoutMethod === 'bank' && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Bank Account</p>
                  <p className="text-sm">**** **** **** 1234</p>
                  <p className="text-xs text-gray-500">Chase Bank • Account ending in 1234</p>
                </div>
              )}

              {selectedPayoutMethod === 'paypal' && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">PayPal Account</p>
                  <p className="text-sm">tutor@zedu.com</p>
                </div>
              )}

              {selectedPayoutMethod === 'ecocash' && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">EcoCash Number</p>
                  <p className="text-sm">+263 77 123 4567</p>
                </div>
              )}

              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-xs text-yellow-800">
                  Payouts typically take 2-3 business days to process. A small fee may apply.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleWithdraw}
                  disabled={withdrawAmount < 10 || withdrawAmount > summary.nextPayout}
                >
                  Request Payout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;