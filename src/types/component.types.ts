import type { ReactNode, ReactElement, ComponentType, CSSProperties, Ref } from 'react';
import type { Icon } from 'lucide-react';
import type { UserRole } from './index';

// ==============================================
// BASE COMPONENT PROPS
// ==============================================

export interface BaseProps {
  className?: string;
  style?: CSSProperties;
  id?: string;
  'data-testid'?: string;
  'data-cy'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  role?: string;
  tabIndex?: number;
  ref?: Ref<any>;
}

export interface WithChildren {
  children: ReactNode;
}

export interface WithIcon {
  icon?: ReactElement | typeof Icon;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface WithLoading {
  loading?: boolean;
  loadingText?: string;
  loadingIndicator?: ReactElement;
  skeleton?: boolean;
  skeletonCount?: number;
  skeletonHeight?: number;
  skeletonWidth?: number;
}

export interface WithError {
  error?: Error | string | null;
  errorMessage?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  errorComponent?: ReactElement;
}

export interface WithDisabled {
  disabled?: boolean;
  disabledReason?: string;
}

export interface WithReadonly {
  readOnly?: boolean;
}

export interface WithRequired {
  required?: boolean;
  requiredIndicator?: string | ReactElement;
}

export interface WithValidation {
  isValid?: boolean;
  isInvalid?: boolean;
  validationMessage?: string;
  validationIcon?: ReactElement;
  validationState?: 'success' | 'error' | 'warning' | 'info';
}

export interface WithSize {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
}

export interface WithColor {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'text';
  shade?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

export interface WithPosition {
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: number;
}

export interface WithSpacing {
  m?: string | number;
  mt?: string | number;
  mr?: string | number;
  mb?: string | number;
  ml?: string | number;
  mx?: string | number;
  my?: string | number;
  p?: string | number;
  pt?: string | number;
  pr?: string | number;
  pb?: string | number;
  pl?: string | number;
  px?: string | number;
  py?: string | number;
  gap?: string | number;
}

export interface WithFlex {
  flex?: string | number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justifySelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  order?: number;
}

export interface WithGrid {
  gridColumn?: string;
  gridRow?: string;
  gridArea?: string;
  colSpan?: number;
  rowSpan?: number;
  colStart?: number;
  colEnd?: number;
  rowStart?: number;
  rowEnd?: number;
}

export interface WithTypography {
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  textDecoration?: 'underline' | 'line-through' | 'none';
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  overflowWrap?: 'normal' | 'break-word' | 'anywhere';
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
}

export interface WithBorder {
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderWidth?: string | number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderColor?: string;
  borderRadius?: string | number;
  borderTopLeftRadius?: string | number;
  borderTopRightRadius?: string | number;
  borderBottomLeftRadius?: string | number;
  borderBottomRightRadius?: string | number;
}

export interface WithShadow {
  shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';
  shadowColor?: string;
  shadowOpacity?: number;
}

export interface WithTransition {
  transition?: string;
  transitionDuration?: string | number;
  transitionTimingFunction?: string;
  transitionDelay?: string | number;
  animate?: boolean;
  animation?: string;
}

export interface WithHover {
  hoverable?: boolean;
  hoverEffect?: 'scale' | 'glow' | 'lift' | 'darken' | 'opacity';
  hoverClassName?: string;
  hoverStyle?: CSSProperties;
}

export interface WithActive {
  active?: boolean;
  activeClassName?: string;
  activeStyle?: CSSProperties;
}

export interface WithFocus {
  focusable?: boolean;
  focusClassName?: string;
  focusStyle?: CSSProperties;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
}

export interface WithClick {
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onMouseMove?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
}

export interface WithKeyboard {
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  hotkey?: string;
  hotkeyScope?: string;
}

export interface WithTouch {
  onTouchStart?: (event: React.TouchEvent) => void;
  onTouchEnd?: (event: React.TouchEvent) => void;
  onTouchMove?: (event: React.TouchEvent) => void;
  onTouchCancel?: (event: React.TouchEvent) => void;
}

export interface WithDrag {
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent) => void;
  onDrag?: (event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
  onDragEnter?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDragLeave?: (event: React.DragEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
}

export interface WithScroll {
  onScroll?: (event: React.UIEvent) => void;
  scrollIntoView?: boolean;
  scrollBehavior?: 'auto' | 'smooth';
}

export interface WithResize {
  onResize?: (dimensions: { width: number; height: number }) => void;
  resizeObserver?: boolean;
}

export interface WithIntersection {
  onIntersect?: () => void;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// ==============================================
// LAYOUT COMPONENT PROPS
// ==============================================

export interface ContainerProps extends BaseProps, WithChildren, WithSpacing {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'prose';
  fixed?: boolean;
  disableGutters?: boolean;
  centerContent?: boolean;
  fluid?: boolean;
}

export interface StackProps extends BaseProps, WithChildren, WithSpacing {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: boolean;
  divider?: ReactElement;
  spacing?: number | [number, number];
  shouldWrapChildren?: boolean;
}

export interface GridProps extends BaseProps, WithChildren {
  columns?: number | Record<string, number>;
  rows?: number | Record<string, number>;
  gap?: number | [number, number];
  rowGap?: number;
  columnGap?: number;
  autoFlow?: 'row' | 'column' | 'row-dense' | 'column-dense';
  autoRows?: string;
  autoColumns?: string;
  templateAreas?: string[];
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
}

export interface GridItemProps extends BaseProps, WithChildren {
  colSpan?: number | Record<string, number>;
  rowSpan?: number | Record<string, number>;
  colStart?: number | Record<string, number>;
  colEnd?: number | Record<string, number>;
  rowStart?: number | Record<string, number>;
  rowEnd?: number | Record<string, number>;
  area?: string;
  justifySelf?: 'start' | 'end' | 'center' | 'stretch';
  alignSelf?: 'start' | 'end' | 'center' | 'stretch';
}

export interface FlexProps extends BaseProps, WithChildren {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: number | string;
  flex?: string | number;
  inline?: boolean;
}

export interface FlexItemProps extends BaseProps, WithChildren {
  flex?: string | number;
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justifySelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  order?: number;
  grow?: number;
  shrink?: number;
  basis?: string | number;
}

export interface BoxProps extends BaseProps, WithChildren, WithSpacing, WithBorder, WithShadow, WithTypography {
  as?: keyof React.JSX.IntrinsicElements | ComponentType<any>;
  bg?: string;
  color?: string;
  display?: 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  opacity?: number;
  visibility?: 'visible' | 'hidden' | 'collapse';
  cursor?: 'auto' | 'default' | 'pointer' | 'wait' | 'text' | 'move' | 'not-allowed' | 'help' | 'progress';
  userSelect?: 'none' | 'text' | 'all' | 'auto';
  pointerEvents?: 'none' | 'auto' | 'visiblePainted' | 'visibleFill' | 'visibleStroke' | 'visible' | 'painted' | 'fill' | 'stroke' | 'all';
}

// ==============================================
// TYPOGRAPHY COMPONENT PROPS
// ==============================================

export interface TextProps extends BaseProps, WithChildren, WithTypography, WithSpacing {
  as?: keyof React.JSX.IntrinsicElements;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline' | 'subtitle1' | 'subtitle2';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  noWrap?: boolean;
  truncate?: boolean | number;
  lineClamp?: number;
  gradient?: {
    from: string;
    to: string;
    deg?: number;
  };
}

export interface HeadingProps extends Omit<TextProps, 'variant'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ParagraphProps extends Omit<TextProps, 'variant'> {
  lead?: boolean;
  firstChild?: boolean;
  lastChild?: boolean;
}

export interface LinkProps extends BaseProps, WithChildren, WithTypography {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  download?: boolean | string;
  replace?: boolean;
  to?: string;
  state?: any;
  prefetch?: boolean;
  external?: boolean;
  unstyled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

// ==============================================
// FORM COMPONENT PROPS
// ==============================================

export interface FormProps extends BaseProps, WithChildren {
  onSubmit?: (event: React.FormEvent) => void;
  onReset?: (event: React.FormEvent) => void;
  onChange?: (event: React.ChangeEvent) => void;
  onInvalid?: (event: React.FormEvent) => void;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  action?: string;
  encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
  autoComplete?: 'on' | 'off';
  noValidate?: boolean;
  novalidate?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnMount?: boolean;
  resetAfterSubmit?: boolean;
}

export interface FormGroupProps extends BaseProps, WithChildren {
  label?: string | ReactElement;
  labelFor?: string;
  labelPosition?: 'top' | 'left' | 'right' | 'bottom';
  required?: boolean;
  error?: string | ReactElement;
  hint?: string | ReactElement;
  success?: string | ReactElement;
  warning?: string | ReactElement;
  info?: string | ReactElement;
  tooltip?: string | ReactElement;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  inline?: boolean;
  stacked?: boolean;
  helpText?: string | ReactElement;
  helpTextPosition?: 'top' | 'bottom';
}

export interface FormControlProps extends BaseProps {
  name: string;
  value?: any;
  defaultValue?: any;
  onChange?: (value: any, event?: any) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  touched?: boolean;
  dirty?: boolean;
}

export interface FieldProps extends FormControlProps {
  label?: string | ReactElement;
  placeholder?: string;
  hint?: string | ReactElement;
  success?: string | ReactElement;
  warning?: string | ReactElement;
  info?: string | ReactElement;
  tooltip?: string | ReactElement;
  leftElement?: ReactElement;
  rightElement?: ReactElement;
  leftAddon?: ReactElement | string;
  rightAddon?: ReactElement | string;
}

// ==============================================
// BUTTON COMPONENT PROPS
// ==============================================

export interface ButtonProps extends BaseProps, WithChildren, WithIcon, WithLoading, WithDisabled, WithSize, WithColor {
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent) => void;
  href?: string;
  target?: string;
  block?: boolean;
  rounded?: boolean | string | number;
  active?: boolean;
  loadingPosition?: 'left' | 'right';
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  iconOnly?: boolean;
  text?: string;
  title?: string;
}

// ==============================================
// FEEDBACK COMPONENT PROPS
// ==============================================

export interface AlertProps extends BaseProps, WithChildren, WithIcon {
  type?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  title?: string | ReactElement;
  description?: string | ReactElement;
  closable?: boolean;
  onClose?: () => void;
  showIcon?: boolean;
  icon?: ReactElement;
  action?: ReactElement;
  dismissible?: boolean;
  autoClose?: number | false;
  variant?: 'solid' | 'subtle' | 'left-accent' | 'top-accent' | 'outline';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

export interface ToastProps extends AlertProps {
  id?: string;
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  pauseOnHover?: boolean;
  pauseOnFocusLoss?: boolean;
  closeOnClick?: boolean;
  draggable?: boolean;
  draggablePercent?: number;
  transition?: 'bounce' | 'slide' | 'flip' | 'zoom';
  progress?: boolean;
  progressStyle?: CSSProperties;
  role?: 'alert' | 'status';
}

export interface ToastContainerProps {
  position?: ToastProps['position'];
  limit?: number;
  newestOnTop?: boolean;
  rtl?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocusLoss?: boolean;
  closeOnClick?: boolean;
  draggable?: boolean;
  draggablePercent?: number;
  transition?: ToastProps['transition'];
  containerStyle?: CSSProperties;
  containerClassName?: string;
  toastStyle?: CSSProperties;
  toastClassName?: string;
  progressStyle?: CSSProperties;
  progressClassName?: string;
}

export interface ProgressProps extends BaseProps {
  value: number;
  max?: number;
  min?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  trackColor?: string;
  striped?: boolean;
  animated?: boolean;
  indeterminate?: boolean;
  showValue?: boolean;
  valueFormat?: (value: number) => string;
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  radius?: string | number;
  label?: string | ReactElement;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'inside';
}

export interface SkeletonProps extends BaseProps {
  height?: string | number;
  width?: string | number;
  circle?: boolean;
  rounded?: boolean | string | number;
  count?: number;
  animate?: boolean;
  speed?: number;
  color?: string;
  highlightColor?: string;
  fadeDuration?: number;
  text?: boolean;
  textLines?: number;
  textGap?: number;
  textHeight?: number;
  children?: ReactNode;
  isLoaded?: boolean;
  container?: React.ComponentType<any>;
  containerProps?: Record<string, any>;
}

export interface SpinnerProps extends BaseProps, WithSize, WithColor {
  thickness?: number;
  speed?: number;
  emptyColor?: string;
  label?: string;
  labelPosition?: 'bottom' | 'top' | 'left' | 'right';
}

export interface EmptyStateProps extends BaseProps {
  icon?: ReactElement | typeof Icon;
  title?: string | ReactElement;
  description?: string | ReactElement;
  action?: ReactElement;
  actionText?: string;
  onAction?: () => void;
  illustration?: ReactElement | string;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

// ==============================================
// DATA DISPLAY COMPONENT PROPS
// ==============================================

export interface BadgeProps extends BaseProps, WithChildren, Omit<WithColor, 'variant'>, WithSize {
  count?: number;
  overflowCount?: number;
  dot?: boolean;
  showZero?: boolean;
  offset?: [number, number];
  title?: string;
  variant?: 'solid' | 'outline';
  rounded?: boolean | string | number;
  as?: keyof React.JSX.IntrinsicElements | ComponentType<any>;
}

export interface AvatarProps extends BaseProps {
  src?: string;
  name?: string;
  initials?: string;
  icon?: ReactElement | typeof Icon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  shape?: 'circle' | 'square' | 'rounded';
  color?: string;
  backgroundColor?: string;
  bordered?: boolean;
  borderColor?: string;
  borderWidth?: number;
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  statusPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  statusColor?: string;
  statusSize?: number;
  onClick?: () => void;
  onError?: () => void;
  alt?: string;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  loading?: 'eager' | 'lazy';
  referrerPolicy?: ReferrerPolicy;
  srcSet?: string;
  sizes?: string;
  children?: ReactNode;
  group?: boolean;
  groupIndex?: number;
  groupCount?: number;
  groupStack?: boolean;
  groupSpacing?: number;
  groupDirection?: 'row' | 'column';
}

export interface AvatarGroupProps extends BaseProps {
  children: ReactElement<AvatarProps> | ReactElement<AvatarProps>[];
  max?: number;
  spacing?: number;
  direction?: 'row' | 'column';
  size?: AvatarProps['size'];
  shape?: AvatarProps['shape'];
  bordered?: boolean;
  showExcess?: boolean;
  excessStyle?: CSSProperties;
  excessClassName?: string;
  excessComponent?: ReactElement;
}

export interface CardProps extends BaseProps, WithChildren, WithHover, WithActive {
  header?: ReactElement | string;
  footer?: ReactElement | string;
  title?: ReactElement | string;
  subtitle?: ReactElement | string;
  actions?: ReactElement | ReactElement[];
  media?: ReactElement | string;
  mediaPosition?: 'top' | 'bottom' | 'left' | 'right';
  mediaHeight?: number | string;
  mediaWidth?: number | string;
  bordered?: boolean;
  elevated?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean | string | number;
  padded?: boolean | 'sm' | 'md' | 'lg' | 'none';
  headerDivider?: boolean;
  footerDivider?: boolean;
  cover?: string;
  coverAlt?: string;
  onClick?: () => void;
  as?: keyof React.JSX.IntrinsicElements | ComponentType<any>;
  href?: string;
  target?: string;
}

export interface DividerProps extends BaseProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: string | number;
  color?: string;
  variant?: 'solid' | 'dashed' | 'dotted';
  label?: string | ReactElement;
  labelPosition?: 'left' | 'center' | 'right';
  spacing?: number;
}

export interface StatProps extends BaseProps {
  label: string | ReactElement;
  value: number | string;
  icon?: ReactElement | typeof Icon;
  iconColor?: string;
  iconBg?: string;
  trend?: number;
  trendLabel?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendColor?: string;
  format?: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'elevated' | 'filled';
  valueStyle?: CSSProperties;
  labelStyle?: CSSProperties;
}

export interface StatGroupProps extends BaseProps {
  children: ReactElement<StatProps> | ReactElement<StatProps>[];
  columns?: number | Record<string, number>;
  spacing?: number;
  direction?: 'row' | 'column';
  align?: 'stretch' | 'center' | 'start' | 'end';
}

export interface TimelineProps extends BaseProps {
  items: TimelineItem[];
  mode?: 'left' | 'right' | 'alternate' | 'top' | 'bottom';
  pending?: boolean | ReactNode;
  pendingDot?: ReactNode;
  reverse?: boolean;
  lineColor?: string;
  dotSize?: number;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  contentPosition?: 'left' | 'right' | 'alternate';
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  labelWidth?: number | string;
  align?: 'left' | 'center' | 'right';
}

export interface TimelineItem {
  key?: string;
  dot?: ReactNode;
  dotColor?: string;
  lineColor?: string;
  label?: ReactNode;
  children: ReactNode;
  position?: 'left' | 'right';
  color?: string;
  pending?: boolean;
}

// ==============================================
// OVERLAY COMPONENT PROPS
// ==============================================

export interface ModalProps extends BaseProps, WithChildren {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactElement;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | number | string;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  closeButtonProps?: ButtonProps;
  footer?: ReactElement;
  footerAlign?: 'left' | 'center' | 'right' | 'space-between';
  header?: ReactElement;
  headerDivider?: boolean;
  footerDivider?: boolean;
  centered?: boolean;
  scrollable?: boolean;
  scrollBehavior?: 'inside' | 'outside';
  blockScroll?: boolean;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'none';
  animationDuration?: number;
  animationTiming?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayBlur?: number;
  overlayOpacity?: number;
  overlayTransition?: boolean;
  zIndex?: number;
  trapFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  finalFocusRef?: React.RefObject<HTMLElement>;
  returnFocusOnClose?: boolean;
  preserveScrollBarGap?: boolean;
  onOpen?: () => void;
  onCloseComplete?: () => void;
  portal?: boolean;
  portalTarget?: HTMLElement;
}

export interface DrawerProps extends Omit<ModalProps, 'centered'> {
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | number | string;
  autoFocus?: boolean;
  enforceFocus?: boolean;
  restoreFocus?: boolean;
  showMask?: boolean;
  maskClosable?: boolean;
  maskStyle?: CSSProperties;
  keyboard?: boolean;
  zIndex?: number;
  afterOpenChange?: (open: boolean) => void;
}

export interface PopoverProps extends BaseProps {
  content: ReactNode;
  title?: ReactNode;
  trigger?: 'click' | 'hover' | 'focus' | 'contextMenu' | ('click' | 'hover' | 'focus' | 'contextMenu')[];
  placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
  children: ReactElement;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  overlayInnerStyle?: CSSProperties;
  arrow?: boolean;
  arrowPointAtCenter?: boolean;
  autoAdjustOverflow?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  focusDelay?: number;
  blurDelay?: number;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  destroyTooltipOnHide?: boolean;
  align?: {
    offset?: [number, number];
    targetOffset?: [number, number];
    overflow?: {
      adjustX?: boolean;
      adjustY?: boolean;
    };
    points?: [string, string];
  };
  color?: string;
  zIndex?: number;
  animation?: string;
  transitionName?: string;
}

export interface TooltipProps extends Omit<PopoverProps, 'content' | 'title'> {
  label: ReactNode;
}

export interface DropdownProps extends BaseProps {
  menu: DropdownMenu;
  children: ReactElement;
  placement?: 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'top' | 'bottom';
  trigger?: ('click' | 'hover' | 'contextMenu')[];
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  arrow?: boolean;
  disabled?: boolean;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  destroyPopupOnHide?: boolean;
  align?: Record<string, any>;
  autoFocus?: boolean;
  autoAdjustOverflow?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  transitionName?: string;
  placementPoint?: 'center' | 'mouse' | 'trigger';
  closeOnSelect?: boolean;
  closeOnClick?: boolean;
  closeOnClickOutside?: boolean;
}

export interface DropdownMenu {
  items: DropdownItem[];
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelect?: (info: { key: string; selectedKeys: string[] }) => void;
  multiple?: boolean;
  selectable?: boolean;
}

export interface DropdownItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  children?: DropdownItem[];
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
  shortcut?: string;
  description?: string;
}

// ==============================================
// NAVIGATION COMPONENT PROPS
// ==============================================

export interface MenuProps extends BaseProps {
  items: MenuItem[];
  mode?: 'vertical' | 'horizontal' | 'inline';
  theme?: 'light' | 'dark' | 'auto';
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  openKeys?: string[];
  defaultOpenKeys?: string[];
  onSelect?: (info: { key: string; selectedKeys: string[] }) => void;
  onDeselect?: (info: { key: string; selectedKeys: string[] }) => void;
  onOpenChange?: (openKeys: string[]) => void;
  inlineIndent?: number;
  multiple?: boolean;
  triggerSubMenuAction?: 'hover' | 'click';
  accordion?: boolean;
  collapse?: boolean;
  collapseWidth?: number;
  onCollapse?: (collapsed: boolean) => void;
  width?: number | string;
  className?: string;
  style?: CSSProperties;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
}

export interface MenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  children?: MenuItem[];
  title?: string;
  onClick?: () => void;
  path?: string;
  component?: ComponentType<any>;
  permissions?: string[];
  roles?: UserRole[];
  hidden?: boolean;
  badge?: number | ReactNode;
  badgeProps?: BadgeProps;
  testId?: string;
  'data-cy'?: string;
}

export interface BreadcrumbProps extends BaseProps {
  items: BreadcrumbItem[];
  separator?: string | ReactNode;
  maxItems?: number;
  params?: Record<string, string>;
  homeHref?: string;
  homeIcon?: ReactNode;
  renderItem?: (item: BreadcrumbItem, index: number) => ReactNode;
  renderCurrent?: (item: BreadcrumbItem) => ReactNode;
  expandText?: string;
  collapse?: boolean;
  collapseAfter?: number;
}

export interface BreadcrumbItem {
  title: ReactNode;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
  target?: string;
  rel?: string;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
}

export interface TabsProps extends BaseProps {
  tabs: Tab[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (activeKey: string) => void;
  onTabClick?: (key: string, event: React.MouseEvent) => void;
  type?: 'line' | 'card' | 'editable-card' | 'rounded' | 'capsule';
  size?: 'sm' | 'md' | 'lg';
  position?: 'top' | 'left' | 'right' | 'bottom';
  tabBarStyle?: CSSProperties;
  tabBarClassName?: string;
  tabBarExtraContent?: ReactNode;
  tabBarGutter?: number;
  centered?: boolean;
  animated?: boolean | { inkBar?: boolean; tabPane?: boolean };
  renderTabBar?: (props: any, DefaultTabBar: ComponentType) => ReactElement;
  destroyInactiveTabPane?: boolean;
  hideAdd?: boolean;
  addIcon?: ReactNode;
  onEdit?: (targetKey: string, action: 'add' | 'remove') => void;
  onTabScroll?: ({ direction }: { direction: 'left' | 'right' | 'top' | 'bottom' }) => void;
}

export interface Tab {
  key: string;
  label: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  closable?: boolean;
  forceRender?: boolean;
  className?: string;
  style?: CSSProperties;
  closeIcon?: ReactNode;
  danger?: boolean;
}

export interface PaginationProps extends BaseProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  onShowSizeChange?: (current: number, size: number) => void;
  showQuickJumper?: boolean | { goButton: ReactNode };
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  simple?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  showLessItems?: boolean;
  showTitle?: boolean;
  prevIcon?: ReactNode;
  nextIcon?: ReactNode;
  jumpPrevIcon?: ReactNode;
  jumpNextIcon?: ReactNode;
  itemRender?: (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', element: ReactNode) => ReactNode;
  role?: string;
  variant?: 'default' | 'outline' | 'simple';
  align?: 'left' | 'center' | 'right';
  responsive?: boolean;
  breakLabel?: string;
  siblingCount?: number;
  boundaryCount?: number;
}

export interface StepsProps extends BaseProps {
  steps: Step[];
  current?: number;
  direction?: 'horizontal' | 'vertical';
  labelPlacement?: 'horizontal' | 'vertical';
  status?: 'wait' | 'process' | 'finish' | 'error';
  size?: 'default' | 'small';
  progressDot?: boolean | ((iconDot: ReactNode, { index, status, title, description }: any) => ReactNode);
  onChange?: (current: number) => void;
  type?: 'default' | 'navigation' | 'inline';
  clickable?: boolean;
  responsive?: boolean;
  percent?: number;
  strokeWidth?: number;
  strokeColor?: string;
  trailColor?: string;
  icons?: {
    finish?: ReactNode;
    error?: ReactNode;
  };
}

export interface Step {
  title: ReactNode;
  description?: ReactNode;
  subTitle?: ReactNode;
  status?: 'wait' | 'process' | 'finish' | 'error';
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

// ==============================================
// DATA ENTRY COMPONENT PROPS
// ==============================================

export interface InputProps extends FieldProps, WithSize, WithIcon {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'range';
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  multiple?: boolean;
  capture?: boolean | 'user' | 'environment';
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  list?: string;
  spellCheck?: boolean;
  wrap?: 'soft' | 'hard';
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  format?: (value: string) => string;
  parse?: (value: string) => any;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  onPaste?: (event: React.ClipboardEvent) => void;
  onCopy?: (event: React.ClipboardEvent) => void;
  onCut?: (event: React.ClipboardEvent) => void;
  onCompositionStart?: (event: React.CompositionEvent) => void;
  onCompositionEnd?: (event: React.CompositionEvent) => void;
  onCompositionUpdate?: (event: React.CompositionEvent) => void;
  onSelect?: (event: React.SyntheticEvent) => void;
  onSearch?: (value: string) => void;
  searchButton?: boolean;
  searchButtonText?: string;
  searchButtonProps?: ButtonProps;
  clearable?: boolean;
  onClear?: () => void;
  showPasswordToggle?: boolean;
  passwordToggleIcon?: [ReactNode, ReactNode];
  counter?: boolean;
  maxLengthWarning?: boolean;
  warningThreshold?: number;
  characterCount?: (count: number) => ReactNode;
}

export interface TextareaProps extends Omit<InputProps, 'type' | 'resize'> {
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  autoSize?: boolean | { minRows?: number; maxRows?: number };
}

export interface SelectProps extends FieldProps, WithSize {
  options: SelectOption[];
  isMulti?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isRtl?: boolean;
  closeMenuOnSelect?: boolean;
  hideSelectedOptions?: boolean;
  blurInputOnSelect?: boolean;
  openMenuOnFocus?: boolean;
  openMenuOnClick?: boolean;
  menuPlacement?: 'auto' | 'bottom' | 'top';
  menuPosition?: 'absolute' | 'fixed';
  menuPortalTarget?: HTMLElement;
  menuShouldBlockScroll?: boolean;
  menuShouldScrollIntoView?: boolean;
  menuIsOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onInputChange?: (inputValue: string, actionMeta: any) => void;
  onMenuScrollToTop?: (event: WheelEvent | TouchEvent) => void;
  onMenuScrollToBottom?: (event: WheelEvent | TouchEvent) => void;
  filterOption?: (option: SelectOption, inputValue: string) => boolean;
  formatOptionLabel?: (option: SelectOption, { context }: { context: 'menu' | 'value' }) => ReactNode;
  getOptionLabel?: (option: SelectOption) => string;
  getOptionValue?: (option: SelectOption) => string;
  noOptionsMessage?: (obj: { inputValue: string }) => ReactNode;
  loadingMessage?: (obj: { inputValue: string }) => ReactNode;
  placeholder?: string;
  loadingIndicator?: ReactNode;
  clearIndicator?: ReactNode;
  dropdownIndicator?: ReactNode;
  indicatorSeparator?: ReactNode;
  components?: Record<string, ComponentType<any>>;
  styles?: Record<string, any>;
  theme?: (theme: any) => any;
  classNamePrefix?: string;
  escapeClearsValue?: boolean;
}

export interface SelectOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
  group?: string;
  groupOptions?: SelectOption[];
  data?: any;
}

export interface CheckboxProps extends Omit<FieldProps, 'label'> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  value?: string | number;
  children?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  colorScheme?: string;
  spacing?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export interface RadioProps extends Omit<FieldProps, 'label'> {
  checked?: boolean;
  defaultChecked?: boolean;
  value?: string | number;
  children?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  colorScheme?: string;
  spacing?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export interface RadioGroupProps extends Omit<FieldProps, 'value' | 'onChange' | 'name'> {
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number, event?: React.ChangeEvent) => void;
  options?: (RadioOption | string | number)[];
  children?: ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  name: string;
}

export interface RadioOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
  description?: string;
}

export interface SwitchProps extends Omit<FieldProps, 'label'> {
  checked?: boolean;
  defaultChecked?: boolean;
  value?: string | number;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
  thumbColor?: string;
  trackColor?: { on: string; off: string };
  icon?: { on: ReactNode; off: ReactNode };
  label?: ReactNode;
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
  showLabel?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export interface SliderProps extends FieldProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  onChangeEnd?: (value: number | [number, number]) => void;
  marks?: Record<number, ReactNode>;
  marksPosition?: 'top' | 'bottom';
  showValue?: boolean | 'auto' | 'always';
  valueFormat?: (value: number) => string;
  valuePosition?: 'top' | 'bottom' | 'left' | 'right';
  orientation?: 'horizontal' | 'vertical';
  reverse?: boolean;
  inverted?: boolean;
  track?: 'normal' | 'inverted' | false;
  range?: boolean;
  minStepsBetweenThumbs?: number;
  thumbSize?: number;
  thumbColor?: string;
  thumbBorderColor?: string;
  thumbBorderWidth?: number;
  trackColor?: string;
  trackActiveColor?: string;
  disabled?: boolean;
  readOnly?: boolean;
  debounce?: number;
}

export interface DatePickerProps extends FieldProps {
  selected?: Date | null;
  onChange?: (date: Date | null, event?: React.SyntheticEvent) => void;
  selectsRange?: boolean;
  startDate?: Date;
  endDate?: Date;
  excludeDates?: Date[];
  includeDates?: Date[];
  filterDate?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
  timeCaption?: string;
  dateFormat?: string | string[];
  timeFormat?: string;
  yearDropdownItemNumber?: number;
  scrollableYearDropdown?: boolean;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  showMonthYearDropdown?: boolean;
  dropdownMode?: 'scroll' | 'select';
  locale?: string | any;
  calendarStartDay?: number;
  highlightDates?: Array<{ [className: string]: Date[] }> | Date[];
  shouldCloseOnSelect?: boolean;
  popperClassName?: string;
  popperPlacement?: string;
  popperModifiers?: any[];
  popperProps?: any;
  portalId?: string;
  inline?: boolean;
  withPortal?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onCalendarOpen?: () => void;
  onCalendarClose?: () => void;
  onYearChange?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
  onMonthYearChange?: (date: Date) => void;
  onSelect?: (date: Date, event?: React.SyntheticEvent) => void;
  onClickOutside?: (event: React.MouseEvent) => void;
  onInputClick?: () => void;
  onInputError?: (error: any) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  calendarClassName?: string;
  dayClassName?: (date: Date) => string | null;
  monthClassName?: (date: Date) => string | null;
  timeClassName?: (date: Date) => string | null;
  weekDayClassName?: (date: Date) => string | null;
  formatWeekDay?: (day: string) => string;
  formatMonth?: (date: Date) => string;
  renderCustomHeader?: (params: any) => ReactNode;
  renderDayContents?: (day: number, date: Date) => ReactNode;
  fixedHeight?: boolean;
  showWeekNumbers?: boolean;
  showQuarterYearPicker?: boolean;
  showYearPicker?: boolean;
  strictParsing?: boolean;
  useShortMonthInDropdown?: boolean;
  useWeekdaysShort?: boolean;
  weeksInMonth?: number;
}

export interface TimePickerProps extends Omit<DatePickerProps, 'showTimeSelect' | 'showTimeSelectOnly'> {
  showTimeSelect: true;
  showTimeSelectOnly?: boolean;
}

export interface UploadProps extends BaseProps {
  accept?: string | string[];
  multiple?: boolean;
  directory?: boolean;
  disabled?: boolean;
  maxSize?: number;
  maxCount?: number;
  minSize?: number;
  name?: string;
  action?: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  data?: Record<string, any> | ((file: UploadFile) => Record<string, any>);
  withCredentials?: boolean;
  customRequest?: (options: UploadRequestOptions) => void;
  beforeUpload?: (file: UploadFile, fileList: UploadFile[]) => boolean | Promise<File | Blob | string>;
  onStart?: (file: UploadFile) => void;
  onProgress?: (event: ProgressEvent, file: UploadFile, fileList: UploadFile[]) => void;
  onSuccess?: (response: any, file: UploadFile, fileList: UploadFile[]) => void;
  onError?: (error: Error, file: UploadFile, fileList: UploadFile[]) => void;
  onChange?: (info: { file: UploadFile; fileList: UploadFile[]; event?: ProgressEvent }) => void;
  onRemove?: (file: UploadFile) => void | boolean | Promise<void | boolean>;
  onPreview?: (file: UploadFile) => void;
  onDownload?: (file: UploadFile) => void;
  onDrop?: (event: React.DragEvent) => void;
  fileList?: UploadFile[];
  defaultFileList?: UploadFile[];
  listType?: 'text' | 'picture' | 'picture-card';
  showUploadList?: boolean | UploadListProps;
  progress?: UploadProgressProps;
  iconRender?: (file: UploadFile, listType?: UploadListType) => ReactNode;
  itemRender?: (originNode: ReactNode, file: UploadFile, fileList: UploadFile[], actions: { download: () => void; preview: () => void; remove: () => void }) => ReactNode;
  previewFile?: (file: File | Blob) => Promise<string>;
  transformFile?: (file: File) => File | Blob | string | Promise<File | Blob | string>;
  directoryMaxCount?: number;
}

export interface UploadFile {
  uid: string;
  name: string;
  fileName?: string;
  size?: number;
  type?: string;
  percent?: number;
  status?: 'ready' | 'uploading' | 'success' | 'error' | 'done' | 'removed';
  response?: any;
  error?: any;
  url?: string;
  thumbUrl?: string;
  originFileObj?: File;
  xhr?: XMLHttpRequest;
  width?: number;
  height?: number;
  lastModified?: number;
  lastModifiedDate?: Date;
}

export interface UploadRequestOptions {
  action: string;
  method: string;
  data?: Record<string, any>;
  filename?: string;
  file: File | Blob;
  headers?: Record<string, string>;
  onProgress?: (event: { percent: number }) => void;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
  withCredentials?: boolean;
}

export interface UploadListProps {
  showPreviewIcon?: boolean;
  showRemoveIcon?: boolean;
  showDownloadIcon?: boolean;
  showReuploadIcon?: boolean;
  previewIcon?: ReactNode;
  removeIcon?: ReactNode;
  downloadIcon?: ReactNode;
  reuploadIcon?: ReactNode;
  iconRender?: (file: UploadFile) => ReactNode;
  onPreview?: (file: UploadFile) => void;
  onRemove?: (file: UploadFile) => void | Promise<void>;
  onDownload?: (file: UploadFile) => void;
  onReupload?: (file: UploadFile) => void;
  items?: UploadFile[];
  progress?: UploadProgressProps;
  appendToBody?: boolean;
}

export interface UploadProgressProps {
  strokeWidth?: number;
  showInfo?: boolean;
  format?: (percent?: number, successPercent?: number) => string;
  strokeColor?: string | Record<string, string>;
  success?: { percent?: number; strokeColor?: string };
}

export type UploadListType = 'text' | 'picture' | 'picture-card';

// ==============================================
// DATA TABLE COMPONENT PROPS
// ==============================================

export interface TableProps<T = any> extends BaseProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: TablePagination | false;
  rowKey?: string | ((record: T) => string);
  rowSelection?: TableRowSelection<T>;
  expandable?: TableExpandable<T>;
  scroll?: TableScroll;
  sortable?: boolean;
  filterable?: boolean;
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'simple' | 'striped' | 'unstyled';
  emptyText?: ReactNode | (() => ReactNode);
  footer?: ReactNode | ((data: T[]) => ReactNode);
  title?: ReactNode | ((data: T[]) => ReactNode);
  summary?: ReactNode | ((data: T[]) => ReactNode);
  caption?: ReactNode;
  onRow?: (record: T, index?: number) => TableRowProps;
  onHeaderRow?: (columns: TableColumn<T>[], index?: number) => TableRowProps;
  onCell?: (record: T, column: TableColumn<T>, index?: number) => TableCellProps;
  onHeaderCell?: (column: TableColumn<T>, index?: number) => TableCellProps;
  onChange?: (pagination: TablePagination, filters: Record<string, any>, sorter: TableSorter<T>) => void;
  components?: TableComponents;
  sticky?: boolean | { offsetHeader?: number; offsetSummary?: number; offsetScroll?: number };
  rowClassName?: string | ((record: T, index: number) => string);
  headerClassName?: string | ((columns: TableColumn<T>[], index: number) => string);
  footerClassName?: string;
  tableLayout?: 'auto' | 'fixed';
  showHeader?: boolean;
  virtual?: boolean;
  virtualRowHeight?: number;
  virtualThreshold?: number;
}

export interface TableColumn<T = any> {
  key?: string;
  title: ReactNode;
  dataIndex?: keyof T | string[];
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right' | boolean;
  sorter?: boolean | ((a: T, b: T) => number);
  sortOrder?: 'ascend' | 'descend' | null;
  sortDirections?: Array<'ascend' | 'descend'>;
  defaultSortOrder?: 'ascend' | 'descend';
  filters?: TableFilter[];
  onFilter?: (value: any, record: T) => boolean;
  filterMultiple?: boolean;
  filterDropdown?: ReactNode | ((props: FilterDropdownProps) => ReactNode);
  filterDropdownVisible?: boolean;
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
  filteredValue?: any[];
  filtered?: boolean;
  ellipsis?: boolean | { showTitle?: boolean };
  colSpan?: number;
  rowSpan?: number;
  className?: string;
  style?: CSSProperties;
  hidden?: boolean;
  responsive?: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')[];
  children?: TableColumn<T>[];
}

export interface TableFilter {
  text: ReactNode;
  value: string | number | boolean;
  children?: TableFilter[];
}

export interface FilterDropdownProps {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: () => void;
  clearFilters: () => void;
  filters?: TableFilter[];
  visible: boolean;
}

export interface TableRowSelection<T = any> {
  type?: 'checkbox' | 'radio';
  selectedRowKeys?: string[];
  defaultSelectedRowKeys?: string[];
  onChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  onSelect?: (record: T, selected: boolean, selectedRows: T[], nativeEvent: Event) => void;
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  onSelectInvert?: (selectedRowKeys: string[]) => void;
  onSelectNone?: () => void;
  columnTitle?: ReactNode;
  columnWidth?: number | string;
  getCheckboxProps?: (record: T) => Record<string, any>;
  hideSelectAll?: boolean;
  selections?: TableSelectionItem[];
  fixed?: boolean;
  renderCell?: (value: any, record: T, index: number, originNode: ReactNode) => ReactNode;
}

export interface TableSelectionItem {
  key: string;
  text: ReactNode;
  onSelect?: (keys: string[]) => void;
}

export interface TableExpandable<T = any> {
  expandedRowKeys?: string[];
  defaultExpandedRowKeys?: string[];
  expandedRowRender?: (record: T, index: number, indent: number, expanded: boolean) => ReactNode;
  expandIcon?: (props: { expanded: boolean; onExpand: (record: T, event: React.MouseEvent) => void; record: T }) => ReactNode;
  expandIconColumnIndex?: number;
  expandRowByClick?: boolean;
  indentSize?: number;
  onExpand?: (expanded: boolean, record: T) => void;
  onExpandedRowsChange?: (expandedRowKeys: string[]) => void;
  fixed?: boolean | 'left' | 'right';
  showExpandColumn?: boolean;
  expandedRowClassName?: (record: T, index: number, indent: number) => string;
  childrenColumnName?: string;
  defaultExpandAllRows?: boolean;
}

export interface TablePagination {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean | { goButton: ReactNode };
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  simple?: boolean;
  size?: 'default' | 'small';
  position?: ('topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight')[];
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  hideOnSinglePage?: boolean;
  showLessItems?: boolean;
  showTitle?: boolean;
  prevIcon?: ReactNode;
  nextIcon?: ReactNode;
  jumpPrevIcon?: ReactNode;
  jumpNextIcon?: ReactNode;
  itemRender?: (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', element: ReactNode) => ReactNode;
  responsive?: boolean;
  role?: string;
}

export interface TableScroll {
  x?: number | string | boolean;
  y?: number | string;
  scrollToFirstRowOnChange?: boolean;
}

export interface TableSorter<T> {
  column: TableColumn<T>;
  order: 'ascend' | 'descend' | null;
  field: keyof T;
  columnKey: string;
}

export interface TableRowProps {
  className?: string;
  style?: CSSProperties;
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  'aria-label'?: string;
  'aria-selected'?: boolean;
  role?: string;
}

export interface TableCellProps extends TableRowProps {
  colSpan?: number;
  rowSpan?: number;
  align?: 'left' | 'center' | 'right';
}

export interface TableComponents {
  table?: React.ComponentType<any>;
  header?: {
    wrapper?: React.ComponentType<any>;
    row?: React.ComponentType<any>;
    cell?: React.ComponentType<any>;
  };
  body?: {
    wrapper?: React.ComponentType<any>;
    row?: React.ComponentType<any>;
    cell?: React.ComponentType<any>;
  };
}
// ==============================================
// CHART COMPONENT PROPS
// ==============================================

export interface ChartProps extends BaseProps {
  width?: number | string;
  height?: number | string;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  loading?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;
  noData?: boolean;
  noDataText?: string;
  tooltip?: boolean;
  legend?: boolean | ChartLegend;
  grid?: boolean | ChartGrid;
  theme?: 'light' | 'dark' | Record<string, any>;
  animation?: boolean | ChartAnimation;
  responsive?: boolean;
  syncId?: string;
  margin?: ChartMargin;
  className?: string;
  style?: CSSProperties;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
  onMouseMove?: (data: any, event: React.MouseEvent) => void;
  onMouseDown?: (data: any, event: React.MouseEvent) => void;
  onMouseUp?: (data: any, event: React.MouseEvent) => void;
  onFocus?: (data: any, event: React.FocusEvent) => void;
  onBlur?: (data: any, event: React.FocusEvent) => void;
}

export interface ChartLegend {
  show?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'inside' | 'outside';
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  layout?: 'horizontal' | 'vertical';
  iconType?: 'circle' | 'diamond' | 'line' | 'rect' | 'square' | 'triangle';
  iconSize?: number;
  formatter?: (value: string, entry: any) => ReactNode;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
  wrapperStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  itemHoverStyle?: CSSProperties;
}

export interface ChartGrid {
  show?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
  strokeDasharray?: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillOpacity?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export interface ChartAnimation {
  duration?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | string;
  begin?: number;
  isActive?: boolean;
  shouldUpdate?: (props: any, nextProps: any) => boolean;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

export interface ChartMargin {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export interface ChartAxis {
  show?: boolean;
  name?: string;
  unit?: string;
  type?: 'number' | 'category' | 'time';
  dataKey?: string;
  domain?: [any, any];
  allowDataOverflow?: boolean;
  allowDecimals?: boolean;
  allowDuplicatedCategory?: boolean;
  hide?: boolean;
  orientation?: 'top' | 'bottom' | 'left' | 'right';
  tick?: boolean | ChartTick;
  tickLine?: boolean | ChartTickLine;
  axisLine?: boolean | ChartAxisLine;
  minTickGap?: number;
  tickSize?: number;
  tickMargin?: number;
  tickFormatter?: (value: any, index: number) => string;
  interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
  padding?: { top?: number; bottom?: number; left?: number; right?: number };
  label?: string | number | ReactNode | ChartLabel;
  scale?: 'auto' | 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'utc' | 'sequential' | 'threshold';
  reversed?: boolean;
}

export interface ChartTick {
  show?: boolean;
  line?: boolean;
  lineStyle?: CSSProperties;
  textStyle?: CSSProperties;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fill?: string;
  fontSize?: number;
  fontFamily?: string;
  angle?: number;
  dx?: number;
  dy?: number;
  width?: number;
  height?: number;
  transform?: string;
}

export interface ChartTickLine {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export interface ChartAxisLine {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export interface ChartLabel {
  value?: string | number;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'inside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'insideTopLeft' | 'insideBottomLeft' | 'insideTopRight' | 'insideBottomRight' | 'outside' | 'outsideLeft' | 'outsideRight' | 'outsideTop' | 'outsideBottom';
  offset?: number;
  formatter?: (value: any) => ReactNode;
  content?: ReactNode;
  style?: CSSProperties;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  fontFamily?: string;
}

export interface BarChartProps extends ChartProps {
  data: any[];
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  layout?: 'horizontal' | 'vertical';
  barSize?: number;
  maxBarSize?: number;
  barGap?: number;
  barCategoryGap?: number;
  stackOffset?: 'expand' | 'none' | 'wiggle' | 'silhouette' | 'sign';
  reverseStackOrder?: boolean;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface BarSeries {
  dataKey: string;
  name?: string;
  stackId?: string;
  color?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  opacity?: number;
  barSize?: number;
  maxBarSize?: number;
  label?: boolean | ChartLabel;
  legendType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'plainline';
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface LineChartProps extends ChartProps {
  data: any[];
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  connectNulls?: boolean;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface LineSeries {
  dataKey: string;
  name?: string;
  color?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fill?: string;
  fillOpacity?: number;
  dot?: boolean | ChartDot;
  activeDot?: boolean | ChartDot;
  type?: 'basis' | 'basisClosed' | 'basisOpen' | 'bumpX' | 'bumpY' | 'bump' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
  connectNulls?: boolean;
  opacity?: number;
  label?: boolean | ChartLabel;
  legendType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'plainline';
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface ChartDot {
  r?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillOpacity?: number;
  cx?: number;
  cy?: number;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface PieChartProps extends ChartProps {
  data: any[];
  cx?: number | string;
  cy?: number | string;
  innerRadius?: number | string;
  outerRadius?: number | string;
  startAngle?: number;
  endAngle?: number;
  minAngle?: number;
  paddingAngle?: number;
  label?: boolean | ChartLabel;
  labelLine?: boolean | ChartLabelLine;
  legendType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'plainline';
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface ChartLabelLine {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  length?: number;
  length2?: number;
  offset?: number;
}

export interface AreaChartProps extends ChartProps {
  data: any[];
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  baseValue?: number | 'dataMin' | 'dataMax' | 'auto';
  stackOffset?: 'expand' | 'none' | 'wiggle' | 'silhouette' | 'sign';
  connectNulls?: boolean;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface AreaSeries extends LineSeries {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  type?: 'basis' | 'basisClosed' | 'basisOpen' | 'bumpX' | 'bumpY' | 'bump' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
  dot?: boolean | ChartDot;
  activeDot?: boolean | ChartDot;
  label?: boolean | ChartLabel;
}

export interface RadarChartProps extends ChartProps {
  data: any[];
  cx?: number | string;
  cy?: number | string;
  innerRadius?: number | string;
  outerRadius?: number | string;
  startAngle?: number;
  endAngle?: number;
  clockWise?: boolean;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface RadarSeries {
  dataKey: string;
  name?: string;
  color?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fill?: string;
  fillOpacity?: number;
  dot?: boolean | ChartDot;
  activeDot?: boolean | ChartDot;
  legendType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'plainline';
}

export interface RadialBarChartProps extends ChartProps {
  data: any[];
  cx?: number | string;
  cy?: number | string;
  innerRadius?: number | string;
  outerRadius?: number | string;
  startAngle?: number;
  endAngle?: number;
  barSize?: number;
  maxBarSize?: number;
  barGap?: number;
  barCategoryGap?: number;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface RadialBarSeries {
  dataKey: string;
  name?: string;
  color?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  opacity?: number;
  label?: boolean | ChartLabel;
  legendType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'plainline';
}

export interface ScatterChartProps extends ChartProps {
  data: any[];
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  zAxis?: ChartAxis;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface ScatterSeries {
  dataKey: string;
  name?: string;
  color?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  opacity?: number;
  shape?: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye' | React.ComponentType<any>;
  line?: boolean | ChartLine;
  label?: boolean | ChartLabel;
  legendType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'plainline';
}

export interface ChartLine {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  type?: 'basis' | 'basisClosed' | 'basisOpen' | 'bumpX' | 'bumpY' | 'bump' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
  dot?: boolean | ChartDot;
  activeDot?: boolean | ChartDot;
}

export interface ComposedChartProps extends ChartProps {
  data: any[];
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface TooltipProps {
  active?: boolean;
  content?: ReactNode;
  contentStyle?: CSSProperties;
  itemStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  wrapperStyle?: CSSProperties;
  cursor?: boolean | ChartCursor;
  coordinate?: { x: number; y: number };
  offset?: number;
  position?: { x: number; y: number };
  viewBox?: { x: number; y: number; width: number; height: number };
  allowEscapeViewBox?: { x?: boolean; y?: boolean };
  reverse?: boolean;
  filterNull?: boolean;
  useTranslate3d?: boolean;
  separator?: string;
  formatter?: (value: any, name: string, entry: any, index: number) => ReactNode;
  labelFormatter?: (label: any) => ReactNode;
  itemSorter?: (item: any) => number;
}

export interface ChartCursor {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fill?: string;
  fillOpacity?: number;
}

export interface BrushProps {
  dataKey?: string;
  data?: any[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  travellerWidth?: number;
  gap?: number;
  padding?: { top?: number; bottom?: number };
  startIndex?: number;
  endIndex?: number;
  onChange?: (range: { startIndex: number; endIndex: number }) => void;
  onDrag?: (range: { startIndex: number; endIndex: number }) => void;
  onDragEnd?: (range: { startIndex: number; endIndex: number }) => void;
  onDragStart?: (range: { startIndex: number; endIndex: number }) => void;
  stroke?: string;
  fill?: string;
  traveller?: ReactNode;
  alwaysShowText?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface ReferenceLineProps {
  x?: number | string;
  y?: number | string;
  segment?: Array<{ x?: number | string; y?: number | string }>;
  position?: 'top' | 'bottom' | 'left' | 'right';
  label?: string | number | ReactNode | ChartLabel;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  ifOverflow?: 'hidden' | 'visible' | 'discard' | 'extendDomain';
  alwaysShow?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface ReferenceDotProps {
  x: number | string;
  y: number | string;
  r?: number;
  label?: string | number | ReactNode | ChartLabel;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fill?: string;
  fillOpacity?: number;
  ifOverflow?: 'hidden' | 'visible' | 'discard' | 'extendDomain';
  alwaysShow?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}

export interface ReferenceAreaProps {
  x1?: number | string;
  x2?: number | string;
  y1?: number | string;
  y2?: number | string;
  label?: string | number | ReactNode | ChartLabel;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fill?: string;
  fillOpacity?: number;
  ifOverflow?: 'hidden' | 'visible' | 'discard' | 'extendDomain';
  alwaysShow?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: (data: any, event: React.MouseEvent) => void;
  onMouseEnter?: (data: any, event: React.MouseEvent) => void;
  onMouseLeave?: (data: any, event: React.MouseEvent) => void;
}