// CodeRadar Universal API Client
// Transparently handles live Express backend calls AND provides seamless client-side execution for GitHub Pages / static hosting!

export const DEMO_REPOSITORY = {
  id: "pulsecart-core",
  name: "pulsecart/platform-core",
  branch: "main",
  commit: "8f2a1b9",
  language: "JavaScript / React / Node.js",
  description: "Modern e-commerce checkout and authentication microservice",
  files: [
    {
      path: "package.json",
      content: `{
  "name": "pulsecart-core",
  "version": "1.4.2",
  "private": true,
  "description": "PulseCart core platform and payment processing services",
  "main": "src/routes/api.js",
  "scripts": {
    "start": "node src/routes/api.js",
    "dev": "nodemon src/routes/api.js",
    "test": "jest --coverage",
    "lint": "eslint src/"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "firebase": "^10.7.1",
    "jsonwebtoken": "^9.0.2",
    "lodash": "^4.17.21",
    "moment": "^2.30.1",
    "stripe": "^14.10.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    "nodemon": "^3.0.2",
    "supertest": "^6.3.3"
  }
}`
    },
    {
      path: ".gitignore",
      content: `node_modules/
dist/
build/
.DS_Store
coverage/
*.log
npm-debug.log*`
    },
    {
      path: "src/config/firebase.js",
      content: `// Firebase client configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// WARNING: Hardcoded credentials detected
const firebaseConfig = {
  apiKey: "AIzaSyB391XqZ94FakeHackathonKeyDemoVal",
  authDomain: "pulsecart-prod.firebaseapp.com",
  projectId: "pulsecart-prod",
  storageBucket: "pulsecart-prod.appspot.com",
  messagingSenderId: "89201948201",
  appId: "1:89201948201:web:38b1f20ac89e1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;`
    },
    {
      path: "src/services/authService.js",
      content: `import axios from 'axios';
import { auth } from '../config/firebase.js';

export async function loginUser(email, password) {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_profile', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (err) {
    console.log("Error occurred");
    return null;
  }
}

export async function refreshSessionToken() {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  const res = await axios.post('/api/auth/refresh', { token });
  return res.data;
}`
    },
    {
      path: "src/services/paymentService.js",
      content: `import Stripe from 'stripe';
import { calculateOrderTaxes } from './orderService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback_dummy');

export async function processPaymentTransaction(orderId, customer, amount, currency, discountCode, metadata) {
  if (!amount || amount <= 0) {
    throw new Error('Invalid transaction amount');
  }

  if (customer) {
    if (customer.billingAddress) {
      if (customer.billingAddress.country === 'US') {
        if (customer.billingAddress.state === 'CA' || customer.billingAddress.state === 'NY') {
          const taxRate = customer.billingAddress.state === 'CA' ? 0.0825 : 0.08875;
          const taxAmount = amount * taxRate;
          amount += taxAmount;
        }
      }
    }
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency || 'usd',
      customer: customer ? customer.stripeId : undefined,
      metadata: { orderId, ...metadata }
    });

    return { success: true, transactionId: paymentIntent.id, status: paymentIntent.status };
  } catch (stripeError) {
    return { success: false, error: stripeError.message };
  }
}`
    },
    {
      path: "src/services/orderService.js",
      content: `import { processPaymentTransaction } from './paymentService.js';
import { getCurrentUser } from './authService.js';

export function calculateOrderTaxes(subtotal, state) {
  if (state === 'CA') return subtotal * 0.0825;
  if (state === 'NY') return subtotal * 0.08875;
  return subtotal * 0.05;
}

export async function placeOrder(cartItems, shippingDetails, paymentDetails) {
  const user = getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxes = calculateOrderTaxes(subtotal, shippingDetails.state);
  const total = subtotal + taxes;

  const paymentResult = await processPaymentTransaction(
    'ORD-' + Date.now(),
    { ...user, billingAddress: shippingDetails },
    total,
    'usd',
    paymentDetails.discountCode,
    { cartCount: cartItems.length }
  );

  return { orderId: 'ORD-' + Math.floor(Math.random() * 1000000), total, payment: paymentResult };
}`
    },
    {
      path: "src/components/auth/Login.jsx",
      content: `import React, { useState } from 'react';
import { loginUser } from '../../services/authService.js';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await loginUser(email, password);
    setLoading(false);
    if (result && result.token) {
      onLoginSuccess(result.user);
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="login-card">
      <h2>Sign in to PulseCart</h2>
      {error && <div className="error-banner">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Authenticating...' : 'Sign In'}</button>
      </form>
    </div>
  );
}`
    },
    {
      path: "src/components/checkout/CheckoutModal.jsx",
      content: `import React, { useState } from 'react';
import { placeOrder } from '../../services/orderService.js';

export default function CheckoutModal({ cart, onClose, onOrderPlaced }) {
  const [shipping, setShipping] = useState({ street: '', state: 'CA', country: 'US' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const order = await placeOrder(cart.items, shipping, {});
      onOrderPlaced(order);
    } catch (err) {
      alert("Checkout failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Complete Your Order</h3>
        <button onClick={handleCheckout} disabled={isSubmitting}>Confirm Order</button>
      </div>
    </div>
  );
}`
    },
    {
      path: "src/utils/formatters.js",
      content: `import moment from 'moment';

export function formatPriceUSD(amount) {
  if (typeof amount !== 'number') return '$0.00';
  return '$' + amount.toFixed(2).replace(/\\d(?=(\\d{3})+\\.)/g, '$&,');
}

export function formatCurrency(amount, currencySymbol = '$') {
  if (typeof amount !== 'number') return currencySymbol + '0.00';
  return currencySymbol + amount.toFixed(2).replace(/\\d(?=(\\d{3})+\\.)/g, '$&,');
}

export function formatOrderDate(dateString) {
  return moment(dateString).format('MMMM Do YYYY, h:mm a');
}`
    },
    {
      path: "src/routes/api.js",
      content: `import express from 'express';
import { loginUser } from '../services/authService.js';
import { placeOrder } from '../services/orderService.js';

const app = express();
app.use(express.json());

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@pulsecart.io' && password === 'admin123') {
    return res.json({ token: 'jwt-mock-demo-token-xyz987', user: { id: 101, email, name: 'Lead Merchant', role: 'admin' } });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

export default app;`
    },
    {
      path: "tests/auth.test.js",
      content: `import { loginUser } from '../src/services/authService.js';

describe('Auth Service Suite', () => {
  test('returns user token on valid credentials', async () => {
    expect(true).toBe(true);
  });
  test('returns null when server rejects credentials', async () => {
    expect(true).toBe(true);
  });
});`
    },
    {
      path: "README.md",
      content: `# PulseCart Core
PulseCart is an e-commerce platform microservice providing checkout, order processing, and merchant authentication.`
    }
  ]
};

