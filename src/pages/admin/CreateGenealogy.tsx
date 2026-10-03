import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllUsers } from "../../services/adminService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { AdminUserListResponse } from "../../types/registration.types";

// The "Active" status in the status table.
const ACTIVE_STATUS_GUID = "260402e0-be34-11f1-9528-000c296e9a77";

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

export default function CreateGenealogy() {
  const [users, setUsers] = useState<AdminUserListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const loadUsers = () => {
    setLoading(true);
    getAllUsers(ACTIVE_STATUS_GUID)
      .then(setUsers)
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // If an older API doesn't send user_code at all, this list can't be narrowed to users without a
  // code, so say so instead of silently showing everyone.
  const codeFieldAvailable = users.some((u) => "user_code" in u);

  // Users who already have a user code are already placed in the genealogy.
  const waiting = users.filter((u) => u.user_code == null);

  const visible = waiting.filter((u) => {
    const term = filter.trim().toLowerCase();
    if (!term) return true;
    const name = `${u.userFirstName ?? ""} ${u.userLastName ?? ""}`.toLowerCase();
    return (
      name.includes(term) ||
      (u.userName ?? "").toLowerCase().includes(term) ||
      (u.emailId ?? "").toLowerCase().includes(term) ||
      String(u.mobileNumber ?? "").includes(term)
    );
  });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-ink">Create Genealogy</h2>
          <p className="mt-1 text-sm text-slate-500">
            {waiting.length} active user(s) without a user code.
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-brand-orange hover:text-brand-orange"
        >
          <Icon name="refresh" className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {!loading && users.length > 0 && !codeFieldAvailable && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
          The server isn't sending each user's <span className="font-bold">user_code</span> yet, so this list shows
          every active user, including any who already have a code. It will narrow to users without a code as soon
          as the API returns that field.
        </div>
      )}

      <div className="mt-6">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name, username, email or mobile…"
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-brand-orange" />
        </div>
      ) : waiting.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No active users are waiting for a user code.</p>
      ) : visible.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No users match "{filter}".</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4">#</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Username</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Mobile</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Registered</th>
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u, index) => {
                const name = `${u.userFirstName ?? ""} ${u.userLastName ?? ""}`.trim() || "—";
                return (
                  <tr key={u.usersGuid} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="py-3 pr-4 text-slate-500">{index + 1}</td>
                    <td className="py-3 pr-4 font-semibold text-brand-ink">{name}</td>
                    <td className="py-3 pr-4 text-slate-600">{u.userName || "—"}</td>
                    <td className="py-3 pr-4 text-slate-600">{u.emailId || "—"}</td>
                    <td className="py-3 pr-4 text-slate-600">{u.mobileNumber || "—"}</td>
                    <td className="py-3 pr-4 text-slate-600">{u.status_name || "—"}</td>
                    <td className="py-3 pr-4 text-slate-600">{formatDate(u.createdDate)}</td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/create-genealogy/${u.usersGuid}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-orange-dark"
                      >
                        Create
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
