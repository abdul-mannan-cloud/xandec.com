'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const canvasRef = useRef(null);
  const arenaRef = useRef(null);
  const intervalRef = useRef(null);
  const focusRef = useRef(null);
  const snakeRef = useRef([]);
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 });
  const gridRef = useRef({ cols: 0, rows: 0, cell: 14 });
  const foodRef = useRef({ x: 0, y: 0, label: 'JS', color: '#F4B400' });
  const statusRef = useRef('running');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('running');
  const [isFocused, setIsFocused] = useState(false);

  const foodPalette = [
    { label: 'JS', color: '#F4B400' },
    { label: 'TS', color: '#3178C6' },
    { label: 'PY', color: '#3776AB' },
    { label: 'GO', color: '#00ADD8' },
    { label: 'RB', color: '#CC342D' },
    { label: 'CPP', color: '#00599C' },
    { label: 'RS', color: '#DEA584' }
  ];

  const placeFood = () => {
    const { cols, rows } = gridRef.current;
    if (!cols || !rows) return;
    let x = 0;
    let y = 0;
    let safe = false;
    while (!safe) {
      x = Math.floor(Math.random() * cols);
      y = Math.floor(Math.random() * rows);
      safe = !snakeRef.current.some((seg) => seg.x === x && seg.y === y);
    }
    const choice = foodPalette[Math.floor(Math.random() * foodPalette.length)];
    foodRef.current = { x, y, label: choice.label, color: choice.color };
  };

  const updateStatus = (next) => {
    const value = typeof next === 'function' ? next(statusRef.current) : next;
    statusRef.current = value;
    setStatus(value);
  };

  const resetGame = () => {
    const { cols, rows } = gridRef.current;
    const startX = Math.max(2, Math.floor(cols / 4));
    const startY = Math.max(2, Math.floor(rows / 2));
    snakeRef.current = [
      { x: startX + 2, y: startY },
      { x: startX + 1, y: startY },
      { x: startX, y: startY }
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    setScore(0);
    updateStatus('running');
    placeFood();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { cell } = gridRef.current;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgb(7 27 45)';
    ctx.fillRect(0, 0, width, height);

    snakeRef.current.forEach((seg, index) => {
      ctx.fillStyle = index === 0 ? '#F7F4EF' : 'rgba(247, 244, 239, 0.55)';
      ctx.fillRect(seg.x * cell, seg.y * cell, cell - 1, cell - 1);
    });

    const food = foodRef.current;
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(
      food.x * cell + cell / 2,
      food.y * cell + cell / 2,
      Math.max(3, cell / 2.6),
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.fillStyle = '#0C0C0C';
    ctx.font = `${Math.max(6, Math.floor(cell * 0.45))}px var(--font-anton), sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(food.label, food.x * cell + cell / 2, food.y * cell + cell / 2);
  };

  const step = () => {
    if (statusRef.current !== 'running') return;
    dirRef.current = nextDirRef.current;
    const head = snakeRef.current[0];
    const next = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };
    const { cols, rows } = gridRef.current;

    if (next.x < 0) next.x = cols - 1;
    if (next.x >= cols) next.x = 0;
    if (next.y < 0) next.y = rows - 1;
    if (next.y >= rows) next.y = 0;
    if (snakeRef.current.some((seg) => seg.x === next.x && seg.y === next.y)) {
      updateStatus('over');
      return;
    }

    snakeRef.current.unshift(next);
    const food = foodRef.current;
    if (next.x === food.x && next.y === food.y) {
      setScore((prev) => prev + 1);
      placeFood();
    } else {
      snakeRef.current.pop();
    }

    draw();
  };

  useEffect(() => {
    const resize = () => {
      const arena = arenaRef.current;
      const canvas = canvasRef.current;
      if (!arena || !canvas) return;
      const width = Math.max(240, Math.floor(arena.clientWidth));
      const height = Math.max(220, Math.floor(arena.clientHeight));
      canvas.width = width;
      canvas.height = height;
      const cell = 14;
      gridRef.current = {
        cols: Math.floor(width / cell),
        rows: Math.floor(height / cell),
        cell
      };
      resetGame();
      draw();
    };

    resize();
    window.addEventListener('resize', resize);
    intervalRef.current = window.setInterval(step, 120);

    return () => {
      window.removeEventListener('resize', resize);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const handleKey = (event) => {
    if (!isFocused) return;
    if (event.key === ' ') {
      event.preventDefault();
      updateStatus((prev) => (prev === 'running' ? 'paused' : 'running'));
      return;
    }
    if (event.key === 'Enter' && statusRef.current === 'over') {
      resetGame();
      return;
    }

    const key = event.key.toLowerCase();
    const next =
      key === 'arrowup' || key === 'w'
        ? { x: 0, y: -1 }
        : key === 'arrowdown' || key === 's'
          ? { x: 0, y: 1 }
          : key === 'arrowleft' || key === 'a'
            ? { x: -1, y: 0 }
            : key === 'arrowright' || key === 'd'
              ? { x: 1, y: 0 }
              : null;

    if (!next) return;
    event.preventDefault();
    const current = dirRef.current;
    if (current.x + next.x === 0 && current.y + next.y === 0) return;
    nextDirRef.current = next;
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (nextToast) => {
    setToast(nextToast);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 4200);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Message failed to send.');
      }
      showToast({
        type: 'success',
        message: 'Thanks! Your message has been sent.'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      showToast({
        type: 'error',
        message: error?.message || 'Something went wrong. Try again soon.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  return (
    <footer id="footer" className="bg-secondary text-primary ">
      <div className="min-h-screen flex items-center justify-center">
        <div id="contact" className="min-h-screen w-[100vw]  rounded-none border-0 bg-primary text-secondary relative overflow-hidden sm:min-h-[99vh] sm:w-[98vw] sm:rounded-[70px]">
          <div className="flex h-full w-full flex-col px-6 pt-10 pb-2 sm:px-10 md:px-14 py-12 sm:py-16">
            <div className="sm:rounded-[20px] sm:bg-primary">
              <div
                ref={arenaRef}
                className="relative h-[140px] w-full overflow-hidden rounded-[20px] bg-primary sm:mt-0"
              >
                <div
                  ref={focusRef}
                  role="application"
                  tabIndex={0}
                  aria-label="Snake game. Click to focus, then use arrow keys to play. Press space to pause."
                  onClick={() => focusRef.current?.focus()}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKey}
                  className="h-full w-full outline-none"
                >
                  <canvas ref={canvasRef} className="h-full w-full" />
                </div>
                {!isFocused && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] text-secondary/70">
                    Click to focus
                  </div>
                )}
                {status !== 'running' && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/70 text-sm font-semibold uppercase tracking-[0.3em] text-secondary">
                    {status === 'paused' ? 'Paused' : 'Game Over'}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="mt-4 text-4xl sm:text-5xl font-semibold leading-tight">
                      Full-stack and AI software built for teams that move fast.
                    </h2>
                    <p className="mt-5 text-base sm:text-lg text-secondary/70 max-w-xl leading-relaxed">
                      We design, build, and scale modern products—from MVPs to enterprise platforms.
                      Explore our work or tell us what you want to ship next.
                    </p>
                  </div>
                  <form
                    onSubmit={handleSubmit}
                    action="/api/contact"
                    method="post"
                    className="relative block mt-5 lg:hidden rounded-[24px] sm:rounded-[32px] border border-primary/15 bg-secondary p-5 sm:p-8 text-primary"
                  >
                    <div
                      role="status"
                      aria-live="polite"
                      className={`pointer-events-none absolute right-6 top-6 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-500 ${
                        toast
                          ? 'translate-y-0 opacity-100'
                          : '-translate-y-2 opacity-0'
                      } ${
                        toast?.type === 'error'
                          ? 'border-red-500/30 bg-red-500/15 text-red-700'
                          : 'border-primary/20 bg-primary text-secondary'
                      }`}
                    >
                      {toast?.message || ''}
                    </div>
                      <div className="text-xs uppercase tracking-[0.3em] text-primary/60">
                        Contact Us
                      </div>
                      <h3 className="mt-3 text-2xl sm:text-3xl font-semibold">
                        Tell us about your product.
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-primary/70">
                        Share a brief and we will respond with scope, timeline, and next steps.
                      </p>

                      <div className="mt-6 space-y-4">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Name"
                          required
                          className="w-full rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email"
                          required
                          className="w-full rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Project details"
                          rows={4}
                          required
                          className="w-full rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm sm:text-base font-semibold tracking-wide text-secondary transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? 'Sending...' : 'Send request'}
                      </button>
                    </form>

                  <div className="mt-10">
                    <div className="text-xs uppercase tracking-[0.3em] text-secondary/60">
                      Navigate
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-base">
                      <Link href="#services" className="transition hover:text-secondary/80">
                        Services
                      </Link>
                      <Link href="#archives" className="transition hover:text-secondary/80">
                        Work
                      </Link>
                      <Link href="#process" className="transition hover:text-secondary/80">
                        Process
                      </Link>
                      <Link href="#contact" className="transition hover:text-secondary/80">
                        Contact
                      </Link>
                    </div>
                  </div>
                  <div className="items-center">
                    <div className="text-xs mt-5 lg:mt-0 uppercase tracking-[0.3em] text-secondary/60">
                      Contact
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
                      <span className="leading-relaxed">abdul.mannan@xandec.com</span>
                      <span className='leading-relaxed'>+92(317) 5504652</span>
                      <div className="flex items-center gap-3">
                        <a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Instagram"
                          className="text-secondary/70 transition hover:text-secondary"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                        <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="LinkedIn"
                          className="text-secondary/70 transition hover:text-secondary"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

              <form
                onSubmit={handleSubmit}
                action="/api/contact"
                method="post"
                className="relative hidden lg:block rounded-[24px] sm:rounded-[32px] border border-primary/15 bg-secondary p-5 sm:p-8 text-primary"
              >
                <div
                  role="status"
                  aria-live="polite"
                  className={`pointer-events-none absolute right-6 top-6 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-500 ${
                    toast
                      ? 'translate-y-0 opacity-100'
                      : '-translate-y-2 opacity-0'
                  } ${
                    toast?.type === 'error'
                      ? 'border-red-500/30 bg-red-500/15 text-red-700'
                      : 'border-primary/20 bg-primary text-secondary'
                  }`}
                >
                  {toast?.message || ''}
                </div>
                  <div className="text-xs uppercase tracking-[0.3em] text-primary/60">
                    Contact Us
                  </div>
                  <h3 className="mt-3 text-2xl sm:text-3xl font-semibold">
                    Tell us about your product.
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-primary/70">
                    Share a brief and we will respond with scope, timeline, and next steps.
                  </p>

                  <div className="mt-6 space-y-4">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      required
                      className="w-full rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      required
                      className="w-full rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Project details"
                      rows={4}
                      required
                      className="w-full rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm sm:text-base font-semibold tracking-wide text-secondary transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Sending...' : 'Send request'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-0 lg:mt-12 flex flex-col sm:flex-row items-center justify-center mx-5 sm:mx-10 lg:mx-16 gap-4 border-t border-secondary/20 py-2 text-center text-sm text-secondary/60">
            <span>© {new Date().getFullYear()} Xandec. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
