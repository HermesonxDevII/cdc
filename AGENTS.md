# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v58.0.0/ before writing any code.

# Tests

Every implementation ships with its tests, in the same task. Follow the patterns of the existing tests.

- Logic, state or modal changes: add or update a test for the behavior (what the user does and sees), not the markup.
- New template or type: register it in `src/constants`. `src/constants/__tests__/card_templates.test.ts` checks the data (an icon per template, the 3068px layout list, the stage photo outlines): keep it passing by fixing the data, never by loosening the test.
- Pure position/font/color tweaks: no test needed, since Jest doesn't render pixels. Never snapshot the whole card.
- Tests go in a `__tests__/` folder next to the code, named `*.test.ts(x)`. Never under `src/app/`: every file there becomes a route.
- React Native Testing Library is v14: `render`, `fireEvent` and `renderHook` return promises, so always `await` them.
- Done means `npm run verify` (type-check + tests) passes. Never bypass the git hooks with `--no-verify`.
