import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { createState, getCountries } from "../../services/sharedService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { LookupOption } from "../../types/registration.types";

export default function AddState() {
  const [countries, setCountries] = useState<LookupOption[]>([]);
  const [countryGuid, setCountryGuid] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load countries."));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!countryGuid) {
      toast.error("Please select a country.");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter a state name.");
      return;
    }

    setSaving(true);
    try {
      await createState({ name: name.trim(), code: code.trim() || undefined, countryGuid });
      toast.success(`State "${name.trim()}" added successfully!`);
      setName("");
      setCode("");
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Failed to add state. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm max-w-xl">
      <h2 className="text-xl font-bold text-brand-ink">Add State</h2>
      <p className="mt-1 text-sm text-slate-500">Create a new state under an existing country.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-semibold text-brand-ink">Country</label>
          <select
            value={countryGuid}
            onChange={(e) => setCountryGuid(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-brand-ink">State Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-brand-ink">State Code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={50}
            placeholder="Optional"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? (
            <>
              <Spinner className="w-4 h-4" />
              Adding...
            </>
          ) : (
            <>
              Add State
              <Icon name="arrowRight" className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
