import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import ContactForm from "./ContactForm";

describe("ContactForm", () => {
  beforeEach(() => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ success: true }), { status: 200 });
  });

  it("shows success message after user submits a valid inquiry", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Maria Lopez");
    await user.type(screen.getByLabelText("Email"), "maria@example.com");
    await user.selectOptions(screen.getByLabelText("Event Type"), "Wedding");
    await user.type(
      screen.getByLabelText("Message"),
      "We'd love to host our wedding at your farm in October."
    );
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(
      await screen.findByText("Thank you!")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/we've received your message/i)
    ).toBeInTheDocument();
  });

  it("shows error message when the server fails so user can retry", async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ error: "Server error" }), { status: 500 });

    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Carlos Ruiz");
    await user.type(screen.getByLabelText("Email"), "carlos@example.com");
    await user.selectOptions(screen.getByLabelText("Event Type"), "Corporate Event");
    await user.type(screen.getByLabelText("Message"), "Planning a team retreat.");
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(
      await screen.findByText("Something went wrong. Please try again.")
    ).toBeInTheDocument();
  });
});
