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
