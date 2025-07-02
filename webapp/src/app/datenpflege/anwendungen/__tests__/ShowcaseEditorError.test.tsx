import { describe, test } from "vitest";
import { render, screen } from "@testing-library/react";

import { ShowcaseEditorError } from "@/app/datenpflege/anwendungen/_components/ShowcaseEditorError";

describe("ShowcaseEditorError", () => {
  test("should render the error message", () => {
    render(<ShowcaseEditorError />);
    screen.getByText(/Sie verfügen nicht über die Berechtigung/i);
  });
});
