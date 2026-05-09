const NODES: ReadonlyArray<readonly [number, number]> = [
  [10, 18],
  [22, 32],
  [8, 55],
  [18, 72],
  [32, 12],
  [38, 48],
  [28, 88],
  [50, 22],
  [55, 65],
  [48, 92],
  [68, 14],
  [72, 38],
  [62, 78],
  [82, 28],
  [88, 56],
  [78, 86],
  [92, 72],
];

const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [0, 4],
  [1, 5],
  [1, 2],
  [2, 3],
  [3, 6],
  [4, 7],
  [5, 7],
  [5, 8],
  [6, 9],
  [7, 10],
  [7, 11],
  [8, 11],
  [8, 12],
  [9, 12],
  [10, 13],
  [11, 14],
  [12, 15],
  [13, 14],
  [14, 16],
  [15, 16],
  [11, 13],
];

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute -left-32 top-0 h-[40rem] w-[40rem] animate-blob-slow rounded-full bg-cyan-500/25 blur-3xl" />
      <div className="absolute right-0 top-32 h-[36rem] w-[36rem] animate-blob-slower rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-[32rem] w-[32rem] animate-blob-slowest rounded-full bg-amber-500/15 blur-3xl" />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-50"
        aria-hidden
      >
        <defs>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(34 211 238)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="rgb(52 211 153)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(251 191 36)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <g stroke="url(#edgeGrad)" strokeWidth="0.08" fill="none">
          {EDGES.map(([a, b], i) => {
            const na = NODES[a]!;
            const nb = NODES[b]!;
            return (
              <line
                key={`e-${i}`}
                x1={na[0]}
                y1={na[1]}
                x2={nb[0]}
                y2={nb[1]}
              />
            );
          })}
        </g>
        <g>
          {NODES.map(([x, y], i) => (
            <circle
              key={`n-${i}`}
              cx={x}
              cy={y}
              r="0.4"
              className="fill-cyan-300"
              style={{
                animation: `node-pulse 4s ease-in-out ${(i % 5) * 0.6}s infinite`,
              }}
            />
          ))}
        </g>
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
