import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { GoogleMapComponent } from '../../components/google-map/google-map.component';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { TripService } from '../../services/trip-service';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapComponent],
  providers: [TripService, GoogleMapsLoaderService],
  templateUrl: './trip-planner.component.html',
  styleUrls: ['./trip-planner.component.scss']
})
export class TripPlannerComponent implements OnInit, AfterViewInit {
  tripForm!: FormGroup;
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map: google.maps.Map | null = null;

  constructor(
    private fb: FormBuilder,
    private mapsLoader: GoogleMapsLoaderService,
    private tripService: TripService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  async ngAfterViewInit() {
    await this.initMap();
  }

  private initForm() {
    this.tripForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      travelers: [1, [Validators.required, Validators.min(1)]],
      budget: [0, [Validators.required, Validators.min(0)]]
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator: ValidatorFn = (control: AbstractControl): {[key: string]: any} | null => {
    const start = control.get('startDate');
    const end = control.get('endDate');

    if (start && end && start.value && end.value) {
      const startDate = new Date(start.value);
      const endDate = new Date(end.value);
      const isRangeValid = endDate.getTime() >= startDate.getTime();
      return isRangeValid ? null : { 'dateRange': true };
    }
    return null;
  }

  onSubmit() {
    if (this.tripForm.valid) {
      const newTrip: Trip = {
        id: '', // This will be set by the service
        ...this.tripForm.value
      };
      this.tripService.saveTrip(newTrip);
      console.log('Trip saved:', newTrip);
      this.updateMap();
      this.tripForm.reset();
    }
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
      this.map = new google.maps.Map(
        this.mapContainer.nativeElement,
        mapOptions
      );
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private updateMap() {
    if (!this.map) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: this.tripForm.get('destination')?.value },
      (results, status) => {
        if (
          status === google.maps.GeocoderStatus.OK &&
          results &&
          results[0] &&
          this.map
        ) {
          this.map.setCenter(results[0].geometry.location);
          this.map.setZoom(10);
          new google.maps.Marker({
            map: this.map,
            position: results[0].geometry.location,
          });
        } else {
          console.error(
            'Geocode was not successful for the following reason:',
            status
          );
        }
      }
    );
  }
}
