import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { getUserProfile, updateUserRegistration } from "../../services/registrationService";
import { getCities, getCountries, getStates } from "../../services/sharedService";
import { uploadDocuments, resolveDocumentUrl } from "../../services/documentsService";
import { isMobileFormatValid } from "../../validation/registrationSchema";
import { isValidAadhaarNumber } from "../../utils/aadhaar";
import { isValidPanNumber } from "../../utils/pan";
import { getMaxDobForMinAge } from "../../utils/date";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { LookupOption } from "../../types/registration.types";

const MAX_DOB = getMaxDobForMinAge(18);
const GENDER_OPTIONS = ["Male", "Female", "Other"];

interface ProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: string;
  dob: string;
  fatherName: string;
  aadhar: string;
  pancard: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
}

const EMPTY_FORM: ProfileFormState = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  gender: "",
  dob: "",
  fatherName: "",
  aadhar: "",
  pancard: "",
  address1: "",
  address2: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
};

interface DocumentStatus {
  aadharFront: string | null;
  aadharBack: string | null;
  pancardUrl: string | null;
}

const EMPTY_DOCUMENTS: DocumentStatus = {
  aadharFront: null,
  aadharBack: null,
  pancardUrl: null,
};

export default function EditProfile() {
  const { user } = useAuth();
  const { usersGuid: paramUsersGuid } = useParams<{ usersGuid?: string }>();
  const isEditingOther = Boolean(paramUsersGuid) && paramUsersGuid !== user?.user_guid;
  const targetUserGuid = paramUsersGuid || user?.user_guid;

  const [activeTab, setActiveTab] = useState<"profile" | "documents">("profile");
  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM);
  const [usersGuid, setUsersGuid] = useState<string | null>(null);
  const [profileRoleGuid, setProfileRoleGuid] = useState<string | null>(null);
  const [profileUserName, setProfileUserName] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormState, string>>>({});

  const [countries, setCountries] = useState<LookupOption[]>([]);
  const [states, setStates] = useState<LookupOption[]>([]);
  const [cities, setCities] = useState<LookupOption[]>([]);

  const [documents, setDocuments] = useState<DocumentStatus>(EMPTY_DOCUMENTS);

  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch((error: ApiErrorShape) => {
        toast.error(error.message || "Could not load countries.");
        setCountries([]);
      });
  }, []);

  useEffect(() => {
    if (!form.country) {
      setStates([]);
      return;
    }
    getStates(form.country)
      .then(setStates)
      .catch((error: ApiErrorShape) => {
        toast.error(error.message || "Could not load states.");
        setStates([]);
      });
  }, [form.country]);

  useEffect(() => {
    if (!form.state) {
      setCities([]);
      return;
    }
    getCities(form.state)
      .then(setCities)
      .catch((error: ApiErrorShape) => {
        toast.error(error.message || "Could not load cities.");
        setCities([]);
      });
  }, [form.state]);

  useEffect(() => {
    if (!targetUserGuid) {
      setLoadingProfile(false);
      return;
    }
    setLoadingProfile(true);
    getUserProfile(targetUserGuid)
      .then((profile) => {
        setUsersGuid(profile.usersGuid);
        setProfileRoleGuid(profile.role_guid ?? null);
        setProfileUserName(profile.userName ?? null);
        setForm({
          firstName: profile.userFirstName ?? "",
          lastName: profile.userLastName ?? "",
          email: profile.emailId ?? "",
          mobile: profile.mobileNumber ? String(profile.mobileNumber) : "",
          gender: profile.gender ?? "",
          dob: profile.dob ? profile.dob.slice(0, 10) : "",
          fatherName: profile.fatherName ?? "",
          aadhar: profile.aadhar ?? "",
          pancard: profile.pancard ?? "",
          address1: profile.address1 ?? "",
          address2: profile.address2 ?? "",
          country: profile.country ?? "",
          state: profile.state ?? "",
          city: profile.city ?? "",
          pincode: profile.pincode ?? "",
        });
        setDocuments({
          aadharFront: profile.aadhar_front ?? null,
          aadharBack: profile.aadhar_back ?? null,
          pancardUrl: profile.pancard_url ?? null,
        });
      })
      .catch((error: ApiErrorShape) => {
        toast.error(error.message || "Could not load your existing profile details.");
      })
      .finally(() => setLoadingProfile(false));
  }, [targetUserGuid]);

  const update = (field: keyof ProfileFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      [field]: value,
      ...(field === "country" ? { state: "", city: "" } : {}),
      ...(field === "state" ? { city: "" } : {}),
    }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof ProfileFormState, string>> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.mobile.trim() || !isMobileFormatValid(form.mobile)) next.mobile = "Enter a valid 10-digit mobile number";
    if (!form.gender) next.gender = "Please select a gender";
    if (!form.dob) next.dob = "Date of birth is required";
    if (!form.fatherName.trim()) next.fatherName = "Father's name is required";
    if (form.aadhar && !isValidAadhaarNumber(form.aadhar)) next.aadhar = "Enter a valid Aadhaar number";
    if (form.pancard && !isValidPanNumber(form.pancard)) next.pancard = "Enter a valid PAN number (e.g. ABCDE1234F)";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!usersGuid) {
      toast.error("Could not determine your account ID. Please re-login and try again.");
      return;
    }
    if (!validate()) return;

    setSaving(true);
    try {
      await updateUserRegistration(usersGuid, {
        userFirstName: form.firstName.trim(),
        userLastName: form.lastName.trim(),
        emailId: form.email.trim(),
        emailVerify: false,
        mobileNumber: Number(form.mobile.trim()),
        mobileVerify: false,
        gender: form.gender,
        dob: form.dob,
        fatherName: form.fatherName.trim(),
        aadhar: form.aadhar.trim() || undefined,
        pancard: form.pancard.trim().toUpperCase() || undefined,
        address1: form.address1.trim() || undefined,
        address2: form.address2.trim() || undefined,
        country: form.country || undefined,
        state: form.state || undefined,
        city: form.city || undefined,
        pincode: form.pincode.trim() || undefined,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const [aadharFrontFile, setAadharFrontFile] = useState<File | null>(null);
  const [aadharBackFile, setAadharBackFile] = useState<File | null>(null);
  const [pancardFile, setPancardFile] = useState<File | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState(false);

  const handleDocumentsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const roleGuid = profileRoleGuid || user?.role_guid;
    if (!usersGuid || !roleGuid) {
      toast.error("Could not determine the account ID. Please re-login and try again.");
      return;
    }
    if (!aadharFrontFile && !aadharBackFile && !pancardFile) {
      toast.error("Please choose at least one document to upload.");
      return;
    }

    setUploadingDocs(true);
    try {
      const result = await uploadDocuments({
        usersGuid,
        roleGuid,
        aadharFront: aadharFrontFile,
        aadharBack: aadharBackFile,
        pancard: pancardFile,
      });
      setDocuments({
        aadharFront: result.aadhar_front ?? documents.aadharFront,
        aadharBack: result.aadhar_back ?? documents.aadharBack,
        pancardUrl: result.pancard_url ?? documents.pancardUrl,
      });
      setAadharFrontFile(null);
      setAadharBackFile(null);
      setPancardFile(null);
      toast.success("Documents uploaded successfully!");
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Failed to upload documents. Please try again.");
    } finally {
      setUploadingDocs(false);
    }
  };

  const inputClass = (field: keyof ProfileFormState) =>
    `mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 focus:border-brand-orange focus:ring-brand-orange/20"
    }`;

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-16">
        <Spinner className="w-6 h-6 text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      {isEditingOther ? (
        <>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-orange"
          >
            <Icon name="arrowRight" className="w-3.5 h-3.5 rotate-180" />
            Back to All Users
          </Link>
          <h2 className="mt-3 text-xl font-bold text-brand-ink">
            Edit Profile — {profileUserName || "User"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Viewing and editing this member's profile details and identity documents.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-brand-ink">My Account</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your profile details and identity documents.</p>
        </>
      )}

      <div className="mt-6 flex gap-2 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2.5 text-sm font-bold transition ${
            activeTab === "profile"
              ? "border-b-2 border-brand-orange text-brand-orange"
              : "text-slate-500 hover:text-brand-ink"
          }`}
        >
          Edit Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2.5 text-sm font-bold transition ${
            activeTab === "documents"
              ? "border-b-2 border-brand-orange text-brand-orange"
              : "text-slate-500 hover:text-brand-ink"
          }`}
        >
          Upload Document
        </button>
      </div>

      {activeTab === "profile" && (
      <form onSubmit={handleSubmit} className="mt-6 grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-semibold text-brand-ink">First Name</label>
          <input className={inputClass("firstName")} value={form.firstName} onChange={update("firstName")} />
          {errors.firstName && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Last Name</label>
          <input className={inputClass("lastName")} value={form.lastName} onChange={update("lastName")} />
          {errors.lastName && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.lastName}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Email</label>
          <input type="email" className={inputClass("email")} value={form.email} onChange={update("email")} />
          {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Mobile Number</label>
          <input
            type="tel"
            maxLength={10}
            className={inputClass("mobile")}
            value={form.mobile}
            onChange={update("mobile")}
          />
          {errors.mobile && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.mobile}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Gender</label>
          <select className={inputClass("gender")} value={form.gender} onChange={update("gender")}>
            <option value="">Select...</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {errors.gender && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.gender}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Date of Birth</label>
          <input type="date" max={MAX_DOB} className={inputClass("dob")} value={form.dob} onChange={update("dob")} />
          {errors.dob && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.dob}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Father's Name</label>
          <input className={inputClass("fatherName")} value={form.fatherName} onChange={update("fatherName")} />
          {errors.fatherName && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.fatherName}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Aadhaar Number</label>
          <input
            maxLength={12}
            inputMode="numeric"
            className={inputClass("aadhar")}
            value={form.aadhar}
            onChange={update("aadhar")}
          />
          {errors.aadhar && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.aadhar}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">PAN Card Number</label>
          <input
            maxLength={10}
            style={{ textTransform: "uppercase" }}
            className={inputClass("pancard")}
            value={form.pancard}
            onChange={update("pancard")}
          />
          {errors.pancard && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.pancard}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-brand-ink">Address Line 1</label>
          <input className={inputClass("address1")} value={form.address1} onChange={update("address1")} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-brand-ink">Address Line 2</label>
          <input className={inputClass("address2")} value={form.address2} onChange={update("address2")} />
        </div>

        <div>
          <label className="text-sm font-semibold text-brand-ink">Country</label>
          <select className={inputClass("country")} value={form.country} onChange={update("country")}>
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">State</label>
          <select
            className={inputClass("state")}
            value={form.state}
            onChange={update("state")}
            disabled={!form.country}
          >
            <option value="">Select state</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">City</label>
          <select className={inputClass("city")} value={form.city} onChange={update("city")} disabled={!form.state}>
            <option value="">Select city</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Pincode</label>
          <input maxLength={10} className={inputClass("pincode")} value={form.pincode} onChange={update("pincode")} />
        </div>

        <div className="sm:col-span-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <>
                <Spinner className="w-4 h-4" />
                Saving...
              </>
            ) : (
              <>
                Save Changes
                <Icon name="arrowRight" className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
      )}

      {activeTab === "documents" && (
        <form onSubmit={handleDocumentsSubmit} className="mt-6 grid sm:grid-cols-2 gap-5">
          <DocumentSlot
            label="Aadhaar Front"
            existingUrl={documents.aadharFront}
            file={aadharFrontFile}
            onChange={setAadharFrontFile}
          />
          <DocumentSlot
            label="Aadhaar Back"
            existingUrl={documents.aadharBack}
            file={aadharBackFile}
            onChange={setAadharBackFile}
          />
          <DocumentSlot
            label="PAN Card"
            existingUrl={documents.pancardUrl}
            file={pancardFile}
            onChange={setPancardFile}
          />

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={uploadingDocs}
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {uploadingDocs ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Uploading...
                </>
              ) : (
                <>
                  Upload
                  <Icon name="arrowRight" className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

interface DocumentSlotProps {
  label: string;
  existingUrl: string | null;
  file: File | null;
  onChange: (file: File | null) => void;
}

function DocumentSlot({ label, existingUrl, file, onChange }: DocumentSlotProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-brand-ink">{label}</label>
        {existingUrl ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600">
            <Icon name="check" className="w-3.5 h-3.5" />
            Uploaded
          </span>
        ) : (
          <span className="text-xs font-bold text-slate-400">Not uploaded</span>
        )}
      </div>

      {existingUrl && (
        <a
          href={resolveDocumentUrl(existingUrl)}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block text-xs font-semibold text-brand-orange hover:underline"
        >
          View current document
        </a>
      )}

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-600 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
      />
      {file && <p className="mt-1.5 text-xs text-slate-500">Selected: {file.name}</p>}
      {!existingUrl && !file && (
        <p className="mt-1.5 text-xs text-slate-400">Choose a file to upload {label.toLowerCase()}.</p>
      )}
    </div>
  );
}
