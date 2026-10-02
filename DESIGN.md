---
name: JobTracker
description: El Archivador, a cool blue-grey desk with near-white job folders, ink-only actions and a condensed label tape.
colors:
  desk: "#e4e8ec"
  drawer: "#d5dbe1"
  folder: "#fafbfc"
  ink: "#14202e"
  ink-soft: "#3d4b5c"
  ink-faint: "#4f5b6a"
  rule: "#c5ccd4"
  rule-strong: "#9aa5b1"
  phase-guardada: "#5a6b82"
  phase-en-curso: "#1f4fb8"
  phase-entrevista: "#e0a100"
  phase-completada: "#17734a"
  phase-descartada: "#b3412f"
typography:
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.05em"
    fontVariation: "wdth 75"
  tape:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.06em"
    fontVariation: "wdth 75"
rounded:
  sm: "2px"
  tab: "4px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  page: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.folder}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.ink-soft}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.drawer}"
  field:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  folder:
    backgroundColor: "{colors.folder}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "16px"
  tape:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.folder}"
    typography: "{typography.tape}"
    rounded: "{rounded.sm}"
  score-stamp-high:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.folder}"
    rounded: "{rounded.sm}"
    height: "48px"
  score-stamp-mid:
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  score-stamp-low:
    textColor: "{colors.ink-faint}"
    rounded: "{rounded.sm}"
  phase-tab:
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.tab}"
    padding: "4px 10px"
---

# Design System: JobTracker

## Overview

**Creative North Star: "El Archivador"**

A job search kept as a filing drawer. A cool blue-grey desk holds a darker drawer; inside it each offer is a near-white folder with a coloured phase tab, a black label-tape with the company name, and an ink stamp carrying the match score. It is a tool for one person who works through the list daily: dense enough to compare, quiet enough to read for an hour. Interface language is Spanish, desktop first, one light theme (dark mode is intentionally not built).

Colour is scarce and always meaningful. The only chromatic hues are the five phase colours; everything else is ink on blue-grey paper. The action colour is the ink itself, so there is no accent to compete with the phases. Depth is physical and small: folders sit on the drawer with a soft offset shadow, and nothing else floats.

**Key Characteristics:**
- Blue-grey desk, darker drawer, near-white folders, blue-black ink.
- Phase colour only on phase tabs, phase dots and kanban column top rules.
- Score is a stamp in ink weight (solid, outlined, faint), never a semantic colour.
- One family (Archivo); the condensed width axis marks labels, normal width reads.
- 2px corners, 1px rules, 150ms state transitions only.

## Colors

A cool desaturated neutral field with a single blue-black ink, plus five phase hues that never appear anywhere else.

### Primary
- **Blue-Black Ink** (colors.ink): text, primary buttons, tape labels, high-score stamps, focus outlines, selection, active view toggle. It is the action colour.

### Secondary (phase colours)
- **Slate Guardada** (colors.phase-guardada): saved, not yet applied.
- **Cobalt En Curso** (colors.phase-en-curso): application in progress.
- **Amber Entrevista** (colors.phase-entrevista): interview stage; its tab uses ink text, all others use white.
- **Green Completada** (colors.phase-completada): finished successfully.
- **Brick Descartada** (colors.phase-descartada): discarded; also the single error/alert text colour (discard reason, move error).

### Neutral
- **Cool Desk** (colors.desk): page background and kanban column fill.
- **Drawer Grey** (colors.drawer): the container behind the folders, selected filter tab, row headers, secondary-button hover.
- **Folder White** (colors.folder): folders, kanban cards, table body, text on ink.
- **Soft Ink** (colors.ink-soft): secondary text, counts, primary-button hover.
- **Faint Ink** (colors.ink-faint): placeholders, empty cells, low-score stamp, small caption labels.
- **Hairline Rule** (colors.rule): inner dividers and inactive tab borders.
- **Strong Rule** (colors.rule-strong): folder, drawer and field borders.

### Named Rules
**The Phase-Only Colour Rule.** Chromatic colour means a phase. It appears on phase tabs, dots, kanban column top rules and selected-filter top edges, and nowhere else. The one extension is the brick colour doubling as the alert text colour.

**The Ink Is The Action Rule.** Interactive emphasis is ink fill or ink outline. No accent hue.

**The Stamp Rule.** Score reads by weight: solid ink from 70, ink outline 40 to 69, faint below 40. Never green/amber/red.

## Typography

**Display, Body and Label Font:** Archivo (variable, wdth axis; fallback system-ui, sans-serif)

**Character:** One grotesque in two widths. Normal width for reading and numbers; 75% condensed uppercase for anything that is a label, tab, tape or column head, like a label printer.

### Hierarchy
- **Headline** (700, 1.875rem, tight tracking): page title "Ofertas".
- **Title** (600, 1.125rem, 1.375): job title inside a folder; detail headings go up to 1.25rem.
- **Body** (400, 15px, 1.5): default text; 0.875rem for meta, tables, buttons and fields.
- **Label** (600, 0.75rem, 0.05em tracking, uppercase, wdth 75): phase tabs, "Falta" captions, kanban column heads.
- **Tape** (600, 0.875rem, 0.06em, uppercase, wdth 75): company name and brand mark.
- **Stamp numeral** (700, tabular figures, 1.5rem to 3rem): scores, scaling with stamp size.

