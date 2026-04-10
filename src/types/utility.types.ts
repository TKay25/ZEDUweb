// ==============================================
// UTILITY TYPES
// ==============================================

export type ID = string | number;

export type DateTime = string;

// Removed duplicate Email, PhoneNumber, URL, Theme - they exist in index.ts

export type Currency = 'USD' | 'ZWL' | 'EUR' | 'GBP' | 'ZAR' | 'BWP' | 'MWK' | 'MZN';

export type Language = 'en' | 'sn' | 'nd' | 'fr' | 'sw' | 'pt' | 'zu' | 'xh';

export type Status = 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted' | 'archived';

export type Priority = 'low' | 'medium' | 'high' | 'critical' | 'urgent';

export type Severity = 'info' | 'success' | 'warning' | 'error' | 'critical';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';

export type Direction = 'ltr' | 'rtl';

export type Orientation = 'horizontal' | 'vertical';

export type Alignment = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export type Justification = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

// ==============================================
// HELPER TYPES
// ==============================================

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Maybe<T> = T | null | undefined;

export type ValueOf<T> = T[keyof T];

export type KeysOf<T> = (keyof T)[];

export type Entries<T> = [keyof T, ValueOf<T>][];

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

export type DeepReadonly<T> = T extends object ? {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;

export type DeepNonNullable<T> = T extends object ? {
  [P in keyof T]-?: NonNullable<T[P]>;
} : NonNullable<T>;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type PickOptional<T> = Pick<T, OptionalKeys<T>>;

export type PickRequired<T> = Pick<T, RequiredKeys<T>>;

// Removed custom Omit - using TypeScript's built-in Omit instead

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type ExactlyOne<T, U = { [K in keyof T]: Pick<T, K> }> = {
  [K in keyof U]: Partial<Record<Exclude<keyof T, K>, undefined>> & U[K];
}[keyof U];

export type OneOrMany<T> = T | T[];

export type OneOrMore<T> = T | [T, ...T[]];

export type ZeroOrOne<T> = T | undefined;

export type ZeroOrMore<T> = T[];

export type Dictionary<T = any> = Record<string, T>;

export type NumericDictionary<T = any> = Record<number, T>;

export type Indexable<T = any> = { [key: string]: T };

export type Func<TArgs extends any[] = any[], TReturn = any> = (...args: TArgs) => TReturn;

export type AsyncFunc<TArgs extends any[] = any[], TReturn = any> = (...args: TArgs) => Promise<TReturn>;

export type Constructor<T = any, TArgs extends any[] = any[]> = new (...args: TArgs) => T;

export type Class<T = any> = new (...args: any[]) => T;

export type AbstractClass<T = any, TArgs extends any[] = any[]> = abstract new (...args: TArgs) => T;

export type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;

export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any;

export type PromiseValue<T> = T extends Promise<infer U> ? U : T;

export type ArrayElement<T> = T extends (infer U)[] ? U : never;

export type TupleToUnion<T extends any[]> = T[number];

export type UnionToTuple<T> = 
  (T extends any ? (t: T) => T : never) extends infer U
  ? (U extends any ? (u: U) => any : never) extends (v: infer V) => any
    ? V
    : never
  : never;

export type StringLiteral<T> = T extends string ? (string extends T ? never : T) : never;

export type NumericLiteral<T> = T extends number ? (number extends T ? never : T) : never;

export type BooleanLiteral<T> = T extends boolean ? (boolean extends T ? never : T) : never;

export type Primitive = string | number | boolean | symbol | bigint | null | undefined;

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}

export type Serializable = 
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | RegExp
  | Error
  | Serializable[]
  | { [key: string]: Serializable };

// ==============================================
// FUNCTIONAL UTILITY TYPES
// ==============================================

export type UnaryFunction<T, R> = (arg: T) => R;

export type BinaryFunction<T1, T2, R> = (arg1: T1, arg2: T2) => R;

export type TernaryFunction<T1, T2, T3, R> = (arg1: T1, arg2: T2, arg3: T3) => R;

export type Predicate<T> = (value: T) => boolean;

export type Comparator<T> = (a: T, b: T) => number;

export type Equals<T> = (a: T, b: T) => boolean;

export type Mapper<T, R> = (value: T, index: number, array: T[]) => R;

export type Reducer<T, R> = (accumulator: R, current: T, index: number, array: T[]) => R;

export type Filterer<T> = (value: T, index: number, array: T[]) => boolean;

