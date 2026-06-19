import './FlowBackground.css'

// พื้นหลังลายเส้นไหลโทนเหลือง (แทนลายสีฟ้าในภาพอ้างอิง)
export function FlowBackground() {
  return (
    <div className="flow-bg" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="flowY" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffff00" stopOpacity="0" />
            <stop offset="45%" stopColor="#ffff00" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#cccc00" stopOpacity="0" />
          </linearGradient>
          <filter id="flowBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>
        <g
          className="flow-lines"
          fill="none"
          stroke="url(#flowY)"
          filter="url(#flowBlur)"
        >
          <path d="M-100 240 C 300 120, 600 420, 1000 260 S 1700 120, 1900 340" />
          <path d="M-100 360 C 320 220, 640 540, 1040 380 S 1720 260, 1900 460" />
          <path d="M-100 500 C 280 380, 660 700, 1020 520 S 1740 420, 1900 600" />
          <path d="M-100 640 C 340 540, 620 820, 1060 660 S 1700 560, 1900 720" />
          <path d="M-100 120 C 360 40, 600 300, 1000 140 S 1680 40, 1900 220" />
        </g>
      </svg>
    </div>
  )
}
