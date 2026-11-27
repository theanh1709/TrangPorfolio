# Yêu cầu thiết kế UI: Portfolio Lê Thùy Trang

Phiên bản: 27/11/2026. Dùng kèm `Tai_lieu_ky_thuat_Portfolio_LeThuyTrang.md` (cấu trúc file, dữ liệu, build). File này chỉ quy định **giao diện**: nhìn thế nào, phản hồi ra sao, co giãn thế nào.

---

## 1. Định hướng thiết kế

| Hạng mục | Yêu cầu |
| --- | --- |
| Cảm giác chung | Sạch, ấm, tự tin, như một cuốn brand guideline được biên tập kỹ |
| Phong cách nền | Design skill "Clean": nhiều khoảng trắng, mỗi khối một ý, giao diện lùi lại để nội dung nổi lên |
| Chất liệu đặc trưng | Liquid glass (kính mờ có đốm sáng theo con trỏ) trên nền beige có quầng màu trôi chậm |
| Nhịp trang | Các mục xen kẽ nền beige, trắng và đen để mắt có chỗ nghỉ |
| Nguyên tắc thông tin | Thông tin chính luôn hiện sẵn. Tooltip, hộp mở rộng và trang chi tiết chỉ bổ sung, người đọc không bắt buộc phải mở |
| Giọng văn trên UI | Tiếng Việt, xưng "tôi", câu ngắn, viết hoa kiểu câu (không viết hoa toàn bộ nhãn) |

**Không làm:**
- Nhãn chữ in hoa giãn chữ phía trên tiêu đề.
- Tô màu riêng một từ trong tiêu đề.
- Đánh số 01/02/03 cho nội dung không phải trình tự.
- Gradient tím, emoji làm icon.
- Mọi thẻ cùng một bóng đổ xám.
- Hiệu ứng nảy (bounce).
- `transition: all`.

---

## 2. Màu sắc

### 2.1 Bảng màu chính

| Tên | Token | HEX | Vai trò |
| --- | --- | --- | --- |
| Beige | `--bg` | `#EADFCF` | Nền chủ đạo |
| Beige nhạt | `--bg2` | `#F3ECE1` | Nền tag, ô kỹ năng, thẻ kinh nghiệm |
| Trắng giấy | `--paper` | `#FFFFFF` | Dải nền trắng |
| Mực | `--ink` | `#161412` | Chữ chính, nút chính, pill ngành |
| Chữ phụ | `--muted` | `#574E44` | Mô tả, chú thích |
| Camel | `--camel` | `#7A5A3A` | Nhãn mục, chấm nhấn, icon, viền focus |
| Đường kẻ | `--line` | `rgba(22,20,18,.12)` | Viền mảnh, phân cách |
| Đêm | `--night` | `#121110` | Dải nền đen |
| Chữ trên nền đêm | `--night-ink` | `#F2EADD` | Chữ trên dải đen |

### 2.2 Màu trong dải nền đen `.night`

| Token | Giá trị |
| --- | --- |
| `--ink` | `#F2EADD` |
| `--muted` | `#BDB2A3` |
| `--camel` | `#D6B48E` |
| `--line` | `rgba(242,234,221,.14)` |
| `--glass` | `rgba(255,255,255,.06)` |
| `--glass-strong` | `rgba(255,255,255,.08)` |

Thêm một vầng sáng `radial-gradient(#5A4632, transparent 65%)`, đường kính 60vw, ở góc trên phải mỗi dải đen.

### 2.3 Màu chức năng và màu riêng

| Dùng cho | Màu |
| --- | --- |
| Chấm trạng thái "Sẵn sàng" | `#3F8F5A`, có vòng lan nhấp nháy 2,4 giây |
| Chấm trong pill ngành | `#E9C77D` |
| Bloomsky: xanh / vàng / trắng | `#133F52` / `#FACD66` / `#FFFFFF` |
| Màu nhấn trang chi tiết | Woori `#1C5BB8`, Cơm Niêu Thiên Lý `#9A5B2E`, Phú Hưng Life `#B08A3E` |