export type Callback<TArgs extends any[] = any[]> = (...args: TArgs) => void;

export type EventHandler<TEvent = any> = (event: TEvent) => void;

export type ChangeHandler<TValue = any> = (value: TValue) => void;

export type ErrorHandler<TError = Error> = (error: TError) => void;

// ==============================================
// REACT UTILITY TYPES
// ==============================================

import type { ReactNode, ReactElement, ComponentType, ComponentProps } from 'react';

export type PropsOf<T> = T extends ComponentType<infer P> 
  ? P 
  : T extends keyof React.JSX.IntrinsicElements 
    ? React.JSX.IntrinsicElements[T] 
    : any;

export type ComponentPropsWithRef<T extends ComponentType<any>> = T extends new (props: infer P) => any
  ? P & { ref?: import('react').Ref<InstanceType<T>> }
  : ComponentProps<T>;

export type ElementType = keyof React.JSX.IntrinsicElements | ComponentType<any>;

export type ElementProps<T extends ElementType> = T extends ComponentType<infer P>
  ? P
  : T extends keyof React.JSX.IntrinsicElements
    ? React.JSX.IntrinsicElements[T]
    : any;

export type ElementRef<T extends ElementType> = T extends new (props: any) => any
  ? InstanceType<T>
  : T extends keyof React.JSX.IntrinsicElements
    ? React.JSX.IntrinsicElements[T] extends { ref?: infer R }
      ? R extends import('react').Ref<infer E>
        ? E
        : never
      : never
    : never;

export type AsProps<T extends ElementType = ElementType> = {
  as?: T;
} & ElementProps<T>;

export type PolymorphicProps<T extends ElementType, P = {}> = AsProps<T> & Omit<P, keyof AsProps<T>>;

export type WithChildren<P = {}> = P & { children?: ReactNode };

export type WithClassName<P = {}> = P & { className?: string };

export type WithStyle<P = {}> = P & { style?: import('react').CSSProperties };

export type WithTestId<P = {}> = P & { 'data-testid'?: string };

export type WithRef<P = {}, T = any> = P & { ref?: import('react').Ref<T> };

export type WithKey<P = {}> = P & { key?: import('react').Key };

export type WithID<P = {}> = P & { id?: string };

export type Component<P = {}> = (props: P) => ReactElement | null;

export type FC<P = {}> = import('react').FC<WithChildren<P>>;

// VFC is deprecated in React 18, but we'll alias it to FC for backward compatibility
export type VFC<P = {}> = import('react').FC<P>;

export type ForwardRefComponent<T, P = {}> = import('react').ForwardRefExoticComponent<P & import('react').RefAttributes<T>>;

export type LazyComponent<T extends ComponentType<any>> = import('react').LazyExoticComponent<T>;

export type SuspenseProps = import('react').SuspenseProps;

export type ErrorBoundaryProps = {
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: import('react').ErrorInfo) => void;
  onReset?: () => void;
  children?: ReactNode;
};

export type PortalProps = {
  children: ReactNode;
  container?: Element | DocumentFragment;
  disablePortal?: boolean;
};

// ==============================================
// DATE UTILITY TYPES
// ==============================================

export type ISO8601Date = string;

export type ISO8601DateTime = string;

export type UnixTimestamp = number;

export type DateRange = {
  start: Date;
  end: Date;
};

export type DatePreset = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'lastQuarter' | 'thisYear' | 'lastYear' | 'allTime';

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type MonthName = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';

export type Quarter = 1 | 2 | 3 | 4;

export type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

// ==============================================
// COLOR UTILITY TYPES
// ==============================================

export type RGBColor = `rgb(${number}, ${number}, ${number})`;

export type RGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`;

export type HexColor = `#${string}`;

export type HSLColor = `hsl(${number}, ${number}%, ${number}%)`;

export type HSLAColor = `hsla(${number}, ${number}%, ${number}%, ${number})`;

export type ColorName = string;

export type Color = RGBColor | RGBAColor | HexColor | HSLColor | HSLAColor | ColorName;

export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type ColorPalette = {
  [key in ColorShade]?: Color;
};

// ==============================================
// NUMBER UTILITY TYPES
// ==============================================

export type Integer = number & { __int__: void };

export type PositiveInteger = number & { __positive__: void };

export type NegativeInteger = number & { __negative__: void };

export type NonZeroInteger = number & { __nonzero__: void };

export type Float = number & { __float__: void };

export type Percentage = number & { __percentage__: void };

