// src/pages/school/Fees.tsx
import React, { useState, useEffect } from 'react';
import {
  DollarSign, Download, Plus, Search, Edit2,
  Trash2, CheckCircle, XCircle, Clock,
  AlertCircle, TrendingUp, FileText, Mail, Users
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import schoolAPI from '../../api/school.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface FeeStructure {
  id: string;
  name: string;
  grade: string;
  term: string;
  academicYear: string;
  amount: number;
  type: 'tuition' | 'boarding' | 'transport' | 'uniform' | 'activity' | 'other';
  description?: string;
  dueDate: Date;
  isMandatory: boolean;
  isActive: boolean;
}

interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  feeId: string;
  feeName: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: Date;
  status: 'paid' | 'partial' | 'pending' | 'overdue' | 'waived';
  paymentDate?: Date;
  paymentMethod?: 'cash' | 'card' | 'bank' | 'mobile' | 'other';
  transactionId?: string;
  receiptNumber?: string;
  notes?: string;
}

interface PaymentSummary {
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  totalWaived: number;
  collectionRate: number;
  byGrade: Array<{
    grade: string;
    collected: number;
    pending: number;
    overdue: number;
  }>;
  byType: Array<{
    type: string;
    amount: number;
    count: number;
  }>;
}

const COLORS = {
  paid: '#10b981',
  partial: '#f59e0b',
  pending: '#6b7280',
  overdue: '#ef4444',
  waived: '#8b5cf6'
};

