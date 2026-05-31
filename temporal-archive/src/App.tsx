import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import Lenis from 'lenis'
import { Play, Pause, Search, Star } from 'lucide-react'

// === ADVANCED TENET-STYLE AUDIO ENGINE (Clean + Low Freq + Mobile Vibration) ===
class TemporalAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.7
      this.master.connect(this.ctx.destination)
    }
    return this.ctx
  }

  // Tenet-grade reverse + low frequency + crisp high layer
  playTimeReverse(intense = false) {
    const ctx = this.init()
    if (!ctx || !this.master) return

    const master = this.master

    // Deep low frequency foundation (Tenet feel)
    const low = ctx.createOscillator()
    low.type = 'sine'
    low.frequency.value = intense ? 38 : 52

    const lowFilter = ctx.createBiquadFilter()
    lowFilter.type = 'lowpass'
    lowFilter.frequency.value = 180

    const lowGain = ctx.createGain()
    lowGain.gain.value = intense ? 0.9 : 0.65

    // Bright reverse layer
    const high = ctx.createOscillator()
    high.type = 'sawtooth'
    high.frequency.value = intense ? 920 : 680

    const highFilter = ctx.createBiquadFilter()
    highFilter.type = 'highpass'
    highFilter.frequency.value = 420

    const highGain = ctx.createGain()
    highGain.gain.value = 0.25

    // Routing
    low.connect(lowFilter)
    lowFilter.connect(lowGain)
    high.connect(highFilter)
    highFilter.connect(highGain)

    lowGain.connect(master)
    highGain.connect(master)

    low.start()
    high.start()

    const now = ctx.currentTime
    const duration = intense ? 3.8 : 2.9

    // Signature slow reverse pitch bend
    low.frequency.linearRampToValueAtTime(intense ? 28 : 36, now + duration)
    high.frequency.linearRampToValueAtTime(intense ? 210 : 280, now + duration * 0.7)

    lowGain.gain.linearRampToValueAtTime(0.001, now + duration)
    highGain.gain.linearRampToValueAtTime(0.001, now + duration * 0.85)

    // Mobile vibration (Tenet physical feedback)
    if ('vibrate' in navigator) {
      navigator.vibrate(intense ? [40, 120, 80] : [25, 80])
    }

    setTimeout(() => {
      low.stop()
      high.stop()
    }, duration * 1000 + 200)
  }

  // Clean refreshing ignition sound (used for Red Cliffs)
  playCleanIgnition() {
    const ctx = this.init()
    if (!ctx || !this.master) return

    // Bright airy whoosh
    const whoosh = ctx.createOscillator()
    whoosh.type = 'sine'
    whoosh.frequency.value = 620

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1450

    const gain = ctx.createGain()
    gain.gain.value = 0.4

    whoosh.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    whoosh.start()

    const now = ctx.currentTime
    whoosh.frequency.linearRampToValueAtTime(180, now + 1.4)
    gain.gain.linearRampToValueAtTime(0.001, now + 2.1)

    setTimeout(() => whoosh.stop(), 2300)
  }
}

const audio = new TemporalAudio()

