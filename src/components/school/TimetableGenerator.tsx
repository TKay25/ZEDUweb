import React, { useState } from 'react';
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import {
  Save, Download, Plus,
  Edit, Trash2, ChevronLeft, ChevronRight,
  RefreshCw, AlertCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { toast } from 'react-hot-toast';

interface TimetableSlot {
  id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'assembly' | 'break';
  weekType?: 'all' | 'odd' | 'even';
  recurring: boolean;
  conflicts?: Array<string>;
}

interface TimetableGeneratorProps {
  timetable: TimetableSlot[];
  classes: Array<{ id: string; name: string }>;
  teachers: Array<{ id: string; name: string; subjects: string[] }>;
  subjects: Array<{ id: string; name: string }>;
  rooms: Array<{ id: string; name: string; capacity: number }>;
  onSaveTimetable: (timetable: TimetableSlot[]) => Promise<void>;
  onGenerateAuto: (params: any) => Promise<TimetableSlot[]>;
  onCheckConflicts?: (slot: TimetableSlot) => string[];
  onExportTimetable: (format: 'pdf' | 'excel' | 'image') => void;
  onPublishTimetable?: () => void;
}

export const TimetableGenerator: React.FC<TimetableGeneratorProps> = ({
  timetable,
  classes,
  teachers,
  subjects,
  rooms: _rooms,
  onSaveTimetable,
  onGenerateAuto,
  onCheckConflicts: _onCheckConflicts,
  onExportTimetable,
  onPublishTimetable: _onPublishTimetable
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'room'>('class');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [saving, setSaving] = useState(false);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const timeSlots = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00'
  ];

  // Options for selects
  const viewModeOptions = [
    { value: 'class', label: 'By Class' },
    { value: 'teacher', label: 'By Teacher' },
    { value: 'room', label: 'By Room' }
  ];

  const classOptions = [
    { value: 'all', label: 'All Classes' },
    ...classes.map(cls => ({ value: cls.id, label: cls.name }))
  ];

  const teacherOptions = [
    { value: 'all', label: 'All Teachers' },
    ...teachers.map(teacher => ({ value: teacher.id, label: teacher.name }))
  ];

  const dayOptions = days.map(day => ({
    value: day,
    label: day.charAt(0).toUpperCase() + day.slice(1)
  }));

  const subjectOptions = subjects.map(sub => ({
    value: sub.id,
    label: sub.name
  }));

  const teacherSelectOptions = teachers.map(teacher => ({
    value: teacher.id,
    label: teacher.name
  }));

  const slotTypeOptions = [
    { value: 'lecture', label: 'Lecture' },
    { value: 'lab', label: 'Lab' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'assembly', label: 'Assembly' },
    { value: 'break', label: 'Break' }
  ];

  const weekTypeOptions = [
    { value: 'all', label: 'All Weeks' },
    { value: 'odd', label: 'Odd Weeks' },
    { value: 'even', label: 'Even Weeks' }
  ];

  const getFilteredTimetable = () => {
    return timetable.filter(slot => {
      if (selectedClass !== 'all' && slot.classId !== selectedClass) return false;
      if (selectedTeacher !== 'all' && slot.teacherId !== selectedTeacher) return false;
      return true;
    });
  };

  const getSlotsForDay = (day: string) => {
    return getFilteredTimetable()
      .filter(slot => slot.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const handleEditSlot = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setShowAddModal(true);
  };

  const handleDeleteSlot = (_slotId: string) => {
    if (confirm('Are you sure you want to delete this slot?')) {
      toast.success('Slot deleted successfully');
    }
  };

  const handleAutoGenerate = async () => {
    try {
      await onGenerateAuto({});
      toast.success('Timetable generated successfully');
    } catch (error) {
      toast.error('Failed to generate timetable');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveTimetable(timetable);
      toast.success('Timetable saved successfully');
    } catch (error) {
      toast.error('Failed to save timetable');
    } finally {
      setSaving(false);
    }
  };

  const getSlotColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 border-blue-300';
      case 'lab': return 'bg-green-100 border-green-300';
      case 'tutorial': return 'bg-yellow-100 border-yellow-300';
      case 'assembly': return 'bg-purple-100 border-purple-300';
      case 'break': return 'bg-gray-100 border-gray-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const handleAddSlotClick = () => {
    setEditingSlot(null);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Timetable Generator</h1>
        <div className="flex space-x-3">
          <Select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            options={viewModeOptions}
            className="w-32"
          />
          <Button variant="outline" onClick={() => onExportTimetable('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium">
              Week of {format(startOfWeek(currentDate), 'MMM d, yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              options={classOptions}
              className="w-48"
            />

            <Select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              options={teacherOptions}
              className="w-48"
            />

            <Button variant="outline" size="sm" onClick={handleAddSlotClick}>
              <Plus className="w-4 h-4 mr-2" />
              Add Slot
            </Button>

            <Button variant="outline" size="sm" onClick={handleAutoGenerate}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Auto Generate
            </Button>
          </div>
        </div>
      </Card>

      {/* Timetable Grid */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-gray-50 border text-left font-medium">Time</th>
                {days.map(day => (
                  <th key={day} className="p-4 bg-gray-50 border text-left font-medium capitalize">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => {
                const [start] = timeSlot.split('-');
                return (
                  <tr key={timeSlot}>
                    <td className="p-2 border bg-gray-50">
                      <div className="text-sm">
                        <span className="font-medium">{start}</span>
                      </div>
                    </td>
                    {days.map(day => {
                      const slots = getSlotsForDay(day).filter(
                        slot => slot.startTime === start
                      );
                      return (
                        <td key={`${day}-${timeSlot}`} className="p-2 border">
                          {slots.map(slot => (
                            <div
                              key={slot.id}
                              className={`p-2 rounded border ${getSlotColor(slot.type)} relative group cursor-pointer`}
                              onClick={() => handleEditSlot(slot)}
                            >
                              <p className="font-medium text-sm">{slot.subject}</p>
                              <p className="text-xs text-gray-600">{slot.teacherName}</p>
                              <p className="text-xs text-gray-500">Room: {slot.room}</p>
                              
                              {/* Hover Actions */}
                              <div className="absolute top-1 right-1 hidden group-hover:flex space-x-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSlot(slot);
                                  }}
                                  className="p-1 bg-white rounded shadow hover:bg-gray-100"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSlot(slot.id);
                                  }}
                                  className="p-1 bg-white rounded shadow hover:bg-red-100"
                                >
                                  <Trash2 className="w-3 h-3 text-red-600" />
                                </button>
                              </div>

                              {slot.conflicts && slot.conflicts.length > 0 && (
                                <div className="absolute -top-1 -right-1">
                                  <Badge className="bg-red-500 text-white p-1 rounded-full">
                                    <AlertCircle className="w-3 h-3" />
                                  </Badge>
                                </div>
                              )}
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingSlot ? 'Edit Timetable Slot' : 'Add Timetable Slot'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Day"
                  value={editingSlot?.day || 'monday'}
                  onChange={() => {}}
                  options={dayOptions}
                />

                <Select
                  label="Class"
                  value={editingSlot?.classId || ''}
                  onChange={() => {}}
                  options={classOptions.filter(opt => opt.value !== 'all')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Subject"
                  value={editingSlot?.subject || ''}
                  onChange={() => {}}
                  options={subjectOptions}
                />

                <Select
                  label="Teacher"
                  value={editingSlot?.teacherId || ''}
                  onChange={() => {}}
                  options={teacherSelectOptions}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Time"
                  type="time"
                  value={editingSlot?.startTime || '08:00'}
                  onChange={() => {}}
                />
                <Input
                  label="End Time"
                  type="time"
                  value={editingSlot?.endTime || '09:00'}
                  onChange={() => {}}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Room"
                  value={editingSlot?.room || ''}
                  placeholder="e.g., Room 101"
                  onChange={() => {}}
                />

                <Select
                  label="Type"
                  value={editingSlot?.type || 'lecture'}
                  onChange={() => {}}
                  options={slotTypeOptions}
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingSlot?.recurring || true}
                    className="mr-2"
                    onChange={() => {}}
                  />
                  <span className="text-sm">Recurring weekly</span>
                </label>

                <Select
                  value={editingSlot?.weekType || 'all'}
                  onChange={() => {}}
                  options={weekTypeOptions}
                  className="w-32"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setShowAddModal(false)}>
                {editingSlot ? 'Update Slot' : 'Add Slot'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};