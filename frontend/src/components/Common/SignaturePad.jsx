import React, { useRef, useState, useEffect } from 'react';

const SignaturePad = ({ onSign }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1f2933';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    setHasSigned(true);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (hasSigned) {
      const dataUrl = canvasRef.current.toDataURL();
      onSign(dataUrl);
    }
  };

  const getCoordinates = (e) => {
    if (e.touches && e.touches[0]) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    onSign(null);
  };

  return (
    <div className="signature-pad-container">
      <div className="signature-header">
        <span>Signature du Médecin</span>
        <button type="button" className="btn-clear" onClick={clear}>Effacer</button>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        className="signature-canvas"
      />
      <div className="signature-footer">
        <p>En signant, vous certifiez l'exactitude des informations cliniques consignées.</p>
      </div>

      <style>{`
        .signature-pad-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .signature-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .signature-canvas {
          width: 100%;
          height: 160px;
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          background: #ffffff;
          cursor: crosshair;
          touch-action: none;
          display: block;
        }
        .btn-clear {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-clear:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #dc2626;
        }
        .signature-footer p {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-style: italic;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default SignaturePad;
