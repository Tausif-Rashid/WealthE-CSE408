import { render, screen } from '@testing-library/react';
import App from './App';

describe('Login Page', () => {
  test('renders login form elements', () => {
    render(<App />);
    // Check for "Sign In" text
    // Check that at least one "Sign In" text exists
    // expect(screen.getAllByText(/sign in/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    // Check for username/email input
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    // Check for password input
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    // Check for submit/login button
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
