import React, { useState } from 'react';
import {
  FileText, Download, ChevronRight,
  TrendingUp, Users, Clock,
  CheckCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import Tabs from '../ui/Tabs';
import { toast } from 'react-hot-toast';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'checkbox' | 'radio';
    options?: string[];
    required: boolean;
  }>;
}

interface ReportGeneratorProps {
  templates: ReportTemplate[];
  onGenerateReport: (templateId: string, params: any) => Promise<any>;
  onDownloadReport: (reportId: string, format: 'pdf' | 'excel' | 'csv') => void;
  onScheduleReport: (templateId: string, schedule: any) => Promise<void>;
  savedReports: Array<{
    id: string;
    name: string;
    date: Date;
    format: string;
    url: string;
  }>;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  templates,
  onGenerateReport,
  onDownloadReport,
  onScheduleReport,
  savedReports
}) => {
  const [activeTab, setActiveTab] = useState('create');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportParams, setReportParams] = useState<Record<string, any>>({});
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleConfig, setScheduleConfig] = useState({
    frequency: 'monthly',
    day: 1,
    time: '08:00',
    email: '',
    format: 'pdf'
  });

  // Options for selects
  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' }
  ];

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    const initialParams: Record<string, any> = {};
    template.fields.forEach(field => {
      initialParams[field.name] = field.type === 'checkbox' ? false : '';
    });
    setReportParams(initialParams);
    setGeneratedReport(null);
  };

  const handleParamChange = (name: string, value: any) => {
    setReportParams(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    // Validate required fields
    const missingFields = selectedTemplate.fields
      .filter(f => f.required && !reportParams[f.name])
      .map(f => f.label);

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setGenerating(true);
      const report = await onGenerateReport(selectedTemplate.id, reportParams);
      setGeneratedReport(report);
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleSchedule = async () => {
    if (!selectedTemplate) return;
    try {
      await onScheduleReport(selectedTemplate.id, scheduleConfig);
      setShowScheduleModal(false);
      toast.success('Report scheduled successfully');
    } catch (error) {
      toast.error('Failed to schedule report');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'enrollment': return <Users className="w-5 h-5" />;
      case 'performance': return <TrendingUp className="w-5 h-5" />;
      case 'financial': return <FileText className="w-5 h-5" />;
      case 'compliance': return <CheckCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  // Tabs configuration
  const tabs = [
    { key: 'create', label: 'Create Report' },
    { key: 'saved', label: 'Saved Reports' },
    { key: 'scheduled', label: 'Scheduled Reports' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Report Generator</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setActiveTab('saved')}>
            <Clock className="w-4 h-4 mr-2" />
            Saved Reports
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        items={tabs}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      {/* Create Report Tab */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold">Report Templates</h2>
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    {getCategoryIcon(template.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>

          {/* Report Configuration */}
          <div className="lg:col-span-2">
            {selectedTemplate ? (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">{selectedTemplate.name}</h2>
                <p className="text-gray-600 mb-6">{selectedTemplate.description}</p>

                <div className="space-y-4">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <Select
                          value={reportParams[field.name] || ''}
                          onChange={(e) => handleParamChange(field.name, e.target.value)}
                          options={field.options?.map(opt => ({ value: opt, label: opt })) || []}
                          placeholder="Select..."
                        />
                      ) : field.type === 'date' ? (
                        <Input
                          type="date"
                          value={reportParams[field.name] || ''}
                          onChange={(e) => handleParamChange(field.name, e.target.value)}
                        />
                      ) : field.type === 'checkbox' ? (
                        <Checkbox
                          checked={reportParams[field.name] || false}
                          onChange={(e) => handleParamChange(field.name, e.target.checked)}
                          label={field.label}
                        />
                      ) : (
                        <Input
                          type={field.type}
                          value={reportParams[field.name] || ''}
                          onChange={(e) => handleParamChange(field.name, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button
                    variant="primary"
                    onClick={handleGenerate}
                    loading={generating}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowScheduleModal(true)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>

                {/* Generated Report Preview */}
                {generatedReport && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">Generated Report</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium">{generatedReport.name}</p>
                          <p className="text-sm text-gray-500">
                            Generated: {new Date().toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDownloadReport(generatedReport.id, 'pdf')}
                          >
                            PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDownloadReport(generatedReport.id, 'excel')}
                          >
                            Excel
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDownloadReport(generatedReport.id, 'csv')}
                          >
                            CSV
                          </Button>
                        </div>
                      </div>
                      <div className="aspect-[16/9] bg-white rounded border flex items-center justify-center">
                        <p className="text-gray-400">Report preview would appear here</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">Select a Template</h3>
                <p className="text-gray-500">
                  Choose a report template from the left to get started
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Saved Reports Tab */}
      {activeTab === 'saved' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Saved Reports</h2>
          <div className="space-y-3">
            {savedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-xs text-gray-500">
                      Generated: {new Date(report.date).toLocaleString()} • Format: {report.format.toUpperCase()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownloadReport(report.id, report.format as any)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedTemplate && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Schedule Report</h2>
            <p className="text-sm text-gray-600 mb-4">
              {selectedTemplate.name}
            </p>

            <div className="space-y-4">
              <Select
                label="Frequency"
                value={scheduleConfig.frequency}
                onChange={(e) => setScheduleConfig(prev => ({ ...prev, frequency: e.target.value }))}
                options={frequencyOptions}
              />

              <Input
                type="number"
                label="Day of Month"
                value={scheduleConfig.day}
                onChange={(e) => setScheduleConfig(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                min={1}
                max={31}
              />

              <Input
                type="time"
                label="Time"
                value={scheduleConfig.time}
                onChange={(e) => setScheduleConfig(prev => ({ ...prev, time: e.target.value }))}
              />

              <Input
                type="email"
                label="Email to"
                value={scheduleConfig.email}
                onChange={(e) => setScheduleConfig(prev => ({ ...prev, email: e.target.value }))}
                placeholder="recipient@example.com"
              />

              <Select
                label="Format"
                value={scheduleConfig.format}
                onChange={(e) => setScheduleConfig(prev => ({ ...prev, format: e.target.value }))}
                options={formatOptions}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSchedule}>
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};