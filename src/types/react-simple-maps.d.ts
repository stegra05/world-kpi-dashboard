declare module 'react-simple-maps' {
  import React from 'react';
  
  export const ComposableMap: React.FC<any>;
  export const Geographies: React.FC<any>;
  export const Geography: React.FC<any>;
  export const ZoomableGroup: React.FC<any>;
}

declare module 'react-tooltip' {
  import React from 'react';
  
  export const Tooltip: React.FC<any>;
}

declare module 'd3-scale' {
  export function scaleQuantile<T>(): any;
} 