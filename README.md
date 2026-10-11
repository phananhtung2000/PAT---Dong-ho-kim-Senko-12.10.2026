# Hướng dẫn deploy Đồng hồ kim Seiko lên GitHub Pages + cài đặt app

## 1. Đưa 6 file lên GitHub
1. Tạo **repo riêng** cho phần mềm này (public), ví dụ `dong-ho-kim-seiko` (không dùng repo `<user>.github.io`).
2. Đẩy 6 file `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` lên **thư mục gốc** của repo (không lồng thư mục con).
3. Settings → Pages → Source: branch `main`, thư mục `/ (root)` → Save.
4. Đợi vài phút rồi mở `https://<username>.github.io/dong-ho-kim-seiko/`.

Vì `start_url` và `scope` dùng đường dẫn tương đối nên không cần sửa gì dù URL có dạng `username.github.io/ten-repo/`.

## 2. Cài trên Android (Chrome)
Mở link → menu 3 chấm → "Cài đặt ứng dụng" / "Thêm vào Màn hình chính".

## 3. Cài trên Windows 11 (Edge/Chrome)
Mở link → bấm icon "Cài đặt" trên thanh địa chỉ (hoặc menu → Ứng dụng → Cài đặt trang này như một ứng dụng).

## 4. Kiểm tra chuẩn PWA
DevTools (F12) → tab Lighthouse → chọn "Progressive Web App" → Analyze.

## 5. Cập nhật phiên bản
Chỉ đổi `v1` → `v2` trong `CACHE_NAME` của `sw.js` và thay `index.html`. Giữ nguyên `id`, `start_url`, `scope`, tên file icon.

## 6. Nhiều app cùng domain
Mỗi app cài được nằm ở **repo riêng** (scope anh em, không lồng nhau). Không đặt portal ở repo `<user>.github.io`; portal dùng repo dự án (vd. `/pat-portal/`).

## 7. Nếu Chrome Android báo "Ứng dụng này đã được cài đặt rồi" nhưng không mở được
1. **Sao lưu** dữ liệu trong app trước (Cài đặt → Xuất cài đặt); không bấm nút Đặt lại.
2. Vào Cài đặt → Ứng dụng, gỡ mục "Đồng hồ kim Seiko" (và portal nếu có).
3. Đóng hẳn Chrome rồi mở lại link.
4. Nếu Chrome vẫn không hiện "Cài đặt ứng dụng", kiểm tra scope/id theo mục 6.
5. Chỉ khi vẫn kẹt mới xoá dữ liệu Chrome hoặc gỡ cài lại — cách này xoá luôn localStorage/IndexedDB của mọi app trên domain, nên bắt buộc sao lưu trước.

## Lưu ý
- File vẫn mở được bằng double-click (`file://`), chạy offline, service worker tự bỏ qua.
- Dữ liệu (localStorage/IndexedDB: `seiko_bgdb`, `seiko_audio`) không bị service worker đụng tới.
