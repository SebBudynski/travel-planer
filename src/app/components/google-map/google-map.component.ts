/// <reference types="@types/google.maps" />

import { Component, Input, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [],
  template: '<div #mapContainer style="width: 100%; height: 400px;"></div>',
  styles: [':host { display: block; }']
})
export class GoogleMapComponent implements OnInit, OnChanges {
  @Input() destination: string = '';
  @ViewChild('mapContainer', {static: true}) mapContainer!: ElementRef;
  private map!: google.maps.Map;

  constructor(private mapsLoader: GoogleMapsLoaderService) {}

  async ngOnInit() {
    await this.mapsLoader.load();
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['destination'] && !changes['destination'].firstChange && this.map) {
      this.updateMap();
    }
  }

  private initMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 0, lng: 0 },
      zoom: 2
    };
    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
  }

  private updateMap() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.destination }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(10);
        new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location
        });
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}