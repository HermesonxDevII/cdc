# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

The docs lookup in AGENTS.md is only needed when using Expo/RN APIs; pure layout/style tweaks (positions, font sizes) don't need it.

## Project

Expo Router app (Android-first) for building custom Pokémon TCG cards and exporting them as PNG. UI text and code comments are pt-BR; identifiers and commit messages are English (`feat: …` / `fix: …`).

## Commands

- `npm start`: dev server with Metro cache cleared (`expo start -c`); also `npm run android|ios|web`.
- `npm run build`: EAS cloud build of the Android preview APK. Only when asked.
- `npm run verify`: type-check (`npm run typecheck`, 0 errors) + tests (`npm test`). One file: `npx jest <path>`; by name: `npx jest -t "<name>"`.
- Don't run `npm run lint`: ESLint isn't configured and `expo lint` would install it, changing `package.json`.
- The user checks layout visually in the app; don't boot emulators or take screenshots unless asked.

## Reading the code cheaply

- `src/app/pokemon/pokemon_card.tsx` (~2.3k lines) is the editor and holds almost all the logic. Don't read it whole: each card element has `BEGIN:: <Section>` / `END:: <Section>` comments in the JSX and again in the `StyleSheet` (pt-BR names: Nome, HP, Tipo, Imagem, Movimento 1, Fraquezas…). `grep -n "BEGIN:" src/app/pokemon/pokemon_card.tsx` gives the map; then Read with offset/limit.
- Most modals in `src/components/modals/` are near-identical bottom sheets (`visible`, `onClose`, `onSave`): read only the closest one.
- Ignore `scratch/` (one-off codemods, already applied), `package-lock.json`, and the unlinked create-expo-app leftovers: `src/app/explore.tsx`, `components/app-tabs*`, `hint-row`, `web-badge`, `external-link`, `ui/collapsible`.

## Tests and gates

- Jest with the `jest-expo` preset, configured in `package.json`. `modulePaths` points at `node_modules/expo/node_modules` because npm doesn't hoist `expo-modules-core`, which jest-expo needs. `testTimeout` is 30 s because the first render on a cold cache is slow. `jest.setup.ts` mocks `react-native-safe-area-context`; `.css` imports (web only) map to `jest.style-stub.js`.
- Gates: Claude Code hooks (`.claude/hooks/verify-gate.js`, wired in `.claude/settings.json`) run `npm run verify` when you stop after changing code in that turn, and make you keep working if it fails (at most 3 times in a row). Husky runs it on `pre-commit` and GitHub Actions on every push/PR (`.github/workflows/verify.yml`).

## Architecture

- Routes: `/` (TCG picker, only Pokémon enabled) → `/pokemon` (template picker) → `/pokemon/pokemon_card` (editor). `/profile` and `/settings` are placeholder hrefs with no route. `src/app/_layout.tsx` is a headerless `Stack` and loads the fonts (`GillSans*`, `Revue`, `Futura-Heavy`).
- State: the whole card is one `CardState` object inside an undo/redo `history` array. Change it only through `updateCard(partial)`, never a separate `useState`. Screen modes (`isPreviewMode`, `editMovesDescription`) are the exception: plain `useState`, outside the history. `historyIndex > 0` means unsaved changes → `DiscardChangesModal` on back (hardware back included).
- Coordinates: the card is laid out at its real size, 744×1045, and shrunk with `transform: scale(cardScale)`; every `top/left/width/fontSize` is in card px, not screen px. Text on the card uses `ResponsiveText` (font scaling off).
- Each element is an absolutely positioned `TouchableOpacity` that opens its modal. Typical style array: base → `isStageCard && {…}` → `buttonCheckTemplate() && styles.xCustom` → `hideBoxes && styles.previewMode`, plus `disabled={hideBoxes}`. `hideBoxes` = preview or the moves-description editor mode; only Habilidade and each move's name/description box use `isPreviewMode` instead, since they stay editable boxes in that mode.
- Two template layouts: 2250×3150 PNGs (dark, eletric, fighter, fire, grass, metal, normal, psychic, water) use the base styles; 3068×4196 PNGs (the other types plus the `_old`/`_old_2` variants) are listed in `BUTTON_CUSTOM_TEMPLATES` and get the `*Custom` styles. `TEXT_CUSTOM_TEMPLATES` = dark backgrounds → white text. Both lists live in `src/constants/card_templates.ts`. Stage cards (`stage_1`/`stage_2`) clip the photo with an SVG outline from `src/constants/stage_image_outlines.ts`, keyed by template width.
- Moves-description editor (menu "Editar desc. de Mov."): tap a Habilidade/move box to select it, then the footer arrows change that box's description spacing, stored as offsets in `CardState.descriptionSpacing[box]` (missing = default style, no `lineHeight`/`letterSpacing` set). The `lineHeight` base is GillSans' natural line height (`GILL_SANS_LINE_HEIGHT`), since descriptions have no `lineHeight` in their style. In Habilidade/Movimento 1/2 the name is a nested Text inside the description paragraph: it gets `letterSpacing: 0` so it doesn't inherit, but the paragraph's `lineHeight` also applies to its line (accepted by the user).
- Export: `handleSaveCard` turns preview mode on (hides box borders), waits 300 ms, then `captureRef(cardRef)` → `expo-sharing`.
- Data: `CARD_TEMPLATES[stage][id]` in `src/constants/card_templates.ts`, icons in `src/constants/type_icons.ts`. `TypeModal` only lists icon ids that exist in `CARD_TEMPLATES[stage]`. Ids match the file names, including `eletric` (sic): don't "fix" them. `MenuModal` sets stage, move count, passive skill and weakness/resistance counts.

## Recipes

- New card field: add it to `CardState`, `initialState` and the `currentState` destructuring → `is<X>ModalVisible` state → JSX block with markers + styles in the matching section → modal `src/components/modals/<x>_modal.tsx` (snake_case; copy the closest one), rendered next to the others with `onSave={(v) => { updateCard({ x: v }); setXModalVisible(false); }}`.
- New template: PNG in each of `assets/images/templates/pokemon/{basic,stage_1,stage_2}/` + an entry in all 3 stages of `CARD_TEMPLATES` + an icon with the same id in `type_icons.ts`. 3068 wide → add to `BUTTON_CUSTOM_TEMPLATES`; dark background → `TEXT_CUSTOM_TEMPLATES`. The data test in `src/constants/__tests__/` flags anything missing.