### 2.4 Độ tương phản
- Chữ thường đạt tối thiểu 4.5:1, chữ lớn (≥ 24px hoặc ≥ 19px đậm) đạt tối thiểu 3:1.
- Không đặt chữ camel cỡ nhỏ hơn 13px trên nền beige.

---

## 3. Chữ

| Vai trò | Font | Cỡ | Độ đậm | Line-height | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Tên hero | Poppins | `clamp(34px, 9.6vw, 138px)` | 700 | 0.92 | In hoa, 1 dòng, letter-spacing -0.02em |
| H1 trang chi tiết | Poppins | `clamp(34px, 4.6vw, 56px)` | 600 | 1.05 | `text-wrap: balance` |
| H2 tiêu đề mục | Poppins | `clamp(32px, 4.4vw, 48px)` | 600 | 1.08 | letter-spacing -0.02em |
| H3 tiêu đề thẻ | Poppins | 20–26px | 600 | 1.3 | |
| Số liệu lớn | Poppins | `clamp(36px, 4vw, 48px)` | 600 | 1 | `tabular-nums` |
| Chức danh hero | Poppins | `clamp(20px, 2vw, 26px)` | 600 | 1.3 | |
| Lead | Roboto | 17–19px | 400 | 1.6 | Màu `--muted`, tối đa 62 ký tự/dòng |
| Nội dung | Roboto | 16px (trang chi tiết 17px) | 400 | 1.6–1.7 | |
| Nhãn mục | Roboto | 15px | 500 | 1.4 | Màu camel, viết hoa kiểu câu |
| Chú thích, meta | Roboto | 13–14px | 400 | 1.5 | Không nhỏ hơn 13px |
| Nút | Poppins | 14–15px | 500 | 1 | |

- Font tải từ Google Fonts: Poppins 400/500/600/700, Roboto 400/500/700, subset `vietnamese`. Phải hiển thị đúng dấu tiếng Việt.
- Fallback: `system-ui, sans-serif`.

---

## 4. Khoảng cách, lưới, bo góc, độ nổi

**Lưới 8pt:** mọi khoảng cách là bội số của 8 (cho phép 4px cho chi tiết nhỏ).

| Hạng mục | Giá trị |
| --- | --- |
| Container | Tối đa 1200px, padding ngang `max(5vw, 16px)` |
| Khoảng cách dọc giữa các mục | `clamp(72px, 9vw, 128px)` |
| Tiêu đề mục → nội dung | `clamp(40px, 5vw, 64px)` |
| Khe lưới thẻ | 16px (thẻ nhỏ), 24px (thẻ dự án, thiết kế) |
| Padding thẻ | 24px (thẻ nhỏ), 32px (thẻ lớn), 24px trên điện thoại |

**Bo góc:**

| Thành phần | Bo góc |
| --- | --- |
| Pill, nút | 999px |
| Thẻ nhỏ, khối pill | 20px |
| Thẻ dự án, thẻ kinh nghiệm, khung ảnh | 32px |
| Thẻ liên hệ | 40px |
| Ảnh trong lưới | 20–24px |
| Bo lồng nhau | Bo ngoài = bo trong + padding |

**Độ nổi:** dùng đổ bóng mềm thay cho viền đậm.
- Thẻ lớn khi hover: `0 24px 48px -24px rgba(70,50,30,.35)`.
- Ảnh hero: `drop-shadow(0 24px 30px rgba(90,60,30,.18))`.

---

## 5. Liquid glass

| Lớp | Thông số |
| --- | --- |
| Nền | `rgba(255,255,255,.42)` (đậm: `.7`), `backdrop-filter: blur(20px) saturate(170%)` |
| Viền | 1px `rgba(255,255,255,.9)` + `inset 0 1px 0 rgba(255,255,255,.45)` |
| Ánh phản chiếu tĩnh | `linear-gradient(135deg, rgba(255,255,255,.35), transparent 38% 70%, rgba(255,255,255,.12))` |
| Đốm sáng theo con trỏ | `radial-gradient(260px circle at con-trỏ, rgba(255,255,255,.55), transparent 60%)`. Chỉ hiện khi hover, mờ dần 400ms. Trên nền đêm giảm còn `.14` |
| Nền phía sau kính | 3 quầng màu mờ (trắng, `#D9C4A6`, `#F7F1E8`), blur 70px, trôi chậm 26–38 giây |

