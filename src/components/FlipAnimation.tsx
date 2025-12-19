"use client";

import { useState } from "react";
import { User } from "@/types/User";
import { CardFront } from "@/components/CardFront";
import { CardBack } from "@/components/CardBack";
import { motion } from "framer-motion";

export default function FlipAnimation({ user }: { user: User }) {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setRotation(prev => prev + 180);
      setIsAnimating(true);
    }
  };
  return (
    <div className="group w-full max-w-lg min-w-none aspect-[1.62/1] [perspective:1000px] mx-auto">
      
      <motion.div
        className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: rotation }}
        transition={{ type: "spring", stiffness: 1024, damping: 16 }}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        
        <div className="absolute inset-0 h-full w-full [backface-visibility:hidden]">
          <div className="w-full h-full max-w-none shadow-none">
             <CardFront user={user} onFlip={handleFlip} />
          </div>
        </div>

        <div 
          className="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <div className="w-full h-full max-w-none shadow-none">
             <CardBack user={user} onFlip={handleFlip} />
          </div>
        </div>

      </motion.div>
    </div>
  );
}
