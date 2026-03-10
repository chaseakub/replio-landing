import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AlertTriangle, Bell, CheckCircle, ChevronRight, Star, Zap, Check, Loader2 } from 'lucide-react'
gsap.registerPlugin(ScrollTrigger)

const SUPABASE_URL = 'https://epjkxahwfhwnbilqhihy.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwamt4YWh3Zmh3bmJpbHFoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTEyNzUsImV4cCI6MjA4ODYyNzI3NX0.6tQTIChhln_Y-CFOxw0FDe7RTiSLhhwbfrj3GmKDf3o'

async function insertWaitlist({ email, name }) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ email, name, source: 'landing_page' }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error ${res.status}`)
  }
}

// ─── Countdown Timer ─────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  function getTimeLeft() {
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])
  return timeLeft
}

// ─── Founding Operators Banner ───────────────────────────────────────────────
function FoundersBanner() {
  // Countdown to April 1, 2026 (end of founding window)
  const { days, hours, minutes, seconds } = useCountdown('2026-04-01T00:00:00')
  const [spotsLeft] = useState(34)

  const digitBox = (val, label) => (
    <div className="flex flex-col items-center">
      <div className="font-mono-jb font-bold text-2xl md:text-3xl px-3 py-1.5 rounded-lg"
        style={{ background: '#E4002B15', color: '#fff', border: '1px solid #E4002B30', minWidth: 56, textAlign: 'center' }}>
        {String(val).padStart(2, '0')}
      </div>
      <span className="text-[9px] uppercase tracking-widest mt-1.5" style={{ color: C.muted }}>{label}</span>
    </div>
  )

  return (
    <div className="w-full py-3 px-4" style={{ background: 'linear-gradient(180deg, #1a050588 0%, transparent 100%)' }}>
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        {/* Badge + Spots */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest font-syne"
            style={{ background: '#E4002B', color: '#fff', animation: 'pulse 2s infinite' }}>
            Founding Operators
          </div>
          <div className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono-jb"
            style={{ background: '#E4002B15', color: C.red, border: '1px solid #E4002B40' }}>
            {spotsLeft}/50 left
          </div>
        </div>

        {/* Compact Countdown */}
        <div className="flex items-center gap-1.5">
          {[
            [days, 'd'], [hours, 'h'], [minutes, 'm'], [seconds, 's']
          ].map(([val, label], i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="font-mono-jb font-bold text-sm px-2 py-1 rounded"
                style={{ background: '#E4002B12', color: '#fff', border: '1px solid #E4002B25', minWidth: 36, textAlign: 'center' }}>
                {String(val).padStart(2, '0')}<span className="text-[9px] ml-0.5" style={{ color: C.muted }}>{label}</span>
              </div>
              {i < 3 && <span className="text-xs font-bold" style={{ color: '#E4002B40' }}>:</span>}
            </div>
          ))}
        </div>

        {/* Value props — hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          {['$99/mo per location', 'Locked in forever', 'Direct founder access'].map(t => (
            <span key={t} className="flex items-center gap-1 text-[10px]" style={{ color: C.gray }}>
              <Check size={10} style={{ color: '#22c55e' }} /> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Waitlist Form Component ─────────────────────────────────────────────────
function WaitlistForm({ variant = 'hero' }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrorMsg('')

    try {
      await insertWaitlist({
        email: email.trim().toLowerCase(),
        name: name.trim() || null,
      })
      setStatus('success')
    } catch (err) {
      console.error('Waitlist error:', err)
      if (err.message && err.message.includes('duplicate')) {
        setStatus('success')
        setErrorMsg("You're already on the list!")
      } else {
        setStatus('error')
        setErrorMsg(err?.message || 'Something went wrong. Try again.')
      }
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 justify-center py-3 px-6 rounded-xl"
        style={{ background: '#0a1f0a', border: '1px solid #22c55e40' }}>
        <Check size={20} style={{ color: '#22c55e' }} />
        <span className="font-body text-sm" style={{ color: '#22c55e' }}>
          {errorMsg || "You're in! We'll be in touch soon."}
        </span>
      </div>
    )
  }

  const isCompact = variant === 'nav'

  if (isCompact) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="px-3 py-2 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none"
          style={{ background: '#1F0808', border: '1px solid #E4002B30', width: 180 }}
        />
        <button type="submit" disabled={status === 'loading'} className="btn-replio flex items-center gap-1"
          style={{ padding: '8px 16px', fontSize: '0.7rem' }}>
          {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : 'Get Access'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl mx-auto">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none w-full sm:w-40"
        style={{ background: '#1F0808', border: '1px solid #E4002B30' }}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none w-full sm:flex-1"
        style={{ background: '#1F0808', border: '1px solid #E4002B30' }}
      />
      <button type="submit" disabled={status === 'loading'}
        className="btn-replio flex items-center gap-2 text-sm whitespace-nowrap">
        {status === 'loading' ? (
          <><Loader2 size={16} className="animate-spin" /> Joining...</>
        ) : (
          <>Join the Waitlist <ChevronRight size={16} /></>
        )}
      </button>
      {status === 'error' && (
        <p className="text-xs w-full text-center" style={{ color: C.red }}>{errorMsg}</p>
      )}
    </form>
  )
}

// ─── Brand Colors ───────────────────────────────────────────────────────────
const C = {
  bg: '#140606',
  red: '#E4002B',
  darkred: '#8C0016',
  card: '#1F0808',
  muted: '#A08080',
  gray: '#D4B8B8',
}

// ─── Platform Data ──────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    name: 'Google',
    share: '73%',
    color: '#4285F4',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    name: 'Yelp',
    share: '12%',
    color: '#D32323',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#D32323">
        <path d="M12.004 0C5.371 0 0 5.371 0 12.004 0 18.636 5.371 24 12.004 24 18.636 24 24 18.636 24 12.004 24 5.371 18.636 0 12.004 0zm-1.63 5.378c.344-.538 1.168-.532 1.5.013l2.23 3.86c.326.566-.06 1.276-.71 1.302l-4.46.175c-.656.026-1.08-.662-.77-1.24l2.21-4.11zm-4.43 7.248l3.87-2.22c.567-.325 1.274.065 1.296.715l.16 4.46c.023.655-.668 1.073-1.245.759L5.87 13.93c-.577-.314-.572-1.148.075-1.304zm4.8 7.944c-.07.627-.713.99-1.27.717l-3.97-1.98c-.556-.277-.641-1.04-.162-1.43l3.5-2.88c.48-.394 1.18-.16 1.33.445l.572 5.128zm5.834-.327l-3.5-2.88c-.48-.394-.438-1.12.077-1.456l3.855-2.147c.516-.287 1.147.037 1.215.62l.498 4.526c.068.584-.562 1.022-1.145.737zm1.93-7.19l-3.974 1.97c-.567.28-1.194-.127-1.19-.757l.022-4.46c.004-.63.64-1.01 1.206-.736l3.962 1.88c.566.268.618 1.052.075 1.404z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    share: '8%',
    color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'DoorDash',
    share: '4%',
    color: '#FF3008',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#FF3008">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248H11.5c-2.071 0-3.75 1.679-3.75 3.75S9.429 15.748 11.5 15.748h1.19v-2.25H11.5c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5h6.062v-2.25z"/>
      </svg>
    ),
  },
  {
    name: 'TripAdvisor',
    share: '3%',
    color: '#34E0A1',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#34E0A1">
        <path d="M12.006 4.295c-2.67 0-5.338.67-7.65 2.014H0l1.242 1.353A5.618 5.618 0 000 11.277a5.63 5.63 0 005.627 5.627 5.602 5.602 0 003.928-1.603l2.451 2.669 2.443-2.661a5.605 5.605 0 003.929 1.595A5.63 5.63 0 0024 11.277a5.616 5.616 0 00-1.242-3.614L24 6.31h-4.35a15.427 15.427 0 00-7.644-2.015zM5.627 8.158a3.12 3.12 0 110 6.24 3.12 3.12 0 010-6.24zm12.746 0a3.12 3.12 0 110 6.24 3.12 3.12 0 010-6.24zM5.627 9.78a1.498 1.498 0 100 2.995 1.498 1.498 0 000-2.995zm12.746 0a1.498 1.498 0 100 2.995 1.498 1.498 0 000-2.995z"/>
      </svg>
    ),
  },
]

// ─── Stats Data ──────────────────────────────────────────────────────────────
const STATS = [
  { value: 97, suffix: '%', label: 'of guests read reviews before visiting', prefix: '' },
  { value: 9, suffix: '%', label: 'revenue loss per 1-star drop', prefix: 'up to ' },
  { value: 72, suffix: 'hrs', label: 'average operator response time', prefix: '' },
  { value: 8000, suffix: '', label: 'additional revenue per Yelp star gained', prefix: '$', isCurrency: true },
]

// ─── HEARD Framework ─────────────────────────────────────────────────────────
const HEARD = [
  { letter: 'H', word: 'Hear', desc: 'Acknowledge the guest\'s experience without interruption.' },
  { letter: 'E', word: 'Empathize', desc: 'Show genuine understanding of their frustration.' },
  { letter: 'A', word: 'Apologize', desc: 'Offer a sincere, specific apology for the failure.' },
  { letter: 'R', word: 'Resolve', desc: 'Present a clear path to making it right.' },
  { letter: 'D', word: 'Diagnose', desc: 'Identify and fix the root cause internally.' },
]

// ─── Mock Review for AI Demo ──────────────────────────────────────────────────
const MOCK_REVIEW = {
  platform: 'Google',
  stars: 2,
  author: 'Marcus T.',
  time: '3 hours ago',
  text: 'Drive-thru wait was over 15 minutes and my order was wrong. The fries were cold and no one apologized. Probably won\'t be back.',
  response: "Marcus, thank you for taking the time to share this — I\'m truly sorry we let you down. A 15-minute wait, a wrong order, and cold fries is not the experience we\'re proud of, and the lack of an apology from our team makes that even worse. I\'d love the chance to make this right. Please reach out directly so I can personally ensure your next visit exceeds expectations. — Chase, Operating Partner",
}

// ─── Noise SVG ──────────────────────────────────────────────────────────────
function NoiseOverlay() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9990, opacity: 0.035 }}>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  )
}

// ─── Custom Cursor ───────────────────────────────────────────────────────────
function Cursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    const moveCursor = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' })
    }
    const expandCursor = () => cursor.classList.add('expanded')
    const shrinkCursor = () => cursor.classList.remove('expanded')

    window.addEventListener('mousemove', moveCursor)
    const interactables = document.querySelectorAll('button, a, .platform-card')
    interactables.forEach(el => {
      el.addEventListener('mouseenter', expandCursor)
      el.addEventListener('mouseleave', shrinkCursor)
    })
    return () => {
      window.removeEventListener('mousemove', moveCursor)
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', expandCursor)
        el.removeEventListener('mouseleave', shrinkCursor)
      })
    }
  }, [])

  return <div id="cursor" ref={cursorRef} />
}

// ─── Scroll Progress Bar ─────────────────────────────────────────────────────
function ScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById('scroll-progress')
    if (!bar) return
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      bar.style.width = docHeight > 0 ? (scrollTop / docHeight) * 100 + '%' : '0%'
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <div id="scroll-progress" />
}

// ─── Animated Stat Counter ───────────────────────────────────────────────────
function StatCounter({ value, suffix, label, prefix, isCurrency }) {
  const ref = useRef(null)
  const numRef = useRef(null)

  useEffect(() => {
    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: value,
      duration: 2.2,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        if (!numRef.current) return
        const v = Math.round(obj.val)
        numRef.current.textContent = isCurrency
          ? prefix + v.toLocaleString() + suffix
          : prefix + v + suffix
      },
    })
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      once: true,
      onEnter: () => tween.play(),
    })
    return () => { tween.kill(); trigger.kill() }
  }, [value, suffix, prefix, isCurrency])

  return (
    <div ref={ref} className="text-center p-6">
      <div ref={numRef} className="stat-number text-5xl md:text-6xl font-bold mb-3" style={{ color: C.red }}>
        {prefix}0{suffix}
      </div>
      <div className="text-sm uppercase tracking-widest" style={{ color: C.muted, fontFamily: 'DM Sans' }}>
        {label}
      </div>
    </div>
  )
}

// ─── Hero Section ────────────────────────────────────────────────────────────
function Hero({ sectionRef }) {
  const titleRef = useRef(null)
  const taglineRef = useRef(null)
  const subTagRef = useRef(null)
  const ctaRef = useRef(null)
  const platformsRef = useRef(null)
  const redLineRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(redLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, transformOrigin: 'left center' })
        .fromTo(titleRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.6')
        .fromTo(taglineRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
        .fromTo(subTagRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
        .fromTo(ctaRef.current, { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.7 }, '-=0.2')
        .fromTo(
          platformsRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          '-=0.3'
        )

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=50%',
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          gsap.to(sectionRef.current, {
            opacity: 1 - self.progress * 2,
            scale: 1 - self.progress * 0.05,
            duration: 0.1,
          })
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section
      ref={sectionRef}
      style={{ background: C.bg, minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}
      className="flex flex-col items-center px-6"
    >
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70vw', height: '70vw', maxWidth: 800,
        background: `radial-gradient(ellipse at center, rgba(228,0,43,0.07) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div ref={redLineRef}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: C.red, transformOrigin: 'left' }} />

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 w-full relative z-20">
        <span className="font-syne font-bold text-sm tracking-widest uppercase" style={{ color: C.red }}>
          Replio
        </span>
        <WaitlistForm variant="nav" />
      </nav>

      {/* Founders Banner */}
      <div className="w-full relative z-20">
        <FoundersBanner />
      </div>

      {/* Hero Content — fills remaining space, centered */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="text-center max-w-5xl w-full relative z-10">
          <div
            ref={titleRef}
            className="font-syne font-extrabold leading-none tracking-tight mb-4 select-none"
            style={{ fontSize: 'clamp(2.5rem, 11vw, 8rem)', color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 0.9 }}
          >
            REPLIO
          </div>

        <div ref={taglineRef} className="mb-4">
          <p className="font-syne font-bold text-xl md:text-3xl tracking-tight" style={{ color: C.gray }}>
            One dashboard.{' '}
            <span style={{ color: C.red }}>Every platform.</span>{' '}
            Zero missed guests.
          </p>
        </div>

        <div ref={subTagRef} className="mb-10">
          <p className="font-playfair italic text-base md:text-lg" style={{ color: C.muted }}>
            Built by an Operating Partner. For operators.
          </p>
        </div>

        <div ref={ctaRef} className="flex flex-col items-center justify-center gap-3 mb-10">
          <WaitlistForm variant="hero" />
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['CK', 'SM', 'RJ', 'AL', 'DT'].map((initials, i) => (
                <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold border-2"
                  style={{ background: `hsl(${i * 40 + 340}, 70%, ${25 + i * 5}%)`, color: '#fff', borderColor: C.bg, zIndex: 5 - i }}>
                  {initials}
                </div>
              ))}
            </div>
            <span className="font-mono-jb text-[11px]" style={{ color: C.muted }}>
              <span style={{ color: '#22c55e' }}>16 operators</span> joined this week
            </span>
          </div>
          <span className="font-mono-jb text-[10px]" style={{ color: C.muted, opacity: 0.6 }}>No credit card. No commitment.</span>
        </div>

        <div ref={platformsRef} className="flex items-center justify-center gap-3 flex-wrap">
          {PLATFORMS.map((p) => (
            <div key={p.name} className="platform-card flex items-center gap-2 px-4 py-2 rounded-sm"
              style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: C.muted }}>
              {p.icon}
              <span>{p.name}</span>
            </div>
          ))}
        </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono-jb text-xs" style={{ color: C.muted }}>scroll</span>
        <div style={{ width: 1, height: 32, background: C.red }} />
      </div>
    </section>
  )
}