Kính dùng cho: thanh điều hướng, pill trạng thái, thẻ chặng nghề, ô kỹ năng, thẻ năng lực, thẻ dự án, thẻ Bloomsky, tooltip, hộp thoại, toast, mục lục trang chi tiết, thẻ liên hệ.

---

## 6. Thành phần và trạng thái

Mọi thành phần tương tác phải có đủ trạng thái: mặc định, hover, focus-visible, nhấn (active), và đang tải/vô hiệu nếu có.

### 6.1 Nút

| Biến thể | Mặc định | Hover | Nhấn | Focus |
| --- | --- | --- | --- | --- |
| Chính (đen) | Nền `--ink`, chữ `--bg`, cao 44px, padding ngang 22px | Bóng `0 12px 24px -12px rgba(0,0,0,.5)`, icon mũi tên trượt phải 3px | `scale(.96)` 150ms | Viền 2px camel, cách 3px |
| Phụ (kính) | Nền kính, viền trong 1px `--line` | Nền kính đậm | `scale(.96)` | Như trên |
| Vàng (Bloomsky) | Nền `#FACD66`, chữ `#133F52` | Như nút chính | Như trên | Như trên |

Nút từ tính: nút chính ở hero và thẻ dự án dịch nhẹ theo con trỏ (tối đa 18% chiều ngang, 25% chiều dọc), trả về vị trí cũ khi rời chuột.

### 6.2 Pill và tag

| Loại | Kiểu dáng | Hover |
| --- | --- | --- |
| Pill trạng thái (nav) | Kính đậm, chấm xanh nhấp nháy, chữ 13px | Không |
| Pill kỹ năng (hero) | Kính đậm, chấm camel 6px, chữ 14px/500 | Dịch trái 4px, nền trắng |
| Pill ngành (hero) | Nền mực, chữ beige, Poppins, chấm vàng | Dịch lên 3px |
| Pill định dạng/công cụ | Nền beige nhạt, chữ 14px | Nền trắng, dịch lên 2px |
| Tag loại dự án | Nền `--bg2`, chữ 13px/500 | Không |
| Bộ lọc chương Bloomsky | Kính, viền mảnh; đang chọn: nền vàng chữ xanh | Chữ đậm màu hơn |

### 6.3 Thẻ

| Thẻ | Mô tả | Hover |
| --- | --- | --- |
| Thẻ chặng nghề (hero) | Kính, bo 14px, chữ căn giữa: chức danh 12.5px đậm + nơi làm/năm 11px | Lơ lửng 4px, chu kỳ 7 giây |
| Thẻ kinh nghiệm | Nền beige nhạt, bo 32px, 2 cột (năm 200px + nội dung) | Nhấc lên 2px, có bóng |
| Thẻ dự án | Kính tối, bo 32px | Nghiêng 3D tối đa 5°, nền sáng hơn, bóng sâu |
| Thẻ năng lực | Kính đậm, icon 28px camel | Nhấc lên 4px, icon xoay -8° và phóng 1.1 |
| Thẻ thiết kế | Ảnh 4:3 bo 24px + tên + loại + mô tả | Ảnh phóng 1.05, hiện thanh kính "Xem ảnh lớn" |
| Thẻ kết quả (trang chi tiết) | Nền đêm, số lớn đếm lên | Nhấc lên 4px |

### 6.4 Tooltip
- Kính trắng 82%, bo 16px, padding 14×16px, rộng tối đa 300px, chữ 14px, dòng đầu in đậm.
- Hiện phía trên phần tử, cách 12px. Thiếu chỗ thì lật xuống dưới, luôn cách mép màn hình ≥ 12px.
- Xuất hiện: opacity 0→1, scale .96→1, blur 4px→0, 200–300ms.
- Mở bằng hover, focus bàn phím, hoặc chạm trên điện thoại. Đóng khi rời chuột, cuộn trang, chạm ra ngoài hoặc bấm Esc.
- Phần tử có tooltip cần gợi ý: `cursor: help`, hoặc gạch chân chấm với thuật ngữ trong bài.

