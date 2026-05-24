"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useTheme } from "next-themes"

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const [hasWebGL, setHasWebGL] = useState(true)

  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: {
      resolution: { value: [number, number] }
      time: { value: number }
      xScale: { value: number }
      yScale: { value: number }
      distortion: { value: number }
      uOpacity: { value: number }
      uColor1: { value: number[] }
      uColor2: { value: number[] }
      uColor3: { value: number[] }
      uMouse: { value: [number, number] }
      uMouseActive: { value: number }
    } | null
    animationId: number | null
    isPaused: boolean
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
    isPaused: false
  })

  useEffect(() => {
    // 1. WebGL Support Detection
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      if (!gl) {
        setHasWebGL(false)
        return
      }
    } catch (e) {
      setHasWebGL(false)
      return
    }

    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const refs = sceneRef.current

    // 2. Vertex Shader (simple pass-through)
    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    // 3. Fragment Shader (optimized liquid wave)
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;
      uniform float uOpacity;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec2 uMouse;
      uniform float uMouseActive;

      void main() {
        // Normalize coordinates from -1.0 to 1.0, accounting for aspect ratio
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        // Mouse interaction wave distortion
        float mouseDist = length(p - uMouse);
        float mouseInfluence = smoothstep(0.8, 0.0, mouseDist) * uMouseActive;
        
        // Distortion effect
        float d = length(p) * distortion;
        
        // Wave coordinates with chromatic split
        float rx = p.x * (1.0 + d) + mouseInfluence * 0.15;
        float gx = p.x + mouseInfluence * 0.15;
        float bx = p.x * (1.0 - d) + mouseInfluence * 0.15;

        // Wave heights (adding 0.0015 to prevent division-by-zero GPU hang)
        float w1 = 0.02 / (abs(p.y + sin((rx + time) * xScale) * yScale) + 0.0015);
        float w2 = 0.02 / (abs(p.y + sin((gx + time) * xScale) * yScale) + 0.0015);
        float w3 = 0.02 / (abs(p.y + sin((bx + time) * xScale) * yScale) + 0.0015);
        
        // Premium ambient glow to wash the top, bottom, and corners in luxury light
        vec3 ambientGlow = uColor1 * 0.07 + uColor2 * 0.04 + uColor3 * 0.03;
        
        // Soft persistent glow spotlight specifically in the top-left corner behind ContentAlchemy logo
        // p ranges from -1.0 to 1.0 vertically, and from -aspect to aspect horizontally
        float logoGlow = smoothstep(2.4, 0.0, length(p - vec2(-1.6, 0.95)));
        vec3 logoGlowColor = (uColor1 * 0.35 + uColor2 * 0.20) * logoGlow;
        
        // Color blending with ambient wash and logo corner spotlight
        vec3 finalColor = uColor1 * w1 + uColor2 * w2 + uColor3 * w3 + ambientGlow + logoGlowColor;
        
        // Completely disabled edge vignetting to guarantee 100% uniform brightness with zero shadowing in corners
        gl_FragColor = vec4(finalColor, uOpacity);
      }
    `

    // 4. Initialize Scene
    const initScene = () => {
      refs.scene = new THREE.Scene()

      // CRITICAL: Set pixel ratio max to 1.0 to prevent MacBook crash/slowdown
      refs.renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true, 
        antialias: false, // Turn off antialiasing for performance
        powerPreference: "low-power" // Low-power preference for GPU
      })
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0))
      
      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      // Get color palette based on active theme
      const isDark = resolvedTheme === "dark"
      const colors = isDark 
        ? {
            uColor1: [0.31, 0.40, 0.94], // Indigo-500 (#4f46e5 / #6366f1)
            uColor2: [0.66, 0.33, 0.97], // Purple-500 (#a855f7)
            uColor3: [0.02, 0.71, 0.83], // Cyan-500 (#06b6d4)
            uOpacity: 0.75
          }
        : {
            // Bright, luxurious pastel colors for light mode to wash the background in light instead of darkening it
            uColor1: [0.90, 0.93, 1.0],  // Pastel Blue
            uColor2: [0.95, 0.91, 1.0],  // Pastel Lavender
            uColor3: [0.90, 0.97, 1.0],  // Pastel Cyan
            uOpacity: 0.90                 // High opacity so pastels wash the slate-50 background smoothly
          }

      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        xScale: { value: 1.2 },
        yScale: { value: 0.55 },
        distortion: { value: 0.06 },
        uOpacity: { value: colors.uOpacity },
        uColor1: { value: colors.uColor1 },
        uColor2: { value: colors.uColor2 },
        uColor3: { value: colors.uColor3 },
        uMouse: { value: [-1000.0, -1000.0] },
        uMouseActive: { value: 0.0 }
      }

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms as any,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        depthTest: false
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    // 5. Render Loop (Safe & Pause-aware)
    const animate = () => {
      if (refs.isPaused) return

      if (refs.uniforms) {
        refs.uniforms.time.value += 0.006
      }
      
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      // Add 200px to width/height to size the canvas for the -100px off-screen overflow margin
      const width = window.innerWidth + 200
      const height = window.innerHeight + 200
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    // Initialize
    initScene()
    
    // Start Animation Loop
    refs.animationId = requestAnimationFrame(animate)

    // 6. Mouse movement event listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (!refs.uniforms) return
      const width = window.innerWidth
      const height = window.innerHeight
      // Normalize mouse coordinates from -1.0 to 1.0 (matching shader coordinates)
      const x = (e.clientX * 2.0 - width) / Math.min(width, height)
      const y = -(e.clientY * 2.0 - height) / Math.min(width, height)
      refs.uniforms.uMouse.value = [x, y]
      refs.uniforms.uMouseActive.value = 1.0
    }

    const handleMouseLeave = () => {
      if (!refs.uniforms) return
      refs.uniforms.uMouseActive.value = 0.0
    }

    // 7. Safety Throttling: Page Visibility Listener
    const handleVisibilityChange = () => {
      if (document.hidden) {
        refs.isPaused = true
        if (refs.animationId) {
          cancelAnimationFrame(refs.animationId)
          refs.animationId = null
        }
      } else {
        if (!refs.animationId) {
          refs.isPaused = false
          refs.animationId = requestAnimationFrame(animate)
        }
      }
    }

    // 8. Scroll Throttling: Intersection Observer
    // Pause rendering when canvas is completely scrolled off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          if (!refs.animationId) {
            refs.isPaused = false
            refs.animationId = requestAnimationFrame(animate)
          }
        } else {
          refs.isPaused = true
          if (refs.animationId) {
            cancelAnimationFrame(refs.animationId)
            refs.animationId = null
          }
        }
      },
      { threshold: 0.01 }
    )
    observer.observe(canvas)

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Cleanup
    return () => {
      observer.unobserve(canvas)
      observer.disconnect()
      
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("visibilitychange", handleVisibilityChange)

      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [resolvedTheme])

  // 9. Update Uniforms when theme changes
  useEffect(() => {
    const refs = sceneRef.current
    if (!refs.uniforms) return

    const isDark = resolvedTheme === "dark"
    const colors = isDark 
      ? {
          uColor1: [0.31, 0.40, 0.94], // Indigo-500
          uColor2: [0.66, 0.33, 0.97], // Purple-500
          uColor3: [0.02, 0.71, 0.83], // Cyan-500
          uOpacity: 0.75
        }
      : {
          // Bright, luxurious pastel colors for light mode to wash the background in light instead of darkening it
          uColor1: [0.90, 0.93, 1.0],  // Pastel Blue
          uColor2: [0.95, 0.91, 1.0],  // Pastel Lavender
          uColor3: [0.90, 0.97, 1.0],  // Pastel Cyan
          uOpacity: 0.90                 // High opacity so pastels wash the slate-50 background smoothly
        }

    refs.uniforms.uOpacity.value = colors.uOpacity
    refs.uniforms.uColor1.value = colors.uColor1
    refs.uniforms.uColor2.value = colors.uColor2
    refs.uniforms.uColor3.value = colors.uColor3
  }, [resolvedTheme])

  // Graceful Fallback if WebGL is not supported
  if (!hasWebGL) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-tr from-indigo-50/20 via-purple-50/10 to-cyan-50/20 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-cyan-950/20" />
    )
  }

  return (
    <div 
      className="fixed pointer-events-none z-0 overflow-hidden"
      style={{ top: "-100px", left: "-100px", right: "-100px", bottom: "-100px" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ filter: "blur(20px)" }} // Add a slight blur to create that beautiful glassmorphic fluid feel
      />
      <div className="absolute inset-0 canvas-bg-overlay pointer-events-none" />
    </div>
  )
}