export const Fees: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<FeePayment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadFeesData();
  }, []);

  const loadFeesData = async () => {
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFeeStructures: FeeStructure[] = [
        {
          id: '1',
          name: 'Tuition Fee',
          grade: 'Form 1',
          term: 'Term 1',
          academicYear: '2024',
          amount: 500,
          type: 'tuition',
          dueDate: new Date(2024, 2, 15),
          isMandatory: true,
          isActive: true
        },
        {
          id: '2',
          name: 'Boarding Fee',
          grade: 'Form 1',
          term: 'Term 1',
          academicYear: '2024',
          amount: 300,
          type: 'boarding',
          dueDate: new Date(2024, 2, 15),
          isMandatory: false,
          isActive: true
        }
      ];
      
      const mockPayments: FeePayment[] = [
        {
          id: '1',
          studentId: 's1',
          studentName: 'John Doe',
          studentClass: 'Form 1A',
          feeId: '1',
          feeName: 'Tuition Fee',
          amount: 500,
          paidAmount: 500,
          balance: 0,
          dueDate: new Date(2024, 2, 15),
          status: 'paid',
          paymentDate: new Date(2024, 2, 10),
          paymentMethod: 'cash',
          receiptNumber: 'RCP-001'
        },
        {
          id: '2',
          studentId: 's2',
          studentName: 'Jane Smith',
          studentClass: 'Form 1A',
          feeId: '1',
          feeName: 'Tuition Fee',
          amount: 500,
          paidAmount: 250,
          balance: 250,
          dueDate: new Date(2024, 2, 15),
          status: 'partial',
          paymentDate: new Date(2024, 2, 5),
          paymentMethod: 'card'
        },
        {
          id: '3',
          studentId: 's3',
          studentName: 'Bob Johnson',
          studentClass: 'Form 1B',
          feeId: '1',
          feeName: 'Tuition Fee',
          amount: 500,
          paidAmount: 0,
          balance: 500,
          dueDate: new Date(2024, 2, 15),
          status: 'overdue'
        }
      ];
      
      const mockSummary: PaymentSummary = {
        totalCollected: 750,
        totalPending: 500,
        totalOverdue: 500,
        totalWaived: 0,
        collectionRate: 60,
        byGrade: [
          { grade: 'Form 1', collected: 750, pending: 250, overdue: 500 },
          { grade: 'Form 2', collected: 1000, pending: 200, overdue: 300 },
          { grade: 'Form 3', collected: 800, pending: 300, overdue: 200 }
        ],
        byType: [
          { type: 'Tuition', amount: 2000, count: 10 },
          { type: 'Boarding', amount: 600, count: 2 }
        ]
      };
      
      setFeeStructures(mockFeeStructures);
      setPayments(mockPayments);
      setSummary(mockSummary);
    } catch (error) {
      toast.error('Failed to load fees data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (paymentId: string, amount: number, method: string) => {
    try {
      // Update local state instead of calling API
      setPayments(prev => prev.map(p => 
        p.id === paymentId 
          ? { 
              ...p, 
              paidAmount: p.paidAmount + amount,
              balance: p.balance - amount,
              status: p.balance - amount === 0 ? 'paid' : 'partial',
              paymentDate: new Date(),
              paymentMethod: method as any
            }
          : p
      ));
      toast.success('Payment recorded successfully');
      setShowPaymentModal(false);
      setSelectedPayment(null);
      // Reload data to refresh summary
      loadFeesData();
    } catch (error) {
      toast.error('Failed to record payment');
      console.error(error);
    }
  };

  const handleSendReminder = async (paymentId: string) => {
    try {
      // This would be implemented in the API
      // For now, show success message
      toast.success('Reminder sent successfully');
      console.log('Send reminder for payment:', paymentId);
    } catch (error) {
      toast.error('Failed to send reminder');
      console.error(error);
    }
  };

  const handleGenerateReceipt = async (paymentId: string) => {
    try {
      // This would be implemented in the API
      // For now, show success message
      toast.success('Receipt generated');
      console.log('Generate receipt for payment:', paymentId);
    } catch (error) {
      toast.error('Failed to generate receipt');
      console.error(error);
    }
  };

  const handleExportReport = async () => {
    try {
      await schoolAPI.generateReport('fees', undefined, 'all');
      toast.success('Report exported');
    } catch (error) {
      toast.error('Failed to export report');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'waived': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'partial': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'waived': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.feeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'all' || payment.studentClass === selectedGrade;
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

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
        <h1 className="text-2xl font-bold">Fees Management</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Fee Structure
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Collected</p>
              <p className="text-2xl font-bold text-green-600">
                ${summary.totalCollected.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">
                ${summary.totalPending.toLocaleString()}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Overdue</p>
              <p className="text-2xl font-bold text-red-700">
                ${summary.totalOverdue.toLocaleString()}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4 bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Waived</p>
              <p className="text-2xl font-bold text-purple-700">
                ${summary.totalWaived.toLocaleString()}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Collection Rate</p>
              <p className="text-2xl font-bold text-blue-700">
                {summary.collectionRate}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Simple Tabs Implementation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'payments', label: 'Payments' },
            { id: 'structures', label: 'Fee Structures' },
            { id: 'reports', label: 'Reports' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collection by Grade */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Collection by Grade</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summary.byGrade}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="collected" stackId="a" fill="#10b981" name="Collected" />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                  <Bar dataKey="overdue" stackId="a" fill="#ef4444" name="Overdue" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Payment Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Paid', value: summary.totalCollected },
                      { name: 'Pending', value: summary.totalPending },
                      { name: 'Overdue', value: summary.totalOverdue },
                      { name: 'Waived', value: summary.totalWaived }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    <Cell fill={COLORS.paid} />
                    <Cell fill={COLORS.pending} />
                    <Cell fill={COLORS.overdue} />
                    <Cell fill={COLORS.waived} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Recent Payments */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Payments</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('payments')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {payments.slice(0, 5).map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.studentName}</p>
                      <p className="text-sm text-gray-500">{payment.feeName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.paidAmount}</p>
                    <p className="text-xs text-gray-500">
                      {payment.paymentDate ? format(payment.paymentDate, 'MMM d, yyyy') : 'Not paid'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by student, fee, or receipt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Grades</option>
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="waived">Waived</option>
              </select>
            </div>
          </Card>

          {/* Payments Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.studentName}
                        </div>
                        <div className="text-sm text-gray-500">{payment.studentClass}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.feeName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">${payment.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-600 font-medium">
                          ${payment.paidAmount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          payment.balance > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          ${payment.balance}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(payment.dueDate, 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(payment.status)}>
                          <span className="flex items-center">
                            {getStatusIcon(payment.status)}
                            <span className="ml-1 capitalize">{payment.status}</span>
                          </span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {payment.status !== 'paid' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowPaymentModal(true);
                              }}
                            >
                              Record Payment
                            </Button>
                          )}
                          {payment.status === 'overdue' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(payment.id)}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          )}
                          {payment.status === 'paid' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateReceipt(payment.id)}
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Fee Structures Tab */}
      {activeTab === 'structures' && (
        <div className="space-y-4">
          {feeStructures.map(fee => (
            <Card key={fee.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{fee.name}</h3>
                    <Badge className="bg-blue-100 text-blue-800">{fee.type}</Badge>
                    <Badge className={fee.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {fee.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Grade</p>
                      <p className="font-medium">{fee.grade}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Term</p>
                      <p className="font-medium">{fee.term} {fee.academicYear}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-medium text-green-600">${fee.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-medium">{format(fee.dueDate, 'MMM d, yyyy')}</p>
                    </div>
                  </div>

                  {fee.description && (
                    <p className="mt-2 text-sm text-gray-600">{fee.description}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Collection Report</h3>
                <p className="text-sm text-gray-500">Detailed fee collection report by grade and term</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleExportReport}>
              Generate Report
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <AlertCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Overdue Report</h3>
                <p className="text-sm text-gray-500">List of all overdue payments</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleExportReport}>
              Generate Report
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Student Statement</h3>
                <p className="text-sm text-gray-500">Individual student fee statements</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleExportReport}>
              Generate Report
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold">Financial Summary</h3>
                <p className="text-sm text-gray-500">Summary of all financial transactions</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleExportReport}>
              Generate Report
            </Button>
          </Card>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Record Payment</h2>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPayment(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Student</p>
                <p className="font-medium">{selectedPayment.studentName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Fee</p>
                <p className="font-medium">{selectedPayment.feeName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-primary-600">${selectedPayment.amount}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Balance Due</p>
                <p className="text-xl font-bold text-red-600">${selectedPayment.balance}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Payment Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  max={selectedPayment.balance}
                  id="payment-amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="mobile">Mobile Money</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPayment(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    const amountInput = document.getElementById('payment-amount') as HTMLInputElement;
                    const amount = amountInput ? parseFloat(amountInput.value) : 0;
                    const methodSelect = document.querySelector('.payment-method') as HTMLSelectElement;
                    const method = methodSelect ? methodSelect.value : 'cash';
                    handleRecordPayment(selectedPayment.id, amount, method);
                  }}
                >
                  Record Payment
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};