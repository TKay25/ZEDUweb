// src/pages/ministry/SystemHealth.tsx
import React, { useState, useEffect } from 'react';
import {
  Activity, Database, Globe,
  Shield, AlertCircle, CheckCircle,
  XCircle, RefreshCw,
  Cpu, HardDrive
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import ministryAPI from '../../api/ministry.api';
import type { SystemMetrics } from '../../api/ministry.api';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export const SystemHealth: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [timeRange, autoRefresh]);

  const loadMetrics = async () => {
    try {
      const metricsData = await ministryAPI.getSystemMetrics({ timeRange });
      setMetrics(metricsData);
    } catch (error) {
      toast.error('Failed to load system metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadMetrics();
    toast.success('Metrics refreshed');
  };

  const handleRunBackup = async () => {
    try {
      await ministryAPI.runBackup();
      toast.success('Backup started');
    } catch (error) {
      toast.error('Failed to start backup');
    }
  };

  const handleRunSecurityScan = async () => {
    try {
      await ministryAPI.runSecurityScan();
      toast.success('Security scan started');
    } catch (error) {
      toast.error('Failed to start security scan');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'secure':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'degraded':
      case 'warning':
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'down':
      case 'critical':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'secure':
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
      case 'warning':
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'down':
      case 'critical':
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">System Health & Monitoring</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
          <label className="flex items-center mt-6">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">Auto-refresh</span>
          </label>
          <Button variant="outline" onClick={handleRefresh} className="mt-6">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-lg font-semibold">System Status</h2>
          <Badge className={getStatusColor(metrics.overview.status)}>
            <span className="flex items-center">
              {getStatusIcon(metrics.overview.status)}
              <span className="ml-1 capitalize">{metrics.overview.status}</span>
            </span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-gray-500">Uptime</p>
            <p className="text-xl font-bold">{metrics.overview.uptime}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Response Time</p>
            <p className="text-xl font-bold">{metrics.overview.responseTime}ms</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-xl font-bold">{metrics.overview.activeUsers.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Requests/min</p>
            <p className="text-xl font-bold">{metrics.overview.requestsPerMinute.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Error Rate</p>
            <p className={`text-xl font-bold ${
              metrics.overview.errorRate < 1 ? 'text-green-600' :
              metrics.overview.errorRate < 5 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.overview.errorRate}%
            </p>
          </div>
        </div>

        {metrics.overview.lastIncident && (
          <p className="mt-4 text-sm text-gray-500">
            Last incident: {format(new Date(metrics.overview.lastIncident), 'MMM d, yyyy h:mm a')}
          </p>
        )}
      </Card>

      {/* Custom Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex flex-nowrap gap-4">
          {['overview', 'services', 'performance', 'errors', 'usage', 'security', 'backups'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'overview' ? 'Overview' :
               tab === 'services' ? 'Services' :
               tab === 'performance' ? 'Performance' :
               tab === 'errors' ? `Errors (${metrics.errors.recent.length})` :
               tab === 'usage' ? 'Usage Analytics' :
               tab === 'security' ? 'Security' : 'Backups'}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">CPU Usage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics.performance.cpu}>
                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#cpuGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Memory Usage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics.performance.memory}>
                  <defs>
                    <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#memoryGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Services Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Services Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.services.map(service => (
                <Card key={service.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {service.type === 'api' && <Globe className="w-4 h-4 text-blue-500 mr-2" />}
                      {service.type === 'database' && <Database className="w-4 h-4 text-green-500 mr-2" />}
                      {service.type === 'cache' && <Cpu className="w-4 h-4 text-yellow-500 mr-2" />}
                      {service.type === 'storage' && <HardDrive className="w-4 h-4 text-purple-500 mr-2" />}
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Uptime: {service.uptime}%</p>
                    <p>Response: {service.responseTime}ms</p>
                    {service.metrics.cpu && <p>CPU: {service.metrics.cpu}%</p>}
                    {service.metrics.memory && <p>Memory: {service.metrics.memory}%</p>}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          {metrics.services.map(service => (
            <Card key={service.id} className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      {service.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Last checked: {format(new Date(service.lastChecked), 'MMM d, yyyy h:mm:ss a')}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Uptime</p>
                  <p className="text-xl font-bold">{service.uptime}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Response Time</p>
                  <p className="text-xl font-bold">{service.responseTime}ms</p>
                </div>
                {service.metrics.connections !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500">Connections</p>
                    <p className="text-xl font-bold">{service.metrics.connections}</p>
                  </div>
                )}
                {service.metrics.disk !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500">Disk Usage</p>
                    <p className="text-xl font-bold">{service.metrics.disk}%</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Network Traffic */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Network Traffic</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={metrics.performance.network}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="inbound" stroke="#3b82f6" name="Inbound (MB/s)" />
                <Line type="monotone" dataKey="outbound" stroke="#10b981" name="Outbound (MB/s)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Resource Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">CPU Average</h3>
              <p className="text-3xl font-bold text-primary-600">
                {(metrics.performance.cpu.reduce((acc, val) => acc + val.value, 0) / metrics.performance.cpu.length).toFixed(1)}%
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Memory Average</h3>
              <p className="text-3xl font-bold text-green-600">
                {(metrics.performance.memory.reduce((acc, val) => acc + val.value, 0) / metrics.performance.memory.length).toFixed(1)}%
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Disk Average</h3>
              <p className="text-3xl font-bold text-purple-600">
                {(metrics.performance.disk.reduce((acc, val) => acc + val.value, 0) / metrics.performance.disk.length).toFixed(1)}%
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Errors Tab */}
      {activeTab === 'errors' && (
        <div className="space-y-6">
          {/* Error Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Errors by Type</h3>
              <div className="space-y-3">
                {metrics.errors.byType.map(item => (
                  <div key={item.type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.type}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(item.count / metrics.errors.recent.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Errors by Service</h3>
              <div className="space-y-3">
                {metrics.errors.byService.map(item => (
                  <div key={item.service}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.service}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${(item.count / metrics.errors.recent.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Errors */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Errors</h3>
            <div className="space-y-4">
              {metrics.errors.recent.map(error => (
                <div key={error.id} className="flex flex-col sm:flex-row items-start p-4 bg-gray-50 rounded-lg gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                    error.level === 'error' ? 'bg-red-500' :
                    error.level === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <p className="font-medium">{error.message}</p>
                      <Badge className={
                        error.level === 'error' ? 'bg-red-100 text-red-800' :
                        error.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {error.level}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                      <span>{error.service}</span>
                      <span>•</span>
                      <span>{format(new Date(error.timestamp), 'MMM d, h:mm:ss a')}</span>
                      <span>•</span>
                      <span>Occurred {error.count} times</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          {/* Daily Active Users */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Active Users</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.usage.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="users" fill="#3b82f6" name="Users" />
                <Bar yAxisId="right" dataKey="requests" fill="#10b981" name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Feature Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Feature Usage</h3>
              <div className="space-y-3">
                {metrics.usage.features.map(feature => (
                  <div key={feature.feature}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{feature.feature}</span>
                      <span className="font-medium">{feature.usage.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(feature.usage / Math.max(...metrics.usage.features.map(f => f.usage))) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Usage by Region</h3>
              <div className="space-y-3">
                {metrics.usage.regions.map(region => (
                  <div key={region.region}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{region.region}</span>
                      <span className="font-medium">{region.users.toLocaleString()} users</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(region.users / Math.max(...metrics.usage.regions.map(r => r.users))) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security Status */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h3 className="text-lg font-semibold">Security Status</h3>
              <Badge className={getStatusColor(metrics.security.status)}>
                {metrics.security.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-red-50">
                <p className="text-sm text-red-600">Critical</p>
                <p className="text-2xl font-bold text-red-700">{metrics.security.vulnerabilities.critical}</p>
              </Card>
              <Card className="p-4 bg-orange-50">
                <p className="text-sm text-orange-600">High</p>
                <p className="text-2xl font-bold text-orange-700">{metrics.security.vulnerabilities.high}</p>
              </Card>
              <Card className="p-4 bg-yellow-50">
                <p className="text-sm text-yellow-600">Medium</p>
                <p className="text-2xl font-bold text-yellow-700">{metrics.security.vulnerabilities.medium}</p>
              </Card>
              <Card className="p-4 bg-blue-50">
                <p className="text-sm text-blue-600">Low</p>
                <p className="text-2xl font-bold text-blue-700">{metrics.security.vulnerabilities.low}</p>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-sm text-gray-500">
                Last scan: {format(new Date(metrics.security.lastScan), 'MMM d, yyyy h:mm a')}
              </p>
              <Button onClick={handleRunSecurityScan}>
                <Shield className="w-4 h-4 mr-2" />
                Run Security Scan
              </Button>
            </div>
          </Card>

          {/* Recent Threats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Security Threats</h3>
            <div className="space-y-4">
              {metrics.security.threats.map(threat => (
                <div key={threat.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      threat.severity === 'critical' ? 'bg-red-500' :
                      threat.severity === 'high' ? 'bg-orange-500' :
                      threat.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="font-medium">{threat.type}</p>
                      <p className="text-sm text-gray-600">Source: {threat.source}</p>
                      <p className="text-xs text-gray-500">{format(new Date(threat.timestamp), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                  <Badge className={
                    threat.status === 'blocked' ? 'bg-green-100 text-green-800' :
                    threat.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {threat.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Backups Tab */}
      {activeTab === 'backups' && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-semibold">Backup Status</h3>
            <Badge className={getStatusColor(metrics.backups.status)}>
              {metrics.backups.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-4">Backup Details</p>
              <div className="space-y-3">
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="text-gray-600">Last Backup:</span>
                  <span className="font-medium">{format(new Date(metrics.backups.lastBackup), 'MMM d, yyyy h:mm a')}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{(metrics.backups.size / 1024 / 1024 / 1024).toFixed(2)} GB</span>
                </div>
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{metrics.backups.location}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="text-gray-600">Schedule:</span>
                  <span className="font-medium capitalize">{metrics.backups.schedule}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="text-gray-600">Retention:</span>
                  <span className="font-medium">{metrics.backups.retention} days</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Backup Health</h4>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: '85%' }}
                    />
                  </div>
                  <span className="ml-3 text-sm font-medium">85%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Backup integrity score</p>
              </div>

              <Button onClick={handleRunBackup}>
                <Database className="w-4 h-4 mr-2" />
                Run Backup Now
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};