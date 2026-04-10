// frontend/src/vite-env.d.ts
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// ==============================================
// VITE ENVIRONMENT VARIABLES
// ==============================================

interface ImportMetaEnv {
  // ===== APPLICATION CONFIG =====
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_URL: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_API_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_CDN_URL: string;

  // ===== AUTHENTICATION =====
  readonly VITE_JWT_SECRET?: string;
  readonly VITE_JWT_EXPIRY?: string;
  readonly VITE_REFRESH_TOKEN_EXPIRY?: string;

  // ===== OAUTH PROVIDERS =====
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_GOOGLE_CLIENT_SECRET?: string;
  readonly VITE_FACEBOOK_APP_ID?: string;
  readonly VITE_FACEBOOK_APP_SECRET?: string;
  readonly VITE_MICROSOFT_CLIENT_ID?: string;
  readonly VITE_MICROSOFT_CLIENT_SECRET?: string;
  readonly VITE_GITHUB_CLIENT_ID?: string;
  readonly VITE_GITHUB_CLIENT_SECRET?: string;

  // ===== PAYMENT GATEWAYS =====
  readonly VITE_STRIPE_PUBLIC_KEY?: string;
  readonly VITE_STRIPE_SECRET_KEY?: string;
  readonly VITE_PAYNOW_INTEGRATION_KEY?: string;
  readonly VITE_PAYNOW_RETURN_URL?: string;
  readonly VITE_ECOCASH_API_KEY?: string;
  readonly VITE_ECOCASH_API_URL?: string;

  // ===== VIDEO CALLING =====
  readonly VITE_AGORA_APP_ID?: string;
  readonly VITE_AGORA_APP_CERTIFICATE?: string;
  readonly VITE_VIDEO_SDK_KEY?: string;
  readonly VITE_VIDEO_SDK_SECRET?: string;

  // ===== AI SERVICES =====
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_OPENAI_ORG_ID?: string;
  readonly VITE_OPENAI_MODEL?: string;
  readonly VITE_HUGGINGFACE_API_KEY?: string;
  readonly VITE_HUGGINGFACE_MODEL?: string;

  // ===== CLOUD STORAGE =====
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_API_KEY?: string;
  readonly VITE_CLOUDINARY_API_SECRET?: string;
  readonly VITE_AWS_ACCESS_KEY_ID?: string;
  readonly VITE_AWS_SECRET_ACCESS_KEY?: string;
  readonly VITE_AWS_REGION?: string;
  readonly VITE_AWS_BUCKET_NAME?: string;

  // ===== EMAIL SERVICE =====
  readonly VITE_SMTP_HOST?: string;
  readonly VITE_SMTP_PORT?: string;
  readonly VITE_SMTP_USER?: string;
  readonly VITE_SMTP_PASS?: string;
  readonly VITE_SMTP_FROM_EMAIL?: string;
  readonly VITE_SMTP_FROM_NAME?: string;

  // ===== SMS SERVICE =====
  readonly VITE_SMS_API_KEY?: string;
  readonly VITE_SMS_API_SECRET?: string;
  readonly VITE_SMS_SENDER_ID?: string;
  readonly VITE_SMS_API_URL?: string;

  // ===== ANALYTICS =====
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_GOOGLE_TAG_MANAGER_ID?: string;
  readonly VITE_FACEBOOK_PIXEL_ID?: string;
  readonly VITE_MIXPANEL_TOKEN?: string;
  readonly VITE_SENTRY_DSN?: string;

  // ===== FEATURE FLAGS =====
  readonly VITE_ENABLE_AI_TUTOR?: string;
  readonly VITE_ENABLE_VIDEO_CALLS?: string;
  readonly VITE_ENABLE_PAYMENTS?: string;
  readonly VITE_ENABLE_SCHOLARSHIPS?: string;
  readonly VITE_ENABLE_CERTIFICATES?: string;
  readonly VITE_ENABLE_CAREER_PATH?: string;
  readonly VITE_ENABLE_SOCIAL_LOGIN?: string;
  readonly VITE_ENABLE_TWO_FACTOR?: string;

  // ===== PWA CONFIG =====
  readonly VITE_PWA_NAME?: string;
  readonly VITE_PWA_SHORT_NAME?: string;
  readonly VITE_PWA_DESCRIPTION?: string;
  readonly VITE_PWA_THEME_COLOR?: string;
  readonly VITE_PWA_BACKGROUND_COLOR?: string;
  readonly VITE_PWA_DISPLAY?: string;
  readonly VITE_PWA_ORIENTATION?: string;
  readonly VITE_PWA_SCOPE?: string;
  readonly VITE_PWA_START_URL?: string;

