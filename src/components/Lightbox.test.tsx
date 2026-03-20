import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Lightbox from "./Lightbox";

const images = [
  { src: "/img/barn.jpg", alt: "Barn" },
  { src: "/img/field.jpg", alt: "Field" },
  { src: "/img/sunset.jpg", alt: "Sunset" },
];

describe("Lightbox", () => {
  it("opens when user clicks a gallery thumbnail and allows navigation", async () => {
    const user = userEvent.setup();

    // Render the lightbox + a simulated gallery trigger
    const { container } = render(
      <div>
        <button data-lightbox-index="0">View Barn</button>
        <button data-lightbox-index="1">View Field</button>
        <Lightbox images={images} />
      </div>
    );

    // Lightbox is initially closed — no image visible
    expect(screen.queryByAltText("Barn")).not.toBeInTheDocument();

    // User clicks the first gallery thumbnail
    await user.click(screen.getByText("View Barn"));

    // Lightbox opens showing the first image and counter
    expect(screen.getByAltText("Barn")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();

    // User navigates to next image
    await user.click(screen.getByLabelText("Next image"));
    expect(screen.getByAltText("Field")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();

    // User navigates back
    await user.click(screen.getByLabelText("Previous image"));
    expect(screen.getByAltText("Barn")).toBeInTheDocument();

    // User closes the lightbox
    await user.click(screen.getByLabelText("Close lightbox"));
    expect(screen.queryByAltText("Barn")).not.toBeInTheDocument();
  });
});
