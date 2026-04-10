// ==============================================
// ZEDU PLATFORM - GLOBAL TYPE DECLARATIONS
// ==============================================

import { UserRole } from './types';

// ==============================================
// WINDOW OBJECT EXTENSIONS
// ==============================================

declare global {
  interface Window {
    // Agora SDK instances
    AgoraRTC?: any;
    AgoraRTM?: any;
    
    // Google Analytics / Tag Manager
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    
    // Facebook Pixel
    fbq?: (...args: any[]) => void;
    
    // Payment gateways
    PayNow?: any;
    Ecocash?: any;
    Stripe?: any;
    
    // PWA related
    workbox?: any;
    deferredPrompt?: BeforeInstallPromptEvent;
    
    // Environment
    ENV: {
      API_URL: string;
      SOCKET_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
      VERSION: string;
    };
    
    // Custom events
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    __ZEDU_DEBUG__?: boolean;
  }

  // ==============================================
  // BEFORE INSTALL PROMPT EVENT (PWA)
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
  // NAVIGATOR EXTENSIONS
  // ==============================================

  interface Navigator {
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
    
    // Battery API
    getBattery?: () => Promise<BatteryManager>;
    
    // Clipboard API
    clipboard?: {
      read(): Promise<ClipboardItems>;
      readText(): Promise<string>;
      write(data: ClipboardItems): Promise<void>;
      writeText(text: string): Promise<void>;
    };
    
    // Geolocation API
    geolocation?: Geolocation;
    
    // Media Devices
    mediaDevices?: MediaDevices;
    
    // Service Worker
    serviceWorker?: ServiceWorkerContainer;
    
    // Payment Request API
    payment?: {
      request(methodData: PaymentMethodData[], details: PaymentDetailsInit): PaymentRequest;
    };
    
    // Virtual Keyboard API
    virtualKeyboard?: {
      show(): void;
      hide(): void;
      boundingRect: DOMRect;
      overlaysContent: boolean;
      ongeometrychange: ((this: Navigator, ev: Event) => any) | null;
    };
  }

  // ==============================================
  // MEDIASTREAM TRACK EXTENSIONS
  // ==============================================

  interface MediaStreamTrack {
    getSettings(): MediaTrackSettings;
    getConstraints(): MediaTrackConstraints;
    applyConstraints(constraints: MediaTrackConstraints): Promise<void>;
    contentHint?: string;
    readyState: 'live' | 'ended';
    enabled: boolean;
    muted: boolean;
    isolated: boolean;
    onended: ((this: MediaStreamTrack, ev: Event) => any) | null;
    onmute: ((this: MediaStreamTrack, ev: Event) => any) | null;
    onunmute: ((this: MediaStreamTrack, ev: Event) => any) | null;
    onisolationchange: ((this: MediaStreamTrack, ev: Event) => any) | null;
    clone(): MediaStreamTrack;
    stop(): void;
  }

  // ==============================================
  // NETWORK INFORMATION API
  // ==============================================

  interface NetworkInformation {
    readonly type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
    readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
    readonly downlink?: number;
    readonly downlinkMax?: number;
    readonly rtt?: number;
    readonly saveData?: boolean;
    onChange?: (event: Event) => void;
  }

  // ==============================================
  // BATTERY API
  // ==============================================

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

  // ==============================================
  // WAKE LOCK API
  // ==============================================

  interface WakeLockSentinel extends EventTarget {
    readonly released: boolean;
    readonly type: 'screen';
    release(): Promise<void>;
    onrelease: ((this: WakeLockSentinel, ev: Event) => any) | null;
  }

  // ==============================================
  // CONTACTS API
  // ==============================================

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

  // ==============================================
  // WEB BLUETOOTH API
  // ==============================================

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

  // ==============================================
  // WEB USB API
  // ==============================================

  interface USBDevice {
    usbVersionMajor: number;
    usbVersionMinor: number;
    usbVersionSubminor: number;
    deviceClass: number;
    deviceSubclass: number;
    deviceProtocol: number;
    vendorId: number;
    productId: number;
    deviceVersionMajor: number;
    deviceVersionMinor: number;
    deviceVersionSubminor: number;
    manufacturerName?: string;
    productName?: string;
    serialNumber?: string;
    configuration?: USBConfiguration;
    configurations: USBConfiguration[];
    opened: boolean;
    open(): Promise<void>;
    close(): Promise<void>;
    selectConfiguration(configurationValue: number): Promise<void>;
    claimInterface(interfaceNumber: number): Promise<void>;
    releaseInterface(interfaceNumber: number): Promise<void>;
    selectAlternateInterface(interfaceNumber: number, alternateSetting: number): Promise<void>;
    controlTransferIn(setup: USBControlTransferParameters, length: number): Promise<USBInTransferResult>;
    controlTransferOut(setup: USBControlTransferParameters, data?: BufferSource): Promise<USBOutTransferResult>;
    clearHalt(direction: 'in' | 'out', endpointNumber: number): Promise<void>;
    transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;
    transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
    isochronousTransferIn(endpointNumber: number, packetLengths: number[]): Promise<USBIsochronousInTransferResult>;
    isochronousTransferOut(endpointNumber: number, data: BufferSource, packetLengths: number[]): Promise<USBIsochronousOutTransferResult>;
    reset(): Promise<void>;
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

  interface USBConfiguration {
    configurationValue: number;
    configurationName?: string;
    interfaces: USBInterface[];
  }

  interface USBInterface {
    interfaceNumber: number;
    alternate: USBAlternateInterface;
    alternates: USBAlternateInterface[];
    claimed: boolean;
  }

  interface USBAlternateInterface {
    alternateSetting: number;
    interfaceClass: number;
    interfaceSubclass: number;
    interfaceProtocol: number;
    interfaceName?: string;
    endpoints: USBEndpoint[];
  }

  interface USBEndpoint {
    endpointNumber: number;
    direction: 'in' | 'out';
    type: 'bulk' | 'interrupt' | 'isochronous';
    packetSize: number;
  }

  interface USBControlTransferParameters {
    requestType: 'standard' | 'class' | 'vendor';
    recipient: 'device' | 'interface' | 'endpoint' | 'other';
    request: number;
    value: number;
    index: number;
  }

  interface USBInTransferResult {
    data?: DataView;
    status: 'ok' | 'stall' | 'babble';
  }

  interface USBOutTransferResult {
    bytesWritten: number;
    status: 'ok' | 'stall';
  }

  interface USBIsochronousInTransferResult {
    data?: DataView;
    packets: USBIsochronousInTransferPacket[];
  }

  interface USBIsochronousOutTransferResult {
    packets: USBIsochronousOutTransferPacket[];
  }

  interface USBIsochronousInTransferPacket {
    data?: DataView;
    status: 'ok' | 'stall' | 'babble';
  }

  interface USBIsochronousOutTransferPacket {
    bytesWritten: number;
    status: 'ok' | 'stall';
  }

  // ==============================================
  // WEB SERIAL API
  // ==============================================

  interface SerialPort {
    readable: ReadableStream;
    writable: WritableStream;
    open(options: SerialOptions): Promise<void>;
    close(): Promise<void>;
    getInfo(): SerialPortInfo;
    onconnect?: (event: Event) => void;
    ondisconnect?: (event: Event) => void;
  }

  interface SerialPortRequestOptions {
    filters?: SerialPortFilter[];
  }

  interface SerialPortFilter {
    usbVendorId?: number;
    usbProductId?: number;
    bluetoothServiceClassId?: string;
  }

  interface SerialPortInfo {
    usbVendorId?: number;
    usbProductId?: number;
    bluetoothServiceClassId?: string;
  }

  interface SerialOptions {
    baudRate: number;
    dataBits?: 7 | 8;
    stopBits?: 1 | 2;
    parity?: 'none' | 'even' | 'odd';
    bufferSize?: number;
    flowControl?: 'none' | 'hardware';
  }

  // ==============================================
  // FILE SYSTEM ACCESS API
  // ==============================================

  interface FileSystemHandle {
    kind: 'file' | 'directory';
    name: string;
    isSameEntry(other: FileSystemHandle): Promise<boolean>;
    queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
    requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
  }

  interface FileSystemFileHandle extends FileSystemHandle {
    kind: 'file';
    getFile(): Promise<File>;
    createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
  }

  interface FileSystemDirectoryHandle extends FileSystemHandle {
    kind: 'directory';
    getDirectoryHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle>;
    getFileHandle(name: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle>;
    removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>;
    resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
    entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
    keys(): AsyncIterableIterator<string>;
    values(): AsyncIterableIterator<FileSystemHandle>;
    [Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemHandle]>;
  }

  interface FileSystemHandlePermissionDescriptor {
    mode?: 'read' | 'readwrite';
  }

  interface FileSystemCreateWritableOptions {
    keepExistingData?: boolean;
  }

  interface FileSystemGetDirectoryOptions {
    create?: boolean;
  }

  interface FileSystemGetFileOptions {
    create?: boolean;
  }

  interface FileSystemRemoveOptions {
    recursive?: boolean;
  }

  interface FileSystemWritableFileStream extends WritableStream {
    write(data: FileSystemWriteChunkType): Promise<void>;
    seek(position: number): Promise<void>;
    truncate(size: number): Promise<void>;
  }

  type FileSystemWriteChunkType = BufferSource | Blob | string | WriteParams;

  interface WriteParams {
    type: 'write' | 'seek' | 'truncate';
    size?: number;
    position?: number;
    data?: BufferSource | Blob | string;
  }

  interface Window {
    showOpenFilePicker(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>;
    showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
    showDirectoryPicker(options?: DirectoryPickerOptions): Promise<FileSystemDirectoryHandle>;
  }

  interface OpenFilePickerOptions {
    multiple?: boolean;
    excludeAcceptAllOption?: boolean;
    types?: FilePickerAcceptType[];
    startIn?: WellKnownDirectory | FileSystemHandle;
  }

  interface SaveFilePickerOptions {
    suggestedName?: string;
    excludeAcceptAllOption?: boolean;
    types?: FilePickerAcceptType[];
    startIn?: WellKnownDirectory | FileSystemHandle;
  }

  interface DirectoryPickerOptions {
    id?: string;
    mode?: 'read' | 'readwrite';
    startIn?: WellKnownDirectory | FileSystemHandle;
  }

  interface FilePickerAcceptType {
    description?: string;
    accept: Record<string, string | string[]>;
  }

  type WellKnownDirectory = 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';

  // ==============================================
  // WEB SHARE API
  // ==============================================

  interface ShareData {
    title?: string;
    text?: string;
    url?: string;
    files?: File[];
  }

  // ==============================================
  // SCREEN ORIENTATION API
  // ==============================================

  interface ScreenOrientation extends EventTarget {
    type: OrientationType;
    angle: number;
    lock(orientation: OrientationLockType): Promise<void>;
    unlock(): void;
    onchange: ((this: ScreenOrientation, ev: Event) => any) | null;
  }

  interface Screen {
    orientation: ScreenOrientation;
    lockOrientation?(orientation: OrientationLockType): boolean;
    unlockOrientation?(): void;
  }

  type OrientationType = 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary';
  type OrientationLockType = 'any' | 'natural' | 'landscape' | 'portrait' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary';

  // ==============================================
  // PAYMENT REQUEST API
  // ==============================================

  interface PaymentRequest extends EventTarget {
    id: string;
    show(): Promise<PaymentResponse>;
    abort(): Promise<void>;
    canMakePayment(): Promise<boolean>;
    hasEnrolledInstrument(): Promise<boolean>;
    onmerchantvalidation?: (event: Event) => void;
    onshippingaddresschange?: (event: Event) => void;
    onshippingoptionchange?: (event: Event) => void;
    onpaymentmethodchange?: (event: Event) => void;
  }

  interface PaymentResponse {
    requestId: string;
    methodName: string;
    details: any;
    shippingAddress?: PaymentAddress;
    shippingOption?: string;
    payerName?: string;
    payerEmail?: string;
    payerPhone?: string;
    complete(result?: 'success' | 'fail'): Promise<void>;
    retry(errorFields?: PaymentValidationErrors): Promise<void>;
  }

  interface PaymentMethodData {
    supportedMethods: string | string[];
    data?: any;
  }

  interface PaymentDetailsInit {
    id?: string;
    total: PaymentItem;
    displayItems?: PaymentItem[];
    shippingOptions?: PaymentShippingOption[];
    modifiers?: PaymentDetailsModifier[];
  }

  interface PaymentDetailsUpdate {
    error?: string;
    total?: PaymentItem;
    displayItems?: PaymentItem[];
    shippingOptions?: PaymentShippingOption[];
    modifiers?: PaymentDetailsModifier[];
  }

  interface PaymentItem {
    label: string;
    amount: PaymentCurrencyAmount;
    pending?: boolean;
  }

  interface PaymentCurrencyAmount {
    currency: string;
    value: string;
  }

  interface PaymentShippingOption {
    id: string;
    label: string;
    amount: PaymentCurrencyAmount;
    selected?: boolean;
  }

  interface PaymentDetailsModifier {
    supportedMethods: string | string[];
    total?: PaymentItem;
    additionalDisplayItems?: PaymentItem[];
    data?: any;
  }

  interface PaymentAddress {
    city?: string;
    country: string;
    dependentLocality?: string;
    organization?: string;
    phone?: string;
    postalCode?: string;
    recipient?: string;
    region?: string;
    sortingCode?: string;
    addressLine?: string[];
    toJSON(): any;
  }

  interface PaymentValidationErrors {
    error?: string;
    shippingAddress?: any;
    payer?: any;
    paymentMethod?: any;
  }

  // ==============================================
  // CREDENTIAL MANAGEMENT API
  // ==============================================

  interface Credential {
    id: string;
    type: string;
  }

  interface PasswordCredential extends Credential {
    type: 'password';
    name?: string;
    iconURL?: string;
    password: string;
  }

  interface FederatedCredential extends Credential {
    type: 'federated';
    name?: string;
    iconURL?: string;
    provider: string;
    protocol?: string;
  }

  interface PublicKeyCredential extends Credential {
    type: 'public-key';
    rawId: ArrayBuffer;
    response: AuthenticatorResponse;
    getClientExtensionResults(): AuthenticationExtensionsClientOutputs;
  }

  interface AuthenticatorResponse {
    clientDataJSON: ArrayBuffer;
  }

  interface AuthenticatorAttestationResponse extends AuthenticatorResponse {
    attestationObject: ArrayBuffer;
  }

  interface AuthenticatorAssertionResponse extends AuthenticatorResponse {
    authenticatorData: ArrayBuffer;
    signature: ArrayBuffer;
    userHandle?: ArrayBuffer;
  }

  interface CredentialRequestOptions {
    mediation?: 'silent' | 'optional' | 'required';
    publicKey?: PublicKeyCredentialRequestOptions;
    password?: boolean;
    federated?: FederatedCredentialRequestOptions;
  }

  interface CredentialCreationOptions {
    password?: PasswordCredentialData;
    federated?: FederatedCredentialData;
    publicKey?: PublicKeyCredentialCreationOptions;
  }

  interface PasswordCredentialData {
    id: string;
    name?: string;
    iconURL?: string;
    password: string;
  }

  interface FederatedCredentialData {
    id: string;
    name?: string;
    iconURL?: string;
    provider: string;
    protocol?: string;
  }

  interface FederatedCredentialRequestOptions {
    providers?: string[];
    protocols?: string[];
  }

  interface PublicKeyCredentialCreationOptions {
    rp: PublicKeyCredentialRpEntity;
    user: PublicKeyCredentialUserEntity;
    challenge: BufferSource;
    pubKeyCredParams: PublicKeyCredentialParameters[];
    timeout?: number;
    excludeCredentials?: PublicKeyCredentialDescriptor[];
    authenticatorSelection?: AuthenticatorSelectionCriteria;
    attestation?: AttestationConveyancePreference;
    extensions?: AuthenticationExtensionsClientInputs;
  }

  interface PublicKeyCredentialRequestOptions {
    challenge: BufferSource;
    timeout?: number;
    rpId?: string;
    allowCredentials?: PublicKeyCredentialDescriptor[];
    userVerification?: UserVerificationRequirement;
    extensions?: AuthenticationExtensionsClientInputs;
  }

  interface PublicKeyCredentialRpEntity {
    id?: string;
    name: string;
  }

  interface PublicKeyCredentialUserEntity {
    id: BufferSource;
    name: string;
    displayName: string;
  }

  interface PublicKeyCredentialParameters {
    type: 'public-key';
    alg: number;
  }

  interface PublicKeyCredentialDescriptor {
    type: 'public-key';
    id: BufferSource;
    transports?: AuthenticatorTransport[];
  }

  interface AuthenticatorSelectionCriteria {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    requireResidentKey?: boolean;
    residentKey?: 'discouraged' | 'preferred' | 'required';
    userVerification?: UserVerificationRequirement;
  }

  type UserVerificationRequirement = 'required' | 'preferred' | 'discouraged';
  type AttestationConveyancePreference = 'none' | 'indirect' | 'direct' | 'enterprise';
  type AuthenticatorTransport = 'usb' | 'nfc' | 'ble' | 'internal';
  type AuthenticatorAttachment = 'platform' | 'cross-platform';

  interface AuthenticationExtensionsClientInputs {
    appid?: string;
    appidExclude?: string;
    credProps?: boolean;
    uvm?: boolean;
  }

  interface AuthenticationExtensionsClientOutputs {
    appid?: boolean;
    credProps?: CredentialPropertiesOutput;
    uvm?: UvmEntries;
  }

  interface CredentialPropertiesOutput {
    rk?: boolean;
  }

  type UvmEntry = [number, number, number];
  type UvmEntries = UvmEntry[];

  // ==============================================
  // WEB AUTHN API
  // ==============================================

  interface AuthenticatorAttestationResponse extends AuthenticatorResponse {
    attestationObject: ArrayBuffer;
    getTransports(): string[];
  }

  interface AuthenticatorAssertionResponse extends AuthenticatorResponse {
    authenticatorData: ArrayBuffer;
    signature: ArrayBuffer;
    userHandle: ArrayBuffer | null;
  }

  // ==============================================
  // MEDIA SESSION API
  // ==============================================

  interface MediaSession {
    metadata: MediaMetadata | null;
    playbackState: 'none' | 'paused' | 'playing';
    setActionHandler(action: MediaSessionAction, handler: ((details: MediaSessionActionDetails) => void) | null): void;
    setPositionState(state?: MediaPositionState): void;
    setMicrophoneActive(active: boolean): void;
    setCameraActive(active: boolean): void;
  }

  interface MediaMetadata {
    title: string;
    artist: string;
    album: string;
    artwork: MediaImage[];
  }

  interface MediaImage {
    src: string;
    sizes?: string;
    type?: string;
  }

  interface MediaPositionState {
    duration?: number;
    playbackRate?: number;
    position?: number;
  }

  interface MediaSessionActionDetails {
    action: MediaSessionAction;
    seekTime?: number;
    fastSeek?: boolean;
  }

  type MediaSessionAction = 'play' | 'pause' | 'seekbackward' | 'seekforward' | 'previoustrack' | 'nexttrack' | 'skipad' | 'stop' | 'seekto' | 'togglemicrophone' | 'togglecamera' | 'hangup';

  interface Navigator {
    mediaSession: MediaSession;
  }

  // ==============================================
  // PICTURE-IN-PICTURE API
  // ==============================================

  interface PictureInPictureWindow {
    width: number;
    height: number;
    onresize: ((this: PictureInPictureWindow, ev: Event) => any) | null;
  }

  interface HTMLVideoElement {
    requestPictureInPicture(): Promise<PictureInPictureWindow>;
    disablePictureInPicture: boolean;
    autoPictureInPicture: boolean;
    onenterpictureinpicture: ((this: HTMLVideoElement, ev: Event) => any) | null;
    onleavepictureinpicture: ((this: HTMLVideoElement, ev: Event) => any) | null;
  }

  interface Document {
    pictureInPictureEnabled: boolean;
    exitPictureInPicture(): Promise<void>;
    pictureInPictureElement: Element | null;
    onenterpictureinpicture: ((this: Document, ev: Event) => any) | null;
    onleavepictureinpicture: ((this: Document, ev: Event) => any) | null;
  }

  // ==============================================
  // FULLSCREEN API
  // ==============================================

  interface Element {
    requestFullscreen(options?: FullscreenOptions): Promise<void>;
    mozRequestFullScreen(options?: FullscreenOptions): Promise<void>;
    webkitRequestFullscreen(options?: FullscreenOptions): Promise<void>;
    msRequestFullscreen(options?: FullscreenOptions): Promise<void>;
  }

  interface Document {
    fullscreenEnabled: boolean;
    fullscreenElement: Element | null;
    mozFullScreenElement: Element | null;
    webkitFullscreenElement: Element | null;
    msFullscreenElement: Element | null;
    exitFullscreen(): Promise<void>;
    mozCancelFullScreen(): Promise<void>;
    webkitExitFullscreen(): Promise<void>;
    msExitFullscreen(): Promise<void>;
    onfullscreenchange: ((this: Document, ev: Event) => any) | null;
    onmozfullscreenchange: ((this: Document, ev: Event) => any) | null;
    onwebkitfullscreenchange: ((this: Document, ev: Event) => any) | null;
    onmsfullscreenchange: ((this: Document, ev: Event) => any) | null;
    onfullscreenerror: ((this: Document, ev: Event) => any) | null;
    onmozfullscreenerror: ((this: Document, ev: Event) => any) | null;
    onwebkitfullscreenerror: ((this: Document, ev: Event) => any) | null;
    onmsfullscreenerror: ((this: Document, ev: Event) => any) | null;
  }

  interface FullscreenOptions {
    navigationUI?: 'auto' | 'hide' | 'show';
  }

  // ==============================================
  // SCREEN WAKE LOCK API
  // ==============================================

  interface WakeLock {
    request(type: WakeLockType): Promise<WakeLockSentinel>;
  }

  type WakeLockType = 'screen';

  // ==============================================
  // IDLE DETECTION API
  // ==============================================

  interface IdleDetector extends EventTarget {
    screenState: 'locked' | 'unlocked';
    idleTime: number;
    start(options?: IdleOptions): Promise<void>;
    onchange: ((this: IdleDetector, ev: Event) => any) | null;
  }

  interface IdleOptions {
    threshold: number;
    signal?: AbortSignal;
  }

  interface IdleDetector {
    requestPermission(): Promise<PermissionState>;
  }

  // ==============================================
  // WEB TRANSPORT API
  // ==============================================

  interface WebTransport {
    closed: Promise<void>;
    ready: Promise<void>;
    createBidirectionalStream(): Promise<WebTransportBidirectionalStream>;
    createUnidirectionalStream(): Promise<WebTransportSendStream>;
    datagrams: WebTransportDatagramDuplexStream;
    close(info?: WebTransportCloseInfo): void;
  }

  interface WebTransportBidirectionalStream {
    readable: ReadableStream;
    writable: WritableStream;
  }

  interface WebTransportSendStream extends WritableStream {
    getStats(): WebTransportSendStreamStats;
  }

  interface WebTransportReceiveStream extends ReadableStream {
    getStats(): WebTransportReceiveStreamStats;
  }

  interface WebTransportDatagramDuplexStream {
    readable: ReadableStream;
    writable: WritableStream;
    maxDatagramSize: number;
    incomingMaxAge: number;
    outgoingMaxAge: number;
    incomingHighWaterMark: number;
    outgoingHighWaterMark: number;
  }

  interface WebTransportCloseInfo {
    errorCode?: number;
    reason?: string;
  }

  interface WebTransportSendStreamStats {
    bytesWritten: number;
    bytesSent: number;
    bytesAcknowledged: number;
  }

  interface WebTransportReceiveStreamStats {
    bytesReceived: number;
    bytesRead: number;
  }

  // ==============================================
  // WEB WORKER TYPES
  // ==============================================

  interface WorkerOptions {
    type?: 'classic' | 'module';
    credentials?: 'omit' | 'same-origin' | 'include';
    name?: string;
  }

  interface SharedWorker extends EventTarget {
    port: MessagePort;
    onerror: ((this: SharedWorker, ev: ErrorEvent) => any) | null;
  }

  // ==============================================
  // SERVICE WORKER TYPES
  // ==============================================

  interface ServiceWorker extends EventTarget {
    scriptURL: string;
    state: 'installing' | 'installed' | 'activating' | 'activated' | 'redundant';
    postMessage(message: any, transfer?: Transferable[]): void;
    onstatechange: ((this: ServiceWorker, ev: Event) => any) | null;
    onerror: ((this: ServiceWorker, ev: ErrorEvent) => any) | null;
  }

  interface ServiceWorkerRegistration extends EventTarget {
    installing: ServiceWorker | null;
    waiting: ServiceWorker | null;
    active: ServiceWorker | null;
    navigationPreload: NavigationPreloadManager;
    scope: string;
    updateViaCache: 'imports' | 'all' | 'none';
    update(): Promise<void>;
    unregister(): Promise<boolean>;
    onupdatefound: ((this: ServiceWorkerRegistration, ev: Event) => any) | null;
  }

  interface NavigationPreloadManager {
    enable(): Promise<void>;
    disable(): Promise<void>;
    setHeaderValue(value: string): Promise<void>;
    getState(): Promise<NavigationPreloadState>;
  }

  interface NavigationPreloadState {
    enabled: boolean;
    headerValue: string;
  }

  interface ServiceWorkerContainer extends EventTarget {
    controller: ServiceWorker | null;
    ready: Promise<ServiceWorkerRegistration>;
    getRegistration(clientURL?: string): Promise<ServiceWorkerRegistration | undefined>;
    getRegistrations(): Promise<ServiceWorkerRegistration[]>;
    register(scriptURL: string | URL, options?: RegistrationOptions): Promise<ServiceWorkerRegistration>;
    startMessages(): void;
    oncontrollerchange: ((this: ServiceWorkerContainer, ev: Event) => any) | null;
    onmessage: ((this: ServiceWorkerContainer, ev: MessageEvent) => any) | null;
    onerror: ((this: ServiceWorkerContainer, ev: ErrorEvent) => any) | null;
  }

  interface RegistrationOptions {
    scope?: string;
    type?: 'classic' | 'module';
    updateViaCache?: 'imports' | 'all' | 'none';
  }

  // ==============================================
  // CACHE API
  // ==============================================

  interface Cache {
    match(request: RequestInfo | URL, options?: CacheQueryOptions): Promise<Response | undefined>;
    matchAll(request?: RequestInfo | URL, options?: CacheQueryOptions): Promise<Response[]>;
    add(request: RequestInfo | URL): Promise<void>;
    addAll(requests: RequestInfo[]): Promise<void>;
    put(request: RequestInfo | URL, response: Response): Promise<void>;
    delete(request: RequestInfo | URL, options?: CacheQueryOptions): Promise<boolean>;
    keys(request?: RequestInfo | URL, options?: CacheQueryOptions): Promise<ReadonlyArray<Request>>;
  }

  interface CacheStorage {
    open(cacheName: string): Promise<Cache>;
    has(cacheName: string): Promise<boolean>;
    delete(cacheName: string): Promise<boolean>;
    keys(): Promise<string[]>;
    match(request: RequestInfo | URL, options?: CacheQueryOptions): Promise<Response | undefined>;
  }

  interface CacheQueryOptions {
    ignoreSearch?: boolean;
    ignoreMethod?: boolean;
    ignoreVary?: boolean;
  }

  // ==============================================
  // INDEXED DB TYPES
  // ==============================================

  interface IDBFactory {
    open(name: string, version?: number): IDBOpenDBRequest;
    deleteDatabase(name: string): IDBOpenDBRequest;
    databases(): Promise<IDBDatabaseInfo[]>;
    cmp(first: any, second: any): number;
  }

  interface IDBDatabaseInfo {
    name: string;
    version: number;
  }

  interface IDBOpenDBRequest extends IDBRequest {
    onblocked: ((this: IDBOpenDBRequest, ev: Event) => any) | null;
    onupgradeneeded: ((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any) | null;
  }

  interface IDBRequest<T = any> extends EventTarget {
    result: T;
    error: DOMException | null;
    source: any;
    transaction: IDBTransaction | null;
    readyState: 'pending' | 'done';
    onsuccess: ((this: IDBRequest<T>, ev: Event) => any) | null;
    onerror: ((this: IDBRequest<T>, ev: Event) => any) | null;
  }

  interface IDBTransaction extends EventTarget {
    objectStoreNames: DOMStringList;
    mode: IDBTransactionMode;
    db: IDBDatabase;
    error: DOMException | null;
    abort(): void;
    commit(): void;
    objectStore(name: string): IDBObjectStore;
    onabort: ((this: IDBTransaction, ev: Event) => any) | null;
    oncomplete: ((this: IDBTransaction, ev: Event) => any) | null;
    onerror: ((this: IDBTransaction, ev: Event) => any) | null;
  }

  interface IDBObjectStore {
    name: string;
    keyPath: string | string[] | null;
    indexNames: DOMStringList;
    transaction: IDBTransaction;
    autoIncrement: boolean;
    put(value: any, key?: IDBValidKey): IDBRequest;
    add(value: any, key?: IDBValidKey): IDBRequest;
    delete(key: IDBValidKey | IDBKeyRange): IDBRequest;
    get(key: IDBValidKey | IDBKeyRange): IDBRequest;
    getKey(key: IDBValidKey | IDBKeyRange): IDBRequest;
    getAll(query?: IDBValidKey | IDBKeyRange | null, count?: number): IDBRequest;
    getAllKeys(query?: IDBValidKey | IDBKeyRange | null, count?: number): IDBRequest;
    clear(): IDBRequest;
    count(key?: IDBValidKey | IDBKeyRange): IDBRequest;
    openCursor(query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): IDBRequest;
    openKeyCursor(query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): IDBRequest;
    index(name: string): IDBIndex;
    createIndex(name: string, keyPath: string | string[], options?: IDBIndexParameters): IDBIndex;
    deleteIndex(name: string): void;
  }

  interface IDBIndex {
    name: string;
    objectStore: IDBObjectStore;
    keyPath: string | string[];
    multiEntry: boolean;
    unique: boolean;
    get(key: IDBValidKey | IDBKeyRange): IDBRequest;
    getKey(key: IDBValidKey | IDBKeyRange): IDBRequest;
    getAll(query?: IDBValidKey | IDBKeyRange | null, count?: number): IDBRequest;
    getAllKeys(query?: IDBValidKey | IDBKeyRange | null, count?: number): IDBRequest;
    count(key?: IDBValidKey | IDBKeyRange): IDBRequest;
    openCursor(query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): IDBRequest;
    openKeyCursor(query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): IDBRequest;
  }

  interface IDBCursor {
    source: IDBObjectStore | IDBIndex;
    direction: IDBCursorDirection;
    key: IDBValidKey;
    primaryKey: IDBValidKey;
    advance(count: number): void;
    continue(key?: IDBValidKey): void;
    continuePrimaryKey(key: IDBValidKey, primaryKey: IDBValidKey): void;
    delete(): IDBRequest;
    update(value: any): IDBRequest;
  }

  interface IDBKeyRange {
    lower: any;
    upper: any;
    lowerOpen: boolean;
    upperOpen: boolean;
    includes(key: IDBValidKey): boolean;
  }

  interface IDBKeyRange {
    only(value: IDBValidKey): IDBKeyRange;
    lowerBound(lower: IDBValidKey, open?: boolean): IDBKeyRange;
    upperBound(upper: IDBValidKey, open?: boolean): IDBKeyRange;
    bound(lower: IDBValidKey, upper: IDBValidKey, lowerOpen?: boolean, upperOpen?: boolean): IDBKeyRange;
  }

  type IDBTransactionMode = 'readonly' | 'readwrite' | 'versionchange';
  type IDBCursorDirection = 'next' | 'nextunique' | 'prev' | 'prevunique';
  type IDBValidKey = number | string | Date | BufferSource | IDBValidKey[];

  interface IDBVersionChangeEvent extends Event {
    oldVersion: number;
    newVersion: number | null;
  }

  // ==============================================
  // NOTIFICATION API
  // ==============================================

  interface NotificationOptions {
    dir?: 'auto' | 'ltr' | 'rtl';
    lang?: string;
    badge?: string;
    body?: string;
    tag?: string;
    icon?: string;
    image?: string;
    data?: any;
    vibrate?: VibratePattern;
    renotify?: boolean;
    requireInteraction?: boolean;
    actions?: NotificationAction[];
    silent?: boolean;
  }

  interface NotificationAction {
    action: string;
    title: string;
    icon?: string;
  }

  interface NotificationEvent extends ExtendableEvent {
    notification: Notification;
    action?: string;
  }

  interface Notification {
    title: string;
    dir: 'auto' | 'ltr' | 'rtl';
    lang: string;
    body: string;
    tag: string;
    icon: string;
    data: any;
    silent: boolean;
    requireInteraction: boolean;
    onclick: ((this: Notification, ev: Event) => any) | null;
    onclose: ((this: Notification, ev: Event) => any) | null;
    onerror: ((this: Notification, ev: Event) => any) | null;
    onshow: ((this: Notification, ev: Event) => any) | null;
    close(): void;
  }

  interface Notification {
    permission: NotificationPermission;
    requestPermission(deprecatedCallback?: (permission: NotificationPermission) => void): Promise<NotificationPermission>;
  }

  type NotificationPermission = 'default' | 'denied' | 'granted';
  type VibratePattern = number | number[];

  // ==============================================
  // PUSH API
  // ==============================================

  interface PushManager {
    subscribe(options?: PushSubscriptionOptions): Promise<PushSubscription>;
    getSubscription(): Promise<PushSubscription | null>;
    permissionState(options?: PushSubscriptionOptions): Promise<PushPermissionState>;
  }

  interface PushSubscriptionOptions {
    userVisibleOnly?: boolean;
    applicationServerKey?: BufferSource | string | null;
  }

  interface PushSubscription {
    endpoint: string;
    expirationTime: number | null;
    options: PushSubscriptionOptions;
    getKey(name: 'auth' | 'p256dh'): ArrayBuffer | null;
    toJSON(): PushSubscriptionJSON;
    unsubscribe(): Promise<boolean>;
  }

  interface PushSubscriptionJSON {
    endpoint?: string;
    expirationTime?: number | null;
    keys?: Record<string, string>;
  }

  type PushPermissionState = 'granted' | 'denied' | 'prompt';

  interface PushEvent extends ExtendableEvent {
    data: PushMessageData | null;
  }

  interface PushMessageData {
    arrayBuffer(): ArrayBuffer;
    blob(): Blob;
    json(): any;
    text(): string;
  }

  // ==============================================
  // BACKGROUND SYNC API
  // ==============================================

  interface SyncManager {
    register(tag: string): Promise<void>;
    getTags(): Promise<string[]>;
  }

  interface SyncEvent extends ExtendableEvent {
    tag: string;
    lastChance: boolean;
  }

  // ==============================================
  // PERIODIC BACKGROUND SYNC API
  // ==============================================

  interface PeriodicSyncManager {
    register(tag: string, options?: PeriodicSyncOptions): Promise<void>;
    getTags(): Promise<string[]>;
    unregister(tag: string): Promise<void>;
  }

  interface PeriodicSyncOptions {
    minInterval: number;
  }

  interface PeriodicSyncEvent extends ExtendableEvent {
    tag: string;
  }

  // ==============================================
  // BACKGROUND FETCH API
  // ==============================================

  interface BackgroundFetchManager {
    fetch(id: string, requests: RequestInfo | RequestInfo[], options?: BackgroundFetchOptions): Promise<BackgroundFetchRegistration>;
    get(id: string): Promise<BackgroundFetchRegistration | undefined>;
    getIds(): Promise<string[]>;
  }

  interface BackgroundFetchOptions {
    title?: string;
    icons?: BackgroundFetchIcon[];
    downloadTotal?: number;
  }

  interface BackgroundFetchIcon {
    src: string;
    sizes?: string;
    type?: string;
  }

  interface BackgroundFetchRegistration extends EventTarget {
    id: string;
    uploadTotal: number;
    uploaded: number;
    downloadTotal: number;
    downloaded: number;
    result: '' | 'success' | 'failure';
    failureReason: '' | 'aborted' | 'bad-status' | 'fetch-error' | 'quota-exceeded' | 'download-total-exceeded';
    recordsAvailable: boolean;
    abort(): Promise<boolean>;
    match(request: RequestInfo, options?: CacheQueryOptions): Promise<BackgroundFetchRecord | undefined>;
    matchAll(request?: RequestInfo, options?: CacheQueryOptions): Promise<BackgroundFetchRecord[]>;
    onprogress: ((this: BackgroundFetchRegistration, ev: Event) => any) | null;
  }

  interface BackgroundFetchRecord {
    request: Request;
    responseReady: Promise<Response>;
  }

  // ==============================================
  // WEB AUTHENTICATION
  // ==============================================

  interface PublicKeyCredentialCreationOptions {
    rp: PublicKeyCredentialRpEntity;
    user: PublicKeyCredentialUserEntity;
    challenge: BufferSource;
    pubKeyCredParams: PublicKeyCredentialParameters[];
    timeout?: number;
    excludeCredentials?: PublicKeyCredentialDescriptor[];
    authenticatorSelection?: AuthenticatorSelectionCriteria;
    attestation?: AttestationConveyancePreference;
    extensions?: AuthenticationExtensionsClientInputs;
  }

  interface PublicKeyCredentialRequestOptions {
    challenge: BufferSource;
    timeout?: number;
    rpId?: string;
    allowCredentials?: PublicKeyCredentialDescriptor[];
    userVerification?: UserVerificationRequirement;
    extensions?: AuthenticationExtensionsClientInputs;
  }

  interface PublicKeyCredentialRpEntity {
    id?: string;
    name: string;
  }

  interface PublicKeyCredentialUserEntity {
    id: BufferSource;
    name: string;
    displayName: string;
  }

  interface PublicKeyCredentialParameters {
    type: 'public-key';
    alg: number;
  }

  interface PublicKeyCredentialDescriptor {
    type: 'public-key';
    id: BufferSource;
    transports?: AuthenticatorTransport[];
  }

  interface AuthenticatorSelectionCriteria {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    requireResidentKey?: boolean;
    residentKey?: 'discouraged' | 'preferred' | 'required';
    userVerification?: UserVerificationRequirement;
  }

  type UserVerificationRequirement = 'required' | 'preferred' | 'discouraged';
  type AttestationConveyancePreference = 'none' | 'indirect' | 'direct' | 'enterprise';
  type AuthenticatorTransport = 'usb' | 'nfc' | 'ble' | 'internal';
  type AuthenticatorAttachment = 'platform' | 'cross-platform';

  interface AuthenticationExtensionsClientInputs {
    appid?: string;
    appidExclude?: string;
    credProps?: boolean;
    uvm?: boolean;
  }

  interface AuthenticationExtensionsClientOutputs {
    appid?: boolean;
    credProps?: CredentialPropertiesOutput;
    uvm?: UvmEntries;
  }

  interface CredentialPropertiesOutput {
    rk?: boolean;
  }

  type UvmEntry = [number, number, number];
  type UvmEntries = UvmEntry[];

  // ==============================================
  // ENVIRONMENT VARIABLES
  // ==============================================

  interface ImportMeta {
    env: {
      MODE: string;
      BASE_URL: string;
      PROD: boolean;
      DEV: boolean;
      SSR: boolean;
      
      // ZEDU specific
      VITE_API_URL: string;
      VITE_SOCKET_URL: string;
      VITE_AGORA_APP_ID: string;
      VITE_AGORA_CERTIFICATE?: string;
      VITE_GOOGLE_CLIENT_ID?: string;
      VITE_FACEBOOK_APP_ID?: string;
      VITE_STRIPE_PUBLIC_KEY?: string;
      VITE_ECOCASH_API_KEY?: string;
      VITE_PAYNOW_INTEGRATION_KEY?: string;
      VITE_OPENAI_API_KEY?: string;
      VITE_VAPID_PUBLIC_KEY?: string;
      VITE_GOOGLE_ANALYTICS_ID?: string;
      VITE_SENTRY_DSN?: string;
      VITE_APP_VERSION: string;
      VITE_APP_NAME: string;
      VITE_APP_URL: string;
    };
  }

  // ==============================================
  // REACT SPECIFIC TYPES
  // ==============================================

  namespace React {
    interface CSSProperties {
      [key: `--${string}`]: string | number;
    }
  }

  // ==============================================
  // CUSTOM EVENT TYPES
  // ==============================================

  interface ZeduEvents {
    'auth:login': { userId: string; role: UserRole };
    'auth:logout': { userId: string };
    'notification:new': { id: string; title: string; type: string };
    'video:call:start': { roomId: string; hostId: string };
    'video:call:end': { roomId: string };
    'video:user:joined': { roomId: string; userId: string };
    'video:user:left': { roomId: string; userId: string };
    'chat:message': { conversationId: string; messageId: string };
    'course:enroll': { courseId: string; studentId: string };
    'course:complete': { courseId: string; studentId: string };
    'payment:success': { transactionId: string; amount: number };
    'payment:failed': { transactionId: string; reason: string };
    'system:maintenance': { startTime: string; endTime: string };
    'system:update': { version: string; features: string[] };
  }

  interface CustomEventMap {
    'zedu:auth:login': CustomEvent<ZeduEvents['auth:login']>;
    'zedu:auth:logout': CustomEvent<ZeduEvents['auth:logout']>;
    'zedu:notification:new': CustomEvent<ZeduEvents['notification:new']>;
    'zedu:video:call:start': CustomEvent<ZeduEvents['video:call:start']>;
    'zedu:video:call:end': CustomEvent<ZeduEvents['video:call:end']>;
    'zedu:video:user:joined': CustomEvent<ZeduEvents['video:user:joined']>;
    'zedu:video:user:left': CustomEvent<ZeduEvents['video:user:left']>;
    'zedu:chat:message': CustomEvent<ZeduEvents['chat:message']>;
    'zedu:course:enroll': CustomEvent<ZeduEvents['course:enroll']>;
    'zedu:course:complete': CustomEvent<ZeduEvents['course:complete']>;
    'zedu:payment:success': CustomEvent<ZeduEvents['payment:success']>;
    'zedu:payment:failed': CustomEvent<ZeduEvents['payment:failed']>;
    'zedu:system:maintenance': CustomEvent<ZeduEvents['system:maintenance']>;
    'zedu:system:update': CustomEvent<ZeduEvents['system:update']>;
  }

  interface Window {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
    
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => void,
      options?: boolean | EventListenerOptions
    ): void;
    
    dispatchEvent<K extends keyof CustomEventMap>(event: CustomEventMap[K]): boolean;
  }

  // ==============================================
  // MODULE DECLARATIONS
  // ==============================================

  declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>;
    export default content;
  }

  declare module '*.png' {
    const content: string;
    export default content;
  }

  declare module '*.jpg' {
    const content: string;
    export default content;
  }

  declare module '*.jpeg' {
    const content: string;
    export default content;
  }

  declare module '*.gif' {
    const content: string;
    export default content;
  }

  declare module '*.webp' {
    const content: string;
    export default content;
  }

  declare module '*.ico' {
    const content: string;
    export default content;
  }

  declare module '*.bmp' {
    const content: string;
    export default content;
  }

  declare module '*.pdf' {
    const content: string;
    export default content;
  }

  declare module '*.mp4' {
    const content: string;
    export default content;
  }

  declare module '*.webm' {
    const content: string;
    export default content;
  }

  declare module '*.woff' {
    const content: string;
    export default content;
  }

  declare module '*.woff2' {
    const content: string;
    export default content;
  }

  declare module '*.ttf' {
    const content: string;
    export default content;
  }

  declare module '*.eot' {
    const content: string;
    export default content;
  }

  declare module '*.json' {
    const content: any;
    export default content;
  }

  // ==============================================
  // UTILITY TYPES
  // ==============================================

  type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  } : T;

  type DeepReadonly<T> = T extends object ? {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
  } : T;

  type DeepRequired<T> = T extends object ? {
    [P in keyof T]-?: DeepRequired<T[P]>;
  } : T;

  type Nullable<T> = T | null;

  type Optional<T> = T | undefined;

  type ValueOf<T> = T[keyof T];

  type UnionToIntersection<U> = 
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

  type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any;

  type Constructor<T> = new (...args: any[]) => T;

  type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
  interface JSONObject { [key: string]: JSONValue; }
  interface JSONArray extends Array<JSONValue> {}

  // ==============================================
  // ENVIRONMENT DETECTION
  // ==============================================

  const IS_PRODUCTION: boolean;
  const IS_DEVELOPMENT: boolean;
  const IS_TEST: boolean;
  const IS_BROWSER: boolean;
  const IS_NODE: boolean;
  const IS_SERVER: boolean;
  const IS_CLIENT: boolean;
  const IS_MOBILE: boolean;
  const IS_TABLET: boolean;
  const IS_DESKTOP: boolean;
  const IS_IOS: boolean;
  const IS_ANDROID: boolean;
  const IS_WINDOWS: boolean;
  const IS_MAC: boolean;
  const IS_LINUX: boolean;
}

// ==============================================
// EXPORT FOR MODULE USE
// ==============================================

export {};