import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { BloomskyMeta, ProjectBody, RichParagraph } from "../app/lib/db/types";

const ROOT = process.cwd();
const SEED_DIR = path.join(ROOT, "drizzle", "seed");
const MANIFEST_PATH = path.join(ROOT, "scripts", "media-manifest.json");

type ManifestEntry = {
  key: string;
  contentType: string;
  width: number;
  height: number;
  bytes: number;
  etag: string;
};

const sqlStr = (val: string): string => `'${val.replace(/'/g, "''")}'`;
const sqlJson = (obj: unknown): string => sqlStr(JSON.stringify(obj));

const t = (text: string) => ({ kind: "text" as const, text });
const b = (text: string) => ({ kind: "bold" as const, text });
const abbr = (text: string, tipTitle: string, tipBody: string) => ({
  kind: "abbr" as const,
  text,
  tipTitle,
  tipBody,
});
const lnk = (text: string, href: string) => ({ kind: "link" as const, text, href });
const p = (...segs: RichParagraph) => segs;

const main = () => {
  fs.mkdirSync(SEED_DIR, { recursive: true });
  const manifest: Record<string, ManifestEntry> = fs.existsSync(MANIFEST_PATH)
    ? (JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Record<string, ManifestEntry>)
    : {};

  const dim = (key: string, defW = 1600, defH = 900) => {
    const m = manifest[key];
    return { width: m?.width ?? defW, height: m?.height ?? defH };
  };

  const lines: string[] = [
    "-- Auto-generated idempotent seed for Portfolio Lê Thùy Trang",
    "DELETE FROM project_results;",
    "DELETE FROM work_images;",
    "DELETE FROM jobs;",
    "DELETE FROM education;",
    "DELETE FROM projects;",
    "DELETE FROM skills;",
    "DELETE FROM posts;",
    "DELETE FROM works;",
    "",
  ];

  // 1. JOBS
  const jobRows = [
    {
      id: "job-phl",
      order: 1,
      years: "2025–2026",
      period: "Th4/2025 – Th3/2026",
      title: "Senior Content Marketing",
      company: "Phú Hưng Life",
      tipTitle: "Phú Hưng Life",
      tipBody: "Doanh nghiệp bảo hiểm nhân thọ với mạng lưới văn phòng trên toàn quốc.",
      summary: "Giữ giọng nói thương hiệu cho một doanh nghiệp bảo hiểm trên mọi kênh, từ báo chí đến nội bộ.",
      highlights: [
        "Chiến dịch PR ra mắt Tổng Giám đốc mới trên VnExpress, Dân Trí, Tuổi Trẻ, Vietcetera.",
        "Tăng 30% tương tác tổng trên Website, Facebook, LinkedIn và TikTok.",
        "Kiểm soát nhận diện tại mọi văn phòng toàn quốc, tuân thủ 100% brand guideline.",
      ],
      details: [
        "Viết bài phát biểu, kịch bản và thông điệp chiến lược hằng tháng cho Tổng Giám đốc.",
        "Xử lý truyền thông trong các tình huống khủng hoảng nhạy cảm.",
        "Thiết kế và vận hành truyền thông nội bộ trên Email, GapoWork, Facebook Group.",
        "Sản xuất thiết kế và video cho social và chiến dịch doanh nghiệp.",
        "Đồng tổ chức chuỗi CSR giáo dục tài chính cho phụ nữ Vĩnh Long: 10 buổi trong 6 tháng, hơn 1.000 người tham dự, tỷ lệ tham gia trung bình 95%.",
      ],
    },
    {
      id: "job-cntl",
      order: 2,
      years: "2024–2025",
      period: "Th9/2024 – Th4/2025",
      title: "Social Media Marketing Lead",
      company: "Cơm Niêu Thiên Lý",
      tipTitle: "Cơm Niêu Thiên Lý",
      tipBody: "Chuỗi nhà hàng cơm niêu đang mở rộng theo mô hình nhượng quyền.",
      summary: "Làm mới nhận diện và vận hành Meta, Zalo, LinkedIn, TikTok cho một chuỗi F&B.",
      highlights: [
        "Tương tác Facebook tăng 153,4% trong 3 tháng.",
        "Xây brand identity guide mới, chuẩn hóa cửa hàng, social và OOH.",
        "Tăng hơn 10% doanh số cho cửa hàng mới và cửa hàng địa phương.",
      ],
      details: [
        "TikTok thêm 2.000+ người theo dõi, nhiều video đạt 100.000 lượt xem.",
        "Khởi tạo kênh LinkedIn, thu hút 20.000+ người quan tâm nhượng quyền.",
        "Hướng dẫn Content Creator sản xuất, biên tập và đăng tải nội dung.",
        "Quản lý quan hệ KOC/Influencer cho các chiến dịch địa phương.",
      ],
    },
    {
      id: "job-isna",
      order: 3,
      years: "2023–2024",
      period: "Th6/2023 – Th3/2024",
      title: "Content Marketing Executive",
      company: "International Schools of North America",
      tipTitle: "International Schools of North America",
      tipBody: "Hệ thống trường quốc tế tại TP.HCM; tôi làm việc toàn thời gian tại văn phòng.",
      summary: "Vận hành nội dung song ngữ Việt – Anh cho một hệ thống trường quốc tế, từ mạng xã hội đến tuyển sinh.",
      highlights: [
        "Mỗi tháng: 25–28 bài Facebook, 10 video ngắn Shorts/TikTok, 2 video dài YouTube, 6 bài website 1.000 chữ chuẩn SEO.",
        "3 bài viết SEO lọt Top 10 kết quả tìm kiếm Google.",
        "Nội dung song ngữ cho brochure, leaflet, standee và email marketing gửi phụ huynh.",
      ],
      details: [
        "Lên kế hoạch nội dung song ngữ theo tháng, tuần, ngày và kế hoạch truyền thông cho sự kiện tuyển sinh.",
        "Xây dựng 2 thông điệp truyền thông riêng mỗi tháng cho bài đăng sự kiện và chiến dịch tuyển sinh.",
        "Đề xuất và viết kịch bản video song ngữ về trường, sự kiện, đời sống học sinh, phỏng vấn giáo viên và học sinh.",
        "Theo dõi xu hướng trên mạng xã hội và đề xuất một bài bắt trend mỗi tháng.",
        "Hỗ trợ tổ chức sự kiện nội bộ và sự kiện tuyển sinh tại trường.",
        "Phối hợp với giáo viên nước ngoài và các phòng ban để hoàn thành công việc hiệu quả.",
      ],
    },
    {
      id: "job-byte",
      order: 4,
      years: "2022",
      period: "Byte Media Agency",
      title: "Copywriter Lead",
      company: "Byte Media",
      tipTitle: "Byte Media Agency",
      tipBody: "Agency truyền thông với khách hàng như Woori Bank, Isuzu Việt Nam, KCN Nam Đình Vũ, Ruco International Clinic.",
      summary: "Lên chiến lược nội dung và pitching cho khách hàng lớn ở nhiều ngành.",
      highlights: [
        "Dẫn dắt mảng video cho Woori Bank: 105.000 follower TikTok, 7.500 tài khoản mới.",
        "45% đề xuất được duyệt trên 15+ dự án pitching.",
        "Kế hoạch đa kênh Facebook, Google, TikTok, LinkedIn cho nhiều thương hiệu.",
      ],
      details: [
        "Xây đề xuất gồm key message, tagline, content pillar, lịch nội dung, bài demo và chi phí.",
        "Viết quảng cáo social, kịch bản, bài SEO, bài PR và định hướng ý tưởng thiết kế.",
        "Phối hợp Account, Media, Sales để đảm bảo cam kết chiến dịch.",
      ],
    },
  ];

  for (const j of jobRows) {
    lines.push(
      `INSERT INTO jobs (id, sort_order, years, period, title, company, company_tip_title, company_tip_body, summary, highlights_json, details_json) VALUES (${sqlStr(j.id)}, ${j.order}, ${sqlStr(j.years)}, ${sqlStr(j.period)}, ${sqlStr(j.title)}, ${sqlStr(j.company)}, ${sqlStr(j.tipTitle)}, ${sqlStr(j.tipBody)}, ${sqlStr(j.summary)}, ${sqlJson(j.highlights)}, ${sqlJson(j.details)});`,
    );
  }

  // 2. EDUCATION
  const eduRows = [
    {
      id: "edu-ajc",
      order: 1,
      school: "Học viện Báo chí và Tuyên truyền",
      degree: "Cử nhân Quan hệ công chúng",
      years: "2017–2021",
      tipTitle: "Nền tảng PR bài bản",
      tipBody: "Chuyên ngành Quan hệ công chúng: quan hệ báo chí, truyền thông khủng hoảng, tổ chức sự kiện.",
    },
    {
      id: "edu-arena",
      order: 2,
      school: "Arena Multimedia",
      degree: "Chứng chỉ Đa phương tiện",
      years: "2024–2026",
      tipTitle: "Thiết kế song hành với nội dung",
      tipBody: "Đào tạo đa phương tiện giúp tôi tự sản xuất thiết kế và video.",
    },
  ];
  for (const e of eduRows) {
    lines.push(
      `INSERT INTO education (id, sort_order, school, degree, years, tip_title, tip_body) VALUES (${sqlStr(e.id)}, ${e.order}, ${sqlStr(e.school)}, ${sqlStr(e.degree)}, ${sqlStr(e.years)}, ${sqlStr(e.tipTitle)}, ${sqlStr(e.tipBody)});`,
    );
  }

  // 3. SKILLS (role-chip, hero, hero-industry, capability, format, tool, industry)
  const skillRows = [
    // Hero role chips
    {
      id: "rc-1",
      group: "role-chip",
      order: 1,
      name: "Copywriter",
      subtitle: "Byte Media, 2022",
      tipTitle: "Copywriter Lead, Byte Media (2022)",
      tipBody: "Lên kế hoạch nội dung đa kênh cho Woori Bank, Isuzu, KCN Nam Đình Vũ; 45% đề xuất được duyệt trên 15+ dự án.",
      icon: "",
    },
    {
      id: "rc-2",
      group: "role-chip",
      order: 2,
      name: "Social Media Leader",
      subtitle: "Cơm Niêu Thiên Lý, 2024–2025",
      tipTitle: "Social Media Leader, Cơm Niêu Thiên Lý (2024–2025)",
      tipBody: "Làm mới bộ nhận diện; tương tác Facebook tăng 153,4% trong 3 tháng.",
      icon: "",
    },
    {
      id: "rc-3",
      group: "role-chip",
      order: 3,
      name: "Senior Content Marketing",
      subtitle: "Phú Hưng Life, 2025–2026",
      tipTitle: "Senior Content Marketing, Phú Hưng Life (2025–2026)",
      tipBody: "PR ra mắt Tổng Giám đốc trên VnExpress, Dân Trí, Tuổi Trẻ, Vietcetera; tương tác đa kênh +30%.",
      icon: "",
    },
    // Hero skills
    {
      id: "hs-1",
      group: "hero",
      order: 1,
      name: "Content Planning & Development",
      subtitle: "",
      tipTitle: "Content Planning & Development",
      tipBody: "Lên kế hoạch nội dung theo tháng, tuần, ngày; key message, content pillar, lịch nội dung cho Woori Bank, ISNA, Phú Hưng Life.",
      icon: "",
    },
    {
      id: "hs-2",
      group: "hero",
      order: 2,
      name: "Social Media Content Strategy",
      subtitle: "",
      tipTitle: "Social Media Content Strategy",
      tipBody: "Chiến lược nội dung cho Facebook, TikTok, LinkedIn, Zalo: TikTok Woori Bank 105.000 follower, Facebook Cơm Niêu Thiên Lý +153,4% tương tác.",
      icon: "",
    },
    {
      id: "hs-3",
      group: "hero",
      order: 3,
      name: "Multi-channel Content Management",
      subtitle: "",
      tipTitle: "Multi-channel Content Management",
      tipBody: "Quản lý nội dung trên Website, Facebook, LinkedIn, TikTok, YouTube và kênh nội bộ; tương tác đa kênh Phú Hưng Life +30%.",
      icon: "",
    },
    {
      id: "hs-4",
      group: "hero",
      order: 4,
      name: "Content Performance Analysis",
      subtitle: "",
      tipTitle: "Content Performance Analysis",
      tipBody: "Theo dõi, phân tích và báo cáo hiệu quả nội dung để tối ưu theo dữ liệu.",
      icon: "",
    },
    {
      id: "hs-5",
      group: "hero",
      order: 5,
      name: "Visual Storytelling",
      subtitle: "",
      tipTitle: "Visual Storytelling",
      tipBody: "Kể chuyện bằng hình ảnh và video: bộ nhận diện Cơm Niêu Thiên Lý, storyboard Woori Z Card, Bloomsky Airways.",
      icon: "",
    },
    {
      id: "hs-6",
      group: "hero",
      order: 6,
      name: "Adobe Creative Suite",
      subtitle: "",
      tipTitle: "Adobe Creative Suite",
      tipBody: "Illustrator, Photoshop, InDesign, Lightroom Classic, cùng CapCut cho video ngắn.",
      icon: "",
    },
    // Hero industries
    {
      id: "hi-1",
      group: "hero-industry",
      order: 1,
      name: "BFSI",
      subtitle: "",
      tipTitle: "BFSI",
      tipBody: "Woori Bank, Phú Hưng Life.",
      icon: "",
    },
    {
      id: "hi-2",
      group: "hero-industry",
      order: 2,
      name: "F&B",
      subtitle: "",
      tipTitle: "F&B",
      tipBody: "Cơm Niêu Thiên Lý, Nutifood, Sea Crown.",
      icon: "",
    },
    {
      id: "hi-3",
      group: "hero-industry",
      order: 3,
      name: "Education",
      subtitle: "",
      tipTitle: "Education",
      tipBody: "International Schools of North America.",
      icon: "",
    },
    {
      id: "hi-4",
      group: "hero-industry",
      order: 4,
      name: "Agency",
      subtitle: "",
      tipTitle: "Agency",
      tipBody: "Byte Media: Woori Bank, Isuzu Việt Nam, KCN Nam Đình Vũ, Ruco International Clinic.",
      icon: "",
    },
    // Capabilities (8 cards)
    {
      id: "cap-1",
      group: "capability",
      order: 1,
      name: "Quản trị thương hiệu",
      subtitle: "Brand guideline, nhận diện đồng bộ",
      tipTitle: "Quản trị thương hiệu",
      tipBody: "Xây brand identity guide cho Cơm Niêu Thiên Lý; kiểm soát nhận diện tại mọi văn phòng Phú Hưng Life trên toàn quốc.",
      icon: "brand",
    },
    {
      id: "cap-2",
      group: "capability",
      order: 2,
      name: "PR & báo chí",
      subtitle: "Chiến dịch PR tích hợp",
      tipTitle: "PR & báo chí",
      tipBody: "Đưa tin ra mắt Tổng Giám đốc trên VnExpress, Dân Trí, Tuổi Trẻ, Vietcetera. Nền tảng Cử nhân Quan hệ công chúng.",
      icon: "pr",
    },
    {
      id: "cap-3",
      group: "capability",
      order: 3,
      name: "Truyền thông lãnh đạo & nội bộ",
      subtitle: "Phát biểu CEO, gắn kết nhân viên",
      tipTitle: "Truyền thông lãnh đạo & nội bộ",
      tipBody: "Thông điệp hằng tháng cho Tổng Giám đốc; truyền thông nội bộ trên Email, GapoWork, Facebook Group.",
      icon: "exec",
    },
    {
      id: "cap-4",
      group: "capability",
      order: 4,
      name: "Truyền thông khủng hoảng",
      subtitle: "Thông tin kịp thời, chính xác",
      tipTitle: "Truyền thông khủng hoảng",
      tipBody: "Xử lý truyền thông trong các tình huống nhạy cảm, bảo vệ hình ảnh của một doanh nghiệp bảo hiểm.",
      icon: "crisis",
    },
    {
      id: "cap-5",
      group: "capability",
      order: 5,
      name: "Chiến lược nội dung đa kênh",
      subtitle: "Pillar, lịch nội dung, key message",
      tipTitle: "Chiến lược nội dung đa kênh",
      tipBody: "Lên kế hoạch cho Facebook, Google, TikTok, YouTube, LinkedIn, Website; đo lường và tối ưu theo hiệu quả.",
      icon: "content",
    },
    {
      id: "cap-6",
      group: "capability",
      order: 6,
      name: "Nội dung song ngữ & SEO",
      subtitle: "Việt – Anh, chuẩn từ khóa",
      tipTitle: "Nội dung song ngữ & SEO",
      tipBody: "Viết nội dung và kịch bản song ngữ tại trường quốc tế; 3 bài SEO lọt Top 10 Google.",
      icon: "lang",
    },
    {
      id: "cap-7",
      group: "capability",
      order: 7,
      name: "Visual storytelling",
      subtitle: "Thiết kế và video",
      tipTitle: "Visual storytelling",
      tipBody: "Tự sản xuất thiết kế, bao bì, brochure và video; đào tạo Đa phương tiện tại Arena Multimedia.",
      icon: "visual",
    },
    {
      id: "cap-8",
      group: "capability",
      order: 8,
      name: "KOC & Influencer",
      subtitle: "Quan hệ và chiến dịch",
      tipTitle: "KOC & Influencer",
      tipBody: "Quản lý quan hệ KOC/Influencer, triển khai chiến dịch nâng uy tín thương hiệu tại thị trường địa phương.",
      icon: "kol",
    },
  ];

  const formats = [
    ["Profile doanh nghiệp", "Ấn phẩm giới thiệu doanh nghiệp, đúng giọng nói thương hiệu."],
    ["Slogan & tagline", "Câu chữ ngắn gói trọn định vị, dùng trong đề xuất pitching."],
    ["Kịch bản TVC & video", "TVC, video hoạt hình, video ngắn và video YouTube."],
    ["Bài PR", "Thông cáo và bài báo cho các đầu báo lớn."],
    ["Bài SEO", "Bài website 1.000 chữ chuẩn từ khóa; 3 bài Top 10 Google."],
    ["Nội dung social", "Bài đăng, concept và lịch nội dung đa kênh."],
    ["Ấn phẩm in", "Brochure, leaflet, standee song ngữ."],
    ["Email marketing", "Email gửi phụ huynh và khách hàng."],
    ["Phát biểu lãnh đạo", "Thông điệp hằng tháng cho Tổng Giám đốc."],
  ];
  formats.forEach(([name, tip], idx) => {
    skillRows.push({
      id: `fmt-${idx + 1}`,
      group: "format",
      order: idx + 1,
      name: name!,
      subtitle: "",
      tipTitle: name!,
      tipBody: tip!,
      icon: "",
    });
  });

  const tools = [
    ["Illustrator", "Vẽ vector, key visual, ấn phẩm nhận diện."],
    ["Photoshop", "Xử lý ảnh, thiết kế post social và banner."],
    ["InDesign", "Dàn trang profile, brochure, tạp chí, brand guideline."],
    ["Lightroom Classic", "Chỉnh màu ảnh đồng bộ phong cách thương hiệu."],
    ["CapCut", "Dựng video ngắn cho TikTok, Shorts và Reels."],
  ];
  tools.forEach(([name, tip], idx) => {
    skillRows.push({
      id: `tool-${idx + 1}`,
      group: "tool",
      order: idx + 1,
      name: name!,
      subtitle: "",
      tipTitle: name!,
      tipBody: tip!,
      icon: "",
    });
  });

  const inds = [
    ["BFSI", "Woori Bank, Phú Hưng Life."],
    ["F&B", "Cơm Niêu Thiên Lý, Nutifood, Sea Crown."],
    ["Education", "International Schools of North America."],
    ["Agency", "Byte Media: Isuzu Việt Nam, KCN Nam Đình Vũ, Ruco International Clinic."],
  ];
  inds.forEach(([name, tip], idx) => {
    skillRows.push({
      id: `ind-${idx + 1}`,
      group: "industry",
      order: idx + 1,
      name: name!,
      subtitle: "",
      tipTitle: name!,
      tipBody: tip!,
      icon: "",
    });
  });

  for (const s of skillRows) {
    lines.push(
      `INSERT INTO skills (id, "group", sort_order, name, subtitle, tip_title, tip_body, icon) VALUES (${sqlStr(s.id)}, ${sqlStr(s.group)}, ${s.order}, ${sqlStr(s.name)}, ${sqlStr(s.subtitle)}, ${sqlStr(s.tipTitle)}, ${sqlStr(s.tipBody)}, ${sqlStr(s.icon)});`,
    );
  }

  // 4. POSTS
  const postRows = [
    ["Sơn Tùng: chàng trai gieo những hạt mầm xanh giữa Hà Nội", "PR", "18/06/2023"],
    ["Nutifood và chiến dịch Tết “Ngôi nhà dinh dưỡng”", "Social", "21/03/2023"],
    ["Học sinh toàn diện với bằng tú tài quốc tế IB", "SEO", "14/07/2024"],
    ["Du học sinh mang bản sắc Việt", "Giáo dục", "14/07/2024"],
    ["Gợi ý bữa cơm nhà với cá hộp Sea Crown", "SEO", "19/03/2023"],
  ];
  postRows.forEach(([title, cat, date], idx) => {
    lines.push(
      `INSERT INTO posts (id, sort_order, title, category, published_at, url) VALUES (${sqlStr(`post-${idx + 1}`)}, ${idx + 1}, ${sqlStr(title!)}, ${sqlStr(cat!)}, ${sqlStr(date!)}, 'https://lttrang1206.wixsite.com/myportfolio');`,
    );
  });

  // 5. WORKS & WORK_IMAGES
  const bloomMeta: BloomskyMeta = {
    kicker: "Đồ án nhận diện thương hiệu, Arena Multimedia, 2024",
    quote: "“To the joyful you and beyond!”",
    coverKey: "design/bloomsky/cover.webp",
    coverAlt: "Bìa guidebook Bloomsky Airways: máy bay trên đường băng lúc hoàng hôn",
    facts: [
      {
        value: "136",
        label: "trang guidebook",
        tipTitle: "Guidebook 136 trang",
        tipBody: "Từ câu chuyện thương hiệu, logo, ấn phẩm văn phòng đến ứng dụng hàng không và truyền thông.",
      },
      {
        value: "5",
        label: "chương",
        tipTitle: "5 chương",
        tipBody: "Giới thiệu, Logo guideline, Ấn phẩm văn phòng, Ứng dụng hàng không, Truyền thông.",
      },
      {
        value: "2",
        label: "thành viên",
        tipTitle: "Đồ án nhóm",
        tipBody: "Lê Thùy Trang và Huỳnh Đan Thanh, giảng viên hướng dẫn: thầy Châu Đức Vũ.",
      },
    ],
    swatches: [
      { hex: "#133F52", tipTitle: "Xanh chuyên nghiệp", tipBody: "HEX #133F52, R19 G63 B82, C98 M66 Y47 K36" },
      { hex: "#FACD66", tipTitle: "Vàng ấm áp", tipBody: "HEX #FACD66, R250 G205 B102, C0 M21 Y79 K0" },
      { hex: "#FFFFFF", tipTitle: "Trắng tinh tế", tipBody: "HEX #FFFFFF, R255 G255 B255" },
    ],
    fonts: [
      {
        name: "Proxima Nova",
        italicBold: true,
        tipTitle: "Proxima Nova Black Italic",
        tipBody: "Phông chữ logo: nét nghiêng, trẻ trung, gợi cảm giác năng động và di chuyển nhanh.",
      },
      {
        name: "Gotham",
        tipTitle: "Gotham Bold và Book",
        tipBody: "Tiêu đề và nội dung: nét tròn, dễ ứng dụng trong mọi ngữ cảnh.",
      },
    ],
    chapters: ["Tất cả", "Logo guideline", "Ấn phẩm văn phòng", "Ứng dụng hàng không", "Truyền thông"],
  };

  lines.push(
    `INSERT INTO works (id, slug, sort_order, title, kind, description, tone, featured, meta_json) VALUES ('work-bloomsky', 'bloomsky', 0, 'Bloomsky Airways', 'Nhận diện thương hiệu', 'Bộ nhận diện cho một hãng hàng không chuyên bay đến những hòn đảo đẹp nhất Việt Nam. Biểu tượng là chim yến đội nón lá bay ở độ cao an toàn, đại diện cho một hãng bay Việt Nam mến khách, tươi vui và đáng tin cậy.', '#133F52', 1, ${sqlJson(bloomMeta)});`,
  );

  const bloomSpreads: Array<[string, string, string]> = [
    ["Logo guideline", "Ý nghĩa tên thương hiệu", "Bloom là sự nở rộ, Sky là bầu trời: một chuyến bay rực rỡ."],
    ["Logo guideline", "Concept: chim yến và nón lá", "Chim yến đội nón lá bay ở độ cao an toàn, đại diện hãng bay Việt Nam mến khách."],
    ["Logo guideline", "Phác thảo logo", "Quá trình phác thảo từ ý tưởng đến biểu tượng hoàn chỉnh."],
    ["Logo guideline", "Logo 3D trên mặt tiền", "Ứng dụng logo dạng khối trên tòa nhà."],
    ["Logo guideline", "Quy chuẩn màu", "Xanh chuyên nghiệp, vàng ấm áp, trắng tinh tế."],
    ["Logo guideline", "Phông chữ", "Proxima Nova cho logo, Gotham cho tiêu đề và nội dung."],
    ["Ấn phẩm văn phòng", "Danh thiếp", "Name card hai mặt theo bảng màu thương hiệu."],
    ["Ấn phẩm văn phòng", "Thẻ nhân viên", "ID card và dây đeo."],
    ["Ấn phẩm văn phòng", "Bộ ấn phẩm văn phòng", "Letterhead, danh thiếp và phong bì."],
    ["Ấn phẩm văn phòng", "Folder", "Bìa hồ sơ với đường cong cánh chim."],
    ["Ứng dụng hàng không", "Vé máy bay", "Vé hạng phổ thông và thương gia."],
    ["Ứng dụng hàng không", "Thẻ hành lý", "Luggage tag trên vali vàng thương hiệu."],
    ["Ứng dụng hàng không", "Thẻ hội viên Sky Club", "Các hạng thẻ Sapphire, Silver, Gold, Platinum."],
    ["Ứng dụng hàng không", "Đồng phục phi hành đoàn", "Đồng phục phi công và tiếp viên."],
    ["Ứng dụng hàng không", "Bao bì suất ăn", "Hộp bánh và cốc giấy trên chuyến bay."],
    ["Ứng dụng hàng không", "Biển chỉ dẫn sân bay", "Wayfinding: departures, gate, check-in."],
    ["Truyền thông", "Poster tại sân bay", "Chiến dịch “Feel the island on our flight”."],
    ["Truyền thông", "Billboard ngoài trời", "Biển quảng cáo trên mặt tiền tòa nhà."],
    ["Truyền thông", "Màn hình LED sân bay", "Quảng cáo khổ lớn trong nhà ga."],
    ["Truyền thông", "Mạng xã hội", "Fanpage và social post trên di động."],
    ["Truyền thông", "Bộ quà tặng", "Gối cổ, mặt nạ ngủ, túi du lịch và ô."],
  ];

  bloomSpreads.forEach(([chap, cap, note], idx) => {
    const key = `design/bloomsky/p${String(idx + 1).padStart(2, "0")}.webp`;
    const d = dim(key, 1600, 900);
    lines.push(
      `INSERT INTO work_images (id, work_id, sort_order, chapter, caption, note, media_key, width, height) VALUES (${sqlStr(`bl-img-${idx + 1}`)}, 'work-bloomsky', ${idx + 1}, ${sqlStr(chap)}, ${sqlStr(cap)}, ${sqlStr(note)}, ${sqlStr(key)}, ${d.width}, ${d.height});`,
    );
  });

  const otherWorks = [
    {
      id: "work-hoa-lo",
      slug: "nha-tu-hoa-lo",
      order: 1,
      title: "Bộ bưu thiếp “Nhà tù Hỏa Lò – 4 mùa hoa nở”",
      kind: "Bưu thiếp",
      tone: "#5B4636",
      desc: "Lấy cảm hứng từ những lá thư thời chiến của các chiến sĩ cách mạng bị giam tại di tích Hỏa Lò. Bốn mùa, bốn loài hoa: ban, sen, cúc họa mi, thạch thảo; minh họa bằng AI trên nền giấy cũ.",
      key: "design/works/hoa-lo.webp",
    },
    {
      id: "work-cake-bliss",
      slug: "cake-bliss",
      order: 2,
      title: "Tạp chí Cake Bliss",
      kind: "Tạp chí",
      tone: "#8A6E57",
      desc: "Tạp chí tháng cho người yêu bánh: bánh theo mùa, công thức, chân dung thợ bánh và tiệm bánh đặc biệt. Thiết kế tối giản, hình ảnh sắc nét và hấp dẫn.",
      key: "design/works/cake-bliss.webp",
    },
    {
      id: "work-com-tuoi",
      slug: "com-tuoi-moc-mien",
      order: 3,
      title: "Bao bì Cốm tươi Mộc Miên",
      kind: "Bao bì",
      tone: "#4F5A3E",
      desc: "Bao bì giúp cốm tươi dễ vận chuyển và phân phối vào siêu thị trong và ngoài nước. Lá sen, hoa sen, bông lúa minh họa bằng AI, kèm ô cửa sổ nhìn thấy hạt cốm.",
      key: "design/works/com-tuoi-moc-mien.webp",
    },
    {
      id: "work-dalat-hasfarm",
      slug: "dalat-hasfarm",
      order: 4,
      title: "Brochure Dalat Hasfarm",
      kind: "Brochure",
      tone: "#7A4B4B",
      desc: "Brochure giới thiệu thương hiệu Dalat Hasfarm, đơn vị tiên phong trong trồng hoa chuyên nghiệp tại Việt Nam, với chủ đề “Hoa từ trái tim Việt Nam”.",
      key: "design/works/dalat-hasfarm.webp",
    },
  ];

  for (const w of otherWorks) {
    const d = dim(w.key, 1200, 900);
    lines.push(
      `INSERT INTO works (id, slug, sort_order, title, kind, description, tone, featured, meta_json) VALUES (${sqlStr(w.id)}, ${sqlStr(w.slug)}, ${w.order}, ${sqlStr(w.title)}, ${sqlStr(w.kind)}, ${sqlStr(w.desc)}, ${sqlStr(w.tone)}, 0, '{}');`,
    );
    lines.push(
      `INSERT INTO work_images (id, work_id, sort_order, chapter, caption, note, media_key, width, height) VALUES (${sqlStr(`${w.id}-img-1`)}, ${sqlStr(w.id)}, 1, '', ${sqlStr(w.title)}, '', ${sqlStr(w.key)}, ${d.width}, ${d.height});`,
    );
  }

  // 6. PROJECTS (Woori, CNTL, PHL) + PROJECT_RESULTS
  const wooriBody: ProjectBody = {
    breadcrumbTitle: "Woori Bank Z Card",
    cover: {
      kind: "triptych",
      images: [
        { mediaKey: "cases/woori/cover-01.webp", alt: "Khung hình key visual Woori Z Card 1" },
        { mediaKey: "cases/woori/cover-02.webp", alt: "Khung hình key visual Woori Z Card 2" },
        { mediaKey: "cases/woori/cover-03.webp", alt: "Khung hình key visual Woori Z Card 3" },
      ],
    },
    overviewLead: p(
      t("Gen Z muốn tự chủ chi tiêu nhưng thường “cháy túi” vào cuối tháng. Chiến dịch "),
      b("“Đừng chỉ mơ, hãy tự chủ tài chính”"),
      t(" đặt thẻ "),
      abbr("Woori Z Card", "Woori Z Card", "Thẻ ghi nợ quốc tế dành cho Gen Z: tích điểm 2% mỗi giao dịch online, tối đa 500.000đ/tháng."),
      t(" vào đúng nơi người trẻ dành thời gian nhiều nhất: TikTok. Mỗi video bắt đầu bằng một ước mơ và kết thúc bằng hành động cụ thể: tải ứng dụng Woori WON, mở tài khoản "),
      abbr("e-Moi", "Tài khoản e-Moi", "Tài khoản thanh toán mở hoàn toàn online trên ứng dụng Woori WON Việt Nam."),
      t(" qua "),
      abbr("e-KYC", "e-KYC", "Định danh khách hàng điện tử: xác thực giấy tờ và khuôn mặt ngay trên điện thoại, không cần ra quầy."),
      t(" và nhận ngay 80.000đ."),
    ),
    infoTitle: "Thông tin chiến dịch",
    infoRows: [
      { term: "Thương hiệu", description: "Woori Bank Việt Nam" },
      { term: "Sản phẩm", description: "Thẻ ghi nợ quốc tế Woori Z Card, tài khoản e-Moi, ứng dụng Woori WON Việt Nam" },
      { term: "Đơn vị thực hiện", description: "Byte Media Agency" },
      { term: "Vai trò của tôi", description: "Copywriter Lead, dẫn dắt mảng video content" },
      { term: "Thời gian", description: "2022, 3 tháng" },
      { term: "Kênh", description: "TikTok, Fanpage, In-app" },
      { term: "Đối tượng", description: "Gen Z: học sinh, sinh viên, người mới đi làm" },
    ],
    sections: [
      {
        id: "boi-canh",
        title: "Bối cảnh",
        blocks: [
          { type: "paragraph", segments: p(t("Woori Bank Việt Nam là ngân hàng nước ngoài có vốn điều lệ hàng đầu tại Việt Nam. Năm 2022, ngân hàng muốn mở rộng tệp khách hàng trẻ với thẻ ghi nợ quốc tế Z Card, thiết kế hiện đại và cá tính dành riêng cho Gen Z.")) },
          { type: "paragraph", segments: p(t("Sản phẩm có nhiều lợi thế: tích điểm 2% mọi giao dịch online (tối đa 500.000đ/tháng), giảm tới 50% tại Woori Store, miễn phí giao dịch, rút tiền ATM ngân hàng khác và duy trì thẻ. Toàn bộ quy trình mở tài khoản và đăng ký thẻ diễn ra online qua e-KYC, kèm ưu đãi 80.000đ vào tài khoản e-Moi.")) },
          { type: "paragraph", segments: p(t("Thách thức là làm sao để một ngân hàng nước ngoài nói chuyện tự nhiên với Gen Z trên nền tảng video ngắn, và quan trọng hơn, khiến họ thật sự hoàn tất đăng ký trên ứng dụng.")) },
        ],
      },
      {
        id: "muc-tieu",
        title: "Mục tiêu",
        blocks: [
          {
            type: "list",
            items: [
              p(b("Chuyển đổi: "), t("đạt 7.500 lượt mở thẻ Z Card thành công qua e-KYC trên ứng dụng Woori WON.")),
              p(b("Nhận diện: "), t("phủ sóng thương hiệu Woori Bank trên nền tảng video ngắn TikTok.")),
            ],
          },
        ],
      },
      {
        id: "insight",
        title: "Insight",
        blocks: [
          { type: "paragraph", segments: p(t("Gen Z thích tự do thể hiện bản sắc, mua sắm online, đam mê phong cách Hàn Quốc và các xu hướng đang thịnh hành. Họ muốn tự chủ chi tiêu, nhưng lại thường gặp khó khăn khi kiểm soát tài chính cá nhân vào cuối tháng.")) },
          { type: "paragraph", segments: p(t("Khoảng cách giữa "), b("điều mình mơ"), t(" và "), b("số dư trong tài khoản"), t(" chính là chỗ Z Card có thể bước vào: không bán một chiếc thẻ, mà bán cảm giác lần đầu tự chủ tài chính.")) },
        ],
      },
      {
        id: "chien-luoc",
        title: "Chiến lược",
        blocks: [
          {
            type: "list",
            items: [
              p(b("Phễu chuyển đổi ba tầng: "), t("Awareness bằng video animation pop art và KOL; Interest bằng đòn bẩy tài chính 80.000đ và hoàn tiền 2%; Action bằng chuỗi video hướng dẫn 11 bước e-KYC tại nhà.")),
              p(b("Kể chuyện qua KOL có kiểm soát: "), t("agency trực tiếp viết kịch bản chi tiết bám sát key message, không để KOL tự do sáng tạo lệch thông điệp.")),
              p(b("CTA ngay từ 3 giây đầu: "), t("intro ngắn kêu gọi follow kênh và nhận 80k để thông điệp không trôi khi người dùng lướt nhanh.")),
              p(b("Đo lường và điều chỉnh liên tục: "), t("theo dõi lượt nhấp link tải WON App trên bio của influencer, thử nghiệm các bản nhạc trending để tăng hiển thị.")),
            ],
          },
        ],
      },
      {
        id: "y-tuong",
        title: "Ý tưởng sáng tạo",
        blocks: [
          {
            type: "quote",
            quote: "“Đừng chỉ mơ, hãy tự chủ tài chính cùng Woori Z Card”",
            attribution: "Key message: “My first time independent finance”",
          },
          {
            type: "paragraph",
            segments: p(
              t("Z Card được định vị là "),
              b("chiếc thẻ ngân hàng đầu tiên"),
              t(" đồng hành cùng Gen Z trên hành trình tự chủ tài chính. Biểu tượng xuyên suốt là "),
              b("chiếc kính mắt"),
              t(": trong tròng kính lần lượt hiện ra ước mơ như xe sang, túi hiệu, du lịch biển, rồi được thay bằng thẻ Z Card và ứng dụng WON. Ước mơ chuyển thành hiện thực chỉ bằng một lần mở thẻ."),
            ),
          },
        ],
      },
      {
        id: "thuc-thi",
        title: "Hoạt động thực thi",
        blocks: [
          { type: "paragraph", segments: p(t("Chiến dịch triển khai qua ba giai đoạn theo hành trình của người dùng, từ biết đến thương hiệu, hiểu sản phẩm, đến mở thẻ thành công.")) },
          {
            type: "phases",
            items: [
              { kicker: "Giai đoạn 1", title: "Branding & Awareness", description: "“Chiếc thẻ ngân hàng đầu tiên của Gen Z”: video key visual animation và KOL khẳng định phong cách sống tự chủ." },
              { kicker: "Giai đoạn 2", title: "Engagement & Education", description: "“Lần đầu tiên tự chủ tài chính và bí kíp tiêu xài hiệu quả”: storytelling từ influencer, minigame nhận thưởng." },
              { kicker: "Giai đoạn 3", title: "Conversion & CTA", description: "“Mở thẻ online dễ dàng, nhận ngay 80.000đ”: hướng dẫn 11 bước e-KYC và video thúc đẩy follow kênh." },
            ],
          },
          {
            type: "stage",
            id: "gd1",
            kicker: "Giai đoạn 1",
            title: "Branding & Awareness",
            blocks: [
              { type: "heading4", text: "Hoạt động 1: Video key visual animation" },
              { type: "paragraph", segments: p(t("Video 15 đến 30 giây cho TikTok và Fanpage, phong cách pop art 2D/3D trên nền màu thương hiệu. Mở đầu bằng câu hỏi “Ước mơ của bạn là gì?”, hiệu ứng zoom vào tròng kính hiện xe sang và resort biển, rồi Z Card rơi vào tròng kính biến ước mơ thành hiện thực, kết thúc bằng thẻ, ứng dụng WON và phần quà 80.000đ.")) },
              {
                type: "figure",
                layout: "grid4",
                aspectRatio: "808 / 1316",
                images: Array.from({ length: 8 }, (_, i) => ({
                  mediaKey: `cases/woori/storyboard-${String(i + 1).padStart(2, "0")}.webp`,
                  alt: `Khung hình storyboard ${i + 1}`,
                })),
                caption: "Storyboard và voice-over video key visual Z Card: tám khung hình từ ước mơ đến lời kêu gọi mở thẻ.",
                source: "Byte Media cho Woori Bank",
              },
              { type: "paragraph", segments: p(t("Kịch bản phân cảnh do tôi xây dựng, chi tiết đến thời lượng, âm thanh và text trên màn hình:")) },
              {
                type: "table",
                headers: ["Cảnh", "Thời lượng", "Âm thanh", "Hình ảnh", "Text trên màn hình"],
                rows: [
                  ["1. Mở đầu", "3s", "Nhạc bump lên", "Key visual pop-up, tròng kính còn trống", "“Ước mơ của bạn là gì?”"],
                  ["2. Xe sang", "3s", "Nhạc hào hứng, hiệu ứng sao băng", "Zoom vào tròng kính có chiếc xe sang", "“Lái chiếc xe sang?”"],
                  ["3. Du lịch", "5s", "Hiệu ứng gió", "Xe chạy trên đường ven biển, hàng dừa hai bên", "“Du lịch sang chảnh”"],
                  ["4. Câu hỏi", "3s", "Rung lắc", "Xe trong tròng kính được thay bằng 2 thẻ Woori", "“Nhưng tiền đâu để có xe sang?”"],
                  ["5. Giải pháp", "3s", "Swosh, khói", "Hai thẻ đặt cạnh nhau, tagline hiện phía trên", "“Trong Z Card! Mở tài khoản nhận ngay 80.000đ”"],
                  ["6. CTA", "3s", "CTA", "Thẻ đổi tư thế, hiện tagline và logo", "“Đừng chỉ mơ, hãy tự chủ tài chính ngay hôm nay”"],
                ],
              },
              { type: "heading4", text: "Hoạt động 2: KOL khẳng định phong cách sống tự chủ" },
              { type: "paragraph", segments: p(t("Song song với video animation, KOL xuất hiện cùng key visual để gắn Z Card với hình ảnh người trẻ độc lập, tự tin chi tiêu cho đam mê của mình.")) },
            ],
          },
          {
            type: "stage",
            id: "gd2",
            kicker: "Giai đoạn 2",
            title: "Engagement & Education",
            blocks: [
              { type: "heading4", text: "Hoạt động 1: Storytelling cùng Hoàng Bách" },
              { type: "paragraph", segments: p(t("Video tình huống Gen Z thực tế với voice-over hài hước, 30 đến 60 giây. Cuối tháng ăn mì tôm ngán ngẩm, đầu tháng có lương lại tiêu xài hoang phí, rồi giật mình vì hóa đơn tiền điện. Lối thoát là bí kíp quản lý chi tiêu với Z Card: tải WON App, mở thẻ nhận ngay 80k và hoàn tiền 2%.")) },
              { type: "heading4", text: "Hoạt động 2: Storytelling cùng Như Ngọc" },
              { type: "paragraph", segments: p(t("Bắt trend đập hộp thẻ và parody phim “Hẹn hò chốn công sở”: từ khoảnh khắc mê chiếc thẻ đen của nam chính đến màn mở hộp thẻ Z Card. Thực tế đời thường: tải WON App mở tài khoản e-Moi nhận 80k, tích điểm online đổi tới 500k, tự tin quẹt thẻ khi mua sắm.")) },
              { type: "heading4", text: "Hoạt động 3: Minigame và ưu đãi" },
              { type: "paragraph", segments: p(t("Minigame nhận thưởng 80k và hoàn tiền 500k giữ nhịp tương tác giữa các video, tạo lý do để người xem quay lại kênh.")) },
            ],
          },
          {
            type: "stage",
            id: "gd3",
            kicker: "Giai đoạn 3",
            title: "Conversion & CTA",
            blocks: [
              { type: "heading4", text: "Hoạt động 1: Video hướng dẫn 11 bước e-KYC" },
              { type: "paragraph", segments: p(t("Screen recording kết hợp UI animation và text callout, 18 đến 30 giây: tải WON App, xác thực giấy tờ, chụp khuôn mặt, tạo mật khẩu, chọn địa chỉ nhận thẻ. Mục tiêu là gỡ rào cản cuối cùng trước khi người dùng hành động.")) },
              { type: "heading4", text: "Hoạt động 2: Video follow-up và CTA" },
              { type: "paragraph", segments: p(t("Video 15 đến 20 giây theo concept business và lifestyle: nhân vật bận rộn, sang trọng, tự chủ tài chính nhờ kiểm soát thu chi trên WON App, chỉ tay kêu gọi bấm follow kênh Woori Bank Vietnam.")) },
              { type: "heading4", text: "Hoạt động 3: Tối ưu sáng tạo sau feedback" },
              {
                type: "list",
                items: [
                  p(b("Hình ảnh: "), t("tách nền nhân vật, vẽ lại cửa hàng thời trang, siêu xe, thẻ ngân hàng theo phong cách pop art; đồng nhất nền theo màu thương hiệu; thêm hiệu ứng rung, khói, lấp lánh cho đồ vật.")),
                  p(b("Chữ và chuyển động: "), t("thay khung chữ nhỏ khó đọc bằng text nhảy cỡ lớn cho màn hình 9:16, làm nổi bật “Nhận ngay 80k nhé”; tăng nhịp chuyển cảnh khi zoom vào tròng kính.")),
                  p(b("Quy trình KOL: "), t("tối đa 3 vòng duyệt kịch bản trước khi quay; thêm intro 3 giây kêu gọi follow và nhận 80k.")),
                ],
              },
            ],
          },
        ],
      },
    ],
    conclusion: [
      p(t("Chiến dịch Z Card cho thấy một ngân hàng có thể nói chuyện với Gen Z bằng chính ngôn ngữ của họ mà vẫn giữ được mục tiêu kinh doanh rõ ràng. Thay vì liệt kê tính năng, chiến dịch bắt đầu từ ước mơ, dùng một biểu tượng thị giác dễ nhớ là chiếc kính mắt, rồi dẫn người xem qua từng bước tới hành động mở thẻ.")),
      p(t("Điều làm nên kết quả không chỉ là ý tưởng, mà là sự kỷ luật trong thực thi: kịch bản KOL được kiểm soát chặt, CTA đặt ngay 3 giây đầu, và sáng tạo được điều chỉnh liên tục theo feedback. Nhờ đó, cảm hứng được chuyển thành 7.500 tài khoản thật.")),
    ],
    nextProjects: [
      { slug: "com-nieu-thien-ly", title: "Cơm Niêu Thiên Lý: làm mới nhận diện thương hiệu" },
      { slug: "phu-hung-life", title: "Phú Hưng Life: CSR, truyền thông nội bộ và PR lãnh đạo" },
    ],
  };

  const cntlBody: ProjectBody = {
    breadcrumbTitle: "Cơm Niêu Thiên Lý",
    cover: {
      kind: "single",
      mediaKey: "cases/cntl/cover.webp",
      alt: "Mâm cơm niêu với hơn 100 món Việt từ nguyên liệu tươi ngon",
    },
    overviewLead: p(
      t("Khi chuỗi nhà hàng mở thêm chi nhánh mới liên tục, hình ảnh thương hiệu trên mạng xã hội lại mỗi bài một kiểu. Tôi cùng đội ngũ nội bộ xác định lại thuộc tính thương hiệu, xây dựng "),
      b("bộ hướng dẫn nhận diện mới"),
      t(" và đưa nó vào mọi điểm chạm, từ cửa hàng, "),
      abbr("OOH", "OOH (Out-of-home)", "Quảng cáo ngoài trời: biển hiệu, pano, standee tại cửa hàng."),
      t(" đến Facebook, Zalo, TikTok và LinkedIn. Kết quả: tương tác Facebook tăng 153,4% chỉ sau ba tháng."),
    ),
    infoTitle: "Thông tin chiến dịch",
    infoRows: [
      { term: "Thương hiệu", description: "Cơm Niêu Thiên Lý" },
      { term: "Ngành", description: "F&B, chuỗi nhà hàng món Việt" },
      { term: "Vai trò của tôi", description: "Social Media Marketing Lead" },
      { term: "Thời gian", description: "Tháng 9/2024 đến tháng 4/2025" },
      { term: "Kênh", description: "Facebook, Zalo, TikTok, LinkedIn, cửa hàng, OOH" },
      { term: "Phạm vi", description: "Nhận diện thương hiệu, social, khai trương, chiến dịch theo chủ đề, KOC" },
    ],
    sections: [
      {
        id: "boi-canh",
        title: "Bối cảnh",
        blocks: [
          { type: "paragraph", segments: p(t("Cơm Niêu Thiên Lý là chuỗi nhà hàng món Việt với hơn 10 năm phát triển, đang mở rộng nhanh qua các chi nhánh mới như chi nhánh 30, 31, Quận 5, Phan Đình Giót và hướng tới mô hình nhượng quyền.")) },
          {
            type: "figure",
            layout: "single",
            images: [{ mediaKey: "cases/cntl/feed-before-context.webp", alt: "Feed Facebook trước khi làm mới: nền vàng cam rực, mỗi ấn phẩm một bố cục và kiểu chữ khác nhau." }],
            caption: "Feed Facebook trước khi làm mới: nền vàng cam rực, mỗi ấn phẩm một bố cục và kiểu chữ khác nhau.",
            source: "Cơm Niêu Thiên Lý",
          },
          { type: "paragraph", segments: p(t("Tốc độ mở rộng đặt ra một vấn đề: hình ảnh thương hiệu chưa thống nhất. Mỗi ấn phẩm dùng màu, bố cục và kiểu chữ khác nhau, khiến khách hàng khó nhận ra một thương hiệu nhất quán giữa cửa hàng, mạng xã hội và quảng cáo ngoài trời. Thương hiệu cũng chưa có kênh tiếp cận riêng cho nhà đầu tư nhượng quyền.")) },
        ],
      },
      {
        id: "muc-tieu",
        title: "Mục tiêu",
        blocks: [
          {
            type: "list",
            items: [
              p(t("Xác định thuộc tính thương hiệu và xây dựng bộ hướng dẫn nhận diện mới.")),
              p(t("Chuẩn hóa nhận diện trên mọi điểm chạm vật lý và số: cửa hàng, mạng xã hội, OOH.")),
              p(t("Tăng tương tác và lượng người theo dõi trên các kênh mạng xã hội.")),
              p(t("Hỗ trợ doanh số cho cửa hàng mới khai trương và cửa hàng địa phương.")),
              p(t("Mở kênh LinkedIn để tiếp cận nhà đầu tư nhượng quyền.")),
            ],
          },
        ],
      },
      {
        id: "insight",
        title: "Insight",
        blocks: [
          { type: "paragraph", segments: p(t("Thực khách tìm đến cơm niêu không chỉ vì món ăn, mà vì cảm giác được ăn một bữa cơm nhà: hạt cơm cháy giòn trong niêu đất, nồi canh nóng, đĩa cá kho ai cũng nhớ vị. Hình ảnh rực rỡ kiểu khuyến mãi làm lu mờ chính cảm giác ấm áp đó.")) },
          { type: "paragraph", segments: p(t("Thương hiệu cần trông giống như những gì nó mang lại: "), b("cơm nhà, ấm áp và tử tế"), t(".")) },
        ],
      },
      {
        id: "chien-luoc",
        title: "Chiến lược",
        blocks: [
          {
            type: "list",
            items: [
              p(b("Bắt đầu từ thuộc tính thương hiệu: "), t("cùng đội ngũ nội bộ chốt ba trụ cột Tử tế, Nguyên liệu và Hương vị Việt làm nền cho mọi quyết định hình ảnh và nội dung.")),
              p(b("Một hệ thống, nhiều điểm chạm: "), t("chuẩn hóa nhận diện từ cửa hàng, social đến OOH để khách hàng gặp cùng một thương hiệu ở mọi nơi.")),
              p(b("Gắn nhận diện với kinh doanh: "), t("mỗi đợt khai trương, mùa lễ và ưu đãi đều được thiết kế trên cùng hệ thống, vừa giữ chuẩn mực vừa thúc đẩy doanh số.")),
              p(b("Mở rộng tiếng nói qua KOC và LinkedIn: "), t("KOC lan tỏa trải nghiệm tại địa phương, LinkedIn nói chuyện với nhà đầu tư nhượng quyền.")),
            ],
          },
        ],
      },
      {
        id: "y-tuong",
        title: "Ý tưởng sáng tạo",
        blocks: [
          {
            type: "quote",
            quote: "“Nơi vị cơm nhà kết nối những nụ cười”",
            attribution: "Ba trụ cột: Tử tế · Nguyên liệu · Hương vị Việt",
          },
          {
            type: "paragraph",
            segments: p(
              t("Hệ thống hình ảnh mới chuyển từ vàng cam rực sang "),
              b("tông nâu đất ấm"),
              t(", món ăn được chụp trên chất liệu mộc như lá chuối, mây tre, niêu đất, kết hợp chữ viết tay mềm mại. Mỗi trụ cột thương hiệu được kể bằng một câu chuyện riêng, đặt trong khung ảnh như tấm thiệp gửi thực khách."),
            ),
          },
          {
            type: "figure",
            layout: "grid3",
            aspectRatio: "1 / 1",
            images: [
              { mediaKey: "cases/cntl/pillar-01.webp", alt: "Trụ cột Tử tế" },
              { mediaKey: "cases/cntl/pillar-02.webp", alt: "Trụ cột Nguyên liệu" },
              { mediaKey: "cases/cntl/pillar-03.webp", alt: "Trụ cột Hương vị Việt" },
            ],
            caption: "Bộ ấn phẩm ba trụ cột thương hiệu: Tử tế, Nguyên liệu, Hương vị Việt.",
            source: "Cơm Niêu Thiên Lý",
          },
        ],
      },
      {
        id: "thuc-thi",
        title: "Hoạt động thực thi",
        blocks: [
          { type: "paragraph", segments: p(t("Triển khai qua ba giai đoạn: định hình nhận diện, chuẩn hóa điểm chạm và kích hoạt bán hàng.")) },
          {
            type: "phases",
            items: [
              { kicker: "Giai đoạn 1", title: "Định hình nhận diện", description: "Xác định thuộc tính thương hiệu, xây dựng brand identity guide, chuyển đổi feed sang hệ thống mới." },
              { kicker: "Giai đoạn 2", title: "Chuẩn hóa điểm chạm", description: "Áp dụng nhận diện trên social, cửa hàng và OOH; hướng dẫn Content Creator sản xuất nội dung." },
              { kicker: "Giai đoạn 3", title: "Kích hoạt bán hàng", description: "Truyền thông khai trương, chiến dịch theo mùa, ưu đãi, KOC và kênh LinkedIn cho nhượng quyền." },
            ],
          },
          {
            type: "stage",
            id: "gd1",
            kicker: "Giai đoạn 1",
            title: "Định hình nhận diện",
            blocks: [
              { type: "heading4", text: "Hoạt động 1: Xây dựng bộ hướng dẫn nhận diện" },
              { type: "paragraph", segments: p(t("Tôi cùng đội ngũ nội bộ xác định thuộc tính thương hiệu và phát triển bộ brand identity guide mới: bảng màu nâu đất, phong cách ảnh món ăn trên chất liệu mộc, kiểu chữ viết tay kết hợp chữ in đậm, cách đặt logo và thông tin trên từng định dạng.")) },
              { type: "paragraph", segments: p(t("Bộ nhận diện sau đó được đưa vào thực thi qua các buổi "), b("photo shooting theo concept"), t(" cho từng nhóm món và câu chuyện thương hiệu, cùng với "), b("sản xuất video"), t(" và thiết kế ấn phẩm, để mọi hình ảnh mới đều đi ra từ cùng một chuẩn mực.")) },
              { type: "heading4", text: "Hoạt động 2: So sánh trước và sau" },
              {
                type: "beforeAfter",
                beforeKey: "cases/cntl/ba-before.webp",
                beforeAlt: "Feed mạng xã hội trước khi làm mới nhận diện",
                afterKey: "cases/cntl/ba-after.webp",
                afterAlt: "Feed mạng xã hội sau khi làm mới nhận diện",
                caption: "Kéo thanh trượt để so sánh feed Facebook trước và sau khi áp dụng bộ nhận diện mới.",
                source: "Cơm Niêu Thiên Lý",
              },
              {
                type: "figure",
                layout: "grid2",
                aspectRatio: "3 / 2",
                images: [
                  { mediaKey: "cases/cntl/stage-before.webp", alt: "Feed trước, giai đoạn khai trương" },
                  { mediaKey: "cases/cntl/stage-after.webp", alt: "Feed sau khi áp dụng bộ nhận diện" },
                ],
                caption: "Hai giai đoạn của feed: trước (trái) và sau (phải) khi chuẩn hóa nhận diện.",
                source: "Cơm Niêu Thiên Lý",
              },
            ],
          },
          {
            type: "stage",
            id: "gd2",
            kicker: "Giai đoạn 2",
            title: "Chuẩn hóa điểm chạm",
            blocks: [
              { type: "heading4", text: "Hoạt động 1: Nội dung mạng xã hội" },
              { type: "paragraph", segments: p(t("Tôi hướng dẫn Content Creator sản xuất, biên tập và đăng tải nội dung theo chuẩn mới. Mỗi món ăn trở thành một câu chuyện về nguyên liệu và hương vị.")) },
              {
                type: "figure",
                layout: "grid4",
                aspectRatio: "4 / 5",
                images: [
                  { mediaKey: "cases/cntl/dish-01.webp", alt: "Cơm niêu" },
                  { mediaKey: "cases/cntl/dish-02.webp", alt: "Cá hú kho thịt ba chỉ" },
                  { mediaKey: "cases/cntl/dish-03.webp", alt: "Bò xào bí nụ" },
                  { mediaKey: "cases/cntl/dish-04.webp", alt: "Cơm niêu thủy giòn" },
                ],
                caption: "Bộ ảnh món ăn theo phong cách nhận diện mới.",
                source: "Cơm Niêu Thiên Lý",
              },
              { type: "heading4", text: "Hoạt động 2: Cửa hàng và OOH" },
              { type: "paragraph", segments: p(t("Nhận diện được chuẩn hóa tại cửa hàng, trên mạng xã hội và quảng cáo ngoài trời, để thực khách gặp cùng một thương hiệu dù ở chi nhánh nào.")) },
              {
                type: "figure",
                layout: "grid2",
                aspectRatio: "1 / 1",
                images: [
                  { mediaKey: "cases/cntl/branch-q5.webp", alt: "Chào đón chi nhánh Quận 5" },
                  { mediaKey: "cases/cntl/branch-joy.webp", alt: "Trọn niềm vui cùng thực khách" },
                ],
                caption: "Ấn phẩm chào đón chi nhánh mới và trải nghiệm tại nhà hàng.",
                source: "Cơm Niêu Thiên Lý",
              },
              { type: "heading4", text: "Hoạt động 3: Video thương hiệu 11 năm" },
              {
                type: "video",
                videoKey: "cases/cntl/video-11-nam.mp4",
                posterKey: "cases/cntl/video-11-nam-poster.webp",
                caption: "Video thương hiệu “11 năm Thiên Lý”, 30 giây.",
                source: "Cơm Niêu Thiên Lý",
                width: 1280,
                height: 720,
              },
            ],
          },
          {
            type: "stage",
            id: "gd3",
            kicker: "Giai đoạn 3",
            title: "Kích hoạt bán hàng",
            blocks: [
              { type: "heading4", text: "Hoạt động 1: Truyền thông khai trương chi nhánh mới" },
              { type: "paragraph", segments: p(t("Mỗi đợt khai trương có chiến lược truyền thông riêng với ưu đãi đủ mạnh để kéo khách đến lần đầu, như cơm niêu cháy giòn 1.000đ mừng chi nhánh 30 hay voucher 50.000đ tại chi nhánh Phan Đình Giót.")) },
              {
                type: "figure",
                layout: "grid2",
                aspectRatio: "1 / 1",
                images: [
                  { mediaKey: "cases/cntl/opening-cn30.webp", alt: "Cơm niêu cháy giòn 1.000đ mừng khai trương chi nhánh 30" },
                  { mediaKey: "cases/cntl/opening-pdg.webp", alt: "Mừng khai trương chi nhánh Phan Đình Giót" },
                ],
                caption: "Ấn phẩm khai trương chi nhánh.",
                source: "Cơm Niêu Thiên Lý",
              },
              { type: "heading4", text: "Hoạt động 2: Chiến dịch theo mùa và ưu đãi" },
              { type: "paragraph", segments: p(t("Các chiến dịch theo chủ đề được lên kế hoạch, chỉ đạo và tối ưu để triển khai đồng bộ trên mọi kênh: bộ sưu tập quà Tết 2025, “Lộc xuân gõ cửa”, ưu đãi món ngon và quà tặng cho thực khách.")) },
              {
                type: "figure",
                layout: "grid4",
                aspectRatio: "1 / 1",
                images: [
                  { mediaKey: "cases/cntl/tet-01.webp", alt: "Bộ sưu tập Tết 2025" },
                  { mediaKey: "cases/cntl/tet-02.webp", alt: "Lộc xuân gõ cửa" },
                  { mediaKey: "cases/cntl/tet-03.webp", alt: "Giảm 20% món ngon thượng hạng" },
                  { mediaKey: "cases/cntl/tet-04.webp", alt: "Tặng 4 món nước" },
                ],
                caption: "Chiến dịch Tết và chương trình ưu đãi.",
                source: "Cơm Niêu Thiên Lý",
              },
              { type: "heading4", text: "Hoạt động 3: KOC, Influencer và LinkedIn nhượng quyền" },
              { type: "paragraph", segments: p(t("Tôi quản lý quan hệ với KOC và Influencer, triển khai các chiến dịch nâng uy tín thương hiệu tại thị trường địa phương như workshop nấu ăn cùng khách mời. Song song, kênh LinkedIn được khởi tạo để tiếp cận nhà đầu tư quan tâm đến mô hình nhượng quyền.")) },
              {
                type: "figure",
                layout: "single",
                images: [{ mediaKey: "cases/cntl/koc-workshop.webp", alt: "Workshop nấu ăn cùng khách mời và KOC tại nhà hàng." }],
                caption: "Workshop nấu ăn cùng khách mời và KOC tại nhà hàng.",
                source: "Cơm Niêu Thiên Lý",
              },
            ],
          },
        ],
      },
    ],
    conclusion: [
      p(t("Dự án cho thấy nhận diện thương hiệu không chỉ là chuyện thẩm mỹ. Khi thương hiệu trông giống như những gì nó mang lại, ấm áp và tử tế như một bữa cơm nhà, mọi nội dung sau đó đều dễ được nhận ra và dễ được yêu thích hơn.")),
      p(t("Bộ nhận diện mới trở thành nền tảng chung cho cả đội ngũ: Content Creator biết phải sản xuất thế nào, mỗi chi nhánh mới khai trương đều mang cùng một gương mặt, và các chiến dịch bán hàng vẫn giữ được chuẩn mực thương hiệu.")),
    ],
    nextProjects: [
      { slug: "woori", title: "Woori Bank Z Card: tự chủ tài chính cùng Gen Z" },
      { slug: "phu-hung-life", title: "Phú Hưng Life: CSR, truyền thông nội bộ và PR lãnh đạo" },
    ],
  };

  const phlBody: ProjectBody = {
    breadcrumbTitle: "Phú Hưng Life",
    cover: {
      kind: "single",
      mediaKey: "cases/phl/cover.webp",
      alt: "Tổng Giám đốc Phú Hưng Life cùng đội ngũ tại sự kiện nội bộ",
    },
    overviewLead: p(
      t("Tại Phú Hưng Life, tôi đảm nhận vai trò "),
      b("Senior Content Marketing"),
      t(" cho một doanh nghiệp bảo hiểm nhân thọ có mạng lưới văn phòng trên toàn quốc. Nổi bật nhất là chiến dịch PR ra mắt Tổng Giám đốc mới trên năm đầu báo lớn và chuỗi "),
      abbr("CSR", "CSR", "Trách nhiệm xã hội doanh nghiệp: hoạt động vì cộng đồng, không nhằm bán sản phẩm."),
      t(" giáo dục tài chính cho phụ nữ Vĩnh Long. Song song, tôi duy trì truyền thông nội bộ, nội dung mạng xã hội và tham gia xây dựng website mới."),
    ),
    infoTitle: "Thông tin công việc",
    infoRows: [
      { term: "Doanh nghiệp", description: "Phú Hưng Life" },
      { term: "Ngành", description: "Bảo hiểm nhân thọ" },
      { term: "Vai trò của tôi", description: "Senior Content Marketing" },
      { term: "Thời gian", description: "Tháng 4/2025 đến tháng 3/2026" },
      { term: "Đối tác", description: "Agency Novaon (PR), Quỹ LSTF và Hội Liên hiệp Phụ nữ tỉnh Vĩnh Long (CSR)" },
      { term: "Kênh", description: "Báo chí, sự kiện cộng đồng, Email, GapoWork, Facebook Group nội bộ, fanpage, website" },
    ],
    overviewExtraBlocks: [
      {
        type: "phases",
        autoFit: true,
        items: [
          { kicker: "Nổi bật", title: "PR ra mắt Tổng Giám đốc", description: "Năm đầu báo lớn, tháng 2/2026.", href: "#pr-ceo" },
          { kicker: "Nổi bật", title: "CSR giáo dục tài chính", description: "10 buổi, 1.000+ người tham dự tại Vĩnh Long.", href: "#csr" },
          { kicker: "Duy trì", title: "Truyền thông nội bộ", description: "Beyond the Desk, outing, giải thưởng văn hóa, thư CEO.", href: "#noi-bo" },
          { kicker: "Duy trì", title: "Social post", description: "Nội dung lifestyle trên fanpage.", href: "#social" },
          { kicker: "Duy trì", title: "Draft UI website mới", description: "Trang chủ và trang sản phẩm.", href: "#website" },
        ],
      },
    ],
    sections: [
      {
        id: "pr-ceo",
        kicker: "Dự án nổi bật",
        title: "PR ra mắt Tổng Giám đốc mới",
        tags: ["Tháng 2/2026", "Phối hợp agency Novaon", "5 đầu báo"],
        blocks: [
          { type: "paragraph", segments: p(t("Đầu năm 2026, Phú Hưng Life bổ nhiệm Tổng Giám đốc mới, bà Yong Lai Yin. Sự thay đổi lãnh đạo ở một doanh nghiệp bảo hiểm cần được công bố nhất quán để giữ niềm tin của khách hàng, đối tác và đội ngũ tư vấn.")) },
          { type: "paragraph", segments: p(t("Tôi phối hợp cùng agency Novaon định hướng nội dung, duyệt bài và triển khai chiến dịch PR tích hợp: tin bổ nhiệm trên các báo kinh doanh lớn, kết hợp một bài phỏng vấn editorial trên Vietcetera để kể câu chuyện con người và triết lý lãnh đạo phía sau chức danh.")) },
          {
            type: "quote",
            quote: "“Trong bảo hiểm, kỷ luật chính là hình thái cao nhất của niềm tin”",
            attribution: "Bà Yong Lai Yin, Tổng Giám đốc Phú Hưng Life, trả lời phỏng vấn Vietcetera",
          },
          { type: "heading3", text: "Lịch phát hành" },
          {
            type: "table",
            headers: ["Đầu báo", "Ngày đăng", "Tiêu đề", "Vị trí", "Lượt xem"],
            rows: [
              ["Dân Trí", "11/02/2026", "Phú Hưng Life bổ nhiệm Tổng giám đốc mới", "Top 3 Kinh doanh", "16.900"],
              ["Tuổi Trẻ", "11/02/2026", "Phú Hưng Life củng cố đội ngũ lãnh đạo cho giai đoạn tăng trưởng mới", "Link 3 Doanh nghiệp", "4.056"],
              ["VnExpress", "13/02/2026", "Phú Hưng Life bổ nhiệm Tổng giám đốc mới", "Top 6 Kinh doanh", "6.126"],
              ["Doanh Nhân Sài Gòn", "25/02/2026", "Tân Tổng giám đốc và chiến lược phát triển bền vững Phú Hưng Life", "Chuyên mục Nổi bật", "4.687"],
              ["Vietcetera", "26/02/2026", "Bà Yong Lai Yin: “Trong bảo hiểm, kỷ luật chính là hình thái cao nhất của niềm tin”", "Nổi bật trang chủ", "Bài editorial"],
            ],
          },
          {
            type: "figure",
            layout: "grid2",
            aspectRatio: "1400 / 840",
            images: [
              { mediaKey: "cases/phl/press-dantri.webp", alt: "Bài đăng trên Dân Trí" },
              { mediaKey: "cases/phl/press-vnexpress.webp", alt: "Bài đăng trên VnExpress" },
              { mediaKey: "cases/phl/press-tuoitre.webp", alt: "Bài đăng trên Tuổi Trẻ" },
              { mediaKey: "cases/phl/press-dnsg.webp", alt: "Bài đăng trên Doanh Nhân Sài Gòn" },
            ],
            caption: "Vị trí bài viết trên trang chủ và trang chuyên mục của các đầu báo.",
            source: "Báo cáo chiến dịch PR, Novaon",
          },
          {
            type: "figure",
            layout: "single",
            images: [{ mediaKey: "cases/phl/press-vietcetera.webp", alt: "Bài phỏng vấn trên Vietcetera, vị trí nổi bật chuyên mục Kinh doanh." }],
            caption: "Bài phỏng vấn trên Vietcetera, vị trí nổi bật chuyên mục Kinh doanh.",
            source: "Báo cáo chiến dịch PR, Novaon",
          },
        ],
      },
      {
        id: "csr",
        kicker: "Dự án nổi bật",
        title: "CSR: Giáo dục tài chính cho phụ nữ Vĩnh Long",
        tags: ["Tháng 4 đến 9/2025", "LSTF", "Hội Liên hiệp Phụ nữ tỉnh Vĩnh Long"],
        blocks: [
          { type: "paragraph", segments: p(t("Với nhiều phụ nữ ở nông thôn, kiến thức tài chính cá nhân vẫn còn xa lạ. Phú Hưng Life cùng Quỹ Hỗ trợ Cộng đồng Đinh Thiện Lý (LSTF) và Hội Liên hiệp Phụ nữ tỉnh Vĩnh Long tổ chức hành trình tập huấn giáo dục tài chính kéo dài 6 tháng.")) },
          { type: "paragraph", segments: p(t("Chương trình gồm 10 buổi tập huấn tại nhiều xã trong tỉnh, thu hút hơn 1.000 người tham dự với tỷ lệ tham gia trung bình 95%, khép lại bằng hai buổi cuối ngày 25 và 26/09/2025 tại phường Phú Khương và xã Bình Đại.")) },
          {
            type: "paragraph",
            segments: p(
              t("Tôi tham gia đồng tổ chức chương trình, sản xuất ấn phẩm thiết kế và nội dung truyền thông, đảm bảo nhận diện tại sự kiện thống nhất với brand guideline toàn quốc, và truyền thông kết quả trên fanpage chính thức. "),
              lnk("Xem bài đăng trên Facebook", "https://www.facebook.com/PhuHungLifeOfficial/posts/pfbid0nAxLZg5wvyS133RqexhddxnBWcSoSeekWzTeSZW1a99u4LUvKqm1DjgwYSW63TfMl"),
              t("."),
            ),
          },
          {
            type: "figure",
            layout: "single",
            images: [{ mediaKey: "cases/phl/csr-vinh-long.webp", alt: "Các buổi tập huấn giáo dục tài chính cho phụ nữ tại Vĩnh Long, 2025." }],
            caption: "Các buổi tập huấn giáo dục tài chính cho phụ nữ tại Vĩnh Long, 2025.",
            source: "Fanpage Phú Hưng Life",
          },
        ],
      },
      {
        id: "noi-bo",
        kicker: "Công việc duy trì",
        title: "Hỗ trợ truyền thông nội bộ",
        blocks: [
          { type: "paragraph", segments: p(t("Bên cạnh hai dự án nổi bật, tôi duy trì và hỗ trợ các hoạt động truyền thông trong hệ sinh thái nội bộ (Email, GapoWork, Facebook Group), dùng concept bắt trend để tăng gắn kết nhân viên mà vẫn giữ đúng chuẩn thương hiệu.")) },
          { type: "heading3", text: "Beyond the Desk" },
          { type: "paragraph", segments: p(t("Chuyên mục giới thiệu đồng nghiệp “phía sau bàn làm việc”. Mỗi kỳ là một bộ post hỏi đáp vui về phong cách làm việc, sở thích độc lạ, hoạt động nghỉ trưa hay cách đối mặt với những task “khó nhằn”. Tôi thiết kế toàn bộ bộ post theo phong cách minh họa chibi trên nền vàng, giúp nhân viên ở các phòng ban hiểu nhau hơn.")) },
          {
            type: "figure",
            layout: "grid3",
            aspectRatio: "1 / 1",
            images: Array.from({ length: 6 }, (_, i) => ({
              mediaKey: `cases/phl/btd-${String(i + 1).padStart(2, "0")}.webp`,
              alt: `Beyond the Desk, post ${i + 1}`,
            })),
            caption: "Bộ post Beyond the Desk do tôi thiết kế.",
            source: "Phú Hưng Life",
          },
          { type: "heading3", text: "Outing 2025 “Ride the Waves”" },
          { type: "paragraph", segments: p(t("Thiết kế key visual và poster lịch trình cho chuyến outing công ty từ ngày 12 đến 14/09/2025.")) },
          {
            type: "figure",
            layout: "single",
            images: [{ mediaKey: "cases/phl/outing-2025.webp", alt: "Poster lịch trình Outing 2025 “Ride the Waves”." }],
            caption: "Poster lịch trình Outing 2025 “Ride the Waves”.",
            source: "Phú Hưng Life",
          },
          { type: "heading3", text: "Culture Ambassador Award" },
          { type: "paragraph", segments: p(t("Thiết kế cúp và ấn phẩm vinh danh cho giải Culture Ambassador Award, ghi nhận nhân viên lan tỏa giá trị cốt lõi của doanh nghiệp.")) },
          {
            type: "figure",
            layout: "single",
            images: [{ mediaKey: "cases/phl/caa-trophy.webp", alt: "Mockup cúp Culture Ambassador Award 2025." }],
            caption: "Mockup cúp Culture Ambassador Award 2025.",
            source: "Phú Hưng Life",
          },
          { type: "heading3", text: "Thư Tổng Giám đốc hằng tháng" },
          { type: "paragraph", segments: p(t("Chấp bút và thiết kế thông điệp Tổng Giám đốc gửi toàn thể nhân viên mỗi tháng, song ngữ Việt và Anh.")) },
          {
            type: "figure",
            layout: "grid2",
            aspectRatio: "99 / 140",
            images: [
              { mediaKey: "cases/phl/ceo-msg-vi.webp", alt: "Thông điệp Tổng Giám đốc tháng 12/2025, tiếng Việt" },
              { mediaKey: "cases/phl/ceo-msg-en.webp", alt: "General Director Message, December 2025" },
            ],
            caption: "Thông điệp Tổng Giám đốc tháng 12/2025, bản tiếng Việt và tiếng Anh.",
            source: "Phú Hưng Life",
          },
        ],
      },
      {
        id: "social",
        kicker: "Công việc duy trì",
        title: "Social post",
        blocks: [
          { type: "paragraph", segments: p(t("Tôi phụ trách nội dung cho fanpage Phú Hưng Life, trong đó có chuỗi bài lifestyle gần gũi với đời sống để thương hiệu bảo hiểm hiện diện tự nhiên hơn trong mùa lễ cuối năm. Mỗi bài gồm phần viết và bộ hình ảnh đồng bộ nhận diện.")) },
          {
            type: "list",
            items: [
              p(b("26/12: "), t("“Mùa tiệc tùng rộn ràng, đừng để hệ tiêu hóa ‘lên tiếng’”, gợi ý 3 loại nước uống giúp “giải cứu” hệ tiêu hóa.")),
              p(b("31/12: "), t("“Không chỉ 12 trái nho, thêm món đậu lăng để may mắn gấp đôi!”, kể về phong tục đón năm mới ở Tây Ban Nha và Ý.")),
            ],
          },
          {
            type: "tallPair",
            columns: "minmax(0, 1fr) minmax(0, 1.44fr)",
            items: [
              { mediaKey: "cases/phl/social-2612.webp", alt: "Bộ hình bài lifestyle ngày 26/12", caption: "Lifestyle post 26/12.", source: "Phú Hưng Life" },
              { mediaKey: "cases/phl/social-3112.webp", alt: "Bộ hình bài lifestyle ngày 31/12", caption: "Lifestyle post 31/12.", source: "Phú Hưng Life" },
            ],
          },
        ],
      },
      {
        id: "website",
        kicker: "Công việc duy trì",
        title: "Draft UI cho website mới",
        blocks: [
          { type: "paragraph", segments: p(t("Tôi tham gia xây dựng bản draft UI cho website mới của Phú Hưng Life, tập trung vào hành trình của khách hàng: tìm mục tiêu bảo vệ phù hợp, giải quyết quyền lợi, thanh toán phí, đọc tin tức và blog, rồi để lại thông tin tư vấn. Giao diện dùng màu vàng thương hiệu, bố cục thoáng và nút kêu gọi hành động rõ ràng.")) },
          {
            type: "figure",
            layout: "single",
            images: [{ mediaKey: "cases/phl/web-hero.webp", alt: "Trang chủ: ô tìm kiếm “Mục tiêu bảo vệ của bạn là gì?” ngay màn hình đầu." }],
            caption: "Trang chủ: ô tìm kiếm “Mục tiêu bảo vệ của bạn là gì?” ngay màn hình đầu.",
            source: "Phú Hưng Life",
          },
          {
            type: "tallPair",
            items: [
              { mediaKey: "cases/phl/web-home-full.webp", alt: "Toàn bộ trang chủ website mới", caption: "Toàn bộ trang chủ.", source: "Phú Hưng Life" },
              { mediaKey: "cases/phl/web-product-full.webp", alt: "Toàn bộ trang sản phẩm website mới", caption: "Toàn bộ trang sản phẩm.", source: "Phú Hưng Life" },
            ],
          },
          {
            type: "figure",
            layout: "grid2",
            aspectRatio: "3 / 2",
            images: [
              { mediaKey: "cases/phl/web-claims.webp", alt: "Khối giải quyết quyền lợi và thanh toán phí" },
              { mediaKey: "cases/phl/web-health.webp", alt: "Trang sản phẩm: kế hoạch bảo vệ sức khỏe" },
            ],
            caption: "Chi tiết các khối nội dung trên trang chủ và trang sản phẩm.",
            source: "Phú Hưng Life",
          },
        ],
      },
    ],
    resultsNote: "Trong cùng giai đoạn, tương tác tổng trên Website, Facebook, LinkedIn và TikTok của Phú Hưng Life tăng 30%, và 100% văn phòng toàn quốc tuân thủ brand guideline.",
    conclusion: [
      p(t("Ở Phú Hưng Life, công việc truyền thông trải dài từ những dự án lớn có độ phủ báo chí đến những việc nhỏ mỗi tuần như một bộ post nội bộ hay một bài lifestyle. Điểm chung là sự nhất quán: cùng một giọng nói thương hiệu, cùng một chuẩn nhận diện, để niềm tin được xây dần qua từng điểm chạm.")),
    ],
    nextProjects: [
      { slug: "woori", title: "Woori Bank Z Card: tự chủ tài chính cùng Gen Z" },
      { slug: "com-nieu-thien-ly", title: "Cơm Niêu Thiên Lý: Nâng tầm ẩm thực Việt" },
    ],
  };

  const projectDefs = [
    {
      id: "proj-woori",
      slug: "woori",
      order: 1,
      brand: "Woori Bank",
      year: "2022",
      tag: "Social & Video",
      cardHeading: "Đưa một ngân hàng Hàn Quốc đến gần người trẻ trên TikTok",
      cardSummary: "Dẫn dắt mảng video content trong chiến dịch của Woori Bank tại Byte Media, từ concept đến lịch đăng.",
      title: "Woori Bank Z Card: “Đừng chỉ mơ, hãy tự chủ tài chính”",
      subtitle: "Chiến dịch TikTok đưa thẻ ghi nợ Z Card đến Gen Z, biến ước mơ xe sang, túi hiệu thành lời mời mở thẻ online qua e-KYC.",
      accent: "#1C5BB8",
      accentBg: "#DD2F92",
      coverKey: "cases/woori/cover-01.webp",
      wide: 0,
      layout: "case-study",
      chips: ["Social & Video", "TikTok", "Gen Z", "Byte Media Agency"],
      wins: [
        { value: "105K", label: "người theo dõi", tipTitle: "105K người theo dõi", tipBody: "Kênh TikTok xây mới trong 3 tháng." },
        { value: "7.500", label: "tài khoản mới", tipTitle: "7.500 tài khoản mới", tipBody: "Đăng ký trên app ngân hàng trong 3 tháng." },
      ],
      toc: [
        { id: "tong-quan", label: "Tổng quan" },
        { id: "boi-canh", label: "Bối cảnh" },
        { id: "muc-tieu", label: "Mục tiêu" },
        { id: "insight", label: "Insight" },
        { id: "chien-luoc", label: "Chiến lược" },
        { id: "y-tuong", label: "Ý tưởng sáng tạo" },
        { id: "thuc-thi", label: "Hoạt động thực thi" },
        { id: "ket-qua", label: "Kết quả" },
        { id: "ket-luan", label: "Kết luận" },
      ],
      body: wooriBody,
      results: [
        { id: "res-woori-1", order: 1, value: 105, prefix: "", suffix: "K", decimals: 0, display: "105K", label: "người theo dõi kênh TikTok xây mới trong 3 tháng", tipTitle: "Kênh TikTok Woori Bank", tipBody: "Xây dựng từ đầu trong 3 tháng chiến dịch." },
        { id: "res-woori-2", order: 2, value: 7500, prefix: "", suffix: "", decimals: 0, display: "7.500", label: "tài khoản mở mới trên ứng dụng ngân hàng", tipTitle: "Chuyển đổi thật", tipBody: "Đăng ký thành công qua e-KYC, đúng mục tiêu 7.500 đã cam kết." },
        { id: "res-woori-3", order: 3, value: 3, prefix: "", suffix: " tháng", decimals: 0, display: "3 tháng", label: "để đạt toàn bộ KPI", tipTitle: "Thời gian triển khai", tipBody: "Từ video nhận diện đến chuyển đổi." },
        { id: "res-woori-4", order: 4, value: 100, prefix: "", suffix: "%", decimals: 0, display: "100%", label: "KPI cam kết với khách hàng đạt được", tipTitle: "Theo cam kết trong đề xuất", tipBody: "Mục tiêu 7.500 lượt mở thẻ qua e-KYC." },
      ],
    },
    {
      id: "proj-cntl",
      slug: "com-nieu-thien-ly",
      order: 2,
      brand: "Cơm Niêu Thiên Lý",
      year: "2024–2025",
      tag: "Brand & Social",
      cardHeading: "Làm mới bộ nhận diện và đánh thức mạng xã hội của một chuỗi nhà hàng",
      cardSummary: "Xây bộ brand identity guide mới, chuẩn hóa mọi điểm chạm từ cửa hàng đến OOH, và vận hành bốn kênh social.",
      title: "Cơm Niêu Thiên Lý: “Nâng tầm ẩm thực Việt”",
      subtitle: "Làm mới bộ nhận diện cho một chuỗi nhà hàng đang mở rộng, chuẩn hóa mọi điểm chạm và đánh thức bốn kênh mạng xã hội.",
      accent: "#9A5B2E",
      accentBg: "#4A2A1A",
      coverKey: "cases/cntl/cover.webp",
      wide: 0,
      layout: "case-study",
      chips: ["Brand & Social", "F&B", "Meta, Zalo, TikTok, LinkedIn", "Cửa hàng và OOH"],
      wins: [
        { value: "+153,4%", label: "tương tác Facebook", tipTitle: "+153,4% tương tác Facebook", tipBody: "33.800 lượt tương tác sau 3 tháng." },
        { value: "+10%", label: "doanh số", tipTitle: "+10% doanh số", tipBody: "Cho cửa hàng mới và cửa hàng địa phương." },
      ],
      toc: [
        { id: "tong-quan", label: "Tổng quan" },
        { id: "boi-canh", label: "Bối cảnh" },
        { id: "muc-tieu", label: "Mục tiêu" },
        { id: "insight", label: "Insight" },
        { id: "chien-luoc", label: "Chiến lược" },
        { id: "y-tuong", label: "Ý tưởng sáng tạo" },
        { id: "thuc-thi", label: "Hoạt động thực thi" },
        { id: "ket-qua", label: "Kết quả" },
        { id: "ket-luan", label: "Kết luận" },
      ],
      body: cntlBody,
      results: [
        { id: "res-cntl-1", order: 1, value: 153.4, prefix: "+", suffix: "%", decimals: 1, display: "+153,4%", label: "tương tác Facebook, đạt 33.800 lượt sau 3 tháng", tipTitle: "Facebook", tipBody: "Kèm 1.000+ người theo dõi mới trong 3 tháng." },
        { id: "res-cntl-2", order: 2, value: 2000, prefix: "", suffix: "+", decimals: 0, display: "2.000+", label: "người theo dõi TikTok mới, nhiều video đạt 100.000 lượt xem", tipTitle: "TikTok", tipBody: "Trong 3 tháng đầu triển khai." },
        { id: "res-cntl-3", order: 3, value: 20000, prefix: "", suffix: "+", decimals: 0, display: "20.000+", label: "người dùng LinkedIn quan tâm đến nhượng quyền", tipTitle: "Kênh LinkedIn mở mới", tipBody: "Tiếp cận nhà đầu tư nhượng quyền." },
        { id: "res-cntl-4", order: 4, value: 10, prefix: ">", suffix: "%", decimals: 0, display: ">10%", label: "tăng doanh số cho cửa hàng mới và cửa hàng địa phương", tipTitle: "Truyền thông khai trương", tipBody: "Chiến lược cho cửa hàng mới và chiến dịch bán hàng tại địa phương." },
      ],
    },
    {
      id: "proj-phl",
      slug: "phu-hung-life",
      order: 3,
      brand: "Phú Hưng Life",
      year: "2025–2026",
      tag: "CSR, PR & Internal Comms",
      cardHeading: "PR ra mắt Tổng Giám đốc mới và CSR giáo dục tài chính tại Vĩnh Long",
      cardSummary: "Hai dự án nổi bật trong vai trò Senior Content Marketing, cùng các công việc duy trì: truyền thông nội bộ (Beyond the Desk, outing, giải thưởng văn hóa, thư CEO), social post và draft UI website mới.",
      title: "Phú Hưng Life: Senior Content Marketing",
      subtitle: "Hai dự án nổi bật là PR ra mắt Tổng Giám đốc mới và CSR giáo dục tài chính tại Vĩnh Long, cùng các công việc duy trì truyền thông nội bộ, social và website.",
      accent: "#B08A3E",
      accentBg: "#1F2A44",
      coverKey: "cases/phl/cover.webp",
      wide: 1,
      layout: "work-summary",
      chips: ["Senior Content Marketing", "PR báo chí", "CSR", "Truyền thông nội bộ", "Social", "Website"],
      wins: [
        { value: "10", label: "buổi tập huấn tài chính", tipTitle: "10 buổi tập huấn tài chính", tipBody: "6 tháng tại Vĩnh Long, cùng LSTF và Hội Liên hiệp Phụ nữ tỉnh." },
        { value: "1.000+", label: "người tham dự", tipTitle: "1.000+ người tham dự", tipBody: "Tỷ lệ tham gia trung bình 95% qua 10 buổi tập huấn." },
        { value: "5", label: "đầu báo", tipTitle: "5 đầu báo", tipBody: "Dân Trí, Tuổi Trẻ, VnExpress, Doanh Nhân Sài Gòn, Vietcetera." },
      ],
      toc: [
        { id: "tong-quan", label: "Tổng quan" },
        { id: "pr-ceo", label: "PR ra mắt Tổng Giám đốc mới" },
        { id: "csr", label: "CSR: Giáo dục tài chính cho phụ nữ Vĩnh Long" },
        { id: "noi-bo", label: "Hỗ trợ truyền thông nội bộ" },
        { id: "social", label: "Social post" },
        { id: "website", label: "Draft UI cho website mới" },
        { id: "ket-qua", label: "Kết quả" },
        { id: "ket-luan", label: "Kết luận" },
      ],
      body: phlBody,
      results: [
        { id: "res-phl-1", order: 1, value: 5, prefix: "", suffix: "", decimals: 0, display: "5", label: "đầu báo đưa tin Tổng Giám đốc mới", tipTitle: "PR tháng 2/2026", tipBody: "Dân Trí, Tuổi Trẻ, VnExpress, Doanh Nhân Sài Gòn, Vietcetera." },
        { id: "res-phl-2", order: 2, value: 31769, prefix: "", suffix: "", decimals: 0, display: "31.769", label: "lượt xem trên bốn bài báo có số liệu", tipTitle: "Lượt xem đo được", tipBody: "Dân Trí 16.900, VnExpress 6.126, Doanh Nhân Sài Gòn 4.687, Tuổi Trẻ 4.056. Vietcetera chưa có số liệu." },
        { id: "res-phl-3", order: 3, value: 10, prefix: "", suffix: "", decimals: 0, display: "10", label: "buổi tập huấn tài chính trong 6 tháng tại Vĩnh Long", tipTitle: "CSR 2025", tipBody: "Cùng LSTF và Hội Liên hiệp Phụ nữ tỉnh Vĩnh Long." },
        { id: "res-phl-4", order: 4, value: 1000, prefix: "", suffix: "+", decimals: 0, display: "1.000+", label: "người tham dự, tỷ lệ tham gia trung bình 95%", tipTitle: "CSR Vĩnh Long 2025", tipBody: "Hơn 1.000 người tham dự qua 10 buổi tập huấn, tỷ lệ tham gia trung bình 95%." },
      ],
    },
  ];

  for (const prj of projectDefs) {
    lines.push(
      `INSERT INTO projects (id, slug, sort_order, brand, year, tag, card_heading, card_summary, title, subtitle, accent, accent_bg, cover_key, wide, layout, chips_json, wins_json, toc_json, body_json) VALUES (${sqlStr(prj.id)}, ${sqlStr(prj.slug)}, ${prj.order}, ${sqlStr(prj.brand)}, ${sqlStr(prj.year)}, ${sqlStr(prj.tag)}, ${sqlStr(prj.cardHeading)}, ${sqlStr(prj.cardSummary)}, ${sqlStr(prj.title)}, ${sqlStr(prj.subtitle)}, ${sqlStr(prj.accent)}, ${sqlStr(prj.accentBg)}, ${sqlStr(prj.coverKey)}, ${prj.wide}, ${sqlStr(prj.layout)}, ${sqlJson(prj.chips)}, ${sqlJson(prj.wins)}, ${sqlJson(prj.toc)}, ${sqlJson(prj.body)});`,
    );
    for (const r of prj.results) {
      lines.push(
        `INSERT INTO project_results (id, project_id, sort_order, value, prefix, suffix, decimals, display_text, label, tip_title, tip_body) VALUES (${sqlStr(r.id)}, ${sqlStr(prj.id)}, ${r.order}, ${r.value}, ${sqlStr(r.prefix)}, ${sqlStr(r.suffix)}, ${r.decimals}, ${sqlStr(r.display)}, ${sqlStr(r.label)}, ${sqlStr(r.tipTitle)}, ${sqlStr(r.tipBody)});`,
      );
    }
  }

  const seedSqlPath = path.join(SEED_DIR, "seed.sql");
  fs.writeFileSync(seedSqlPath, lines.join("\n") + "\n", "utf8");
  console.log(`Generated ${seedSqlPath} (${lines.length} statements)`);

  // Also generate local & remote binary chunk SQL files for cntl11.mp4 and CV PDF (not tracked in Git if large, or gitignored)
  const blobDir = path.join(ROOT, ".wrangler", "blob-seeds");
  if (fs.existsSync(blobDir)) {
    fs.rmSync(blobDir, { recursive: true, force: true });
  }
  fs.mkdirSync(blobDir, { recursive: true });
  const CHUNK_SIZE = 32 * 1024;
  const binaryFiles: Array<{ src: string; key: string; mime: string }> = [
    { src: "cntl11.mp4", key: "cases/cntl/video-11-nam.mp4", mime: "video/mp4" },
    { src: "CV_Le Thuy Trang_Social & Content MKT.pdf", key: "profile/cv-le-thuy-trang.pdf", mime: "application/pdf" },
  ];

  const batchSqlFiles: string[] = [];
  for (const bf of binaryFiles) {
    const fullSrc = path.join(ROOT, bf.src);
    if (!fs.existsSync(fullSrc)) continue;
    const buf = fs.readFileSync(fullSrc);
    const hash = crypto.createHash("sha1").update(buf).digest("hex").slice(0, 12);
    const statements: string[] = [
      `DELETE FROM media_chunks WHERE key = ${sqlStr(bf.key)};`,
      `DELETE FROM media_objects WHERE key = ${sqlStr(bf.key)};`,
      `INSERT INTO media_objects (key, content_type, size, etag) VALUES (${sqlStr(bf.key)}, ${sqlStr(bf.mime)}, ${buf.byteLength}, ${sqlStr(`"${hash}"`)});`,
    ];

    const totalChunks = Math.ceil(buf.byteLength / CHUNK_SIZE);
    for (let idx = 0; idx < totalChunks; idx++) {
      const slice = buf.subarray(idx * CHUNK_SIZE, Math.min(buf.byteLength, (idx + 1) * CHUNK_SIZE));
      const hex = slice.toString("hex");
      statements.push(
        `INSERT INTO media_chunks (key, chunk_index, data) VALUES (${sqlStr(bf.key)}, ${idx}, X'${hex}');`,
      );
    }

    const safeBase = bf.key.replace(/[^a-z0-9]/gi, "_");
    const sqlFile = path.join(blobDir, `${safeBase}.sql`);
    fs.writeFileSync(sqlFile, statements.join("\n") + "\n", "utf8");
    batchSqlFiles.push(sqlFile);
  }
  fs.writeFileSync(path.join(blobDir, "index.json"), JSON.stringify(batchSqlFiles, null, 2), "utf8");
  console.log(`Prepared ${batchSqlFiles.length} binary D1 seed SQL files in .wrangler/blob-seeds/`);
};

main();
