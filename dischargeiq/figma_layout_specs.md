# DischargeIQ - Figma UI Spacing & Component Specifications

This design specification document serves as the developer handoff blueprint for the **DischargeIQ** high-fidelity dashboard interfaces. Spacing tokens align with standard 8px grid rules to translate directly to Tailwind CSS utility classes.

---

## 🎨 Typography Style Tokens
All UI frames use the **Inter** typeface family. Font weights map as:
- **Bold**: `font-bold` (700)
- **SemiBold**: `font-semibold` (600)
- **Medium**: `font-medium` (500)
- **Regular**: `font-regular` (400)

| Style Name | Size / Line Height | CSS Mapping | Figma Description |
| :--- | :--- | :--- | :--- |
| **Display Title** | 28px / 36px (Bold) | `text-3xl font-bold` | App branding / Auth headers |
| **Header H1** | 20px / 28px (SemiBold)| `text-xl font-semibold` | Page titles in top header |
| **Header H2** | 16px / 24px (SemiBold)| `text-base font-semibold` | Widget cards & sections |
| **Body Large** | 14px / 20px (Medium) | `text-sm font-medium` | Form controls, Table items |
| **Body Regular**| 14px / 20px (Regular)| `text-sm font-normal` | Paragraph summaries, details |
| **Caption** | 12px / 16px (Medium) | `text-xs font-medium` | Badges, Helper labels, timestamps |

---

## 📏 Auto Layout Spacing Grid System
We implement a strictly nested structure of spacing values:
- **`spacing-2` (8px)**: Pill padding, small badge margins, checkbox-label offsets.
- **`spacing-4` (16px)**: Dropdown item paddings, gap between subelements in form cards.
- **`spacing-6` (24px)**: Default card interior padding, grid gap for secondary layouts.
- **`spacing-8` (32px)**: Outer workspace content margins, gap between core widgets.
- **`spacing-12` (48px)**: Large margins (e.g., login page margins, branding gaps).

---

## 🗂️ Figma Frames Layout Architecture (1440 × 1024 Desktop)

```
+--------------------------------------------------------------------------------+
|  SIDEBAR (260px)  |  HEADER (70px height)                                      |
|  - Logo (36x36)   |  - Title "Patient Roster"  - Search (400px) - Doctor Info  |
|  - Nav List       |------------------------------------------------------------|
|    Dashboard      |  CONTENT INNER WRAPPER (Padding: 32px all sides)            |
|    Patients       |                                                            |
|    Summaries      |  +---------------------------+  +-----------------------+  |
|    Analytics      |  | Card (8 cols, width: 720) |  | Card (4 cols, w: 340) |  |
|    Settings       |  |                           |  |                       |  |
|                   |  +---------------------------+  +-----------------------+  |
+--------------------------------------------------------------------------------+
```

### 1. Frame 1: Login Screen (1440 × 1024)
- **Container**: Flexbox Row, `width: 1440px`, `height: 1024px`.
- **Left Banner (Illustration)**: `width: 792px` (55%), background gradient: `linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)`.
- **Right Panel (Form Input)**: `width: 648px` (45%), Auto Layout Vertical, centered alignment, `gap: 32px`.
  - **Login Card**: `width: 420px`, `padding: 40px`, `background: #FFFFFF`, border-radius: `12px`, shadow: `0px 20px 25px -5px rgba(0,0,0,0.05)`.
  - **Forgot Password trigger**: Text link aligned right, size 12px, color `#2563EB`, margin-top: `8px`.

### 2. Frame 2: Dashboard Overview
- **Sidebar**: `width: 260px`, `height: 100vh`, `background: #FFFFFF`, border-right: `1px solid #E2E8F0`.
- **Top Header**: `height: 70px`, Flex Row, items: center, justify: space-between, bottom-border: `1px solid #E2E8F0`.
- **KPI Row**: Grid container: `grid-cols-4`, `gap: 24px`, card height: `110px`, card border-radius: `12px`.
- **Charts Widgets Grid**: Flex row, `gap: 24px`, wrap: enabled.
  - Left panel: `width: 730px` (contains line chart container).
  - Right panel: `width: 350px` (contains doughnut chart container).

### 3. Frame 3: Patient Management (Roster)
- **Filters Row**: Flex row, `gap: 16px`, wrapping enabled for tablet breakpoints.
- **Search field**: Auto Layout Horizontal, `width: 400px`, `height: 42px`, leading icon spacer: `12px`, border-radius: `6px`.
- **Data Table**: Header row `height: 48px`, background `#F8FAFC`. Cells padding: `14px 16px`. Status pills dimensions: `width: auto`, height: `24px`, font size: `12px` (Inter Medium).

### 4. Frame 4: Patient Profile Details
- **Profile Summary Header**: Flex row, `padding: 24px`, border-radius: `12px`, background `#FFFFFF`.
- **Dossier Grid**: Split 65% / 35%, `gap: 24px`.
  - Left side: Clinical metrics, diagnoses blocks, medications checklist.
  - Right side: AI analysis card, SHAP feature metrics.

### 5. Frame 5: AI Discharge SOAP Editor
- **Workspace Layout**: Split 60% / 40%, `gap: 24px`.
  - Left card (Summary Sections): Auto Layout Vertical, `gap: 20px`. Text area inputs `height: 120px` each, with focus states glowing `#2563EB`.
  - Right card (Clinical Actions): Auto Layout Vertical, `gap: 12px`. Primary action button: `height: 46px`, font size `14px` (Inter SemiBold).

### 6. Frame 6: Readmission Analytics (ML explainability)
- **Visual Grid**: 3-column top row (Avg Risk score, alert targets, LOS index), bottom row containing full-width Chart.js horizontal bar grid.
- **Intervention suggestions list**: Flex Column, item cards `gap: 12px` with left status border colored by threat level.

### 7. Frame 7: Analytics Overview
- **Charts Panels**: 2x2 grid, cards height `300px` each, responsive flex resizing down to `1fr` width on tablet (768px).

### 8. Frame 8: Admin & Security Portal
- **Tab Layout**: Vertical tab list on left (`width: 200px`), active settings card on right (`width: 880px`), spacing gap: `32px`.
- **Monospace Audit Logs Term**: `font-family: 'JetBrains Mono', 'Fira Code', monospace`, line-height: `1.6`, font size `12px`.
