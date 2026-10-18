"""SMTP sink cho kiểm thử E2E: ghi mọi email nhận được ra thư mục (mặc định ./.mail).
Chạy: python3 tests/e2e/smtp-sink.py [port] [thư_mục]   (cần: pip install aiosmtpd)"""
import sys, time, pathlib, asyncio, email
from email import policy
from aiosmtpd.controller import Controller

port = int(sys.argv[1]) if len(sys.argv) > 1 else 2525
out = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ".mail"); out.mkdir(parents=True, exist_ok=True)

class Sink:
    async def handle_DATA(self, server, session, envelope):
        msg = email.message_from_bytes(envelope.original_content or envelope.content, policy=policy.default)
        parts = [p.get_content() for p in msg.walk() if p.get_content_maintype() == "text"]
        name = f"{time.time_ns()}-{envelope.rcpt_tos[0].replace('@', '_at_')}.txt"
        (out / name).write_text(f"To: {msg['To']}\nSubject: {msg['Subject']}\n\n" + "\n".join(parts), encoding="utf-8")
        return "250 OK"

c = Controller(Sink(), hostname="127.0.0.1", port=port); c.start()
print(f"SMTP sink on 127.0.0.1:{port} → {out}", flush=True)
try:
    asyncio.new_event_loop().run_forever()
except KeyboardInterrupt:
    c.stop()
