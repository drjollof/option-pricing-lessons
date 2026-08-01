import { TreeParams } from './binomial';

export function buildTrinomialStockTree(p: TreeParams): number[][] {
  const tree: number[][] = [];
  for (let i = 0; i <= p.N; i++) {
    const layer = new Array(2 * i + 1).fill(0);
    // j goes from 0 to 2i. j=0 is lowest price, j=2i is highest price.
    // Price at (i, j) is S0 * u^(j - i) assuming u = 1/d and m = 1
    for (let j = 0; j <= 2 * i; j++) {
      layer[j] = p.S0 * Math.pow(p.u, j - i);
    }
    tree.push(layer);
  }
  return tree;
}

export function computeTrinomialProbabilities(p: TreeParams) {
  // Variance matching for pu, pm, pd
  const dt = p.T / p.N;
  const r = p.r;
  const sigma = p.sigma || 0.2; // default sigma if not provided
  
  // Actually, many trinomial models use specific formulas.
  // Standard variance matching:
  // M = e^{r dt}
  // V = e^{2r dt} + sigma^2 dt
  // E[S_{t+dt}/S_t] = M
  // E[(S_{t+dt}/S_t)^2] = V
  // pu*u + pm*1 + pd*d = M
  // pu*u^2 + pm*1 + pd*d^2 = V
  // pu + pm + pd = 1
  
  const M = Math.exp(r * dt);
  const V = Math.exp(2 * r * dt) + sigma * sigma * dt;
  
  const u = p.u;
  const d = p.d;
  
  // pu = (V - 1 - (M-1)*(d+1)) / ((u-1)*(u-d))  -- simplified
  // By Cramer's rule or algebraic substitution:
  // pm = 1 - pu - pd
  // pu*u + (1 - pu - pd) + pd*d = M
  // pu*(u-1) + pd*(d-1) = M - 1
  // pu*(u^2-1) + pd*(d^2-1) = V - 1
  
  // Solving for pd:
  // pd = ( (M-1)(u+1) - (V-1) ) / ( (1-d)(u-d) )
  const pd = ((M - 1) * (u + 1) - (V - 1)) / ((1 - d) * (u - d));
  const pu = ((V - 1) - (M - 1) * (d + 1)) / ((u - 1) * (u - d));
  const pm = 1 - pu - pd;
  
  return { pu, pm, pd };
}

export function priceTrinomialOption(
  p: TreeParams,
  optionType: 'call' | 'put',
  isAmerican: boolean = false
) {
  const stockTree = buildTrinomialStockTree(p);
  const { pu, pm, pd } = computeTrinomialProbabilities(p);
  const dt = p.T / p.N;
  const df = Math.exp(-p.r * dt);
  
  const optionTree: number[][] = [];
  let exerciseTree: boolean[][] | undefined = isAmerican ? [] : undefined;
  
  for (let i = 0; i <= p.N; i++) {
    optionTree.push(new Array(2 * i + 1).fill(0));
    if (exerciseTree) {
      exerciseTree.push(new Array(2 * i + 1).fill(false));
    }
  }
  
  // Terminal payoffs
  for (let j = 0; j <= 2 * p.N; j++) {
    const S = stockTree[p.N][j];
    optionTree[p.N][j] = Math.max(0, optionType === 'call' ? S - p.K : p.K - S);
    if (exerciseTree) {
      exerciseTree[p.N][j] = optionTree[p.N][j] > 0;
    }
  }
  
  // Backward induction
  for (let i = p.N - 1; i >= 0; i--) {
    for (let j = 0; j <= 2 * i; j++) {
      // For node (i, j), the 3 next nodes are at i+1, and indices j, j+1, j+2.
      const vDown = optionTree[i + 1][j];
      const vMid = optionTree[i + 1][j + 1];
      const vUp = optionTree[i + 1][j + 2];
      
      let expected = df * (pu * vUp + pm * vMid + pd * vDown);
      
      if (isAmerican) {
        const S = stockTree[i][j];
        const intrinsic = Math.max(0, optionType === 'call' ? S - p.K : p.K - S);
        if (intrinsic > expected) {
          expected = intrinsic;
          if (exerciseTree) exerciseTree[i][j] = true;
        }
      }
      optionTree[i][j] = expected;
    }
  }
  
  return isAmerican ? { optionTree, exerciseTree } : { optionTree };
}
