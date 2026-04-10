// src/pages/school/Timetable.tsx
import React, { useState, useEffect } from 'react';
import {
  Edit2, Save, Download, Printer,
  ChevronLeft, ChevronRight, Plus,
  X, AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import schoolAPI from '../../api/school.api';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { toast } from 'react-hot-toast';

interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  startTime: string;
  endTime: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  class: {
    id: string;
    name: string;
    grade: string;
  };
  teacher: {
    id: string;
    name: string;
  };
  room: string;
  isBreak?: boolean;
  breakName?: string;
}

interface TimetableData {
  id: string;
  name: string;
  academicYear: string;
  term: string;
  validFrom: Date;
  validTo: Date;
  entries: TimetableEntry[];
  classes: Array<{ id: string; name: string }>;
  teachers: Array<{ id: string; name: string }>;
  rooms: string[];
}

export const Timetable: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timetables, setTimetables] = useState<TimetableData[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<TimetableData | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedView, setSelectedView] = useState<'class' | 'teacher' | 'room'>('class');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [newEntry, setNewEntry] = useState({
    day: 'Monday',
    period: 1,
    subjectId: '',
    classId: '',
    teacherId: '',
    room: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = Array.from({ length: 8 }, (_, i) => i + 1);

  useEffect(() => {
    loadTimetables();
  }, []);

  const loadTimetables = async () => {
    try {
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTimetables: TimetableData[] = [
        {
          id: '1',
          name: 'Main Timetable',
          academicYear: '2024',
          term: 'Term 1',
          validFrom: new Date(),
          validTo: new Date(),
          entries: [
            {
              id: '1',
              day: 'Monday',
              period: 1,
              startTime: '08:00',
              endTime: '08:45',
              subject: { id: 'sub1', name: 'Mathematics', code: 'MATH101' },
              class: { id: 'class1', name: 'Form 1A', grade: 'Form 1' },
              teacher: { id: 't1', name: 'Mr. John Doe' },
              room: '101'
            },
            {
              id: '2',
              day: 'Monday',
              period: 2,
              startTime: '08:45',
              endTime: '09:30',
              subject: { id: 'sub2', name: 'English', code: 'ENG101' },
              class: { id: 'class1', name: 'Form 1A', grade: 'Form 1' },
              teacher: { id: 't2', name: 'Ms. Jane Smith' },
              room: '102'
            }
          ],
          classes: [
            { id: 'class1', name: 'Form 1A' },
            { id: 'class2', name: 'Form 1B' }
          ],
          teachers: [
            { id: 't1', name: 'Mr. John Doe' },
            { id: 't2', name: 'Ms. Jane Smith' }
          ],
          rooms: ['101', '102', '103', '104', '105']
        }
      ];
      
      setTimetables(mockTimetables);
      if (mockTimetables.length > 0) {
        setSelectedTimetable(mockTimetables[0]);
      }
    } catch (error) {
      toast.error('Failed to load timetables');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEntry = async (entryId: string) => {
    if (!window.confirm('Are you sure you want to remove this entry?')) return;
    
    try {
      setSelectedTimetable(prev => prev ? {
        ...prev,
        entries: prev.entries.filter(e => e.id !== entryId)
      } : null);
      toast.success('Entry removed successfully');
    } catch (error) {
      toast.error('Failed to remove entry');
      console.error(error);
    }
  };

  const handleExportTimetable = async () => {
    try {
      await schoolAPI.generateReport('timetable', undefined, selectedTimetable?.id);
      toast.success('Timetable exported successfully');
    } catch (error) {
      toast.error('Failed to export timetable');
      console.error(error);
    }
  };

  const handleAddEntry = () => {
    if (!selectedTimetable) return;
    
    // Create a new entry
    const subjectMap: { [key: string]: any } = {
      'sub1': { id: 'sub1', name: 'Mathematics', code: 'MATH101' },
      'sub2': { id: 'sub2', name: 'English', code: 'ENG101' }
    };
    
    const classMap: { [key: string]: any } = {
      'class1': { id: 'class1', name: 'Form 1A', grade: 'Form 1' },
      'class2': { id: 'class2', name: 'Form 1B', grade: 'Form 1' }
    };
    
    const teacherMap: { [key: string]: any } = {
      't1': { id: 't1', name: 'Mr. John Doe' },
      't2': { id: 't2', name: 'Ms. Jane Smith' }
    };
    
    const newEntryComplete: TimetableEntry = {
      id: Date.now().toString(),
      day: newEntry.day as any,
      period: newEntry.period,
      startTime: `${8 + Math.floor((newEntry.period - 1) / 2)}:${(newEntry.period - 1) % 2 === 0 ? '00' : '45'}`,
      endTime: `${8 + Math.floor((newEntry.period - 1) / 2)}:${(newEntry.period - 1) % 2 === 0 ? '45' : '30'}`,
      subject: subjectMap[newEntry.subjectId] || { id: 'sub1', name: 'Mathematics', code: 'MATH101' },
      class: classMap[newEntry.classId] || { id: 'class1', name: 'Form 1A', grade: 'Form 1' },
      teacher: teacherMap[newEntry.teacherId] || { id: 't1', name: 'Mr. John Doe' },
      room: newEntry.room
    };
    
    // Check for conflicts
    const hasConflict = selectedTimetable.entries.some(e => 
      e.day === newEntryComplete.day &&
      e.period === newEntryComplete.period &&
      (e.teacher.id === newEntryComplete.teacher.id || e.room === newEntryComplete.room)
    );
    
    if (hasConflict) {
      setConflicts([{
        teacher: newEntryComplete.teacher,
        subject: newEntryComplete.subject,
        room: newEntryComplete.room,
        day: newEntryComplete.day,
        period: newEntryComplete.period
      }]);
      toast.error('Schedule conflict detected');
      return;
    }
    
    setSelectedTimetable(prev => prev ? {
      ...prev,
      entries: [...prev.entries, newEntryComplete]
    } : null);
    
    toast.success('Entry added successfully');
    setShowAddEntry(false);
    setNewEntry({
      day: 'Monday',
      period: 1,
      subjectId: '',
      classId: '',
      teacherId: '',
      room: ''
    });
  };

  const getFilteredEntries = () => {
    if (!selectedTimetable) return [];
    
    return selectedTimetable.entries.filter(entry => {
      if (selectedView === 'class' && selectedClass !== 'all') {
        return entry.class.id === selectedClass;
      }
      if (selectedView === 'teacher' && selectedTeacher !== 'all') {
        return entry.teacher.id === selectedTeacher;
      }
      return true;
    });
  };

  if (loading || !selectedTimetable) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Timetable Management</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleExportTimetable}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <Edit2 className="w-4 h-4 mr-2" />
            )}
            {isEditing ? 'Save Changes' : 'Edit Timetable'}
          </Button>
        </div>
      </div>

      {/* Timetable Selector and Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimetable.id}
              onChange={(e) => {
                const timetable = timetables.find(t => t.id === e.target.value);
                setSelectedTimetable(timetable || null);
              }}
              className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {timetables.map(t => (
                <option key={t.id} value={t.id}>{t.name} - {t.term} {t.academicYear}</option>
              ))}
            </select>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm whitespace-nowrap">
                Week of {format(startOfWeek(currentWeek), 'MMM d')} - {format(endOfWeek(currentWeek), 'MMM d, yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value as any)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="class">By Class</option>
              <option value="teacher">By Teacher</option>
              <option value="room">By Room</option>
            </select>

            {selectedView === 'class' && (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Classes</option>
                {selectedTimetable.classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}

            {selectedView === 'teacher' && (
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Teachers</option>
                {selectedTimetable.teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </Card>

      {/* Timetable Grid */}
      <Card className="p-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 bg-gray-50 border text-left">Period</th>
              {days.map(day => (
                <th key={day} className="p-3 bg-gray-50 border text-left">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => {
              const periodEntry = getFilteredEntries().find(e => e.period === period);
              return (
                <tr key={period}>
                  <td className="p-3 border font-medium bg-gray-50">
                    <div>Period {period}</div>
                    <div className="text-xs text-gray-500">
                      {periodEntry?.startTime || '08:00'} - {periodEntry?.endTime || '08:45'}
                    </div>
                  </td>
                  {days.map(day => {
                    const entries = getFilteredEntries().filter(
                      e => e.day === day && e.period === period
                    );
                    const entry = entries[0];
                    const hasConflict = conflicts.some(c => 
                      c.day === day && c.period === period
                    );

                    return (
                      <td key={`${day}-${period}`} className={`p-2 border relative ${
                        hasConflict ? 'bg-red-50' : ''
                      }`}>
                        {entry ? (
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <p className="font-medium text-sm">{entry.subject.name}</p>
                            <p className="text-xs text-gray-600">{entry.class.name}</p>
                            <p className="text-xs text-gray-600">{entry.teacher.name}</p>
                            <p className="text-xs text-gray-500">Room {entry.room}</p>
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveEntry(entry.id)}
                                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          isEditing && (
                            <button
                              onClick={() => setShowAddEntry(true)}
                              className="w-full h-full min-h-[80px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          )
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Timetable Entry</h2>
              <button
                onClick={() => setShowAddEntry(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Day</label>
                <select
                  value={newEntry.day}
                  onChange={(e) => setNewEntry({ ...newEntry, day: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <select
                  value={newEntry.period}
                  onChange={(e) => setNewEntry({ ...newEntry, period: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {periods.map(p => (
                    <option key={p} value={p}>Period {p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select
                  value={newEntry.subjectId}
                  onChange={(e) => setNewEntry({ ...newEntry, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Subject</option>
                  <option value="sub1">Mathematics</option>
                  <option value="sub2">English</option>
                  <option value="sub3">Science</option>
                  <option value="sub4">History</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <select
                  value={newEntry.classId}
                  onChange={(e) => setNewEntry({ ...newEntry, classId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Class</option>
                  {selectedTimetable.classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Teacher</label>
                <select
                  value={newEntry.teacherId}
                  onChange={(e) => setNewEntry({ ...newEntry, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Teacher</option>
                  {selectedTimetable.teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Room</label>
                <select
                  value={newEntry.room}
                  onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Room</option>
                  {selectedTimetable.rooms.map(room => (
                    <option key={room} value={room}>Room {room}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddEntry(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleAddEntry}
                  disabled={!newEntry.subjectId || !newEntry.classId || !newEntry.teacherId || !newEntry.room}
                >
                  Add Entry
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Conflict Warning */}
      {conflicts.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Schedule Conflicts Detected</h3>
              <ul className="mt-2 space-y-1">
                {conflicts.map((conflict, index) => (
                  <li key={index} className="text-sm text-red-700">
                    {conflict.teacher.name} is already assigned to {conflict.subject.name} in {conflict.room} at {conflict.day} Period {conflict.period}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};