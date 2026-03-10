import React, { useState, useRef } from 'react';
import './ResizablePanel.css';

interface ResizablePanelProps {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onResize?: (width: number) => void;
  children: React.ReactNode;
}

export default function ResizablePanel({
  initialWidth = 240,
  minWidth = 160,
  maxWidth = 400,
  onResize,
  children,
}: ResizablePanelProps) {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const delta = e.clientX - startXRef.current;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + delta));

      setWidth(newWidth);
      onResize?.(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth, onResize]);

  return (
    <div className="resizable-panel-wrapper">
      <div
        ref={panelRef}
        className="resizable-panel"
        style={{ width: `${width}px` }}
      >
        {children}
      </div>
      <div
        className={`resizable-divider ${isResizing ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
