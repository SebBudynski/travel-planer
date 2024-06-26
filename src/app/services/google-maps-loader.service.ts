// src/app/services/google-maps-loader.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  private static promise: Promise<void>;

  public load(): Promise<void> {
    if (!GoogleMapsLoaderService.promise) {
      GoogleMapsLoaderService.promise = new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.id = 'googleMaps';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          (window as any).__env.googleMapsApiKey
        }&callback=initMap`;
        script.async = true;
        script.defer = true;
        (window as any)['initMap'] = () => {
          resolve();
        };
        document.body.appendChild(script);
      });
    }
    return GoogleMapsLoaderService.promise;
  }
}
