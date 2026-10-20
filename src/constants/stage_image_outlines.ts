// Contorno da janela da foto nas cartas de estágio 1 e 2: a estrela de evolução invade o canto
// superior esquerdo da janela, então a foto é recortada (e a box desenhada) seguindo esse contorno.
// Coordenadas da carta (744x1045). Os pontos foram extraídos dos próprios templates, com 1px de folga
// para fora, para a foto cobrir o antialias da moldura e da estrela.
// A chave é a largura da imagem do template, que identifica o layout dele.
export type OutlinePoint = [number, number];

export const STAGE_IMAGE_OUTLINES: { [templateWidth: number]: OutlinePoint[] } = {
  // Templates 2250x3150 (dark, eletric, fighter, fire, grass, metal, normal, psychic, water)
  2250: [
    // Retângulo: topo (depois da estrela) → canto superior direito → inferior direito → inferior esquerdo
    [175.5, 134.7], [649.5, 134.7], [649.5, 519.7], [94, 519.7],
    // Contorno da estrela, de baixo (lateral esquerda) para cima (topo)
    [94, 189.7], [100.5, 184.7], [111.5, 192.2], [113, 192.2], [121, 185.2], [128.5, 189.7],
    [143.5, 170.7], [155, 167.2], [157, 165.7], [157, 163.2], [161, 152.7], [176, 137.7], [174.5, 135.7],
  ],

  // Templates 3068x4196 (demais tipos e as versões _old / _old_2)
  3068: [
    // Retângulo: topo (depois da estrela) → canto superior direito → inferior direito → inferior esquerdo
    [163, 130.7], [659.5, 130.7], [659.5, 530.7], [84, 530.7],
    // Contorno da estrela, de baixo (lateral esquerda) para cima (topo)
    [84.5, 180.2], [90.5, 176.2], [93, 175.7], [102, 185.7], [103.5, 186.2], [112.5, 176.2], [114.5, 175.7],
    [124.5, 181.7], [130, 170.2], [139.5, 161.2], [146, 159.2], [158.5, 146.7], [168.5, 142.2], [162, 131.7],
  ],
};

export const outlineToPath = (points: OutlinePoint[]) =>
  'M' + points.map(([x, y]) => `${x} ${y}`).join(' L') + ' Z';

// Retângulo que envolve o contorno: é a área onde a foto é encaixada (como o "cover" da box normal)
export const outlineBox = (points: OutlinePoint[]) => {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
};
