// Framer Motion design tokens as specified in Technical Architecture §2.6
export const EASE = [0.22, 1, 0.36, 1]; // Smooth ease-out expo

export const DURATION = {
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const slideHorizontal = {
  enter: (direction = 1) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE },
  },
  exit: (direction = 1) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASE },
  }),
};