// Base report data for instant static preview
export function getBaseReport(resolvedIds = []) {
  const isKeyFixed = resolvedIds.includes('sec-key-src/config/firebase.js-7');
  const isEnvFixed = resolvedIds.includes('sec-env-gitignore');
  const isErrorFixed = resolvedIds.includes('bug-swallowed-error-src/services/authService.js-23');

  let secScore = 70 + (isKeyFixed ? 18 : 0) + (isEnvFixed ? 12 : 0);
  let bugScore = 78 + (isErrorFixed ? 12 : 0);
  let qualityScore = 74;
  let testScore = 43;
  let depScore = 84;
  let archScore = 72;
  let docScore = 80;

  const overallScore = Math.round(
    secScore * 0.25 +
    bugScore * 0.20 +
    testScore * 0.15 +
    archScore * 0.15 +
    qualityScore * 0.15 +
    depScore * 0.10
  );

  const allFindings = [
    {
      id: "sec-key-src/config/firebase.js-7",
      category: "security",
      severity: "critical",
      title: "Potential hardcoded API credential detected",
      file: "src/config/firebase.js",
      line: 7,
      codeSnippet: 'apiKey: "AIzaSy************",',
      description: "A credential-like key pattern matching Google/Firebase was identified on line 7: AIzaSy************",
      whyItMatters: "Hardcoded API keys committed to a repository can be accidentally leaked, scraped by bots, or abused for unauthorized resource access.",
      suggestedFix: "Move the credential to an environment variable (e.g. process.env.FIREBASE_API_KEY) and load it securely at runtime.",
      verification: "Ensure no raw keys exist in source code and secrets are provided via runtime environment variables."
    },
    {
      id: "sec-env-gitignore",
      category: "security",
      severity: "high",
      title: "Environment configuration file (.env) not ignored in .gitignore",
      file: ".gitignore",
      line: 1,
      codeSnippet: "node_modules/\ndist/\nbuild/",
      description: "The repository's .gitignore does not explicitly exclude .env files. Developers might accidentally commit local environment secrets to version control.",
      whyItMatters: "Exposing .env files in Git commits is a leading vector for credential leaks in software development.",
      suggestedFix: "Add .env and .env.* to .gitignore.",
      verification: "Verify with git status --ignored that .env files are ignored."
    },
    {
      id: "bug-swallowed-error-src/services/authService.js-23",
      category: "bugs",
      severity: "high",
      title: "Swallowed or poorly handled exception in service layer",
      file: "src/services/authService.js",
      line: 23,
      codeSnippet: "} catch (err) {\n  console.log(\"Error occurred\");\n  return null;\n}",
      description: "An exception is caught with generic console logging without error propagation, structured diagnostics, or user feedback.",
      whyItMatters: "Silent or swallowed errors make production outages notoriously hard to diagnose and can leave calling UI components in unhandled loading states.",
      suggestedFix: "Log the actual error details, throw a typed domain error, or return a structured { error, message } payload.",
      verification: "Simulate an API failure and verify that descriptive error details are surfaced to monitoring and user interface."
    },
    {
      id: "arch-circular-payment-order",
      category: "architecture",
      severity: "high",
      title: "Tangled circular dependency between Payment and Order services",
      file: "src/services/paymentService.js",
      line: 2,
      codeSnippet: "paymentService.js imports calculateOrderTaxes from orderService.js\norderService.js imports processPaymentTransaction from paymentService.js",
      description: "paymentService.js and orderService.js import each other directly, forming a cyclic module dependency.",
      whyItMatters: "Circular dependencies introduce initialization ordering hazards, complicate unit testing in isolation, and violate single-responsibility boundaries.",
      suggestedFix: "Extract tax calculation into a dedicated taxService.js module that both services can safely depend upon.",
      verification: "Ensure neither service imports the other directly; confirm all dependency graphs remain acyclic."
    },
    {
      id: "test-auth-edge-cases",
      category: "testing",
      severity: "medium",
      title: "Critical authentication failure paths and timeouts lack test coverage",
      file: "tests/auth.test.js",
      line: 12,
      codeSnippet: "// MISSING TESTS:\n// - empty email or empty password\n// - network timeout or ECONNREFUSED",
      description: "The authentication test suite validates sunny-day paths but completely lacks assertions for network timeouts, empty credentials, and token expiry.",
      whyItMatters: "Edge case test gaps leave frontend error-boundary states and retry policies untested against real network degradation.",
      suggestedFix: "Add test cases for: 1) empty email/password submission, 2) network timeout handling, 3) 401 response handling.",
      verification: "Run npm test and assert coverage includes all negative and exception branches in authService."
    },
    {
      id: "dep-moment-legacy",
      category: "dependencies",
      severity: "medium",
      title: "Heavy legacy date formatting library (moment.js) in production bundle",
      file: "package.json",
      line: 18,
      codeSnippet: '"moment": "^2.30.1"',
      description: "moment.js is included in dependencies. Moment is in maintenance mode and adds ~290kB of bundle weight due to unshakeable locale data.",
      whyItMatters: "Moment bloats client-side JavaScript bundles, hurting page load speed and Core Web Vitals.",
      suggestedFix: "Replace moment with lightweight alternatives like date-fns, dayjs, or native JavaScript Intl.DateTimeFormat.",
      verification: "Verify bundle size reduction in Vite production build."
    }
  ];

  const activeFindings = allFindings.filter(f => !resolvedIds.includes(f.id));

  return {
    repository: {
      name: "pulsecart/platform-core",
      branch: "main",
      commit: resolvedIds.length > 0 ? "9c3b4e1" : "8f2a1b9",
      scannedAt: new Date().toISOString(),
      language: "JavaScript / React / Node.js"
    },
    files: DEMO_REPOSITORY.files.map(f => ({ path: f.path, size: f.content.length })),
    fileContents: DEMO_REPOSITORY.files.reduce((acc, f) => { acc[f.path] = f.content; return acc; }, {}),
    healthScore: overallScore,
    statusText: overallScore >= 80 ? "Healthy" : overallScore >= 65 ? "Needs Attention" : "Critical Risks",
    statusColor: overallScore >= 80 ? "success" : overallScore >= 65 ? "warning" : "danger",
    categoryScores: {
      bugs: bugScore,
      security: secScore,
      quality: qualityScore,
      testing: testScore,
      dependencies: depScore,
      architecture: archScore,
      documentation: docScore
    },
    findings: activeFindings,
    metrics: {
      totalFiles: DEMO_REPOSITORY.files.length,
      totalLinesOfCode: 384,
      testFileCount: 1,
      findingsCount: activeFindings.length,
      criticalCount: activeFindings.filter(f => f.severity === 'critical').length,
      highCount: activeFindings.filter(f => f.severity === 'high').length,
      mediumCount: activeFindings.filter(f => f.severity === 'medium').length,
      lowCount: 0
    },
    architecture: {
      layers: [
        { id: "presentation", name: "Frontend UI", description: "React components and views", files: [{ path: "src/components/auth/Login.jsx" }, { path: "src/components/checkout/CheckoutModal.jsx" }] },
        { id: "services", name: "Business Services", description: "Domain logic and payments", files: [{ path: "src/services/authService.js" }, { path: "src/services/paymentService.js" }, { path: "src/services/orderService.js" }] },
        { id: "api", name: "API & Endpoints", description: "Express HTTP handlers", files: [{ path: "src/routes/api.js" }] },
        { id: "config", name: "Configuration & SDKs", description: "Firebase and Stripe drivers", files: [{ path: "src/config/firebase.js" }] },
        { id: "tests", name: "Testing & Quality Gates", description: "Jest specifications", files: [{ path: "tests/auth.test.js" }] }
      ],
      dependencyMap: {
        "src/services/authService.js": { path: "src/services/authService.js", layer: "Business Services", imports: ["npm:axios", "src/config/firebase.js"], importedBy: ["src/services/orderService.js", "src/components/auth/Login.jsx", "src/routes/api.js"] },
        "src/config/firebase.js": { path: "src/config/firebase.js", layer: "Configuration & SDKs", imports: ["npm:firebase/app"], importedBy: ["src/services/authService.js"] },
        "src/services/paymentService.js": { path: "src/services/paymentService.js", layer: "Business Services", imports: ["npm:stripe", "src/services/orderService.js"], importedBy: ["src/services/orderService.js"] },
        "src/services/orderService.js": { path: "src/services/orderService.js", layer: "Business Services", imports: ["src/services/paymentService.js", "src/services/authService.js"], importedBy: ["src/components/checkout/CheckoutModal.jsx", "src/routes/api.js"] }
      }
    },
    dependencies: {
      packageManager: "npm",
      packageName: "pulsecart-core",
      version: "1.4.2",
      totalDependencies: 10,
      totalDevDependencies: 4,
      dependencies: [
        { name: "axios", version: "^1.6.2", status: { risk: "low", tag: "Stable" } },
        { name: "firebase", version: "^10.7.1", status: { risk: "low", tag: "Standard" } },
        { name: "moment", version: "^2.30.1", status: { risk: "medium", tag: "Legacy Maintenance" } },
        { name: "stripe", version: "^14.10.0", status: { risk: "low", tag: "Payment Gateway" } }
      ],
      advisories: [
        { package: "moment", severity: "medium", issue: "Legacy architecture in maintenance mode (~290kB bundle size)", recommendation: "Migrate to date-fns, dayjs, or native Intl.DateTimeFormat." }
      ]
    },
    testing: {
      testFiles: ["tests/auth.test.js"],
      totalTestFiles: 1,
      testedCount: 2,
      missingCount: 7,
      coverageRate: 22,
      testMatrix: [
        {
          domain: "Authentication & Identity",
          scenarios: [
            { name: "Successful credentials submission", status: "tested", note: "Covered in tests/auth.test.js" },
            { name: "Invalid credentials rejection (401)", status: "tested", note: "Covered in tests/auth.test.js" },
            { name: "Empty email or password submission", status: "missing", note: "No client-side validation guard test" },
            { name: "Network disconnection / timeout failure", status: "missing", note: "authService exception handling untested" },
            { name: "Expired session token refresh", status: "missing", note: "refreshSessionToken() logic untested" }
          ]
        },
        {
          domain: "Checkout & Payments",
          scenarios: [
            { name: "Order tax calculation across US states", status: "missing", note: "calculateOrderTaxes() has branch logic for CA/NY without test coverage" },
            { name: "Stripe payment intent creation", status: "missing", note: "Mocking Stripe SDK payload missing" },
            { name: "Payment failure recovery & rollback", status: "missing", note: "Exception path returns error without rollback verification" }
          ]
        }
      ]
    }
  };
}
