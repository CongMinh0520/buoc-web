// Định dạng thủ công để server và trình duyệt luôn ra cùng một chuỗi (tránh lệch hydration).
export const formatNumber = (n: number) => String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const formatVnd = (n: number) => formatNumber(n) + " ₫";

/** Ngày theo giờ Việt Nam, dạng dd/MM/yyyy */
export const formatDate = (iso: string | null | undefined) => {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + 7 * 3600 * 1000);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getUTCFullYear()}`;
};

export const formatPeriod = (start: string, end: string) => {
  const s = formatDate(start).slice(0, 5).replace("/", ".");
  const e = formatDate(end).replace(/\//g, ".");
  return `${s} — ${e}`;
};
