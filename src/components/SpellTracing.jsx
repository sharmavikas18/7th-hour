import React, { useRef, useState, useEffect } from 'react';

const SpellTracing = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;

        // Draw target shape (a circle or runic symbol)
        ctx.beginPath();
        ctx.arc(150, 150, 80, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();
        ctx.strokeStyle = '#3b82f6'; // Reset for drawing
    }, []);

    const startDrawing = (e) => {
        setIsDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        setPoints([{ x: offsetX, y: offsetY }]);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        setPoints((prev) => [...prev, { x: offsetX, y: offsetY }]);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath(); // Reset path

        // Evaluate the trace (very basic evaluation: if user has drawn over 30 points)
        if (points.length > 30) {
            setTimeout(() => onComplete(true), 1000);
        } else {
            setTimeout(() => {
                // Clear and restart
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                ctx.arc(150, 150, 80, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.stroke();
                ctx.strokeStyle = '#3b82f6'; // Reset for drawing

                setPoints([]);
            }, 500);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto aspect-square border-2 border-slate-800 rounded bg-black/50 backdrop-blur-sm">
            <h3 className="text-xl font-heading text-stability mb-4 uppercase tracking-widest text-center">
                Trace the Anchor Rune
            </h3>
            <canvas
                ref={canvasRef}
                width={300}
                height={300}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="cursor-crosshair w-full aspect-square border border-slate-700/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] rounded-full"
            />
            <p className="text-xs text-slate-400 mt-4 font-mono capitalize text-center">
                Draw along the faint path. Connect your energy to reality.
            </p>
        </div>
    );
};

export default SpellTracing;
