import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteState, getAllStates } from "../../services/sharedService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { StateListItem } from "../../types/registration.types";

export default function AllStates() {
  const [states, setStates] = useState<StateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingGuid, setDeletingGuid] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const filteredStates = states.filter((state) => {
    const term = filter.trim().toLowerCase();
    if (!term) return true;
    return (
      (state.name || "").toLowerCase().includes(term) ||
      (state.code || "").toLowerCase().includes(term)
    );
  });

  const loadStates = () => {
    setLoading(true);
    getAllStates()
      .then(setStates)
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load states."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStates();
  }, []);

  const handleDelete = async (state: StateListItem) => {
    if (!window.confirm(`Delete state "${state.name}"? This cannot be undone.`)) return;

    setDeletingGuid(state.guid);
    try {
      await deleteState(state.guid);
      toast.success(`State "${state.name}" deleted.`);
      setStates((prev) => prev.filter((s) => s.guid !== state.guid));
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Failed to delete state. Please try again.");
    } finally {
      setDeletingGuid(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-ink">All States</h2>
          <p className="mt-1 text-sm text-slate-500">{states.length} state(s) on record.</p>
        </div>
        <button
          type="button"
          onClick={loadStates}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-brand-orange hover:text-brand-orange"
        >
          <Icon name="refresh" className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="mt-6">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name or code…"
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-brand-orange" />
        </div>
      ) : states.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No states found.</p>
      ) : filteredStates.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No states match "{filter}".</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4">#</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Code</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStates.map((state, index) => (
                <tr key={state.guid} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-3 pr-4 text-slate-500">{index + 1}</td>
                  <td className="py-3 pr-4 font-semibold text-brand-ink">{state.name}</td>
                  <td className="py-3 pr-4 text-slate-500">{state.code || "—"}</td>
                  <td className="py-3 pr-4 text-right">
                    {deletingGuid === state.guid ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Spinner className="w-3.5 h-3.5" />
                        Deleting…
                      </span>
                    ) : (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(state);
                        }}
                        className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
                      >
                        Delete
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
