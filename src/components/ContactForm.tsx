import { useState, type FormEvent, type ChangeEvent } from "react";
import type { ContactFormTranslations } from "../i18n/utils";

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

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface Props {
  translations: ContactFormTranslations;
}

export default function ContactForm({ translations: tr }: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    eventType: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function validate(data: FormData): FormErrors {
    const errs: FormErrors = {};
    if (!data.name.trim()) errs.name = tr.errors.name;
    if (!data.email.trim()) {
      errs.email = tr.errors.emailRequired;
    } else if (!validateEmail(data.email)) {
      errs.email = tr.errors.emailInvalid;
    }
    if (!data.eventType) errs.eventType = tr.errors.eventType;
    if (!data.message.trim()) errs.message = tr.errors.message;
    return errs;
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
        <h3 className="text-xl mb-2">{tr.success.heading}</h3>
        <p className="text-charcoal/70">{tr.success.text}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-5">
        <label htmlFor="name" className="block text-sm font-semibold uppercase tracking-wide text-charcoal/50 mb-2">
          {tr.labels.name}
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
          {tr.labels.email}
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
          {tr.labels.eventType}
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
          <option value="">{tr.placeholders.eventType}</option>
          {tr.events.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.eventType && <p className="mt-1 text-sm text-red-500">{errors.eventType}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-semibold uppercase tracking-wide text-charcoal/50 mb-2">
          {tr.labels.message}
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
        <p className="mb-4 text-sm text-red-500">{tr.submitError}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full md:w-auto md:px-10 py-3 rounded-lg bg-forest text-cream font-semibold hover:bg-forest/85 transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? tr.sending : tr.submit}
      </button>
    </form>
  );
}
