import { useState, useEffect } from "react";
import { supabase } from '../lib/supabase';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        setLoading(false);
        return { data, error };
    };

    const register = async (email, password) => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        setLoading(false);
        return { data, error };
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return { user, session, login, register, logout, loading, error };
};