"use client";
import React from 'react';

const statsData = [
  { label: "Increase in aerodynamic efficiency", value: "58%", classes: "top-[5%] right-[25%] bg-white text-[#111] border border-[#e5e7eb] shadow-xl" },
  { label: "Decreased in drag coefficient", value: "23%", classes: "bottom-[5%] right-[30%] bg-[#ef4444] text-white shadow-[0_10px_30px_rgba(239,68,68,0.3)]" },
  { label: "Increase in downforce grip", value: "27%", classes: "top-[5%] right-[5%] bg-[#111] text-white shadow-xl" },
  { label: "Improved cornering stability", value: "40%", classes: "bottom-[5%] right-[8%] bg-white text-[#111] border border-[#e5e7eb] shadow-xl" },
];

export default function HeroStats({ statsRef }) {
  return (
    <>
      {statsData.map((stat, idx) => (
        <div 
          key={idx}
          ref={el => {
            if (statsRef && statsRef.current) {
               statsRef.current[idx] = el;
            }
          }}
          className={`absolute flex flex-col justify-center items-start p-6 md:p-8 rounded-xl z-30 opacity-0 min-w-[200px] md:min-w-[280px] ${stat.classes}`}
        >
          <span className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{stat.value}</span>
          <span className="text-sm md:text-base font-medium">{stat.label}</span>
        </div>
      ))}
    </>
  );
}
