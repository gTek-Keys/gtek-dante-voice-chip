# 🔐 Vercel Webhook Setup Guide

## Your Secured Webhook is Ready!

### 📡 **Webhook Endpoint:**
```
https://frontend-br103aw70-g-tek-industries.vercel.app/api/webhooks/vercel
```
*(This will be updated to `https://gtek.world/api/webhooks/vercel` once domain is configured)*

### 🔑 **Security Details:**
- **Secret:** `qRuMa9LuG4gCIvGMHzqctOCN`
- **Algorithm:** HMAC SHA-1
- **Header:** `x-vercel-signature`
- **Format:** `sha1=<hex_digest>`

---

## 🛠️ **How to Configure in Vercel Dashboard:**

### **Step 1: Access Webhook Settings**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project: **g-tek-industries/frontend**
3. Go to **Settings** → **Git** → **Deploy Hooks**

### **Step 2: Add Webhook**
1. Click **"Create Hook"**
2. **Hook URL:** `https://frontend-br103aw70-g-tek-industries.vercel.app/api/webhooks/vercel`
3. **Events to trigger:** Select all relevant events:
   - ✅ Deployment Started
   - ✅ Deployment Succeeded  
   - ✅ Deployment Failed
   - ✅ Domain Added/Modified

### **Step 3: Configure Secret (Important!)**
1. In webhook settings, find **"Secret"** field
2. Enter: `qRuMa9LuG4gCIvGMHzqctOCN`
3. This enables signature verification for security

---

## 🧪 **Testing Your Webhook:**

### **Manual Test (GET request):**
```bash
curl https://frontend-br103aw70-g-tek-industries.vercel.app/api/webhooks/vercel
```

### **Simulated Webhook (POST with signature):**
```bash
# Generate test signature
PAYLOAD='{"type":"deployment.ready","payload":{"deployment":{"url":"test"}}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha1 -hmac "qRuMa9LuG4gCIvGMHzqctOCN" | cut -d' ' -f2)

# Send test webhook
curl -X POST https://frontend-br103aw70-g-tek-industries.vercel.app/api/webhooks/vercel \
  -H "Content-Type: application/json" \
  -H "x-vercel-signature: sha1=$SIGNATURE" \
  -d "$PAYLOAD"
```

---

## 🔍 **Security Features Implemented:**

### ✅ **Signature Verification:**
- Every webhook request is validated using HMAC SHA-1
- Invalid signatures are rejected with 401 Unauthorized
- Timing-safe comparison prevents timing attacks

### ✅ **Request Logging:**
- All webhook events are logged with timestamps
- Failed verification attempts are logged for monitoring
- Optional Supabase integration for persistent logging

### ✅ **Ubuntu-Themed Responses:**
- Security messages include Ubuntu philosophy
- Consistent error handling and response formatting

---

## 📊 **Webhook Events Handled:**

| Event Type | Description | Action |
|------------|-------------|---------|
| `deployment.created` | New deployment started | Log deployment start |
| `deployment.ready` | Deployment completed successfully | Log success, optional notifications |
| `deployment.error` | Deployment failed | Log error, alert systems |
| `domain.created` | Domain added/modified | Log domain changes |

---

## 🚀 **Next Steps:**

1. **Configure webhook in Vercel Dashboard** (see steps above)
2. **Fix domain routing** to use `gtek.world`
3. **Test webhook functionality** with real deployments
4. **Optional:** Add Slack/Discord notifications
5. **Optional:** Set up monitoring dashboard

---

## 🎼 **Ubuntu Philosophy Integration:**

*"I am because we are"* - Your webhook embodies collective security, protecting the entire deployment ecosystem through verified, authenticated communications.

Every secured webhook request strengthens the community of your applications and deployments! 🌍✨