### 6.5 Hộp thoại và thư viện ảnh
- Nền phía sau: đen 45% + blur 6px. Trên trang chi tiết: đen 70%.
- Hộp kính, bo 32px, rộng tối đa 860px, cao tối đa màn hình trừ 48px, tự cuộn bên trong.
- Mở: trượt lên 24px, scale .97→1, blur 6px→0, 350–450ms. Đóng nhanh hơn (320ms).
- Nút đóng × tròn 44px góc trên phải, xoay 90° khi hover.
- Thư viện: ảnh cuộn ngang bắt điểm (scroll-snap), nút ‹ › tròn 44px, có chú thích dưới ảnh, không cắt ảnh.

### 6.6 Thanh điều hướng
- Viên thuốc kính, cách đỉnh 16px, rộng tối đa 1120px, căn giữa.
- Bố cục: pill trạng thái (trái), 5 link (giữa phải), nút "Liên hệ" (phải).
- Link đang đọc có viên kính trượt theo, 450ms.
- Ẩn (trượt lên) khi cuộn xuống quá 400px, hiện lại khi cuộn lên.
- Khi nằm trên dải đen: chuyển sang kính tối, chữ sáng, nút "Liên hệ" thành nền sáng chữ tối.

---

## 7. Bố cục từng màn hình

### 7.1 Màn hình đầu

```text
┌────────────────────────────────────────────────────────────────────┐
│ [● Sẵn sàng cho vị trí Brand & Communication]   links…   [Liên hệ] │
├────────────────────────────────────────────────────────────────────┤
│            L Ê   T H Ù Y   T R A N G   (viền + đặc, 1 dòng)        │
│                        ╭──────────╮                                │
│ Chức danh              │  ẢNH     │                  Kỹ năng       │
│ Giới thiệu (CV)        │  TÁCH    │       [• 6 pill kỹ năng]       │
│ [Xem hành trình] [Liên │  NỀN     │                  4 ngành       │
│  hệ với tôi]           ╰──────────╯       [BFSI][F&B][Edu][Agency] │
│                [Copywriter][Social Media Leader]                   │
│                  [Senior Content Marketing]                        │
└────────────────────────────────────────────────────────────────────┘
```

- Cao tối thiểu 1 màn hình, padding trên 112px.
- Lưới 3 cột tỉ lệ `1 : 1.05 : 1`. Cột trái và phải căn đáy.
- Ảnh tách nền đặt giữa, đầu đè lên chân chữ của tên (kéo lên 44–86px theo màn hình). Phía sau ảnh có vầng sáng trắng hình mái vòm, dưới chân có vệt kẻ mảnh.
- Tên: hai chữ đầu là chữ viền (nét 1–2.5px màu mực), chữ cuối là chữ đặc.
- Ba thẻ chặng nghề nằm dưới ảnh, **không bao giờ che mặt**.

### 7.2 Các mục của trang chính

| Mục | Nền | Bố cục |
| --- | --- | --- |
| Kinh nghiệm | Trắng | Danh sách dọc 4 thẻ, khe 16px; dưới cùng 2 thẻ học vấn 2 cột |
| Dự án nổi bật | Đen | Lưới 2 cột; thẻ Phú Hưng Life trải hết hàng |
| Năng lực | Beige | Lưới 4 cột × 2 hàng thẻ năng lực; dưới là 3 khối pill 3 cột |
| Bài viết chọn lọc | Trắng | Danh sách hàng ngang: tiêu đề, chuyên mục, ngày, mũi tên; kẻ phân cách mảnh |
| Thiết kế | Đen | Bloomsky: ảnh bìa 16:9 full chiều ngang (không cắt), thẻ thông tin 2 cột, bộ lọc chương, dải ảnh cuộn ngang. Tiếp theo "Thiết kế khác": lưới 2×2 ảnh 4:3 |
| Liên hệ | Beige | Thẻ kính lớn 2 cột: tiêu đề + lời mời bên trái; 4 dòng liên hệ bên phải, có nút Sao chép |

Mỗi mục mở đầu bằng: nhãn camel 15px → H2 nêu luận điểm → lead tối đa 62 ký tự/dòng.

### 7.3 Trang chi tiết dự án

