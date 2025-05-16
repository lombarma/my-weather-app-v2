# Weather Forecast Application

A modern, elegant weather forecast application built with Angular. This application provides real-time weather data including temperature, humidity, wind speed, and visibility for any city around the world.

![Weather Forecast App Screenshot](src/assets/app-screenshot.png)

## Features

- **City Search**: Search for any city globally
- **Hourly Weather Forecasts**: View forecasts for specific times (02:00, 08:00, 14:00, 20:00)
- **Detailed Weather Information**: Includes temperature, "feels like" temperature, humidity, wind speed, visibility
- **Weather Conditions**: Visual representation with appropriate weather icons
- **Sunrise & Sunset Times**: Daily sunrise and sunset times
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with time-based navigation

## Technology Stack

- **Framework**: Angular 19.1.8
- **API**: Open-Meteo Weather API
- **Styling**: SCSS with modern design principles
- **Icons**: SVG icons for weather conditions

## Setup and Installation

### Prerequisites

- Node.js (version 18 or later recommended)
- npm (version 9 or later recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/my-weather-app-v2.git
cd my-weather-app-v2
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

## Using the Application

1. Enter a city name in the search field
2. Press Enter or click the search button
3. View the current weather information
4. Toggle between different time periods (02:00, 08:00, 14:00, 20:00) to see forecasts for specific times
5. Explore detailed weather parameters in the Weather Details section

## API Information

This application uses the [Open-Meteo Weather API](https://open-meteo.com/), which is a free, open-source weather API that provides accurate weather data globally. The API does not require authentication for basic usage.

## Development

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.8.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## License

MIT

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
