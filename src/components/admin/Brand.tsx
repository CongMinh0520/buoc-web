import type { Payload } from "payload";

const brandOf = async (payload: Payload) => {
  const s = await payload.findGlobal({ slug: "site-settings", depth: 0 }).catch(() => null);
  const name = s?.brandName || "BƯỚC";
  return { name, wordmark: s?.wordmark || name };
};

/** Logo lớn ở màn hình đăng nhập — cùng chữ logo với website (Cài đặt chung → Logo chữ) */
export async function Logo({ payload }: { payload: Payload }) {
  const { wordmark } = await brandOf(payload);
  return (
    <div className="buoc-logo">
      <span className="buoc-logo__mark">{wordmark}</span>
      <span className="buoc-logo__rule" />
      <span className="buoc-logo__sub">Quản trị</span>
    </div>
  );
}

/** Icon nhỏ ở thanh điều hướng — giống favicon của website */
export function Icon() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="#141414" />
      <circle cx="16" cy="16" r="6" fill="#fcfbf8" />
    </svg>
  );
}

export function LoginIntro() {
  return <p className="buoc-login-intro">Đăng nhập bằng tài khoản nhân viên để quản lý sản phẩm, đơn hàng và nội dung.</p>;
}
