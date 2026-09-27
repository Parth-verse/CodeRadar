// Built-in realistic multi-file repository with intentional detectable issues
// for instant 1-click hackathon evaluation and demonstration.

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
npm-debug.log*
`
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
export default app;
`
    },
    {
      path: "src/services/authService.js",
      content: `import axios from 'axios';
import { auth } from '../config/firebase.js';

/**
 * Authentication service handling customer authentication and tokens
 */
export async function loginUser(email, password) {
  // Potential reliability problem: missing input sanity validation and generic catch without logging
  try {
    const response = await axios.post('/api/auth/login', {
      email,
      password
    });
    
    // Storing unverified payload into localStorage
    if (response.data && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_profile', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (err) {
    // Missing structured error handling or error code classification
    console.log("Error occurred");
    return null;
  }
}

export async function refreshSessionToken() {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  // Unhandled network timeout or expired refresh token
  const res = await axios.post('/api/auth/refresh', { token });
  return res.data;
}

export function getCurrentUser() {
  const profile = localStorage.getItem('user_profile');
  try {
    return JSON.parse(profile);
  } catch (e) {
    return null;
  }
}
`
    },
    {
      path: "src/services/paymentService.js",
      content: `import Stripe from 'stripe';
import { calculateOrderTaxes } from './orderService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback_dummy');

/**
 * Complex payment processing function with deep nesting and multiple responsibilities
 */
export async function processPaymentTransaction(orderId, customer, amount, currency, discountCode, metadata) {
  if (!amount || amount <= 0) {
    throw new Error('Invalid transaction amount');
  }

  // Deeply nested control flow with mixed tax calculation and payment gateway dispatch
  if (customer) {
    if (customer.billingAddress) {
      if (customer.billingAddress.country === 'US') {
        if (customer.billingAddress.state === 'CA' || customer.billingAddress.state === 'NY') {
          const taxRate = customer.billingAddress.state === 'CA' ? 0.0825 : 0.08875;
          const taxAmount = amount * taxRate;
          amount += taxAmount;
          
          if (discountCode) {
            if (discountCode === 'WELCOME10') {
              amount = amount * 0.90;
            } else if (discountCode === 'VIP20') {
              if (customer.isVip) {
                amount = amount * 0.80;
              }
            }
          }
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

    return {
      success: true,
      transactionId: paymentIntent.id,
      status: paymentIntent.status
    };
  } catch (stripeError) {
    // Missing rollback mechanism or alert dispatching
    return {
      success: false,
      error: stripeError.message
    };
  }
}
`
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
  if (!user) {
    throw new Error('Unauthorized');
  }

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

  return {
    orderId: 'ORD-' + Math.floor(Math.random() * 1000000),
    total,
    payment: paymentResult
  };
}
`
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
        <input 
          type="email" 
          placeholder="Email address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
`
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
        <p>Total Items: {cart.items?.length || 0}</p>
        <button onClick={handleCheckout} disabled={isSubmitting}>
          {isSubmitting ? 'Processing Payment...' : 'Confirm Order'}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
`
    },
    {
      path: "src/utils/formatters.js",
      content: `// Utility formatting functions with duplicated logic
import moment from 'moment';

export function formatPriceUSD(amount) {
  if (typeof amount !== 'number') return '$0.00';
  return '$' + amount.toFixed(2).replace(/\\d(?=(\\d{3})+\\.)/g, '$&,');
}

// Duplicated currency logic that could be consolidated
export function formatCurrency(amount, currencySymbol = '$') {
  if (typeof amount !== 'number') return currencySymbol + '0.00';
  return currencySymbol + amount.toFixed(2).replace(/\\d(?=(\\d{3})+\\.)/g, '$&,');
}

export function formatOrderDate(dateString) {
  // Using heavy moment.js library for simple date formatting
  return moment(dateString).format('MMMM Do YYYY, h:mm a');
}
`
    },
    {
      path: "src/routes/api.js",
      content: `import express from 'express';
import { loginUser } from '../services/authService.js';
import { placeOrder } from '../services/orderService.js';

const app = express();
app.use(express.json());

// Public login endpoint - Missing rate limiting protection
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@pulsecart.io' && password === 'admin123') {
    return res.json({
      token: 'jwt-mock-demo-token-xyz987',
      user: { id: 101, email, name: 'Lead Merchant', role: 'admin' }
    });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/orders/checkout', async (req, res) => {
  const { items, shipping, payment } = req.body;
  try {
    const order = await placeOrder(items, shipping, payment);
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default app;
`
    },
    {
      path: "tests/auth.test.js",
      content: `// Limited unit test suite with significant edge case gaps
import { loginUser } from '../src/services/authService.js';

describe('Auth Service Suite', () => {
  test('returns user token on valid credentials', async () => {
    // Basic sunny-day scenario
    expect(true).toBe(true);
  });

  test('returns null when server rejects credentials', async () => {
    // Unhappy-path 401 scenario
    expect(true).toBe(true);
  });

  // MISSING TESTS:
  // - empty email or empty password
  // - network timeout or ECONNREFUSED
  // - malformed JWT payload returned from API
  // - token refresh expiration
  // - local storage quota exceeded
});
`
    },
    {
      path: "README.md",
      content: `# PulseCart Core

PulseCart is an e-commerce platform microservice providing checkout, order processing, and merchant authentication.

## Architecture
- \`src/config\`: Firebase & 3rd party SDK configurations
- \`src/services\`: Business logic (Payment, Orders, Auth)
- \`src/components\`: UI components
- \`src/routes\`: Express API endpoints
- \`tests\`: Jest unit tests
`
    }
  ]
};
