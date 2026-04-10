import type { ReactNode, ReactElement, ComponentType, CSSProperties } from 'react';
import type { JSX } from 'react';

//type MenuItem = {
 // label: string;
 // value: string;
  // ... other properties
//};

// ==============================================
// COMPONENT PROPS TYPES
// ==============================================
export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export type InputSize = 'sm' | 'md' | 'lg';

export interface BaseProps {
  className?: string;
  style?: CSSProperties;
  id?: string;
  testId?: string;
}

export interface ChildrenProps {
  children: ReactNode;
}

export interface LoadingProps {
  loading?: boolean;
  skeleton?: boolean;
  skeletonCount?: number;
  skeletonHeight?: number;
  skeletonWidth?: number;
}

export interface ErrorProps {
  error?: Error | string | null;
  errorMessage?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export interface DataProps<T = any> {
  data?: T;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export interface ActionProps {
  onClick?: () => void;
  onHover?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
}

export interface SizeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  width?: string | number;
  height?: string | number;
}

export interface ColorProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
}

export interface PositionProps {
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: number;
}

export interface SpacingProps {
  margin?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  padding?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
}

export interface FlexProps {
  display?: 'flex' | 'inline-flex';
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
  gap?: string | number;
  flex?: string | number;
  order?: number;
}

export interface GridProps {
  display?: 'grid' | 'inline-grid';
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridTemplateAreas?: string;
  gridColumnGap?: string | number;
  gridRowGap?: string | number;
  gridGap?: string | number;
  justifyContent?: string;
  alignContent?: string;
  justifyItems?: string;
  alignItems?: string;
  gridColumn?: string;
  gridRow?: string;
  gridArea?: string;
}

export interface TypographyBaseProps {
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  textDecoration?: 'underline' | 'line-through' | 'none';
  color?: string;
}

export interface BorderProps {
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderWidth?: string | number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderColor?: string;
  borderRadius?: string | number;
}

// ==============================================
// UI COMPONENT TYPES
// ==============================================

export interface ButtonProps extends BaseProps, LoadingProps, ActionProps, ColorProps, SizeProps {
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactElement;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
}

export interface InputProps extends BaseProps, ActionProps, SizeProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'file' | 'checkbox' | 'radio';
  name?: string;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  accept?: string;
  multiple?: boolean;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends BaseProps, ActionProps, SizeProps {
  options: SelectOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  creatable?: boolean;
  maxSelected?: number;
  menuPosition?: 'top' | 'bottom' | 'auto';
  onSearch?: (query: string) => void;
  onCreateOption?: (inputValue: string) => void;
}

export interface CheckboxProps extends BaseProps, ActionProps {
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  label?: string | ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
}

export interface RadioProps extends BaseProps, ActionProps {
  name: string;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  label?: string | ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface RadioGroupProps extends BaseProps {
  name: string;
  value?: string;
  defaultValue?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  onChange?: (value: string) => void;
}

export interface SwitchProps extends BaseProps, ActionProps {
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  label?: string | ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface TextareaProps extends BaseProps, ActionProps, SizeProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  resizable?: boolean;
}

export interface SliderProps extends BaseProps, ActionProps {
  name?: string;
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  range?: boolean;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  marks?: Array<{ value: number; label: string }>;
}

export interface CardProps extends BaseProps, ChildrenProps, LoadingProps {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  headerAction?: ReactNode;
  footer?: ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  headerDivider?: boolean;
  footerDivider?: boolean;
  onClick?: () => void;
}

export interface ModalProps extends BaseProps, ChildrenProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
  footerAlign?: 'left' | 'center' | 'right';
  centered?: boolean;
  scrollable?: boolean;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'none';
  zIndex?: number;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
}

export interface DrawerProps extends BaseProps, ChildrenProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
  animation?: 'slide' | 'fade' | 'none';
  zIndex?: number;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
}

export interface TableProps<T = any> extends BaseProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: TablePagination;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  expandable?: boolean;
  rowKey?: string | ((record: T) => string);
  onRowClick?: (record: T, index: number) => void;
  onSelectionChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onPageChange?: (page: number, pageSize: number) => void;
  emptyText?: string | ReactNode;
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  stickyHeader?: boolean;
  maxHeight?: string | number;
  minHeight?: string | number;
}

export interface TableColumn<T = any> {
  key: string;
  title: string | ReactNode;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean | ((a: T, b: T) => number);
  sortDirections?: Array<'asc' | 'desc'>;
  defaultSortOrder?: 'asc' | 'desc';
  filters?: Array<{ text: string; value: any }>;
  onFilter?: (value: any, record: T) => boolean;
  ellipsis?: boolean;
  fixed?: 'left' | 'right';
}

