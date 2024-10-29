import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    SECRET_API_KEY_1,
    SECRET_API_KEY_2
);
