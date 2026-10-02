/**
 * COURSE CATEGORIES
 * ==============================================================
 * One entry = one category card (home page + Courses page).
 * The category `name` is also used by the "Program" filter in the university section,
 * so keep it identical to the names used in content/universities.js.
 *
 * Fields
 *   name     – category name (the exact words used for filtering)
 *   icon     – icon name (see scripts/lib/icon-data.mjs)
 *   summary  – one short sentence
 *   programs – example programs students often explore (general names, not promises)
 *   note     – optional extra note shown on the Courses page
 */
export default [
  {
    name: 'Business',
    icon: 'briefcase',
    summary: 'Management, marketing, entrepreneurship and international business.',
    programs: ['Business Administration', 'International Business', 'Marketing', 'Management', 'Entrepreneurship', 'MBA'],
  },
  {
    name: 'Computer Science & IT',
    icon: 'code',
    summary: 'Software, networks, cybersecurity and information systems.',
    programs: ['Computer Science', 'Software Engineering', 'Cybersecurity', 'Information Technology', 'Cloud Computing', 'Web & Mobile Development'],
  },
  {
    name: 'Engineering',
    icon: 'cog',
    summary: 'Civil, mechanical, electrical, chemical and more.',
    programs: ['Civil Engineering', 'Mechanical Engineering', 'Electrical & Electronic Engineering', 'Chemical Engineering', 'Mechatronics'],
  },
  {
    name: 'Health & Medical',
    icon: 'stethoscope',
    summary: 'Nursing, pharmacy, public health and biomedical sciences.',
    programs: ['Nursing', 'Pharmacy', 'Public Health', 'Biomedical Science', 'Physiotherapy'],
    note: 'Health and medical programs often have specific entry and registration requirements. We will explain them clearly before you apply.',
  },
  {
    name: 'Hospitality',
    icon: 'concierge-bell',
    summary: 'Hotel, tourism, events and culinary programs.',
    programs: ['Hotel Management', 'Tourism Management', 'Event Management', 'Culinary Arts', 'Hospitality & Tourism'],
  },
  {
    name: 'Data Science / AI',
    icon: 'brain',
    summary: 'Data science, machine learning, analytics and artificial intelligence.',
    programs: ['Data Science', 'Artificial Intelligence', 'Machine Learning', 'Business Analytics', 'Big Data'],
  },
  {
    name: 'Accounting & Finance',
    icon: 'calculator',
    summary: 'Accounting, finance, banking and financial analysis.',
    programs: ['Accounting', 'Finance', 'Banking & Finance', 'Financial Analysis', 'Taxation'],
  },
  {
    name: 'Social Sciences',
    icon: 'users',
    summary: 'Psychology, education, communication and international relations.',
    programs: ['Psychology', 'Education', 'Mass Communication', 'International Relations', 'Sociology'],
  },
];
