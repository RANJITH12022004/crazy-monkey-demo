# Crazy Monkey — Restaurant Demo App
## Project Rules, Knowledge Base & Build Prompts
### Always read this file before making any change. Do not deviate from the locked stack or add scope not listed here.

---

## 1. WHAT THIS PROJECT ACTUALLY IS

This is a **sales demo**, not a production SaaS. It exists to show restaurant owners in Bangalore/Hyderabad a live, working flow in a 5-minute pitch: customer orders via QR → kitchen sees it instantly → manager tracks stock → owner sees the numbers. It will be demoed repeatedly to different leads, not deployed to a real paying restaurant on day one.

This single fact should override any instinct (yours or Cursor's) to over-engineer. Every decision below optimizes for **looks real, works live, resets fast** — not for scale, security hardening, or multi-tenancy.

---

## 2. LOCKED TECH STACK — DO NOT DEVIATE

- **Frontend:** React + Vite + TypeScript
- **Backend/DB/Auth/Realtime:** Supabase (free tier)
- **Hosting:** Vercel (frontend), Supabase cloud (backend) — see Section 8
- **Styling:** Tailwind CSS, matching the Stitch-generated designs already approved (cream/off-white base, navy blue accent, KDS screens use dark charcoal theme)
- **State:** React hooks + Context. No Redux, no Zustand — this app is too small to justify it.
- **No payment integration.** Orders show "Pay at Counter." Never build Razorpay/Stripe for this.
- **No multi-restaurant tenancy.** Hardcode "Crazy Monkey" as the one restaurant. If asked to support multiple restaurants later, that's a different project.

If Cursor suggests adding a library, a state manager, or an architecture pattern not listed here, reject it unless it directly unblocks something in the current prompt.

---

## 3. PERSONAS & ROUTES

| Persona | Access | Route prefix | Device context |
|---|---|---|---|
| Customer | Public, no login | `/order/:tableId` | Own phone, via QR scan |
| Kitchen Staff | PIN login | `/kitchen` | Shared kitchen tablet |
| Stock Manager | PIN login | `/stock` | Shared tablet, stockroom |
| Owner | PIN login | `/owner` | Laptop or tablet, anywhere |

Single entry point at `/staff` handles PIN entry and routes to the correct dashboard based on which PIN was entered. Customer flow never touches `/staff`.

---

## 4. RBAC APPROACH (DEMO-APPROPRIATE — READ THIS CAREFULLY)

Do **not** build real production RBAC (JWT role claims, Supabase Row Level Security policies per role, session refresh logic). That's a multi-day task and this is a weekend demo. Instead:

- One `staff_pins` table: `pin_hash`, `role` (`kitchen` | `stock` | `owner`), `display_name`
- On PIN entry, client queries this table, matches PIN (bcrypt or even simple hash for demo speed), stores `role` in React Context + `sessionStorage`
- Route guards check `sessionStorage` role client-side and redirect if mismatched
- This is **not secure** and that's fine — it's a demo, not a bank. Do not spend time hardening it. If a client later wants to actually buy this, real RBAC is a separate paid scope item, not something to give away free in the demo.

Say this explicitly to Cursor in the build prompt so it doesn't over-build.

---

## 5. DATA MODEL (Supabase tables)

- `menu_items` — id, name, description, price, category, image_url, is_veg, is_bestseller
- `orders` — id, table_id, status (`received`|`preparing`|`ready`), created_at, special_instructions
- `order_items` — id, order_id, menu_item_id, quantity
- `stock_items` — id, name, category, quantity, unit, threshold_low, last_updated
- `staff_pins` — id, pin_hash, role, display_name

Seed all tables with realistic fake data matching the Crazy Monkey menu already designed in Stitch (Chinese/Italian/Dessert categories). **A demo with empty tables is a dead demo** — never leave this to "add data later."

---

## 6. REALTIME RULES

- `orders` and `order_items` inserts/updates must push via Supabase Realtime to both the Kitchen Display (`/kitchen`) and the Customer order-tracking screen simultaneously
- This live sync IS the entire point of the demo. Test it across two actual devices (not two browser tabs on one laptop) before every pitch — a laptop demoing to itself proves nothing to a restaurant owner watching over your shoulder.

---

## 7. GUARDRAILS — WHAT NOT TO BUILD

Explicitly out of scope, do not let Cursor wander into these even if it "would be easy":
- Payment gateway integration
- Multi-restaurant / multi-tenant support
- Real production authentication (email/password, OAuth, JWT refresh)
- Native mobile app / app store builds
- Offline-first / PWA service worker caching (nice-to-have, not weekend-scope)
- Automated inventory-to-menu-item deduction logic (mention it exists conceptually in Owner dashboard, don't wire it up live)

If you're burning more than a couple hours on any single feature, it has scope-crept. Stop and cut it from the demo.

---

## 8. DEMO LOGISTICS — DO NOT SKIP THIS SECTION

You will demo this to multiple restaurant owners across multiple pitches. Between demos:

- Build a **"Reset Demo" button** (owner dashboard, hidden/dev-only) that clears `orders` and `order_items` and reseeds a clean state. Without this, your second pitch of the day starts with leftover chaos from the first.
- Generate a **static QR code** pointing to `/order/table-12` (or similar) — print it or display it on your phone screen for the customer flow, don't rely on typing URLs live in front of a client.
- **Test on real WiFi, not localhost**, before every pitch. A demo that only works on your home network dies the second you're in someone else's restaurant on their spotty router. Use your phone as a hotspot as backup.
- Bring **two physical devices** to every pitch: one as "customer phone," one as "kitchen tablet." A single-device demo where you screen-record kills the "wait, do that again" moment that actually closes deals.

---

## 9. BUILD SEQUENCE — PASTE THESE INTO CURSOR IN ORDER

Paste each into Cursor **Plan mode**, one at a time, and let it finish + you test before moving to the next. Reference this file explicitly at the start of every prompt.

### BUILD PROMPT 1 — RBAC PIN Login + Routing

```
Read PROJECT_RULES.md in full before starting. Follow the locked stack, data model, and RBAC approach exactly as specified there — do not add production-grade auth.

Build a PIN-based staff login screen at route /staff for the Crazy Monkey restaurant demo app.

Requirements:
- Create the staff_pins table in Supabase per the schema in PROJECT_RULES.md, seed with 3 demo PINs: one for kitchen role, one for stock role, one for owner role
- Build a numeric PIN pad UI (4-6 digits), matching the cream/navy branding already established in the customer app
- On correct PIN entry, store role in sessionStorage and React Context, then redirect to the matching dashboard route (/kitchen, /stock, or /owner)
- On incorrect PIN, show a calm inline error, no alarming red modal — this gets entered dozens of times a day by staff
- Add route guards on /kitchen, /stock, /owner that check sessionStorage role and redirect back to /staff if missing/mismatched
- Do not build password reset, session refresh, or any auth beyond what's described in PROJECT_RULES.md Section 4

Confirm the seeded PINs to me in your final summary so I can log in and test immediately.
```

### BUILD PROMPT 2 — Stock/Inventory Manager Dashboard

```
Read PROJECT_RULES.md in full before starting, especially Section 5 (data model) and Section 7 (guardrails).

Build the Stock Manager dashboard at route /stock for the Crazy Monkey restaurant demo app, matching the Stitch designs already generated for this screen.

Requirements:
- Create and seed the stock_items table per PROJECT_RULES.md schema, with realistic ingredient data matching the existing menu (proteins, vegetables, dairy, dry goods, beverages — enough variety to look like a real kitchen's stock list)
- Build the stock overview table: item name, quantity, unit, status (In Stock/Low Stock/Out of Stock as colored dot), last updated, filterable by category
- Build a low-stock filtered view with a "Reorder" button per item (button can be non-functional/toast-only for demo purposes — do not build a real supplier ordering system)
- Build a manual stock adjustment screen using +/- steppers (visually consistent with the customer cart steppers already built), with a reason dropdown: Received Delivery / Wastage / Manual Correction
- Do NOT wire up automatic ingredient deduction when orders are placed — that's explicitly out of scope per PROJECT_RULES.md Section 7

Confirm the dashboard is reachable only after /staff PIN login with the stock role.
```

### BUILD PROMPT 3 — Owner Analytics Dashboard

```
Read PROJECT_RULES.md in full before starting, especially Section 6 (realtime) and Section 8 (demo logistics).

Build the Owner analytics dashboard at route /owner for the Crazy Monkey restaurant demo app, matching the Stitch designs already generated for this screen.

Requirements:
- Query orders and order_items tables to compute: today's revenue, order count, average order value
- Build a sales trend chart (daily/weekly/monthly toggle) using recharts, styled with the navy accent color, light/premium card-based layout (not the dark KDS theme)
- Build a top-selling items ranked list (by revenue and by order count)
- Build a category performance donut chart (Starters/Mains/Desserts/Beverages revenue split)
- Build a simple peak-hours heatmap or bar visualization based on order created_at timestamps
- Add the "Reset Demo" button described in PROJECT_RULES.md Section 8 — clears orders/order_items and reseeds clean demo data. Place it in a clearly labeled but unobtrusive corner of this dashboard (e.g. small "Dev Tools" section), since only the owner-role login can reach it.
- If real order data is sparse (which it will be in early demos), fall back gracefully to seeded/mock data so the charts never render empty — an empty chart in front of a client kills the pitch

Confirm the dashboard is reachable only after /staff PIN login with the owner role.
```

---

## 10. HOSTING — FREE, FOR A DEMO

**Use Vercel for the frontend, Supabase cloud (free tier) for backend.** Not GitHub Pages.

Why not GitHub Pages: it's static-file hosting only. No environment variables, no serverless functions, no easy handling of your Supabase keys without exposing them awkwardly in client code (which you'd be doing anyway with Supabase's anon key, but Vercel makes env var management and redeploys trivial). GitHub Pages also doesn't give you preview deployments per branch, which you'll want when you're iterating between pitches.

Vercel free tier gives you:
- One command deploy from your Vite repo (`vercel` CLI or GitHub integration — push to main, auto-deploys)
- Free `*.vercel.app` subdomain, good enough for a live pitch link
- Environment variable support for your Supabase URL/anon key
- Instant rollback if a last-minute change breaks something before a pitch

Supabase free tier gives you enough DB rows, realtime connections, and auth calls for demo-scale traffic (a handful of devices per pitch, not real restaurant volume) — you will not hit limits doing sales demos.

---

## 11. WHAT YOU PROBABLY FORGOT

- **The Reset Demo button** (Section 8) — without it your second pitch of the day inherits the first pitch's mess. This is the single most likely thing to embarrass you live.
- **A printed/displayable QR code** pointing to the actual deployed URL, not localhost. Generate this once you have the Vercel URL, not the morning of a pitch.
- **Testing on real WiFi with two separate physical devices**, not two tabs on one laptop. Realtime sync across devices is the entire selling point — don't let a fake single-device demo undersell it.
- **Empty-state handling on the Owner dashboard.** Early in your demo life, order data will be thin/fake. Charts should never render blank — that reads as broken, not as "new business, come back later."
- **A short verbal script for the reveal moment** — you're the one narrating "customer orders here... now watch the kitchen screen." The app doing the work isn't the same as you knowing exactly when to point at the second screen. Rehearse the 90-second version once before your first real pitch.
