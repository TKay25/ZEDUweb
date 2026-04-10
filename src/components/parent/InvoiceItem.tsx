import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  FileText, Download, Eye, CreditCard,
  Clock, AlertCircle,
  CheckCircle, XCircle, Printer, Share2,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

interface InvoiceItemProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    childName: string;
    childId: string;
    term: string;
    issueDate: Date;
    dueDate: Date; // Keep only one dueDate
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      amount: number;
    }>;
    subtotal: number;
    discounts?: Array<{
      description: string;
      amount: number;
    }>;
    taxes?: Array<{
      description: string;
      rate: number;
      amount: number;
    }>;
    total: number;
    paidAmount: number;
    balance: number;
    status: 'paid' | 'partial' | 'overdue' | 'pending' | 'cancelled';
    paymentMethod?: string;
    paidAt?: Date;
    notes?: string;
    pdfUrl?: string;
  };
  onPayNow: (invoiceId: string) => void;
  onViewDetails: (invoiceId: string) => void;
  onDownloadPDF: (invoiceId: string) => void;
  onShare?: (invoiceId: string) => void;
  onDispute?: (invoiceId: string) => void;
}

export const InvoiceItem: React.FC<InvoiceItemProps> = ({
  invoice,
  onPayNow,
  onViewDetails,
  onDownloadPDF,
  onShare,
  onDispute
}) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'partial': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const isOverdue = new Date() > new Date(invoice.dueDate) && invoice.status !== 'paid';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const paymentProgress = (invoice.paidAmount / invoice.total) * 100;

  // Get progress bar color based on payment status
  const getProgressColor = () => {
    if (paymentProgress >= 100) return 'green';
    if (paymentProgress >= 70) return 'blue';
    if (paymentProgress >= 40) return 'yellow';
    return 'red';
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200' : ''}`}>
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Invoice #{invoice.invoiceNumber}</p>
              <p className="font-medium">{invoice.childName}</p>
            </div>
          </div>
          <Badge className={getStatusColor(isOverdue ? 'overdue' : invoice.status)}>
            <span className="flex items-center">
              {getStatusIcon(isOverdue ? 'overdue' : invoice.status)}
              <span className="ml-1 capitalize">{isOverdue ? 'overdue' : invoice.status}</span>
            </span>
          </Badge>
        </div>
      </div>

      {/* Quick Info */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Issue Date</p>
            <p className="text-sm font-medium">{format(new Date(invoice.issueDate), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Due Date</p>
            <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : ''}`}>
              {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
              {isOverdue && ' (Overdue)'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Term</p>
            <p className="text-sm font-medium">{invoice.term}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-sm font-bold text-primary-600">{formatCurrency(invoice.total)}</p>
          </div>
        </div>

        {/* Payment Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Payment Progress</span>
            <span className="font-medium">
              {formatCurrency(invoice.paidAmount)} / {formatCurrency(invoice.total)}
            </span>
          </div>
          <ProgressBar 
            value={paymentProgress} 
            color={getProgressColor()}
            className="h-2"
          />
        </div>

        {/* Balance Due */}
        {invoice.balance > 0 && (
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg mb-4">
            <span className="text-sm text-yellow-800">Balance Due:</span>
            <span className="text-lg font-bold text-yellow-800">{formatCurrency(invoice.balance)}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {invoice.balance > 0 && invoice.status !== 'cancelled' && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onPayNow(invoice.id)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(invoice.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onDownloadPDF(invoice.id)}
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
            aria-label={expanded ? 'Show less' : 'Show more'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Invoice Items */}
            <div>
              <h4 className="font-medium mb-2">Invoice Items</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Qty</th>
                    <th className="px-4 py-2 text-right">Unit Price</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{item.description}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">Subtotal:</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(invoice.subtotal)}</td>
                  </tr>
                  {invoice.discounts?.map((discount, index) => (
                    <tr key={index}>
                      <td colSpan={3} className="px-4 py-2 text-right text-green-600">
                        {discount.description}:
                      </td>
                      <td className="px-4 py-2 text-right text-green-600">
                        -{formatCurrency(discount.amount)}
                      </td>
                    </tr>
                  ))}
                  {invoice.taxes?.map((tax, index) => (
                    <tr key={index}>
                      <td colSpan={3} className="px-4 py-2 text-right">
                        {tax.description} ({tax.rate}%):
                      </td>
                      <td className="px-4 py-2 text-right">{formatCurrency(tax.amount)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={3} className="px-4 py-2 text-right">Total:</td>
                    <td className="px-4 py-2 text-right text-primary-600">
                      {formatCurrency(invoice.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment History */}
            {invoice.paidAmount > 0 && (
              <div>
                <h4 className="font-medium mb-2">Payment History</h4>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Payment Received</p>
                      <p className="text-xs text-gray-500">
                        {invoice.paidAt ? format(new Date(invoice.paidAt), 'MMM d, yyyy') : 'N/A'} via {invoice.paymentMethod || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600">
                    {formatCurrency(invoice.paidAmount)}
                  </span>
                </div>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{invoice.notes}</p>
              </div>
            )}

            {/* Additional Actions */}
            <div className="flex space-x-2 pt-2">
              {onShare && (
                <Button variant="ghost" size="sm" onClick={() => onShare(invoice.id)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              {onDispute && invoice.status !== 'paid' && (
                <Button variant="ghost" size="sm" onClick={() => onDispute(invoice.id)}>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Dispute
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};