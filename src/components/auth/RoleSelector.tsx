// src/components/auth/RoleSelector.tsx
import React, { useState } from 'react';
import type { UserRole } from '../../types/auth.types';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
  selectedRole?: UserRole;
}

const roles: { value: UserRole; label: string; icon: string; description: string; color: string }[] = [
  {
    value: 'student',
    label: 'Student',
    icon: '🎓',
    description: 'Access courses, track progress, and learn at your own pace',
    color: 'from-blue-500 to-blue-600'
  },
  {
    value: 'tutor',
    label: 'Tutor',
    icon: '👨‍🏫',
    description: 'Create courses, manage students, and share your knowledge',
    color: 'from-green-500 to-green-600'
  },
  {
    value: 'parent',
    label: 'Parent',
    icon: '👪',
    description: 'Monitor progress, manage payments, and stay connected',
    color: 'from-purple-500 to-purple-600'
  },
  {
    value: 'school',
    label: 'School Admin',
    icon: '🏫',
    description: 'Manage teachers, classes, and institutional analytics',
    color: 'from-orange-500 to-orange-600'
  },
  {
    value: 'ministry',
    label: 'Ministry',
    icon: '🏛️',
    description: 'Oversee schools, analyze national education data',
    color: 'from-red-500 to-red-600'
  }
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole, selectedRole }) => {
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Role</h2>
        <p className="text-gray-600">Select how you want to use ZEDU</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {roles.map((role) => {
          const isSelected = selectedRole === role.value;
          const isHovered = hoveredRole === role.value;

          return (
            <button
              key={role.value}
              onClick={() => onSelectRole(role.value)}
              onMouseEnter={() => setHoveredRole(role.value)}
              onMouseLeave={() => setHoveredRole(null)}
              className={`
                relative overflow-hidden rounded-xl p-6 transition-all duration-300
                ${isSelected 
                  ? 'ring-4 ring-blue-500 ring-offset-2 scale-105' 
                  : 'hover:scale-102 hover:shadow-xl'
                }
                bg-gradient-to-br ${role.color}
                text-white shadow-lg
              `}
            >
              {/* Animated background effect */}
              <div className={`
                absolute inset-0 bg-white opacity-0 transition-opacity duration-300
                ${isHovered ? 'opacity-10' : ''}
              `} />

              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-5xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {role.icon}
                </span>
                <h3 className="text-xl font-bold mb-2">{role.label}</h3>
                <p className="text-sm opacity-90">{role.description}</p>

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick comparison tooltip */}
      {hoveredRole && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl z-50 animate-slide-up">
          <p className="text-sm">
            <span className="font-bold">{roles.find(r => r.value === hoveredRole)?.label}</span> - 
            Perfect for {roles.find(r => r.value === hoveredRole)?.description.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;