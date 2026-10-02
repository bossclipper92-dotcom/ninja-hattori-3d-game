/**
 * SERVICES
 * ==============================================================
 * One entry = one service card (home page + Services page).
 * Add a service by copying a block { ... }, — remove one by deleting its block.
 *
 * Fields
 *   icon    – icon name (see scripts/lib/icon-data.mjs for the full list)
 *   title   – card heading
 *   summary – one or two sentences shown on the card
 *   bullets – 3 short points shown on the Services page
 */
export default [
  {
    icon: 'university',
    title: 'University & Course Selection',
    summary:
      'Compare options by country, budget and career goals, then shortlist the universities and programs that genuinely fit you.',
    bullets: [
      'Shortlists based on your goals and budget',
      'Entry requirements and study options explained',
      'Course content and pathways compared',
    ],
  },
  {
    icon: 'file-check',
    title: 'Admission Application Support',
    summary:
      'We help you prepare and submit complete, accurate applications and keep track of every deadline.',
    bullets: [
      'Application forms completed accurately',
      'Deadlines and offer follow-ups tracked',
      'Guidance on offer conditions and acceptance',
    ],
  },
  {
    icon: 'files',
    title: 'Document Preparation',
    summary:
      'Clear checklists and careful review of your academic, financial and personal documents before you submit.',
    bullets: [
      'A personal document checklist',
      'Review of transcripts, certificates and statements',
      'Help organizing and presenting your documents',
    ],
  },
  {
    icon: 'stamp',
    title: 'Visa Guidance',
    summary:
      'Step-by-step guidance on visa requirements, forms and supporting documents, so you know what to prepare and when.',
    bullets: [
      'Visa requirements explained step by step',
      'Help preparing forms and supporting documents',
      'Next-step guidance after your offer',
    ],
  },
  {
    icon: 'coins',
    title: 'Scholarship Guidance',
    summary:
      'Learn about scholarship and financial-aid options you may be eligible for, and how to apply.',
    bullets: [
      'Information on scholarship options',
      'Eligibility and deadlines explained',
      'Support preparing scholarship applications',
    ],
  },
  {
    icon: 'house',
    title: 'Accommodation Support',
    summary:
      'Help finding student accommodation near your campus that suits your budget and preferences.',
    bullets: [
      'On-campus and off-campus options explained',
      'Locations and budgets compared',
      'What to check before you book',
    ],
  },
  {
    icon: 'landing',
    title: 'Airport Pickup / Arrival Support',
    summary:
      'Guidance and arrangements for your arrival, so your first day in a new country feels less stressful.',
    bullets: [
      'Help arranging airport pickup',
      'Guidance for your first days in the city',
      'Orientation tips for getting settled',
    ],
  },
  {
    icon: 'luggage',
    title: 'Pre-Departure Guidance',
    summary:
      'Practical briefings on packing, travel, money and what to expect when you land.',
    bullets: [
      'Packing and travel preparation tips',
      'What to expect at your university',
      'Money, SIM card and banking basics',
    ],
  },
  {
    icon: 'heart-handshake',
    title: 'Student Support After Arrival',
    summary:
      'A familiar point of contact after you arrive, for questions and support as you settle into student life.',
    bullets: [
      'A point of contact once you have landed',
      'Help with common settling-in questions',
      'Support as you adapt to student life',
    ],
  },
];
