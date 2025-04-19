
import React from "react";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface TherapyTipProps {
  title: string;
  content: string;
  color?: 'purple' | 'blue' | 'pink';
  className?: string;
}

const TherapyTip = ({
  title,
  content,
  color = 'purple',
  className
}: TherapyTipProps) => {
  const colorClasses = {
    purple: 'bg-thera-lightpurple border-thera-purple/30',
    blue: 'bg-thera-blue border-blue-300/30',
    pink: 'bg-thera-pink border-pink-300/30',
  };
  
  const iconColorClasses = {
    purple: 'bg-thera-purple/20 text-thera-purple',
    blue: 'bg-blue-500/20 text-blue-500',
    pink: 'bg-pink-500/20 text-pink-500',
  };

  return (
    <Card className={cn(
      'p-4 border',
      colorClasses[color],
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'rounded-full p-2 flex items-center justify-center shrink-0',
          iconColorClasses[color]
        )}>
          <Lightbulb size={18} />
        </div>
        
        <div>
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{content}</p>
        </div>
      </div>
    </Card>
  );
};

export default TherapyTip;
