import svgLoader from 'vite-svg-loader';

export default function setupStaticPerf() {
  return [svgLoader()];
}
