import React from "react";

const outerIcons = [
  { icon: "memory", color: "text-primary", delay: "0s" },
  { icon: "recycling", color: "text-accent", delay: "2s" },
  { icon: "computer", color: "text-green-400", delay: "4s" },
  
];

// ✅ 3 tane daha ek: iç yörünge mini ikonlar
const innerIcons = [
  { icon: "battery_full", color: "text-lime-400", delay: "0s" },
  { icon: "smartphone", color: "text-sky-400", delay: "1.2s" },
  { icon: "precision_manufacturing", color: "text-teal-300", delay: "2.4s" },
];

// ✅ sparkle noktaları
const sparkles = [
  { top: "18%", left: "22%", size: "3px", delay: "0s" },
  { top: "72%", left: "18%", size: "2px", delay: "1.1s" },
  { top: "28%", left: "78%", size: "2px", delay: "0.6s" },
  { top: "80%", left: "74%", size: "3px", delay: "1.7s" },
  { top: "52%", left: "90%", size: "2px", delay: "0.3s" },
  { top: "10%", left: "60%", size: "2px", delay: "1.4s" },
];

export const EWasteOrbit = () => {
  return (
    <div className="relative w-[420px] h-[420px]">
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-[120px]" />

      {/* ✅ Radar / tarama ışını */}
      <div className="absolute inset-0 rounded-full radar-sweep pointer-events-none" />

      {/* Dış Çember */}
      <div className="absolute inset-0 rounded-full border border-dashed border-primary/30 animate-spin-slow" />

      {/* ✅ İç Çember */}
      <div className="absolute inset-[70px] rounded-full border border-dashed border-accent/25 animate-spin-slower" />

      {/* ✅ Sparkles */}
      {sparkles.map((s, i) => (
        <span
          key={i}
          className="absolute sparkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* Orta AI */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="size-24 rounded-full bg-background-dark border-2 border-primary shadow-glow flex items-center justify-center relative">
          {/* ✅ merkez pulse halka */}
          <span className="absolute inset-[-18px] rounded-full border border-primary/20 pulse-ring" />
          <span className="material-symbols-outlined text-5xl text-primary animate-pulse">
            eco
          </span>
        </div>
      </div>

      {/* Dış yörünge ikonları */}
      {outerIcons.map((item, i) => (
        <div
          key={i}
          className="absolute inset-0 animate-orbit"
          style={{ animationDelay: item.delay }}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <div className="size-12 rounded-full bg-surface-dark border border-border-dark flex items-center justify-center shadow-glow">
              <span className={`material-symbols-outlined text-2xl ${item.color}`}>
                {item.icon}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* ✅ İç yörünge (3 yeni mini ikon) */}
      {innerIcons.map((item, i) => (
        <div
          key={`inner-${i}`}
          className="absolute inset-[70px] animate-orbit-fast"
          style={{ animationDelay: item.delay }}
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="size-10 rounded-full bg-surface-dark/80 border border-border-dark flex items-center justify-center">
              <span className={`material-symbols-outlined text-[20px] ${item.color}`}>
                {item.icon}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