```text
┌─ thanh tiến độ đọc 3px ─────────────────────────────────────┐
│ [Lê Thùy Trang]   Dự án nổi bật / Tên dự án   [Về portfolio] │
│                                                              │
│ ● Thương hiệu, năm                    ╭────────────────╮     │
│ H1 tiêu đề dự án                      │  Ảnh bìa 4:3   │     │
│ Phụ đề                                ╰────────────────╯     │
│ [chip][chip][chip]                                           │
│ ┌ Mục lục ┐  Tổng quan + khung "Thông tin"                   │
│ │ dính khi│  Các mục nội dung, rộng tối đa 780px              │
│ │ cuộn    │  Ảnh có chú thích "Nguồn: …"                      │
│ └─────────┘  Kết quả (lưới 2 cột thẻ đêm)                     │
│              Kết luận + 2 thẻ "Dự án tiếp theo"               │
└──────────────────────────────────────────────────────────────┘
```

- Khung "Thông tin chiến dịch/công việc": kính, 2 cột nhãn (150px) và giá trị.
- Ý tưởng sáng tạo: khối nền đêm bo 24px, câu trích dẫn Poppins 24–34px.
- Thẻ giai đoạn: lưới 3 cột kính đậm, nhãn "Giai đoạn N" màu camel.
- Bảng: nền trắng bo 20px, tiêu đề cột nền beige nhạt, hàng sáng lên khi hover, cuộn ngang trên điện thoại.
- So sánh trước/sau (Cơm Niêu Thiên Lý): khung 3:2, vạch trắng 2px giữa, núm kính tròn 48px, nhãn "Trước"/"Sau" dạng pill kính.

---

## 8. Chuyển động

**Thông số chung:**
- Easing `cubic-bezier(.2,0,0,1)`, không nảy.
- Trạng thái tương tác (hover, mở/đóng) dùng transition để có thể đảo chiều giữa chừng. Hiệu ứng chạy một lần (xuất hiện, tải trang) dùng keyframes.
- Chỉ animate `transform`, `opacity`, `filter`, trừ hiệu ứng mở rộng dùng `grid-template-rows`.

| Hiệu ứng | Thông số |
| --- | --- |
| Tên hero xuất hiện | Từng ký tự: translateY .35em + xoay 4° + blur 6px → 0, 900ms, trễ 38ms mỗi ký tự, bắt đầu sau 120ms |
| Ảnh hero | Trượt lên 40px + mờ → rõ, 1,2 giây, trễ 350ms |
| Pill kỹ năng/ngành | Trượt vào từ phải 16px, trễ 70ms mỗi pill |
| Thẻ chặng nghề | Hiện sau 900ms, trễ 150ms mỗi thẻ; sau đó lơ lửng 4px, chu kỳ 7 giây |
| Khối xuất hiện khi cuộn | opacity 0→1, translateY 16px→0, blur 4px→0, 700ms, so le 60–100ms |
| Hover thẻ | Nhấc lên 2–4px, 400–500ms |
| Mở rộng kinh nghiệm | Cao 0 → tự nhiên, 500ms; mũi tên xoay 180° |
| Đổi chương Bloomsky | Ảnh cũ mờ + hạ 12px trong 260ms; ảnh mới hiện lần lượt, trễ 60ms mỗi ảnh |
| Số liệu | Đếm từ 0 lên giá trị, 1,5 giây, ease-out bậc 4, định dạng số Việt Nam |
| Ảnh trang chi tiết | Ảnh bìa mở bằng clip-path từ dưới lên, 1,1 giây |
| Đốm sáng kính | Bám theo con trỏ, hiện/ẩn 400ms |
| Quầng nền | Trôi qua lại 26–38 giây |

**Giảm chuyển động:** khi hệ điều hành bật `prefers-reduced-motion: reduce`, tắt toàn bộ hiệu ứng trên, hiện ngay mọi phần tử và hiện thẳng giá trị số cuối.

---

## 9. Responsive