export interface TablePagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  simple?: boolean;
  position?: 'top' | 'bottom' | 'both';
}

export interface TabsProps extends BaseProps {
  tabs: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (activeKey: string) => void;
  type?: 'line' | 'card' | 'editable-card';
  size?: 'sm' | 'md' | 'lg';
  tabPosition?: 'top' | 'left' | 'right' | 'bottom';
  destroyInactiveTabPane?: boolean;
  animated?: boolean;
  centered?: boolean;
  addable?: boolean;
  onAdd?: () => void;
  onEdit?: (targetKey: string, action: 'add' | 'remove') => void;
}

export interface TabItem {
  key: string;
  label: string | ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  icon?: ReactElement;
  closable?: boolean;
}

export interface AccordionProps extends BaseProps {
  items: AccordionItem[];
  defaultActiveKey?: string[];
  activeKey?: string[];
  onChange?: (activeKey: string[]) => void;
  multiple?: boolean;
  collapsible?: boolean;
  bordered?: boolean;
  showArrow?: boolean;
  expandIcon?: ReactNode | ((isActive: boolean) => ReactNode);
  size?: 'sm' | 'md' | 'lg';
}

export interface AccordionItem {
  key: string;
  title: string | ReactNode;
  content: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
}

export interface AvatarProps extends BaseProps {
  src?: string;
  name?: string;
  icon?: ReactElement;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  shape?: 'circle' | 'square' | 'rounded';
  color?: string;
  backgroundColor?: string;
  bordered?: boolean;
  status?: 'online' | 'offline' | 'busy' | 'away';
  statusPosition?: 'top' | 'bottom' | 'left' | 'right';
  onClick?: () => void;
}

export interface BadgeProps extends BaseProps, ColorProps, SizeProps {
  count?: number;
  overflowCount?: number;
  dot?: boolean;
  showZero?: boolean;
  status?: 'success' | 'processing' | 'error' | 'warning' | 'default';
  text?: string;
  title?: string;
  children?: ReactNode;
  offset?: [number, number];
  onClick?: () => void;
}

export interface TooltipProps extends BaseProps {
  title?: ReactNode; // Made optional to fix PopoverProps extension
  placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
  children: ReactElement;
  arrow?: boolean;
  trigger?: 'hover' | 'focus' | 'click' | 'contextMenu' | Array<'hover' | 'focus' | 'click' | 'contextMenu'>;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  color?: string;
  zIndex?: number;
}

export interface PopoverProps extends TooltipProps {
  content: ReactNode;
  title: ReactNode; // Title remains required here
}

export interface DropdownProps extends BaseProps {
  menu: DropdownMenu;
  placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
  trigger?: Array<'click' | 'hover' | 'contextMenu'>;
  children: ReactElement;
  disabled?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  arrow?: boolean;
}

export interface DropdownMenu {
  items: DropdownItem[];
}

export interface DropdownItem {
  key: string;
  label: string | ReactNode;
  icon?: ReactElement;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  children?: DropdownItem[];
  onClick?: () => void;
}

export interface BreadcrumbProps extends BaseProps {
  items: BreadcrumbItem[];
  separator?: string | ReactNode;
  maxItems?: number;
  params?: Record<string, string>;
}

export interface BreadcrumbItem {
  title: string | ReactNode;
  href?: string;
  icon?: ReactElement;
}

export interface PaginationProps extends BaseProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  simple?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  prevIcon?: ReactNode;
  nextIcon?: ReactNode;
  jumpPrevIcon?: ReactNode;
  jumpNextIcon?: ReactNode;
}

export interface ProgressProps extends BaseProps, SizeProps, ColorProps {
  percent: number;
  type?: 'line' | 'circle' | 'dashboard';
  format?: (percent: number) => string;
  status?: 'success' | 'exception' | 'normal' | 'active';
  showInfo?: boolean;
  strokeWidth?: number;
  strokeColor?: string;
  trailColor?: string;
  successPercent?: number;
}

export interface AlertProps extends BaseProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string | ReactNode;
  description?: string | ReactNode;
  closable?: boolean;
  showIcon?: boolean;
  icon?: ReactElement;
  closeText?: string | ReactNode;
  onClose?: () => void;
  afterClose?: () => void;
  banner?: boolean;
}

