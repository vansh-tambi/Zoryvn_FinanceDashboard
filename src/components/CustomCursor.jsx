import { useEffect, useRef, useState } from 'react';

// Bigger interactive elements — buttons, nav, inputs
const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, [data-interactive]';
// Elements whose text/amount should show crosshair
const AMOUNT_SELECTORS = '.num-tabular, .font-mono, [class*="font-mono"]';
// The backdrop / bare page — NOT content
const BARE_BG = ['HTML', 'BODY', 'MAIN'];

const CustomCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const glowRef = useRef(null);
    const rafRef = useRef(null);

    const mouse = useRef({ x: -200, y: -200 });
    const ring = useRef({ x: -200, y: -200 });

    // 'default' = bare page | 'content' = any card/text/row | 'interactive' = button/link | 'amount' = numbers
    const [state, setState] = useState('default');

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
            const tagName = target.tagName;

            if (target.closest(AMOUNT_SELECTORS)) {
                setState('amount');
            } else if (target.closest(INTERACTIVE)) {
                setState('interactive');
            } else if (BARE_BG.includes(tagName)) {
                setState('default');
            } else {
                // Any div, span, p, section, svg etc. inside the app = content hover
                setState('content');
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

    // Ring size per state
    const ringSize = (state === 'interactive' || state === 'content') ? 50 : state === 'amount' ? 28 : 32;

    const dotGlowColor = state === 'default' ? 'none' : '0 0 10px #00D9A3, 0 0 20px rgba(0,217,163,0.4)';
    const dotColor = state === 'default' ? '#ffffff' : '#00D9A3';
    const dotSize = state === 'amount' ? '0px' : '7px';

    const ringBorder = (state === 'interactive' || state === 'content')
        ? '1.5px solid #00D9A3'
        : state === 'amount'
        ? '1.5px solid #00D9A3'
        : '1px solid rgba(0,217,163,0.4)';

    const ringBg = (state === 'interactive' || state === 'content')
        ? 'rgba(0,217,163,0.055)'
        : 'transparent';

    const ringGlow = (state === 'interactive' || state === 'content')
        ? '0 0 16px rgba(0,217,163,0.28), inset 0 0 8px rgba(0,217,163,0.07)'
        : 'none';

    return (
        <>
            {/* Radial teal glow — appears on content + interactive hover */}
            <div
                ref={glowRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 99990,
                    pointerEvents: 'none',
                    width: '90px',
                    height: '90px',
                    marginLeft: '-45px',
                    marginTop: '-45px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0,217,163,0.16) 0%, transparent 70%)',
                    opacity: (state === 'interactive' || state === 'content') ? 1 : 0,
                    transition: 'opacity 200ms ease-out',
                    filter: 'blur(8px)',
                }}
            />

            {/* Dot — instant, no lag */}
            <div
                ref={dotRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 99999,
                    pointerEvents: 'none',
                    width: dotSize,
                    height: dotSize,
                    borderRadius: '50%',
                    backgroundColor: dotColor,
                    marginLeft: state === 'amount' ? '0' : '-3.5px',
                    marginTop: state === 'amount' ? '0' : '-3.5px',
                    transition: 'width 120ms ease, height 120ms ease, background-color 150ms ease, box-shadow 200ms ease',
                    mixBlendMode: state === 'default' ? 'difference' : 'normal',
                    boxShadow: dotGlowColor,
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
                    borderRadius: state === 'amount' ? '6px' : '50%',
                    border: ringBorder,
                    backgroundColor: ringBg,
                    boxShadow: ringGlow,
                    transition: `
                        width 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
                        height 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
                        margin 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
                        border-radius 200ms ease-out,
                        background-color 200ms ease-out,
                        box-shadow 200ms ease-out,
                        border-color 200ms ease-out
                    `,
                    animation: 'none',
                }}
            >
                {/* Crosshair for amount state */}
                {state === 'amount' && (
                    <>
                        <div style={{ position: 'absolute', left: '50%', top: '15%', bottom: '15%', width: '1px', backgroundColor: '#00D9A3', transform: 'translateX(-50%)' }} />
                        <div style={{ position: 'absolute', top: '50%', left: '15%', right: '15%', height: '1px', backgroundColor: '#00D9A3', transform: 'translateY(-50%)' }} />
                    </>
                )}
            </div>


        </>
    );
};

export default CustomCursor;
