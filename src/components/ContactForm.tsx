import { useState, type FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  eventType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  eventType?: string;
  message?: string;
}

const EVENT_TYPES = [
  "Wedding",
  "Corporate Event",
  "Private Party",
  "Photography/Film",
  "Other",
];

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!data.eventType) errors.eventType = "Please select an event type.";
  if (!data.message.trim()) errors.message = "Message is required.";
  return errors;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    eventType: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", eventType: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-forest/10 p-8 text-center">
        <h3 className="text-xl mb-2">Thank you!</h3>
        <p className="text-charcoal/70">
          We've received your message and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-5">
        <label htmlFor="name" className="block text-sm font-semibold uppercase tracking-wide text-charcoal/50 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full rounded-lg border px-4 py-3 text-charcoal bg-warm-white focus:outline-none focus:ring-2 focus:ring-forest/40 transition-colors ${
            errors.name ? "border-red-400" : "border-charcoal/20"
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="mb-5">
        <label htmlFor="email" className="block text-sm font-semibold uppercase tracking-wide text-charcoal/50 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full rounded-lg border px-4 py-3 text-charcoal bg-warm-white focus:outline-none focus:ring-2 focus:ring-forest/40 transition-colors ${
            errors.email ? "border-red-400" : "border-charcoal/20"
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="mb-5">
        <label htmlFor="eventType" className="block text-sm font-semibold uppercase tracking-wide text-charcoal/50 mb-2">
          Event Type
        </label>
        <select
          id="eventType"
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          className={`w-full rounded-lg border px-4 py-3 text-charcoal bg-warm-white focus:outline-none focus:ring-2 focus:ring-forest/40 transition-colors ${
            errors.eventType ? "border-red-400" : "border-charcoal/20"
          }`}
        >
          <option value="">Select an event type</option>
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.eventType && <p className="mt-1 text-sm text-red-500">{errors.eventType}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-semibold uppercase tracking-wide text-charcoal/50 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={`w-full rounded-lg border px-4 py-3 text-charcoal bg-warm-white focus:outline-none focus:ring-2 focus:ring-forest/40 transition-colors resize-vertical ${
            errors.message ? "border-red-400" : "border-charcoal/20"
          }`}
        />
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
      </div>

      {status === "error" && (
        <p className="mb-4 text-sm text-red-500">
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full md:w-auto md:px-10 py-3 rounded-lg bg-forest text-cream font-semibold hover:bg-forest/85 transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