// === THREE.JS TIME REVERSAL SHADER (WebGL) ===
function TimeReversalShader({ intensity = 1 }: { intensity?: number }) {
  return (
    <mesh>
      <planeGeometry args={[12, 8]} />
      <shaderMaterial
        uniforms={{
          uTime: { value: 0 },
          uIntensity: { value: intensity },
          uColor: { value: new THREE.Color('#C9A227') }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uIntensity;
          uniform vec3 uColor;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            float distortion = sin(uv.y * 12.0 + uTime * 2.0) * 0.02 * uIntensity;
            uv.x += distortion;

            float lines = smoothstep(0.48, 0.52, fract(uv.y * 18.0 + uTime * 0.8));
            float glow = 1.0 - length(uv - 0.5) * 1.4;

            vec3 color = mix(vec3(0.0), uColor, lines * glow * uIntensity);
            gl_FragColor = vec4(color, 0.85);
          }
        `}
      />
    </mesh>
  )
}

// === MAIN APP ===
function App() {
  const [theme, setTheme] = useState<'dark' | 'gold'>('dark')
  const [searchTerm, setSearchTerm] = useState('')
  const [factionFilter, setFactionFilter] = useState('all')
  const [selectedHero, setSelectedHero] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // GSAP + Lenis smooth scroll setup
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  // Sample rich character data (expand this to hundreds in real JSON)
  const characters = [
    { id: 0, name: "刘备", faction: "蜀", short: "汉室之胄，仁德之主", image: "/assets/characters/liubei-main.jpg" },
    { id: 1, name: "曹操", faction: "魏", short: "乱世之奸雄", image: "/assets/characters/caocao-main.jpg" },
    { id: 2, name: "诸葛亮", faction: "蜀", short: "鞠躬尽瘁，死而后已", image: "/assets/characters/zhugeliang-main.jpg" },
    // ... add the other 12 + expand to 100+ in characters.json
  ]

  const filtered = characters.filter(c => {
    const matchSearch = c.name.includes(searchTerm) || c.short.includes(searchTerm)
    const matchFaction = factionFilter === 'all' || c.faction === factionFilter
    return matchSearch && matchFaction
  })

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'gold' : 'dark'
    setTheme(newTheme)
    document.documentElement.style.setProperty('--gold', newTheme === 'gold' ? '#C9A227' : '#EDE6D8')
  }

  return (
    <div className={`min-h-screen bg-black text-[#EDE6D8] ${theme === 'gold' ? 'gold-mode' : ''}`}>
      {/* Top Nav - SpaceX style */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#C9A227] rounded-full" />
            <span className="font-semibold tracking-[4px] text-sm">时间观察者</span>
          </div>
          <div className="flex items-center gap-8 text-xs tracking-[2px]">
            <a href="#archive" className="hover:text-[#C9A227]">档案馆</a>
            <a href="#corridor" className="hover:text-[#C9A227]">长廊</a>
            <a href="#database" className="hover:text-[#C9A227]">数据库</a>
            <button onClick={toggleTheme} className="border border-white/20 px-4 py-1 rounded-full">
              {theme === 'dark' ? '金色模式' : '暗黑模式'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="min-h-[100dvh] flex items-center justify-center relative pt-16">
        <div className="text-center max-w-4xl px-8">
          <div className="text-xs tracking-[4px] text-[#C9A227] mb-4">SpaceX × 诺兰 · 2026</div>
          <h1 className="text-[92px] leading-none font-bold tracking-[-6px] mb-6">
            我们观测时间本身
          </h1>
          <p className="text-2xl text-white/60 mb-10">历史的终极使命档案</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => { audio.playTimeReverse(true); document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="px-10 py-4 bg-[#C9A227] text-black font-semibold tracking-widest rounded-full"
            >
              进入档案馆
            </button>
            <button 
              onClick={() => audio.playCleanIgnition()}
              className="px-10 py-4 border border-white/30 rounded-full tracking-widest"
            >
              启动反转
            </button>
          </div>
        </div>
      </header>

      {/* ARCHIVE - 3D Flip Cards + Search */}
      <section id="archive" className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-xs tracking-[4px] text-[#C9A227]">档案馆</div>
            <h2 className="text-6xl font-bold tracking-tighter">时间锚点</h2>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#111] pl-11 py-3 rounded-2xl text-sm w-72 border border-white/10 focus:border-[#C9A227]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((hero) => (
            <div key={hero.id} className="flip-card h-80 cursor-pointer" onClick={() => setSelectedHero(hero)}>
              <div className="flip-card-inner relative w-full h-full">
                <div className="flip-card-front absolute inset-0 bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden">
                  {hero.image && <img src={hero.image} className="w-full h-full object-cover" />}
                  <div className="absolute bottom-0 p-6 bg-gradient-to-t from-black/90">
                    <div className="text-3xl font-semibold">{hero.name}</div>
                    <div className="text-sm text-white/60">{hero.faction}</div>
                  </div>
                </div>
                <div className="flip-card-back absolute inset-0 bg-[#0A0A0A] border border-[#C9A227]/40 rounded-3xl p-6 flex flex-col justify-center">
                  <div className="text-[#C9A227] text-xs mb-2 tracking-widest">TEMPORAL ANCHOR</div>
                  <div className="text-4xl font-bold mb-3">{hero.name}</div>
                  <p className="text-white/70 text-sm">{hero.short}</p>
                  <div className="mt-auto text-xs text-[#C9A227]">CLICK TO INITIATE REVERSAL →</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THREE.JS TIME REVERSAL DEMO */}
      <section className="border-y border-white/10 py-20 bg-black">
        <div className="max-w-5xl mx-auto px-8 text-center mb-8">
          <div className="text-xs tracking-[4px] text-[#C9A227]">WebGL 着色器</div>
          <h3 className="text-5xl font-bold tracking-tighter">时间反转场</h3>
        </div>
        <div className="h-[520px] max-w-5xl mx-auto border border-white/10 rounded-3xl overflow-hidden relative">
          <Canvas camera={{ position: [0, 0, 10] }} style={{ background: '#000' }}>
            <TimeReversalShader intensity={isPlaying ? 1.8 : 0.6} />
            <OrbitControls enablePan={false} enableZoom={true} />
          </Canvas>
          <button
            onClick={() => {
              const playing = !isPlaying
              setIsPlaying(playing)
              if (playing) audio.playTimeReverse(true)
            }}
            className="absolute bottom-6 left-6 flex items-center gap-2 px-6 py-3 bg-black/80 border border-white/20 rounded-full text-sm"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />} {isPlaying ? '暂停反转' : '激活着色器'}
          </button>
        </div>
      </section>

      {/* DATABASE */}
      <section id="database" className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-5xl font-bold tracking-tighter mb-8">人物数据库</h2>
        <p className="text-white/60 mb-6">完整 200+ 角色 JSON 清单（可扩展）</p>
        <div className="text-sm text-white/50">Search, filter, and explore the complete historical manifest. (Full JSON + virtual scrolling coming in next iteration)</div>
      </section>

      <footer className="text-center py-12 text-xs text-white/40 border-t border-white/10">
        TEMPORAL OBSERVER ARCHIVE — SPACEX × NOLAN • Static export ready for Vercel + GitHub
      </footer>
    </div>
  )
}

export default App
