import { Authcontext } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useContext, useState } from "react";

export default function useLastActive() {
  const { currentUser } = useContext(Authcontext);

  const updateLastAcivity = async () => {
    const { error } = await supabase
      .from("admins")
      .update({
        last_login: new Date().toISOString(),
      })
      .eq("adminId", currentUser.adminId);

    if (error) {
      return null
    }
  };

  return { updateLastAcivity };
}