export interface NotificationProps extends BaseProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string | ReactNode;
  description?: string | ReactNode;
  duration?: number;
  placement?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
  icon?: ReactElement;
  closable?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  key?: string;
  style?: CSSProperties;
  className?: string;
}

export interface TimelineProps extends BaseProps {
  items: TimelineItem[];
  mode?: 'left' | 'right' | 'alternate';
  pending?: boolean | ReactNode;
  pendingDot?: ReactNode;
  reverse?: boolean;
}

export interface TimelineItem {
  key?: string;
  label?: ReactNode;
  children: ReactNode;
  dot?: ReactNode;
  color?: string;
  position?: 'left' | 'right';
}

export interface CarouselProps extends BaseProps {
  items: ReactNode[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  dots?: boolean | { className?: string };
  dotPosition?: 'top' | 'bottom' | 'left' | 'right';
  arrows?: boolean;
  prevArrow?: ReactNode;
  nextArrow?: ReactNode;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  initialSlide?: number;
  vertical?: boolean;
  pauseOnHover?: boolean;
  beforeChange?: (current: number, next: number) => void;
  afterChange?: (current: number) => void;
}

export interface CalendarProps extends BaseProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  mode?: 'month' | 'year' | 'decade';
  fullscreen?: boolean;
  dateCellRender?: (date: Date) => ReactNode;
  monthCellRender?: (date: Date) => ReactNode;
  dateFullCellRender?: (date: Date) => ReactNode;
  monthFullCellRender?: (date: Date) => ReactNode;
  disabledDate?: (date: Date) => boolean;
  disabledTime?: (date: Date) => boolean;
  showToday?: boolean;
  showWeek?: boolean;
  locale?: any;
}

export interface DatePickerProps extends BaseProps, ActionProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | null) => void;
  format?: string;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  showTime?: boolean;
  timeFormat?: string;
  disabledDate?: (date: Date) => boolean;
  disabledTime?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  hint?: string;
  error?: string;
}

export interface TimePickerProps extends BaseProps, ActionProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (time: Date | null) => void;
  format?: string;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  hint?: string;
  error?: string;
}

export interface UploadFile {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
  size: number;
  type: string;
  percent?: number;
  url?: string;
  thumbUrl?: string;
  error?: any;
  response?: any;
  xhr?: any;
}

export interface UploadProps extends BaseProps {
  name?: string;
  accept?: string;
  multiple?: boolean;
  // directory?: string; // REMOVED - duplicate
  disabled?: boolean;
  showUploadList?: boolean | { showPreviewIcon?: boolean; showRemoveIcon?: boolean; showDownloadIcon?: boolean };
  listType?: 'text' | 'picture' | 'picture-card';
  action?: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  data?: Record<string, any> | ((file: UploadFile) => Record<string, any>);
  withCredentials?: boolean;
  beforeUpload?: (file: UploadFile, fileList: UploadFile[]) => boolean | Promise<void>;
  customRequest?: (options: any) => void;
  onChange?: (info: { file: UploadFile; fileList: UploadFile[]; event?: any }) => void;
  onRemove?: (file: UploadFile) => void | boolean | Promise<void>;
  onPreview?: (file: UploadFile) => void;
  onDownload?: (file: UploadFile) => void;
  maxCount?: number;
  progress?: { strokeWidth?: number; showInfo?: boolean; format?: (percent?: number, successPercent?: number) => string };
  uploadDirectory?: string; // Keep this one
  openFileDialogOnClick?: boolean;
}

export interface RateProps extends BaseProps {
  value?: number;
  defaultValue?: number;
  count?: number;
  allowHalf?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  character?: ReactNode | ((props: { index: number; value: number }) => ReactNode);
  tooltips?: string[];
  onChange?: (value: number) => void;
  onHoverChange?: (value: number) => void;
}

export interface SpinProps extends BaseProps, SizeProps {
  spinning?: boolean;
  indicator?: ReactNode;
  tip?: string;
  delay?: number;
  wrapperClassName?: string;
}

export interface EmptyProps extends BaseProps {
  image?: ReactNode;
  description?: string | ReactNode;
  children?: ReactNode;
}

export interface ResultProps extends BaseProps {
  status?: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';
  title?: string | ReactNode;
  subTitle?: string | ReactNode;
  icon?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
}

export interface SpaceProps extends BaseProps, ChildrenProps {
  direction?: 'horizontal' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | [number, number];
  align?: 'start' | 'end' | 'center' | 'baseline';
  wrap?: boolean;
  split?: ReactNode;
}