| Độ rộng | Thay đổi giao diện |
| --- | --- |
| > 1000px | Bố cục đầy đủ như mục 7 |
| ≤ 1000px | Hero: ảnh và giới thiệu 2 cột, kỹ năng và ngành xuống hàng riêng căn trái. Năng lực 2 cột. Khối pill 1 cột. Liên hệ 1 cột |
| ≤ 900px | Nav: pill trạng thái thu nhỏ, ẩn nút "Liên hệ", link cuộn ngang và mờ dần ở mép phải. Dự án, học vấn, thiết kế, thẻ kinh nghiệm thành 1 cột. Bloomsky 1 cột. Bài viết ẩn ngày. Trang chi tiết ẩn mục lục |
| ≤ 640px | Hero 1 cột: tên → ảnh (tối đa 340px) → thẻ chặng nghề → giới thiệu → kỹ năng → ngành |
| ≤ 560px | Ẩn pill trạng thái trên nav. Năng lực 1 cột. Padding thẻ giảm còn 24px |

- Thiết kế kiểm tra ở 360, 390, 768, 1000, 1280, 1440px. Không có thanh cuộn ngang ở bất kỳ độ rộng nào.
- Trên màn hình cảm ứng: tắt nghiêng thẻ và nút từ tính; tooltip mở bằng chạm; thanh "Xem ảnh lớn" ở thẻ thiết kế luôn hiện.

---

## 10. Hình ảnh

| Vị trí | Tỉ lệ | Cách hiển thị |
| --- | --- | --- |
| Ảnh hero | 590×601, nền trong suốt | `contain`, bám đáy, có bóng đổ mềm |
| Thẻ thiết kế khác | 4:3 | `cover`, bo 24px, viền trong 1px trắng 10% |
| Bìa Bloomsky | 16:9 | Hiện đủ ảnh, không cắt |
| Dải ảnh Bloomsky | 16:9 | `cover`, bo 20px, rộng 260–400px |
| Bìa trang chi tiết | 4:3 | `cover`, bo 32px |
| Ảnh trong bài | Theo ảnh gốc | Rộng 100% cột, bo 20px, chú thích 14px bên dưới |
| Lưới ảnh trong bài | 1:1, 4:5, 3:2 hoặc 16:9 theo bộ ảnh | `cover`, khe 12px |

- Mọi ảnh có `alt` tiếng Việt mô tả nội dung.
- Ảnh lớn có thể bấm để xem trong hộp thoại.

---

## 11. Accessibility (WCAG 2.2 AA)

- Mọi phần tử bấm được có vùng bấm ≥ 44×44px.
- Focus nhìn thấy rõ: viền 2px camel, cách phần tử 3px, bo 8px.
- Đi hết trang được bằng Tab: link, nút, tooltip (phần tử có tooltip có `tabindex="0"`), bộ lọc, thư viện ảnh.
- Esc đóng tooltip và hộp thoại. Đóng hộp thoại thì focus trả về nút đã mở.
- Nút mở rộng có `aria-expanded`, bộ lọc có `aria-pressed`, tooltip có `role="tooltip"` và được gắn `aria-describedby`.
- Chữ trang trí (tên tách ký tự) ẩn khỏi trình đọc màn hình, giữ `aria-label` trên thẻ tiêu đề.
- Không truyền thông tin chỉ bằng màu.

---

## 12. Checklist duyệt thiết kế trước khi code

- [ ] Màu, chữ, khoảng cách khớp bảng token mục 2–4, không có giá trị lẻ ngoài hệ.
- [ ] Mọi thành phần mục 6 có đủ trạng thái mặc định, hover, focus, nhấn.
- [ ] Hero: tên 1 dòng, ảnh đè chân chữ, thẻ chặng nghề không che mặt, kỹ năng và ngành nổi bật ở cột phải.
- [ ] Nhịp nền: Kinh nghiệm trắng → Dự án đen → Năng lực beige → Bài viết trắng → Thiết kế đen → Liên hệ beige.
- [ ] Ảnh bìa Bloomsky hiện đủ khung 16:9.
- [ ] Bố cục được duyệt ở 6 độ rộng của mục 9.
- [ ] Có phương án cho chế độ giảm chuyển động.
- [ ] Văn bản trên UI xưng "tôi"; chức danh Phú Hưng Life là "Senior Content Marketing"; CSR ghi 1.000+ người tham dự, 95%.
