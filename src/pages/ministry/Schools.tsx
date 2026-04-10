// src/pages/ministry/Schools.tsx
import React, { useState, useEffect } from 'react';
import {
  School as SchoolIcon, Search, Download,
  Eye, MapPin, Users,
  TrendingUp
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import ministryAPI from '../../api/ministry.api';
import type { School } from '../../api/ministry.api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const Schools: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const schoolsData = await ministryAPI.getAllSchools();
      setSchools(schoolsData);
    } catch (error) {
      toast.error('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.district.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvince = selectedProvince === 'all' || school.province.toLowerCase() === selectedProvince;
    const matchesType = selectedType === 'all' || school.type === selectedType;
    
    return matchesSearch && matchesProvince && matchesType;
  });

  if (loading) {
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
        <h1 className="text-2xl font-bold">Schools Directory</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export List
          </Button>
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'grid' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'list' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name, registration, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Provinces</option>
              <option value="harare">Harare</option>
              <option value="bulawayo">Bulawayo</option>
              <option value="manicaland">Manicaland</option>
              <option value="masvingo">Masvingo</option>
              <option value="midlands">Midlands</option>
              <option value="mashonaland east">Mashonaland East</option>
              <option value="mashonaland west">Mashonaland West</option>
              <option value="matabeleland north">Matabeleland North</option>
              <option value="matabeleland south">Matabeleland South</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="high">High</option>
              <option value="combined">Combined</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Schools Grid/List */}
      {filteredSchools.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.map(school => (
              <Card
                key={school.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/ministry/schools/${school.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                      <SchoolIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{school.name}</h3>
                      <p className="text-xs text-gray-500">{school.registrationNumber}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(school.verification.status)}>
                    {school.verification.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span>{school.district}, {school.province}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span>{school.stats.students.toLocaleString()} students • {school.stats.teachers.toLocaleString()} teachers</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span>Pass Rate: {school.stats.passRate}%</span>
                    <span className={`ml-2 text-xs ${
                      school.performance.trend > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {school.performance.trend > 0 ? '+' : ''}{school.performance.trend}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Rank: #{school.performance.ranking}
                  </span>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSchools.map(school => (
                    <tr 
                      key={school.id} 
                      className="hover:bg-gray-50 cursor-pointer" 
                      onClick={() => navigate(`/ministry/schools/${school.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {school.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {school.registrationNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{school.district}</div>
                        <div className="text-sm text-gray-500">{school.province}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {school.stats.students.toLocaleString()} students
                        </div>
                        <div className="text-sm text-gray-500">
                          {school.stats.teachers.toLocaleString()} teachers
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            school.stats.passRate >= 75 ? 'text-green-600' :
                            school.stats.passRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {school.stats.passRate}%
                          </span>
                          <span className={`ml-2 text-xs ${
                            school.performance.trend > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {school.performance.trend > 0 ? '+' : ''}{school.performance.trend}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(school.verification.status)}>
                          {school.verification.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/ministry/schools/${school.id}`);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      ) : (
        <Card className="p-12 text-center">
          <SchoolIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Schools Found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedProvince !== 'all' || selectedType !== 'all'
              ? 'Try adjusting your filters'
              : 'No schools have been registered yet'}
          </p>
        </Card>
      )}
    </div>
  );
};