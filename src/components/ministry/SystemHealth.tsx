import React, { useState, useEffect } from 'react';
import {
  Activity, Server, Database, Globe,
  AlertCircle, CheckCircle, XCircle,
  Clock, RefreshCw,
  TrendingUp, TrendingDown, Cpu,
  HardDrive, Shield
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Service {
  id: string;
  name: string;
  type: 'api' | 'database' | 'cache' | 'storage' | 'ai' | 'video' | 'email' | 'sms';
  status: 'operational' | 'degraded' | 'down' | 'maintenance';
  uptime: number;
  responseTime: number;
  lastChecked: Date;
  metrics: {
    requests: number;
    errors: number;
    latency: number[];
  };
}

interface SystemHealthProps {
  services: Service[];
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    activeUsers: number;
    requestRate: number;
    errorRate: number;
  };
  incidents: Array<{
    id: string;
    title: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    service: string;
    timestamp: Date;
    message: string;
  }>;
  onRefresh: () => void;
  onServiceRestart: (serviceId: string) => Promise<void>;
  onViewLogs: (serviceId: string) => void;
  onConfigureAlert: () => void;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({
  services,
  metrics,
  incidents,
  onRefresh,
  onServiceRestart,
  onViewLogs,
  onConfigureAlert
}) => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(onRefresh, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, onRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'down': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4" />;
      case 'degraded': return <AlertCircle className="w-4 h-4" />;
      case 'down': return <XCircle className="w-4 h-4" />;
      case 'maintenance': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const overallHealth = () => {
    const operational = services.filter(s => s.status === 'operational').length;
    const total = services.length;
    return total === 0 ? 0 : (operational / total) * 100;
  };

  // Remove unused variable - just comment it out or remove
  // const averageUptime = services.reduce((acc, s) => acc + s.uptime, 0) / services.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Health Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Clock className="w-4 h-4 mr-2" />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={onConfigureAlert}>
            <Shield className="w-4 h-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overall System Health</p>
              <p className="text-3xl font-bold text-primary-600">
                {overallHealth().toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {services.filter(s => s.status === 'operational').length}
              </p>
              <p className="text-sm text-gray-500">Operational</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {services.filter(s => s.status === 'degraded').length}
              </p>
              <p className="text-sm text-gray-500">Degraded</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {services.filter(s => s.status === 'down').length}
              </p>
              <p className="text-sm text-gray-500">Down</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {services.filter(s => s.status === 'maintenance').length}
              </p>
              <p className="text-sm text-gray-500">Maintenance</p>
            </div>
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${overallHealth()}%` }}
          />
        </div>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Cpu className="w-5 h-5 text-blue-500" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{metrics.cpu}%</p>
          <p className="text-sm text-gray-500">CPU Usage</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <HardDrive className="w-5 h-5 text-purple-500" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{metrics.memory}%</p>
          <p className="text-sm text-gray-500">Memory Usage</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-green-500" />
            <TrendingDown className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{metrics.disk}%</p>
          <p className="text-sm text-gray-500">Disk Usage</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-5 h-5 text-yellow-500" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{metrics.network} Mbps</p>
          <p className="text-sm text-gray-500">Network</p>
        </Card>
      </div>

      {/* Active Users & Request Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Active Users</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">{metrics.activeUsers}</p>
              <p className="text-sm text-gray-500">Currently online</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Request Rate</p>
              <p className="text-xl font-bold">{metrics.requestRate}/s</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Error Rate</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-3xl font-bold ${
                metrics.errorRate < 1 ? 'text-green-600' :
                metrics.errorRate < 5 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {metrics.errorRate}%
              </p>
              <p className="text-sm text-gray-500">Last 24 hours</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Avg Response</p>
              <p className="text-xl font-bold">
                {(services.reduce((acc, s) => acc + s.responseTime, 0) / services.length).toFixed(0)}ms
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Services Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Services Status</h3>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedService(service.id === selectedService ? null : service.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {service.type === 'api' && <Globe className="w-5 h-5" />}
                  {service.type === 'database' && <Database className="w-5 h-5" />}
                  {service.type === 'cache' && <Server className="w-5 h-5" />}
                  {service.type === 'storage' && <HardDrive className="w-5 h-5" />}
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-gray-500">Type: {service.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(service.status)}>
                    <span className="flex items-center">
                      {getStatusIcon(service.status)}
                      <span className="ml-1 capitalize">{service.status}</span>
                    </span>
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Uptime: {service.uptime}%
                  </span>
                  <span className="text-sm text-gray-500">
                    {service.responseTime}ms
                  </span>
                </div>
              </div>

              {selectedService === service.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Requests</p>
                      <p className="text-lg font-semibold">{service.metrics.requests}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Errors</p>
                      <p className="text-lg font-semibold text-red-600">{service.metrics.errors}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Error Rate</p>
                      <p className="text-lg font-semibold">
                        {service.metrics.requests > 0 
                          ? ((service.metrics.errors / service.metrics.requests) * 100).toFixed(2)
                          : '0'}%
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onServiceRestart(service.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Restart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewLogs(service.id)}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      View Logs
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Active Incidents */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Incidents</h3>
        {incidents.length > 0 ? (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div key={incident.id} className="border-l-4 border-red-500 bg-red-50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-800">
                        {incident.status}
                      </Badge>
                      <span className="text-sm text-gray-600">{incident.service}</span>
                    </div>
                    <h4 className="font-medium mb-1">{incident.title}</h4>
                    <p className="text-sm text-gray-600">{incident.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(incident.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">No active incidents</p>
          </div>
        )}
      </Card>
    </div>
  );
};