import Icon from "../../components/Icon";

export default function AdminUsers() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-brand-ink">All Users</h2>

      <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-brand-orange">
          <Icon name="users" className="w-6 h-6" />
        </div>
        <h3 className="mt-4 text-sm font-bold text-brand-ink">Coming Soon</h3>
        <p className="mt-2 max-w-sm text-xs text-slate-500 leading-relaxed">
          There isn't a "list all users" API endpoint on the backend yet. Once one is added, this screen will show
          every registered member here.
        </p>
      </div>
    </div>
  );
}
