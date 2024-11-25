import { render, screen } from '@testing-library/react';
import App from './App';

test('renders JSONPlaceholder App', () => {
  render(<App />);
  const titleElement = screen.getByText(/JSONPlaceholder App/i);
  expect(titleElement).toBeInTheDocument();
});
