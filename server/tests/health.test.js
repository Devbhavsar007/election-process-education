// Health endpoint integration test
// Run with: node --experimental-vm-modules tests/health.test.js

import express from 'express';
import mongoose from 'mongoose';

// Create a mini app with just the health route
const app = express();
const { default: healthRoutes } = await import('../routes/health.js');
app.use('/api/health', healthRoutes);

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

console.log('\n🧪 Health Endpoint Tests\n');

// Simulate a request to /api/health
const server = app.listen(0, async () => {
  const port = server.address().port;
  try {
    const res = await fetch(`http://localhost:${port}/api/health`);
    const data = await res.json();

    test('returns 200 status', () => {
      assert(res.status === 200, `Expected 200, got ${res.status}`);
    });

    test('returns status: ok', () => {
      assert(data.status === 'ok', `Expected ok, got ${data.status}`);
    });

    test('returns uptime as number', () => {
      assert(typeof data.uptime === 'number', 'Uptime should be a number');
    });

    test('returns timestamp', () => {
      assert(data.timestamp, 'Should have timestamp');
      assert(!isNaN(new Date(data.timestamp).getTime()), 'Timestamp should be valid');
    });

    test('returns database status', () => {
      assert(data.database === 'disconnected' || data.database === 'connected', 'Database should be connected or disconnected');
    });

    test('returns AI configuration', () => {
      assert(data.ai, 'Should have AI section');
      assert(data.ai.mistral, 'Should have Mistral status');
      assert(data.ai.gemini, 'Should have Gemini status');
    });

    test('returns services configuration', () => {
      assert(data.services, 'Should have services section');
      assert(data.services.firebase, 'Should have Firebase status');
    });

  } catch (err) {
    console.log(`  ❌ Request failed: ${err.message}`);
    failed++;
  } finally {
    server.close();
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
    process.exit(failed > 0 ? 1 : 0);
  }
});
