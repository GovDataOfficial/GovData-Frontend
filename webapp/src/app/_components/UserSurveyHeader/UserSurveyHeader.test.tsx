import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { UserSurveyHeader } from "@/app/_components/UserSurveyHeader/UserSurveyHeader";

describe("UserSurveyHeader", () => {
  it("should render header with link", () => {
    vi.stubEnv("show_user_survey_header", "true");
    vi.stubEnv("user_survey_link", "https://example.com/survey");
    render(<UserSurveyHeader />);

    expect(
      screen.getByText(/Wie zufrieden sind Sie mit den Suchergebnissen/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Wir freuen uns, wenn Sie sich zwei Minuten Zeit nehmen/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /An Umfrage teilnehmen/i }),
    ).toBeInTheDocument();
  });

  it("should not render when show_user_survey_header is false", () => {
    vi.stubEnv("show_user_survey_header", "false");
    vi.stubEnv("user_survey_link", "https://example.com/survey");

    const { container } = render(<UserSurveyHeader />);

    expect(container.firstChild).toBeNull();
  });

  it("should not render when show_user_survey_header is empty", () => {
    vi.stubEnv("show_user_survey_header", "");
    vi.stubEnv("user_survey_link", "https://example.com/survey");

    const { container } = render(<UserSurveyHeader />);

    expect(container.firstChild).toBeNull();
  });

  it("should not render when show_user_survey_header is undefined", () => {
    vi.stubEnv("show_user_survey_header", undefined);
    vi.stubEnv("user_survey_link", "https://example.com/survey");

    const { container } = render(<UserSurveyHeader />);

    expect(container.firstChild).toBeNull();
  });

  it("should not render when user_survey_link is empty", () => {
    vi.stubEnv("show_user_survey_header", "true");
    vi.stubEnv("user_survey_link", "");

    const { container } = render(<UserSurveyHeader />);

    expect(container.firstChild).toBeNull();
  });

  it("should not render when user_survey_link is undefined", () => {
    vi.stubEnv("show_user_survey_header", "true");
    vi.stubEnv("user_survey_link", undefined);

    const { container } = render(<UserSurveyHeader />);

    expect(container.firstChild).toBeNull();
  });

  it("should not render when both environment variables are missing", () => {
    vi.stubEnv("show_user_survey_header", undefined);
    vi.stubEnv("user_survey_link", undefined);

    const { container } = render(<UserSurveyHeader />);

    expect(container.firstChild).toBeNull();
  });

  it("should render when show_user_survey_header is 'TRUE' (case insensitive)", () => {
    vi.stubEnv("show_user_survey_header", "TRUE");
    vi.stubEnv("user_survey_link", "https://example.com/survey");

    render(<UserSurveyHeader />);

    expect(
      screen.getByText(/Wie zufrieden sind Sie mit den Suchergebnissen/i),
    ).toBeInTheDocument();
  });

  it("should render when show_user_survey_header is 'True' (mixed case)", () => {
    vi.stubEnv("show_user_survey_header", "True");
    vi.stubEnv("user_survey_link", "https://example.com/survey");

    render(<UserSurveyHeader />);

    expect(
      screen.getByText(/Wie zufrieden sind Sie mit den Suchergebnissen/i),
    ).toBeInTheDocument();
  });
});
