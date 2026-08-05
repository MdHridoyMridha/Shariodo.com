import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, ShieldCheck, Gem } from 'lucide-react';

export default function SharidoHero3DLogo() {
  // Motion values for 3D perspective tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for fluid mouse reaction
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  // Transform coordinates into degrees of rotation
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  // Dynamic light glare position
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized position between -0.5 and 0.5
    const normX = (e.clientX - rect.left) / width - 0.5;
    const normY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(normX);
    y.set(normY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="perspective-1000 w-full max-w-md mx-auto py-4 select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative bg-gradient-to-br from-[#0E3330] via-[#092220] to-[#051514] rounded-3xl p-8 border border-[#3A6B65]/40 shadow-2xl space-y-6 overflow-hidden group cursor-pointer"
      >
        {/* Subtle Glare Layer */}
        <motion.div 
          className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_var(--glare-x)_var(--glare-y),rgba(255,255,255,0.4),transparent_60%)]"
          style={{
            // @ts-ignore
            '--glare-x': glareX,
            '--glare-y': glareY,
          }}
        />

        {/* Floating Ambient Glow Ring */}
        <div 
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#D87A38]/20 blur-3xl pointer-events-none" 
          style={{ transform: 'translateZ(-20px)' }}
        />
        <div 
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#C59B4E]/15 blur-3xl pointer-events-none" 
          style={{ transform: 'translateZ(-20px)' }}
        />

        {/* 3D Top Badge */}
        <div 
          className="flex items-center justify-between text-xs"
          style={{ transform: 'translateZ(30px)' }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18423E] border border-[#2E5E58] text-[#E8D8B8] text-[10px] font-extrabold uppercase tracking-widest shadow-inner">
            <Sparkles size={12} className="text-[#D87A38]" /> Official Brand Emblem
          </span>
          <span className="text-[10px] font-mono text-[#789C97] font-semibold">
            Bespoke 3D Seal
          </span>
        </div>

        {/* 3D Centered Logo Showcase */}
        <div 
          className="flex flex-col items-center justify-center text-center py-4 space-y-5"
          style={{ transform: 'translateZ(50px)' }}
        >
          {/* 3D Floating Emblem SVG */}
          <div className="relative group-hover:scale-110 transition-transform duration-500">
            {/* Glow shadow behind SVG */}
            <div className="absolute inset-0 bg-[#D87A38]/30 blur-2xl rounded-full scale-125 pointer-events-none" />

            <svg
              width="130"
              height="130"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
            >
              {/* Outer Arch Frame Ring */}
              <path
                d="M 22 55 A 32 32 0 1 1 78 55"
                stroke="#E8D8B8"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Inner Circle Ring */}
              <circle
                cx="50"
                cy="32"
                r="16"
                stroke="#E8D8B8"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Inverted Terracotta Triangle */}
              <polygon
                points="28,24 72,24 50,56"
                stroke="#D87A38"
                strokeWidth="3"
                fill="none"
                strokeLinejoin="round"
              />

              {/* Delicate Swag Lines inside Triangle */}
              <path
                d="M 34 26 Q 50 38 66 26"
                stroke="#E8D8B8"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M 38 29 Q 50 42 62 29"
                stroke="#E8D8B8"
                strokeWidth="1.2"
                fill="none"
              />

              {/* Hanging Central Diamond Pendant String */}
              <line
                x1="50"
                y1="56"
                x2="50"
                y2="72"
                stroke="#E8D8B8"
                strokeWidth="1.5"
              />
              {/* Diamond Charm */}
              <polygon
                points="50,72 54,77 50,86 46,77"
                stroke="#E8D8B8"
                strokeWidth="1.5"
                fill="#D87A38"
              />
              <polygon
                points="50,77 52,80 50,84 48,80"
                stroke="#E8D8B8"
                strokeWidth="1"
                fill="none"
              />

              {/* Left Hanging Feathers */}
              <path
                d="M 28 50 L 32 58 L 26 62 L 32 68 L 24 74 L 30 80 L 26 88"
                stroke="#D87A38"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Right Hanging Feathers */}
              <path
                d="M 72 50 L 68 58 L 74 62 L 68 68 L 76 74 L 70 80 L 74 88"
                stroke="#D87A38"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* 3D Floating Typography */}
          <div className="space-y-1.5" style={{ transform: 'translateZ(65px)' }}>
            <h2 
              className="text-3xl sm:text-4xl font-black tracking-[0.18em] text-[#FAF5EB] font-serif uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: '"Playfair Display", "Cinzel", "Bodoni MT", serif' }}
            >
              SHARIDO
            </h2>
            <p className="text-xs sm:text-sm text-[#D8C3A5] italic font-serif tracking-wide opacity-90">
              Crafted with Heart, Inspired by Tradition
            </p>
          </div>
        </div>

        {/* Bottom Micro Features Bar with Elevated 3D Depth */}
        <div 
          className="pt-4 border-t border-[#1F4D47]/60 grid grid-cols-2 gap-3 text-left"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="bg-[#0B2321]/80 backdrop-blur-md p-3 rounded-2xl border border-[#235751]/50 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#18423E] text-[#D87A38] flex items-center justify-center shrink-0">
              <Gem size={16} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#FAF5EB]">Artisan Crafted</p>
              <p className="text-[9px] text-[#8BAEA9]">100% Hand-forged</p>
            </div>
          </div>

          <div className="bg-[#0B2321]/80 backdrop-blur-md p-3 rounded-2xl border border-[#235751]/50 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#18423E] text-[#E8D8B8] flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#FAF5EB]">Authentic Guild</p>
              <p className="text-[9px] text-[#8BAEA9]">Certified Origin</p>
            </div>
          </div>
        </div>

        {/* Floating 3D Stamp Accent */}
        <div 
          className="absolute -bottom-3 -right-3 bg-[#FAF5EB] text-[#0E3330] p-3 rounded-2xl shadow-2xl border border-[#E8D8B8] flex items-center gap-2"
          style={{ transform: 'translateZ(75px)' }}
        >
          <div className="w-7 h-7 rounded-lg bg-[#D87A38] text-white flex items-center justify-center font-black text-xs">
            ★
          </div>
          <div className="text-[10px] leading-tight">
            <p className="font-extrabold text-[#0E3330]">Sharido Mark</p>
            <p className="text-[#685D4E] text-[9px]">Handmade Guarantee</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