export interface DividerProps extends BaseProps {
  type?: 'horizontal' | 'vertical';
  orientation?: 'left' | 'center' | 'right';
  dashed?: boolean;
  plain?: boolean;
  children?: ReactNode;
}

// Renamed to avoid conflict with TypographyBaseProps
export interface TypographyVariantProps extends BaseProps, ChildrenProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  component?: keyof JSX.IntrinsicElements;
  gutterBottom?: boolean;
  noWrap?: boolean;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  display?: 'initial' | 'block' | 'inline';
  paragraph?: boolean;
}

export interface ContainerProps extends BaseProps, ChildrenProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fixed?: boolean;
  disableGutters?: boolean;
}

export interface GridContainerProps extends BaseProps, ChildrenProps {
  spacing?: number | [number, number];
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

export interface GridItemProps extends BaseProps, ChildrenProps {
  xs?: number | 'auto' | boolean;
  sm?: number | 'auto' | boolean;
  md?: number | 'auto' | boolean;
  lg?: number | 'auto' | boolean;
  xl?: number | 'auto' | boolean;
  order?: number;
  offset?: number;
}

// Fixed MenuItem definition
export interface MenuItemProps extends BaseProps {
  key: string;
  icon?: ReactElement;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
  children?: ReactNode;
  items?: MenuItemProps[]; // For submenus
}

export interface MenuProps extends BaseProps {
  mode?: 'vertical' | 'horizontal' | 'inline';
  theme?: 'light' | 'dark';
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  openKeys?: string[];
  defaultOpenKeys?: string[];
  onSelect?: (info: { key: string; selectedKeys: string[] }) => void;
  onOpenChange?: (openKeys: string[]) => void;
  inlineIndent?: number;
  multiple?: boolean;
  triggerSubMenuAction?: 'hover' | 'click';
  items?: MenuItemProps[];
}

export interface LayoutProps extends BaseProps, ChildrenProps {
  hasSider?: boolean;
}

export interface HeaderProps extends BaseProps, ChildrenProps {
  collapsed?: boolean;
  onCollapse?: () => void;
  logo?: ReactNode;
  menu?: ReactNode;
  actions?: ReactNode;
  user?: {
    name: string;
    avatar?: string;
    email?: string;
  };
}

export interface SidebarProps extends BaseProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  width?: number;
  collapsedWidth?: number;
  theme?: 'light' | 'dark';
  menu?: MenuItemProps[]; // Fixed to use MenuItemProps
  logo?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export interface FooterProps extends BaseProps, ChildrenProps {
  links?: Array<{ title: string; href: string }>;
  copyright?: string;
}

export interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  breakpoints: ThemeBreakpoints;
  zIndex: ThemeZIndex;
}

export interface ThemeColors {
  primary: ColorShades;
  secondary: ColorShades;
  success: ColorShades;
  warning: ColorShades;
  error: ColorShades;
  info: ColorShades;
  gray: ColorShades;
  background: {
    default: string;
    paper: string;
    dark: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    hint: string;
  };
  divider: string;
  border: string;
}

export interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeight: {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  h1: TypographyVariant;
  h2: TypographyVariant;
  h3: TypographyVariant;
  h4: TypographyVariant;
  h5: TypographyVariant;
  h6: TypographyVariant;
  body1: TypographyVariant;
  body2: TypographyVariant;
  caption: TypographyVariant;
  overline: TypographyVariant;
}

export interface TypographyVariant {
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing?: string;
  textTransform?: string;
}

export interface ThemeSpacing {
  unit: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeZIndex {
  mobileStepper: number;
  speedDial: number;
  appBar: number;
  drawer: number;
  modal: number;
  snackbar: number;
  tooltip: number;
  fab: number;
}

export interface NotificationConfig {
  maxCount?: number;
  duration?: number;
  placement?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
  closable?: boolean;
  closeIcon?: ReactNode;
  rtl?: boolean;
  pauseOnHover?: boolean;
  showProgress?: boolean;
}

export interface ToastConfig extends NotificationConfig {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  reverseOrder?: boolean;
  gutter?: number;
  containerStyle?: CSSProperties;
  toastOptions?: {
    className?: string;
    style?: CSSProperties;
    duration?: number;
  };
}

export interface DialogConfig {
  centered?: boolean;
  width?: string | number;
  fullWidth?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  scrollable?: boolean;
  closeOnEsc?: boolean;
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
  animation?: 'fade' | 'slide' | 'none';
  backdrop?: boolean | 'static';
  backdropClassName?: string;
  backdropTransitionDuration?: number;
  modalTransitionDuration?: number;
}