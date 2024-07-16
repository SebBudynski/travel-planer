/// <reference types="@types/google.maps" />

import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';

@Component({
  selector: 'app-trip-map',
  standalone: true,
  templateUrl: './trip-map.component.html',
  styleUrls: ['./trip-map.component.scss'],
  providers: [GoogleMapsLoaderService]
})
export class TripMapComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Input() destination!: string;
  private map: google.maps.Map | null = null;

  constructor(private mapsLoader: GoogleMapsLoaderService) {}

  async ngAfterViewInit() {
    await this.initMap();
  }

  private async initMap() {
    try {
      await this.mapsLoader.load();
      const mapOptions: google.maps.MapOptions = {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        restriction: {
          latLngBounds: {
            north: 85,
            south: -85,
            west: -180,
            east: 180,
          },
          strictBounds: true,
        },
      };
      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
      this.updateMap();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  ngOnChanges() {
    if (this.map) {
      this.updateMap();
    }
  }

  private updateMap() {
    if (!this.map || !this.destination) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: this.destination },
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          this.map!.setCenter(results[0].geometry.location);
          this.map!.setZoom(10);
          new google.maps.Marker({
            map: this.map!,
            position: results[0].geometry.location,
          });
        } else {
          console.error('Geocode was not successful for the following reason:', status);
        }
      }
    );
  }
}
