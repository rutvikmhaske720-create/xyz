// // import { useRef } from 'react'
// // import { Canvas } from '@react-three/fiber'
// // import { Sky } from '@react-three/drei'
// // import CampusModel      from './CampusModel'
// // import CameraController from './CameraController'
// // import NavPath          from './NavPath'
// // import ExploreControls  from '../controls/ExploreControls'

// // export default function CampusScene({ joystickRef }) {
// //   return (
// //     <Canvas
// //       camera={{
// //         position: [0.0338, 180, 120],
// //         fov:      60,
// //         near:     0.1,
// //         far:      2000,
// //       }}
// //       shadows
// //       style={{ width: '100vw', height: '100vh' }}
// //       // Prevent default touch so joystick works
// //       onCreated={({ gl }) => {
// //         gl.domElement.style.touchAction = 'none'
// //       }}
// //     >
// //       <ambientLight intensity={0.6} />
// //       <directionalLight
// //         position={[100, 200, 100]}
// //         intensity={1.5}
// //         castShadow
// //         shadow-mapSize={[2048, 2048]}
// //       />
// //       {/* <hemisphereLight
// //         skyColor="#87CEEB"
// //         groundColor="#2adc21"
// //         intensity={0.3}
// //       /> */}
// //       <hemisphereLight
// //   skyColor="#ffffff"
// //   groundColor="#ffffff"
// //   intensity={1}
// // />
// //       <Sky sunPosition={[100, 80, 100]} />

// //       <CampusModel />
// //       <NavPath />
// //       <CameraController />
// //       <ExploreControls joystickRef={joystickRef} />
// //     </Canvas>
// //   )
// // }

// import { useRef } from 'react'
// import { Canvas } from '@react-three/fiber'
// import { Sky } from '@react-three/drei'
// import CampusModel      from './CampusModel'
// import CameraController from './CameraController'
// import NavPath          from './NavPath'
// import ExploreControls  from '../controls/ExploreControls'

// export default function CampusScene({ joystickRef }) {
//   return (
//     <Canvas
//       camera={{
//         position: [0.0738, 110, 110],
//         fov:      60,
//         near:     0.1,
//         far:      2000,
//       }}
//       shadows
//       style={{ width: '100vw', height: '100vh' }}
//       onCreated={({ gl }) => {
//         gl.domElement.style.touchAction = 'none'
//       }}
//     >
//       {/* Ambient — sabko equally light karo */}
//       <ambientLight intensity={1.2} />

//       {/* Sun — upar se */}
//       <directionalLight
//         position={[50, 200, 50]}
//         intensity={2.0}
//         castShadow={false}
//       />

//       {/* Fill light — neeche se bhi thodi light */}
//       <directionalLight
//         position={[0, -100, 0]}
//         intensity={0.8}
//         color="#ffffff"
//       />

//       {/* Side light — left se */}
//       <directionalLight
//         position={[-100, 100, 0]}
//         intensity={0.6}
//       />

//       {/* Side light — right se */}
//       <directionalLight
//         position={[100, 100, 0]}
//         intensity={0.6}
//       />

//       <Sky sunPosition={[100, 80, 100]} />

//       <CampusModel />
//       <NavPath />
//       <CameraController />
//       <ExploreControls joystickRef={joystickRef} />
//     </Canvas>
//   )
// }


// import { useRef } from 'react'
// import { Canvas } from '@react-three/fiber'
// import { Sky }    from '@react-three/drei'
// import CampusModel      from './CampusModel'
// import CameraController from './CameraController'
// import NavPath          from './NavPath'
// import ExploreControls  from '../controls/ExploreControls'

// export default function CampusScene({ joystickRef, fovRef }) {
//   return (
//     <Canvas
//       camera={{
//         position: [0.0338, 180, 120],
//         fov:      60,
//         near:     0.1,
//         far:      2000,
//       }}
//       shadows
//       style={{ width: '100vw', height: '100vh' }}
//       onCreated={({ gl, camera }) => {
//         gl.domElement.style.touchAction = 'none'
//         // Store camera ref for FOV control
//         if (fovRef) fovRef.current = camera
//       }}
//     >
//       <ambientLight intensity={0.7} />
//       <directionalLight
//         position={[100, 200, 100]}
//         intensity={1.8}
//         castShadow={false}
//       />
//       <directionalLight
//         position={[-50, 100, -50]}
//         intensity={0.4}
//         color="#4488ff"
//       />
//       <hemisphereLight
//         skyColor="#87CEEB"
//         groundColor="#2d4a2d"
//         intensity={0.4}
//       />
//       <Sky sunPosition={[100, 80, 100]} />
//       <CampusModel />
//       <NavPath />
//       <CameraController />
//       <ExploreControls joystickRef={joystickRef} />
//     </Canvas>
//   )
// }


import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import CampusModel      from './CampusModel'
import CameraController from './CameraController'
import NavPath          from './NavPath'
import ExploreControls  from '../controls/ExploreControls'

export default function CampusScene({ joystickRef ,fovRef }) {
  return (
    <Canvas
      camera={{
        position: [0.0738, 110, 110],
        fov:      60,
        near:     0.1,
        far:      2000,
      }}
      shadows
      style={{ width: '100vw', height: '100vh' }}
      onCreated={({ gl, camera, scene }) => {
        gl.domElement.style.touchAction = 'none'
        if (fovRef) fovRef.current = camera

        const canvas = gl.domElement

  // Handle WebGL context loss (happens when canvas → 0x0 on minimize)
        canvas.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          console.warn('⚠️ WebGL context lost')
        }, false)

        canvas.addEventListener('webglcontextrestored', () => {
          console.warn('✅ WebGL context restored — forcing re-render')

    // Force camera/projection to recalc with valid size
          const w = canvas.clientWidth
          const h = canvas.clientHeight
          if (w > 0 && h > 0) {
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            gl.setSize(w, h)
          }

    // Mark all materials/textures for re-upload
        scene.traverse((obj) => {
          if (obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
            mats.forEach(m => { m.needsUpdate = true })
          }
        })
      }, false)
    }}
    >
      {/* Ambient — sabko equally light karo */}
      <ambientLight intensity={1.2} />

      {/* Sun — upar se */}
      <directionalLight
        position={[50, 200, 50]}
        intensity={2.0}
        castShadow={false}
      />

      {/* Fill light — neeche se bhi thodi light */}
      <directionalLight
        position={[0, -100, 0]}
        intensity={0.8}
        color="#ffffff"
      />

      {/* Side light — left se */}
      <directionalLight
        position={[-100, 100, 0]}
        intensity={0.6}
      />

      {/* Side light — right se */}
      <directionalLight
        position={[100, 100, 0]}
        intensity={0.6}
      />

      <Sky sunPosition={[100, 80, 100]} />

      <CampusModel />
      <NavPath />
      <CameraController />
      <ExploreControls joystickRef={joystickRef} />
    </Canvas>
  )
}