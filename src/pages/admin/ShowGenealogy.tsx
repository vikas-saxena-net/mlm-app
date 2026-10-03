import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { getDownline } from "../../services/sharedService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { DownlineResponse } from "../../types/registration.types";

// Levels shown below the selected member (root + 3 levels = up to 15 members).
const MAX_LEVELS = 3;
const SIDES = ["Left", "Right"] as const;
type Side = (typeof SIDES)[number];

interface TreeNode {
  guid: string;
  userName: string;
  userCode: number | null;
  mobile: number;
  children: Record<Side, TreeNode | null>;
}

function makeNode(guid: string, userName: string, userCode: number | null, mobile: number): TreeNode {
  return { guid, userName, userCode, mobile, children: { Left: null, Right: null } };
}

/** Turns the flat downline (each member knows its upline and side) into a binary tree. */
function buildTree(data: DownlineResponse): TreeNode {
  const root = makeNode(data.users_guid, data.user_name, data.user_code, data.mobile_number);
  const byGuid = new Map<string, TreeNode>([[root.guid.toLowerCase(), root]]);

  for (const member of [...data.members].sort((a, b) => a.level - b.level)) {
    const parent = byGuid.get(member.upliner_guid.toLowerCase());
    if (!parent) continue;

    const node = makeNode(member.users_guid, member.user_name, member.user_code, member.mobile_number);
    byGuid.set(node.guid.toLowerCase(), node);

    const position = (member.position ?? "").toLowerCase();
    const wanted: Side | null = position === "left" ? "Left" : position === "right" ? "Right" : null;
    const side: Side | null =
      wanted && !parent.children[wanted] ? wanted : !parent.children.Left ? "Left" : !parent.children.Right ? "Right" : null;
    if (side) parent.children[side] = node;
  }

  return root;
}

const TONES = {
  root: "genealogy-grad-root",
  lead: "genealogy-grad-lead",
  member: "genealogy-grad-member",
} as const;

