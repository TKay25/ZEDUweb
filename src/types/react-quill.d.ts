// src/types/react-quill.d.ts
declare module 'react-quill' {
  import { Component } from 'react';
  
  export interface ReactQuillProps {
    theme?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    modules?: any;
    formats?: string[];
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    placeholder?: string;
    readOnly?: boolean;
    tabIndex?: number;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
  }
  
  export default class ReactQuill extends Component<ReactQuillProps> {}
}