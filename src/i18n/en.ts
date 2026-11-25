export const en = {
  lang: 'en',
  htmlLang: 'en',
  paths: { home: '/', other: '/pt/' },
  otherLabel: 'PT',
  otherName: 'Português',
  meta: {
    title: 'Vinicius Castelli',
    description: 'Vinicius Castelli: work, writing and how to reach me.',
  },
  skip: 'Skip to content',
  name: 'Vinicius Castelli',
  bio: [
    'I\'m an engineering major at Poli-USP, obsessed with building useful tools that change lives and businesses. I work with computational biology, health and industry-wide ML and AI.',
  ],
  // Each line is a sentence; the links sit inside it between `before` and `after`.
  lines: [
    { before: 'My work is at ', links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/viniciuscastelli' },
      { label: 'GitHub', href: 'https://github.com/castlelli' },
    ], join: ' and ', after: '.' },
    { before: 'My writing is at ', links: [
      { label: 'castellibr.substack.com', href: 'https://castellibr.substack.com' },
    ], join: '', after: '.' },
    { before: 'Write to me at ', links: [
      { label: 'vcastelli@usp.br', href: 'mailto:vcastelli@usp.br' },
    ], join: '', after: '.' },
  ],
  copy: '© 2026 Vinicius Castelli',
};

export type Dict = typeof en;
