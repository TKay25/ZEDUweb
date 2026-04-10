import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Calendar,
  DollarSign,
  CreditCard,
  Receipt,
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Printer,
  Mail,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  FileDown
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../hooks/useAuth';

// Define interfaces
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  childName: string;
  childId: string;
  childAvatar?: string;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled' | 'draft';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod?: string;
  paymentReference?: string;
  billingPeriod: string;
  notes?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'mobile';
  last4?: string;
  expiryDate?: string;
  bankName?: string;
  accountNumber?: string;
  isDefault: boolean;
}

interface InvoiceSummary {
  totalOutstanding: number;
  overdue: number;
  paidThisMonth: number;
  upcomingPayments: number;
}

export const Invoice: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [summary, setSummary] = useState<InvoiceSummary>({
    totalOutstanding: 0,
    overdue: 0,
    paidThisMonth: 0,
    upcomingPayments: 0
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadInvoiceData();
    loadPaymentMethods();
  }, []);

  const loadInvoiceData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          childName: 'Michael Johnson',
          childId: 'child1',
          childAvatar: '/avatars/michael.jpg',
          issueDate: new Date(2024, 2, 1),
          dueDate: new Date(2024, 2, 15),
          status: 'paid',
          items: [
            {
              id: 'item1',
              description: 'Tuition Fee - March 2024',
              quantity: 1,
              unitPrice: 500,
              amount: 500
            },
            {
              id: 'item2',
              description: 'Mathematics Course Materials',
              quantity: 2,
              unitPrice: 45,
              amount: 90
            },
            {
              id: 'item3',
              description: 'Lab Fee',
              quantity: 1,
              unitPrice: 30,
              amount: 30
            }
          ],
          subtotal: 620,
          tax: 0,
          discount: 0,
          total: 620,
          paymentMethod: 'Visa •••• 4242',
          paymentReference: 'PAY-123456',
          billingPeriod: 'March 2024',
          paidDate: new Date(2024, 2, 5)
        },
        {
          id: '2',
          invoiceNumber: 'INV-2024-002',
          childName: 'Michael Johnson',
          childId: 'child1',
          childAvatar: '/avatars/michael.jpg',
          issueDate: new Date(2024, 2, 15),
          dueDate: new Date(2024, 2, 28),
          status: 'pending',
          items: [
            {
              id: 'item1',
              description: 'After School Program - March',
              quantity: 1,
              unitPrice: 200,
              amount: 200
            },
            {
              id: 'item2',
              description: 'Music Lessons (4 sessions)',
              quantity: 4,
              unitPrice: 25,
              amount: 100
            }
          ],
          subtotal: 300,
          tax: 15,
          discount: 0,
          total: 315,
          billingPeriod: 'March 2024 (Extra)'
        },
        {
          id: '3',
          invoiceNumber: 'INV-2024-003',
          childName: 'Sarah Johnson',
          childId: 'child2',
          childAvatar: '/avatars/sarah.jpg',
          issueDate: new Date(2024, 1, 1),
          dueDate: new Date(2024, 1, 15),
          status: 'overdue',
          items: [
            {
              id: 'item1',
              description: 'Tuition Fee - February 2024',
              quantity: 1,
              unitPrice: 500,
              amount: 500
            },
            {
              id: 'item2',
              description: 'Science Lab Materials',
              quantity: 1,
              unitPrice: 75,
              amount: 75
            }
          ],
          subtotal: 575,
          tax: 0,
          discount: 0,
          total: 575,
          billingPeriod: 'February 2024'
        },
        {
          id: '4',
          invoiceNumber: 'INV-2024-004',
          childName: 'Michael Johnson',
          childId: 'child1',
          childAvatar: '/avatars/michael.jpg',
          issueDate: new Date(2024, 3, 1),
          dueDate: new Date(2024, 3, 15),
          status: 'draft',
          items: [
            {
              id: 'item1',
              description: 'Tuition Fee - April 2024',
              quantity: 1,
              unitPrice: 500,
              amount: 500
            }
          ],
          subtotal: 500,
          tax: 0,
          discount: 0,
          total: 500,
          billingPeriod: 'April 2024'
        },
        {
          id: '5',
          invoiceNumber: 'INV-2024-005',
          childName: 'Emma Johnson',
          childId: 'child3',
          childAvatar: '/avatars/emma.jpg',
          issueDate: new Date(2024, 2, 10),
          dueDate: new Date(2024, 2, 25),
          status: 'paid',
          items: [
            {
              id: 'item1',
              description: 'Art Class Supplies',
              quantity: 1,
              unitPrice: 85,
              amount: 85
            },
            {
              id: 'item2',
              description: 'Field Trip - Science Museum',
              quantity: 1,
              unitPrice: 35,
              amount: 35
            }
          ],
          subtotal: 120,
          tax: 0,
          discount: 0,
          total: 120,
          paymentMethod: 'PayPal',
          paymentReference: 'PAYPAL-789012',
          billingPeriod: 'March 2024',
          paidDate: new Date(2024, 2, 12)
        }
      ];

      setInvoices(mockInvoices);
      
      // Calculate summary
      const outstanding = mockInvoices
        .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.total, 0);
      
      const overdue = mockInvoices
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.total, 0);
      
      const paidThisMonth = mockInvoices
        .filter(inv => inv.status === 'paid' && inv.paidDate && inv.paidDate.getMonth() === new Date().getMonth())
        .reduce((sum, inv) => sum + inv.total, 0);
      
      const upcoming = mockInvoices
        .filter(inv => inv.status === 'draft')
        .reduce((sum, inv) => sum + inv.total, 0);

      setSummary({
        totalOutstanding: outstanding,
        overdue,
        paidThisMonth,
        upcomingPayments: upcoming
      });

    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    // Mock payment methods
    const mockMethods: PaymentMethod[] = [
      {
        id: 'pm1',
        type: 'card',
        last4: '4242',
        expiryDate: '12/25',
        isDefault: true
      },
      {
        id: 'pm2',
        type: 'card',
        last4: '1234',
        expiryDate: '09/24',
        isDefault: false
      },
      {
        id: 'pm3',
        type: 'bank',
        bankName: 'Chase Bank',
        accountNumber: '••••5678',
        isDefault: false
      }
    ];
    setPaymentMethods(mockMethods);
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge variant="warning" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'overdue':
        return <Badge variant="danger" className="bg-red-100 text-red-800">Overdue</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Draft</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const filteredInvoices = invoices
    .filter(invoice => {
      if (filterStatus !== 'all' && invoice.status !== filterStatus) return false;
      if (searchTerm) {
        return invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
               invoice.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               invoice.billingPeriod.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? a.issueDate.getTime() - b.issueDate.getTime()
          : b.issueDate.getTime() - a.issueDate.getTime();
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.total - b.total : b.total - a.total;
      } else {
        // Sort by status
        const statusOrder = { paid: 1, pending: 2, overdue: 3, draft: 4, cancelled: 5 };
        return sortOrder === 'asc'
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      }
    });

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetail(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Implement PDF download
    console.log('Downloading invoice:', invoice.invoiceNumber);
    // You would typically call an API to generate PDF
    alert(`Downloading invoice ${invoice.invoiceNumber}...`);
  };

  const handlePayNow = (invoice: Invoice) => {
    // Implement payment flow
    console.log('Paying invoice:', invoice.invoiceNumber);
    alert(`Proceeding to payment for invoice ${invoice.invoiceNumber}`);
  };

  const handleEmailInvoice = (invoice: Invoice) => {
    // Implement email sending
    console.log('Emailing invoice:', invoice.invoiceNumber);
    alert(`Invoice ${invoice.invoiceNumber} has been sent to your email`);
  };

  const toggleSort = (field: 'date' | 'amount' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices & Billing</h1>
          <p className="text-gray-600 mt-1">
            Manage your payments and view invoice history
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print Summary
          </Button>
          <Button>
            <CreditCard className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Outstanding</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.totalOutstanding)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(summary.overdue)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.paidThisMonth)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(summary.upcomingPayments)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Methods Quick View */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Payment Methods</h2>
          <Link to="/parent/payment-methods" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
            Manage
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {paymentMethods.map(method => (
            <div key={method.id} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
              {method.type === 'card' ? (
                <CreditCard className="w-4 h-4 text-blue-500" />
              ) : (
                <DollarSign className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm">
                {method.type === 'card' 
                  ? `•••• ${method.last4}`
                  : method.bankName
                }
              </span>
              {method.isDefault && (
                <Badge variant="secondary" size="sm" className="bg-blue-100 text-blue-800">
                  Default
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Invoices</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('date')}>
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Child
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('status')}>
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('amount')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Receipt className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(invoice.issueDate)}</div>
                    <div className="text-xs text-gray-500">Due: {formatDate(invoice.dueDate)}</div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar
                        src={invoice.childAvatar}
                        name={invoice.childName}
                        size="sm"
                      />
                      <span className="ml-3 text-sm text-gray-900">{invoice.childName}</span>
                    </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.billingPeriod}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(invoice.status)}
                      {getStatusBadge(invoice.status)}
                    </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(invoice.total)}
                    </span>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Download PDF"
                      >
                        <FileDown className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleEmailInvoice(invoice)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Email Invoice"
                      >
                        <Mail className="w-4 h-4 text-gray-500" />
                      </button>
                      {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                        <Button
                          size="sm"
                          onClick={() => handlePayNow(invoice)}
                          className="ml-2"
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search or filter criteria'
                  : 'You don\'t have any invoices yet'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Invoice Detail Modal */}
      {showInvoiceDetail && selectedInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
                  <p className="text-gray-500">{selectedInvoice.invoiceNumber}</p>
                </div>
                <button
                  onClick={() => setShowInvoiceDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Invoice Content */}
              <div className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bill To</h3>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedInvoice.childName}
                    </p>
                    <p className="text-sm text-gray-600">Parent: {user?.firstName || 'Elton'} {user?.lastName || 'Shonhiwa'}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Invoice Date</h3>
                    <p className="text-base font-semibold text-gray-900">
                      {formatDate(selectedInvoice.issueDate)}
                    </p>
                    <p className="text-sm text-gray-600">Due: {formatDate(selectedInvoice.dueDate)}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Items</h3>
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-700 text-right">Subtotal:</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(selectedInvoice.subtotal)}</td>
                      </tr>
                      {selectedInvoice.discount > 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-700 text-right">Discount:</td>
                          <td className="px-4 py-2 text-sm text-green-600 text-right">-{formatCurrency(selectedInvoice.discount)}</td>
                        </tr>
                      )}
                      {selectedInvoice.tax > 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-700 text-right">Tax:</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(selectedInvoice.tax)}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-base font-bold text-gray-900 text-right">Total:</td>
                        <td className="px-4 py-2 text-base font-bold text-primary-600 text-right">{formatCurrency(selectedInvoice.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Payment Info */}
                {selectedInvoice.paymentMethod && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Method</p>
                        <p className="text-sm font-medium text-gray-900">{selectedInvoice.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reference</p>
                        <p className="text-sm font-medium text-gray-900">{selectedInvoice.paymentReference}</p>
                      </div>
                      {selectedInvoice.paidDate && (
                        <div>
                          <p className="text-sm text-gray-500">Paid Date</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(selectedInvoice.paidDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                    <p className="text-sm text-gray-600">{selectedInvoice.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => handleDownloadInvoice(selectedInvoice)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" onClick={() => handleEmailInvoice(selectedInvoice)}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  {(selectedInvoice.status === 'pending' || selectedInvoice.status === 'overdue') && (
                    <Button onClick={() => handlePayNow(selectedInvoice)}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;