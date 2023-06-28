import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import WeatherApp from '../components/WeatherApp'
import axios from 'axios';
jest.mock('axios', () => ({
    get: jest.fn(),
  })); 

  const mockedAxios = axios;

describe('WeatherApp', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test('renders WeatherApp component', () => {
    render(<WeatherApp />);
    expect(screen.getByText(/Weather App/i)).toBeInTheDocument();
  });

  test('allows the user to enter city name', async () => {
    render(<WeatherApp />);

    fireEvent.change(screen.getByPlaceholderText(/Enter city name/i), {
      target: { value: 'Paris' },
    });
    expect(screen.getByPlaceholderText(/Enter city name/i).value).toBe('Paris');
  });

  test('handles successful API calls', async () => {
    const weatherData = {
      data: {
        name: 'Paris',
        main: { temp: 300 },
        weather: [{ id: 800, description: 'clear sky' }],
        visibility: 10000,
        wind: { speed: 1.5 },
      },
    };

    mockedAxios.get.mockResolvedValueOnce(weatherData);

    render(<WeatherApp />);
    fireEvent.change(screen.getByPlaceholderText(/Enter city name/i), {
      target: { value: 'Paris' },
    });
    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    expect(screen.getByText(/Paris/i)).toBeInTheDocument();
    expect(screen.getByText(/Temperature: 26.9°C/i)).toBeInTheDocument();
    expect(screen.getByText(/Weather: clear sky/i)).toBeInTheDocument();
    expect(screen.getByText(/Visibility: 10000 meters/i)).toBeInTheDocument();
    expect(screen.getByText(/Wind Speed: 1.5 m\/s/i)).toBeInTheDocument();
  });

  test('handles unsuccessful API calls', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: { data: { message: 'City not found' } },
    });

    render(<WeatherApp />);
    fireEvent.change(screen.getByPlaceholderText(/Enter city name/i), {
      target: { value: 'NonExistentCity' },
    });
    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    expect(screen.getByText(/City not found/i)).toBeInTheDocument();
  });
});
