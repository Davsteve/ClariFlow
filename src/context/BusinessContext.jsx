import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const BusinessContext = createContext();

export function BusinessProvider({ children }) {
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // 🔹 Get session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔹 Fetch OR create business
  useEffect(() => {
    const fetchOrCreateBusiness = async () => {
      if (!session) {
        setBusinessId(null);
        setLoading(false);
        return;
      }

      // 1️⃣ Try fetching existing business
      const { data, error } = await supabase
        .from("business")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle(); // 🔥 important change

      // If business exists → use it
      if (data) {
        setBusinessId(data.id);
        setLoading(false);
        return;
      }

      // If no business found → create one
      const { data: newBusiness, error: createError } = await supabase
        .from("business")
        .insert([
  {
    user_id: session.user.id,
    name: "My Business"
  },
])
        .select()
        .single();

      if (createError) {
        console.error("Business creation failed:", createError);
        setLoading(false);
        return;
      }

      if (newBusiness) {
        setBusinessId(newBusiness.id);
      }

      setLoading(false);
    };

    fetchOrCreateBusiness();
  }, [session]);

  return (
    <BusinessContext.Provider value={{ businessId, session, loading }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}