import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

// Vercel webhook secret for signature verification
const WEBHOOK_SECRET = process.env.VERCEL_WEBHOOK_SECRET || 'qRuMa9LuG4gCIvGMHzqctOCN'

// Verify webhook signature to ensure request authenticity
function verifySignature(payload: string, signature: string): boolean {
  if (!signature) return false
  
  // Remove 'sha1=' prefix if present
  const cleanSignature = signature.replace(/^sha1=/, '')
  
  // Generate expected signature
  const expectedSignature = createHmac('sha1', WEBHOOK_SECRET)
    .update(payload, 'utf8')
    .digest('hex')
  
  // Use timing-safe comparison to prevent timing attacks
  try {
    return timingSafeEqual(
      Buffer.from(cleanSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get('x-vercel-signature')
    
    // Verify webhook signature
    if (!verifySignature(rawBody, signature || '')) {
      console.error('🚫 Webhook signature verification failed:', {
        timestamp: new Date().toISOString(),
        hasSignature: !!signature,
        signaturePreview: signature ? signature.substring(0, 20) + '...' : 'none'
      })
      
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          message: 'Invalid webhook signature',
          ubuntu: '🔐 Security protocols active - Ubuntu protects the collective'
        }, 
        { status: 401 }
      )
    }
    
    console.log('✅ Webhook signature verified successfully')
    
    // Parse the verified body
    const body = JSON.parse(rawBody)
    
    console.log("📡 Vercel Webhook Received:", {
      timestamp: new Date().toISOString(),
      headers: Object.fromEntries(request.headers.entries()),
      body: body
    })

    // Webhook payload examples from Vercel:
    // - Deployment created
    // - Deployment ready  
    // - Deployment error
    // - Domain configuration changes

    const { type, payload } = body

    switch (type) {
      case 'deployment.created':
        console.log('🚀 New deployment started:', payload?.deployment?.url)
        break
        
      case 'deployment.ready':
        console.log('✅ Deployment ready:', payload?.deployment?.url)
        // Here you could:
        // - Update Supabase with deployment status
        // - Send Slack notification
        // - Trigger additional CI/CD processes
        // - Update monitoring dashboards
        break
        
      case 'deployment.error':
        console.log('❌ Deployment failed:', payload?.deployment?.url)
        // Here you could:
        // - Log error to Supabase
        // - Send alert notifications
        // - Trigger rollback procedures
        break
        
      case 'domain.created':
        console.log('🌍 Domain added:', payload?.domain?.name)
        break
        
      default:
        console.log('📦 Unknown webhook type:', type)
    }

    // Optional: Forward to Supabase for logging
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createAdminClient } = await import('@/lib/supabase')
        const supabase = createAdminClient()
        
        // Log webhook to database (you'd need to create a webhooks table)
        await supabase.from('webhooks').insert({
          type: type,
          payload: body,
          received_at: new Date().toISOString(),
          source: 'vercel'
        })
      } catch (supabaseError) {
        console.warn('Failed to log webhook to Supabase:', supabaseError)
      }
    }

    return NextResponse.json({ 
      ok: true, 
      message: '🎼 Webhook processed with Ubuntu excellence',
      timestamp: new Date().toISOString(),
      ubuntu: 'I am because we are - collective deployment success!'
    })

  } catch (error) {
    console.error('🚨 Webhook processing error:', error)
    
    return NextResponse.json({ 
      error: 'Failed to process webhook',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Optional: Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: '🎼 Dante Voice Chip Webhook Endpoint',
    status: 'active',
    ubuntu: 'Ubuntu philosophy: "I am because we are"',
    endpoints: {
      POST: 'Process Vercel webhooks',
      GET: 'Webhook status check'
    },
    timestamp: new Date().toISOString()
  })
}