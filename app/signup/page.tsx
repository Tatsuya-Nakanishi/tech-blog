import Signup from "@/features/routes/signup/components/index";
import { createClient } from "@/lib/supabase/client/serverClient";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const auth = data?.user;
  if (auth) {
    redirect("/identity/mypage");
  }

  return <Signup />;
}
