"use client";
import useSWR from "swr";
const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});
// ========== DASHBOARD ==========
export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR("/api/dashboard", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });
  return { data, error, isLoading, mutate };
}
// ========== MEMBERS ==========
export function useMembers(filters) {
  const params = new URLSearchParams();
  if (filters?.role && filters.role !== "all") params.set("role", filters.role);
  if (filters?.status && filters.status !== "all") params.set("status", filters.status);
  if (filters?.search) params.set("search", filters.search);
  const queryString = params.toString();
  const url = `/api/members${queryString ? `?${queryString}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return { members: data || [], error, isLoading, mutate };
}
export async function createMember(data) {
  const res = await fetch("/api/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create member");
  }
  return res.json();
}
export async function updateMember(id, data) {
  const res = await fetch(`/api/members/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update member");
  }
  return res.json();
}
export async function deleteMember(id) {
  const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete member");
  }
  return res.json();
}
// ========== EVENTS ==========
export function useEvents(filters) {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== "all") params.set("status", filters.status);
  if (filters?.type && filters.type !== "all") params.set("type", filters.type);
  if (filters?.search) params.set("search", filters.search);
  const queryString = params.toString();
  const url = `/api/events${queryString ? `?${queryString}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return { events: data || [], error, isLoading, mutate };
}
export async function createEvent(data) {
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create event");
  }
  return res.json();
}
export async function updateEvent(id, data) {
  const res = await fetch(`/api/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update event");
  }
  return res.json();
}
export async function deleteEvent(id) {
  const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete event");
  }
  return res.json();
}
// ========== ANNOUNCEMENTS ==========
export function useAnnouncements(filters) {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== "all") params.set("category", filters.category);
  if (filters?.search) params.set("search", filters.search);
  const queryString = params.toString();
  const url = `/api/announcements${queryString ? `?${queryString}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return { announcements: data || [], error, isLoading, mutate };
}
export async function createAnnouncement(data) {
  const res = await fetch("/api/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create announcement");
  }
  return res.json();
}
export async function updateAnnouncement(id, data) {
  const res = await fetch(`/api/announcements/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update announcement");
  }
  return res.json();
}
export async function deleteAnnouncement(id) {
  const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete announcement");
  }
  return res.json();
}
// ========== SETTINGS ==========
export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR("/api/settings", fetcher);
  return { settings: data, error, isLoading, mutate };
}
export async function updateSettings(data) {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update settings");
  }
  return res.json();
}

