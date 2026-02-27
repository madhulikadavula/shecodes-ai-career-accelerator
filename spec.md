# SheCodes – AI Career Accelerator

## Current State

The app is a full-stack Caffeine project with:
- **Backend (Motoko)**: `main.mo` with `generateContestRaw`, `generatePrepPlanRaw`, `generatePracticeRaw`, `askAIRaw` — all call Gemini and return raw response text. The Gemini prompt for contest asks for JSON with `wednesday`/`sunday` arrays of 5 problems each. The prep plan prompt asks for JSON with `role`, `requiredSkills`, `hiringProcess`, `questionTypes`, `roadmap`.
- **Frontend utilities**: `gemini.ts` with `parseGeminiResponse` (extracts text from Gemini envelope) and `extractJSON` (strips markdown blocks and `JSON.parse`). These can throw if JSON is malformed.
- **Pages**: ContestPage, PrepPage, PracticePage, LandingPage, OpportunitiesPage.
- **Components**: Navbar (fixed header with desktop+mobile nav), DifficultyBadge (green/yellow/red), LoadingSpinner, ApiKeyModal, SkillBadge.
- **UI**: Already uses Tailwind, has navbar, responsive layout, footer, loading states, and error states on ContestPage. PrepPage already has DayCard checklist with progress tracking.

The existing implementation largely covers many of the requested improvements already. Key gaps:
1. `extractJSON` in `gemini.ts` does not have fallback mock data — it throws on parse failure, which propagates to the catch block in each page but shows only a toast, not graceful fallback data.
2. The "prevent moving to next day unless previous is checked" feature is missing from PrepPage (DayCards are independently expandable).
3. No structured error UI with retry on PrepPage (only toast).
4. The contest page ContestSection has no null/empty guard (though the parent already guards with `contest && !loading`).

## Requested Changes (Diff)

### Add
- Fallback mock data in `gemini.ts` `extractJSONWithFallback` helper for contest problems and prep plans
- "Locked" state for DayCards in PrepPage: day N+1 cannot be expanded until day N is 100% complete
- Error state UI with retry button on PrepPage (matching ContestPage pattern)
- `extractJSONWithFallback` variants used from ContestPage and PrepPage with typed mock fallbacks

### Modify
- `gemini.ts`: add `extractJSONWithFallback<T>` that accepts a fallback value — returns fallback instead of throwing on JSON parse failure
- `ContestPage.tsx`: use `extractJSONWithFallback` with fallback mock contest data instead of plain `extractJSON`
- `PrepPage.tsx`:
  - Use `extractJSONWithFallback` with fallback mock prep plan
  - Add error state with retry button (like ContestPage)
  - DayCard receives `locked` prop; when locked, disable expand and show lock icon
  - Pass `locked={day.day > 1 && !previousDayComplete}` down to each DayCard
- Safe guards on `.map()` calls (already present via parent guards, but add extra safety with `?? []` on array fields from AI response)

### Remove
- Nothing removed

## Implementation Plan

1. Update `gemini.ts`: add `extractJSONWithFallback<T>(text, fallback): T` function
2. Define `FALLBACK_CONTEST` mock data constant in ContestPage (5 problems each for wednesday/sunday)
3. Define `FALLBACK_PREP_PLAN` mock data constant in PrepPage
4. Update ContestPage to use `extractJSONWithFallback` + safe array access
5. Update PrepPage:
   - Use `extractJSONWithFallback`
   - Add error state + retry
   - Track completed days, pass `locked` prop to DayCard
   - Update DayCard to accept and render locked state with visual indicator

## UX Notes

- Locked day cards show a lock icon and muted styling; tooltip explains "Complete Day N first"
- Fallback mock data is clearly realistic (not placeholder lorem) so demo looks good during hackathon
- Error state on PrepPage matches ContestPage: destructive-tinted box with message and Try Again button
- All `.map()` calls use `(arr ?? []).map(...)` pattern for safety
