import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCities, getCountries, getStates } from "../services/sharedService";
import type { LookupOption } from "../types/registration.types";
import type { ApiErrorShape } from "../services/api/httpClient";

export function useLocationData(countryId: string, stateId: string) {
  const [countries, setCountries] = useState<LookupOption[]>([]);
  const [states, setStates] = useState<LookupOption[]>([]);
  const [cities, setCities] = useState<LookupOption[]>([]);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const loadCountries = useCallback(async () => {
    setLoadingCountries(true);
    try {
      const data = await getCountries();
      setCountries(data ?? []);
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Could not load countries.");
      setCountries([]);
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    if (!countryId) {
      setStates([]);
      return;
    }
    let active = true;
    setLoadingStates(true);
    getStates(countryId)
      .then((data) => active && setStates(data ?? []))
      .catch((error: ApiErrorShape) => {
        if (!active) return;
        toast.error(error.message || "Could not load states.");
        setStates([]);
      })
      .finally(() => active && setLoadingStates(false));

    return () => {
      active = false;
    };
  }, [countryId]);

  useEffect(() => {
    if (!stateId) {
      setCities([]);
      return;
    }
    let active = true;
    setLoadingCities(true);
    getCities(stateId)
      .then((data) => active && setCities(data ?? []))
      .catch((error: ApiErrorShape) => {
        if (!active) return;
        toast.error(error.message || "Could not load cities.");
        setCities([]);
      })
      .finally(() => active && setLoadingCities(false));

    return () => {
      active = false;
    };
  }, [stateId]);

  return { countries, states, cities, loadingCountries, loadingStates, loadingCities };
}
