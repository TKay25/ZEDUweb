import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Moon, Sun, Globe, Lock,
  Eye, EyeOff, Save, X
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { toast } from 'react-hot-toast';

// Define the form data types explicitly
type NotificationFormData = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  assignmentReminders: boolean;
  paymentReminders: boolean;
  newsUpdates: boolean;
  systemAlerts: boolean;
};

type AppearanceFormData = {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
};

type PrivacyFormData = {
  profileVisibility: 'public' | 'private' | 'contacts';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  activityStatus: boolean;
  twoFactorAuth: boolean;
};

type SecurityFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  sessionTimeout: number;
  loginAlerts: boolean;
};

type LanguageFormData = {
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  firstDayOfWeek: 'monday' | 'sunday';
  currency: string;
};

type SettingsFormData = {
  notifications: NotificationFormData;
  appearance: AppearanceFormData;
  privacy: PrivacyFormData;
  security: SecurityFormData;
  language: LanguageFormData;
};

interface SettingsFormProps {
  initialData?: Partial<SettingsFormData>;
  onSubmit: (data: SettingsFormData) => Promise<void>;
  onCancel?: () => void;
}

// Validation schemas with proper types
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  assignmentReminders: z.boolean(),
  paymentReminders: z.boolean(),
  newsUpdates: z.boolean(),
  systemAlerts: z.boolean(),
}) satisfies z.ZodType<NotificationFormData>;

const appearanceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  fontSize: z.enum(['small', 'medium', 'large']),
  compactMode: z.boolean(),
  reduceMotion: z.boolean(),
  highContrast: z.boolean(),
}) satisfies z.ZodType<AppearanceFormData>;

const privacySchema = z.object({
  profileVisibility: z.enum(['public', 'private', 'contacts']),
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  showLocation: z.boolean(),
  activityStatus: z.boolean(),
  twoFactorAuth: z.boolean(),
}) satisfies z.ZodType<PrivacyFormData>;

const securitySchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  sessionTimeout: z.number().min(1).max(120),
  loginAlerts: z.boolean(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}) satisfies z.ZodType<SecurityFormData>;

