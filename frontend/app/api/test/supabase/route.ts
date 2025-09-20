import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if required environment variables are present
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const jwtSecret = process.env.SUPABASE_JWT_SECRET
    const postgresUrl = process.env.POSTGRES_URL

    // If essential vars are missing, return mock response
    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({
        status: 'demo',
        message: '🎭 Supabase environment not configured - serving demo data',
        details: {
          supabaseUrl: supabaseUrl ? 'configured' : 'missing',
          anonKey: anonKey ? 'configured' : 'missing',
          serviceRoleKey: serviceRoleKey ? 'configured' : 'missing',
          jwtSecret: jwtSecret ? 'configured' : 'missing',
          postgresUrl: postgresUrl ? 'configured' : 'missing',
          clientConnection: 'mock',
          adminConnection: 'mock'
        },
        ubuntu: '🌍 "I am because we are" - Demo mode keeps us connected until Supabase is ready!',
        timestamp: new Date().toISOString(),
        note: 'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable real connection'
      })
    }

    // Only import Supabase clients if env vars are present
    const { supabase, createAdminClient } = await import('@/lib/supabase')

    // Test connection with simple health check
    const { data, error } = await supabase
      .from('pg_stat_activity')
      .select('count(*)')
      .limit(1)

    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Failed to connect to Supabase',
        error: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Test admin client (if service role key is available)
    let adminStatus = 'not tested'
    try {
      const adminClient = createAdminClient()
      const { data: adminData, error: adminError } = await adminClient
        .from('pg_stat_activity')
        .select('count(*)')
        .limit(1)
      
      adminStatus = adminError ? `error: ${adminError.message}` : 'connected'
    } catch (adminErr: any) {
      adminStatus = `error: ${adminErr.message}`
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase environment configured successfully',
      details: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'configured' : 'missing',
        jwtSecret: process.env.SUPABASE_JWT_SECRET ? 'configured' : 'missing',
        postgresUrl: process.env.POSTGRES_URL ? 'configured' : 'missing',
        clientConnection: 'connected',
        adminConnection: adminStatus
      },
      ubuntu: '🌍 "I am because we are" - Our database connection strengthens the collective!',
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Environment test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Environment test failed',
      error: error.message,
      ubuntu: '🔧 Ubuntu wisdom: Even in failure, we learn and grow together',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if environment is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({
        status: 'demo',
        message: 'POST operations require Supabase configuration',
        ubuntu: '🌍 Configure Supabase environment variables to enable database operations',
        timestamp: new Date().toISOString()
      })
    }

    const { test } = await request.json()
    const { supabase } = await import('@/lib/supabase')
    
    if (test === 'database') {
      // Test a simple database operation
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(5)

      if (error) {
        return NextResponse.json({
          status: 'error',
          message: 'Database test failed',
          error: error.message,
          timestamp: new Date().toISOString()
        }, { status: 500 })
      }

      return NextResponse.json({
        status: 'success',
        message: 'Database operation successful',
        data: data,
        ubuntu: '🎼 Orchestra of data flowing with Afrocentric excellence!',
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      status: 'error',
      message: 'Unknown test type',
      timestamp: new Date().toISOString()
    }, { status: 400 })

  } catch (error: any) {
    console.error('POST test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Test operation failed',
      error: error.message,
      ubuntu: '🔧 Ubuntu wisdom: We learn from every challenge',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}