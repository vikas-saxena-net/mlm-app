import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteCity, getAllCities } from "../../services/sharedService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { CityListItem } from "../../types/registration.types";

export default function AllCities() {
  const [cities, setCities] = useState<CityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingGuid, setDeletingGuid] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const filteredCities = cities.filter((city) => {
    const term = filter.trim().toLowerCase();
    if (!term) return true;
    return (
      (city.name || "").toLowerCase().includes(term) ||
      (city.code || "").toLowerCase().includes(term)
    );
  });

  const loadCities = () => {
    setLoading(true);
    getAllCities()
      .then(setCities)
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load cities."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCities();
  }, []);

  const handleDelete = async (city: CityListItem) => {
    if (!window.confirm(`Delete city "${city.name}"? This cannot be undone.`)) return;

    setDeletingGuid(city.guid);
    try {
      await deleteCity(city.guid);
      toast.success(`City "${city.name}" deleted.`);
      setCities((prev) => prev.filter((c) => c.guid !== city.guid));
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Failed to delete city. Please try again.");
    } finally {
      setDeletingGuid(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-ink">All Cities</h2>
          <p className="mt-1 text-sm text-slate-500">{cities.length} city/cities on record.</p>
        </div>
        <button
          type="button"
          onClick={loadCities}
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
      ) : cities.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No cities found.</p>
      ) : filteredCities.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No cities match "{filter}".</p>
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
              {filteredCities.map((city, index) => (
                <tr key={city.guid} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-3 pr-4 text-slate-500">{index + 1}</td>
                  <td className="py-3 pr-4 font-semibold text-brand-ink">{city.name}</td>
                  <td className="py-3 pr-4 text-slate-500">{city.code || "—"}</td>
                  <td className="py-3 pr-4 text-right">
                    {deletingGuid === city.guid ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Spinner className="w-3.5 h-3.5" />
                        Deleting…
                      </span>
                    ) : (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(city);
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
