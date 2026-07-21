import { useCallback, useEffect, useState } from "react";
import { getCities, getCountries, getStates } from "../services/sharedService";
import type { LookupOption } from "../types/registration.types";

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
    } catch {
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
      .catch(() => active && setStates([]))
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
      .catch(() => active && setCities([]))
      .finally(() => active && setLoadingCities(false));

    return () => {
      active = false;
    };
  }, [stateId]);

  return { countries, states, cities, loadingCountries, loadingStates, loadingCities };
}
