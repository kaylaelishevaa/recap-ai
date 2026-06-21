// Fabricated sample transcripts for quick-loading the demo. No real people,
// companies, or meeting data — purely illustrative content for the paste flow.

export const SAMPLE_TRANSCRIPTS = [
  {
    id: 'q3-planning',
    label: 'Q3 Product Planning',
    text: `Sarah: Alright everyone, let's get started with our Q3 planning session. First up, the mobile app redesign.

James: We've finished the user research phase. Key finding: 73% of users want a simplified dashboard. I'd recommend we go with the minimal design prototype.

Sarah: I agree. Let's officially approve the minimal design. James, can you get the updated wireframes to the design team by Friday?

James: Absolutely. I'll also set up a review session with the client for next Tuesday.

Lisa: On the backend side, we need to decide on the API versioning strategy. I'm proposing we go with URL-based versioning — it's simpler for our mobile clients.

Sarah: That makes sense. Any objections? Okay, let's go with URL-based versioning. Lisa, can you draft the migration plan?

Lisa: Will do. I'll have it ready by end of next week.

Sarah: Great. One more thing — the Q2 performance review showed our page load time increased by 200ms. We need to address that.

James: I can investigate the bundle size. Might be the new analytics library.

Sarah: Perfect. James, add that to your sprint. Let's meet again next Thursday to review progress. Thanks everyone!`,
  },
  {
    id: 'incident-retro',
    label: 'Incident Retrospective',
    text: `Marco: Thanks for joining the retro on yesterday's checkout outage. Let's start with the timeline.

Priya: The first alerts fired at 2:14pm when the payment service started returning 500s. Root cause was a database connection pool exhaustion after the morning deploy.

Marco: So the deploy raised the request volume per connection. Do we agree that's the root cause?

Priya: Yes, confirmed from the metrics. We resolved it at 2:51pm by rolling back and bumping the pool size.

Tomas: I think we should make the connection pool size configurable per environment instead of hardcoded. That would have let us patch faster.

Marco: Agreed, let's do that. Tomas, can you own the config change? Aim for this sprint.

Tomas: Sure, I'll have a PR up by Wednesday.

Priya: We also had no alert on connection pool saturation — we only found out from the 500s. We should add one.

Marco: Good call. Priya, can you add the saturation alert and a runbook entry? Let's make the postmortem doc visible to the whole engineering org by Friday.

Priya: On it.

Marco: One follow-up — let's evaluate load-testing deploys before they hit production. I'll book a session next week to scope it. Thanks all.`,
  },
  {
    id: 'daily-standup',
    label: 'Engineering Standup',
    text: `Dana: Quick standup, let's keep it tight. Aiden, you start.

Aiden: Yesterday I finished the search indexing job. Today I'm wiring it into the admin panel. No blockers.

Bianca: I'm still on the notifications refactor. I hit a blocker — the email provider sandbox keeps rate-limiting my tests. I could use a second pair of eyes.

Dana: Noted. Aiden, can you pair with Bianca on the rate-limit issue this afternoon?

Aiden: Yep, after lunch works.

Caleb: I shipped the onboarding tooltip fixes and they're in QA. Next I'm picking up the CSV export ticket.

Dana: Great. Reminder that the release branch cuts Thursday, so let's get the notifications refactor reviewed before then. Bianca, do you think it lands by Wednesday?

Bianca: If the rate-limit thing gets unblocked today, yes.

Dana: Perfect. That's it — thanks everyone.`,
  },
  {
    id: 'sales-discovery',
    label: 'Sales Discovery Call',
    text: `Reza: Thanks for taking the call. To start — what prompted you to look at a new analytics tool now?

Customer (Nadia): Our current setup can't handle event-level data, and our team spends hours every week stitching reports together by hand.

Reza: Got it. How big is the team that would be using this?

Nadia: About twelve people across product and marketing. Marketing is the heaviest user.

Reza: And if this worked perfectly, what would success look like in six months?

Nadia: Honestly, self-serve dashboards so people stop pinging the data team for every question.

Reza: That's exactly what our self-serve layer is built for. The main concern usually is migration effort — can I send over a migration guide and a sandbox account?

Nadia: Yes please. We'd also need to know about SSO and data residency before we can move forward.

Reza: Understood. I'll include a security overview. Let's set a follow-up demo with your data lead next week — does Thursday work?

Nadia: Thursday afternoon is good.

Reza: Great, I'll send the invite and the materials today.`,
  },
  {
    id: 'budget-review',
    label: 'Quarterly Budget Review',
    text: `Helena: Let's review the quarterly numbers and decide on next quarter's allocation. Finance first.

Owen: We came in 8% under budget overall, mostly from lower cloud spend after the rightsizing project. Marketing was 12% over due to the conference push.

Helena: Was the conference worth it?

Priscilla: It drove our two biggest pipeline deals, so yes — but I'll tighten the travel line next time.

Helena: Fair. Decision: we keep the marketing budget flat and reallocate the cloud savings to two new engineering contractor seats.

Owen: I'll update the forecast to reflect that.

Helena: Priscilla, can you prepare a one-page ROI summary on the conference for the board deck?

Priscilla: Sure, I'll have it by Monday.

Helena: And Owen, please flag any vendor contracts renewing in the next 90 days so we can renegotiate. Let's reconvene in two weeks to finalize. Thanks.`,
  },
]

// Pick a random sample, avoiding an immediate repeat of `excludeId` when possible.
export function randomSample(excludeId = null) {
  const pool = SAMPLE_TRANSCRIPTS.filter((s) => s.id !== excludeId)
  const list = pool.length ? pool : SAMPLE_TRANSCRIPTS
  return list[Math.floor(Math.random() * list.length)]
}
