"use client";

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroVisual from './HeroVisual';
import HeroStats from './HeroStats';

const textToReveal = "AERODYNAMICS".split('');

export default function Hero() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const lettersRef = useRef([]);
  const statsRef = useRef([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const carElement = carRef.current;
      if (!carElement) return;

      const roadWidth = window.innerWidth;
      const carWidth = carElement.offsetWidth || 150; 
      
      // Car is fully visible at the start (flush with left edge)
      const startX = 0;
      const endX = roadWidth;
      
      gsap.set(carElement, { x: startX });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom", 
          scrub: 1, // Smooth interpolation so motion feels natural and fluid
        }
      });

      function updateScrollState() {
        const currentX = gsap.getProperty(carElement, "x");
        
        // Native DOM style updates
        const trailWidth = Math.max(0, currentX + (carWidth / 2));
        if (trailRef.current) {
          trailRef.current.style.width = trailWidth + 'px';
        }

        // Text reveal logic
        lettersRef.current.forEach((letter) => {
          if (letter) {
            const letterRect = letter.getBoundingClientRect();
            const letterCenterX = letterRect.left + letterRect.width / 2;
            
            if (currentX + (carWidth / 2) >= letterCenterX) {
              letter.style.opacity = 1;
            } else {
              letter.style.opacity = 0; 
            }
          }
        });
      }

      // Initialize trail and text instantly before any scroll
      updateScrollState();

      tl.to(carElement, {
        x: endX, // Prefer transform properties
        ease: "none",
        onUpdate: updateScrollState
      }, 0);

      // 3. STATS ANIMATION (Independent ScrollTriggers)
      statsRef.current.forEach((stat, index) => {
        if (stat) {
          // Space out the appearance of the stats throughout the scroll distance
          const startPercent = 10 + (index * 22); 
          const endPercent = startPercent + 10;   
          
          gsap.fromTo(stat, 
            { opacity: 0, y: 30 },
            { 
              opacity: 1, 
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: `top+=${startPercent}% top`,
                end: `top+=${endPercent}% top`,
                scrub: true,
              }
            }
          );
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[400vh] bg-[#f8f9fa]">
      
      {/* Occupy the first screen (above the fold) */}
      <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden">
        
        {/* Impact metrics / statistics */}
        <HeroStats statsRef={statsRef} />

        <div className="relative w-full h-[250px] md:h-[300px] bg-[#111111] flex items-center overflow-visible z-10 border-y border-[#333]">
          
          <div 
            ref={trailRef}
            className="absolute left-0 top-0 h-full bg-[#ef4444] z-10"
            style={{ width: '0px' }}
          />

          {/* Letter-spaced headline */}
          <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center gap-2 md:gap-4 z-20 pointer-events-none px-4">
            {textToReveal.map((char, i) => (
              <span 
                key={i} 
                ref={el => lettersRef.current[i] = el}
                className="text-[10vw] sm:text-[8vw] md:text-[7.5vw] lg:text-[6.5vw] font-bold tracking-[0.1em] opacity-0 text-white leading-none"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          <HeroVisual ref={carRef} />
          
        </div>
      </div>
    </section>
  );
}
