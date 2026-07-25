export interface TreeParams {
  S0: number;
  K: number;
  u: number;
  d: number;
  r: number;
  T: number;
  N: number;
  sigma?: number;
}

export function buildStockTree(p: TreeParams): number[][] {
  const tree: number[][] = [];
  for (let i = 0; i <= p.N; i++) {
    const layer = new Array(i + 1).fill(0);
    for (let j = 0; j <= i; j++) {
      // j is the number of up moves, (i - j) is the number of down moves
      layer[j] = p.S0 * Math.pow(p.u, j) * Math.pow(p.d, i - j);
    }
    tree.push(layer);
  }
  return tree;
}

export function riskNeutralP(p: TreeParams): number {
  const dt = p.T / p.N;
  const R = Math.exp(p.r * dt);
  return (R - p.d) / (p.u - p.d);
}

export function priceEuropeanOption(p: TreeParams, kind: "call" | "put"): { optionTree: number[][], price: number } {
  const stockTree = buildStockTree(p);
  const dt = p.T / p.N;
  const q = riskNeutralP(p);
  const discount = Math.exp(-p.r * dt);

  const optionTree: number[][] = new Array(p.N + 1);
  
  // Terminal payoffs
  const terminalNodes = stockTree[p.N];
  optionTree[p.N] = new Array(p.N + 1).fill(0);
  for (let j = 0; j <= p.N; j++) {
    if (kind === "call") {
      optionTree[p.N][j] = Math.max(0, terminalNodes[j] - p.K);
    } else {
      optionTree[p.N][j] = Math.max(0, p.K - terminalNodes[j]);
    }
  }

  // Backward induction
  for (let i = p.N - 1; i >= 0; i--) {
    optionTree[i] = new Array(i + 1).fill(0);
    for (let j = 0; j <= i; j++) {
      // optionTree[i+1][j+1] is the up node
      // optionTree[i+1][j] is the down node
      const expected = q * optionTree[i + 1][j + 1] + (1 - q) * optionTree[i + 1][j];
      optionTree[i][j] = expected * discount;
    }
  }

  return { optionTree, price: optionTree[0][0] };
}

export function buildDeltaTree(p: TreeParams, optionTree: number[][], stockTree: number[][]): number[][] {
  const deltaTree: number[][] = [];
  for (let i = 0; i < p.N; i++) {
    const layer = new Array(i + 1).fill(0);
    for (let j = 0; j <= i; j++) {
      const Cu = optionTree[i + 1][j + 1];
      const Cd = optionTree[i + 1][j];
      const Su = stockTree[i + 1][j + 1];
      const Sd = stockTree[i + 1][j];
      layer[j] = (Cu - Cd) / (Su - Sd);
    }
    deltaTree.push(layer);
  }
  return deltaTree;
}

export function calibrateFromVol(sigma: number, dt: number): { u: number; d: number } {
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = Math.exp(-sigma * Math.sqrt(dt));
  return { u, d };
}

export function convergenceSeries(p: TreeParams, maxN: number, calibrated: boolean, sigma?: number): { N: number; price: number }[] {
  const series = [];
  for (let N = 1; N <= maxN; N++) {
    let currentP = { ...p, N };
    if (calibrated && sigma) {
      const dt = currentP.T / currentP.N;
      const { u, d } = calibrateFromVol(sigma, dt);
      currentP = { ...currentP, u, d };
    }
    const { price } = priceEuropeanOption(currentP, "call");
    series.push({ N, price });
  }
  return series;
}
