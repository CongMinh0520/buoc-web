// Chuẩn bị môi trường local: tạo .env từ .env.example và sinh PAYLOAD_SECRET ngẫu nhiên.
// Chạy: npm run setup   (an toàn khi chạy lại — không ghi đè giá trị đã có)
import { existsSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const created = !existsSync(".env");
if (created) copyFileSync(".env.example", ".env");

let env = readFileSync(".env", "utf8");
const current = env.match(/^PAYLOAD_SECRET=(.*)$/m)?.[1]?.trim() ?? "";
if (current.length < 32) {
  const secret = randomBytes(48).toString("base64url");
  env = /^PAYLOAD_SECRET=.*$/m.test(env) ? env.replace(/^PAYLOAD_SECRET=.*$/m, `PAYLOAD_SECRET=${secret}`) : `${env}\nPAYLOAD_SECRET=${secret}\n`;
  writeFileSync(".env", env);
  console.log("✓ Đã sinh PAYLOAD_SECRET ngẫu nhiên");
}
console.log(created ? "✓ Đã tạo .env từ .env.example" : "✓ .env đã có sẵn — giữ nguyên các giá trị khác");
console.log(`
Bước tiếp theo:
  npm run db:up     # Postgres qua Docker (hoặc tự cài Postgres rồi sửa DATABASE_URI trong .env)
  npm run seed      # tạo dữ liệu mẫu, in mật khẩu admin
  npm run dev       # http://localhost:3000  ·  admin: http://localhost:3000/admin
`);
