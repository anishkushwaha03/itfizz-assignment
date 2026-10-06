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
  const introTextRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Lock scroll during intro animation
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const carElement = carRef.current;
      const introText = introTextRef.current;
      if (!carElement) return;

      const roadWidth = window.innerWidth;
      const carWidth = carElement.offsetWidth || 150; 
      
      const startX = 0;
      const endX = roadWidth;
      const centerX = (roadWidth / 2) - (carWidth / 2);

      // 1. SET INITIAL INTRO STATE
      gsap.set(carElement, { 
        x: centerX, 
        rotation: -90, // vertical, pointing up
        scale: 1.3,    // gentle zoom, prevents vertical clipping
        y: 0
      });

      // 2. INTRO TIMELINE
      const introTl = gsap.timeline({
        onComplete: () => {
          // Unlock scroll when animation finishes
          document.body.style.overflow = "";
          document.body.style.overflowX = "hidden"; // Keep horizontal scroll hidden
          setupScrollTrigger();
        }
      });

      // Text moves up, scales slightly, and fades out
      introTl.to(introText, {
        y: "-15vh",
        scale: 1.05,
        opacity: 0,
        duration: 1.5,
        ease: "expo.inOut",
        delay: 0.6
      });

      // Car rotates clockwise, scales down, and glides to startX
      introTl.to(carElement, {
        x: startX,
        rotation: 0, 
        scale: 1,
        duration: 2.4,
        ease: "expo.inOut"
      }, "-=1.1"); // Beautiful overlap with the text exit

      // Trail grows out from the left to meet the car as it settles
      introTl.to(trailRef.current, {
        width: (carWidth / 2),
        duration: 1.5,
        ease: "expo.out"
      }, "-=1.2"); // Starts as the car is halfway through its journey to the left edge

      // 3. SCROLL LOGIC (runs after intro)
      function setupScrollTrigger() {
        function updateScrollState() {
          const currentX = gsap.getProperty(carElement, "x");
          
          const trailWidth = Math.max(0, currentX + (carWidth / 2));
          if (trailRef.current) {
            trailRef.current.style.width = trailWidth + 'px';
          }

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

        // Initialize immediately
        updateScrollState();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          }
        });

        tl.to(carElement, {
          x: endX,
          ease: "none",
          onUpdate: updateScrollState
        }, 0);

        // Stats Independent ScrollTriggers
        statsRef.current.forEach((stat, index) => {
          if (stat) {
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
      }

    }, containerRef);

    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[400vh] bg-[#f8f9fa]">
      
      {/* Sticky Track Container */}
      <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden">
        
        {/* Intro Text Overlay */}
        <div ref={introTextRef} className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <h1 className="text-[12vw] md:text-[15vw] font-black text-white tracking-tighter drop-shadow-2xl opacity-100">
            ITZFIZZ
          </h1>
        </div>

        {/* Impact metrics / statistics */}
        <HeroStats statsRef={statsRef} />

        <div className="relative w-full h-[250px] md:h-[300px] bg-[#111111] flex items-center overflow-visible z-10 border-y border-[#333]">
          
          <div 
            ref={trailRef}
            className="absolute left-0 top-0 h-full bg-[#ef4444] z-10"
            style={{ width: '0px' }}
          />

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
