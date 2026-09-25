export const APP_CONSTANTS = {
  OLYMPIC_DATA_URL: './assets/mock/olympic.json',
  
  // Labels
  MEDALS_PER_COUNTRY: 'Medals per Country',
  NUMBER_OF_JOS: 'Number of JOs',
  NUMBER_OF_COUNTRIES: 'Number of countries',
  NUMBER_OF_ENTRIES: 'Number of entries',
  TOTAL_MEDALS: 'Total number of medals',
  TOTAL_ATHLETES: 'Total number of athletes',
  
  // Colors for charts
  CHART_COLORS: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', '#FFA500', '#94819d'],
  CHART_BG_COLOR: '#0b868f',
  
  // Responsive breakpoints (px)
  BREAKPOINTS: {
    MOBILE: 768,      // <= 767px
    TABLET: 1200,     // 768-1199px
    DESKTOP: 1200     // >= 1200px
  }
};

// Ratio largeur/hauteur des graphiques Chart.js selon la largeur d'écran
export function getResponsiveAspectRatio(windowWidth: number): number {
  if (windowWidth < APP_CONSTANTS.BREAKPOINTS.MOBILE) {
    return 1;
  }
  if (windowWidth < APP_CONSTANTS.BREAKPOINTS.DESKTOP) {
    return 1.8;
  }
  return 2.5;
}
