import { supabase } from "@/lib/supabase";

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
      <h1></h1>
      {process.env.NEXT_PUBLIC_SUPABASE_URL} Hello
    </div>
  );
}
