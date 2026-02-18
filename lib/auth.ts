import { supabase } from "./supabase/client";

export const signUp = async (email: string, password: string, role: "CITIZEN" | "ADMIN" = "CITIZEN") => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role,
            },
        },
    });
    return { data, error };
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    
    // Handle email not confirmed error
    if (error?.message?.includes('Email not confirmed')) {
        return { 
            data, 
            error: { message: 'Please check your email and confirm your account before signing in.' }
        };
    }
    
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const resendConfirmationEmail = async (email: string) => {
    const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
    });
    return { data, error };
};
