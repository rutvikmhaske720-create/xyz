import { useEffect, useRef } from 'react'
import CampusScene     from './scene/CampusScene'
import SearchBar       from './ui/SearchBar'
import InfoPanel       from './ui/InfoPanel'
import NavigationPanel from './ui/NavigationPanel'
import ModeSelector    from './ui/ModeSelector'
import NavControls     from './ui/NavControls'
import VirtualJoystick from './controls/VirtualJoystick'
import useCampusStore  from './store/useCampusStore'
import { buildSearchIndex } from './data/searchIndex'
import { useFOVZoom }  from './controls/useFOVZoom'
import { glass, colors, radius } from './utils/glass'
import { ZoomIn, ZoomOut } from 'lucide-react'
import './App.css'

export default function App() {

  const { loadData }  = useCampusStore()
  const fuseRef       = useRef(null)
  const joystickRef   = useRef({ x: 0, y: 0 })
  const cameraRef     = useRef(null)

  const controlMode   = useCampusStore(s => s.controlMode)
  const isExplore     = controlMode === 'EXPLORE'

  const { zoomIn, zoomOut } = useFOVZoom(cameraRef, true)

  useEffect(() => {
    async function init() {
      const [buildings, rooms, faculty, navGraph] = await Promise.all([
        fetch('/data/buildings.json').then(r => r.json()),
        fetch('/data/rooms.json').then(r => r.json()),
        fetch('/data/faculty.json').then(r => r.json()),
        fetch('/data/navgraph.json').then(r => r.json()),
      ])
      loadData(buildings, rooms, faculty, navGraph)
      const { fuse } = buildSearchIndex(buildings, rooms, faculty)
      fuseRef.current = fuse
      console.log('✅ Campus data loaded')
    }
    init()
  }, [])

  return (
    <div style={{
      position:   'relative',
      width:      '100vw',
      height:     '100vh',
      overflow:   'hidden',
      background: '#070b14',
    }}>

      {/* 3D Scene */}
      <CampusScene
        joystickRef={joystickRef}
        fovRef={cameraRef}
      />

      {/* ── Top bar: Search + Mode Selector ── */}
      <div className="top-bar">
        {!isExplore && (
          <div className="top-bar-search">
            <SearchBar fuseInstance={fuseRef.current} />
          </div>
        )}
        <div className="top-bar-mode">
          <ModeSelector />
        </div>
      </div>

      {/* Info Panel */}
      <InfoPanel />

      {/* Navigation Panel */}
      <div style={{
        position:   'absolute',
        bottom:     isExplore ? 210 : 24,
        left:       24,
        zIndex:     100,
        transition: 'bottom 0.3s ease',
      }}>
        <NavigationPanel />
      </div>

      {/* Zoom buttons — always visible */}
      <div style={{
        position:      'absolute',
        bottom:        isExplore ? 130 : 24,
        right:         24,
        zIndex:        300,
        display:       'flex',
        flexDirection: 'column',
        gap:           8,
        transition:    'bottom 0.3s ease',
      }}>
        <ZoomBtn onClick={zoomIn}  icon={<ZoomIn  size={16}/>} title="Zoom In"  />
        <ZoomBtn onClick={zoomOut} icon={<ZoomOut size={16}/>} title="Zoom Out" />
      </div>

      {/* Explore Mode UI */}
      {isExplore && (
        <>
          {/* Bottom bar — Joystick + NavControls */}
          <div className="explore-bottom-bar" style={{
            position:    'absolute',
            bottom:      32,
            left:        0,
            right:       0,
            padding:     '0 24px',
            display:     'flex',
            alignItems:  'flex-end',
            justifyContent: 'space-between',
            zIndex:      300,
            pointerEvents: 'none',
          }}>
            {/* Left — Joystick */}
            <div style={{ pointerEvents: 'auto' }}>
              <VirtualJoystick
                size={140}
                onMove={val => { joystickRef.current = val }}
              />
            </div>

            {/* Center — Nav Controls */}
            <div style={{ pointerEvents: 'auto', marginBottom: 4 }}>
              <NavControls />
            </div>

            {/* Right — spacer (zoom buttons already there) */}
            <div style={{ width: 56 }} />
          </div>

          {/* Crosshair */}
          <div style={{
            position:      'absolute',
            top:           '50%',
            left:          '50%',
            transform:     'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex:        200,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8"
                stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
              <circle cx="12" cy="12" r="1.5"
                fill="rgba(255,255,255,0.7)"/>
              <line x1="12" y1="2"  x2="12" y2="7"
                stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
              <line x1="12" y1="17" x2="12" y2="22"
                stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
              <line x1="2"  y1="12" x2="7"  y2="12"
                stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
              <line x1="17" y1="12" x2="22" y2="12"
                stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
            </svg>
          </div>

        </>
      )}

    </div>
  )
}

function ZoomBtn({ onClick, icon, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width:          48,
        height:         48,
        borderRadius:   radius.full,
        ...glass,
        background:     'rgba(8,12,22,0.72)',
        color:          colors.subtext,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        cursor:         'pointer',
        transition:     'all 0.15s',
        border:         '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color       = colors.cyan
        e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)'
        e.currentTarget.style.boxShadow   = '0 0 16px rgba(0,229,255,0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color       = colors.subtext
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow   = '0 8px 32px rgba(0,0,0,0.5)'
      }}
    >
      {icon}
    </button>
  )
}