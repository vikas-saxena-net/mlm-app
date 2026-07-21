import Icon from "./Icon";

export default function RankFundCard({ fund }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-brand-orange to-brand-green p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white">
          <Icon name={fund.icon} className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-bold leading-tight">{fund.title}</h3>
          <p className="text-white/85 text-xs">Unlocked after {fund.unlockedAfter} rank</p>
        </div>
      </div>
      <div className="p-5 space-y-3 text-sm">
        <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
          <span className="text-slate-500">Self BV</span>
          <span className="font-semibold text-brand-ink">₹{fund.selfBv}</span>
        </div>
        <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
          <span className="text-slate-500">Team BV</span>
          <span className="font-semibold text-brand-ink">₹{fund.teamBv}</span>
        </div>
        <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
          <span className="text-slate-500">Point Rule</span>
          <span className="font-semibold text-brand-ink text-right">{fund.pointRule}</span>
        </div>
        {fund.pointValue && (
          <div className="flex justify-between">
            <span className="text-slate-500">Point Value</span>
            <span className="font-semibold text-brand-green text-right">{fund.pointValue}</span>
          </div>
        )}
        {fund.note && <p className="text-xs text-slate-400 pt-1">{fund.note}</p>}
      </div>
    </div>
  );
}
