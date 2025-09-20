import { NextRequest, NextResponse } from 'next/server'
import { supabase, createAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
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
    const { test } = await request.json()
    
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
          error: error.message
        }, { status: 500 })
      }

      return NextResponse.json({
        status: 'success',
        message: 'Database connection verified',
        tables: data,
        ubuntu: '🎼 Ubuntu excellence: Our data flows like a river connecting all!'
      })
    }

    return NextResponse.json({
      status: 'error',
      message: 'Unknown test type'
    }, { status: 400 })

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Test request failed',
      error: error.message
    }, { status: 500 })
  }
}