export type Range<Min extends number, Max extends number> = number & { __range__: [Min, Max] };

export type InclusiveRange<Min extends number, Max extends number> = number & { __inclusive_range__: [Min, Max] };

// ==============================================
// STRING UTILITY TYPES
// ==============================================

export type NonEmptyString = string & { __nonempty__: void };

export type UUID = string & { __uuid__: void };

// Renamed branded types to avoid conflicts with index.ts
export type EmailBranded = string & { __email__: void };

export type URLBranded = string & { __url__: void };

export type PhoneNumberBranded = string & { __phone__: void };

export type PostalCode = string & { __postal__: void };

export type CreditCard = string & { __credit_card__: void };

export type Base64 = string & { __base64__: void };

export type HexString = string & { __hex__: void };

export type Base64Url = string & { __base64url__: void };

export type JWT = string & { __jwt__: void };

// ==============================================
// ENVIRONMENT UTILITY TYPES
// ==============================================

export type Environment = 'development' | 'staging' | 'production' | 'test';

export type Platform = 'web' | 'mobile' | 'desktop' | 'tablet';

export type Browser = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'ie' | 'unknown';

export type OS = 'windows' | 'mac' | 'linux' | 'ios' | 'android' | 'unknown';

export type Device = 'mobile' | 'tablet' | 'desktop' | 'tv' | 'watch' | 'unknown';

export type ConnectionType = 'wifi' | 'cellular' | 'ethernet' | 'none' | 'unknown';

export type ConnectionEffectiveType = 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'unknown';

// ==============================================
// FILE UTILITY TYPES
// ==============================================

export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'code' | 'other';

export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'svg' | 'bmp' | 'ico';

export type VideoFormat = 'mp4' | 'webm' | 'ogg' | 'mov' | 'avi' | 'mkv' | 'flv' | 'wmv';

export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'aac' | 'flac' | 'm4a' | 'wma';

export type DocumentFormat = 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'txt' | 'rtf' | 'odt';

export type ArchiveFormat = 'zip' | 'rar' | '7z' | 'tar' | 'gz' | 'bz2';

export type CodeFormat = 'js' | 'ts' | 'jsx' | 'tsx' | 'html' | 'css' | 'scss' | 'json' | 'xml' | 'yaml' | 'md';

export type MimeType = string;

export type FileExtension = string;

export type FileSize = number; // in bytes

export type FileMetadata = {
  name: string;
  size: FileSize;
  type: MimeType;
  lastModified: number;
  extension?: FileExtension;
  width?: number;
  height?: number;
  duration?: number;
};

// ==============================================
// API UTILITY TYPES
// ==============================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';

export type HttpStatus = 
  | 100 | 101 | 102 | 103
  | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
  | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308
  | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451
  | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

export type HttpStatusCategory = 'informational' | 'success' | 'redirection' | 'clientError' | 'serverError';

export type ContentType = 
  | 'application/json'
  | 'application/xml'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain'
  | 'text/html'
  | 'text/css'
  | 'text/javascript'
  | 'application/javascript'
  | 'application/pdf'
  | 'image/*'
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp'
  | 'image/svg+xml'
  | 'video/*'
  | 'video/mp4'
  | 'video/webm'
  | 'audio/*'
  | 'audio/mpeg'
  | 'audio/ogg'
  | 'audio/wav';

export type RequestCache = 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';

export type RequestMode = 'navigate' | 'same-origin' | 'no-cors' | 'cors';

export type RequestCredentials = 'omit' | 'same-origin' | 'include';

export type RequestRedirect = 'follow' | 'error' | 'manual';

export type ResponseType = 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect';

// ==============================================
// STORAGE UTILITY TYPES
// ==============================================

export type StorageKey = string;

export type StorageValue = any;

export type StorageOptions = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

export type StorageItem<T = any> = {
  value: T;
  expires?: number;
  createdAt: number;
};

export type StorageSize = {
  used: number;
  total: number;
  available: number;
};

// ==============================================
// SORTING UTILITY TYPES
// ==============================================

export type SortDirection = 'asc' | 'desc' | 'ascending' | 'descending';

export type SortOrder = 'asc' | 'desc';

export type SortBy<T> = {
  [K in keyof T]?: SortOrder;
};

export type Sorter<T> = (a: T, b: T) => number;

export type SortConfig<T> = {
  key: keyof T;
  direction: SortOrder;
  compare?: Sorter<T>;
};

// ==============================================
// FILTERING UTILITY TYPES
// ==============================================

