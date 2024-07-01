import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private static promise: Promise<void>;

  public load(): Promise<void> {
    if (!GoogleMapsLoaderService.promise) {
      GoogleMapsLoaderService.promise = new Promise<void>((resolve) => {
        (window as any)['initMap'] = () => {
          resolve();
        }
        const script = document.createElement('script');
        script.id = 'googleMaps';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      });
    }
    return GoogleMapsLoaderService.promise;
  }
}