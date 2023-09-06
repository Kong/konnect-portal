// copypasta from /apps/konnect-api/portals/themes/themes.const

export const THEMES = {
  mint_rocket: {
    section_colors: {
      header: { value: '#F8F8F8', description: 'Background for header' },
      body: { value: '#FFFFFF', description: 'Background for main content' },
      hero: { value: '#F8F8F8', description: 'Background for hero section' },
      accent: { value: '#F8F8F8', description: 'Subtle background' },
      tertiary: { value: '#FFFFFF', description: 'Tertiary background' },
      stroke: { value: 'rgba(0,0,0,0.1)', description: 'Border color' },
      footer: { value: '#07A88D', description: 'Background for footer' }
    },
    text_colors: {
      header: { value: 'rgba(0,0,0,0.8)', description: 'Header text' },
      hero: { value: '#FFFFFF', description: 'Hero text' },
      headings: { value: 'rgba(0,0,0,0.8)', description: 'Headings text' },
      primary: { value: 'rgba(0,0,0,0.8)', description: 'Main content text' },
      secondary: { value: 'rgba(0,0,0,0.8)', description: 'Supporting text' },
      accent: { value: '#07A88D', description: 'Subtle text' },
      link: { value: '#07A88D', description: 'Link text' },
      footer: { value: '#FFFFFF', description: 'Footer text' }
    },
    button_colors: {
      'primary-fill': { value: '#1155CB', description: 'Background for Primary Button' },
      'primary-text': { value: '#FFFFFF', description: 'Text for Primary Button' }
    }
  },
  dark_mode: {
    section_colors: {
      header: { value: '#0A161E', description: 'Background for header' },
      body: { value: '#0C0C0C', description: 'Background for main content' },
      hero: { value: '#1A1D21', description: 'Background for hero section' },
      accent: { value: '#1F1F1F', description: 'Subtle background' },
      tertiary: { value: '#222529', description: 'Tertiary background' },
      stroke: { value: '#34393F', description: 'Border color' },
      footer: { value: '#212429', description: 'Background for footer' }
    },
    text_colors: {
      header: { value: '#FFFFFF', description: 'Header text' },
      hero: { value: 'rgba(255,255,255,0.8)', description: 'Hero text' },
      headings: { value: '#FFFFFF', description: 'Headings text' },
      primary: { value: '#C8C8C9', description: 'Main content text' },
      secondary: { value: '#919294', description: 'Supporting text' },
      accent: { value: '#FFFFFF', description: 'Subtle text' },
      link: { value: '#2977FF', description: 'Link text' },
      footer: { value: '#FFFFFF', description: 'Footer text' }
    },
    button_colors: {
      'primary-fill': { value: '#1155CB', description: 'Background for Primary Button' },
      'primary-text': { value: '#FFFFFF', description: 'Text for Primary Button' }
    }
  }
}

export const DEFAULT_THEME = THEMES.mint_rocket

export const DEFAULT_FONTS = {
  base: 'Roboto',
  code: 'Roboto Mono',
  headings: 'Lato'
}
