import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, X } from 'lucide-react';

export const DeviceBanner = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice =
        window.innerWidth < 1024 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);

      setIsMobile(isMobileDevice);

      if (isMobileDevice && !sessionStorage.getItem('device-banner-dismissed')) {
        setTimeout(() => {
          setIsVisible(true);
        }, 1500);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('device-banner-dismissed', 'true');
  };

  if (!isMobile || isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.4, type: 'spring' }}
          className="fixed top-0 left-0 right-0 z-[100] p-3"
        >
          <div className="max-w-md mx-auto glass border border-amber-500/20 rounded-xl p-4 relative shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-white/10 transition-colors text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <div className="flex-shrink-0 mt-0.5">
                <div className="relative">
                  <Monitor className="w-6 h-6 text-amber-400/80" />
                  <Smartphone className="w-3.5 h-3.5 text-amber-400 absolute -bottom-1 -right-1" />
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-bold text-white/90">
                  Best viewed in Desktop mode
                </p>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  For the full interactive circuit canvas experience, please enable <span className="text-amber-400/80 font-semibold">Desktop Site</span> in your browser menu.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-white/30 font-mono">Chrome:</span>
                  <span className="text-[10px] text-white/40">Menu ⋮ → Desktop site</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30 font-mono">Safari:</span>
                  <span className="text-[10px] text-white/40">aA → Request Desktop Website</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
