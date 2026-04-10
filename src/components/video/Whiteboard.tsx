// src/components/video/Whiteboard.tsx
import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

// Simple Color Picker Component (inline instead of separate file)
const ColorPicker: React.FC<{
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}> = ({ color, onChange, disabled }) => {
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#008000', '#800000', '#808080',
  ];

  return (
    <div className="flex items-center space-x-1">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          disabled={disabled}
          className={`
            w-6 h-6 rounded-full border-2 transition-all
            ${color === c ? 'border-blue-600 scale-110' : 'border-transparent'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
          `}
          style={{ backgroundColor: c }}
          title={c}
        />
      ))}
    </div>
  );
};

interface WhiteboardProps {
  classId: string;
  isInstructor?: boolean;
  initialData?: any;
  onSave?: (data: any) => void;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

interface DrawLine {
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
}

const Whiteboard: React.FC<WhiteboardProps> = ({
  classId,
  isInstructor = true,
  initialData,
  onSave,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen'); // Removed 'select' type
  const [drawHistory, setDrawHistory] = useState<DrawLine[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;

    // Load initial data
    if (initialData) {
      loadWhiteboardData(initialData);
    }
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth, tool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isInstructor) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const point = { x: offsetX / zoom - panOffset.x, y: offsetY / zoom - panOffset.y };
    
    setCurrentPath([point]);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isInstructor || !contextRef.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const point = { x: offsetX / zoom - panOffset.x, y: offsetY / zoom - panOffset.y };
    
    setCurrentPath(prev => [...prev, point]);

    // Draw line
    if (currentPath.length > 0) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(currentPath[currentPath.length - 1]?.x || point.x, currentPath[currentPath.length - 1]?.y || point.y);
      contextRef.current.lineTo(point.x, point.y);
      contextRef.current.stroke();
    }
  };

  const endDrawing = () => {
    if (!isInstructor || currentPath.length < 2) {
      setIsDrawing(false);
      setCurrentPath([]);
      return;
    }

    const line: DrawLine = {
      points: currentPath,
      color: tool === 'eraser' ? '#ffffff' : color,
      width: lineWidth,
      tool,
    };

    setDrawHistory(prev => [...prev, line]);
    setCurrentPath([]);
    setIsDrawing(false);

    // Broadcast to other participants (via WebSocket)
    broadcastDrawLine(line);
  };

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current || !isInstructor) return;

    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setDrawHistory([]);
    broadcastClear();
  };

  const undo = () => {
    if (!isInstructor || drawHistory.length === 0) return;

    const newHistory = drawHistory.slice(0, -1);
    setDrawHistory(newHistory);
    redrawCanvas(newHistory);
    broadcastUndo();
  };

  const redrawCanvas = (lines: DrawLine[]) => {
    if (!contextRef.current || !canvasRef.current) return;

    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    lines.forEach(line => {
      if (!contextRef.current) return;
      
      contextRef.current.strokeStyle = line.color;
      contextRef.current.lineWidth = line.width;
      contextRef.current.beginPath();

      line.points.forEach((point, index) => {
        const x = (point.x + panOffset.x) * zoom;
        const y = (point.y + panOffset.y) * zoom;
        
        if (index === 0) {
          contextRef.current?.moveTo(x, y);
        } else {
          contextRef.current?.lineTo(x, y);
        }
      });

      contextRef.current.stroke();
    });
  };

  const loadWhiteboardData = (data: any) => {
    // Load saved whiteboard data
    if (data.lines) {
      setDrawHistory(data.lines);
      redrawCanvas(data.lines);
    }
  };

  const saveWhiteboard = () => {
    if (!canvasRef.current) return;

    const data = {
      lines: drawHistory,
      timestamp: new Date().toISOString(),
    };

    onSave?.(data);

    // Download as image
    const link = document.createElement('a');
    link.download = `whiteboard-${classId}-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  // WebSocket broadcast functions (implement with your socket service)
  const broadcastDrawLine = (line: DrawLine) => {
    console.log('Broadcasting line:', line);
  };

  const broadcastClear = () => {
    console.log('Broadcasting clear');
  };

  const broadcastUndo = () => {
    console.log('Broadcasting undo');
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    redrawCanvas(drawHistory);
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.ctrlKey && e.button === 0)) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (!isPanning || !lastPanPoint) return;

    const dx = (e.clientX - lastPanPoint.x) / zoom;
    const dy = (e.clientY - lastPanPoint.y) / zoom;

    setPanOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    setLastPanPoint({ x: e.clientX, y: e.clientY });
    redrawCanvas(drawHistory);
  };

  const handlePanEnd = () => {
    setIsPanning(false);
    setLastPanPoint(null);
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {/* Drawing Tools */}
          <Button
            variant={tool === 'pen' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTool('pen')}
          >
            <span className="mr-2">✏️</span>
            Pen
          </Button>
          <Button
            variant={tool === 'eraser' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
          >
            <span className="mr-2">🧽</span>
            Eraser
          </Button>

          {/* Color Picker */}
          <ColorPicker
            color={color}
            onChange={setColor}
            disabled={tool === 'eraser'}
          />

          {/* Line Width */}
          <select
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
          >
            <option value={1}>Thin</option>
            <option value={2}>Medium</option>
            <option value={4}>Thick</option>
            <option value={6}>Extra Thick</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Controls */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
          >
            <span className="mr-1">🔍</span>+
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
          >
            <span className="mr-1">🔍</span>-
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetView}
          >
            <span className="mr-1">🔄</span>
            Reset
          </Button>

          <span className="text-sm text-gray-500">
            {Math.round(zoom * 100)}%
          </span>

          {/* Actions */}
          {isInstructor && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
              >
                <span className="mr-1">↩️</span>
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
              >
                <span className="mr-1">🗑️</span>
                Clear
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={saveWhiteboard}
              >
                <span className="mr-1">💾</span>
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
        <canvas
          ref={canvasRef}
          onMouseDown={isInstructor ? startDrawing : handlePanStart}
          onMouseMove={(e) => {
            if (isPanning) {
              handlePanMove(e);
            } else if (isDrawing) {
              draw(e);
            }
          }}
          onMouseUp={isDrawing ? endDrawing : handlePanEnd}
          onMouseLeave={isDrawing ? endDrawing : handlePanEnd}
          className="absolute inset-0"
          style={{
            cursor: isInstructor ? 'crosshair' : 'grab',
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: '0 0',
          }}
        />

        {/* Grid overlay (optional) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Coordinates display (optional) */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          Zoom: {Math.round(zoom * 100)}% | Pan: ({Math.round(panOffset.x)}, {Math.round(panOffset.y)})
        </div>
      </div>
    </Card>
  );
};

export default Whiteboard;