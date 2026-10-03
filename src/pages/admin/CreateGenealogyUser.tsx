import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { updateGenealogy } from "../../services/adminService";
import { getUserProfile } from "../../services/registrationService";
import { getDownline } from "../../services/sharedService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { DownlineResponse, UserRegistrationResponse } from "../../types/registration.types";

// A binary tree: every upline has at most one member on each side.
const POSITIONS = ["Left", "Right"];

interface UplineOption {
  guid: string;
  label: string;
  /** Positions already taken directly under this upline. */
  takenPositions: string[];
}

function fullName(first: string | null | undefined, last: string | null | undefined): string {
  return `${first ?? ""} ${last ?? ""}`.trim();
}

export default function CreateGenealogyUser() {
  const { usersGuid } = useParams<{ usersGuid: string }>();
  const [profile, setProfile] = useState<UserRegistrationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [downline, setDownline] = useState<DownlineResponse | null>(null);
  const [downlineLoading, setDownlineLoading] = useState(false);
  const [uplineGuid, setUplineGuid] = useState("");
  const [position, setPosition] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usersGuid) {
      setLoading(false);
      return;
    }
    getUserProfile(usersGuid)
      .then(setProfile)
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load user details."))
      .finally(() => setLoading(false));
  }, [usersGuid]);

  // The upline can be the sponsor or anyone beneath the sponsor, so load the sponsor's whole tree.
  // (Login is required; an admin may request any user's tree.)
  const sponsorGuid = profile?.sponsor?.sponser_guid ?? profile?.sponsorGuid ?? null;
  useEffect(() => {
    if (!sponsorGuid) {
      setDownline(null);
      return;
    }
    setDownlineLoading(true);
    getDownline(sponsorGuid)
      .then(setDownline)
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load the sponsor's downline."))
      .finally(() => setDownlineLoading(false));
  }, [sponsorGuid]);

  const uplineOptions = useMemo<UplineOption[]>(() => {
    if (!downline) return [];

    const members = downline.members;
    // This user (and anyone already placed beneath them) can't be their own upline.
    const excluded = new Set<string>();
    if (usersGuid) {
      excluded.add(usersGuid.toLowerCase());
      let grew = true;
      while (grew) {
        grew = false;
        for (const m of members) {
          if (!excluded.has(m.users_guid.toLowerCase()) && excluded.has(m.upliner_guid.toLowerCase())) {
            excluded.add(m.users_guid.toLowerCase());
            grew = true;
          }
        }
      }
    }

    const taken = (guid: string) =>
      members
        .filter((m) => m.upliner_guid.toLowerCase() === guid.toLowerCase() && m.position)
        .map((m) => (m.position as string).toLowerCase());

    const label = (first: string | null, last: string | null, code: string) =>
      `${fullName(first, last) || "—"} (${code})`;

    return [
      {
        guid: downline.users_guid,
        label: `${label(downline.user_first_name, downline.user_last_name, downline.user_name)} - Sponsor`,
        takenPositions: taken(downline.users_guid),
      },
      ...members
        .filter((m) => !excluded.has(m.users_guid.toLowerCase()))
        .map((m) => ({
          guid: m.users_guid,
          label: `${label(m.user_first_name, m.user_last_name, m.user_name)} - Level ${m.level}`,
          takenPositions: taken(m.users_guid),
        })),
    ];
  }, [downline, usersGuid]);

  const selectedUpline = uplineOptions.find((o) => o.guid === uplineGuid);
  const freePositions = selectedUpline
    ? POSITIONS.filter((p) => !selectedUpline.takenPositions.includes(p.toLowerCase()))
    : [];

  const canSave = Boolean(usersGuid && selectedUpline && position && freePositions.includes(position));

  const handleSave = async () => {
    if (!usersGuid || !canSave) return;
    setSaving(true);
    try {
      const result = await updateGenealogy(usersGuid, { upliner_guid: uplineGuid, position });
      toast.success(
        result.user_code_assigned
          ? `Member placed. User code ${result.user_code} assigned.`
          : `Placement updated. User code ${result.user_code}.`
      );
      navigate("/admin/create-genealogy");
    } catch (error) {
      toast.error((error as ApiErrorShape).message || "Could not save the genealogy. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-16">
        <Spinner className="w-6 h-6 text-brand-orange" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-brand-ink">User not found</h2>
        <Link to="/admin/create-genealogy" className="mt-4 inline-block text-sm font-bold text-brand-orange hover:underline">
          Back to Create Genealogy
        </Link>
      </div>
    );
  }

  const sponsor = profile.sponsor;
  const sponsorName = sponsor ? fullName(sponsor.user_first_name, sponsor.user_last_name) : "";

  const userFields: [string, string][] = [
    ["Name", fullName(profile.userFirstName, profile.userLastName) || "—"],
    ["Username", profile.userName || "—"],
    ["Email", profile.emailId || "—"],
    ["Mobile", profile.mobileNumber ? String(profile.mobileNumber) : "—"],
    ["Current Position", profile.position || "—"],
  ];

  const selectClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <Link
        to="/admin/create-genealogy"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-orange"
      >
        <Icon name="arrowRight" className="w-3.5 h-3.5 rotate-180" />
        Back to Create Genealogy
      </Link>
      <h2 className="mt-3 text-xl font-bold text-brand-ink">Create Genealogy</h2>
      <p className="mt-1 text-sm text-slate-500">Place this member in the binary tree under an upline.</p>

      <dl className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 rounded-xl bg-slate-50 p-5 text-sm">
        {userFields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="font-semibold text-brand-ink break-words">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-semibold text-brand-ink">Sponsor Name</label>
          <input
            readOnly
            value={
              sponsor
                ? `${sponsorName || "—"}${sponsor.user_name ? ` (${sponsor.user_name})` : ""}`
                : "No sponsor"
            }
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-brand-ink outline-none"
          />
        </div>

        <div>
          <label htmlFor="upline" className="text-sm font-semibold text-brand-ink">
            Upline Name
          </label>
          <select
            id="upline"
            value={uplineGuid}
            disabled={downlineLoading || uplineOptions.length === 0}
            onChange={(e) => {
              setUplineGuid(e.target.value);
              setPosition("");
            }}
            className={selectClass}
          >
            <option value="">
              {downlineLoading
                ? "Loading…"
                : uplineOptions.length === 0
                  ? "No upline available"
                  : "Select upline"}
            </option>
            {uplineOptions.map((o) => (
              <option key={o.guid} value={o.guid} disabled={o.takenPositions.length >= POSITIONS.length}>
                {o.label}
                {o.takenPositions.length >= POSITIONS.length ? " (full)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="position" className="text-sm font-semibold text-brand-ink">
            Position
          </label>
          <select
            id="position"
            value={position}
            disabled={!selectedUpline || freePositions.length === 0}
            onChange={(e) => setPosition(e.target.value)}
            className={selectClass}
          >
            <option value="">
              {!selectedUpline ? "Select an upline first" : freePositions.length === 0 ? "No free position" : "Select position"}
            </option>
            {freePositions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!sponsorGuid && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
          This user has no sponsor, so there is no tree to choose an upline from.
        </div>
      )}

      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        The Upline list is the sponsor and everyone beneath them, and Position shows only the sides still free under
        the chosen upline. Saving places this member in the tree and gives them their user code.
      </p>

      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave || saving}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? (
          <>
            <Spinner className="w-4 h-4" />
            Saving...
          </>
        ) : (
          <>
            Save Genealogy
            <Icon name="arrowRight" className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