// ─── Problem Section ─────────────────────────────────────────────────────────
function Problem() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const painRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 80%' }
      })
      gsap.fromTo(painRef.current.children, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: painRef.current, start: 'top 75%' }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ background: C.bg, paddingTop: '12vh', paddingBottom: '12vh' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width: 32, height: 2, background: C.red }} />
          <span className="font-mono-jb text-xs uppercase tracking-widest" style={{ color: C.red }}>The Problem</span>
        </div>

        <div ref={headingRef}>
          <h2 className="font-syne font-extrabold leading-none mb-4"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', color: '#fff', letterSpacing: '-0.02em' }}>
            You're finding out about problems
            <span style={{ color: C.red }}> from a 1-star review.</span>
          </h2>
          <p className="font-body text-lg mb-12 max-w-2xl" style={{ color: C.muted }}>
            Right now, your guests are leaving reviews across 5 different platforms. You're juggling 7 apps,
            missing urgent complaints, and responding 3 days late — if at all. That silence is costing you revenue.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-16"
          style={{ border: `1px solid rgba(228,0,43,0.12)`, borderRadius: 2 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              borderRight: i < STATS.length - 1 ? `1px solid rgba(228,0,43,0.12)` : 'none',
              borderBottom: i < 2 ? `1px solid rgba(228,0,43,0.12)` : 'none'
            }}>
              <StatCounter {...s} />
            </div>
          ))}
        </div>

        <div ref={painRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <AlertTriangle size={20} style={{ color: C.red }} />, text: 'You\'re switching between Google, Yelp, Facebook, DoorDash, and TripAdvisor — every single day.' },
            { icon: <Bell size={20} style={{ color: C.red }} />, text: 'An angry guest left 3 days ago. You just found out. Too late to fix it.' },
            { icon: <Star size={20} style={{ color: C.red }} />, text: 'Generic copy-paste responses signal you don\'t care. They make it worse.' },
          ].map((p, i) => (
            <div key={i} className="platform-card p-5 rounded-sm flex gap-3">
              <div className="mt-1 flex-shrink-0">{p.icon}</div>
              <p className="font-body text-sm leading-relaxed" style={{ color: C.gray }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pillars (Stacking Cinematic Scroll) ─────────────────────────────────────
function Pillars() {
  const containerRef = useRef(null)
  const stickyRef = useRef(null)
  const [activeCard, setActiveCard] = useState(0)
  const [typedText, setTypedText] = useState('')

  useEffect(() => {
    if (activeCard !== 1) return
    setTypedText('')
    let i = 0
    const text = MOCK_REVIEW.response
    const interval = setInterval(() => {
      if (i <= text.length) { setTypedText(text.slice(0, i)); i++ }
      else clearInterval(interval)
    }, 22)
    return () => clearInterval(interval)
  }, [activeCard])

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        pin: stickyRef.current,
        pinSpacing: true,
        onUpdate: (self) => {
          const prog = self.progress
          if (prog < 0.33) setActiveCard(0)
          else if (prog < 0.66) setActiveCard(1)
          else setActiveCard(2)
        },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const cards = [
    {
      number: '01', label: 'Universal Dashboard',
      headline: 'Stop switching between 7 apps. One place. Every platform.',
      body: 'Google, Yelp, Facebook, DoorDash, and TripAdvisor — all your reviews, all your responses, all your analytics in a single operator-grade dashboard. Your command center.',
      visual: <DashboardMock />,
    },
    {
      number: '02', label: 'AI Response Engine',
      headline: 'Sounds like you wrote it. Because it understands how you think.',
      body: 'Our HEARD-based AI reads every review and drafts a personalized, human response instantly. You approve it in one click. It handles the words. You handle the operation.',
      visual: <AIResponseMock typedText={typedText} />,
    },
    {
      number: '03', label: 'Zero Missed Guests',
      headline: 'Never find out about a critical problem from a 1-star review again.',
      body: 'Urgent alerts hit your phone the moment a serious issue surfaces. Your full digest takes under 2 minutes. You know what\'s happening before it costs you.',
      visual: <HEARDMock />,
    },
  ]

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div ref={stickyRef} style={{ background: C.bg, height: '100dvh', overflow: 'hidden' }}
        className="flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="flex items-center gap-3 mb-8">
            <div style={{ width: 32, height: 2, background: C.red }} />
            <span className="font-mono-jb text-xs uppercase tracking-widest" style={{ color: C.red }}>The Solution</span>
            <div className="ml-auto flex gap-2">
              {cards.map((_, i) => (
                <div key={i} style={{
                  width: i === activeCard ? 24 : 8, height: 8, borderRadius: 4,
                  background: i === activeCard ? C.red : 'rgba(228,0,43,0.2)',
                  transition: 'all 0.4s ease'
                }} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div style={{ position: 'relative', minHeight: 280 }}>
              {cards.map((card, i) => (
                <div key={i} style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  opacity: i === activeCard ? 1 : 0,
                  transform: i === activeCard ? 'translateY(0)' : i < activeCard ? 'translateY(-20px)' : 'translateY(20px)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: i === activeCard ? 'auto' : 'none',
                }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono-jb text-xs font-bold" style={{ color: C.red }}>{card.number}</span>
                    <span className="font-mono-jb text-xs uppercase tracking-widest" style={{ color: C.muted }}>{card.label}</span>
                  </div>
                  <h3 className="font-syne font-extrabold leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.02em' }}>
                    {card.headline}
                  </h3>
                  <p className="font-body text-base leading-relaxed" style={{ color: C.muted, maxWidth: 480 }}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Visual */}
            <div style={{ position: 'relative', height: 380 }}>
              {cards.map((card, i) => (
                <div key={i} style={{
                  position: 'absolute', inset: 0,
                  opacity: i === activeCard ? 1 : 0,
                  transform: i === activeCard ? 'scale(1)' : 'scale(0.96)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: i === activeCard ? 'auto' : 'none',
                }}>
                  {card.visual}
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 32, right: 32 }}>
            <span className="font-mono-jb text-xs" style={{ color: C.muted }}>
              {activeCard + 1} / {cards.length} — keep scrolling
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard Mock ───────────────────────────────────────────────────────────
function DashboardMock() {
  return (
    <div className="rounded-sm overflow-hidden h-full" style={{
      background: C.card, border: `1px solid rgba(228,0,43,0.15)`,
      fontFamily: 'JetBrains Mono', fontSize: '0.7rem'
    }}>
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid rgba(228,0,43,0.1)`, background: '#0f0404' }}>
        <span style={{ color: C.red, fontWeight: 700 }}>REPLIO — Review Dashboard</span>
        <div className="flex gap-1">
          {['#ff5f57','#ffbd2e','#28ca41'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
      </div>
      <div className="flex gap-2 px-4 py-3" style={{ borderBottom: `1px solid rgba(228,0,43,0.07)` }}>
        {PLATFORMS.map(p => (
          <div key={p.name} style={{ padding: '2px 8px', borderRadius: 2, background: 'rgba(228,0,43,0.08)', color: C.muted, fontSize: '0.65rem' }}>
            {p.name}
          </div>
        ))}
      </div>
      {[
        { platform: 'Google', stars: 5, text: 'Best drive-thru in Houston. Team is incredible.', time: '2m ago', initials: 'SJ' },
        { platform: 'Yelp', stars: 2, text: 'Long wait, order was wrong. Very disappointed.', time: '14m ago', initials: 'MR', urgent: true },
        { platform: 'DoorDash', stars: 4, text: 'Food was great, delivery took a bit longer.', time: '1h ago', initials: 'TK' },
        { platform: 'Facebook', stars: 5, text: 'Always consistent. Love this location.', time: '2h ago', initials: 'LB' },
      ].map((r, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3"
          style={{ borderBottom: `1px solid rgba(255,255,255,0.03)`, background: r.urgent ? 'rgba(228,0,43,0.05)' : 'transparent' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: r.urgent ? C.darkred : '#2A0808',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6rem', color: C.gray
          }}>{r.initials}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: C.gray, fontSize: '0.65rem' }}>{r.platform}</span>
              <span style={{ color: '#F59E0B', fontSize: '0.6rem' }}>{'★'.repeat(r.stars)}</span>
              {r.urgent && <span style={{ color: C.red, fontSize: '0.6rem' }}>⚠ URGENT</span>}
              <span style={{ color: C.muted, marginLeft: 'auto', fontSize: '0.6rem' }}>{r.time}</span>
            </div>
            <p style={{ color: C.muted, fontSize: '0.65rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── AI Response Mock ─────────────────────────────────────────────────────────
function AIResponseMock({ typedText }) {
  const stars = MOCK_REVIEW.stars
  return (
    <div className="h-full flex flex-col gap-3" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem' }}>
      <div className="rounded-sm p-4 flex-shrink-0" style={{ background: C.card, border: `1px solid rgba(228,0,43,0.15)` }}>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color: '#F59E0B' }}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
          <span style={{ color: C.gray }}>{MOCK_REVIEW.author}</span>
          <span style={{ color: C.muted, marginLeft: 'auto' }}>{MOCK_REVIEW.time}</span>
        </div>
        <p style={{ color: C.muted, lineHeight: 1.6 }}>{MOCK_REVIEW.text}</p>
      </div>
      <div className="rounded-sm p-4 flex-1" style={{ background: '#0f0404', border: `1px solid rgba(228,0,43,0.3)` }}>
        <div className="flex items-center gap-2 mb-3">
          <Zap size={12} style={{ color: C.red }} />
          <span style={{ color: C.red, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            AI Response — HEARD Framework
          </span>
        </div>
        <p style={{ color: C.gray, lineHeight: 1.7 }}>
          {typedText}
          <span className="cursor-blink" style={{ color: C.red }}>|</span>
        </p>
        {typedText.length === MOCK_REVIEW.response.length && (
          <div className="mt-4 flex gap-2">
            <button className="btn-replio" style={{ padding: '8px 20px', fontSize: '0.7rem' }}>
              ✓ Approve &amp; Send
            </button>
            <button style={{
              padding: '8px 16px', fontSize: '0.7rem', background: 'transparent',
              border: `1px solid rgba(228,0,43,0.3)`, color: C.muted,
              fontFamily: 'Syne', cursor: 'none'
            }}>Edit</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── HEARD Mock ───────────────────────────────────────────────────────────────
function HEARDMock() {
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="rounded-sm px-4 py-3 flex items-center gap-3 flex-shrink-0" style={{
        background: 'rgba(228,0,43,0.1)', border: `1px solid rgba(228,0,43,0.4)`,
        fontFamily: 'JetBrains Mono', fontSize: '0.72rem'
      }}>
        <AlertTriangle size={16} style={{ color: C.red, flexShrink: 0 }} />
        <div>
          <span style={{ color: C.red, fontWeight: 700 }}>URGENT — 1-Star Alert</span>
          <span style={{ color: C.muted }}> · Google · 3 minutes ago</span>
        </div>
        <Bell size={14} style={{ color: C.red, marginLeft: 'auto' }} />
      </div>
      <div className="flex-1 rounded-sm p-4" style={{ background: C.card, border: `1px solid rgba(228,0,43,0.12)`, fontFamily: 'JetBrains Mono', fontSize: '0.7rem' }}>
        <div className="flex items-center gap-2 mb-4">
          <span style={{ color: C.red, fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            HEARD Response Framework
          </span>
        </div>
        {HEARD.map((item, i) => (
          <div key={i} className="flex gap-3 mb-3 last:mb-0">
            <div style={{
              width: 28, height: 28, flexShrink: 0, borderRadius: 2,
              background: 'rgba(228,0,43,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.red, fontWeight: 700, fontSize: '0.75rem'
            }}>{item.letter}</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, marginBottom: 2 }}>{item.word}</div>
              <div style={{ color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-sm px-4 py-3 flex items-center gap-3 flex-shrink-0" style={{
        background: '#0f0404', border: `1px solid rgba(255,255,255,0.05)`,
        fontFamily: 'JetBrains Mono', fontSize: '0.68rem'
      }}>
        <CheckCircle size={14} style={{ color: '#28ca41' }} />
        <span style={{ color: C.muted }}>Daily digest delivered. 12 reviews. 2 urgent resolved. Under 2 min.</span>
      </div>
    </div>
  )
}

// ─── Social Proof ─────────────────────────────────────────────────────────────
function SocialProof() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current.querySelectorAll('.proof-item'), { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ background: C.bg, paddingTop: '10vh', paddingBottom: '10vh' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-12">
          <div style={{ width: 32, height: 2, background: C.red }} />
          <span className="font-mono-jb text-xs uppercase tracking-widest" style={{ color: C.red }}>
            Built by operators. Proven by data.
          </span>
        </div>

        <div className="proof-item rounded-sm p-8 mb-8" style={{ background: C.card, border: `1px solid rgba(228,0,43,0.15)`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 24, left: 24, fontFamily: 'Playfair Display', fontSize: '5rem', color: C.darkred, lineHeight: 0.5, opacity: 0.4 }}>"</div>
          <p className="font-playfair italic text-xl md:text-2xl leading-relaxed mb-6" style={{ color: C.gray, maxWidth: 700, paddingTop: 24 }}>
            I built Replio because I was the operator spending 45 minutes a day across five apps,
            responding to reviews three days late and missing the ones that mattered most.
            No one had built this for QSR operators — so I did.
          </p>
          <div className="flex items-center gap-4">
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.darkred}, ${C.red})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne', fontWeight: 700, color: '#fff', fontSize: '1rem'
            }}>CK</div>
            <div>
              <div className="font-syne font-bold" style={{ color: '#fff' }}>Chase Kubala</div>
              <div className="font-mono-jb text-xs" style={{ color: C.muted }}>Multi-Unit Chick-fil-A Operating Partner · Houston, TX</div>
            </div>
          </div>
        </div>

        <div className="proof-item grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-sm p-6" style={{ background: C.card, border: `1px solid rgba(228,0,43,0.1)` }}>
            <div className="font-mono-jb text-xs uppercase tracking-widest mb-4" style={{ color: C.red }}>Where Your Reviews Live</div>
            {PLATFORMS.map((p) => (
              <div key={p.name} className="flex items-center gap-3 mb-3 last:mb-0">
                <div className="flex-shrink-0">{p.icon}</div>
                <div className="flex-1" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 2, height: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${C.red}, ${C.darkred})`, width: p.share }} />
                </div>
                <span className="font-mono-jb text-xs" style={{ color: C.muted, minWidth: 32, textAlign: 'right' }}>{p.share}</span>
              </div>
            ))}
          </div>

          <div className="rounded-sm p-6 flex flex-col justify-between" style={{ background: C.card, border: `1px solid rgba(228,0,43,0.1)` }}>
            <div className="font-mono-jb text-xs uppercase tracking-widest mb-4" style={{ color: C.red }}>What's at Stake</div>
            {[
              { label: 'Revenue loss per 1-star drop', value: 'up to 9%' },
              { label: 'Revenue gain per Yelp star', value: '$8,000+' },
              { label: 'Guests who read reviews first', value: '97%' },
              { label: 'Avg operator response time', value: '72 hours' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2"
                style={{ borderBottom: i < 3 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                <span className="font-body text-sm" style={{ color: C.muted }}>{item.label}</span>
                <span className="font-mono-jb text-sm font-bold"
                  style={{ color: (item.value.includes('+') || item.value.includes('97')) ? '#28ca41' : C.red }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  const sectionRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(innerRef.current, { y: 80, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ background: C.bg, paddingTop: '10vh', paddingBottom: '14vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '80vw', height: '60vh',
        background: `radial-gradient(ellipse at bottom, rgba(228,0,43,0.12) 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10" ref={innerRef}>
        <div className="red-divider mb-16" />

        <div className="font-mono-jb text-xs uppercase tracking-widest mb-4" style={{ color: C.red }}>
          Founding Operators Program
        </div>

        <h2 className="font-syne font-extrabold leading-none mb-6"
          style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', color: '#fff', letterSpacing: '-0.03em' }}>
          REPLIO
        </h2>

        <p className="font-playfair italic text-xl md:text-2xl mb-4" style={{ color: C.gray }}>
          One dashboard. Every platform. Zero missed guests.
        </p>

        <p className="font-body text-base mb-6 max-w-xl mx-auto" style={{ color: C.muted }}>
          Join a founding group of serious QSR operators getting early access.
          Built by someone who ran the same operation you do.
        </p>

        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="font-mono-jb text-3xl font-bold" style={{ color: '#22c55e' }}>$99</span>
          <span className="font-mono-jb text-lg" style={{ color: C.muted, textDecoration: 'line-through' }}>$149</span>
          <span className="font-body text-sm" style={{ color: C.muted }}>/mo per location — locked in forever</span>
        </div>

        <WaitlistForm variant="hero" />

        <div className="mt-6 font-mono-jb text-xs" style={{ color: C.muted }}>
          ReplioHQ.com · Built by operators. For operators.
        </div>

        <div className="red-divider mt-16" />

        <div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
          {PLATFORMS.map(p => (
            <div key={p.name} style={{ opacity: 0.4 }}>{p.icon}</div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Social Proof Toast Notifications ────────────────────────────────────────
const FAKE_SIGNUPS = [
  { name: 'Sarah', city: 'Dallas, TX', time: '2 min ago' },
  { name: 'Marcus', city: 'Atlanta, GA', time: '5 min ago' },
  { name: 'David', city: 'Phoenix, AZ', time: '8 min ago' },
  { name: 'Jennifer', city: 'Miami, FL', time: '12 min ago' },
  { name: 'Ryan', city: 'Charlotte, NC', time: '15 min ago' },
  { name: 'Amanda', city: 'Nashville, TN', time: '19 min ago' },
  { name: 'Kevin', city: 'Denver, CO', time: '23 min ago' },
  { name: 'Nicole', city: 'Austin, TX', time: '28 min ago' },
  { name: 'Brian', city: 'Chicago, IL', time: '34 min ago' },
  { name: 'Ashley', city: 'Tampa, FL', time: '41 min ago' },
]

function SocialProofToasts() {
  const [current, setCurrent] = useState(null)
  const [visible, setVisible] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    // Show first toast after 6 seconds, then every 18 seconds
    const showToast = () => {
      const signup = FAKE_SIGNUPS[indexRef.current % FAKE_SIGNUPS.length]
      setCurrent(signup)
      setVisible(true)
      indexRef.current++
      setTimeout(() => setVisible(false), 4000)
    }

    const initialTimeout = setTimeout(showToast, 6000)
    const interval = setInterval(showToast, 18000)
    return () => { clearTimeout(initialTimeout); clearInterval(interval) }
  }, [])

  if (!current) return null

  return (
    <div
      className="fixed bottom-24 left-5 z-50 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: 'none',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: '#1a0a0a', border: '1px solid #E4002B25', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: '#E4002B20', color: C.red }}>
          {current.name[0]}
        </div>
        <div>
          <div className="text-xs font-semibold text-white">{current.name} from {current.city}</div>
          <div className="text-[10px]" style={{ color: C.muted }}>joined the waitlist · {current.time}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Sticky Bottom CTA Bar ───────────────────────────────────────────────────
function StickyBottomBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-400"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        background: 'linear-gradient(180deg, transparent 0%, #0a0303 30%, #0a0303 100%)',
        paddingTop: 20,
      }}
    >
      <div className="max-w-3xl mx-auto px-4 pb-4 flex items-center justify-between gap-4">
        <div className="hidden sm:block">
          <div className="text-sm font-syne font-bold text-white">Founding Operators — <span style={{ color: '#22c55e' }}>$99/mo</span> <span style={{ color: C.muted, fontWeight: 400, fontSize: '0.7rem', textDecoration: 'line-through' }}>$149/mo</span></div>
          <div className="text-[10px] font-mono-jb" style={{ color: C.muted }}>Lock in founding price forever · 34 spots left</div>
        </div>
        <div className="flex-1 sm:flex-none">
          <WaitlistForm variant="nav" />
        </div>
      </div>
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const heroRef = useRef(null)

  return (
    <>
      <NoiseOverlay />
      <Cursor />
      <ScrollProgress />
      <main style={{ background: C.bg }}>
        <Hero sectionRef={heroRef} />
        <Problem />
        <Pillars />
        <SocialProof />
        <FinalCTA />
      </main>
      <SocialProofToasts />
      <StickyBottomBar />
    </>
  )
}
