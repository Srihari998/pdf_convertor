# CALCNEST — Free Calculators & Useful Online Tools

> **Tagline:** Free calculators and useful online tools  
> **Production URL:** https://calcnest.com  
> **Initial Budget:** ₹0 (Deployable on Vercel Free Tier with zero database / zero paid backend requirement)

CalcNest is a production-quality, fast, mobile-first utility website containing 100+ calculators, converters, student tools, finance tools, developer utilities, and everyday mathematical solvers.

---

## 🚀 Key Features

- **100+ Functional Real Tools:** Zero placeholder buttons, zero mockups — every single calculator computes real answers with mathematical precision.
- **₹0 Infrastructure Cost:** All computations run 100% locally in the user's browser using deterministic client-side TypeScript.
- **Zero Registration & Zero Tracking:** Instant access without account creation or personal data collection.
- **Client-Side Global Search:** Instant keyboard-navigable search (`Cmd+K` / `Ctrl+K`) finding tools by name, description, problem, or keywords.
- **Responsive & Mobile-First:** Tested across 320px, 375px, 390px, 768px, and desktop screens with dark and light themes.
- **Complete SEO Architecture:** Static generation (`generateStaticParams`), OpenGraph tags, JSON-LD Schema (`WebApplication`, `FAQPage`, `BreadcrumbList`), and dynamic `sitemap.xml`.
- **AdSense-Ready:** Non-intrusive ad placeholder slots (`AdBanner`, `AdRectangle`, `AdInContent`) engineered to prevent layout shifts (CLS).

---

## 🗂️ Categories & Tool Catalog (100+ Tools)

1. **Student & Academic (`/student`):** Attendance Calculator, Classes Can I Miss (with step-by-step projection table), Classes Needed, What-If Simulator, Weighted CGPA, SGPA, Marks Percentage, Grade Calculator, GPA to Percentage (CBSE 9.5 formula), Percentage to GPA, Exam Countdown.
2. **Finance & Investment (`/finance`):** Loan EMI (reducing balance with full amortization table), SIP Compound Wealth, GST (Add/Remove slabs), Discount & Savings, Compound Interest, Simple Interest, FD, RD, Salary/CTC Breakdown, Salary Hike, Inflation, Lump Sum, CAGR, PPF (15-year tax free), NPS, ROI, Rule of 72, Home Loan Eligibility.
3. **Unit Converters (`/converters`):** Universal Multi-Converter Hub, Length, Weight/Mass, Temperature, Area, Volume, Speed, Time, Data Storage (Bytes to PB), Digital Speed & Download Estimator, Fuel Economy, Pressure, Energy, Power, Angle, Cooking, Shoe Size, Custom Currency Rate.
4. **Developer Tools (`/developer`):** JSON Formatter/Validator/Minifier, Base64 Encoder/Decoder, URL Encoder/Decoder, UUID v4 Generator, Unix Timestamp Converter, HTML Formatter/Minifier, CSS Formatter, Markdown Live Editor, HEX to RGB / RGB to HEX, PX to REM, Web Crypto SHA Hasher, SQL Formatter, JWT Decoder, Regex Tester.
5. **Text & Content (`/text`):** Word & Character Counter, Reading Time Estimator, Case Converter (camelCase, snake_case, Title Case), Duplicate Line Cleaner, Extra Space Remover, Line Sorter, Text Reverser, Lorem Ipsum Generator, Slug Generator, Find & Replace, Word Frequency Rankings.
6. **Date & Time (`/date-time`):** Chronological Age Calculator (with leap year handling & birthday countdown), Days Between Dates, Business Days (excluding weekends), Add/Subtract Days, Time Duration Difference, Leap Year Checker, Day of Week Finder.
7. **Everyday & Math (`/calculators`):** Percentage Multi-Mode, Password Generator (crypto secure), QR Code Generator (instant PNG canvas download), Random Number & Dice, Tip Split, Fraction to Decimal, Ratio Solver, GCD/LCM, Statistics (Mean/Median/Mode), Aspect Ratio.
8. **Health & Fitness (`/health`):** Body Mass Index (BMI with WHO classifications), BMR & TDEE Daily Energy Expenditure, Daily Water Hydration, Ideal Weight (Devine formula).

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with CSS Variables for Dark/Light mode
- **Icons:** Lucide React
- **Theme:** next-themes
- **QR Generation:** Client-side `qrcode` via HTML5 Canvas

---

## 📦 Local Development & Build

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Calculations Test Suite:**
   ```bash
   npx tsx tests/run-tests.ts
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 🚀 Deploy to Vercel (100% Free Tier)

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Select Next.js framework preset.
4. Deploy! No environment variables or database setup required.

---

## 📄 License

MIT License — Built with pride for high speed and public utility.