export type FilterOperator = 
  | 'eq' | 'neq'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'contains' | 'notContains'
  | 'startsWith' | 'endsWith'
  | 'in' | 'notIn'
  | 'between' | 'notBetween'
  | 'isNull' | 'isNotNull'
  | 'isEmpty' | 'isNotEmpty';

export type FilterCondition<T> = {
  [K in keyof T]?: T[K] | FilterOperatorCondition<T[K]>;
};

export type FilterOperatorCondition<V> = {
  operator: FilterOperator;
  value: V | V[];
};

export type FilterGroup<T> = {
  and?: FilterCondition<T>[];
  or?: FilterCondition<T>[];
  not?: FilterCondition<T>;
};

export type Filter<T> = FilterCondition<T> | FilterGroup<T>;

// ==============================================
// PAGINATION UTILITY TYPES
// ==============================================

export type PaginationParams = {
  page?: number;
  perPage?: number;
  limit?: number;
  offset?: number;
};

export type PaginationMeta = {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage?: number;
  prevPage?: number;
};

export type PaginatedData<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type CursorPaginationParams = {
  cursor?: string;
  limit?: number;
  direction?: 'forward' | 'backward';
};

export type CursorPaginationMeta = {
  nextCursor?: string;
  prevCursor?: string;
  hasNext: boolean;
  hasPrev: boolean;
  total?: number;
};

export type CursorPaginatedData<T> = {
  data: T[];
  meta: CursorPaginationMeta;
};

// ==============================================
// SEARCH UTILITY TYPES
// ==============================================

export type SearchParams = {
  query: string;
  fields?: string[];
  mode?: 'any' | 'all' | 'phrase';
  fuzzy?: boolean | number;
  wildcard?: boolean;
  highlight?: boolean;
};

export type SearchResult<T> = {
  item: T;
  score: number;
  highlights?: Record<string, string[]>;
};

export type SearchResponse<T> = {
  results: SearchResult<T>[];
  total: number;
  took: number;
  facets?: Record<string, any>;
};

// ==============================================
// SELECTION UTILITY TYPES
// ==============================================

export type SelectionMode = 'single' | 'multiple' | 'range';

export type SelectionState = 'all' | 'some' | 'none';

export type Selection<T = any> = {
  selected: T[];
  lastSelected?: T;
  selectionState: SelectionState;
  mode: SelectionMode;
};

// ==============================================
// DRAG AND DROP UTILITY TYPES
// ==============================================

export type DragItem<T = any> = {
  id: string;
  type: string;
  data: T;
};

export type DropPosition = 'before' | 'after' | 'inside' | 'none';

export type DragStartEvent = {
  item: DragItem;
  clientX: number;
  clientY: number;
};

export type DragMoveEvent = {
  item: DragItem;
  clientX: number;
  clientY: number;
  over?: {
    id: string;
    position: DropPosition;
  };
};

export type DragEndEvent = {
  item: DragItem;
  dropped: boolean;
  over?: {
    id: string;
    position: DropPosition;
  };
};

export type DropEvent = {
  item: DragItem;
  target: {
    id: string;
    position: DropPosition;
  };
};

// ==============================================
// ANIMATION UTILITY TYPES
// ==============================================

export type AnimationPreset = 
  | 'fadeIn' | 'fadeOut'
  | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight'
  | 'slideOutUp' | 'slideOutDown' | 'slideOutLeft' | 'slideOutRight'
  | 'zoomIn' | 'zoomOut'
  | 'bounce' | 'flash' | 'pulse' | 'rubberBand' | 'shake' | 'swing' | 'tada' | 'wobble'
  | 'jello' | 'heartBeat'
  | 'flip' | 'flipInX' | 'flipInY' | 'flipOutX' | 'flipOutY'
  | 'lightSpeedIn' | 'lightSpeedOut'
  | 'rotateIn' | 'rotateInDownLeft' | 'rotateInDownRight' | 'rotateInUpLeft' | 'rotateInUpRight'
  | 'rotateOut' | 'rotateOutDownLeft' | 'rotateOutDownRight' | 'rotateOutUpLeft' | 'rotateOutUpRight'
  | 'hinge' | 'jackInTheBox' | 'rollIn' | 'rollOut';

