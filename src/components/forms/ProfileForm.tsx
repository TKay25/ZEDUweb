import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Mail, Phone, Calendar, MapPin,
  Camera, Save, X, Globe, Briefcase, GraduationCap
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Avatar } from '../ui/Avatar';
import { Tabs } from '../ui/Tabs';
import { toast } from 'react-hot-toast';

// Validation schemas for different sections
const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+263|0)[0-9]{9}$/, 'Invalid Zimbabwe phone number'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  nationality: z.string().optional(),
  idNumber: z.string().optional(),
});

const addressSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default('Zimbabwe'),
});

const professionalSchema = z.object({
  occupation: z.string().optional(),
  employer: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  yearsOfExperience: z.number().optional(),
  specialization: z.string().optional(),
});

const emergencySchema = z.object({
  emergencyName: z.string().min(2, 'Emergency contact name is required'),
  emergencyRelationship: z.string().min(2, 'Relationship is required'),
  emergencyPhone: z.string().regex(/^(\+263|0)[0-9]{9}$/, 'Invalid phone number'),
  emergencyEmail: z.string().email().optional(),
});

type ProfileFormData = {
  personal: z.infer<typeof personalInfoSchema>;
  address: z.infer<typeof addressSchema>;
  professional: z.infer<typeof professionalSchema>;
  emergency: z.infer<typeof emergencySchema>;
};

interface ProfileFormProps {
  user: {
    id: string;
    role: 'student' | 'tutor' | 'parent' | 'school_admin' | 'ministry';
    avatar?: string;
  };
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
  readOnly?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  initialData,
  onSubmit,
  onCancel,
  readOnly = false
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
  const [loading, setLoading] = useState(false);

