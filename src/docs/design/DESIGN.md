---
name: Verdant Glass
colors:
  surface: '#06170d'
  surface-dim: '#06170d'
  surface-bright: '#2c3d32'
  surface-container-lowest: '#031109'
  surface-container-low: '#0e1f15'
  surface-container: '#132319'
  surface-container-high: '#1d2e23'
  surface-container-highest: '#28382e'
  on-surface: '#d4e7d8'
  on-surface-variant: '#c2c8c2'
  inverse-surface: '#d4e7d8'
  inverse-on-surface: '#233429'
  outline: '#8c928c'
  outline-variant: '#424843'
  surface-tint: '#b4ccbb'
  primary: '#b4ccbb'
  on-primary: '#203529'
  primary-container: '#1a2f23'
  on-primary-container: '#809787'
  inverse-primary: '#4d6355'
  secondary: '#ffe2ab'
  on-secondary: '#402d00'
  secondary-container: '#ffbf00'
  on-secondary-container: '#6d5000'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#292b2b'
  on-tertiary-container: '#919292'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d0e9d6'
  primary-fixed-dim: '#b4ccbb'
  on-primary-fixed: '#0a2014'
  on-primary-fixed-variant: '#364c3e'
  secondary-fixed: '#ffdfa0'
  secondary-fixed-dim: '#fbbc00'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#06170d'
  on-background: '#d4e7d8'
  surface-variant: '#28382e'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
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
  base: 8px
  container-padding: 24px
  grid-gutter: 16px
  glass-margin: 12px
---

## Brand & Style

This design system is built on a "Deep Forest" aesthetic, merging the organic serenity of nature with high-tech Glassmorphism. It targets premium SaaS, lifestyle, or environmental technology platforms that require a sense of depth, sophistication, and modernity.

The core visual narrative relies on **translucency** and **layering**. Surfaces are not solid; they are windows into the background, providing a sense of spatial hierarchy through backdrop-filter blurs. The emotional response is one of calm, focus, and high-end craftsmanship. The style utilizes frosted glass effects, subtle light-leaks, and crisp white strokes to simulate physical glass panes suspended in a deep, atmospheric environment.

## Colors

The palette is anchored by **Deep Forest Green (#1A2F23)**, which serves as the canvas for the entire interface. This is a dark-mode first system where the background color provides the necessary contrast for the glass effects to emerge.

**Soft Gold (#FFBF00)** acts as the high-energy accent. In this design system, gold is not just a solid color but a source of light. When applied to highlighted cells or interactive states, it should be paired with an outer "glass glow"—a soft, diffused drop shadow that mimics a light source behind the pane. 

White and off-whites are used exclusively for thin borders and typography to maintain the "etched glass" look.

## Typography

This design system utilizes **Plus Jakarta Sans** for its contemporary, geometric, yet friendly personality. The wide apertures and clean lines of the typeface ensure legibility even when placed over blurred, translucent backgrounds.

To maintain the premium feel, display headings use tighter letter spacing and bold weights. Body text remains airy with generous line heights to counteract the visual complexity of the glass textures. Labels are often set in uppercase with increased tracking to create an "etched" architectural feel.

## Layout & Spacing

The layout philosophy follows a **fluid glass-grid**. Content is housed within large, sweeping containers that use a 12-column structure on desktop. 

A unique characteristic of this design system is the "Inset Margin." Elements do not sit flush against the edges of their glass containers; they maintain a consistent internal padding (base * 3) to allow the frosted border effects to remain visible. Grid lines should be rendered as ultra-thin (0.5px) strokes of light white (10% opacity), creating a technical, blueprint-like foundation beneath the floating glass cards.

## Elevation & Depth

Depth is conveyed through **Backdrop Blur** and **Tonal Stacking** rather than traditional black shadows. 

1.  **Level 0 (Base):** Deep Forest Green solid background.
2.  **Level 1 (Cards/Panels):** Semi-transparent white fill (4-8%), backdrop-filter blur (20px-40px), and a 1px solid white border at 12% opacity.
3.  **Level 2 (Modals/Popovers):** Higher transparency fill (12%), increased blur (60px), and a secondary "inner glow" border to simulate thickness.
4.  **Accent Depth:** Highlighted elements use a dual-layer approach: a gold inner glow and a soft, wide-reaching gold outer bloom (15% opacity) to indicate active or selected states.

## Shapes

The shape language is a study in contrast. **Large global containers** (main dashboards, page wrappers) use a significant corner radius (1.5rem / 24px) to feel soft and inviting. 

**Internal components** (buttons, input fields, grid cells) use a more disciplined, subtle radius (0.5rem / 8px). This creates a nested hierarchy where the outer "glass shell" feels like an organic object, while the functional elements inside feel precise and technical.

## Components

### Buttons
Primary buttons use the Soft Gold palette with a slight linear gradient. The text is dark green (#1A2F23) for maximum contrast. Secondary buttons are "Ghost Glass"—no fill, just the 1px white border with a blur effect that intensifies on hover.

### Cards & Grid Cells
Cells are the primary data container. By default, they have a subtle 4% white fill. When "Highlighted," they transition to a 10% Gold fill with a 20px blur and a 20% opacity gold border.

### Input Fields
Inputs are minimal: a bottom-border-only approach or a very faint glass-well (recessed appearance). The focus state triggers a soft gold "neon" underline.

### Chips/Tags
Small, pill-shaped elements with high-blur backgrounds. They act as "micro-glass" fragments. Use labels in uppercase for a professional, metadata-heavy appearance.

### Glass Dividers
Never use solid lines. Use 1px gradients that fade from 15% white to 0% white at the ends to separate content sections without "breaking" the glass pane.

## Mockup screenshots
See mockup screenshots in `src/docs/design/mockup/`.
