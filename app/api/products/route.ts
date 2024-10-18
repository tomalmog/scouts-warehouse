import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {

    const { data, error } = await supabase
    .from('products')
    .select().limit(4);


    // console.log(data);

    return NextResponse.json({products: data});
}

