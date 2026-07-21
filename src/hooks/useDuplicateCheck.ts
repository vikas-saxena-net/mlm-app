import { useCallback, useRef, useState } from "react";
import { checkDuplicate } from "../services/sharedService";
import type { DuplicateCheckField, DuplicateFieldState } from "../types/registration.types";

const IDLE_STATE: DuplicateFieldState = { checking: false, isDuplicate: null, message: "" };

interface UseDuplicateCheckOptions {
  field: DuplicateCheckField;
  isFormatValid: (value: string) => boolean;
  label: string;
}

export function useDuplicateCheck({ field, isFormatValid, label }: UseDuplicateCheckOptions) {
  const [status, setStatus] = useState<DuplicateFieldState>(IDLE_STATE);
  const requestIdRef = useRef(0);

  const check = useCallback(
    async (value: string) => {
      if (!isFormatValid(value)) {
        setStatus(IDLE_STATE);
        return;
      }

      const requestId = ++requestIdRef.current;
      setStatus({ checking: true, isDuplicate: null, message: "" });

      try {
        const isDuplicate = await checkDuplicate(field, value.trim());
        if (requestId !== requestIdRef.current) return;

        setStatus({
          checking: false,
          isDuplicate,
          message: isDuplicate ? `This ${label} is already taken` : `${label} is available`,
        });
      } catch {
        if (requestId !== requestIdRef.current) return;
        setStatus({ checking: false, isDuplicate: null, message: "" });
      }
    },
    [field, isFormatValid, label]
  );

  const reset = useCallback(() => setStatus(IDLE_STATE), []);

  return { status, check, reset };
}
