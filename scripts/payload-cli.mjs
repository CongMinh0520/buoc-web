// Chạy lệnh Payload CLI và xác nhận lệnh thật sự đã chạy xong.
//
// Thỉnh thoảng `payload` CLI (nạp TypeScript qua tsx bằng loader hooks bất đồng bộ của Node) thoát với mã 0
// mà không chạy gì — không log, không tạo bảng. Script này kiểm tra dòng báo thành công trong output;
// nếu thiếu thì chạy lại (tối đa 3 lần), còn lỗi thật (mã thoát khác 0) thì dừng ngay.
//
//   node scripts/payload-cli.mjs migrate     → payload migrate          (chờ "Done.")
//   node scripts/payload-cli.mjs seed        → payload run src/seed     (chờ "Seed xong")
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const tasks = {
  migrate: { args: ["migrate"], ok: /Done\./ },
  seed: { args: ["run", "src/seed/index.ts"], ok: /Seed xong/ },
};
const name = process.argv[2];
const task = tasks[name];
if (!task) {
  console.error(`Dùng: node scripts/payload-cli.mjs <${Object.keys(tasks).join("|")}>`);
  process.exit(1);
}
const bin = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "node_modules", "payload", "bin.js");

const runOnce = () =>
  new Promise((resolve) => {
    let out = "";
    const child = spawn(process.execPath, [bin, ...task.args], { stdio: ["inherit", "pipe", "pipe"], env: process.env });
    child.stdout.on("data", (d) => {
      out += d;
      process.stdout.write(d);
    });
    child.stderr.on("data", (d) => {
      out += d;
      process.stderr.write(d);
    });
    child.on("close", (code) => resolve({ code: code ?? 1, ok: task.ok.test(out) }));
  });

for (let attempt = 1; attempt <= 3; attempt++) {
  const { code, ok } = await runOnce();
  if (code !== 0) process.exit(code);
  if (ok) process.exit(0);
  console.warn(`\n⚠ payload ${task.args.join(" ")} thoát mà không chạy lệnh (lần ${attempt}/3)${attempt < 3 ? " — chạy lại…" : ""}\n`);
}
console.error(`✗ payload ${task.args.join(" ")} không hoàn tất sau 3 lần thử.`);
process.exit(1);
