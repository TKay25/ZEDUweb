import type { 
  ID, DateTime, Email, PhoneNumber, URL, Address, 
   Jurisdiction 
} from './index';
import type { User } from './user.types';

export interface MinistryOfficial extends User {
  role: 'ministry';
  employeeId: string;
  department: string;
  position: string;
  jurisdiction?: Jurisdiction;
  
  securityClearance?: number;
  permissions?: string[];
}

export interface Ministry {
  id: ID;
  name: string;
  code: string;
  level: 'national' | 'provincial' | 'district';
  parentId?: ID;
  region: string;
  contact: MinistryContact;
  officials: MinistryOfficial[];
  stats: MinistryStats;
  jurisdiction: Jurisdiction;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface MinistryContact {
  email: Email;
  phone: PhoneNumber;
  address: Address;
  website?: URL;
}

export interface MinistryStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  registeredSchools: number;
  verifiedSchools: number;
  pendingVerifications: number;
  graduationRate: number;
  literacyRate: number;
  budget: number;
  expenditure: number;
}

export interface NationalDashboard {
  overview: NationalOverview;
  regionalStats: RegionalStat[];
  trends: NationalTrends;
  alerts: MinistryAlert[];
  compliance: ComplianceSummary;
}

export interface NationalOverview {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  averageClassSize: number;
  studentTeacherRatio: number;
  passRate: number;
  dropoutRate: number;
  budgetUtilization: number;
}

export interface RegionalStat {
  region: string;
  schools: number;
  students: number;
  teachers: number;
  passRate: number;
  compliance: number;
  budget: number;
}

export interface NationalTrends {
  enrollment: TrendData[];
  performance: TrendData[];
  graduation: TrendData[];
  funding: TrendData[];
}

export interface TrendData {
  year: string;
  value: number;
  target?: number;
}

export interface MinistryAlert {
  id: ID;
  type: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  region?: string;
  timestamp: DateTime;
  expiresAt?: DateTime;
}

export interface ComplianceSummary {
  overall: number;
  byCategory: Record<string, number>;
  pending: number;
  expired: number;
  upcoming: number;
}

export interface SchoolVerificationRequest {
  id: ID;
  schoolId: ID;
  schoolName: string;
  registrationNumber: string;
  type: 'initial' | 'renewal' | 'update';
  documents: VerificationDocument[];
  submittedBy: string;
  submittedAt: DateTime;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewing' | 'verified' | 'rejected';
  assignedTo?: ID;
  notes?: string;
}

export interface VerificationDocument {
  id: ID;
  name: string;
  type: string;
  url: URL;
  uploadedAt: DateTime;
  verified?: boolean;
  verifiedAt?: DateTime;
  remarks?: string;
}

export interface MinistryPolicy {
  id: ID;
  title: string;
  reference: string;
  type: 'act' | 'regulation' | 'guideline' | 'circular';
  description: string;
  effectiveDate: DateTime;
  expiryDate?: DateTime;
  jurisdiction: Jurisdiction;
  documentUrl: URL;
  categories: string[];
  status: 'draft' | 'active' | 'archived';
}

export interface ComplianceCheck {
  id: ID;
  schoolId: ID;
  schoolName: string;
  checkType: string;
  dueDate: DateTime;
  status: 'pending' | 'passed' | 'failed' | 'waived';
  findings?: string;
  inspector?: string;
  inspectedAt?: DateTime;
}

export interface MinistryReport {
  id: ID;
  title: string;
  type: 'annual' | 'quarterly' | 'monthly' | 'special';
  period: {
    start: DateTime;
    end: DateTime;
  };
  data: any;
  generatedAt: DateTime;
  format: 'pdf' | 'excel' | 'csv';
  url?: URL;
}

export interface PerformanceMetric {
  id: ID;
  name: string;
  category: string;
  value: number;
  target: number;
  region?: string;
  period: string;
  trend: number;
}

export interface MinistryFilter {
  region?: string;
  level?: 'national' | 'provincial' | 'district';
  type?: string;
  status?: string;
  dateFrom?: DateTime;
  dateTo?: DateTime;
}

export interface RegionSummary {
  id: ID;
  name: string;
  code: string;
  type: 'province' | 'district';
  parent?: string;
  schools: number;
  students: number;
  teachers: number;
  passRate: number;
  compliance: number;
}