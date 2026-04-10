// frontend/src/components/ui/types/ui.types.ts
// Re-export commonly used types
export type { ReactNode } from 'react';
// Define UserRole locally instead of importing
export type UserRole = 'student' | 'tutor' | 'parent' | 'school_admin' | 'ministry_official' | 'admin';

// Toast Types
export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

// Dropdown Types
export interface DropdownOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
}

// Table Types
export interface Column<T = any> {
  key: string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (record: T) => void;
  pagination?: PaginationProps;
  emptyText?: string;
}

// Pagination Types
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string | number; label: string }[];
  validation?: (value: any) => string | undefined;
  defaultValue?: any;
}

export interface FormProps {
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
}

// Button Types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
}

// Input Types
export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string | number;
  onChange?: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  autoFocus?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
}

// Card Types
export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

// Alert Types
export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

// Tabs Types
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'line' | 'card' | 'pill';
}

// Accordion Types
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  onChange?: (expandedIds: string[]) => void;
}

// Badge Types
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  rounded?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Tooltip Types
export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  disabled?: boolean;
}

// Loading Types
export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  text?: string;
}

// Drawer Types
export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Progress Types
export interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside' | 'top' | 'bottom';
  variant?: 'default' | 'success' | 'warning' | 'error';
  striped?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Avatar Types
export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy';
}

// Breadcrumb Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  homeIcon?: React.ReactNode;
}

// Menu Types
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: MenuItem[];
  onClick?: () => void;
}

export interface MenuProps {
  items: MenuItem[];
  selectedKeys?: string[];
  onSelect?: (key: string) => void;
  mode?: 'vertical' | 'horizontal' | 'inline';
}

// Stepper Types
export interface Step {
  id: string;
  label: string;
  description?: string;
  status?: 'waiting' | 'active' | 'completed' | 'error';
}

export interface StepperProps {
  steps: Step[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
  onStepClick?: (stepIndex: number) => void;
}

// Empty State Types
export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  image?: string;
}

// Rating Types
export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  precision?: 0.5 | 1;
}

// Switch Types
export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Checkbox Types
export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  value?: string;
  name?: string;
}

// Radio Types
export interface RadioProps {
  checked: boolean;
  onChange: (value: string) => void;
  value: string;
  label?: string;
  disabled?: boolean;
  name?: string;
}

// Select Types
export interface SelectProps {
  options: DropdownOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

// DatePicker Types
export interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
}

// TimePicker Types
export interface TimePickerProps {
  value?: Date | null;
  onChange: (time: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  format?: '12h' | '24h';
}

// ColorPicker Types
export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  disabled?: boolean;
  presets?: string[];
}

// FileUpload Types
export interface FileUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  error?: string;
  label?: string;
  dragAndDrop?: boolean;
}

// Autocomplete Types
export interface AutocompleteProps {
  suggestions: string[];
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  loading?: boolean;
}

// Skeleton Types
export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animated?: boolean;
  count?: number;
}

// Divider Types
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  text?: string;
  dashed?: boolean;
  className?: string;
}

// Tag Types
export interface TagProps {
  children: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
}

// List Types
export interface ListProps<T = any> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

// Grid Types
export interface GridProps {
  children: React.ReactNode;
  container?: boolean;
  item?: boolean;
  xs?: number | 'auto' | true;
  sm?: number | 'auto' | true;
  md?: number | 'auto' | true;
  lg?: number | 'auto' | true;
  xl?: number | 'auto' | true;
  spacing?: number;
  className?: string;
}

// Typography Types
export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline';

export interface TypographyProps {
  variant?: TypographyVariant;
  //component?: keyof React.ReactHTML;
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info' | 'textPrimary' | 'textSecondary';
  align?: 'left' | 'center' | 'right' | 'justify';
  gutterBottom?: boolean;
  noWrap?: boolean;
  paragraph?: boolean;
  className?: string;
}