/** Gradient definitions for the person icons; rendered once and referenced by id. */
function IconGradients() {
  const stops: [string, string, string, string][] = [
    [TONES.root, "#fbcfe8", "#e0399b", "#7a1263"],
    [TONES.lead, "#bfe3ff", "#2f8fe0", "#124b8f"],
    [TONES.member, "#e2e8f0", "#7c8ba3", "#3d4a5e"],
  ];
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {stops.map(([id, light, mid, dark]) => (
          <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={light} />
            <stop offset="45%" stopColor={mid} />
            <stop offset="100%" stopColor={dark} />
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

function PersonIcon({ tone }: { tone: keyof typeof TONES }) {
  const fill = `url(#${TONES[tone]})`;
  return (
    <svg viewBox="-24 -46 48 74" className="h-9 w-7" aria-hidden="true">
      <path
        d="M -21,-2 C -21,-15 -12,-15 0,-15 C 12,-15 21,-15 21,-2 C 21,11 18,25 0,25 C -18,25 -21,11 -21,-2 Z"
        fill={fill}
      />
      <circle cx="0" cy="-31" r="11.5" fill={fill} />
      <path d="M 0,-13 L 3.4,-9.5 L 2,21 L 0,25 L -2,21 L -3.4,-9.5 Z" fill="white" fillOpacity="0.92" />
    </svg>
  );
}

interface NodeCardProps {
  node: TreeNode;
  depth: number;
  isCurrentRoot: boolean;
  onSelect: (guid: string) => void;
}

/** One member: user code, username and mobile number. Clicking opens that member's own genealogy. */
function NodeCard({ node, depth, isCurrentRoot, onSelect }: NodeCardProps) {
  const tone: keyof typeof TONES = depth === 0 ? "root" : depth === 1 ? "lead" : "member";
  const body = (
    <>
      <PersonIcon tone={tone} />
      <span className="mt-1 text-xs font-extrabold text-brand-orange">
        {node.userCode != null ? `#${node.userCode}` : "No code"}
      </span>
      <span className="w-full truncate text-xs font-semibold text-brand-ink" title={node.userName}>
        {node.userName}
      </span>
      <span className="text-[11px] text-slate-500">{node.mobile ? node.mobile : "—"}</span>
    </>
  );

  const base = "flex w-28 flex-col items-center rounded-xl border bg-white px-2 py-2 text-center shadow-sm";

  if (isCurrentRoot) {
    return <div className={`${base} border-brand-orange ring-2 ring-brand-orange/20`}>{body}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(node.guid)}
      title={`Show ${node.userName}'s genealogy`}
      className={`${base} border-slate-200 transition hover:-translate-y-0.5 hover:border-brand-orange hover:shadow-md`}
    >
      {body}
    </button>
  );
}

function SideLabel({ children }: { children: string }) {
  return <span className="mb-1 text-[10px] font-extrabold tracking-widest text-slate-500">{children}</span>;
}

function EmptySlot({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center">
      <SideLabel>{label}</SideLabel>
      <div className="flex h-[104px] w-28 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-400">
        Empty
      </div>
    </div>
  );
}

interface SubtreeProps {
  node: TreeNode;
  depth: number;
  label: string;
  rootGuid: string;
  onSelect: (guid: string) => void;
}

function Subtree({ node, depth, label, rootGuid, onSelect }: SubtreeProps) {
  return (
    <div className="flex flex-col items-center">
      <SideLabel>{label}</SideLabel>
      <NodeCard node={node} depth={depth} isCurrentRoot={node.guid === rootGuid} onSelect={onSelect} />

      {depth < MAX_LEVELS && (
        <>
          <div className="h-6 w-px bg-slate-300" />
          <div className="flex">
            {SIDES.map((side, index) => {
              const child = node.children[side];
              return (
                <div key={side} className="relative flex flex-col items-center px-1 pt-6">
                  <span
                    className={`absolute top-0 h-px bg-slate-300 ${index === 0 ? "left-1/2 right-0" : "left-0 right-1/2"}`}
                  />
                  <span className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-slate-300" />
                  {child ? (
                    <Subtree
                      node={child}
                      depth={depth + 1}
                      label={side.toUpperCase()}
                      rootGuid={rootGuid}
                      onSelect={onSelect}
                    />
                  ) : (
                    <EmptySlot label={side.toUpperCase()} />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function ShowGenealogy() {
  const { usersGuid } = useParams<{ usersGuid: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // The same page serves the admin panel and the member dashboard; links stay inside whichever one it is opened from.
  const isAdminPage = pathname.startsWith("/admin");
  const basePath = isAdminPage ? "/admin/show-genealogy" : "/dashboard/show-genealogy";

  const ownGuid = user?.user_guid ?? null;
  // With no member in the address the page opens on the logged-in admin's own tree.
  const rootGuid = usersGuid ?? ownGuid;

  const [data, setData] = useState<DownlineResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rootGuid) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getDownline(rootGuid, MAX_LEVELS)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((error: ApiErrorShape) => {
        if (cancelled) return;
        setData(null);
        toast.error(error.message || "Could not load the genealogy.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [rootGuid]);

  const tree = useMemo(() => (data ? buildTree(data) : null), [data]);

  // A full three-level tree can be wider than the page; start with the root in view instead of the far left.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [tree]);

  const openGenealogy = (guid: string) => navigate(`${basePath}/${guid}`);
  const isOwnTree = rootGuid != null && rootGuid === ownGuid;
  const rootName = data ? data.user_name : "";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <IconGradients />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-brand-ink">Show Genealogy</h2>
          <p className="mt-1 text-sm text-slate-500">
            {data
              ? `${rootName} and ${MAX_LEVELS} levels below (${data.total_members} member${data.total_members === 1 ? "" : "s"} shown). Click a member to see their genealogy.`
              : "Click a member to see their genealogy."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* A member's own tree has nothing above it that they may open; deeper in the tree, one level up is always allowed. */}
          {data?.upliner_guid && (isAdminPage || !isOwnTree) && (
            <button
              type="button"
              onClick={() => openGenealogy(data.upliner_guid as string)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-brand-orange hover:text-brand-orange"
            >
              <Icon name="arrowRight" className="w-3.5 h-3.5 -rotate-90" />
              Up one level
            </button>
          )}
          {!isOwnTree && (
            <Link
              to={basePath}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-brand-orange hover:text-brand-orange"
            >
              <Icon name="home" className="w-3.5 h-3.5" />
              My genealogy
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="w-6 h-6 text-brand-orange" />
        </div>
      ) : !tree ? (
        <p className="mt-10 text-sm text-slate-500">This genealogy could not be loaded.</p>
      ) : (
        <div ref={scrollRef} className="mt-8 overflow-x-auto pb-4">
          <div className="mx-auto w-max">
            <Subtree
              node={tree}
              depth={0}
              label={isOwnTree ? "YOU" : "ROOT"}
              rootGuid={tree.guid}
              onSelect={openGenealogy}
            />
          </div>
          {data && data.total_members === 0 && (
            <p className="mt-6 text-center text-sm text-slate-500">No members are placed under {rootName} yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
