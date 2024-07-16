import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.model';
import { TripMapComponent } from '../trip-map/trip-map.component';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TripMapComponent],
  providers: [TripService, DatePipe],
  templateUrl: './trip-planner.component.html',
  styleUrls: ['./trip-planner.component.scss']
})
export class TripPlannerComponent implements OnInit {
  tripForm!: FormGroup;
  visibleSections: { [key: string]: boolean } = {
    dayPlans: false,
    packingList: false,
    importantInfo: false
  };

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.initForm();
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
    });

    // Subskrybcja zmian w polach dat
    this.tripForm.get('startDate')?.valueChanges.subscribe(value => {
      const formattedDate = this.datePipe.transform(value, 'dd/MM/yyyy');
      this.tripForm.get('startDate')?.setValue(formattedDate, { emitEvent: false });
    });

    this.tripForm.get('endDate')?.valueChanges.subscribe(value => {
      const formattedDate = this.datePipe.transform(value, 'dd/MM/yyyy');
      this.tripForm.get('endDate')?.setValue(formattedDate, { emitEvent: false });
    });
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
      date: [formattedDate, [Validators.required]],
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
}
 
