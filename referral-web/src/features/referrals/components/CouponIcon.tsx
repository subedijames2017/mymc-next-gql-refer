import React from 'react';

interface CouponIconProps {
  amount?: string;
  className?: string;
}

const CouponIcon: React.FC<CouponIconProps> = ({ amount = "$20", className = "" }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16"
      >
        {/* Coupon background */}
        <rect
          x="4"
          y="12"
          width="56"
          height="32"
          rx="4"
          fill="hsl(var(--coupon))"
          className="drop-shadow-sm"
        />
        
        {/* Coupon perforations */}
        <circle cx="4" cy="28" r="3" fill="hsl(var(--background))" />
        <circle cx="60" cy="28" r="3" fill="hsl(var(--background))" />
        
        {/* Dotted line */}
        <line
          x1="8"
          y1="28"
          x2="56"
          y2="28"
          stroke="hsl(var(--coupon-foreground))"
          strokeWidth="1"
          strokeDasharray="2,2"
          opacity="0.4"
        />
      </svg>
      
      {/* Amount text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-coupon-foreground font-bold text-sm leading-none">
          {amount}
        </span>
      </div>
    </div>
  );
};

export default CouponIcon;