// Purely decorative SVG accents ported from the reference design.

export function HeroDoodles() {
  return (
    <div className="doodles">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M520,80 Q570,58 620,80 Q670,102 720,80 Q770,58 820,80 Q870,102 920,80"
          stroke="#1A1209"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.3"
        />
        <circle
          cx="1320"
          cy="470"
          r="76"
          stroke="#FFF8EE"
          strokeWidth="2.5"
          strokeDasharray="9 6"
          fill="none"
          opacity="0.45"
        />
        <g transform="translate(85,700)" opacity="0.2">
          <circle cx="0" cy="0" r="21" fill="#1A1209" />
          <circle cx="30" cy="-19" r="12" fill="#1A1209" />
          <circle cx="-30" cy="-19" r="12" fill="#1A1209" />
          <circle cx="17" cy="-34" r="9" fill="#1A1209" />
          <circle cx="-17" cy="-34" r="9" fill="#1A1209" />
        </g>
        <path
          d="M1020,740 L1052,718 L1084,740 L1116,718 L1148,740 L1180,718 L1212,740"
          stroke="#FFD93D"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M1060,200 Q1125,148 1170,200 Q1212,252 1150,292 Q1088,332 1048,280 Q1008,228 1060,200Z"
          fill="#B8A9E8"
          opacity="0.38"
        />
        <g transform="translate(1355,655)" opacity="0.4">
          <path
            d="M-32,0 L32,0 M16,-16 L32,0 L16,16"
            stroke="#FFF8EE"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}

// A cute cutout "star" character used as a floating hero accent when no
// custom image is supplied.
export function StarBadge({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M60 6 L74 42 L112 44 L82 68 L92 106 L60 84 L28 106 L38 68 L8 44 L46 42 Z"
        fill="#FFD93D"
        stroke="#1A1209"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="49" cy="60" r="4" fill="#1A1209" />
      <circle cx="71" cy="60" r="4" fill="#1A1209" />
      <path
        d="M48 72 Q60 82 72 72"
        stroke="#1A1209"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="230"
      height="20"
      viewBox="0 0 230 20"
      aria-hidden="true"
    >
      <path
        d="M0,10 Q20,2 40,10 Q60,18 80,10 Q100,2 120,10 Q140,18 160,10 Q180,2 200,10 Q215,15 230,10"
        stroke="#FF6B47"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface WaveProps {
  bg: string; // color the wave sits on
  fill: string; // wave color
  variant?: 'curve1' | 'zigzag' | 'curve2';
}

export function Wave({ bg, fill, variant = 'curve1' }: WaveProps) {
  const paths: Record<string, { h: number; d: string }> = {
    curve1: {
      h: 60,
      d: 'M0,20 Q360,70 720,20 Q1080,-30 1440,40 L1440,60 L0,60Z',
    },
    zigzag: {
      h: 52,
      d: 'M0,40 L60,10 L120,40 L180,10 L240,40 L300,10 L360,40 L420,10 L480,40 L540,10 L600,40 L660,10 L720,40 L780,10 L840,40 L900,10 L960,40 L1020,10 L1080,40 L1140,10 L1200,40 L1260,10 L1320,40 L1380,10 L1440,40 L1440,52 L0,52Z',
    },
    curve2: {
      h: 60,
      d: 'M0,30 Q360,-10 720,50 Q1080,100 1440,10 L1440,60 L0,60Z',
    },
  };
  const p = paths[variant];
  return (
    <div className="wave" style={{ background: bg, marginBottom: '-2px' }} aria-hidden="true">
      <svg
        viewBox={`0 0 1440 ${p.h}`}
        preserveAspectRatio="none"
        height={p.h}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={p.d} fill={fill} />
      </svg>
    </div>
  );
}

export function FooterSquiggle() {
  return (
    <svg
      className="footer-squiggle"
      width="100%"
      height="14"
      viewBox="0 0 1100 14"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,7 Q40,1 80,7 Q120,13 160,7 Q200,1 240,7 Q280,13 320,7 Q360,1 400,7 Q440,13 480,7 Q520,1 560,7 Q600,13 640,7 Q680,1 720,7 Q760,13 800,7 Q840,1 880,7 Q920,13 960,7 Q1000,1 1040,7 Q1070,11 1100,7"
        stroke="#FF6B47"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
