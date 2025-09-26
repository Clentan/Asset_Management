import { Movement } from "@/interfaces/interfaces"
import { supabase } from "@/lib/supabase"

export default function useMovement() {
    const newMovement = async ({ employeeId, assetid, reason }: Movement) => {
        const { error } = await supabase.from("asset_movement").upsert(<Movement>{
            employeeId,
            assetid,
            reason
        });

        if(error) {
            throw new Error
        }
    }

    return { newMovement }
}