### Named Rules
**The Two Widths Rule.** Condensed width is reserved for labels, tape and tabs; running text is never condensed.

**The Tabular Numbers Rule.** Counts and scores use tabular figures.

## Layout

A single column page capped at 1400px, centred, with 16px side padding (24px from the sm breakpoint) and 32px top. A header strip with the tape brand and sign-out sits above a 1px strong rule. The board is: title and summary line, toolbar (search, view toggle), phase filter tabs, then the drawer. The drawer holds one of three views: auto-fill folder grid (min 20rem columns, 16px by 24px gaps), a comparison table (offers as columns, criteria as rows, first column sticky), or a five-column kanban (min 16rem each, horizontal scroll). Spacing steps in use: 8, 12, 16, 24, 32px. Mobile collapses to one folder column and scrolls tables and kanban sideways; the tab row also scrolls.

## Elevation & Depth

Hybrid: mostly flat tonal layering (desk, drawer, folder) with one soft shadow for physical objects.

### Shadow Vocabulary
- **Folder rest** (`box-shadow: 0 1px 0 rgba(20,32,46,0.08), 0 3px 8px -3px rgba(20,32,46,0.25)`): folders and the detail sheet.
- **Folder hover** (`box-shadow: 0 1px 0 rgba(20,32,46,0.1), 0 8px 16px -6px rgba(20,32,46,0.35)` with 1px upward shift): folder cards that link.
- **Kanban card** (`box-shadow: 0 1px 0 rgba(20,32,46,0.08), 0 2px 5px -2px rgba(20,32,46,0.25)`): draggable cards.
- **Dialog scrim** (`ink at 50%`): behind the discard dialog.

### Named Rules
**The Paper Only Rule.** Shadows belong to folders and cards, blurred and tinted with ink. Controls, columns and the drawer stay flat.

## Shapes

Square-cornered paper. Controls, folders, stamps and tape use 2px corners; tabs (phase and filter) use a 4px top-rounded corner so they read as folder tabs; the drawer uses 4px. Borders are 1px (rule for dividers, rule-strong for objects, ink for buttons and the view toggle); stamps use 1.5 to 2px outlines. A folder's top-left corner is square so the tab joins it. Phase dots are 8px circles. Icons: one 16px set, 1.75 stroke, rounded caps, `currentColor`.

## Components

### Buttons
- **Shape:** 2px corners, 14px semibold text, 8px 16px padding, 150ms colour transition.
- **Primary:** ink fill, folder-white text; hover soft ink.
- **Secondary:** transparent, 1px ink border; hover drawer grey.
- **Disabled:** 50% opacity.

### Inputs / Fields
- **Style:** white fill, 1px strong rule, 2px corners, 8px 12px padding, 14px text, faint-ink placeholders.
- **Focus:** global 2px ink outline with 2px offset; caret and native controls tinted ink.

### Navigation
- **View toggle:** segmented group with 1px ink border; active segment inked, inactive hover drawer.
- **Phase filter tabs:** folder-tab shaped; selected tab sits on the drawer colour with a 3px top edge in its phase colour (ink for "Todas"); inactive tabs are desk coloured with a hairline border. Counts are tabular.

### Job Folder (signature)
A phase tab above a near-white folder. Inside: company on the tape, job title (3 lines max), score stamp at the top right, meta line joined by middots, the discard reason in brick if discarded, and a "Falta" block with up to two shortened gap headlines after a hairline.

### Score Stamp
Square 2px stamp in three sizes (36, 48, 56 to 80px). Solid ink / ink outline / faint outline by tier; carries an accessible "Compatibilidad N de 100" label.

### Tape
Ink strip, folder-white condensed uppercase text, 2px corners. Used for company names and the JobTracker mark. In the comparison table header it inverts (white strip, ink text) on the ink header row.

### Kanban
Five desk-coloured columns, each with a 3px phase-colour top rule and a condensed uppercase head with count. Cards are small folders with a "Mover a" select as the keyboard and touch alternative to dragging; dragged cards drop to 40% opacity and the target column lightens to folder white.

### Comparison Table
Ink header row, drawer-grey sticky row headers, hairline cell borders, folder-white body; empty values show an em dash.

## Do's and Don'ts

### Do:
- **Do** use ink for every action; hierarchy comes from fill versus outline.
- **Do** reserve the five phase colours for phase indication, and pair every phase colour with its text label.
- **Do** put company names on the tape and labels in condensed uppercase.
- **Do** keep corners at 2px (4px for tabs and the drawer) and rules at 1px.
- **Do** limit motion to 150ms state transitions and honour `prefers-reduced-motion`.
- **Do** write interface copy in Spanish and use tabular figures for numbers.

### Don't:
- **Don't** use phase colours or any hue to express score quality.
- **Don't** add an accent colour for buttons or links.
- **Don't** put shadows on controls, columns or the drawer.
- **Don't** condense body text or set paragraphs in uppercase.
- **Don't** introduce a second font family.
- **Don't** use dark-mode variants; the system is a single light theme.
