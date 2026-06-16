import { useState } from "react";
import { supabase } from '../lib/supabase';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setError(error.message);
        }
        
        setLoading(false);
        return { data, error };
    };

    return { login, loading, error };
};