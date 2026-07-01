---
name: Vector Vault
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0e1c2d'
  surface-container: '#122031'
  surface-container-high: '#1d2b3c'
  surface-container-highest: '#283647'
  on-surface: '#d5e4fa'
  on-surface-variant: '#c9c5d0'
  inverse-surface: '#d5e4fa'
  inverse-on-surface: '#233143'
  outline: '#928f9a'
  outline-variant: '#47464f'
  surface-tint: '#c6bfff'
  primary: '#e4deff'
  on-primary: '#2f295e'
  primary-container: '#c6bfff'
  on-primary-container: '#514b83'
  inverse-primary: '#5d5890'
  secondary: '#c6bfff'
  on-secondary: '#2900a0'
  secondary-container: '#4029ba'
  on-secondary-container: '#b4abff'
  tertiary: '#6dfad2'
  on-tertiary: '#00382b'
  tertiary-container: '#4bddb7'
  on-tertiary-container: '#005e4a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c6bfff'
  on-primary-fixed: '#191248'
  on-primary-fixed-variant: '#454077'
  secondary-fixed: '#e4dfff'
  secondary-fixed-dim: '#c6bfff'
  on-secondary-fixed: '#160066'
  on-secondary-fixed-variant: '#4029ba'
  tertiary-fixed: '#6dfad2'
  tertiary-fixed-dim: '#4bddb7'
  on-tertiary-fixed: '#002018'
  on-tertiary-fixed-variant: '#005140'
  background: '#051424'
  on-background: '#d5e4fa'
  surface-variant: '#283647'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.7'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is engineered for high-performance AI infrastructure. It targets technical founders and engineers who require clarity amidst the complexity of Retrieval-Augmented Generation (RAG). The visual narrative centers on "The Intelligent Core"—a space where data is dense, precise, and illuminated.

The aesthetic is a sophisticated fusion of **Minimalism** and **Glassmorphism**. It borrows the disciplined spacing of professional productivity tools and the luminous, layered depth of modern AI interfaces. The atmosphere is quiet, focused, and powerful, utilizing high-performance textures like grid overlays and subtle motion to indicate background processing and data synthesis.

## Colors
The palette is built on a "Deep Sea" foundation, moving from the profound navy-black of the base layer to progressively lighter, more saturated blues for interactive surfaces. 

- **The Core:** `#051424` serves as the canvas, providing maximum contrast for text and glowing accents.
- **Accents:** Lavender (`#C6BFFF`) and Indigo (`#6C5CE7`) are used for primary actions and "Intelligence" states (like AI responses or vector processing). Teal (`#4BDDB7`) signifies success and connectivity, while Amber (`#FFB77D`) highlights warnings or complex configuration nodes.
- **Dynamic Glow:** Use low-opacity versions of the Lavender and Indigo accents as background "orbs" (600px+ diameter, 10% opacity) behind primary content areas to simulate depth.

## Typography
Typography is optimized for technical readability and structural hierarchy. 

- **Headlines:** Use Hanken Grotesk for high-impact titles. Tighten the tracking on larger sizes to maintain a dense, "engineered" feel.
- **Body:** Inter provides a neutral, highly legible experience for documentation and long-form data logs.
- **Mono:** JetBrains Mono is the functional workhorse for labels, metadata, and code snippets. It should be used whenever displaying IDs, vector coordinates, or JSON payloads.

## Layout & Spacing
The layout follows a **Fluid Grid** logic with a 12-column structure on desktop and a 4-column structure on mobile. 

- **Rhythm:** All spacing is derived from a 4px baseline. Use 8px, 16px, 24px, 32px, 48px, and 64px increments to define hierarchy.
- **Grid Texture:** Apply a subtle 24px square grid overlay (1px stroke, 5% opacity) to the background layer to reinforce the "infrastructure" theme.
- **Reflow:** On tablet/mobile, sidebars collapse into a bottom drawer or a hidden hamburger menu to prioritize the data-heavy center console.

## Elevation & Depth
This design system rejects traditional drop shadows in favor of **Glassmorphism** and **Ambient Glows**.

1.  **Layers:** 
    - **Layer 0 (Background):** `#051424` with the grid texture.
    - **Layer 1 (Card/Container):** `#11141C` with a 1px border of `rgba(255, 255, 255, 0.06)`.
    - **Layer 2 (Floating/Modals):** Backdrop-filter `blur(20px)` with a background of `rgba(25, 33, 49, 0.7)`.
2.  **Borders:** Use ultra-subtle, high-precision borders. Instead of shadows, use "inner glows"—a 1px inner stroke with 10% opacity of the accent color to indicate active states.
3.  **Animations:** Implement slow, 8-second pulse animations on background glow orbs to make the interface feel "alive" and processing.

## Shapes
The shape language is "Soft-Technical." We use a conservative `0.25rem` (4px) base radius for buttons and inputs to maintain a crisp, professional edge. Larger cards and modals use `0.75rem` (12px) to provide a modern, approachable feel without becoming overly bubbly.

## Components

- **Buttons:** Primary buttons use a solid Lavender gradient or high-contrast white. Secondary buttons use a "Ghost" style with a 1px border and a subtle hover fill.
- **Inputs:** Darker than the container (`#051424`), with JetBrains Mono for text. The focus state should trigger a subtle Lavender outer glow (not a shadow).
- **Cards:** Use `surface_secondary` with a thin top-border highlight (0.5px) to simulate a light source from above.
- **Chips/Badges:** Monospaced text only. Use the Teal accent for "Live" status and Indigo for "Indexing."
- **Data Nodes:** Custom components for visualizing vector clusters should use semi-transparent circles with the same accent palette, connected by 1px "thread" lines in `rgba(255, 255, 255, 0.1)`.
- **Code Viewers:** Syntax highlighting should strictly follow the accent palette (Lavender for functions, Teal for strings, Amber for constants).