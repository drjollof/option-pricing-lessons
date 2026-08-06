export function normCDF(x: number): number {
  // Approximation of standard normal CDF
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

export function normPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export interface BSResult {
  price: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
}

export function blackScholes(S: number, K: number, r: number, sigma: number, T: number, type: 'call' | 'put' = 'call'): BSResult {
  if (T <= 0) {
    const price = type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
    const delta = type === 'call' ? (S > K ? 1 : 0) : (S < K ? -1 : 0);
    return { price, delta, gamma: 0, vega: 0, theta: 0, rho: 0 };
  }

  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const Nd1 = normCDF(d1);
  const Nd2 = normCDF(d2);
  const N_minus_d1 = normCDF(-d1);
  const N_minus_d2 = normCDF(-d2);
  const pdf_d1 = normPDF(d1);

  let price = 0;
  let delta = 0;
  let theta = 0;
  let rho = 0;

  const gamma = pdf_d1 / (S * sigma * Math.sqrt(T));
  const vega = S * pdf_d1 * Math.sqrt(T);

  if (type === 'call') {
    price = S * Nd1 - K * Math.exp(-r * T) * Nd2;
    delta = Nd1;
    theta = -(S * pdf_d1 * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * Nd2;
    rho = K * T * Math.exp(-r * T) * Nd2;
  } else {
    price = K * Math.exp(-r * T) * N_minus_d2 - S * N_minus_d1;
    delta = Nd1 - 1;
    theta = -(S * pdf_d1 * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * N_minus_d2;
    rho = -K * T * Math.exp(-r * T) * N_minus_d2;
  }

  return { price, delta, gamma, vega, theta, rho };
}
