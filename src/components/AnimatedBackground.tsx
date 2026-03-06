'use client'

import { useEffect, useRef } from 'react'

/**
 * Full-screen animated SVG background with floating geometric shapes,
 * pulsing grid, and flowing connection lines.
 * Inspired by GSAP.com's hero — industrial precision meets creative energy.
 */
export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0
    let mouseX = 0.5
    let mouseY = 0.5

    // Track mouse for parallax
    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth
      mouseY = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })

    // Resize
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => window.innerWidth
    const H = () => window.innerHeight

    // ═══ GEOMETRIC SHAPES ═══
    interface Shape {
      x: number; y: number; size: number; rotation: number;
      rotSpeed: number; type: 'hexagon' | 'diamond' | 'triangle' | 'cross' | 'ring';
      opacity: number; speedX: number; speedY: number; parallaxFactor: number;
    }

    const shapes: Shape[] = []
    const shapeTypes: Shape['type'][] = ['hexagon', 'diamond', 'triangle', 'cross', 'ring']

    for (let i = 0; i < 22; i++) {
      shapes.push({
        x: Math.random() * 1.2 - 0.1,
        y: Math.random() * 1.2 - 0.1,
        size: Math.random() * 50 + 18,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        opacity: Math.random() * 0.25 + 0.10,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.1,
        parallaxFactor: Math.random() * 0.3 + 0.1,
      })
    }

    // ═══ GRID NODES ═══
    interface GridNode {
      baseX: number; baseY: number; x: number; y: number;
      connections: number[]; pulse: number; pulseSpeed: number;
    }

    const gridNodes: GridNode[] = []
    const gridSpacing = 120
    const cols = Math.ceil(W() / gridSpacing) + 2
    const rows = Math.ceil(H() / gridSpacing) + 2

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        gridNodes.push({
          baseX: c * gridSpacing - gridSpacing,
          baseY: r * gridSpacing - gridSpacing,
          x: c * gridSpacing - gridSpacing,
          y: r * gridSpacing - gridSpacing,
          connections: [],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        })
      }
    }

    // Connect nearby nodes
    gridNodes.forEach((node, i) => {
      gridNodes.forEach((other, j) => {
        if (i !== j) {
          const dx = node.baseX - other.baseX
          const dy = node.baseY - other.baseY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < gridSpacing * 1.5) {
            node.connections.push(j)
          }
        }
      })
    })

    // ═══ FLOWING PARTICLES (connection lines) ═══
    interface FlowParticle {
      fromNode: number; toNode: number; progress: number; speed: number; opacity: number;
    }

    const flowParticles: FlowParticle[] = []
    for (let i = 0; i < 40; i++) {
      const nodeIdx = Math.floor(Math.random() * gridNodes.length)
      const node = gridNodes[nodeIdx]
      if (node.connections.length > 0) {
        flowParticles.push({
          fromNode: nodeIdx,
          toNode: node.connections[Math.floor(Math.random() * node.connections.length)],
          progress: Math.random(),
          speed: Math.random() * 0.01 + 0.004,
          opacity: Math.random() * 0.5 + 0.3,
        })
      }
    }

    // ═══ DRAW FUNCTIONS ═══

    function drawHexagon(cx: number, cy: number, size: number) {
      if (!ctx) return
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2
        const px = cx + size * Math.cos(angle)
        const py = cy + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
    }

    function drawDiamond(cx: number, cy: number, size: number) {
      if (!ctx) return
      ctx.beginPath()
      ctx.moveTo(cx, cy - size)
      ctx.lineTo(cx + size * 0.7, cy)
      ctx.lineTo(cx, cy + size)
      ctx.lineTo(cx - size * 0.7, cy)
      ctx.closePath()
    }

    function drawTriangle(cx: number, cy: number, size: number) {
      if (!ctx) return
      ctx.beginPath()
      ctx.moveTo(cx, cy - size)
      ctx.lineTo(cx + size * 0.866, cy + size * 0.5)
      ctx.lineTo(cx - size * 0.866, cy + size * 0.5)
      ctx.closePath()
    }

    function drawCross(cx: number, cy: number, size: number) {
      if (!ctx) return
      const t = size * 0.2
      ctx.beginPath()
      ctx.moveTo(cx - t, cy - size)
      ctx.lineTo(cx + t, cy - size)
      ctx.lineTo(cx + t, cy - t)
      ctx.lineTo(cx + size, cy - t)
      ctx.lineTo(cx + size, cy + t)
      ctx.lineTo(cx + t, cy + t)
      ctx.lineTo(cx + t, cy + size)
      ctx.lineTo(cx - t, cy + size)
      ctx.lineTo(cx - t, cy + t)
      ctx.lineTo(cx - size, cy + t)
      ctx.lineTo(cx - size, cy - t)
      ctx.lineTo(cx - t, cy - t)
      ctx.closePath()
    }

    function drawRing(cx: number, cy: number, size: number) {
      if (!ctx) return
      ctx.beginPath()
      ctx.arc(cx, cy, size, 0, Math.PI * 2)
      ctx.moveTo(cx + size * 0.6, cy)
      ctx.arc(cx, cy, size * 0.6, 0, Math.PI * 2, true)
    }

    // ═══ MAIN ANIMATION LOOP ═══

    function animate() {
      if (!ctx) return
      const w = W()
      const h = H()
      time += 0.016

      // Clear
      ctx.clearRect(0, 0, w, h)

      // ── 1. Draw grid connections (subtle pulsing network) ──
      gridNodes.forEach((node) => {
        node.pulse += node.pulseSpeed
        // Subtle displacement based on mouse + time
        const dx = Math.sin(time * 0.5 + node.baseX * 0.005) * 8
        const dy = Math.cos(time * 0.4 + node.baseY * 0.005) * 8
        const mx = (mouseX - 0.5) * 15 * (node.baseX / w)
        const my = (mouseY - 0.5) * 15 * (node.baseY / h)
        node.x = node.baseX + dx + mx
        node.y = node.baseY + dy + my
      })

      // Draw connection lines
      ctx.lineWidth = 0.5
      gridNodes.forEach((node) => {
        node.connections.forEach((ci) => {
          const other = gridNodes[ci]
          const pulseVal = (Math.sin(node.pulse) + 1) / 2
          const alpha = 0.04 + pulseVal * 0.06
          ctx.strokeStyle = `rgba(212, 168, 83, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        })
      })

      // Draw grid dots
      gridNodes.forEach((node) => {
        const pulseVal = (Math.sin(node.pulse) + 1) / 2
        const dotSize = 1.5 + pulseVal * 2
        const alpha = 0.08 + pulseVal * 0.14
        ctx.fillStyle = `rgba(212, 168, 83, ${alpha})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, dotSize, 0, Math.PI * 2)
        ctx.fill()
      })

      // ── 2. Draw flow particles (data flowing through grid) ──
      flowParticles.forEach((particle) => {
        particle.progress += particle.speed
        if (particle.progress >= 1) {
          particle.progress = 0
          particle.fromNode = particle.toNode
          const node = gridNodes[particle.fromNode]
          if (node && node.connections.length > 0) {
            particle.toNode = node.connections[Math.floor(Math.random() * node.connections.length)]
          }
        }

        const from = gridNodes[particle.fromNode]
        const to = gridNodes[particle.toNode]
        if (!from || !to) return

        const px = from.x + (to.x - from.x) * particle.progress
        const py = from.y + (to.y - from.y) * particle.progress
        const fadeEdge = Math.sin(particle.progress * Math.PI)

        // Glow
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, 8)
        gradient.addColorStop(0, `rgba(212, 168, 83, ${particle.opacity * fadeEdge})`)
        gradient.addColorStop(0.5, `rgba(212, 168, 83, ${particle.opacity * fadeEdge * 0.3})`)
        gradient.addColorStop(1, `rgba(212, 168, 83, 0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(px, py, 8, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.fillStyle = `rgba(212, 168, 83, ${particle.opacity * fadeEdge * 0.9})`
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // ── 3. Draw floating geometric shapes ──
      shapes.forEach((shape) => {
        // Update position
        shape.x += shape.speedX / w
        shape.y += shape.speedY / h
        shape.rotation += shape.rotSpeed

        // Wrap around
        if (shape.x > 1.15) shape.x = -0.15
        if (shape.x < -0.15) shape.x = 1.15
        if (shape.y > 1.15) shape.y = -0.15
        if (shape.y < -0.15) shape.y = 1.15

        // Mouse parallax
        const px = shape.x * w + (mouseX - 0.5) * shape.parallaxFactor * 80
        const py = shape.y * h + (mouseY - 0.5) * shape.parallaxFactor * 80

        ctx.save()
        ctx.translate(px, py)
        ctx.rotate(shape.rotation)

        // Draw shape
        ctx.strokeStyle = `rgba(212, 168, 83, ${shape.opacity})`
        ctx.lineWidth = 1.2
        ctx.fillStyle = `rgba(212, 168, 83, ${shape.opacity * 0.15})`

        switch (shape.type) {
          case 'hexagon': drawHexagon(0, 0, shape.size); break
          case 'diamond': drawDiamond(0, 0, shape.size); break
          case 'triangle': drawTriangle(0, 0, shape.size); break
          case 'cross': drawCross(0, 0, shape.size); break
          case 'ring': drawRing(0, 0, shape.size); break
        }

        ctx.stroke()
        ctx.fill()
        ctx.restore()
      })

      // ── 4. Radial gradient vignette from center ──
      const centerGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7)
      centerGrad.addColorStop(0, 'rgba(212, 168, 83, 0.05)')
      centerGrad.addColorStop(0.5, 'rgba(212, 168, 83, 0.025)')
      centerGrad.addColorStop(1, 'rgba(10, 10, 11, 0)')
      ctx.fillStyle = centerGrad
      ctx.fillRect(0, 0, w, h)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 1 }}
    />
  )
}
