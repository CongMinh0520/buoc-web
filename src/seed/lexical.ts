// Dựng JSON cho trình soạn thảo Lexical của Payload từ dữ liệu thô (dùng khi seed)
let counter = 0;
const id = () => `seed${(++counter).toString(36)}${Date.now().toString(36)}`;

const text = (t: string) => ({ type: "text", text: t, format: 0, style: "", mode: "normal", detail: 0, version: 1 });
const base = { format: "", indent: 0, version: 1, direction: "ltr" as const };

export const p = (t: string) => ({ ...base, type: "paragraph", textFormat: 0, textStyle: "", children: [text(t)] });
export const h = (t: string, tag: "h2" | "h3" = "h2") => ({ ...base, type: "heading", tag, children: [text(t)] });
export const list = (items: string[], ordered = false) => ({
  ...base,
  type: "list",
  listType: ordered ? "number" : "bullet",
  tag: ordered ? "ol" : "ul",
  start: 1,
  children: items.map((t, i) => ({ ...base, type: "listitem", value: i + 1, children: [text(t)] })),
});
export const block = (blockType: string, fields: Record<string, unknown>) => ({
  type: "block",
  format: "",
  version: 2,
  fields: { id: id(), blockName: "", blockType, ...fields },
});

export const root = (children: unknown[]) => ({ root: { ...base, type: "root", children } });
