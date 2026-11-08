import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { MOCK_PROJECT_LEADS, MOCK_ESTIMATES } from '@/lib/mock-data';
import { ProjectLead, EstimateQuote } from '@/lib/supabase/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const contractorId = searchParams.get('contractorId');

    if (isSupabaseConfigured()) {
      if (projectId) {
        const { data, error } = await supabase
          .from('estimates')
          .select('*, contractor:contractor_profiles(*)')
          .eq('project_id', projectId);

        if (error) throw error;
        return NextResponse.json({ success: true, quotes: data });
      }

      if (contractorId) {
        const { data, error } = await supabase
          .from('estimates')
          .select('*')
          .eq('contractor_id', contractorId);

        if (error) throw error;
        return NextResponse.json({ success: true, quotes: data });
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ success: true, leads: data });
    }

    // Fallback to in-memory mock data
    if (projectId) {
      const filteredQuotes = MOCK_ESTIMATES.filter((q) => q.project_id === projectId);
      return NextResponse.json({ success: true, quotes: filteredQuotes, source: 'mock' });
    }

    if (contractorId) {
      const filteredQuotes = MOCK_ESTIMATES.filter((q) => q.contractor_id === contractorId);
      return NextResponse.json({ success: true, quotes: filteredQuotes, source: 'mock' });
    }

    return NextResponse.json({ success: true, leads: MOCK_PROJECT_LEADS, source: 'mock' });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Päringu viga';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, lead, quote } = body;

    // 1. Client Lead Creation
    if (action === 'create_lead' && lead) {
      const newLead: ProjectLead = {
        id: 'lead-' + Date.now(),
        ...lead,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('projects').insert(lead).select().single();
        if (error) {
          console.warn('Supabase lead insertion error, using fallback:', error.message);
        } else {
          return NextResponse.json({ success: true, lead: data, source: 'supabase' });
        }
      }

      return NextResponse.json({ success: true, lead: newLead, source: 'mock' });
    }

    // 2. Contractor Official Offer Submission
    if (action === 'send_quote' && quote) {
      const newQuote: EstimateQuote = {
        id: quote.id || 'quote-' + Date.now(),
        ...quote,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('estimates').insert(quote).select().single();
        if (error) {
          console.warn('Supabase estimate insertion error, using fallback:', error.message);
        } else {
          return NextResponse.json({ success: true, quote: data, source: 'supabase' });
        }
      }

      return NextResponse.json({ success: true, quote: newQuote, source: 'mock' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action or payload' },
      { status: 400 }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Server viga';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
