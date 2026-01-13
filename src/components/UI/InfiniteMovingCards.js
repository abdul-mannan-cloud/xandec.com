"use client";

import { cn } from "../../app/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);
  const [start, setStart] = useState(false);

  // Apply animation settings when component mounts or when direction/speed props change
  useEffect(() => {
    addAnimation();
  }, [direction, speed]); // Added direction and speed as dependencies

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      // Clear existing cloned nodes before adding new ones
      const originalChildren = Array.from(scrollerRef.current.children);
      const childrenCount = originalChildren.length;
      
      // Remove previously cloned elements if they exist
      while (scrollerRef.current.children.length > childrenCount && items.length < scrollerRef.current.children.length) {
        scrollerRef.current.removeChild(scrollerRef.current.lastChild);
      }
      
      // Clone original items for the infinite effect
      const scrollerContent = originalChildren.slice(0, items.length);
      
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      // Apply direction and speed settings
      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else if (direction === "right") {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-[100vw] overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}>
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-[1.2vw] py-[1.1vh]",
          start && "animate-scroll",
        //   pauseOnHover && "hover:[animation-play-state:paused]"
        )}>
        {items.map((item, idx) => (
          <li
            className="relative w-[20vw] max-w-full shrink-0 rounded-[0.5vw] border border-zinc-200  px-[2vw] py-[2vw] md:w-[25vw] md:max-h-[40vh] dark:border-zinc-700 hover:border-blue-200 transition-all duration-300 hover:shadow-blue-200 hover:shadow-md"
            key={`${item.name}-${idx}`}>
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"></div>
                <span
                    className="relative z-20 text-[0.9vw] leading-[1vw] font-normal text-neutral-800 dark:text-gray-100">
                    {item.quote}
                </span>
              <div className="relative z-20 mt-[2vh] flex flex-row items-center">
                <span className="flex flex-col gap-[0.5vh]">
                  <span
                    className="text-[0.9vw] leading-[1vw] font-normal text-neutral-500 dark:text-gray-400">
                    {item.name}
                  </span>
                  <span
                    className="text-[0.9vw] leading-[1vw] font-normal text-neutral-500 dark:text-gray-400">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};