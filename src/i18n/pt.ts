import type { Dict } from './en';

export const pt: Dict = {
  lang: 'pt',
  htmlLang: 'pt-BR',
  paths: { home: '/pt/', other: '/' },
  otherLabel: 'EN',
  otherName: 'English',
  meta: {
    title: 'Vinicius Castelli',
    description: 'Vinicius Castelli: trabalho, textos e como falar comigo.',
  },
  skip: 'Pular para o conteúdo',
  name: 'Vinicius Castelli',
  bio: [
    'Estudo Engenharia na Poli-USP e sou obcecado por construir ferramentas úteis que mudam vidas e negócios. Trabalho com biologia computacional, saúde e ML e IA aplicados à indústria.',
  ],
  lines: [
    { before: 'Meu trabalho está no ', links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/viniciuscastelli' },
      { label: 'GitHub', href: 'https://github.com/castlelli' },
    ], join: ' e no ', after: '.' },
    { before: 'Meus textos estão em ', links: [
      { label: 'castellibr.substack.com', href: 'https://castellibr.substack.com' },
    ], join: '', after: '.' },
    { before: 'Escreva para mim em ', links: [
      { label: 'vcastelli@usp.br', href: 'mailto:vcastelli@usp.br' },
    ], join: '', after: '.' },
  ],
  copy: '© 2026 Vinicius Castelli',
};
