import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type {
  ApiResponse,
  CityListItem,
  CreateCityRequest,
  CreateStateRequest,
  DuplicateCheckField,
  DuplicateCheckResponse,
  LookupOption,
  PaymentStatusResponse,
  RawLookupItem,
  StateListItem,
  UserDetailsResponse,
} from "../types/registration.types";

function toLookupOptions(items: RawLookupItem[] | null): LookupOption[] {
  return (items ?? [])
    .filter((item) => Boolean(item.guid))
    .map((item) => ({ id: item.guid, name: item.name ?? item.code ?? item.guid }));
}

export async function getSponsorDetails(userCode: string): Promise<UserDetailsResponse> {
  const response = await httpClient.get<ApiResponse<UserDetailsResponse>>(
    `/shared/getuserdetails/${encodeURIComponent(userCode)}`
  );
  return unwrapApiResponse(response.data);
}

export async function checkDuplicate(field: DuplicateCheckField, value: string): Promise<boolean> {
  const response = await httpClient.get<ApiResponse<DuplicateCheckResponse>>("/shared/check-duplicate", {
    params: { [field]: value },
  });
  const data = unwrapApiResponse(response.data);

  if (field === "userName") return Boolean(data?.userNameExists);
  if (field === "emailId") return Boolean(data?.emailExists);
  return Boolean(data?.mobileNumberExists);
}

export async function getCountries(): Promise<LookupOption[]> {
  const response = await httpClient.get<ApiResponse<RawLookupItem[]>>("/shared/countries");
  return toLookupOptions(unwrapApiResponse(response.data));
}

export async function getStates(countryGuid: string): Promise<LookupOption[]> {
  const response = await httpClient.get<ApiResponse<RawLookupItem[]>>(
    `/shared/states/${encodeURIComponent(countryGuid)}`
  );
  return toLookupOptions(unwrapApiResponse(response.data));
}

export async function getCities(stateGuid: string): Promise<LookupOption[]> {
  const response = await httpClient.get<ApiResponse<RawLookupItem[]>>(
    `/shared/cities/${encodeURIComponent(stateGuid)}`
  );
  return toLookupOptions(unwrapApiResponse(response.data));
}

export async function createState(payload: CreateStateRequest): Promise<string> {
  const response = await httpClient.post<ApiResponse<string>>("/shared/states", payload);
  return unwrapApiResponse(response.data);
}

export async function createCity(payload: CreateCityRequest): Promise<string> {
  const response = await httpClient.post<ApiResponse<string>>("/shared/cities", payload);
  return unwrapApiResponse(response.data);
}

export async function getAllStates(): Promise<StateListItem[]> {
  const response = await httpClient.get<ApiResponse<StateListItem[]>>("/shared/states");
  return unwrapApiResponse(response.data) ?? [];
}

export async function getAllCities(): Promise<CityListItem[]> {
  const response = await httpClient.get<ApiResponse<CityListItem[]>>("/shared/cities");
  return unwrapApiResponse(response.data) ?? [];
}

export async function deleteState(guid: string): Promise<unknown> {
  const response = await httpClient.delete<ApiResponse<unknown>>(`/shared/states/${encodeURIComponent(guid)}`);
  return unwrapApiResponse(response.data);
}

export async function deleteCity(guid: string): Promise<unknown> {
  const response = await httpClient.delete<ApiResponse<unknown>>(`/shared/cities/${encodeURIComponent(guid)}`);
  return unwrapApiResponse(response.data);
}

export async function getPaymentStatuses(): Promise<PaymentStatusResponse[]> {
  const response = await httpClient.get<ApiResponse<PaymentStatusResponse[]>>("/shared/payment-statuses");
  return unwrapApiResponse(response.data) ?? [];
}