  // ===== CACHING =====
  readonly VITE_CACHE_TTL?: string;
  readonly VITE_QUERY_STALE_TIME?: string;
  readonly VITE_QUERY_CACHE_TIME?: string;

  // ===== RATE LIMITING =====
  readonly VITE_RATE_LIMIT_MAX?: string;
  readonly VITE_RATE_LIMIT_WINDOW_MS?: string;

  // ===== DEBUGGING =====
  readonly VITE_DEBUG_MODE?: string;
  readonly VITE_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
  readonly VITE_ENABLE_REDUX_DEVTOOLS?: string;
  readonly VITE_ENABLE_REACT_QUERY_DEVTOOLS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// ==============================================
// VITE CLIENT TYPES
// ==============================================

declare module 'vite/client' {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// ==============================================
// VITE PWA PLUGIN TYPES
// ==============================================

declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error: any) => void;
  }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}

// ==============================================
// STATIC ASSET TYPES
// ==============================================

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.pdf' {
  const src: string;
  export default src;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.ogg' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}

declare module '*.woff' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}

declare module '*.eot' {
  const src: string;
  export default src;
}

declare module '*.otf' {
  const src: string;
  export default src;
}

declare module '*.json' {
  const value: any;
  export default value;
}

// ==============================================
// ENVIRONMENT-SPECIFIC TYPES
// ==============================================

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_VERSION: string;
    REACT_APP_NAME: string;
  }
}

// ==============================================
// WEBPACK ENVIRONMENT VARIABLES (for CRA compatibility)
// ==============================================

declare namespace __WebpackModuleApi {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    REACT_APP_VERSION: string;
    REACT_APP_NAME: string;
  }
}

// ==============================================
// WINDOW OBJECT EXTENSIONS
// ==============================================

interface Window {
  // Google Analytics
  gtag?: (...args: any[]) => void;
  dataLayer?: any[];
  
  // Facebook Pixel
  fbq?: (...args: any[]) => void;
  
  // Mixpanel
  mixpanel?: any;
  
  // Sentry
  Sentry?: any;
  
  // Payment gateways
  Stripe?: any;
  PayNow?: any;
  EcoCash?: any;
  
  // Video calling
  AgoraRTC?: any;
  AgoraRTM?: any;
  
  // PWA
  workbox?: any;
  deferredPrompt?: BeforeInstallPromptEvent;
  
  // Environment
  ENV: {
    API_URL: string;
    SOCKET_URL: string;
    NODE_ENV: string;
    APP_VERSION: string;
    APP_NAME: string;
  };
  
  // Debug mode
  __ZEDU_DEBUG__?: boolean;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
}

// ==============================================
// PWA INSTALL PROMPT EVENT
// ==============================================

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// ==============================================
// WEB API EXTENSIONS
// ==============================================

interface Navigator {
  // Battery API
  getBattery?: () => Promise<BatteryManager>;
  
  // Bluetooth API
  bluetooth?: {
    requestDevice(options: BluetoothRequestOptions): Promise<BluetoothDevice>;
  };
  
  // USB API
  usb?: {
    getDevices(): Promise<USBDevice[]>;
    requestDevice(options: USBDeviceRequestOptions): Promise<USBDevice>;
  };
  
  // Serial API
  serial?: {
    getPorts(): Promise<SerialPort[]>;
    requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
  };
  
  // Web Share API
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
  
  // Wake Lock API
  wakeLock?: {
    request(type: 'screen'): Promise<WakeLockSentinel>;
  };
  
  // Badge API
  setAppBadge?: (count?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
  
  // Contacts API
  contacts?: {
    select(properties: string[], options?: ContactSelectOptions): Promise<ContactInfo[]>;
  };
  
  // Credential Management API
  credentials?: {
    get(options?: CredentialRequestOptions): Promise<Credential | null>;
    store(credential: Credential): Promise<Credential>;
    create(options: CredentialCreationOptions): Promise<Credential | null>;
    preventSilentAccess(): Promise<void>;
  };
  
  // Storage API
  storage?: {
    estimate(): Promise<StorageEstimate>;
    persist(): Promise<boolean>;
    persisted(): Promise<boolean>;
  };
  
  // Network Information API
  connection?: NetworkInformation;
  
  // Device Memory
  deviceMemory?: number;
  
  // Hardware Concurrency
  hardwareConcurrency?: number;
  
  // Media Devices
  mediaDevices?: MediaDevices;
  
  // Service Worker
  serviceWorker?: ServiceWorkerContainer;
  
  // Payment Request API
  payment?: {
    request(methodData: PaymentMethodData[], details: PaymentDetailsInit): PaymentRequest;
  };
}

interface BatteryManager extends EventTarget {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => any) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => any) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => any) | null;
}