export type AnimationTiming = 
  | 'linear'
  | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  | 'ease-in-back' | 'ease-out-back' | 'ease-in-out-back'
  | 'ease-in-circ' | 'ease-out-circ' | 'ease-in-out-circ'
  | 'ease-in-cubic' | 'ease-out-cubic' | 'ease-in-out-cubic'
  | 'ease-in-expo' | 'ease-out-expo' | 'ease-in-out-expo'
  | 'ease-in-quad' | 'ease-out-quad' | 'ease-in-out-quad'
  | 'ease-in-quart' | 'ease-out-quart' | 'ease-in-out-quart'
  | 'ease-in-quint' | 'ease-out-quint' | 'ease-in-out-quint'
  | 'ease-in-sine' | 'ease-out-sine' | 'ease-in-out-sine';

export type AnimationProps = {
  animation?: AnimationPreset;
  duration?: number;
  delay?: number;
  timing?: AnimationTiming;
  iteration?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fill?: 'none' | 'forwards' | 'backwards' | 'both';
};

// ==============================================
// TRANSITION UTILITY TYPES
// ==============================================

export type TransitionProperty = 'all' | 'none' | 'opacity' | 'color' | 'background' | 'transform' | string;

export type TransitionTiming = AnimationTiming;

export type TransitionProps = {
  property?: TransitionProperty | TransitionProperty[];
  duration?: number;
  delay?: number;
  timing?: TransitionTiming;
};

// ==============================================
// TRANSFORM UTILITY TYPES
// ==============================================

export type TransformProps = {
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotate?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  skewX?: number | string;
  skewY?: number | string;
  perspective?: number | string;
  transformOrigin?: string;
  transformStyle?: 'flat' | 'preserve-3d';
  backfaceVisibility?: 'visible' | 'hidden';
};

// ==============================================
// FLEXBOX UTILITY TYPES
// ==============================================

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export type FlexJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';

export type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

export type FlexContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch';

export type FlexProps = {
  direction?: FlexDirection;
  wrap?: FlexWrap;
  justify?: FlexJustify;
  align?: FlexAlign;
  content?: FlexContent;
  gap?: number | string;
  grow?: number;
  shrink?: number;
  basis?: number | string;
  order?: number;
  alignSelf?: FlexAlign;
};

// ==============================================
// GRID UTILITY TYPES
// ==============================================

export type GridProps = {
  columns?: number | string;
  rows?: number | string;
  areas?: string[];
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  flow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
  autoRows?: string;
  autoColumns?: string;
  autoFlow?: 'row' | 'column' | 'row-dense' | 'column-dense';
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
};

export type GridItemProps = {
  column?: number | string;
  row?: number | string;
  area?: string;
  justifySelf?: 'start' | 'end' | 'center' | 'stretch';
  alignSelf?: 'start' | 'end' | 'center' | 'stretch';
  order?: number;
};

// ==============================================
// POSITION UTILITY TYPES
// ==============================================

export type PositionType = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

export type PositionProps = {
  position?: PositionType;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number;
  inset?: number | string;
  insetBlock?: number | string;
  insetInline?: number | string;
  insetBlockStart?: number | string;
  insetBlockEnd?: number | string;
  insetInlineStart?: number | string;
  insetInlineEnd?: number | string;
};

// ==============================================
// SPACING UTILITY TYPES
// ==============================================

export type SpacingProps = {
  m?: number | string;
  mt?: number | string;
  mr?: number | string;
  mb?: number | string;
  ml?: number | string;
  mx?: number | string;
  my?: number | string;
  p?: number | string;
  pt?: number | string;
  pr?: number | string;
  pb?: number | string;
  pl?: number | string;
  px?: number | string;
  py?: number | string;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
};

// ==============================================
// TYPOGRAPHY UTILITY TYPES
// ==============================================

export type TypographyProps = {
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: number | 'normal' | 'bold' | 'bolder' | 'lighter' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  lineHeight?: number | string;
  letterSpacing?: number | string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  textOverflow?: 'clip' | 'ellipsis' | string;
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces';
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  overflowWrap?: 'normal' | 'break-word' | 'anywhere';
  textIndent?: number | string;
  textShadow?: string;
  hyphens?: 'none' | 'manual' | 'auto';
  writingMode?: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr';
  textOrientation?: 'mixed' | 'upright' | 'sideways';
};

// ==============================================
// BORDER UTILITY TYPES
// ==============================================

export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'none' | 'hidden';

