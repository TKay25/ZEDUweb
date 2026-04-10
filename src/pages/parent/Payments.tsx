import React, { useState, useEffect } from 'react';
import {
  DollarSign, CreditCard, Calendar, Download,
  CheckCircle, XCircle, Clock, AlertCircle,
  Plus, Search,
  Banknote, Phone, Smartphone
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import parentAPI from '../../api/parent.api';
import type { Payment, PaymentMethod, PaymentSummary } from '../../api/parent.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const Payments: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChild, setSelectedChild] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const [summaryRes, paymentsRes, methodsRes] = await Promise.all([
        parentAPI.getPaymentSummary(),
        parentAPI.getPayments(),
        parentAPI.getPaymentMethods()
      ]);
      setSummary(summaryRes);
      setPayments(paymentsRes);
      setPaymentMethods(methodsRes);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleMakePayment = async (paymentId: string, methodId: string) => {
    if (!methodId) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      setProcessing(true);
      await parentAPI.processPayment(paymentId, methodId);
      toast.success('Payment processed successfully');
      loadPayments();
      setShowPaymentModal(false);
      setSelectedMethod('');
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      const response = await parentAPI.getReceipt(paymentId);
      window.open(response.url, '_blank');
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment =>
    (selectedChild === 'all' || payment.childId === selectedChild) &&
    (payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <h1 className="text-2xl font-bold">Payments</h1>
        <Button onClick={() => setShowPaymentModal(true)}>
          <CreditCard className="w-4 h-4 mr-2" />
          Make Payment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ${summary.totalPaid.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Last payment: ${summary.lastPayment.amount} on {format(summary.lastPayment.date, 'MMM d')}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                ${summary.pendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">
                ${summary.upcomingAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                ${summary.overdueAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Custom Tabs - Using button-based tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab('methods')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'methods'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payment Methods
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Upcoming Payments */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Payments</h3>
            <div className="space-y-4">
              {payments.filter(p => p.status === 'pending').map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{payment.description}</h4>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{payment.childName}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        Due: {format(payment.dueDate, 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        Amount: ${payment.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowPaymentModal(true);
                    }}
                  >
                    Pay Now
                  </Button>
                </div>
              ))}

              {payments.filter(p => p.status === 'pending').length === 0 && (
                <p className="text-center text-gray-500 py-4">No pending payments</p>
              )}
            </div>
          </Card>

          {/* Recent Payments */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
            <div className="space-y-3">
              {payments.filter(p => p.status === 'paid').slice(0, 5).map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-gray-500">
                        {payment.childName} • {format(payment.paidDate!, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">${payment.amount.toLocaleString()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadReceipt(payment.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === 'history' && (
        <Card className="p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full sm:w-40 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Children</option>
              <option value="1">John Doe</option>
              <option value="2">Jane Doe</option>
            </select>
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Child</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {payment.paidDate 
                        ? format(payment.paidDate, 'MMM d, yyyy')
                        : format(payment.dueDate, 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{payment.description}</p>
                      {payment.transactionId && (
                        <p className="text-xs text-gray-500">ID: {payment.transactionId}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">{payment.childName}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={getStatusColor(payment.status)}>
                        <span className="flex items-center justify-center">
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </span>
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {payment.status === 'paid' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadReceipt(payment.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowPaymentModal(true);
                          }}
                        >
                          Pay Now
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <div className="space-y-4">
          {paymentMethods.map(method => (
            <Card key={method.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    method.type === 'card' ? 'bg-blue-100' :
                    method.type === 'bank' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {method.type === 'card' && <CreditCard className="w-6 h-6 text-blue-600" />}
                    {method.type === 'bank' && <Banknote className="w-6 h-6 text-green-600" />}
                    {method.type === 'mobile' && <Smartphone className="w-6 h-6 text-purple-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold">{method.name}</h4>
                    {method.last4 && (
                      <p className="text-sm text-gray-600">•••• {method.last4}</p>
                    )}
                    {method.expiryDate && (
                      <p className="text-xs text-gray-500">Expires {method.expiryDate}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {method.isDefault && (
                    <Badge className="bg-green-100 text-green-800">Default</Badge>
                  )}
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Remove</Button>
                </div>
              </div>
            </Card>
          ))}

          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Make Payment</h2>

            <div className="space-y-4">
              {/* Payment Details */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Amount Due</p>
                <p className="text-3xl font-bold text-primary-600">
                  ${selectedPayment.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedPayment.description} • {selectedPayment.childName}
                </p>
                <p className="text-xs text-gray-500">
                  Due: {format(selectedPayment.dueDate, 'MMMM d, yyyy')}
                </p>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Payment Method</label>
                <div className="space-y-2">
                  {paymentMethods.map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedMethod === method.id ? 'border-primary-500 bg-primary-50' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center">
                          {method.type === 'card' && <CreditCard className="w-5 h-5 text-gray-500 mr-2" />}
                          {method.type === 'bank' && <Banknote className="w-5 h-5 text-gray-500 mr-2" />}
                          {method.type === 'mobile' && <Phone className="w-5 h-5 text-gray-500 mr-2" />}
                          <span>{method.name}</span>
                          {method.last4 && <span className="text-sm text-gray-500 ml-2">•••• {method.last4}</span>}
                        </div>
                        {method.isDefault && (
                          <Badge className="bg-green-100 text-green-800">Default</Badge>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedMethod('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleMakePayment(selectedPayment.id, selectedMethod)}
                  loading={processing}
                  disabled={!selectedMethod}
                >
                  Pay ${selectedPayment.amount.toLocaleString()}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};