#!/bin/bash
# Domain Connection Verification Script for gtek.world
# Run this script after updating DNS records

echo "🌍 Dante Voice Chip - Domain Connection Verifier"
echo "================================================="
echo ""

DOMAIN="gtek.world"
VERCEL_URL="dante-voice-chip-eps9n6tq8-g-tek-industries.vercel.app"

echo "🔍 Testing DNS Resolution..."
echo "----------------------------"

# Test DNS resolution
echo "Checking A record for $DOMAIN:"
dig +short A $DOMAIN || echo "❌ A record not found"

echo ""
echo "Checking CNAME record for $DOMAIN:"
dig +short CNAME $DOMAIN || echo "❌ CNAME record not found"

echo ""
echo "🌐 Testing HTTP Connectivity..."
echo "--------------------------------"

# Test HTTP response
echo "Testing HTTPS connection to $DOMAIN:"
if curl -s -I "https://$DOMAIN" | head -1; then
    echo "✅ HTTPS connection successful"
else
    echo "❌ HTTPS connection failed"
fi

echo ""
echo "📋 SSL Certificate Check..."
echo "----------------------------"

# Check SSL certificate
echo "SSL certificate info for $DOMAIN:"
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -subject -dates 2>/dev/null || echo "❌ SSL certificate check failed"

echo ""
echo "⚡ Quick Status Summary:"
echo "------------------------"
echo "Original Vercel URL: https://$VERCEL_URL"
echo "Custom Domain: https://$DOMAIN"
echo ""
echo "🎯 Next Steps:"
echo "1. If DNS tests fail, check your DNS provider settings"
echo "2. If SSL fails, wait 5-10 minutes for certificate provisioning"
echo "3. If all tests pass, your domain is ready!"