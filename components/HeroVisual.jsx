"use client";
import React, { forwardRef } from 'react';

const HeroVisual = forwardRef((props, carRef) => {
  return (
    <div 
      ref={carRef}
      className="absolute top-1/2 -translate-y-1/2 left-0 h-[180px] md:h-[240px] flex items-center justify-center z-30 will-change-transform"
    >
      <img 
        src="/images/car2.png" 
        alt="Hypercar Top View"
        className="h-full w-auto object-contain" 
      />
    </div>
  );
});

HeroVisual.displayName = 'HeroVisual';
export default HeroVisual;
