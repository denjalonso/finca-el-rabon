import type { APIRoute } from "astro";

export const prerender = false;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, email, eventType, message } = body as {
    name?: string;
    email?: string;
    eventType?: string;
    message?: string;
  };

  const errors: string[] = [];
  if (!name || !name.toString().trim()) errors.push("Name is required.");
  if (!email || !email.toString().trim()) {
    errors.push("Email is required.");
  } else if (!isValidEmail(email.toString())) {
    errors.push("Invalid email format.");
  }
  if (!eventType || !eventType.toString().trim()) errors.push("Event type is required.");
  if (!message || !message.toString().trim()) errors.push("Message is required.");

  if (errors.length > 0) {
    return new Response(JSON.stringify({ error: errors.join(" ") }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("Contact form submission:", { name, email, eventType, message });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
