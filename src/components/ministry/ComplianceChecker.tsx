import React, { useState } from 'react';
import {
  CheckCircle, XCircle, AlertCircle, Clock,
  FileText, Download, Filter, Search,
  Building
} from 'lucide-react';
// Fix: Import using named exports as seen in other components
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

interface ComplianceRequirement {
  id: string;
  name: string;
  category: 'registration' | 'infrastructure' | 'staffing' | 'curriculum' | 'safety' | 'finance';
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'pending';
  score: number;
  weight: number;
  lastChecked: Date;
  nextCheck: Date;
  findings?: string[];
}

interface Institution {
  id: string;
  name: string;
  type: string;
  province: string;
  district: string;
  overallCompliance: number;
  requirements: ComplianceRequirement[];
  risk: 'low' | 'medium' | 'high';
  lastAudit: Date;
  nextAudit: Date;
}

interface ComplianceCheckerProps {
  institutions: Institution[];
  onViewDetails: (institutionId: string) => void;
  onScheduleAudit: (institutionId: string) => void;
  onGenerateReport: (institutionId: string) => void;
  onExportData: () => void;
  onUpdateRequirement?: (institutionId: string, requirementId: string, status: string) => Promise<void>;
}

export const ComplianceChecker: React.FC<ComplianceCheckerProps> = ({
  institutions,
  onViewDetails,
  onScheduleAudit,
  onGenerateReport,
  onExportData,
  onUpdateRequirement: _onUpdateRequirement
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'partial': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'non-compliant': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = selectedProvince === 'all' || inst.province === selectedProvince;
    const matchesRisk = selectedRisk === 'all' || inst.risk === selectedRisk;
    return matchesSearch && matchesProvince && matchesRisk;
  });

  const overallStats = {
    total: institutions.length,
    compliant: institutions.filter(i => i.overallCompliance >= 90).length,
    partial: institutions.filter(i => i.overallCompliance >= 70 && i.overallCompliance < 90).length,
    nonCompliant: institutions.filter(i => i.overallCompliance < 70).length,
    highRisk: institutions.filter(i => i.risk === 'high').length
  };

  const provinceOptions = [
    { value: 'all', label: 'All Provinces' },
    { value: 'Harare', label: 'Harare' },
    { value: 'Bulawayo', label: 'Bulawayo' },
    { value: 'Manicaland', label: 'Manicaland' },
    { value: 'Mashonaland Central', label: 'Mashonaland Central' },
    { value: 'Mashonaland East', label: 'Mashonaland East' },
    { value: 'Mashonaland West', label: 'Mashonaland West' },
    { value: 'Masvingo', label: 'Masvingo' },
    { value: 'Matabeleland North', label: 'Matabeleland North' },
    { value: 'Matabeleland South', label: 'Matabeleland South' },
    { value: 'Midlands', label: 'Midlands' }
  ];

  const riskOptions = [
    { value: 'all', label: 'All Risk Levels' },
    { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high', label: 'High Risk' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Compliance Monitoring System</h1>
        <Button variant="outline" onClick={onExportData}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Institutions</p>
          <p className="text-2xl font-bold">{overallStats.total}</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <p className="text-sm text-green-700">Compliant</p>
          <p className="text-2xl font-bold text-green-700">{overallStats.compliant}</p>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <p className="text-sm text-yellow-700">Partial</p>
          <p className="text-2xl font-bold text-yellow-700">{overallStats.partial}</p>
        </Card>
        <Card className="p-4 bg-red-50">
          <p className="text-sm text-red-700">Non-Compliant</p>
          <p className="text-2xl font-bold text-red-700">{overallStats.nonCompliant}</p>
        </Card>
        <Card className="p-4 bg-orange-50">
          <p className="text-sm text-orange-700">High Risk</p>
          <p className="text-2xl font-bold text-orange-700">{overallStats.highRisk}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search institutions..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Select
            value={selectedProvince}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProvince(e.target.value)}
            options={provinceOptions}
          />
          <Select
            value={selectedRisk}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRisk(e.target.value)}
            options={riskOptions}
          />
          <Button variant="ghost">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Compliance */}
        <Card className="p-6 col-span-1">
          <h3 className="text-lg font-semibold mb-4">Compliance by Category</h3>
          <div className="space-y-3">
            {['Registration', 'Infrastructure', 'Staffing', 'Curriculum', 'Safety', 'Finance'].map((category) => (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{category}</span>
                  <span className="font-medium">85%</span>
                </div>
                <ProgressBar value={85} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Risk Distribution */}
        <Card className="p-6 col-span-1">
          <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                <span className="text-sm">Low Risk</span>
              </div>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                <span className="text-sm">Medium Risk</span>
              </div>
              <span className="font-medium">35%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                <span className="text-sm">High Risk</span>
              </div>
              <span className="font-medium">20%</span>
            </div>
          </div>
        </Card>

        {/* Upcoming Audits */}
        <Card className="p-6 col-span-1">
          <h3 className="text-lg font-semibold mb-4">Upcoming Audits</h3>
          <div className="space-y-3">
            {institutions.slice(0, 3).map((inst) => (
              <div key={inst.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{inst.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(inst.nextAudit).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getRiskColor(inst.risk)}>
                  {inst.risk} risk
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Institutions List */}
      <div className="space-y-4">
        {filteredInstitutions.map((institution) => (
          <Card key={institution.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold">{institution.name}</h3>
                  <Badge className={getRiskColor(institution.risk)}>
                    {institution.risk} risk
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Last Audit: {new Date(institution.lastAudit).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{institution.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{institution.district}, {institution.province}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Audit</p>
                    <p className="font-medium">{new Date(institution.nextAudit).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Overall Compliance */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Overall Compliance</span>
                    <span className={`text-lg font-bold ${getComplianceColor(institution.overallCompliance)}`}>
                      {institution.overallCompliance}%
                    </span>
                  </div>
                  <ProgressBar 
                    value={institution.overallCompliance} 
                    className="h-3"
                  />
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-3 gap-4">
                  {institution.requirements.slice(0, 6).map((req) => (
                    <div key={req.id} className="flex items-center space-x-2">
                      {getStatusIcon(req.status)}
                      <span className="text-sm text-gray-600">{req.name}</span>
                    </div>
                  ))}
                </div>

                {/* Findings */}
                {institution.requirements.some(r => r.findings && r.findings.length > 0) && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Findings:</p>
                    <ul className="list-disc list-inside text-sm text-yellow-700">
                      {institution.requirements
                        .filter(r => r.findings)
                        .flatMap(r => r.findings || [])
                        .slice(0, 2)
                        .map((finding, idx) => (
                          <li key={idx}>{finding}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(institution.id)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onScheduleAudit(institution.id)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Audit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGenerateReport(institution.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};