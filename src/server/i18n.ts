import { headers } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

/**
 * Ngôn ngữ của server action / route handler (không dùng được next/root-params ở đây):
 * suy ra từ trang đã gửi request (header Referer) — /en/… là tiếng Anh, còn lại tiếng Việt.
 */
export async function requestLocale(): Promise<Locale> {
  try {
    const ref = (await headers()).get("referer");
    if (!ref) return defaultLocale;
    const first = new URL(ref).pathname.split("/")[1];
    return isLocale(first) ? first : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

/**
 * Câu thông báo phía server viết bằng tiếng Việt (nguồn chuẩn) và được dịch khi trang đang ở tiếng Anh.
 * Thêm câu mới ở server thì thêm bản dịch vào đây; câu chưa có bản dịch sẽ hiện nguyên tiếng Việt.
 */
const EN: Record<string, string> = {
  "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.": "Too many attempts. Please try again in a few minutes.",
  "Dữ liệu không hợp lệ": "Invalid data",
  "Yêu cầu không hợp lệ": "Invalid request",
  "Thông tin chưa hợp lệ": "Some details are not valid",
  "Email không hợp lệ": "Invalid email address",
  "Email hoặc mật khẩu không đúng.": "Incorrect email or password.",
  "Mật khẩu cần ít nhất 8 ký tự": "Password must be at least 8 characters",
  "Mật khẩu mới cần ít nhất 8 ký tự": "New password must be at least 8 characters",
  "Mật khẩu cần có chữ": "Password must contain a letter",
  "Mật khẩu cần có số": "Password must contain a number",
  "Mật khẩu xác nhận không khớp": "Passwords do not match",
  "Mật khẩu hiện tại không đúng.": "Current password is incorrect.",
  "Mật khẩu không đúng.": "Incorrect password.",
  "Nhập mật khẩu hiện tại": "Enter your current password",
  "Nhập mật khẩu để xác nhận": "Enter your password to confirm",
  'Gõ chữ "XÓA" để xác nhận': 'Type "XÓA" to confirm',
  "Mã OTP gồm 6 chữ số": "The code has 6 digits",
  "Mã OTP không đúng hoặc đã hết hạn.": "The code is incorrect or has expired.",
  "Vui lòng đợi 60 giây trước khi gửi lại mã.": "Please wait 60 seconds before requesting a new code.",
  "Không gửi được email xác minh lúc này. Vui lòng thử lại sau ít phút.": "We couldn't send the verification email right now. Please try again in a few minutes.",
  "Không thể đăng ký với email này. Nếu bạn đã có tài khoản, hãy đăng nhập hoặc dùng Quên mật khẩu.":
    "We couldn't create an account with this email. If you already have one, sign in or use Forgot password.",
  "Tài khoản chưa xác minh email. Vui lòng nhập mã OTP đã gửi tới email của bạn.": "Your email isn't verified yet. Please enter the code we sent to your inbox.",
  "Tài khoản tạm khóa do đăng nhập sai nhiều lần. Thử lại sau 10 phút.": "Account temporarily locked after too many failed sign-ins. Try again in 10 minutes.",
  "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.": "Your session has expired. Please sign in again.",
  "Phiên đặt lại mật khẩu đã hết hạn. Vui lòng làm lại.": "Your password reset session has expired. Please start again.",
  "Chưa đăng nhập": "Not signed in",
  "Vui lòng nhập họ tên": "Please enter your full name",
  "Vui lòng nhập tên": "Please enter your name",
  "Vui lòng đồng ý với chính sách bảo mật để tạo tài khoản": "Please accept the privacy policy to create an account",
  "Số điện thoại không hợp lệ": "Invalid phone number",
  "Nhập tên địa chỉ": "Enter a name for this address",
  "Nhập họ tên người nhận": "Enter the recipient's full name",
  "Nhập địa chỉ cụ thể": "Enter the street address",
  "Nhập tỉnh / thành phố": "Enter the province / city",
  "Nhập phường / xã": "Enter the ward / commune",
  "Giỏ hàng trống": "Your bag is empty",
  "Giỏ hàng không hợp lệ": "Your bag is not valid",
  "Sản phẩm không còn bán": "No longer available",
  "Phân loại không tồn tại": "This colour/size no longer exists",
  "Đã hết hàng": "Sold out",
  "Vui lòng nhập tên người nhận": "Please enter the recipient's name",
  "Vui lòng nhập địa chỉ": "Please enter an address",
  "Vui lòng nhập phường / xã": "Please enter the ward / commune",
  "Vui lòng nhập tỉnh / thành phố": "Please enter the province / city",
  "Vui lòng đồng ý với điều kiện giao dịch chung trước khi đặt hàng": "Please accept the general terms of sale before placing your order",
  "Vui lòng nhập tên công ty": "Please enter the company name",
  "Mã số thuế gồm 10 chữ số (hoặc 10 số + 3 số chi nhánh)": "The tax code has 10 digits (or 10 digits + a 3-digit branch code)",
  "Vui lòng nhập địa chỉ công ty": "Please enter the company address",
  "Email nhận hóa đơn không hợp lệ": "Invalid invoice email address",
  "Không kết nối được MoMo. Vui lòng thử lại hoặc chọn phương thức khác.": "Couldn't connect to MoMo. Please try again or choose another method.",
  "VNPay chưa được cấu hình.": "VNPay is not configured.",
  "MoMo chưa được cấu hình.": "MoMo is not configured.",
  "Liên kết không hợp lệ.": "Invalid link.",
  "Đơn hàng không còn chờ thanh toán.": "This order is no longer awaiting payment.",
  "Đơn hàng đã quá hạn thanh toán. Vui lòng đặt lại.": "The payment window for this order has expired. Please order again.",
  "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại.": "Order not found. Please check the order number and phone number.",
  "Buổi hoặc cửa hàng không hợp lệ.": "Invalid session or store.",
};

/** Câu có phần biến đổi (số lượng, tên sản phẩm…) */
const EN_PATTERNS: [RegExp, (...m: string[]) => string][] = [
  [/^Chỉ còn (\d+) đôi$/, (n) => `Only ${n} ${n === "1" ? "pair" : "pairs"} left`],
  [/^MoMo từ chối giao dịch: (.*)$/, (r) => `MoMo declined the transaction: ${r}`],
  [/^(.*) \((.*), size (.*)\): (.*)\. Vui lòng cập nhật giỏ hàng\.$/, (name, color, size, problem) => `${name} (${color}, size ${size}): ${toEnglish(problem)}. Please update your bag.`],
];

function toEnglish(msg: string): string {
  if (EN[msg]) return EN[msg];
  for (const [re, fn] of EN_PATTERNS) {
    const m = msg.match(re);
    if (m) return fn(...m.slice(1));
  }
  return msg;
}

/** Dịch câu thông báo theo ngôn ngữ của request */
export async function tr(msg: string): Promise<string> {
  return (await requestLocale()) === "en" ? toEnglish(msg) : msg;
}

/** Kết quả lỗi của server action, đã dịch theo ngôn ngữ của trang */
export async function fail(msg: string) {
  return { ok: false as const, error: await tr(msg) };
}
