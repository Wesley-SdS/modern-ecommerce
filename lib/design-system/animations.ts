export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2 },
  },
  slideInLeft: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.3 },
  },
  slideInRight: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.3 },
  },
  bounce: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 0.2 },
  },
  shimmer: {
    initial: { backgroundPosition: "-1000px 0" },
    animate: { backgroundPosition: "1000px 0" },
    transition: { duration: 2, repeat: Infinity, ease: "linear" },
  },
}

export const transitions = {
  default: { duration: 0.2, ease: "easeInOut" },
  fast: { duration: 0.1, ease: "easeOut" },
  slow: { duration: 0.3, ease: "easeInOut" },
}

export const easings = {
  easeOut: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  easeIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
}

export const hoverEffects = {
  scale: { scale: 1.05, transition: transitions.default },
  lift: { y: -2, transition: transitions.default },
  glow: { boxShadow: "0 0 20px oklch(0.65 0.25 270 / 0.3)", transition: transitions.default },
}