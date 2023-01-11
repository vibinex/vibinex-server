import "@testing-library/jest-dom";
import { render, screen } from '@testing-library/react'
import Home from "../pages/index";

describe("Landing Hero Tests", () => {
	it("check if CTA button is rendered", () => {
		render(<Home />);
		// check if all components are rendered
		expect(screen.getByText("Build devProfile")).toBeInTheDocument();
		expect(screen.getByText("Build devProfile")).toHaveAttribute("href", "/login");
	});
});