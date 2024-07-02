import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import { GoogleMapComponent } from '../../components/google-map/google-map.component';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { TripService } from '../../services/trip.service';
import { Trip, DayPlan, PackingItem, ImportantInfo } from '../../models/trip.model';

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
  visibleSections: { [key: string]: boolean } = {
    dayPlans: false,
    packingList: false,
    importantInfo: false
  };

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
      budget: [0, [Validators.required, Validators.min(0)]],
      dayPlans: this.fb.array([]),
      packingList: this.fb.array([]),
      importantInfo: this.fb.array([])
    }, { validators: this.dateRangeValidator });
  }

  get dayPlansFormArray() {
    return this.tripForm.get('dayPlans') as FormArray;
  }

  get packingListFormArray() {
    return this.tripForm.get('packingList') as FormArray;
  }

  get importantInfoFormArray() {
    return this.tripForm.get('importantInfo') as FormArray;
  }

  getActivitiesFormArray(dayIndex: number): FormArray {
    return this.dayPlansFormArray.at(dayIndex).get('activities') as FormArray;
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

  toggleSection(section: string) {
    this.visibleSections[section] = !this.visibleSections[section];
  }

  isSectionVisible(section: string): boolean {
    return this.visibleSections[section];
  }

  addDayPlan() {
    this.dayPlansFormArray.push(this.fb.group({
      date: ['', Validators.required],
      activities: this.fb.array([])
    }));
  }

  addActivity(dayPlanIndex: number) {
    const activities = this.getActivitiesFormArray(dayPlanIndex);
    activities.push(this.fb.control('', Validators.required));
  }

  addPackingItem() {
    this.packingListFormArray.push(this.createPackingItem(''));
  }

  addImportantInfo() {
    this.importantInfoFormArray.push(this.createImportantInfo('', ''));
  }

  private createPackingItem(name: string): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      packed: [false]
    });
  }

  private createImportantInfo(category: string, details: string): FormGroup {
    return this.fb.group({
      category: [category, Validators.required],
      details: [details, Validators.required]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.tripForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
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
    } else {
      this.markFormGroupTouched(this.tripForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
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