import { useCallback, useRef, useState } from "react";
import { getSponsorDetails } from "../services/sharedService";
import type { SponsorVerificationState } from "../types/registration.types";

const IDLE_STATE: SponsorVerificationState = {
  verifying: false,
  verified: false,
  sponsorGuid: null,
  sponsorName: null,
  error: null,
};

export function useSponsorVerification() {
  const [state, setState] = useState<SponsorVerificationState>(IDLE_STATE);
  const requestIdRef = useRef(0);

  const verify = useCallback(async (sponsorId: string): Promise<boolean> => {
    const trimmed = sponsorId.trim();
    if (!trimmed) {
      setState(IDLE_STATE);
      return false;
    }

    const requestId = ++requestIdRef.current;
    setState({ ...IDLE_STATE, verifying: true });

    try {
      const sponsor = await getSponsorDetails(trimmed);
      if (requestId !== requestIdRef.current) return false;

      if (!sponsor?.usersGuid) {
        setState({
          ...IDLE_STATE,
          error: "Invalid Sponsor ID. Please enter a valid Sponsor ID.",
        });
        return false;
      }

      setState({
        verifying: false,
        verified: true,
        sponsorGuid: sponsor.usersGuid,
        sponsorName: `${sponsor.userFirstName ?? ""} ${sponsor.userLastName ?? ""}`.trim(),
        error: null,
      });
      return true;
    } catch {
      if (requestId !== requestIdRef.current) return false;
      setState({
        ...IDLE_STATE,
        error: "Invalid Sponsor ID. Please enter a valid Sponsor ID.",
      });
      return false;
    }
  }, []);

  const reset = useCallback(() => setState(IDLE_STATE), []);

  return { state, verify, reset };
}
