#!/usr/bin/env node

/**
 * Test script for Vercel webhook signature verification
 * This demonstrates how the webhook signature system works
 */

import { createHmac, timingSafeEqual } from 'crypto';

const WEBHOOK_SECRET = 'qRuMa9LuG4gCIvGMHzqctOCN';

// Sample webhook payload
const payload = JSON.stringify({
  type: 'deployment.ready',
  payload: {
    deployment: {
      url: 'test-deployment-12345.vercel.app',
      state: 'READY'
    }
  }
});

// Generate signature that Vercel would send
function generateSignature(payload, secret) {
  return 'sha1=' + createHmac('sha1', secret)
    .update(payload, 'utf8')
    .digest('hex');
}

// Verify signature (same function as in webhook)
function verifySignature(payload, signature) {
  if (!signature) return false;
  
  const cleanSignature = signature.replace(/^sha1=/, '');
  const expectedSignature = createHmac('sha1', WEBHOOK_SECRET)
    .update(payload, 'utf8')
    .digest('hex');
  
  try {
    return timingSafeEqual(
      Buffer.from(cleanSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

console.log('🔐 Webhook Signature Test\n');

// Test 1: Valid signature
const validSignature = generateSignature(payload, WEBHOOK_SECRET);
console.log('✅ Test 1 - Valid Signature:');
console.log(`   Payload: ${payload.substring(0, 50)}...`);
console.log(`   Signature: ${validSignature}`);
console.log(`   Verification: ${verifySignature(payload, validSignature) ? 'PASS' : 'FAIL'}\n`);

// Test 2: Invalid signature
const invalidSignature = 'sha1=invalid_signature_123';
console.log('❌ Test 2 - Invalid Signature:');
console.log(`   Signature: ${invalidSignature}`);
console.log(`   Verification: ${verifySignature(payload, invalidSignature) ? 'PASS' : 'FAIL'}\n`);

// Test 3: Missing signature
console.log('⚠️  Test 3 - Missing Signature:');
console.log(`   Verification: ${verifySignature(payload, '') ? 'PASS' : 'FAIL'}\n`);

console.log('🎼 Ubuntu Philosophy: "I am because we are"');
console.log('   Your webhook is now secured with cryptographic verification!');