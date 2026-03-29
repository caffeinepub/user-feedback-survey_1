# User Feedback Survey

## Current State
New project with empty backend and no frontend.

## Requested Changes (Diff)

### Add
- Survey form with multiple question types: star rating, multiple choice, and open text
- Survey submission stored in the backend
- Admin view to see all submitted responses
- Response count and basic stats on the admin page

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store survey submissions (name optional, rating 1-5, category choice, open feedback text), expose submit and list endpoints
2. Frontend: multi-step or single-page survey form with star rating, radio buttons, textarea
3. Admin page (accessible via link) to view all responses in a table with summary stats
4. Thank-you screen after submission
