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
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};
