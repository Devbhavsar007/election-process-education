import jwt from 'jsonwebtoken';

// Mock the environment
process.env.JWT_SECRET = 'test-secret-for-unit-tests';

// Inline import to avoid ESM issues in testing
const { authenticate, generateToken } = await import('../middleware/auth.js');

// Simple test runner
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}: ${err.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

console.log('\n🧪 Auth Middleware Tests\n');

// Test: generateToken creates a valid JWT
test('generateToken creates a valid JWT', () => {
  const token = generateToken('user123');
  assert(typeof token === 'string', 'Token should be a string');
  const decoded = jwt.verify(token, 'test-secret-for-unit-tests');
  assert(decoded.userId === 'user123', 'Token should contain userId');
});

// Test: authenticate rejects missing token
test('authenticate rejects request with no token', () => {
  const req = { headers: {} };
  const res = {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; }
  };
  authenticate(req, res, () => {});
  assert(res.statusCode === 401, 'Should return 401');
  assert(res.body.error === 'No token provided', 'Should say no token');
});

// Test: authenticate rejects invalid token
test('authenticate rejects invalid token', () => {
  const req = { headers: { authorization: 'Bearer invalid.token.here' } };
  const res = {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; }
  };
  authenticate(req, res, () => {});
  assert(res.statusCode === 401, 'Should return 401');
  assert(res.body.error === 'Invalid or expired token', 'Should say invalid token');
});

// Test: authenticate passes with valid token
test('authenticate passes valid token to next()', () => {
  const token = generateToken('user456');
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = {
    statusCode: null,
    status(code) { this.statusCode = code; return this; },
    json() {}
  };
  let nextCalled = false;
  authenticate(req, res, () => { nextCalled = true; });
  assert(nextCalled === true, 'next() should be called');
  assert(req.userId === 'user456', 'req.userId should be set');
});

// Test: authenticate rejects malformed Authorization header
test('authenticate rejects non-Bearer token', () => {
  const req = { headers: { authorization: 'Basic abc123' } };
  const res = {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; }
  };
  authenticate(req, res, () => {});
  assert(res.statusCode === 401, 'Should return 401');
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
