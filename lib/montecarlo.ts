import { TreeParams } from './binomial';

// Box-Muller transform for standard normal random variables
export function randomNormal(): number {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export interface MonteCarloPath {
  prices: number[];
  terminalPrice: number;
  averagePrice: number;
}

export interface MonteCarloResult {
  paths: MonteCarloPath[];
  europeanCallPrice: number;
  europeanPutPrice: number;
  asianCallPrice: number;
  asianPutPrice: number;
}

export function generateMonteCarloPaths(p: TreeParams, numPaths: number = 50, steps: number = 100): MonteCarloResult {
  const dt = p.T / steps;
  const sigma = p.sigma || 0.2;
  const drift = (p.r - 0.5 * sigma * sigma) * dt;
  const vol = sigma * Math.sqrt(dt);
  const df = Math.exp(-p.r * p.T);
  
  const paths: MonteCarloPath[] = [];
  
  let totalEuropeanCallPayoff = 0;
  let totalEuropeanPutPayoff = 0;
  let totalAsianCallPayoff = 0;
  let totalAsianPutPayoff = 0;

  for (let i = 0; i < numPaths; i++) {
    const prices = [p.S0];
    let currentPrice = p.S0;
    let sumPrices = p.S0;
    
    for (let step = 1; step <= steps; step++) {
      const z = randomNormal();
      currentPrice = currentPrice * Math.exp(drift + vol * z);
      prices.push(currentPrice);
      sumPrices += currentPrice;
    }
    
    const terminalPrice = currentPrice;
    const averagePrice = sumPrices / (steps + 1);
    
    paths.push({
      prices,
      terminalPrice,
      averagePrice
    });
    
    totalEuropeanCallPayoff += Math.max(0, terminalPrice - p.K);
    totalEuropeanPutPayoff += Math.max(0, p.K - terminalPrice);
    totalAsianCallPayoff += Math.max(0, averagePrice - p.K);
    totalAsianPutPayoff += Math.max(0, p.K - averagePrice);
  }
  
  return {
    paths,
    europeanCallPrice: df * (totalEuropeanCallPayoff / numPaths),
    europeanPutPrice: df * (totalEuropeanPutPayoff / numPaths),
    asianCallPrice: df * (totalAsianCallPayoff / numPaths),
    asianPutPrice: df * (totalAsianPutPayoff / numPaths)
  };
}
