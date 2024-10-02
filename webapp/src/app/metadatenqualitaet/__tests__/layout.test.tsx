import { describe, expect, it } from "vitest";
import Layout from "@/app/metadatenqualitaet/layout";
import { render, screen } from "@testing-library/react";

describe("MetaDatenQualität - Layout", () => {
  it("should render correct elements", () => {
    render(
      <Layout>
        <div>hi i might be a page</div>
      </Layout>,
    );

    screen.getByRole("heading", {
      name: /dashboard zur metadatenqualität/i,
      level: 1,
    });
    screen.getByRole("menubar", { name: /seiten der seite/i });
    screen.getByText(/hi i might be a page/i);
  });

  it("should set correct background image", () => {
    const { container } = render(<Layout />);

    const background = container.querySelector(
      ".gd-background-image-metadataquality",
    );
    expect(background).toBeDefined();
  });
});
