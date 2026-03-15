import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function WalkingRobot() {
  const [showPopup, setShowPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 pointer-events-none flex items-end">
      {/* Robot Image Container */}
      <motion.div
        initial={{ x: -200 }}
        animate={{ x: 30 }}
        transition={{ 
          type: "spring", 
          stiffness: 40, 
          damping: 15, 
          duration: 3,
          delay: 1 
        }}
        onAnimationComplete={() => {
          // Show popup slightly after reaching destination
          setTimeout(() => setShowPopup(true), 500);
        }}
        className="relative pointer-events-auto cursor-pointer pb-2"
        onClick={() => {
          setShowPopup(true);
        }}
      >
        <img 
          src="/assets/walking-robot.png" 
          alt="Helpful Robot" 
          className="w-24 h-40 object-contain drop-shadow-xl hover:scale-105 transition-transform"
        />

        {/* Speech Bubble */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10, x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, scale: 0.5, y: 10, x: '-50%' }}
              className="absolute -top-16 left-1/2 w-48 bg-white border border-black/10 shadow-lg rounded-2xl rounded-bl-sm p-3 z-50"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPopup(false);
                  setTimeout(() => setIsVisible(false), 300); // Option to dismiss robot entirely
                }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-brand-black text-white rounded-full flex items-center justify-center text-[10px] hover:bg-brand-accent transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
              <p className="text-xs font-bold text-brand-black text-center leading-tight">
                how can help you dear
              </p>
              {/* Little triangle pointing to robot */}
              <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-b border-r border-black/10 transform rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
