import React from 'react';

export const ANDGateSVG = ({ color = '#00f3ff', size = 32 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 60 36" fill="none">
    <path
      d="M 0 0 L 20 0 C 40 0, 55 8, 55 18 C 55 28, 40 36, 20 36 L 0 36 Z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
  </svg>
);

export const ORGateSVG = ({ color = '#bc13fe', size = 32 }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 60 39" fill="none">
    <path
      d="M 5 0 C 20 5, 45 10, 55 19.5 C 45 29, 20 34, 5 39 C 15 25, 15 14, 5 0 Z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
  </svg>
);

export const NOTGateSVG = ({ color = '#ff00ff', size = 28 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 50 35" fill="none">
    <path
      d="M 5 2.5 L 40 17.5 L 5 32.5 Z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <circle cx="44" cy="17.5" r="3" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export const NANDGateSVG = ({ color = '#00f3ff', size = 32 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 60 36" fill="none">
    <path
      d="M 0 0 L 18 0 C 36 0, 50 8, 50 18 C 50 28, 36 36, 18 36 L 0 36 Z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <circle cx="54" cy="18" r="3" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export const NORGateSVG = ({ color = '#bc13fe', size = 32 }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 60 39" fill="none">
    <path
      d="M 5 0 C 20 5, 40 10, 50 19.5 C 40 29, 20 34, 5 39 C 15 25, 15 14, 5 0 Z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <circle cx="54" cy="19.5" r="3" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export const XORGateSVG = ({ color = '#00f3ff', size = 32 }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 60 39" fill="none">
    <path
      d="M 10 0 C 25 5, 50 10, 60 19.5 C 50 29, 25 34, 10 39 C 20 25, 20 14, 10 0 Z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M 5 0 C 15 14, 15 25, 5 39"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
  </svg>
);

export const XNORGateSVG = ({ color = '#bc13fe', size = 32 }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 60 39" fill="none">
    <path
      d="M 10 0 C 25 5, 45 10, 55 19.5 C 45 29, 25 34, 10 39 C 20 25, 20 14, 10 0 Z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M 5 0 C 15 14, 15 25, 5 39"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <circle cx="59" cy="19.5" r="3" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);