interface NetworkInformation {
  readonly type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  readonly downlink?: number;
  readonly downlinkMax?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  onChange?: (event: Event) => void;
}

interface WakeLockSentinel extends EventTarget {
  readonly released: boolean;
  readonly type: 'screen';
  release(): Promise<void>;
  onrelease: ((this: WakeLockSentinel, ev: Event) => any) | null;
}

interface ContactInfo {
  name?: string[];
  email?: string[];
  tel?: string[];
  address?: ContactAddress[];
  icon?: Blob[];
}

interface ContactAddress {
  city?: string;
  country?: string;
  dependentLocality?: string;
  organization?: string;
  phone?: string;
  postalCode?: string;
  recipient?: string;
  region?: string;
  sortingCode?: string;
  addressLine?: string[];
}

interface ContactSelectOptions {
  multiple?: boolean;
}

interface BluetoothRequestOptions {
  filters?: BluetoothRequestFilter[];
  optionalServices?: BluetoothServiceUUID[];
  acceptAllDevices?: boolean;
}

interface BluetoothRequestFilter {
  services?: BluetoothServiceUUID[];
  name?: string;
  namePrefix?: string;
  manufacturerData?: BluetoothManufacturerDataFilter[];
  serviceData?: BluetoothServiceDataFilter[];
}

interface BluetoothManufacturerDataFilter {
  companyIdentifier: number;
  dataPrefix?: BufferSource;
  mask?: BufferSource;
}

interface BluetoothServiceDataFilter {
  service: BluetoothServiceUUID;
  dataPrefix?: BufferSource;
  mask?: BufferSource;
}

interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
  watchingAdvertisements: boolean;
  readonly adData?: BluetoothAdvertisingData;
  onadvertisementreceived?: (event: Event) => void;
  ongattserverdisconnected?: (event: Event) => void;
  watchAdvertisements(): Promise<void>;
  unwatchAdvertisements(): void;
  forget(): Promise<void>;
}

interface BluetoothRemoteGATTServer {
  device: BluetoothDevice;
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
  getPrimaryServices(service?: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService[]>;
}

interface BluetoothRemoteGATTService {
  device: BluetoothDevice;
  uuid: string;
  isPrimary: boolean;
  getCharacteristic(characteristic: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>;
  getCharacteristics(characteristic?: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic[]>;
  getIncludedService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
  getIncludedServices(service?: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService[]>;
}

interface BluetoothRemoteGATTCharacteristic {
  service: BluetoothRemoteGATTService;
  uuid: string;
  properties: BluetoothCharacteristicProperties;
  value?: DataView;
  getDescriptor(descriptor: BluetoothDescriptorUUID): Promise<BluetoothRemoteGATTDescriptor>;
  getDescriptors(descriptor?: BluetoothDescriptorUUID): Promise<BluetoothRemoteGATTDescriptor[]>;
  readValue(): Promise<DataView>;
  writeValue(value: BufferSource): Promise<void>;
  writeValueWithResponse(value: BufferSource): Promise<void>;
  writeValueWithoutResponse(value: BufferSource): Promise<void>;
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  oncharacteristicvaluechanged?: (event: Event) => void;
}

interface BluetoothRemoteGATTDescriptor {
  characteristic: BluetoothRemoteGATTCharacteristic;
  uuid: string;
  value?: DataView;
  readValue(): Promise<DataView>;
  writeValue(value: BufferSource): Promise<void>;
}

type BluetoothServiceUUID = number | string;
type BluetoothCharacteristicUUID = number | string;
type BluetoothDescriptorUUID = number | string;

interface BluetoothCharacteristicProperties {
  broadcast: boolean;
  read: boolean;
  writeWithoutResponse: boolean;
  write: boolean;
  notify: boolean;
  indicate: boolean;
  authenticatedSignedWrites: boolean;
  reliableWrite: boolean;
  writableAuxiliaries: boolean;
}

interface BluetoothAdvertisingData {
  appearance?: number;
  txPower?: number;
  rssi?: number;
  manufacturerData?: Map<number, DataView>;
  serviceData?: Map<string, DataView>;
  uuids?: string[];
  name?: string;
}

interface USBDeviceRequestOptions {
  filters: USBDeviceFilter[];
}

interface USBDeviceFilter {
  vendorId?: number;
  productId?: number;
  classCode?: number;
  subclassCode?: number;
  protocolCode?: number;
  serialNumber?: string;
}

interface SerialPortRequestOptions {
  filters?: SerialPortFilter[];
}

interface SerialPortFilter {
  usbVendorId?: number;
  usbProductId?: number;
  bluetoothServiceClassId?: string;
}