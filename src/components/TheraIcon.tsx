
import React from "react";
import { cn } from "@/lib/utils";

interface TheraIconProps {
  size?: number;
  className?: string;
}

const TheraIcon = ({ size = 40, className }: TheraIconProps) => {
  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-full overflow-hidden",
        className
      )}
      style={{ 
        width: `${size}px`, 
        height: `${size}px` 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-thera-purple to-thera-blue" />
      <div 
        className="absolute inset-[10%] bg-white rounded-full flex items-center justify-center"
        style={{ inset: `${size * 0.06}px` }}
      >
        <div 
          className="absolute inset-[10%] bg-gradient-to-br from-thera-purple/90 to-thera-blue/90 rounded-full flex items-center justify-center text-white font-bold"
          style={{ inset: `${size * 0.06}px` }}
        >
          <span style={{ fontSize: `${size * 0.4}px` }}>T</span>
        </div>
      </div>
    </div>
  );
};

export default TheraIcon;