  // Personal Info Form
  const personalForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialData?.personal || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: undefined,
      nationality: '',
      idNumber: ''
    }
  });

  // Address Form
  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData?.address || {
      address: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Zimbabwe'
    }
  });

  // Professional Form (conditional based on role)
  const professionalForm = useForm({
    resolver: zodResolver(professionalSchema),
    defaultValues: initialData?.professional || {
      occupation: '',
      employer: '',
      qualifications: [],
      yearsOfExperience: 0,
      specialization: ''
    }
  });

  // Emergency Contact Form
  const emergencyForm = useForm({
    resolver: zodResolver(emergencySchema),
    defaultValues: initialData?.emergency || {
      emergencyName: '',
      emergencyRelationship: '',
      emergencyPhone: '',
      emergencyEmail: ''
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validate all forms
    const personalValid = await personalForm.trigger();
    const addressValid = await addressForm.trigger();
    const emergencyValid = await emergencyForm.trigger();
    let professionalValid = true;

    // Professional info validation for relevant roles
    if (['tutor', 'school_admin', 'ministry'].includes(user.role)) {
      professionalValid = await professionalForm.trigger();
    }

    if (!personalValid || !addressValid || !emergencyValid || !professionalValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      // Append all form data
      const allData = {
        personal: personalForm.getValues(),
        address: addressForm.getValues(),
        ...(['tutor', 'school_admin', 'ministry'].includes(user.role) && {
          professional: professionalForm.getValues()
        }),
        emergency: emergencyForm.getValues()
      };

      formData.append('data', JSON.stringify(allData));
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await onSubmit(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'personal', label: 'Personal Information' },
    { key: 'address', label: 'Address' },
    ...(['tutor', 'school_admin', 'ministry'].includes(user.role) ? [{ key: 'professional', label: 'Professional' }] : []),
    { key: 'emergency', label: 'Emergency Contact' }
  ];

  // Gender options for select
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  // Province options for select
  const provinceOptions = [
    { value: '', label: 'Select province' },
    { value: 'Bulawayo', label: 'Bulawayo' },
    { value: 'Harare', label: 'Harare' },
    { value: 'Manicaland', label: 'Manicaland' },
    { value: 'Mashonaland Central', label: 'Mashonaland Central' },
    { value: 'Mashonaland East', label: 'Mashonaland East' },
    { value: 'Mashonaland West', label: 'Mashonaland West' },
    { value: 'Masvingo', label: 'Masvingo' },
    { value: 'Matabeleland North', label: 'Matabeleland North' },
    { value: 'Matabeleland South', label: 'Matabeleland South' },
    { value: 'Midlands', label: 'Midlands' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        {!readOnly && (
          <div className="flex space-x-3">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button variant="primary" onClick={handleSubmit} loading={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Avatar Section */}
      <Card className="p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar
              src={avatarPreview || undefined}
              name={`${personalForm.watch('firstName')} ${personalForm.watch('lastName')}`}
              size="xl"
            />
            {!readOnly && (
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700"
              >
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {personalForm.watch('firstName')} {personalForm.watch('lastName')}
            </h2>
            <p className="text-gray-600 capitalize">{user.role.replace('_', ' ')}</p>
            <p className="text-sm text-gray-500 mt-1">{personalForm.watch('email')}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        items={tabs}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              value={personalForm.watch('firstName')}
              onChange={(e) => personalForm.setValue('firstName', e.target.value)}
              error={personalForm.formState.errors.firstName?.message}
              icon={<User className="w-4 h-4" />}
              disabled={readOnly}
            />
            <Input
              label="Last Name *"
              value={personalForm.watch('lastName')}
              onChange={(e) => personalForm.setValue('lastName', e.target.value)}
              error={personalForm.formState.errors.lastName?.message}
              icon={<User className="w-4 h-4" />}
              disabled={readOnly}
            />
            <Input
              label="Email Address *"
              type="email"
              value={personalForm.watch('email')}
              onChange={(e) => personalForm.setValue('email', e.target.value)}
              error={personalForm.formState.errors.email?.message}
              icon={<Mail className="w-4 h-4" />}
              disabled={readOnly}
            />
            <Input
              label="Phone Number *"
              value={personalForm.watch('phone')}
              onChange={(e) => personalForm.setValue('phone', e.target.value)}
              error={personalForm.formState.errors.phone?.message}
              icon={<Phone className="w-4 h-4" />}
              disabled={readOnly}
              placeholder="0771234567"
            />
            <Input
              label="Date of Birth"
              type="date"
              value={personalForm.watch('dateOfBirth')}
              onChange={(e) => personalForm.setValue('dateOfBirth', e.target.value)}
              icon={<Calendar className="w-4 h-4" />}
              disabled={readOnly}
            />
            <Select
              label="Gender"
              value={personalForm.watch('gender') || ''}
              onChange={(e) => personalForm.setValue('gender', e.target.value as any)}
              options={genderOptions}
              disabled={readOnly}
            />
            <Input
              label="Nationality"
              value={personalForm.watch('nationality')}
              onChange={(e) => personalForm.setValue('nationality', e.target.value)}
              icon={<Globe className="w-4 h-4" />}
              disabled={readOnly}
            />
            <Input
              label="ID/Passport Number"
              value={personalForm.watch('idNumber')}
              onChange={(e) => personalForm.setValue('idNumber', e.target.value)}
              disabled={readOnly}
            />
          </div>
        </Card>
      )}

      {/* Address Tab */}
      {activeTab === 'address' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Address Information</h2>
          <div className="space-y-4">
            <Textarea
              label="Street Address"
              value={addressForm.watch('address')}
              onChange={(e) => addressForm.setValue('address', e.target.value)}
              disabled={readOnly}
              rows={3}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                value={addressForm.watch('city')}
                onChange={(e) => addressForm.setValue('city', e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
                disabled={readOnly}
              />
              <Select
                label="Province"
                value={addressForm.watch('province') || ''}
                onChange={(e) => addressForm.setValue('province', e.target.value)}
                options={provinceOptions}
                disabled={readOnly}
              />
              <Input
                label="Postal Code"
                value={addressForm.watch('postalCode')}
                onChange={(e) => addressForm.setValue('postalCode', e.target.value)}
                disabled={readOnly}
              />
              <Input
                label="Country"
                value="Zimbabwe"
                disabled={true}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Professional Tab */}
      {activeTab === 'professional' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Professional Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Occupation"
                value={professionalForm.watch('occupation')}
                onChange={(e) => professionalForm.setValue('occupation', e.target.value)}
                icon={<Briefcase className="w-4 h-4" />}
                disabled={readOnly}
              />
              <Input
                label="Employer/Institution"
                value={professionalForm.watch('employer')}
                onChange={(e) => professionalForm.setValue('employer', e.target.value)}
                disabled={readOnly}
              />
              <Input
                label="Years of Experience"
                type="number"
                value={professionalForm.watch('yearsOfExperience') || ''}
                onChange={(e) => professionalForm.setValue('yearsOfExperience', parseInt(e.target.value) || 0)}
                disabled={readOnly}
              />
              <Input
                label="Specialization"
                value={professionalForm.watch('specialization')}
                onChange={(e) => professionalForm.setValue('specialization', e.target.value)}
                disabled={readOnly}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Qualifications</label>
              <div className="space-y-2">
                {professionalForm.watch('qualifications')?.map((qualification: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={qualification}
                      onChange={(e) => {
                        const quals = [...(professionalForm.getValues('qualifications') || [])];
                        quals[index] = e.target.value;
                        professionalForm.setValue('qualifications', quals);
                      }}
                      placeholder={`Qualification ${index + 1}`}
                      disabled={readOnly}
                      className="flex-1"
                    />
                    {!readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const quals = professionalForm.getValues('qualifications')?.filter((_: string, i: number) => i !== index);
                          professionalForm.setValue('qualifications', quals);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {!readOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const quals = professionalForm.getValues('qualifications') || [];
                      professionalForm.setValue('qualifications', [...quals, '']);
                    }}
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Add Qualification
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Emergency Contact Tab */}
      {activeTab === 'emergency' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Name *"
              value={emergencyForm.watch('emergencyName')}
              onChange={(e) => emergencyForm.setValue('emergencyName', e.target.value)}
              error={emergencyForm.formState.errors.emergencyName?.message}
              icon={<User className="w-4 h-4" />}
              disabled={readOnly}
            />
            <Input
              label="Relationship *"
              value={emergencyForm.watch('emergencyRelationship')}
              onChange={(e) => emergencyForm.setValue('emergencyRelationship', e.target.value)}
              error={emergencyForm.formState.errors.emergencyRelationship?.message}
              disabled={readOnly}
            />
            <Input
              label="Phone Number *"
              value={emergencyForm.watch('emergencyPhone')}
              onChange={(e) => emergencyForm.setValue('emergencyPhone', e.target.value)}
              error={emergencyForm.formState.errors.emergencyPhone?.message}
              icon={<Phone className="w-4 h-4" />}
              disabled={readOnly}
            />
            <Input
              label="Email Address"
              type="email"
              value={emergencyForm.watch('emergencyEmail')}
              onChange={(e) => emergencyForm.setValue('emergencyEmail', e.target.value)}
              error={emergencyForm.formState.errors.emergencyEmail?.message}
              icon={<Mail className="w-4 h-4" />}
              disabled={readOnly}
            />
          </div>
        </Card>
      )}

      {/* Save Button (Mobile) */}
      {!readOnly && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden">
          <Button variant="primary" className="w-full" onClick={handleSubmit} loading={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};