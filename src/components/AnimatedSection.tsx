import { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale";
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  duration?: "fast" | "normal" | "slow";
  as?: keyof JSX.IntrinsicElements;
}

const delayClasses = {
  0: "",
  1: "animation-delay-100",
  2: "animation-delay-200",
  3: "animation-delay-300",
  4: "animation-delay-400",
  5: "animation-delay-500",
};

const durationClasses = {
  fast: "duration-500",
  normal: "duration-700",
  slow: "duration-1000",
};

const getAnimationClasses = (animation: AnimatedSectionProps["animation"], isInView: boolean) => {
  const base = "transition-all will-change-transform";

  if (!isInView) {
    switch (animation) {
      case "fade-up":
        return "opacity-0 translate-y-12";
      case "fade-in":
        return "opacity-0";
      case "slide-left":
        return "opacity-0 -translate-x-12";
      case "slide-right":
        return "opacity-0 translate-x-12";
      case "scale":
        return "opacity-0 scale-95";
      default:
        return "";
    }
  }

  switch (animation) {
    case "fade-up":
    case "slide-left":
    case "slide-right":
      return "opacity-100 translate-x-0 translate-y-0";
    case "fade-in":
      return "opacity-100";
    case "scale":
      return "opacity-100 scale-100";
    default:
      return "";
  }
};

export const AnimatedSection = ({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = "normal",
  as: Component = "div",
}: AnimatedSectionProps) => {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        durationClasses[duration],
        delayClasses[delay],
        getAnimationClasses(animation, isInView),
        className
      )}
    >
      {children}
    </Component>
  );
};

export default AnimatedSection;
