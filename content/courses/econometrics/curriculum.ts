import { Course } from '../../types';

// We will statically import all lessons to ensure Next.js can bundle them easily.
import { lesson1 } from './lessons/lesson-1';
import { lesson2 } from './lessons/lesson-2';
import { lesson3 } from './lessons/lesson-3';
import { lesson4 } from './lessons/lesson-4';
import { lesson5 } from './lessons/lesson-5';
import { lesson6 } from './lessons/lesson-6';
import { lesson7 } from './lessons/lesson-7';
import { lesson8 } from './lessons/lesson-8';
import { lesson9 } from './lessons/lesson-9';
import { lesson10 } from './lessons/lesson-10';
import { lesson11 } from './lessons/lesson-11';
import { lesson12 } from './lessons/lesson-12';
import { lesson13 } from './lessons/lesson-13';
import { lesson14 } from './lessons/lesson-14';
import { lesson15 } from './lessons/lesson-15';
import { lesson16 } from './lessons/lesson-16';
import { lesson17 } from './lessons/lesson-17';
import { lesson18 } from './lessons/lesson-18';
import { lesson19 } from './lessons/lesson-19';
import { lesson20 } from './lessons/lesson-20';
import { lesson21 } from './lessons/lesson-21';
import { lesson22 } from './lessons/lesson-22';
import { lesson23 } from './lessons/lesson-23';
import { lesson24 } from './lessons/lesson-24';
import { lesson25 } from './lessons/lesson-25';
import { lesson26 } from './lessons/lesson-26';
import { lesson27 } from './lessons/lesson-27';
import { lesson28 } from './lessons/lesson-28';
import { lesson29 } from './lessons/lesson-29';

export const lessonsList = [
  lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8,
  lesson9, lesson10, lesson11, lesson12, lesson13, lesson14, lesson15, lesson16,
  lesson17, lesson18, lesson19, lesson20, lesson21, lesson22, lesson23, lesson24,
  lesson25, lesson26, lesson27, lesson28, lesson29
];

export const courseCurriculum: Course = {
  id: 'econometrics',
  title: 'Financial Econometrics',
  description: 'Master time series analysis, regression models, volatility modeling, and multivariate econometrics using Python.',
  modules: [
    {
      id: 'module-1',
      title: 'Regression Analysis & Dimension Reduction',
      lessons: [
        { id: 'lesson-1', title: 'Linear Regression Analysis', description: 'OLS, p-values, and Cook\'s distance.' },
        { id: 'lesson-2', title: 'Correlation and Multicollinearity', description: 'Covariance, correlation, and VIF.' },
        { id: 'lesson-3', title: 'Principal Component Analysis', description: 'PCA, eigenvalues, and Box-Cox transformation.' },
        { id: 'lesson-4', title: 'Monte Carlo Simulation', description: 'Stochastic models, LLN, and CLT.' },
        { id: 'lesson-5', title: 'OLS Assumptions & WLS', description: 'Heteroskedasticity and Weighted Least Squares.' },
        { id: 'lesson-6', title: 'Robust Regression', description: 'M-estimation, Huber, and Tukey Biweight norms.' },
        { id: 'lesson-7', title: 'Penalized Regression', description: 'Ridge regression, Lasso, and Cross Validation.' },
        { id: 'lesson-8', title: 'Non-Parametric Regression', description: 'LOESS, kernel functions, and local averaging.' }
      ]
    },
    {
      id: 'module-2',
      title: 'Probability Distributions & Copulas',
      lessons: [
        { id: 'lesson-9', title: 'Random Variables and Distributions', description: 'Discrete/continuous variables, PDFs, and normal distribution.' },
        { id: 'lesson-10', title: 'Skew Normal and Skew-t Distribution', description: 'Skewness, kurtosis, and tail heaviness.' },
        { id: 'lesson-11', title: 'Correlation Metrics', description: 'Pearson, Spearman, and Kendall tau.' },
        { id: 'lesson-12', title: 'Joint Probability and Copula', description: 'Sklar\'s theorem, Archimedean, and elliptical copulas.' }
      ]
    },
    {
      id: 'module-3',
      title: 'Time Series Analysis & Forecasting',
      lessons: [
        { id: 'lesson-13', title: 'Time Series and Autocorrelation', description: 'Trends, seasonality, ACF, and PACF.' },
        { id: 'lesson-14', title: 'Time Series Statistical Models', description: 'White noise, random walk, and Moving Average (MA).' },
        { id: 'lesson-15', title: 'Autoregressive Model', description: 'AR models, stationarity, and MLE.' },
        { id: 'lesson-16', title: 'ARIMA Model', description: 'ARMA, ARIMA, AIC/BIC, and the Box-Jenkins method.' }
      ]
    },
    {
      id: 'module-4',
      title: 'Volatility Modeling & Bayesian Methods',
      lessons: [
        { id: 'lesson-17', title: 'ARCH Model', description: 'Volatility clustering and conditional variance.' },
        { id: 'lesson-18', title: 'GARCH Model', description: 'GARCH(1,1) model and diagnostic tests.' },
        { id: 'lesson-19', title: 'Bayesian Estimation for GARCH', description: 'Priors, likelihoods, and MCMC sampling.' },
        { id: 'lesson-20', title: 'State Space Model Construct', description: 'Kalman Filter and GARCH integration.' },
        { id: 'lesson-21', title: 'Bayesian Updating', description: 'Conjugate priors and the Kalman Smoother.' }
      ]
    },
    {
      id: 'module-5',
      title: 'Advanced Multivariate Models & Network Theory',
      lessons: [
        { id: 'lesson-22', title: 'Unit Root Tests', description: 'Stationarity, Dickey-Fuller, and KPSS tests.' },
        { id: 'lesson-23', title: 'Ergodicity and VAR', description: 'Vector Autoregressive models.' },
        { id: 'lesson-24', title: 'Cointegration and ECM', description: 'Engle-Granger procedure and mean reversion.' },
        { id: 'lesson-25', title: 'VECM and Johansen Test', description: 'Vector Error Correction Model and matrix rank.' },
        { id: 'lesson-26', title: 'Factor Analysis', description: 'Measurement errors and latent variables.' },
        { id: 'lesson-27', title: 'Network Theory', description: 'Graph theory, adjacency matrices, and Graphical LASSO.' },
        { id: 'lesson-28', title: 'Granger Causality', description: 'Causal relationships and F-tests.' },
        { id: 'lesson-29', title: 'Supervised & Unsupervised Learning', description: 'LDA, K-Means, and Hierarchical clustering.' }
      ]
    }
  ]
};
