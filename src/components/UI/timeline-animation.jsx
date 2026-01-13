"use client"

import { motion, useInView } from "framer-motion"
import { useMemo } from "react"

export function TimelineContent({
  children,
  animationNum,
  timelineRef,
  className,
  as = "div",
  customVariants,
  once = false,
  ...props
}) {
  const defaultSequenceVariants = useMemo(
    () => ({
      visible: (i) => ({
        filter: "blur(0px)",
        y: 0,
        opacity: 1,
        transition: {
          delay: i * 0.5,
          duration: 0.5,
        },
      }),
      hidden: {
        filter: "blur(20px)",
        y: 0,
        opacity: 0,
      },
    }),
    []
  )

  const sequenceVariants = customVariants || defaultSequenceVariants

  const isInView = useInView(timelineRef, { once })

  const MotionComponent = motion[as] || motion.div

  return (
    <MotionComponent
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={sequenceVariants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}
