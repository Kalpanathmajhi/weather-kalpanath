import { render, screen } from '@testing-library/react';
import App from './App';  // The relative path might change according to your file structure

test('renders WeatherApp component', () => {
  render(<App />);
  expect(screen.getByText(/Weather App/i)).toBeInTheDocument();
});
