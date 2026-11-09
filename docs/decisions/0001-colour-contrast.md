# 0001 Colour contrast adjustments

Date: 2026-11-09 · Phase 1

The section 7 palette stays as designed. Contrast was measured against the
WCAG minimum of 4.5:1 for normal text, and these usage rules were added:

| Pairing                         | Ratio | Rule                                                    |
| ------------------------------- | ----- | ------------------------------------------------------- |
| Sage `#82977B` on cream         | 2.9   | Borders and decoration only, never text                 |
| New `#5E6F58` on cream          | 5.0   | Secondary text (light mode)                             |
| New `#A3B39C` on dark bg        | 7.4   | Secondary text (dark mode)                              |
| White on terracotta `#C86446`   | 3.9   | Not used for text                                       |
| Charcoal on terracotta          | 3.4   | Not used for text                                       |
| New `#A6492E` on cream          | 5.3   | Terracotta when it is text, or a button with white text |
| Charcoal on soft tint `#F5E1D8` | 10.6  | Date and plan cards (terracotta icon accent)            |
| Charcoal on tender / gold       | 7.0+  | Fine as card backgrounds                                |
| White on forest sage            | 7.6   | Main buttons                                            |

This fixes the Higgsfield home mockup's white-on-terracotta "Next date" card.

## Update: more colour, less green (2026-11-09)

Feedback after first phone test: too much green, every screen looked the same.
Green (forest sage) now stays for main buttons and navigation. Each area gets
its own palette colour (Connect rose, Plan terracotta, Us gold, Garden sage),
and Home uses a few solid cards like the Higgsfield mockup. New tints only,
no new hues:

| Pairing                                    | Ratio | Use                         |
| ------------------------------------------ | ----- | --------------------------- |
| White on `#A6492E` (`terracotta-strong`)   | 5.8   | Solid "plan" card           |
| White on `#9B4730` (dark mode)             | 6.3   | Solid "plan" card, dark     |
| Charcoal on tender `#D9B6B2`               | 7.2   | Solid rose card             |
| Charcoal on dark tender `#B98F8A`          | 4.7   | Solid rose card, dark       |
| Charcoal on `#F6ECD2` / `#E3EADD` tints    | 10+   | Gold and sage soft cards    |
