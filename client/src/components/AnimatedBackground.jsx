export default function AnimatedBackground() {
  const shapes = [
    { size: 90,  color: '#f97316', left: '5%',  delay: '0s',  duration: '20s' },
    { size: 130, color: '#3b82f6', left: '15%', delay: '4s',  duration: '24s' },
    { size: 65,  color: '#10b981', left: '28%', delay: '1s',  duration: '17s' },
    { size: 110, color: '#8b5cf6', left: '42%', delay: '6s',  duration: '27s' },
    { size: 75,  color: '#f59e0b', left: '57%', delay: '2s',  duration: '21s' },
    { size: 95,  color: '#ef4444', left: '70%', delay: '8s',  duration: '19s' },
    { size: 55,  color: '#06b6d4', left: '82%', delay: '3s',  duration: '18s' },
    { size: 80,  color: '#ec4899', left: '92%', delay: '10s', duration: '23s' },
  ];

  const icons = [
    { icon: '📚', top: '12%',  left: '7%',  delay: '0s',   duration: '5s'   },
    { icon: '✏️', top: '22%',  left: '87%', delay: '1.5s', duration: '6s'   },
    { icon: '🔬', top: '55%',  left: '4%',  delay: '3s',   duration: '4.5s' },
    { icon: '🧮', top: '68%',  left: '91%', delay: '0.5s', duration: '7s'   },
    { icon: '🌍', top: '38%',  left: '93%', delay: '4s',   duration: '5.5s' },
    { icon: '💡', top: '78%',  left: '9%',  delay: '2s',   duration: '4s'   },
    { icon: '⭐', top: '8%',   left: '50%', delay: '2.5s', duration: '8s'   },
    { icon: '🦊', top: '42%',  left: '2%',  delay: '5s',   duration: '5s'   },
    { icon: '📐', top: '85%',  left: '55%', delay: '1s',   duration: '6.5s' },
    { icon: '🎯', top: '30%',  left: '45%', delay: '7s',   duration: '4s'   },
    { icon: '🏆', top: '62%',  left: '70%', delay: '3.5s', duration: '5s'   },
    { icon: '🚀', top: '18%',  left: '30%', delay: '6s',   duration: '7s'   },
  ];

  const orbs = [
    { size: 500, color: 'rgba(249,115,22,0.07)',  top: '-15%',  left: '-10%', duration: '9s'  },
    { size: 400, color: 'rgba(139,92,246,0.06)',  bottom: '-10%', right: '-8%', duration: '12s' },
    { size: 300, color: 'rgba(16,185,129,0.05)',  top: '35%',   left: '38%',  duration: '15s' },
  ];

  return (
    <div className="animated-bg">
      {/* Orb blobs */}
      {orbs.map((o, i) => (
        <div key={`orb-${i}`} className="bg-orb" style={{
          width: o.size, height: o.size,
          background: o.color,
          top: o.top, left: o.left,
          bottom: o.bottom, right: o.right,
          animationDuration: o.duration,
          animationDelay: `${i * 2}s`,
        }} />
      ))}

      {/* Rising shapes */}
      {shapes.map((s, i) => (
        <div key={`shape-${i}`} className="floating-shape" style={{
          width: s.size, height: s.size,
          backgroundColor: s.color,
          left: s.left,
          animationDelay: s.delay,
          animationDuration: s.duration,
        }} />
      ))}

      {/* Floating emoji icons */}
      {icons.map((ic, i) => (
        <div key={`icon-${i}`} className="floating-icon" style={{
          top: ic.top, left: ic.left,
          animationDelay: ic.delay,
          animationDuration: ic.duration,
        }}>
          {ic.icon}
        </div>
      ))}
    </div>
  );
}
