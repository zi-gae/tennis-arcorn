import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
console.log(`Function "browser-with-cors" up and running!`);
Deno.serve(async (req) => {
	// This is needed if you're planning to invoke your function from a browser.
	if (req.method === "OPTIONS") {
		return new Response("ok", {
			headers: corsHeaders,
		});
	}
	try {
		const { id, email, name } = await req.json();
		const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"));
		try {
			await supabase.from("members").insert({
				id,
				email,
				name,
			});
		} catch (error) {
			return new Response(JSON.stringify(error), {
				headers: {
					...corsHeaders,
					"Content-Type": "application/json",
				},
				status: 400,
			});
		}
		const data = {
			message: `Sucess!`,
		};
		return new Response(JSON.stringify(data), {
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
			},
			status: 200,
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: error.message,
			}),
			{
				headers: {
					...corsHeaders,
					"Content-Type": "application/json",
				},
				status: 400,
			}
		);
	}
});
