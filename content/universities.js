/**
 * UNIVERSITIES  (searchable + filterable on the home page and Universities page)
 * ==============================================================
 * ⚠ THESE ARE PLACEHOLDERS. They are NOT real institutions or partnerships.
 *   Replace them with the universities you actually work with, then delete the
 *   `placeholder: true` line from each real entry (that removes the "Sample" tag).
 *
 * TO ADD A UNIVERSITY:  copy a block { ... }, paste it below, edit the text.
 * TO REMOVE ONE:        delete its block.
 *
 * Fields
 *   name        – university name
 *   country     – must match a destination `name` in content/destinations.js (e.g. 'Malaysia')
 *   programs    – popular program areas. Use names from content/courses.js
 *                 (Business, Engineering, …) so the "Program" filter works.
 *   placeholder – true = shows a "Sample" tag. Delete the line for real entries.
 *   note        – optional extra line shown under the name (e.g. 'Foundation to PhD')
 *   website     – optional official website, shown as a small link
 */
export default [
  {
    name: 'Sample Tech University',
    country: 'Malaysia',
    programs: ['Computer Science & IT', 'Engineering', 'Data Science / AI'],
    placeholder: true,
  },
  {
    name: 'Sample Business School',
    country: 'Malaysia',
    programs: ['Business', 'Accounting & Finance', 'Hospitality'],
    placeholder: true,
  },
  {
    name: 'Sample Health Sciences College',
    country: 'Malaysia',
    programs: ['Health & Medical', 'Social Sciences'],
    placeholder: true,
  },
  {
    name: 'Sample Metropolitan University',
    country: 'Australia',
    programs: ['Business', 'Computer Science & IT', 'Hospitality'],
    placeholder: true,
  },
  {
    name: 'Sample Institute of Engineering',
    country: 'Australia',
    programs: ['Engineering', 'Data Science / AI'],
    placeholder: true,
  },
  {
    name: 'Sample Heritage University',
    country: 'UK',
    programs: ['Business', 'Social Sciences', 'Accounting & Finance'],
    placeholder: true,
  },
  {
    name: 'Sample School of Computing',
    country: 'UK',
    programs: ['Computer Science & IT', 'Data Science / AI'],
    placeholder: true,
  },
  {
    name: 'Sample Lakeside University',
    country: 'Canada',
    programs: ['Engineering', 'Health & Medical', 'Business'],
    placeholder: true,
  },
  {
    name: 'Sample State University',
    country: 'USA',
    programs: ['Computer Science & IT', 'Business', 'Engineering'],
    placeholder: true,
  },
  {
    name: 'Sample European Business Academy',
    country: 'Europe',
    programs: ['Business', 'Hospitality', 'Accounting & Finance'],
    placeholder: true,
  },
  {
    name: 'Sample Institute of Technology',
    country: 'Japan',
    programs: ['Engineering', 'Computer Science & IT'],
    placeholder: true,
  },
  {
    name: 'Sample National University',
    country: 'South Korea',
    programs: ['Data Science / AI', 'Business', 'Social Sciences'],
    placeholder: true,
  },
];
