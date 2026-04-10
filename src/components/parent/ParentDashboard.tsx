// src/components/parent/ParentDashboard.tsx
import React, { useState } from 'react';
import { ChildCard } from './ChildCard';
import { ChildProgressChart } from './ChildProgressChart';
import { FeePaymentForm } from './FeePaymentForm';
import AlertCard from './AlertCard';

// Temporary placeholder for MeetingScheduler if the component doesn't exist
interface MeetingSchedulerProps {
  childId: string;
  childName: string;
  teachers: Array<{
    id: string;
    name: string;
    subject: string;
    availability: Array<{
      day: string;
      slots: Array<{ start: string; end: string }>;
    }>;
  }>;
  scheduledMeetings: any[];
  onScheduleMeeting: (data: any) => Promise<void>;
  onCancelMeeting?: (id: string) => Promise<void>;  // Made optional
  onRescheduleMeeting?: (id: string, date: Date, time: string) => Promise<void>;  // Made optional
  onJoinMeeting: (id: string) => void;
}

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  childId: _childId,
  childName,
  teachers,
  scheduledMeetings: _scheduledMeetings,
  onScheduleMeeting,
  onCancelMeeting: _onCancelMeeting,  // Prefix with underscore to indicate intentionally unused
  onRescheduleMeeting: _onRescheduleMeeting,  // Prefix with underscore to indicate intentionally unused
  onJoinMeeting
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Schedule Meeting with {childName}'s Teachers</h3>
      <div className="space-y-4">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="border rounded-lg p-3">
            <h4 className="font-medium">{teacher.name} - {teacher.subject}</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => onScheduleMeeting({ teacherId: teacher.id })}
                className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm"
              >
                Schedule Meeting
              </button>
              <button
                onClick={() => onJoinMeeting(teacher.id)}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                Join Meeting
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ParentDashboard: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  // Mock data
  const children = [
    {
      id: '1',
      name: 'John Doe Jr.',
      grade: 'Form 3',
      school: 'ZEDU High School',
      avatar: '/avatars/john.jpg',
      dateOfBirth: new Date(2010, 5, 15),
      studentId: 'STU001',
      overallProgress: 85,
      attendance: {
        present: 45,
        total: 50,
        percentage: 90,
        trend: 'up' as const
      },
      grades: {
        average: 82,
        trend: 'up' as const,
        subjects: [
          { name: 'Mathematics', score: 85, grade: 'B' },
          { name: 'English', score: 78, grade: 'C' },
          { name: 'Science', score: 92, grade: 'A' }
        ]
      },
      upcomingEvents: [
        { id: '1', title: 'Math Assignment Due', date: new Date(2024, 2, 25), type: 'assignment' as const },
        { id: '2', title: 'Parent-Teacher Meeting', date: new Date(2024, 2, 28), type: 'meeting' as const }
      ],
      alerts: [
        { id: '1', type: 'warning' as const, message: 'Low attendance in Physics' }
      ],
      status: 'active' as const
    }
  ];

  const alerts = [
    {
      id: '1',
      type: 'info' as const,
      priority: 'high' as const,
      title: 'Fee Payment Due',
      message: 'Tuition fee for Term 2 is due in 3 days. Please make payment to avoid late fees.',
      category: 'payment' as const,
      timestamp: new Date(),
      read: false,
      actionable: true,
      actionLabel: 'Pay Now',
      onAction: () => console.log('Navigate to payment'),
      metadata: {
        amount: 450,
        dueDate: new Date(2024, 3, 1)
      }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Parent Dashboard</h1>

      {/* Children Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">My Children</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map(child => (
            <ChildCard
              key={child.id}
              child={child}
              onViewDetails={(id: string) => setSelectedChild(id)}
              onMessage={(id: string) => console.log('Message child', id)}
              onViewProgress={(id: string) => console.log('View progress', id)}
              onScheduleMeeting={(id: string) => console.log('Schedule meeting', id)}
            />
          ))}
        </div>
      </section>

      {/* Alerts */}
      {alerts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Alerts</h2>
          <div className="space-y-3">
            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onMarkAsRead={(id: string) => console.log('Mark as read', id)}
                onDismiss={(id: string) => console.log('Dismiss', id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Selected Child Progress */}
      {selectedChild && (
        <ChildProgressChart
          childId={selectedChild}
          childName="John Doe Jr."
          data={{
            overview: {
              overallGrade: 85,
              improvement: 5.2,
              rank: 15,
              totalStudents: 120,
              attendanceRate: 92,
              completedAssignments: 18,
              pendingAssignments: 3
            },
            subjects: [
              { subject: 'Mathematics', currentGrade: 85, previousGrade: 82, classAverage: 78, target: 90 },
              { subject: 'English', currentGrade: 78, previousGrade: 75, classAverage: 80, target: 85 },
              { subject: 'Science', currentGrade: 92, previousGrade: 88, classAverage: 83, target: 95 }
            ],
            attendance: [
              { month: 'Jan', present: 20, absent: 2, late: 1, total: 23 },
              { month: 'Feb', present: 18, absent: 1, late: 2, total: 21 }
            ],
            assignments: [
              { name: 'Algebra Test', score: 85, maxScore: 100, date: new Date() },
              { name: 'Essay', score: 78, maxScore: 100, date: new Date() }
            ],
            weeklyActivity: [
              { week: 'Week 1', studyHours: 12, assignments: 3, participation: 85 },
              { week: 'Week 2', studyHours: 15, assignments: 4, participation: 90 }
            ],
            performanceTrends: [
              { date: '2024-01-01', grade: 82, average: 78 },
              { date: '2024-02-01', grade: 85, average: 79 }
            ]
          }}
          onExport={(format: 'pdf' | 'excel') => console.log('Export', format)}
          onSubjectClick={(subject: string) => console.log('Subject clicked', subject)}
        />
      )}

      {/* Fee Payment Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Fee Management</h2>
        <FeePaymentForm
          children={children.map(child => ({
            id: child.id,
            name: child.name,
            grade: child.grade
          }))}
          feeStructures={[
            {
              id: '1',
              name: 'Term 2 Tuition',
              amount: 450,
              dueDate: new Date(2024, 3, 1),
              term: 'Term 2',
              description: 'Full term tuition fees including extracurricular activities',
              lateFee: 50
            }
          ]}
          outstandingBalance={450}
          onProcessPayment={async (data) => console.log('Process payment', data)}
          onViewHistory={() => console.log('View history')}
        />
      </section>

      {/* Meeting Scheduler */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Schedule Meetings</h2>
        <MeetingScheduler
          childId="1"
          childName="John Doe Jr."
          teachers={[
            {
              id: 't1',
              name: 'Mr. Smith',
              subject: 'Mathematics',
              availability: [
                { day: 'Monday', slots: [{ start: '14:00', end: '16:00' }] },
                { day: 'Wednesday', slots: [{ start: '10:00', end: '12:00' }] }
              ]
            }
          ]}
          scheduledMeetings={[]}
          onScheduleMeeting={async (data: any) => console.log('Schedule', data)}
          onJoinMeeting={(id: string) => console.log('Join', id)}
        />
      </section>
    </div>
  );
};

export default ParentDashboard;