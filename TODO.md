# TODO - Chatbot Icon Color Feature

- [x] Understand codebase (dashboard, settings API, chatBot.js, model)
- [x] 1. Add `iconColor` field (default `#000000`) to `src/model/settings.model.ts`
- [x] 2. Persist `iconColor` in `src/app/api/settings/route.ts`
- [x] 3. Return `iconColor` from `src/app/api/settings/get/route.ts` (and fix `knowledgeBase` -> `knowledge` key)
- [x] 4. Add Icon Color section + live preview to `src/app/components/DashboardClient.tsx`
- [x] 5. Apply saved color in `public/chatBot.js` (icon button, header, send button, user bubbles)
- [x] 6. Verify build & behavior (tsc clean; build blocked only by pre-existing missing Scalekit env var)
- [x] 7. Fix runtime crash: make Scalekit init lazy (`getScalekit()`) so app boots without env vars (home page returns HTTP 200)
      - Note: dashboard/settings APIs still require MONGODB_URL + NEXT_PUBLIC_URL env vars (gitignored) to be set locally

