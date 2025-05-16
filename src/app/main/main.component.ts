import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { WeatherCodeService } from '../services/weather-code.service';
import { WeatherData, WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-main',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  private readonly weatherService = inject(WeatherService);
  private readonly weatherCodeService = inject(WeatherCodeService);
  protected readonly cityName = new FormControl<string>('');
  protected weatherData: WeatherData | null = null;
  protected isLoading = false;
  protected errorMessage: string | null = null;
  protected selectedHourIndex: number | null = null;

  ngOnInit(): void {
    // Initialize with the first time slot
    if (this.weatherData) {
      this.selectHour(2);
    }
  }

  selectHour(hourIndex: number): void {
    this.selectedHourIndex = hourIndex;
  }

  getWeatherInfo(
    code: number,
    index: number = 0
  ): { description: string; image: string } {
    if (!this.weatherData) {
      return { description: '', image: '' };
    }

    const time = this.weatherData.hourly.time[index];

    if (
      this.weatherData.daily?.sunrise?.length > 0 &&
      this.weatherData.daily?.sunset?.length > 0
    ) {
      const dayIndex = 0;
      const isDay = this.weatherCodeService.isDayTime(
        new Date(time),
        new Date(this.weatherData.daily.sunrise[dayIndex]),
        new Date(this.weatherData.daily.sunset[dayIndex])
      );

      return this.weatherCodeService.getWeatherInfo(code, isDay);
    }

    return this.weatherCodeService.getWeatherInfo(code, true);
  }

  getWeather() {
    const city = this.cityName.value;
    if (!city) {
      this.errorMessage = 'Veuillez entrer une ville';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.weatherService
      .getLongitudeAndLatitudeByCity(city)
      .pipe(
        switchMap((coords) =>
          this.weatherService.getWeatherByLongitudeAndLatitude(
            coords.longitude,
            coords.latitude
          )
        ),
        catchError((err) => {
          this.errorMessage = err.message || 'Unknown error';
          this.weatherData = null;
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data) => {
        if (data) {
          this.weatherData = data;
          // Set default selected hour
          this.selectHour(2);
        }
      });
  }
}
