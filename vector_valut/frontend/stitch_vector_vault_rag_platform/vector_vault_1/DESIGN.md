---
name: Vector Vault
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c8c4d7'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#928ea0'
  outline-variant: '#474554'
  surface-tint: '#c6bfff'
  primary: '#c6bfff'
  on-primary: '#2900a0'
  primary-container: '#6c5ce7'
  on-primary-container: '#faf6ff'
  inverse-primary: '#5847d2'
  secondary: '#4bddb7'
  on-secondary: '#00382b'
  secondary-container: '#02b894'
  on-secondary-container: '#004233'
  tertiary: '#ffb77d'
  on-tertiary: '#4d2600'
  tertiary-container: '#ac5d00'
  on-tertiary-container: '#fff5f1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c6bfff'
  on-primary-fixed: '#160066'
  on-primary-fixed-variant: '#4029ba'
  secondary-fixed: '#6dfad2'
  secondary-fixed-dim: '#4bddb7'
  on-secondary-fixed: '#002018'
  on-secondary-fixed-variant: '#005140'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for a high-performance RAG (Retrieval-Augmented Generation) infrastructure platform. It balances the high-density utility of Linear with the editorial clarity of Notion and the AI-native aesthetic of Perplexity.

**Personality:** 
- **Technical & Precise:** Rooted in the world of vector embeddings and LLM orchestration.
- **Calm & Atmospheric:** A dark-mode-first environment that reduces cognitive load during complex workflow building.
- **Reliable Infrastructure:** Evokes the feeling of a "vault"—secure, structured, and permanent.

**Visual Style:** 
A hybrid of **Minimalism** and **Glassmorphism**. The interface uses deep, layered backgrounds to create a sense of infinite digital space. UI elements are treated as translucent glass panes, utilizing backdrop blurs to maintain context while isolating active tasks. Precision is reinforced through sharp typography and subtle, high-fidelity borders.

## Colors
The palette is optimized for long-duration technical work, emphasizing depth and focal clarity.

- **Primary (Electric Indigo):** `#6C5CE7`. Used for primary actions, active states, and AI-driven features. It represents the "energy" flowing through the vault.
- **Secondary (Teal/Emerald):** `#00B894`. Reserved for success states, completed indexing, and healthy system status.
- **Background Tiers:**
    - `Base`: `#0B0E14` (Deep Navy) for the global canvas.
    - `Surface`: `#11141C` (Charcoal) for cards, sidebars, and elevated containers.
- **Accents:** A palette of muted grays (`#94A3B8`) is used for secondary text and borders to ensure the indigo highlights remain impactful.

## Typography
The typographic system uses a three-tier approach to differentiate between navigation, content, and data.

- **UI & Headers (Hanken Grotesk):** Provides a contemporary, sharp feel for titles and navigation. High-weight headings use tight letter spacing for a "premium" look.
- **Body & Prose (Inter):** Chosen for its exceptional legibility in dense SaaS dashboards.
- **Technical Data (JetBrains Mono):** Used for metadata, status labels, and code snippets. This font signals "data-rich" areas and system outputs.

**Mobile Scaling:** Headlines scale down by approximately 20% on mobile devices, while body text remains consistent at 16px to ensure accessibility.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid grid**. Sidebars and navigation rails are fixed width to maintain a consistent "instrument panel" feel, while the central workspace is fluid with a maximum container width of 1440px.

- **Rhythm:** An 8px linear scale (using 4px increments for micro-adjustments).
- **Whitespace:** Generous padding is applied to workspace containers to prevent the "dense dashboard" fatigue common in SaaS.
- **Breakpoints:**
    - Desktop: 1200px+ (12 columns)
    - Tablet: 768px - 1199px (8 columns)
    - Mobile: <768px (4 columns, single column stack for cards)

## Elevation & Depth
Depth is created through **Tonal Layering** and **Glassmorphism** rather than traditional drop shadows.

- **Level 0 (Base):** `#0B0E14` - The fundamental background.
- **Level 1 (Sub-surface):** `#11141C` with a 1px border (`#FFFFFF` at 5% opacity).
- **Level 2 (Floating Glass):** Background blur (20px) with a semi-transparent fill (`#11141C` at 80% opacity). Used for modals, dropdowns, and sticky headers.
- **Shadows:** Only used on active floating elements. A very soft, large-radius shadow: `0 20px 40px rgba(0,0,0,0.4)`.

## Shapes
The design system uses a medium-high roundedness scale to soften the technical nature of the product.

- **Standard Elements:** 8px (`0.5rem`) for buttons and small inputs.
- **Containers/Cards:** 16px (`1rem`) for the primary "vault" sections.
- **Outer Shells:** 24px (`1.5rem`) for high-level page containers or main layout blocks.

## Components

- **Stat Cards:** Feature a large `headline-lg` value. A subtle 1px border surrounds the card. Use a small sparkline or a `secondary_color` indicator for trend percentages.
- **Tables:** Minimalist design with no vertical dividers. Headers use `label-caps`. Row hover states should use a subtle lightening of the background (`#1C212B`).
- **Status Badges:** Pill-shaped with a low-opacity background of the status color (e.g., Success is Teal at 10% fill with solid Teal text in `label-caps`).
- **Code Blocks:** Encased in a `Level 1` surface with 12px rounded corners. Use `JetBrains Mono` and syntax highlighting that favors the `primary_color` for keywords.
- **Chat Bubbles:**
    - **User:** Right-aligned, subtle gray border, no fill.
    - **AI:** Left-aligned, `Level 1` surface fill, with a 2px `primary_color` left-border accent to denote "thinking" or "source" content.
- **Progress Steppers:** Vertical or horizontal thin lines (2px). Active steps use a glowing `primary_color` dot; completed steps use the `secondary_color` with a check icon.
- **Buttons:** 
    - **Primary:** Solid `#6C5CE7` with white text.
    - **Secondary:** Ghost style (transparent fill) with a 1px border of `neutral_color`.