"use client";

import React, { useRef, useState, type MouseEvent } from "react";

interface DragScrollProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

export const DragScroll = React.forwardRef<HTMLDivElement, DragScrollProps>(
  function DragScroll({ children, className = "", style = {}, onScroll }, ref) {
    const internalRef = useRef<HTMLDivElement>(null);
    const scrollRef = (ref as React.RefObject<HTMLDivElement>) ?? internalRef;

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e: MouseEvent) => {
      if (!scrollRef.current) return;
      setIsDragging(true);
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseLeave = () => setIsDragging(false);
    const onMouseUp = () => setIsDragging(false);

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollRef.current) return;
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
      <div
        ref={scrollRef}
        className={`relative cursor-grab overflow-x-auto select-none active:cursor-grabbing [&::-webkit-scrollbar]:hidden ${className}`}
        style={style}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onScroll={onScroll}
      >
        {children}
      </div>
    );
  },
);
