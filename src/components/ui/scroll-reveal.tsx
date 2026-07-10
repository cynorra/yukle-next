"use client"

import * as React from "react"
import { motion, useInView, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  duration?: number
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 30,
  duration = 0.5,
  ...props
}: ScrollRevealProps) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })

  const getInitialY = () => {
    if (direction === "up") return distance
    if (direction === "down") return -distance
    return 0
  }

  const getInitialX = () => {
    if (direction === "left") return distance
    if (direction === "right") return -distance
    return 0
  }

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: getInitialY(),
        x: getInitialX(),
        scale: direction === "none" ? 0.95 : 1,
        filter: "blur(5px)",
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : getInitialY(),
        x: isInView ? 0 : getInitialX(),
        scale: isInView ? 1 : (direction === "none" ? 0.95 : 1),
        filter: isInView ? "blur(0px)" : "blur(5px)",
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.25, 0, 1], // Custom ease-out
      }}
      className={cn("w-full h-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