const languageSchema = z.object({
  language: z.string(),
  dateFormat: z.string(),
  timeFormat: z.enum(['12h', '24h']),
  firstDayOfWeek: z.enum(['monday', 'sunday']),
  currency: z.string(),
}) satisfies z.ZodType<LanguageFormData>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Notifications Form
  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: initialData?.notifications || {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      assignmentReminders: true,
      paymentReminders: true,
      newsUpdates: true,
      systemAlerts: true,
    }
  });

  // Appearance Form
  const appearanceForm = useForm<AppearanceFormData>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: initialData?.appearance || {
      theme: 'system',
      fontSize: 'medium',
      compactMode: false,
      reduceMotion: false,
      highContrast: false,
    }
  });

  // Privacy Form
  const privacyForm = useForm<PrivacyFormData>({
    resolver: zodResolver(privacySchema),
    defaultValues: initialData?.privacy || {
      profileVisibility: 'contacts',
      showEmail: true,
      showPhone: false,
      showLocation: false,
      activityStatus: true,
      twoFactorAuth: false,
    }
  });

  // Security Form
  const securityForm = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: initialData?.security || {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      sessionTimeout: 30,
      loginAlerts: true,
    }
  });

  // Language Form
  const languageForm = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: initialData?.language || {
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      firstDayOfWeek: 'monday',
      currency: 'USD',
    }
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate all forms
      const notificationValid = await notificationForm.trigger();
      const appearanceValid = await appearanceForm.trigger();
      const privacyValid = await privacyForm.trigger();
      const languageValid = await languageForm.trigger();
      let securityValid = true;
      
      if (activeTab === 'security') {
        securityValid = await securityForm.trigger();
      }

      if (!notificationValid || !appearanceValid || !privacyValid || !languageValid || !securityValid) {
        toast.error('Please check all fields');
        return;
      }

      const allData: SettingsFormData = {
        notifications: notificationForm.getValues(),
        appearance: appearanceForm.getValues(),
        privacy: privacyForm.getValues(),
        security: securityForm.getValues(),
        language: languageForm.getValues(),
      };

      await onSubmit(allData);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'notifications', label: 'Notifications' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'privacy', label: 'Privacy' },
    { key: 'security', label: 'Security' },
    { key: 'language', label: 'Language' },
  ];

  // Options for selects
  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  const profileVisibilityOptions = [
    { value: 'public', label: 'Public - Anyone can view' },
    { value: 'contacts', label: 'Contacts Only' },
    { value: 'private', label: 'Private - Only me' }
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const timeFormatOptions = [
    { value: '12h', label: '12-hour (AM/PM)' },
    { value: '24h', label: '24-hour' }
  ];

  const firstDayOfWeekOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'ZWL', label: 'ZWL (ZiG)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'sn', label: 'Shona' },
    { value: 'nd', label: 'Ndebele' },
    { value: 'fr', label: 'French' },
    { value: 'pt', label: 'Portuguese' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex space-x-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        items={tabs}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Channels</h3>
              <div className="space-y-3">
                <Switch
                  label="Email Notifications"
                  checked={notificationForm.watch('emailNotifications')}
                  onChange={(checked: boolean) => notificationForm.setValue('emailNotifications', checked)}
                />
                <Switch
                  label="Push Notifications"
                  checked={notificationForm.watch('pushNotifications')}
                  onChange={(checked: boolean) => notificationForm.setValue('pushNotifications', checked)}
                />
                <Switch
                  label="SMS Notifications"
                  checked={notificationForm.watch('smsNotifications')}
                  onChange={(checked: boolean) => notificationForm.setValue('smsNotifications', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Notification Types</h3>
              <div className="space-y-3">
                <Switch
                  label="Assignment Reminders"
                  checked={notificationForm.watch('assignmentReminders')}
                  onChange={(checked: boolean) => notificationForm.setValue('assignmentReminders', checked)}
                />
                <Switch
                  label="Payment Reminders"
                  checked={notificationForm.watch('paymentReminders')}
                  onChange={(checked: boolean) => notificationForm.setValue('paymentReminders', checked)}
                />
                <Switch
                  label="News & Updates"
                  checked={notificationForm.watch('newsUpdates')}
                  onChange={(checked: boolean) => notificationForm.setValue('newsUpdates', checked)}
                />
                <Switch
                  label="System Alerts"
                  checked={notificationForm.watch('systemAlerts')}
                  onChange={(checked: boolean) => notificationForm.setValue('systemAlerts', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Marketing</h3>
              <Switch
                label="Receive marketing emails"
                checked={notificationForm.watch('marketingEmails')}
                onChange={(checked: boolean) => notificationForm.setValue('marketingEmails', checked)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Appearance Settings</h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                <label
                  className={`p-4 border rounded-lg text-center cursor-pointer ${
                    appearanceForm.watch('theme') === 'light'
                      ? 'border-primary-500 bg-primary-50'
                      : 'hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="light"
                    checked={appearanceForm.watch('theme') === 'light'}
                    onChange={() => appearanceForm.setValue('theme', 'light')}
                    className="hidden"
                  />
                  <Sun className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Light</span>
                </label>
                <label
                  className={`p-4 border rounded-lg text-center cursor-pointer ${
                    appearanceForm.watch('theme') === 'dark'
                      ? 'border-primary-500 bg-primary-50'
                      : 'hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="dark"
                    checked={appearanceForm.watch('theme') === 'dark'}
                    onChange={() => appearanceForm.setValue('theme', 'dark')}
                    className="hidden"
                  />
                  <Moon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Dark</span>
                </label>
                <label
                  className={`p-4 border rounded-lg text-center cursor-pointer ${
                    appearanceForm.watch('theme') === 'system'
                      ? 'border-primary-500 bg-primary-50'
                      : 'hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="system"
                    checked={appearanceForm.watch('theme') === 'system'}
                    onChange={() => appearanceForm.setValue('theme', 'system')}
                    className="hidden"
                  />
                  <Globe className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">System</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Font Size</h3>
              <Select
                value={appearanceForm.watch('fontSize')}
                onChange={(e) => appearanceForm.setValue('fontSize', e.target.value as 'small' | 'medium' | 'large')}
                options={fontSizeOptions}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Accessibility</h3>
              <div className="space-y-3">
                <Switch
                  label="Compact Mode"
                  checked={appearanceForm.watch('compactMode')}
                  onChange={(checked: boolean) => appearanceForm.setValue('compactMode', checked)}
                />
                <Switch
                  label="Reduce Motion"
                  checked={appearanceForm.watch('reduceMotion')}
                  onChange={(checked: boolean) => appearanceForm.setValue('reduceMotion', checked)}
                />
                <Switch
                  label="High Contrast"
                  checked={appearanceForm.watch('highContrast')}
                  onChange={(checked: boolean) => appearanceForm.setValue('highContrast', checked)}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Profile Visibility</h3>
              <Select
                value={privacyForm.watch('profileVisibility')}
                onChange={(e) => privacyForm.setValue('profileVisibility', e.target.value as 'public' | 'private' | 'contacts')}
                options={profileVisibilityOptions}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Information Visibility</h3>
              <div className="space-y-3">
                <Switch
                  label="Show email address"
                  checked={privacyForm.watch('showEmail')}
                  onChange={(checked: boolean) => privacyForm.setValue('showEmail', checked)}
                />
                <Switch
                  label="Show phone number"
                  checked={privacyForm.watch('showPhone')}
                  onChange={(checked: boolean) => privacyForm.setValue('showPhone', checked)}
                />
                <Switch
                  label="Show location"
                  checked={privacyForm.watch('showLocation')}
                  onChange={(checked: boolean) => privacyForm.setValue('showLocation', checked)}
                />
                <Switch
                  label="Show activity status"
                  checked={privacyForm.watch('activityStatus')}
                  onChange={(checked: boolean) => privacyForm.setValue('activityStatus', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Security</h3>
              <Switch
                label="Two-factor authentication"
                checked={privacyForm.watch('twoFactorAuth')}
                onChange={(checked: boolean) => privacyForm.setValue('twoFactorAuth', checked)}
              />
              {privacyForm.watch('twoFactorAuth') && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Two-factor authentication is enabled. You'll need to verify your identity when logging in from new devices.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Configure 2FA
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Change Password</h3>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    label="Current Password"
                    value={securityForm.watch('currentPassword')}
                    onChange={(e) => securityForm.setValue('currentPassword', e.target.value)}
                    error={securityForm.formState.errors.currentPassword?.message}
                    icon={<Lock className="w-4 h-4" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-9 text-gray-400"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    label="New Password"
                    value={securityForm.watch('newPassword')}
                    onChange={(e) => securityForm.setValue('newPassword', e.target.value)}
                    error={securityForm.formState.errors.newPassword?.message}
                    icon={<Lock className="w-4 h-4" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-9 text-gray-400"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Input
                  type="password"
                  label="Confirm New Password"
                  value={securityForm.watch('confirmPassword')}
                  onChange={(e) => securityForm.setValue('confirmPassword', e.target.value)}
                  error={securityForm.formState.errors.confirmPassword?.message}
                  icon={<Lock className="w-4 h-4" />}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Session Settings</h3>
              <Input
                type="number"
                label="Session Timeout (minutes)"
                value={securityForm.watch('sessionTimeout')}
                onChange={(e) => securityForm.setValue('sessionTimeout', parseInt(e.target.value) || 0)}
                min={1}
                max={120}
              />
              <Switch
                label="Alert me on new device login"
                checked={securityForm.watch('loginAlerts')}
                onChange={(checked: boolean) => securityForm.setValue('loginAlerts', checked)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-gray-500">Chrome on Windows • Last active now</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Mobile App</p>
                    <p className="text-sm text-gray-500">iPhone • Last active 2 hours ago</p>
                  </div>
                  <Button variant="ghost" size="sm">Revoke</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Language Tab */}
      {activeTab === 'language' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Language & Regional Settings</h2>
          <div className="space-y-4">
            <Select
              label="Language"
              value={languageForm.watch('language')}
              onChange={(e) => languageForm.setValue('language', e.target.value)}
              options={languageOptions}
            />

            <Select
              label="Date Format"
              value={languageForm.watch('dateFormat')}
              onChange={(e) => languageForm.setValue('dateFormat', e.target.value)}
              options={dateFormatOptions}
            />

            <Select
              label="Time Format"
              value={languageForm.watch('timeFormat')}
              onChange={(e) => languageForm.setValue('timeFormat', e.target.value as '12h' | '24h')}
              options={timeFormatOptions}
            />

            <Select
              label="First Day of Week"
              value={languageForm.watch('firstDayOfWeek')}
              onChange={(e) => languageForm.setValue('firstDayOfWeek', e.target.value as 'monday' | 'sunday')}
              options={firstDayOfWeekOptions}
            />

            <Select
              label="Currency"
              value={languageForm.watch('currency')}
              onChange={(e) => languageForm.setValue('currency', e.target.value)}
              options={currencyOptions}
            />
          </div>
        </Card>
      )}
    </div>
  );
};