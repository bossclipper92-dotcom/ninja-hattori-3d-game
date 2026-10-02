/**
 * PAGE COPY — headings, introductions and SEO titles/descriptions
 * ==============================================================
 * Edit the text between quotes, save, then run:  npm run build
 *
 * SEO tips
 *   • title        → keep under about 60 characters
 *   • description  → keep under about 155 characters
 * In headlines, text inside { } is highlighted, e.g. 'Your {Global Education} Starts Here'.
 * In FAQ answers / texts you can use {phone}, {email} and {destinations}.
 */
export default {
  // ============================================================
  // HOME
  // ============================================================
  home: {
    seo: {
      title: 'Achieve Aboard | Study Abroad Consultancy & Student Guidance',
      description:
        'Achieve Aboard helps students explore international education, choose the right university and course, and get guidance from application to arrival.',
    },
    hero: {
      eyebrow: 'Study Abroad Consultancy',
      title: 'Your Journey to {Global Education} Starts Here',
      lead: 'Achieve Aboard helps students explore international education opportunities, choose the right university and course, and receive guidance throughout their study abroad journey.',
      primaryCta: 'Chat on WhatsApp',
      secondaryCta: 'Start Your Journey',
      points: ['Free first consultation', 'Step-by-step guidance', 'Message us any time'],
      helpsLabel: 'We help with',
      helps: ['University Selection', 'Admission Support', 'Visa Guidance', 'Accommodation', 'Arrival Support'],
      image: {
        base: 'assets/img/photos/hero',
        widths: [480, 760, 1040],
        width: 760,
        height: 950,
        alt: 'Four smiling international students holding books and a laptop outside a modern university building',
      },
      card: { title: 'Free consultation', text: 'Ask us anything on WhatsApp' },
    },
  },

  // ============================================================
  // SHARED SECTION HEADINGS (used on the home page and inner pages)
  // ============================================================
  sections: {
    trust: {
      label: 'Why students choose Achieve Aboard',
    },
    about: {
      eyebrow: 'About Achieve Aboard',
      title: 'Your Trusted Study Abroad Partner',
      paragraphs: [
        'Choosing where and what to study is one of the biggest decisions you will make. Achieve Aboard is here to make it clearer and calmer. We help students explore international education opportunities, match them with suitable universities and courses, and guide them through every step that follows.',
        'From your first question to your first day on campus, you will have a real person to ask — in plain language, without pressure.',
      ],
      points: [
        { icon: 'cap', title: 'University selection', text: 'Compare universities, courses and destinations against your goals, budget and academic background.' },
        { icon: 'file-check', title: 'Admission guidance', text: 'Help preparing applications that are complete, accurate and submitted on time.' },
        { icon: 'files', title: 'Documentation', text: 'Clear checklists and document review, so nothing important is missed.' },
        { icon: 'stamp', title: 'Visa guidance', text: 'Step-by-step guidance on visa requirements, forms and supporting documents.' },
        { icon: 'house', title: 'Accommodation', text: 'Support finding student housing that suits your budget and location needs.' },
        { icon: 'landing', title: 'Arrival support', text: 'Practical help with your journey, your arrival and your first weeks in a new country.' },
      ],
      cta: 'Talk to Us on WhatsApp',
      secondaryCta: 'More about us',
      image: {
        base: 'assets/img/photos/about',
        widths: [560, 900],
        width: 900,
        height: 675,
        alt: 'An education counsellor talking with two students at a desk with a laptop and a small globe',
      },
      card: { title: 'Plain-language advice', text: 'No pressure, no jargon' },
    },
    services: {
      eyebrow: 'Our Services',
      title: 'Guidance at Every Step of Your Study Abroad Journey',
      lead: 'Choose the support you need, or let us guide you from your first question to your first day on campus.',
    },
    destinations: {
      eyebrow: 'Study Destinations',
      title: 'Where Would You Like to Study?',
      lead: 'Explore popular study destinations and tell us which ones interest you. We will help you compare your options.',
    },
    universities: {
      eyebrow: 'Universities',
      title: 'Explore Universities and Programs',
      lead: 'Search by name, country or program area. Spotted something interesting? Ask us about it and we will help with the next step.',
      empty: 'No universities match your search yet.',
      emptyHelp: 'Tell us what you are looking for and we will help you find suitable options.',
    },
    courses: {
      eyebrow: 'Courses',
      title: 'Find a Course That Fits Your Goals',
      lead: 'Browse popular study areas. Not sure what to choose? We will help you match your interests and background to the right programs.',
      cta: 'Find My Course',
      ctaText: 'Not sure which course suits you?',
    },
    why: {
      eyebrow: 'Why Achieve Aboard',
      title: 'Guidance That Puts You First',
      lead: 'Studying abroad is a big step. Here is what you can expect when you work with us.',
    },
    process: {
      eyebrow: 'How It Works',
      title: 'Five Simple Steps to Studying Abroad',
      lead: 'A clear path from your first message to your first day abroad.',
    },
    testimonials: {
      eyebrow: 'Student Voices',
      title: 'What Students Say',
      lead: 'Real feedback from students we have guided.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions Students Ask Us',
      lead: 'Quick answers to common questions. Can’t find yours? Just message us.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Start Your Journey Today',
      lead: 'Tell us a little about your plans and we will reply on WhatsApp. Prefer email? That works too.',
      formTitle: 'Send us your inquiry',
      formNote:
        'This form opens WhatsApp with your details ready to send, so you can review the message first. Nothing is stored on this website.',
    },
    blog: {
      eyebrow: 'Blog',
      title: 'Study Abroad Guides & Tips',
      lead: 'Practical, plain-language advice for students planning to study overseas.',
    },
  },

  // ============================================================
  // CTA BAND (the big call-to-action blocks)
  // ============================================================
  cta: {
    title: 'Ready to take the first step?',
    text: 'Send us a message on WhatsApp and tell us where you would like to study. We will help you with what comes next.',
    primary: 'Chat on WhatsApp',
    secondary: 'Email Us',
    // Short variant used between sections
    mini: {
      title: 'Not sure where to start?',
      text: 'Chat with us on WhatsApp — a short conversation can make your next steps much clearer.',
    },
  },

  // ============================================================
  // INNER PAGES
  // ============================================================
  destinations: {
    seo: {
      title: 'Study Destinations | Study Abroad Guidance | Achieve Aboard',
      description:
        'Explore study destinations including Malaysia, Australia, the UK, Canada, the USA, Europe, Japan and South Korea. Ask Achieve Aboard which one fits you.',
    },
    hero: {
      eyebrow: 'Study Destinations',
      title: 'Choose Your Study Destination',
      lead: 'Every country offers something different. Explore what each destination is known for, then tell us what matters to you — we will help you compare.',
    },
    help: {
      title: 'Not sure which country is right for you?',
      text: 'Tell us your course, budget and goals. We will help you compare destinations and shortlist the ones that fit.',
    },
  },
  universities: {
    seo: {
      title: 'Universities Abroad | Search & Compare | Achieve Aboard',
      description:
        'Search and filter universities by country and program area, then ask Achieve Aboard for help choosing the right one and applying.',
    },
    hero: {
      eyebrow: 'Universities',
      title: 'Find the Right University',
      lead: 'Search by name, country or program area. Ask us about any university and we will explain the options, requirements and next steps.',
    },
    help: {
      title: 'Can’t find a particular university?',
      text: 'Tell us the name or the course you have in mind and we will check the options for you.',
    },
  },
  courses: {
    seo: {
      title: 'Courses & Programs to Study Abroad | Achieve Aboard',
      description:
        'Explore popular study areas — business, IT, engineering, health, hospitality, data science and more — and get help finding the course that fits you.',
    },
    hero: {
      eyebrow: 'Courses',
      title: 'Explore Courses and Study Areas',
      lead: 'From business to data science, find the field that matches your interests and career goals, then let us help you find the right program.',
    },
  },
  services: {
    seo: {
      title: 'Services: Admission, Visa & Arrival Support | Achieve Aboard',
      description:
        'From university selection and applications to visa guidance, accommodation and arrival support — see how Achieve Aboard supports students at every step.',
    },
    hero: {
      eyebrow: 'Our Services',
      title: 'Support From First Question to First Day',
      lead: 'Use one service or all of them. Here is how Achieve Aboard supports you before you apply, while you apply, and after you arrive.',
    },
  },
  about: {
    seo: {
      title: 'About Achieve Aboard | Your Trusted Study Abroad Partner',
      description:
        'Learn how Achieve Aboard guides students through university selection, admission, documentation, visa guidance, accommodation and arrival support.',
    },
    hero: {
      eyebrow: 'About Us',
      title: 'Guiding Students Toward Global Education',
      lead: 'We are a study abroad consultancy built around one idea: students deserve clear, honest guidance from the first question to the first day on campus.',
    },
    promise: {
      eyebrow: 'Our approach',
      title: 'Honest guidance, clearly explained',
      paragraphs: [
        'We believe good advice starts with listening. Before suggesting a destination or a course, we want to understand your goals, your budget and your situation.',
        'We are also straightforward about what we can and cannot do. Admission decisions are made by universities, and visa decisions are made by government authorities. We cannot guarantee outcomes — what we can do is help you choose suitable options, prepare complete and accurate applications, and understand every requirement along the way.',
      ],
      values: [
        { icon: 'message-text', title: 'We listen first', text: 'Your goals and circumstances shape our advice.' },
        { icon: 'eye', title: 'We explain clearly', text: 'Steps, requirements and timelines in plain language.' },
        { icon: 'badge-check', title: 'We stay honest', text: 'No unrealistic promises — just careful, practical support.' },
        { icon: 'heart-handshake', title: 'We stay with you', text: 'Support from your first message through arrival and beyond.' },
      ],
    },
  },
  blog: {
    seo: {
      title: 'Study Abroad Blog: Guides & Tips | Achieve Aboard',
      description:
        'Practical study abroad guides: choosing a destination, preparing documents, shortlisting universities and getting ready to depart.',
    },
  },
  contact: {
    seo: {
      title: 'Contact Achieve Aboard | WhatsApp & Free Consultation',
      description:
        'Message Achieve Aboard on WhatsApp or send an inquiry about studying abroad. Tell us your preferred country, study level and course and we will reply.',
    },
    hero: {
      eyebrow: 'Contact Us',
      title: 'Let’s Plan Your Study Abroad Journey',
      lead: 'The quickest way to reach us is WhatsApp. You can also send an inquiry using the form or email us directly.',
    },
  },
  privacy: {
    seo: {
      title: 'Privacy Policy | Achieve Aboard',
      description: 'How Achieve Aboard handles the information you share when you contact us through this website.',
    },
    hero: {
      eyebrow: 'Legal',
      title: 'Privacy Policy',
      lead: 'How we handle the information you share with us.',
    },
    updated: '3 October 2026',
  },
};
