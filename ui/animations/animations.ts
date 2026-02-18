import { motion, AnimatePresence } from 'framer-motion';

// === PAGE TRANSITIONS === //
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  }
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1],
  }
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1],
  }
};

// === BUTTON INTERACTIONS === //
export const buttonHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 17,
  }
};

export const buttonPress = {
  whileTap: { scale: 0.98 },
  transition: {
    type: "spring",
    stiffness: 600,
    damping: 15,
  }
};

// === LOADING STATES === //
export const skeletonPulse = {
  animate: { opacity: [0.6, 1, 0.6] },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  }
};

export const contentFadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    duration: 0.2,
    ease: "easeOut",
  }
};

// === STATUS TIMELINE === //
export const statusStepIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  }
};

export const progressLineGrow = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  },
  transformOrigin: "left",
};

// === MAP INTERACTIONS === //
export const pinDrop = {
  initial: { y: -20, scale: 0.8, opacity: 0 },
  animate: { y: 0, scale: 1, opacity: 1 },
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20,
  },
};

export const mapPulse = {
  animate: { scale: [1, 1.05, 1] },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// === SUCCESS FEEDBACK === //
export const successCheckmark = {
  initial: { pathLength: 1, opacity: 0 },
  animate: { pathLength: 0, opacity: 1 },
  transition: {
    duration: 0.8,
    ease: "easeInOut",
  },
};

export const confettiBurst = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] },
  transition: {
    duration: 0.6,
    ease: "easeOut",
  },
};

// === ERROR STATES === //
export const errorShake = {
  animate: { x: [-5, 5, -5, 5, 0] },
  transition: {
    duration: 0.3,
    repeat: 1,
    ease: "easeInOut",
  },
};

// === ADMIN DASHBOARD === //
export const cardSlideIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.4,
    delay: 0.1,
    ease: [0.4, 0, 0.2, 1],
  },
};

export const chartGrow = {
  initial: { scaleY: 0 },
  animate: { scaleY: 1 },
  transition: {
    duration: 0.6,
    ease: [0.4, 0, 0.2, 1],
  },
  transformOrigin: "bottom",
};

// === STICKY HEADER === //
export const stickyHeader = {
  initial: { y: -100 },
  animate: { y: 0 },
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
};

// === ACCESSIBILITY === //
export const reducedMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.01 },
};

// === UTILITY HOOKS === //
export const useReducedMotion = () => {
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  }
  return false;
};

export const getAnimationProps = (animation: any) => {
  const shouldReduce = useReducedMotion();
  return shouldReduce ? reducedMotion : animation;
};
