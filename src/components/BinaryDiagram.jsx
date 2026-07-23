import { idActivation } from "../data/businessPlan";

const TONE_GRADIENTS = {
  you: ["#fbcfe8", "#e0399b", "#7a1263"],
  lead: ["#bfe3ff", "#2f8fe0", "#124b8f"],
  member: ["#e2e8f0", "#7c8ba3", "#3d4a5e"],
};

function PersonGlyph({ x, y, r, tone, sub }) {
  const gradId = `glossy-${tone}`;
  const glintId = `glint-${tone}`;
  const scale = r / 32;

  return (
    <g
      className="diagram-node transition-transform duration-300 ease-out hover:scale-[1.14] cursor-pointer"
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      {sub && (
        <text
          x={x}
          y={y - r - 16}
          textAnchor="middle"
          className="fill-brand-ink font-extrabold"
          style={{ fontSize: 13, letterSpacing: 1 }}
        >
          {sub}
        </text>
      )}

      <g transform={`translate(${x}, ${y}) scale(${scale})`} filter="url(#figureShadow)">
        {/* body */}
        <path
          d="M -21,-2 C -21,-15 -12,-15 0,-15 C 12,-15 21,-15 21,-2
             C 21,11 18,25 0,25 C -18,25 -21,11 -21,-2 Z"
          fill={`url(#${gradId})`}
        />
        {/* head */}
        <circle cx="0" cy="-31" r="11.5" fill={`url(#${gradId})`} />

        {/* glossy highlight */}
        <ellipse cx="-5" cy="-35" rx="4.2" ry="3" fill={`url(#${glintId})`} transform="rotate(-25 -5 -35)" />
        <ellipse cx="-9" cy="-6" rx="6" ry="10" fill={`url(#${glintId})`} opacity="0.6" transform="rotate(-12 -9 -6)" />

        {/* tie */}
        <path d="M 0,-13 L 3.4,-9.5 L 2,21 L 0,25 L -2,21 L -3.4,-9.5 Z" fill="white" fillOpacity="0.92" />
        <path d="M -3.2,-13 L -8,-7.5 L -3,-5 Z" fill="white" fillOpacity="0.75" />
        <path d="M 3.2,-13 L 8,-7.5 L 3,-5 Z" fill="white" fillOpacity="0.75" />
      </g>
    </g>
  );
}

function ConnectorWing({ fromX, fromY, toX, toY, width = 10 }) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const half = width / 2;

  const points = [
    [fromX + nx * half, fromY + ny * half],
    [fromX - nx * half, fromY - ny * half],
    [toX - nx * 1.5, toY - ny * 1.5],
    [toX + nx * 1.5, toY + ny * 1.5],
  ]
    .map((p) => p.join(","))
    .join(" ");

  return <polygon points={points} fill="url(#wingGradient)" />;
}

export default function BinaryDiagram() {
  const you = { x: 350, y: 66 };
  const left = { x: 190, y: 220 };
  const right = { x: 510, y: 220 };
  const l1 = { x: 95, y: 360 };
  const l2 = { x: 270, y: 360 };
  const r1 = { x: 430, y: 360 };
  const r2 = { x: 605, y: 360 };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <svg viewBox="0 0 700 440" className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="wingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {Object.entries(TONE_GRADIENTS).map(([tone, [light, mid, dark]]) => (
            <radialGradient key={tone} id={`glossy-${tone}`} cx="35%" cy="28%" r="80%">
              <stop offset="0%" stopColor={light} />
              <stop offset="45%" stopColor={mid} />
              <stop offset="100%" stopColor={dark} />
            </radialGradient>
          ))}
          {Object.keys(TONE_GRADIENTS).map((tone) => (
            <radialGradient key={tone} id={`glint-${tone}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.95" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          ))}

          <filter id="figureShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.25" />
          </filter>
        </defs>

        <ConnectorWing fromX={you.x} fromY={you.y + 34} toX={left.x} toY={left.y - 17} width={16} />
        <ConnectorWing fromX={you.x} fromY={you.y + 34} toX={right.x} toY={right.y - 17} width={16} />
        <ConnectorWing fromX={left.x} fromY={left.y + 28} toX={l1.x} toY={l1.y - 14} width={10} />
        <ConnectorWing fromX={left.x} fromY={left.y + 28} toX={l2.x} toY={l2.y - 14} width={10} />
        <ConnectorWing fromX={right.x} fromY={right.y + 28} toX={r1.x} toY={r1.y - 14} width={10} />
        <ConnectorWing fromX={right.x} fromY={right.y + 28} toX={r2.x} toY={r2.y - 14} width={10} />

        <text
          x={you.x}
          y={(left.y + right.y) / 2 + 5}
          textAnchor="middle"
          className="fill-brand-orange font-extrabold"
          style={{ fontSize: 18 }}
        >
          1:1
        </text>

        <PersonGlyph x={you.x} y={you.y} r={40} tone="you" sub="YOU" />
        <PersonGlyph x={left.x} y={left.y} r={32} tone="lead" sub="LEFT" />
        <PersonGlyph x={right.x} y={right.y} r={32} tone="lead" sub="RIGHT" />
        <PersonGlyph x={l1.x} y={l1.y} r={26} tone="member" />
        <PersonGlyph x={l2.x} y={l2.y} r={26} tone="member" />
        <PersonGlyph x={r1.x} y={r1.y} r={26} tone="member" />
        <PersonGlyph x={r2.x} y={r2.y} r={26} tone="member" />
      </svg>

      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="rounded-xl bg-orange-50 py-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <p className="text-xs uppercase tracking-wide text-slate-500">Enrollment</p>
          <p className="text-xl font-extrabold text-brand-orange">{idActivation.enrollment} BV</p>
        </div>
        <div className="rounded-xl bg-green-50 py-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <p className="text-xs uppercase tracking-wide text-slate-500">Activation</p>
          <p className="text-xl font-extrabold text-brand-green">{idActivation.activation} BV</p>
        </div>
      </div>
    </div>
  );
}
