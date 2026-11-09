import { supabase } from "@/integrations/supabase/client";

export type PriceRow = { id: string; name: string; description: string | null; price_hint: string | null; duration_minutes: number };
export type GalleryItem = { id: string; title: string; description: string | null; before: string; after: string };
export type Review = { id: string; display_name: string; rating: number; comment: string; created_at: string };

export async function fetchPrices(): Promise<PriceRow[]> {
  const { data, error } = await supabase
    .from("service_catalog")
    .select("id, name, description, price_hint, duration_minutes")
    .eq("active", true)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("before_after")
    .select("id, title, description, before_path, after_path")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = data ?? [];
  if (rows.length === 0) return [];
  const paths = rows.flatMap((r) => [r.before_path, r.after_path]);
  const { data: signed } = await supabase.storage.from("gallery").createSignedUrls(paths, 60 * 60 * 6);
  const map = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    before: map.get(r.before_path) ?? "",
    after: map.get(r.after_path) ?? "",
  }));
}

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, display_name, rating, comment, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}