export type BorderProps = {
  border?: string;
  borderWidth?: number | string;
  borderStyle?: BorderStyle;
  borderColor?: string;
  borderRadius?: number | string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderTopWidth?: number | string;
  borderRightWidth?: number | string;
  borderBottomWidth?: number | string;
  borderLeftWidth?: number | string;
  borderTopStyle?: BorderStyle;
  borderRightStyle?: BorderStyle;
  borderBottomStyle?: BorderStyle;
  borderLeftStyle?: BorderStyle;
  borderTopColor?: string;
  borderRightColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderTopLeftRadius?: number | string;
  borderTopRightRadius?: number | string;
  borderBottomLeftRadius?: number | string;
  borderBottomRightRadius?: number | string;
  outline?: string;
  outlineWidth?: number | string;
  outlineStyle?: BorderStyle;
  outlineColor?: string;
  outlineOffset?: number | string;
};

// ==============================================
// BACKGROUND UTILITY TYPES
// ==============================================

export type BackgroundRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat' | 'space' | 'round';

export type BackgroundSize = 'auto' | 'cover' | 'contain' | string;

export type BackgroundPosition = 'top' | 'bottom' | 'left' | 'right' | 'center' | string;

export type BackgroundAttachment = 'scroll' | 'fixed' | 'local';

export type BackgroundClip = 'border-box' | 'padding-box' | 'content-box' | 'text';

export type BackgroundBlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';

export type BackgroundProps = {
  bg?: string;
  bgColor?: string;
  bgImage?: string;
  bgRepeat?: BackgroundRepeat;
  bgPosition?: BackgroundPosition;
  bgSize?: BackgroundSize;
  bgAttachment?: BackgroundAttachment;
  bgClip?: BackgroundClip;
  bgBlendMode?: BackgroundBlendMode;
  opacity?: number;
};

// ==============================================
// EFFECT UTILITY TYPES
// ==============================================

export type EffectProps = {
  boxShadow?: string;
  textShadow?: string;
  filter?: string;
  backdropFilter?: string;
  mixBlendMode?: BackgroundBlendMode;
  isolation?: 'auto' | 'isolate';
  mask?: string;
  maskImage?: string;
  maskMode?: 'alpha' | 'luminance' | 'match-source';
  maskPosition?: BackgroundPosition;
  maskSize?: BackgroundSize;
  maskRepeat?: BackgroundRepeat;
  maskComposite?: 'add' | 'subtract' | 'intersect' | 'exclude';
  clipPath?: string;
};

// ==============================================
// RESPONSIVE UTILITY TYPES
// ==============================================

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export type ResponsiveProps<T> = {
  [K in keyof T]?: ResponsiveValue<T[K]>;
};

export type MediaQuery = {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  orientation?: 'portrait' | 'landscape';
  theme?: 'light' | 'dark';
  hover?: 'hover' | 'none';
  pointer?: 'fine' | 'coarse' | 'none';
  anyPointer?: 'fine' | 'coarse' | 'none';
  prefersColorScheme?: 'light' | 'dark';
  prefersReducedMotion?: 'reduce' | 'no-preference';
  prefersContrast?: 'more' | 'less' | 'no-preference';
  prefersReducedData?: 'reduce' | 'no-preference';
  resolution?: number;
  scan?: 'interlace' | 'progressive';
  grid?: boolean;
  update?: 'fast' | 'slow' | 'none';
  overflowBlock?: 'none' | 'scroll' | 'optional-paged' | 'paged';
  overflowInline?: 'none' | 'scroll';
};

// ==============================================
// THEME UTILITY TYPES
// ==============================================

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeColor = string;

export type ThemeColors = {
  primary: ThemeColor;
  secondary: ThemeColor;
  success: ThemeColor;
  warning: ThemeColor;
  error: ThemeColor;
  info: ThemeColor;
  background: ThemeColor;
  surface: ThemeColor;
  text: ThemeColor;
  textSecondary: ThemeColor;
  textDisabled: ThemeColor;
  border: ThemeColor;
  divider: ThemeColor;
};

export type ThemeSpacing = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
};

export type ThemeTypography = {
  fontFamily: string;
  fontSizes: Record<string, number | string>;
  fontWeights: Record<string, number>;
  lineHeights: Record<string, number>;
  letterSpacings: Record<string, number>;
};

export type ThemeBreakpoints = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
};

export type ThemeZIndex = {
  drawer: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
  dropdown: number;
  header: number;
  footer: number;
  overlay: number;
};

export type Theme = {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  breakpoints: ThemeBreakpoints;
  zIndex: ThemeZIndex;
  borderRadius: Record<string, number | string>;
  shadows: Record<string, string>;
  transitions: Record<string, number | string>;
  animations: Record<string, string>;
};