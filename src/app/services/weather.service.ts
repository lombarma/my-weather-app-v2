import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';
import { from, map, Observable } from 'rxjs';

export interface LongitudeAndLatitudeAndCity {
  longitude: string;
  latitude: string;
  name: string;
}

export interface GeocodingApiResponse {
  results?: Array<{
    longitude: string;
    latitude: string;
    name: string;
  }>;
}

export interface WeatherData {
  hourly: {
    time: Date[];
    relativeHumidity2m: Float32Array;
    temperature2m: Float32Array;
    windSpeed10m: Float32Array;
    visibility: Float32Array;
    apparentTemperature: Float32Array;
    weatherCode: Float32Array;
  };
  daily: {
    time: Date[];
    sunrise: Date[];
    sunset: Date[];
  };
  timezone: string;
  timezoneAbbreviation: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = 'https://api.open-meteo.com/v1/forecast';

  getLongitudeAndLatitudeByCity(
    city: string
  ): Observable<LongitudeAndLatitudeAndCity> {
    return this.httpClient
      .get<GeocodingApiResponse>(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=fr&format=json`
      )
      .pipe(
        map((body) => {
          if (!body.results || body.results.length === 0) {
            throw new Error(`La ville "${city}" n'a pas été trouvée`);
          }
          return {
            longitude: body.results[0].longitude,
            latitude: body.results[0].latitude,
            name: body.results[0].name,
          };
        })
      );
  }

  getWeatherByLongitudeAndLatitude(
    longitude: string,
    latitude: string
  ): Observable<WeatherData> {
    const params = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      daily: ['sunrise', 'sunset'],
      hourly: [
        'relative_humidity_2m',
        'temperature_2m',
        'wind_speed_10m',
        'visibility',
        'apparent_temperature',
        'weathercode',
      ],
    };
    return from(fetchWeatherApi(this.url, params)).pipe(
      map((responses) => {
        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const responseLatitude = response.latitude();
        const responseLongitude = response.longitude();

        const hourly = response.hourly();
        const daily = response.daily();

        const sunrise = daily?.variables(0);
        const sunset = daily?.variables(1);

        if (!hourly) {
          throw new Error('Hourly weather data is not available');
        }

        if (!daily) {
          throw new Error('Daily weather data is not available');
        }

        if (!sunrise) {
          throw new Error('Sunrise data is not available');
        }

        if (!sunset) {
          throw new Error('Sunset data is not available');
        }

        const weatherData: WeatherData = {
          hourly: {
            time: [
              ...Array(
                (Number(hourly.timeEnd()) - Number(hourly.time())) /
                  hourly.interval()
              ),
            ].map(
              (_, i) =>
                new Date(
                  (Number(hourly.time()) +
                    i * hourly.interval() +
                    utcOffsetSeconds) *
                    1000
                )
            ),
            relativeHumidity2m: hourly.variables(0)!.valuesArray()!,
            temperature2m: hourly.variables(1)!.valuesArray()!,
            windSpeed10m: hourly.variables(2)!.valuesArray()!,
            visibility: hourly.variables(3)!.valuesArray()!,
            apparentTemperature: hourly.variables(4)!.valuesArray()!,
            weatherCode: hourly.variables(5)!.valuesArray()!,
          },
          daily: {
            time: [
              ...Array(
                (Number(daily.timeEnd()) - Number(daily.time())) /
                  daily.interval()
              ),
            ].map(
              (_, i) =>
                new Date(
                  (Number(daily.time()) +
                    i * daily.interval() +
                    utcOffsetSeconds) *
                    1000
                )
            ),
            sunrise: [...Array(sunrise.valuesInt64Length())].map(
              (_, i) =>
                new Date(
                  (Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000
                )
            ),
            sunset: [...Array(sunset.valuesInt64Length())].map(
              (_, i) =>
                new Date(
                  (Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000
                )
            ),
          },
          timezone: timezone ?? '',
          timezoneAbbreviation: timezoneAbbreviation ?? '',
          latitude: responseLatitude,
          longitude: responseLongitude,
        };
        return weatherData;
      })
    );
  }
}
