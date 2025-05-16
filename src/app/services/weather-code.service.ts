import { Injectable } from '@angular/core';
import weatherCodesJson from '../constants/weather-codes.json';

type WeatherCodeEntry = {
  day: { description: string; image: string };
  night: { description: string; image: string };
};

const weatherCodes: { [key: string]: WeatherCodeEntry } = weatherCodesJson;

@Injectable({
  providedIn: 'root',
})
export class WeatherCodeService {
  getWeatherInfo(
    code: number,
    isDay: boolean = true
  ): { description: string; image: string } {
    const timeOfDay = isDay ? 'day' : 'night';

    const codeStr = code.toString();

    if (weatherCodes[codeStr]) {
      return weatherCodes[codeStr][timeOfDay];
    }

    return {
      description: 'Information météo non disponible',
      image: 'http://openweathermap.org/img/wn/01d@2x.png',
    };
  }

  isDayTime(date: Date, sunrise: Date, sunset: Date): boolean {
    return date >= sunrise && date <= sunset;
  }
}
