//import  { TypedRadialChartContext } from 'recharts';
//import { TypedRadialChartContext } from "recharts"; { ID, DateTime, PaymentStatus } from './index';
import type { ID, DateTime, PaymentStatus, URL } from './index';
export interface Payment {
  id: ID;
  transactionId: string;
  
  payerId: ID | any; // Parent | Student
  payeeId: ID | any; // School | Tutor
  studentId?: ID | any; // Student
  
  amount: number;
  currency: string;
  paymentMethod: 'ecocash' | 'paynow' | 'stripe' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'mobile_money' | 'zimswitch';
  paymentProvider: string;
  
  paymentType: 'school_fees' | 'tutoring' | 'course' | 'registration' | 'other';
  
  invoiceId?: string;
  receiptNumber?: string;
  description: string;
  
  allocation?: FeeAllocation[];
  
  status: PaymentStatus;
  
  initiatedAt: DateTime;
  completedAt?: DateTime;
  
  paymentReference?: string;
  mobileMoneyNumber?: string;
  cardLastFour?: string;
  
  ipAddress?: string;
  deviceInfo?: string;
  
  receiptUrl?: string;
  receiptGenerated: boolean;
  
  refundReason?: string;
  refundedAt?: DateTime;
  refundReference?: string;
  
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface FeeAllocation {
  term: string;
  year: number;
  feeType: string;
  amount: number;
}

export interface Invoice {
  id: ID;
  invoiceNumber: string;
  
  schoolId: ID | any; // School
  studentId: ID | any; // Student
  parentId?: ID | any; // Parent
  
  issueDate: DateTime;
  dueDate: DateTime;
  paidDate?: DateTime;
  
  status: PaymentStatus;
  
  subtotal: number;
  tax: number;
  total: number;
  
  items: InvoiceItem[];
  
  payments: InvoicePayment[];
  
  billingAddress: BillingAddress;
  
  notes?: string;
  pdfUrl?: URL;
  
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoicePayment {
  date: DateTime;
  amount: number;
  method: string;
  transactionId: string;
}

export interface BillingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface FeeStructure {
  id: ID;
  name: string;
  grade: string;
  term: string;
  academicYear: string;
  amount: number;
  type: 'tuition' | 'boarding' | 'transport' | 'uniform' | 'activity' | 'other';
  description?: string;
  dueDate: DateTime;
  isMandatory: boolean;
  isActive: boolean;
}

export interface Scholarship {
  id: ID;
  scholarshipCode: string;
  name: string;
  description: string;
  
  provider: ScholarshipProvider;
  
  type: 'full' | 'partial' | 'merit' | 'need_based' | 'sports' | 'arts' | 'stem';
  
  coverage: ScholarshipCoverage;
  
  eligibility: ScholarshipEligibility;
  
  applicationPeriod: {
    openingDate: DateTime;
    closingDate: DateTime;
  };
  
  requirements: ScholarshipRequirement[];
  
  totalAwards: number;
  awardsRemaining: number;
  awardAmount: number;
  awardDuration: string;
  renewable: boolean;
  
  applications: ScholarshipApplication[];
  
  status: 'active' | 'closed' | 'upcoming' | 'archived';
  
  createdAt: DateTime;
  updatedAt: DateTime;
  createdBy: ID | any; // MinistryOfficial
}

export interface ScholarshipProvider {
  type: 'government' | 'corporate' | 'ngo' | 'foundation' | 'individual';
  name: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface ScholarshipCoverage {
  tuition: boolean;
  boarding: boolean;
  books: boolean;
  uniform: boolean;
  transport: boolean;
  other: string[];
  amount?: number;
  percentage?: number;
}

export interface ScholarshipEligibility {
  minGrade?: string;
  minAttendance?: number;
  incomeThreshold?: number;
  provinces?: string[];
  districts?: string[];
  schoolTypes?: string[];
  gender?: string;
  specialCriteria?: string[];
}

export interface ScholarshipRequirement {
  document: string;
  required: boolean;
  description: string;
}

export interface ScholarshipApplication {
  id: ID;
  studentId: ID | any; // Student
  applicationDate: DateTime;
  status: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'awarded' | 'rejected' | 'waitlisted';
  documents: ScholarshipDocument[];
  reviewNotes?: string;
  reviewedBy?: ID | any; // MinistryOfficial
  reviewedDate?: DateTime;
  awardDate?: DateTime;
}

export interface ScholarshipDocument {
  type: string;
  url: URL;
  verified: boolean;
}

export interface PaymentSummary {
  totalPaid: number;
  pendingAmount: number;
  upcomingAmount: number;
  overdueAmount: number;
  lastPayment: {
    amount: number;
    date: DateTime;
  };
}

export interface Transaction {
  id: ID;
  date: DateTime;
  description: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  reference: string;
}

export interface Payout {
  id: ID;
  date: DateTime;
  amount: number;
  status: 'processing' | 'completed' | 'failed';
  method: string;
  account: string;
  reference: string;
  estimatedArrival: DateTime;
}