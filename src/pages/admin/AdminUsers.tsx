import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { deleteUser, getAllUsers } from "../../services/adminService";
import { getUserStatuses } from "../../services/registrationService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { AdminUserListResponse, StatusMainResponse } from "../../types/registration.types";

const PAGE_SIZE_OPTIONS = [20, 50, 100, 200];

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUserListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingGuid, setDeletingGuid] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [statuses, setStatuses] = useState<StatusMainResponse[]>([]);
  const [statusGuid, setStatusGuid] = useState("");

  const filteredUsers = users.filter((u) => {
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

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const loadUsers = () => {
    setLoading(true);
    getAllUsers(statusGuid || undefined)
      .then(setUsers)
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getUserStatuses()
      .then(setStatuses)
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load statuses."));
  }, []);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusGuid]);

  const handleDelete = async (target: AdminUserListResponse) => {
    if (!target.usersGuid) return;
    if (target.usersGuid === user?.user_guid) {
      toast.error("You cannot delete your own account.");
      return;
    }
    const name = `${target.userFirstName ?? ""} ${target.userLastName ?? ""}`.trim() || target.userName;
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;

    setDeletingGuid(target.usersGuid);
    try {
      await deleteUser(target.usersGuid, user?.user_name ?? undefined);
      toast.success(`User "${name}" deleted.`);
      setUsers((prev) => prev.filter((u) => u.usersGuid !== target.usersGuid));
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Failed to delete user. Please try again.");
    } finally {
      setDeletingGuid(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-ink">All Users</h2>
          <p className="mt-1 text-sm text-slate-500">{users.length} registered member(s).</p>
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

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <select
          value={statusGuid}
          onChange={(e) => {
            setStatusGuid(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
          className="w-full max-w-[200px] rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s.status_guid} value={s.status_guid ?? ""}>
              {s.name ?? s.code}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          placeholder="Filter by name, username, email or mobile…"
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-brand-orange" />
        </div>
      ) : users.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No users found.</p>
      ) : filteredUsers.length === 0 ? (
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
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((u, index) => {
                const name = `${u.userFirstName ?? ""} ${u.userLastName ?? ""}`.trim() || "—";
                const isSelf = u.usersGuid === user?.user_guid;
                return (
                  <tr key={u.usersGuid} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="py-3 pr-4 text-slate-500">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="py-3 pr-4 font-semibold text-brand-ink">{name}</td>
                    <td className="py-3 pr-4 text-slate-600">{u.userName || "—"}</td>
                    <td className="py-3 pr-4 text-slate-600">{u.emailId || "—"}</td>
                    <td className="py-3 pr-4 text-slate-600">{u.mobileNumber || "—"}</td>
                    <td className="py-3 pr-4 text-slate-600">{u.role_name || "—"}</td>
                    <td className="py-3 pr-4 text-slate-600">{u.status_name || u.status || "—"}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/users/${u.usersGuid}/profile`}
                          className="text-xs font-bold text-brand-orange hover:text-brand-orange-dark hover:underline"
                        >
                          Edit Profile
                        </Link>
                        {isSelf ? (
                          <span className="text-xs font-semibold text-slate-300">You</span>
                        ) : deletingGuid === u.usersGuid ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                            <Spinner className="w-3.5 h-3.5" />
                            Deleting…
                          </span>
                        ) : (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(u);
                            }}
                            className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
                          >
                            Delete
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-500">
                Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredUsers.length)}{" "}
                of {filteredUsers.length}
              </p>
              <label className="flex items-center gap-1.5 text-xs text-slate-500">
                Rows per page
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 focus:border-brand-orange focus:outline-none"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
