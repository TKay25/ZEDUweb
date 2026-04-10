import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CreditCard, Smartphone, DollarSign, Calendar,
  CheckCircle, AlertCircle, Lock, Shield,
  ArrowRight, Download, Printer
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from 'react-hot-toast';

// Payment validation schema
const paymentSchema = z.object({
  childId: z.string().min(1, 'Please select a child'),
  feeType: z.string().min(1, 'Please select fee type'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['card', 'ecocash', 'bank', 'cash']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  ecocashNumber: z.string().optional(),
  bankReference: z.string().optional(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms')
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  term: string;
  description: string;
  lateFee?: number;
  paid?: boolean;
  paidAmount?: number;
  paidDate?: Date;
}

interface FeePaymentFormProps {
  children: Array<{
    id: string;
    name: string;
    grade: string;
  }>;
  feeStructures: FeeStructure[];
  outstandingBalance: number;
  onProcessPayment: (data: PaymentFormData) => Promise<void>;
  onViewHistory: () => void;
  onDownloadReceipt?: (transactionId: string) => void;
}

export const FeePaymentForm: React.FC<FeePaymentFormProps> = ({
  children,
  feeStructures,
  outstandingBalance,
  onProcessPayment,
  onViewHistory,
  onDownloadReceipt
}) => {
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'card',
      terms: false
    }
  });

  const selectedChild = watch('childId');
  const selectedFeeType = watch('feeType');
  const paymentMethod = watch('paymentMethod');

  const selectedFee = feeStructures.find(f => f.id === selectedFeeType);
  const totalAmount = selectedFee?.amount || 0;
  const lateFee = selectedFee?.lateFee || 0;
  const finalAmount = totalAmount + (new Date() > new Date(selectedFee?.dueDate || '') ? lateFee : 0);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'ecocash', name: 'EcoCash', icon: Smartphone },
    { id: 'bank', name: 'Bank Transfer', icon: DollarSign },
    { id: 'cash', name: 'Cash (School Office)', icon: DollarSign }
  ];

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setLoading(true);
      await onProcessPayment(data);
      setTransactionId('TXN' + Math.random().toString(36).substring(2, 11).toUpperCase());
      setShowReceipt(true);
      toast.success('Payment processed successfully!');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fee Payment</h1>
        <Button variant="outline" onClick={onViewHistory}>
          <Download className="w-4 h-4 mr-2" />
          Payment History
        </Button>
      </div>

      {/* Outstanding Balance Alert */}
      {outstandingBalance > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800">Outstanding Balance</p>
              <p className="text-sm text-yellow-700">
                You have an outstanding balance of ${outstandingBalance}. Please clear it to avoid penalties.
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-yellow-300">
              View Details
            </Button>
          </div>
        </Card>
      )}

      {!showReceipt ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Select Child */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">1. Select Student</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map((child) => (
                <label
                  key={child.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedChild === child.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('childId')}
                    value={child.id}
                    className="hidden"
                  />
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="font-medium">{child.name}</p>
                      <p className="text-sm text-gray-500">Grade: {child.grade}</p>
                    </div>
                    {selectedChild === child.id && (
                      <CheckCircle className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors.childId && (
              <p className="mt-2 text-sm text-red-600">{errors.childId.message}</p>
            )}
          </Card>

          {/* Select Fee Type */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">2. Select Fee Type</h2>
            <div className="space-y-4">
              {feeStructures.map((fee) => (
                <label
                  key={fee.id}
                  className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedFeeType === fee.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('feeType')}
                    value={fee.id}
                    className="hidden"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{fee.name}</span>
                        <span className="text-lg font-bold text-primary-600">
                          ${fee.amount}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{fee.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        Due: {new Date(fee.dueDate).toLocaleDateString()}
                        <span className="mx-2">•</span>
                        <span>Term: {fee.term}</span>
                        {fee.paid && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="text-green-600">Paid on {fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : 'N/A'}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {selectedFeeType === fee.id && (
                      <CheckCircle className="w-5 h-5 text-primary-500 ml-4" />
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors.feeType && (
              <p className="mt-2 text-sm text-red-600">{errors.feeType.message}</p>
            )}
          </Card>

          {/* Payment Summary */}
          {selectedFee && (
            <Card className="p-6 bg-gray-50">
              <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tuition Fee:</span>
                  <span>${totalAmount}</span>
                </div>
                {lateFee > 0 && new Date() > new Date(selectedFee.dueDate) && (
                  <div className="flex justify-between text-red-600">
                    <span>Late Fee:</span>
                    <span>+${lateFee}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount:</span>
                    <span className="text-primary-600">${finalAmount}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Payment Method */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">3. Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${
                      paymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('paymentMethod')}
                      value={method.id}
                      className="hidden"
                    />
                    <Icon className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                    <span className="text-sm">{method.name}</span>
                  </label>
                );
              })}
            </div>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <Input
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  {...register('cardNumber')}
                  error={errors.cardNumber?.message}
                  icon={<CreditCard className="w-4 h-4" />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    placeholder="MM/YY"
                    {...register('cardExpiry')}
                    error={errors.cardExpiry?.message}
                  />
                  <Input
                    label="CVV"
                    type="password"
                    placeholder="123"
                    {...register('cardCvv')}
                    error={errors.cardCvv?.message}
                  />
                </div>
              </div>
            )}

            {/* EcoCash Form */}
            {paymentMethod === 'ecocash' && (
              <div>
                <Input
                  label="EcoCash Number"
                  placeholder="0771234567"
                  {...register('ecocashNumber')}
                  error={errors.ecocashNumber?.message}
                  icon={<Smartphone className="w-4 h-4" />}
                />
                <p className="text-sm text-gray-500 mt-2">
                  You will receive a prompt on your phone to confirm the payment.
                </p>
              </div>
            )}

            {/* Bank Transfer Form */}
            {paymentMethod === 'bank' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="font-medium mb-2">Bank Details</p>
                  <p className="text-sm">Bank: CBZ Bank</p>
                  <p className="text-sm">Account Name: ZEDU School Fees</p>
                  <p className="text-sm">Account Number: 1234567890</p>
                  <p className="text-sm">Branch: Main Branch</p>
                </div>
                <Input
                  label="Transaction Reference"
                  placeholder="Enter bank transaction reference"
                  {...register('bankReference')}
                  error={errors.bankReference?.message}
                />
              </div>
            )}

            {/* Cash Payment */}
            {paymentMethod === 'cash' && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Please visit the school finance office to complete your cash payment.
                  Bring this payment reference number: <span className="font-bold">CASH-{Date.now()}</span>
                </p>
              </div>
            )}
          </Card>

          {/* Terms and Conditions */}
          <Card className="p-6">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...register('terms')}
                className="mt-1"
              />
              <span className="text-sm text-gray-600">
                I confirm that the payment details provided are correct and I agree to the
                <button type="button" className="text-primary-600 hover:underline mx-1">
                  Terms and Conditions
                </button>
                and
                <button type="button" className="text-primary-600 hover:underline mx-1">
                  Privacy Policy
                </button>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-2 text-sm text-red-600">{errors.terms.message}</p>
            )}
          </Card>

          {/* Security Notice */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-1" />
              Secure Payment
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              PCI Compliant
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Pay ${finalAmount}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      ) : (
        // Payment Receipt
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-gray-600 mt-2">
              Transaction ID: <span className="font-mono">{transactionId}</span>
            </p>
          </div>

          <div className="border-t border-b py-4 my-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Student:</span>
                <span className="font-medium">
                  {children.find(c => c.id === selectedChild)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee Type:</span>
                <span className="font-medium">
                  {feeStructures.find(f => f.id === selectedFeeType)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-bold text-primary-600">${finalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onDownloadReceipt?.(transactionId!)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => setShowReceipt(false)}
          >
            Make Another Payment
          </Button>
        </Card>
      )}
    </div>
  );
};