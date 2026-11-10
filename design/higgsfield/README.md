# Higgsfield visual direction (batch 1, 2026-11-09)

Generated with Higgsfield (GPT Image 2.6, high quality) through the Higgsfield
MCP connector. Source files only; optimised copies go in `public/` when used.

| File                 | What it is                                                         | Status                         |
| -------------------- | ------------------------------------------------------------------ | ------------------------------ |
| `01-moodboard.png`   | Brand moodboard: palette, Fraunces + Inter, botanical journal feel | Reference for Phase 1          |
| `02-home-mockup.png` | Home screen mockup (plan section 7)                                | Reference for Phase 1 and 10   |
| `03-flower.svg`      | Garden flower (from conversations)                                 | Candidate garden art, Phase 10 |
| `04-tree.svg`        | Garden tree (from memories)                                        | Candidate garden art, Phase 10 |
| `05-butterfly.svg`   | Garden butterfly (from appreciation)                               | Candidate garden art, Phase 10 |

## Notes for the build

- The mockup's "Us" tab icon is two interlocking rings, which reads as wedding
  rings (plan section 7 says avoid wedding imagery). Use a different icon.
- White text on the terracotta card is below accessible contrast for normal
  text; use charcoal text on terracotta, or a darker terracotta, in Phase 1.
- The SVGs are about 4 KB each with no scripts or external links; they still
  need the `#C86446`-style palette checked against dark mode in Phase 10.

## Prompts

**01 moodboard (3:2):** Brand moodboard for 'Tend', a calm app for married
couples. Theme: a beautiful shared journal with a botanical touch. Collage on
warm cream paper (#F8F5EF) of: pressed leaves and wildflowers, linen and
handmade paper textures, a Nigerian couple's hands sharing tea at golden hour
(no faces), a handwritten note card, soft watercolour garden illustrations, a
terracotta clay pot. Colour swatch row labelled: Forest sage #3D5A4C,
Terracotta #C86446, Dusty rose #D9B6B2, Soft gold #D7B875, Sage #82977B, Cream
#F8F5EF, Charcoal #2C302E. Typography specimen: 'Tend to each other.' in an
elegant soft serif (Fraunces style) plus a clean sans-serif sample. Warm,
mature, playful, editorial. No hearts, no wedding rings, no bright red, no
neon pink, no corporate blue.

**02 home mockup (9:16):** High-fidelity mobile app UI mockup, single phone
screen, home screen of 'Tend'. Cream background, white rounded cards, Fraunces
greeting 'Good evening, Tolu'; cards for today's question (sage 'Answer
privately' button and 'Skip'), a waiting note (dusty rose), next date
(terracotta), 'Remember when?' with a photo, and a garden peek; bottom nav
Home, Connect, Plan, Us, Garden. No scores, streaks, numbers, charts or hearts.

**03 flower (SVG):** Single illustrated flower for a cosy botanical garden
game, flat vector, five dusty rose petals, soft gold centre, sage stem, two
forest sage leaves. No background, no heavy outlines, no text.

**04 tree (SVG):** Single illustrated young tree, flat vector, full rounded
canopy in forest sage, sage and #8FAE96, tiny soft gold blossoms, warm brown
trunk. No background, lush and thriving.

**05 butterfly (SVG):** Single illustrated butterfly, flat vector, terracotta
and dusty rose wings with soft gold spots, charcoal body, viewed from above,
symmetrical. No background, no text.

## Phase 3: photos and clips (2026-11-10)

Source files in `phase3/`. Two versions of each photo (`-a`, `-b`); the chosen
one ships as a 720px WebP in `public/photos/`, clips as-is in `public/clips/`.
Cost: 16 photos x 0.25 + 3 clips x 15 = 49 credits.

Photos: `gpt_image_2_6`, 3:4. Every prompt starts "Candid documentary-style
photograph:" and ends "Palette of warm cream, terracotta, sage green and muted
gold, shallow depth of field, authentic. Calm open space in the upper third.
No text, no hearts, no wedding imagery."

| Shipped as | Chosen | Scene |
| --- | --- | --- |
| balcony.webp | balcony-a | Nigerian couple laughing on a plant-filled Lagos balcony at golden hour |
| tea.webp | tea-b | Husband handing his wife a cup of tea in a sunlit morning kitchen |
| planning.webp | planning-a | Couple planning together at a table with a notebook and phone |
| sofa.webp | sofa-a | Couple relaxing on a sofa on a lazy weekend afternoon, laughing |
| family.webp | family-b | Parents building colourful blocks with their young child |
| cooking.webp | cooking-a | Couple cooking jollof rice together, she tastes from the spoon |
| surprise.webp | surprise-a | Wife covering her husband's eyes before a rooftop picnic surprise |
| walk.webp | walk-a | Couple walking hand in hand on a lush garden path, evening light |

Clips: `seedance_2_5`, start image = the chosen photo, 5 s, 480p, no audio.

- `welcome.mp4` (balcony): locked-off camera, couple keeps laughing softly,
  palm leaves sway, golden light shimmers over the city.
- `cooking.mp4` (cooking): he stirs the pot, steam rises, she tastes and laughs.
- `walk.mp4` (walk): slow forward drift, couple walks hand in hand, leaves sway.
