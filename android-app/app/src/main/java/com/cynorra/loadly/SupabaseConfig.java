package com.cynorra.loadly;

/**
 * Same Supabase project + anon/publishable key the web app ships in its
 * client-side JS bundle (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).
 * This key is not a secret — it is scoped entirely by Row Level Security, exactly
 * as it already is for every anonymous visitor of loadlyapp.com.
 */
public final class SupabaseConfig {
    public static final String URL = "https://dxpbvxokjowueksxapee.supabase.co";
    public static final String ANON_KEY = "sb_publishable_rLZye89uE70HhiS1juLa2A_79UcWVB1";

    private SupabaseConfig() {}
}
