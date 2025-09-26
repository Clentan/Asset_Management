import cron from "node-cron";
import { supabase } from "../lib/supabase";

export default function StartCronJobs(): void {
    cron.schedule("*/30 * * * *", async () => {
        await supabase.from("email_otps").delete().lt("expires_at", new Date().toISOString());
    })
}