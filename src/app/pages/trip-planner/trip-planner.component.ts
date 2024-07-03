import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import { GoogleMapComponent } from '../../components/google-map/google-map.component';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { TripService } from '../../services/trip.service';
import { Trip, DayPlan, PackingItem, ImportantInfo } from '../../models/trip.model';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapComponent],
  providers: [TripService, GoogleMapsLoaderService, DatePipe],
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
    private tripService: TripService,
    private datePipe: DatePipe
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
      startDate: ['', [Validators.required, this.dateValidator]],
      endDate: ['', [Validators.required, this.dateValidator]],
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

  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(control.value)) {
      return { 'invalidDate': true };
    }
    return null;
  }

  dateRangeValidator: ValidatorFn = (control: AbstractControl): {[key: string]: any} | null => {
    const start = control.get('startDate');
    const end = control.get('endDate');
  
    if (start && end && start.value && end.value) {
      const startDate = this.parseDate(start.value);
      const endDate = this.parseDate(end.value);
      console.log('Start date:', startDate);
      console.log('End date:', endDate);
      const isRangeValid = endDate.getTime() >= startDate.getTime();
      console.log('Is range valid:', isRangeValid);
      return isRangeValid ? null : { 'dateRange': true };
    }
    return null;
  }

  private parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/');
    return new Date(+year, +month - 1, +day);
  }

  toggleSection(section: string) {
    this.visibleSections[section] = !this.visibleSections[section];
  }

  isSectionVisible(section: string): boolean {
    return this.visibleSections[section];
  }

  addDayPlan() {
    const today = new Date();
    const formattedDate = this.formatDateForInput(today);
    const newDayPlan = this.fb.group({
      date: [formattedDate, [Validators.required, this.dateValidator]],
      activities: this.fb.array([])
    });
    this.dayPlansFormArray.push(newDayPlan);
    console.log('Day plan added:', newDayPlan.value);
    console.log('Day plans array:', this.dayPlansFormArray.value);
  }

private formatDateForInput(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
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

  checkRequiredFields() {
    const requiredFields = ['origin', 'destination', 'startDate', 'endDate', 'travelers', 'budget'];
    requiredFields.forEach(field => {
      const control = this.tripForm.get(field);
      if (control?.value === '' || control?.value === null) {
        console.log(`Field ${field} is empty`);
      }
    });
  }

  onSubmit() {
    console.log('Form validity:', this.tripForm.valid);
    console.log('Form value:', this.tripForm.value);
    console.log('Form errors:', this.tripForm.errors);
    
    if (this.tripForm.valid) {
      const newTrip: Trip = {
        ...this.tripForm.value,
        startDate: this.formatDate(this.tripForm.value.startDate),
        endDate: this.formatDate(this.tripForm.value.endDate),
        id: '' // This will be set by the service
      };
      this.tripService.saveTrip(newTrip);
      console.log('Trip saved:', newTrip);
      this.updateMap();
      this.tripForm.reset();
    } else {
      console.log('Form is invalid. Errors:', this.tripForm.errors);
      Object.keys(this.tripForm.controls).forEach(key => {
        const control = this.tripForm.get(key);
        if (control?.invalid) {
          console.log(`Control ${key} is invalid:`, control.errors);
        }
      });
      this.markFormGroupTouched(this.tripForm);
    }
  }

  private formatDate(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
    this.checkRequiredFields()
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