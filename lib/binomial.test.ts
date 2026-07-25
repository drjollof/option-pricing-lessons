import { describe, it, expect } from 'vitest';
import { buildStockTree, riskNeutralP, priceEuropeanOption } from './binomial';

describe('Binomial Math Engine', () => {
  const defaultParams = { S0: 100, K: 100, u: 1.15, d: 0.85, r: 0.05, T: 1, N: 3 };

  it('builds stock tree correctly', () => {
    const tree = buildStockTree(defaultParams);
    expect(tree.length).toBe(4); // N=3 means 4 layers (0, 1, 2, 3)
    
    // Layer 0
    expect(tree[0][0]).toBeCloseTo(100);
    
    // Layer 1
    expect(tree[1][0]).toBeCloseTo(85);
    expect(tree[1][1]).toBeCloseTo(115);
    
    // Layer 2
    expect(tree[2][0]).toBeCloseTo(72.25);
    expect(tree[2][1]).toBeCloseTo(97.75); // 100 * 1.15 * 0.85
    expect(tree[2][2]).toBeCloseTo(132.25);
  });

  it('calculates risk-neutral probability', () => {
    const q = riskNeutralP(defaultParams);
    // dt = 1/3
    // R = exp(0.05 * 1/3) = exp(0.016666...) ~= 1.0168
    // q = (1.0168 - 0.85) / (1.15 - 0.85) = 0.1668 / 0.30 ~= 0.556
    expect(q).toBeGreaterThan(0.55);
    expect(q).toBeLessThan(0.56);
  });

  it('prices a european call option', () => {
    const { price, optionTree } = priceEuropeanOption(defaultParams, 'call');
    expect(price).toBeGreaterThan(0);
    // Terminal up node
    expect(optionTree[3][3]).toBeCloseTo(Math.max(0, 100 * Math.pow(1.15, 3) - 100));
  });

  it('prices a european put option', () => {
    const { price, optionTree } = priceEuropeanOption(defaultParams, 'put');
    expect(price).toBeGreaterThan(0);
    // Terminal down node
    expect(optionTree[3][0]).toBeCloseTo(Math.max(0, 100 - 100 * Math.pow(0.85, 3)));
  });
});
