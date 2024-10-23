import { supabase } from "@/lib/supabase";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  const setNewView = async () => {
    const { data, error } = await supabase.from("views").insert({
      name: "random name",
    });

    if (data) console.log(data);
    if (error) console.log(error);
  };

  setNewView();

  return (
    <div>
      <h1>GO TO PRODUCTS PAGE</h1>
    </div>
  );
}
