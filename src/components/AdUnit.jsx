import React from 'react';

export const AdUnit = ({ type = 'banner', className = '' }) => {
  const styles = {
    banner: 'w-full h-[90px] lg:h-[120px]',
    sidebar: 'w-full h-[250px]',
    rectangle: 'w-[300px] h-[250px]',
    leaderboard: 'w-full h-[60px] lg:h-[90px]',
  };

  return (
    <div 
      className={`ad-container relative overflow-hidden rounded-lg border border-white/5 bg-[#0a0a0a] flex items-center justify-center ${styles[type] || styles.banner} ${className}`}
      style={{
        minHeight: type === 'sidebar' ? '250px' : type === 'banner' ? '90px' : '60px',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center pointer-events-none select-none">
          <div className="w-8 h-8 mx-auto mb-1 rounded-lg border border-white/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <p className="text-[8px] text-white/15 uppercase tracking-widest font-mono">Advertisement</p>
        </div>
      </div>

      <div 
        className="ad-slot w-full h-full absolute inset-0 z-10"
        data-ad-slot="true"
        data-ad-type={type}
      />
    </div>
  );
};
