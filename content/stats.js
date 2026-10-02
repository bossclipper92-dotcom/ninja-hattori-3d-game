/**
 * TRUST / STATISTIC CARDS  (shown right under the home page hero)
 * ==============================================================
 * No figures are invented here. Each card shows an icon, a label and a short line.
 *
 * To show a big number on a card, fill in `value` with a figure you can PROVE
 * (for example '50+' or '12 countries'). Leave it as '' to show the icon instead.
 *
 * In `text` you can use {destinations} — it is replaced automatically with the
 * list of countries from content/destinations.js.
 *
 * Fields:  icon · label · value (optional) · text
 */
export default [
  {
    icon: 'university',
    label: 'University Options',
    value: '', // ← add a verified number here, e.g. '30+'
    text: 'Compare programs across destinations to find the right fit for your goals and budget.',
  },
  {
    icon: 'globe',
    label: 'Study Destinations',
    value: '', // ← or e.g. '8'
    text: '{destinations}.',
  },
  {
    icon: 'life-buoy',
    label: 'Student Support',
    value: '', // ← e.g. a number of students supported
    text: 'Help from your first question to settling in after arrival.',
  },
  {
    icon: 'headset',
    label: '24/7 Guidance',
    value: '',
    text: 'Message us on WhatsApp any time. We reply as soon as we can.',
  },
];
