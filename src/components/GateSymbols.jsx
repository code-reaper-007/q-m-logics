import React from 'react';

const glowFilter = (color, id) => (
  <defs>
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export const ANDGateSVG = ({ color = '#00f3ff', size = 40, isActive = false }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 60 36" fill="none" className="drop-shadow-lg">
    {glowFilter(color, `glow-and-${color.replace('#', '')}`)}
    <path
      d="M 0 0 L 20 0 C 40 0, 55 8, 55 18 C 55 28, 40 36, 20 36 L 0 36 Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
      filter={isActive ? `url(#glow-and-${color.replace('#', '')})` : undefined}
      style={{
        fill: isActive ? `${color}15` : 'none',
        transition: 'fill 0.3s ease',
      }}
    />
    {isActive && (
      <path
        d="M 0 0 L 20 0 C 40 0, 55 8, 55 18 C 55 28, 40 36, 20 36 L 0 36 Z"
        stroke={color}
        strokeWidth="1"
        fill={`${color}08`}
        opacity="0.6"
      />
    )}
  </svg>
);

export const ORGateSVG = ({ color = '#bc13fe', size = 40, isActive = false }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 60 39" fill="none" className="drop-shadow-lg">
    {glowFilter(color, `glow-or-${color.replace('#', '')}`)}
    <path
      d="M 5 0 C 20 5, 45 10, 55 19.5 C 45 29, 20 34, 5 39 C 15 25, 15 14, 5 0 Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
      filter={isActive ? `url(#glow-or-${color.replace('#', '')})` : undefined}
      style={{
        fill: isActive ? `${color}15` : 'none',
        transition: 'fill 0.3s ease',
      }}
    />
    {isActive && (
      <path
        d="M 5 0 C 20 5, 45 10, 55 19.5 C 45 29, 20 34, 5 39 C 15 25, 15 14, 5 0 Z"
        stroke={color}
        strokeWidth="1"
        fill={`${color}08`}
        opacity="0.6"
      />
    )}
  </svg>
);

export const NOTGateSVG = ({ color = '#ff00ff', size = 36, isActive = false }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 50 35" fill="none" className="drop-shadow-lg">
    {glowFilter(color, `glow-not-${color.replace('#', '')}`)}
    <path
      d="M 5 2.5 L 40 17.5 L 5 32.5 Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
      filter={isActive ? `url(#glow-not-${color.replace('#', '')})` : undefined}
      style={{
        fill: isActive ? `${color}15` : 'none',
        transition: 'fill 0.3s ease',
      }}
    />
    <circle 
      cx="44" 
      cy="17.5" 
      r="3" 
      stroke={color} 
      strokeWidth="2" 
      fill={isActive ? `${color}40` : 'none'}
      filter={isActive ? `url(#glow-not-${color.replace('#', '')})` : undefined}
    />
    {isActive && (
      <path
        d="M 5 2.5 L 40 17.5 L 5 32.5 Z"
        stroke={color}
        strokeWidth="1"
        fill={`${color}08`}
        opacity="0.6"
      />
    )}
  </svg>
);

export const NANDGateSVG = ({ color = '#00f3ff', size = 40, isActive = false }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 60 36" fill="none" className="drop-shadow-lg">
    {glowFilter(color, `glow-nand-${color.replace('#', '')}`)}
    <path
      d="M 0 0 L 18 0 C 36 0, 50 8, 50 18 C 50 28, 36 36, 18 36 L 0 36 Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
      filter={isActive ? `url(#glow-nand-${color.replace('#', '')})` : undefined}
      style={{
        fill: isActive ? `${color}15` : 'none',
        transition: 'fill 0.3s ease',
      }}
    />
    <circle 
      cx="54" 
      cy="18" 
      r="3" 
      stroke={color} 
      strokeWidth="2" 
      fill={isActive ? `${color}40` : 'none'}
      filter={isActive ? `url(#glow-nand-${color.replace('#', '')})` : undefined}
    />
    {isActive && (
      <path
        d="M 0 0 L 18 0 C 36 0, 50 8, 50 18 C 50 28, 36 36, 18 36 L 0 36 Z"
        stroke={color}
        strokeWidth="1"
        fill={`${color}08`}
        opacity="0.6"
      />
    )}
  </svg>
);

export const NORGateSVGComponent = ({ color = '#bc13fe', size = 40, isActive = false }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 60 39" fill="none" className="drop-shadow-lg">
    {glowFilter(color, `glow-nor-${color.replace('#', '')}`)}
    <path
      d="M 5 0 C 20 5, 40 10, 50 19.5 C 40 29, 20 34, 5 39 C 15 25, 15 14, 5 0 Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
      filter={isActive ? `url(#glow-nor-${color.replace('#', '')})` : undefined}
      style={{
        fill: isActive ? `${color}15` : 'none',
        transition: 'fill 0.3s ease',
      }}
    />
    <circle 
      cx="54" 
      cy="19.5" 
      r="3" 
      stroke={color} 
      strokeWidth="2" 
      fill={isActive ? `${color}40` : 'none'}
      filter={isActive ? `url(#glow-nor-${color.replace('#', '')})` : undefined}
    />
    {isActive && (
      <path
        d="M 5 0 C 20 5, 40 10, 50 19.5 C 40 29, 20 34, 5 39 C 15 25, 15 14, 5 0 Z"
        stroke={color}
        strokeWidth="1"
        fill={`${color}08`}
        opacity="0.6"
      />
    )}
  </svg>
);

export const XORGateSVG = ({ color = '#00f3ff', size = 40, isActive = false }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 60 39" fill="none" className="drop-shadow-lg">
    {glowFilter(color, `glow-xor-${color.replace('#', '')}`)}
    <path
      d="M 10 0 C 25 5, 50 10, 60 19.5 C 50 29, 25 34, 10 39 C 20 25, 20 14, 10 0 Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
      filter={isActive ? `url(#glow-xor-${color.replace('#', '')})` : undefined}
      style={{
        fill: isActive ? `${color}15` : 'none',
        transition: 'fill 0.3s ease',
      }}
    />
    <path
      d="M 5 0 C 15 14, 15 25, 5 39"
      stroke={color}
      strokeWidth="2"
      fill="none"
      filter={isActive ? `url(#glow-xor-${color.replace('#', '')})` : undefined}
    />
    {isActive && (
      <path
        d="M 10 0 C 25 5, 50 10, 60 19.5 C 50 29, 25 34, 10 39 C 20 25, 20 14, 10 0 Z"
        stroke={color}
        strokeWidth="1"
        fill={`${color}08`}
        opacity="0.6"
      />
    )}
  </svg>
);

export const XNORGateSVG = ({ color = '#bc13fe', size = 40, isActive = false }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 60 39" fill="none" className="drop-shadow-lg">
    {glowFilter(color, `glow-xnor-${color.replace('#', '')}`)}
    <path
      d="M 10 0 C 25 5, 45 10, 55 19.5 C 45 29, 25 34, 10 39 C 20 25, 20 14, 10 0 Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
      filter={isActive ? `url(#glow-xnor-${color.replace('#', '')})` : undefined}
      style={{
        fill: isActive ? `${color}15` : 'none',
        transition: 'fill 0.3s ease',
      }}
    />
    <path
      d="M 5 0 C 15 14, 15 25, 5 39"
      stroke={color}
      strokeWidth="2"
      fill="none"
      filter={isActive ? `url(#glow-xnor-${color.replace('#', '')})` : undefined}
    />
    <circle 
      cx="59" 
      cy="19.5" 
      r="3" 
      stroke={color} 
      strokeWidth="2" 
      fill={isActive ? `${color}40` : 'none'}
      filter={isActive ? `url(#glow-xnor-${color.replace('#', '')})` : undefined}
    />
    {isActive && (
      <path
        d="M 10 0 C 25 5, 45 10, 55 19.5 C 45 29, 25 34, 10 39 C 20 25, 20 14, 10 0 Z"
        stroke={color}
        strokeWidth="1"
        fill={`${color}08`}
        opacity="0.6"
      />
    )}
  </svg>
);
