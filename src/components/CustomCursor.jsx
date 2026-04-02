import { useEffect, useRef, useState } from 'react';

// Detect interactive elements WITHOUT relying on cursor-pointer class
const CLICKABLES = 'a, button, [role="button"], input, select, textarea, label, nav a, [data-interactive]';
const AMOUNT_SELECTORS = '.num-tabular, .font-mono, [class*="font-mono"]';

const CustomCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const glowRef = useRef(null);
    const rafRef = useRef(null);

    const mouse = useRef({ x: -200, y: -200 });
    const ring = useRef({ x: -200, y: -200 });

    const [ringState, setRingState] = useState('default'); // 'default' | 'hover' | 'amount'

    useEffect(() => {
        const onMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }
            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }

            const target = e.target;
            if (target.closest(AMOUNT_SELECTORS)) {
                setRingState('amount');
            } else if (target.closest(CLICKABLES)) {
                setRingState('hover');
            } else {
                setRingState('default');
            }
        };

        const lerp = (a, b, t) => a + (b - a) * t;

        const animate = () => {
            ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
            ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', onMouseMove);
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const ringSize = ringState === 'hover' ? 52 : ringState === 'amount' ? 28 : 32;

    return (
        <>
            {/* Teal glow blob — follows mouse instantly, only visible on hover */}
            <div
                ref={glowRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 99990,
                    pointerEvents: 'none',
                    width: '80px',
                    height: '80px',
                    marginLeft: '-40px',
                    marginTop: '-40px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0,217,163,0.18) 0%, transparent 70%)',
                    opacity: ringState === 'hover' ? 1 : 0,
                    transition: 'opacity 200ms ease-out',
                    filter: 'blur(6px)',
                }}
            />

            {/* White dot — instantaneous, no lag */}
            <div
                ref={dotRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 99999,
                    pointerEvents: 'none',
                    width: ringState === 'amount' ? '0px' : '7px',
                    height: ringState === 'amount' ? '0px' : '7px',
                    borderRadius: '50%',
                    backgroundColor: ringState === 'hover' ? '#00D9A3' : '#ffffff',
                    marginLeft: '-3.5px',
                    marginTop: '-3.5px',
                    transition: 'width 120ms ease, height 120ms ease, background-color 150ms ease',
                    mixBlendMode: ringState === 'hover' ? 'normal' : 'difference',
                    boxShadow: ringState === 'hover' ? '0 0 8px #00D9A3' : 'none',
                }}
            />

            {/* Lagged ring */}
            <div
                ref={ringRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 99998,
                    pointerEvents: 'none',
                    width: `${ringSize}px`,
                    height: `${ringSize}px`,
                    marginLeft: `-${ringSize / 2}px`,
                    marginTop: `-${ringSize / 2}px`,
                    borderRadius: ringState === 'amount' ? '6px' : '50%',
                    border: ringState === 'hover'
                        ? '1.5px solid #00D9A3'
                        : ringState === 'amount'
                        ? '1.5px solid #00D9A3'
                        : '1px solid rgba(0,217,163,0.6)',
                    backgroundColor: ringState === 'hover' ? 'rgba(0,217,163,0.06)' : 'transparent',
                    boxShadow: ringState === 'hover' ? '0 0 14px rgba(0,217,163,0.25), inset 0 0 8px rgba(0,217,163,0.08)' : 'none',
                    transition: `
                        width 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
                        height 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
                        margin 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
                        border-radius 200ms ease-out,
                        background-color 200ms ease-out,
                        box-shadow 200ms ease-out,
                        border-color 200ms ease-out
                    `,
                    // Spin animation for hover state via CSS class
                    animation: ringState === 'hover' ? 'cursor-ring-spin 2s linear infinite' : 'none',
                }}
            >
                {/* Crosshair for amount state */}
                {ringState === 'amount' && (
                    <>
                        <div style={{ position: 'absolute', left: '50%', top: '15%', bottom: '15%', width: '1px', backgroundColor: '#00D9A3', transform: 'translateX(-50%)' }} />
                        <div style={{ position: 'absolute', top: '50%', left: '15%', right: '15%', height: '1px', backgroundColor: '#00D9A3', transform: 'translateY(-50%)' }} />
                    </>
                )}
            </div>

            {/* Inject keyframe animation into the document */}
            <style>{`
                @keyframes cursor-ring-spin {
                    from { rotate: 0deg; }
                    to   { rotate: 360deg; }
                }
            `}</style>
        </>
    );
};

export default CustomCursor;
