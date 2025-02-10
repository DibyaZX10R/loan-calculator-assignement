import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { LoanCalculatorComponent } from './loan-calculator.component';
import { LoanCalculatorService } from '../services/loan-calculator.service';
import { BehaviorSubject } from 'rxjs';

describe('LoanCalculatorComponent', () => {
  let component: LoanCalculatorComponent;
  let fixture: ComponentFixture<LoanCalculatorComponent>;
  let service: LoanCalculatorService;
  let consoleSpy: jasmine.Spy;

  const mockLoanDetails = {
    maxFunding: 17484500,
    vehicleName: 'Honda ADV 150 CBS',
    vehicleYear: 2022,
    loanAmount: 14500000,
    loanPeriod: 12,
    monthlyInstallment: 150000
  };

  const mockLoanRange = {
    min: 1000000,
    max: 17484500
  };

  const mockLoanPeriodRange = {
    min: 6,
    max: 15
  };

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('LoanCalculatorService', [
      'getLoanDetails',
      'getLoanRange',
      'getLoanPeriodRange',
      'updateLoanAmount',
      'updateLoanPeriod'
    ]);

    serviceSpy.getLoanDetails.and.returnValue(new BehaviorSubject(mockLoanDetails));
    serviceSpy.getLoanRange.and.returnValue(mockLoanRange);
    serviceSpy.getLoanPeriodRange.and.returnValue(mockLoanPeriodRange);

    await TestBed.configureTestingModule({
      declarations: [LoanCalculatorComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatSliderModule
      ],
      providers: [
        { provide: LoanCalculatorService, useValue: serviceSpy }
      ]
    }).compileComponents();

    consoleSpy = spyOn(console, 'log');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCalculatorComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(LoanCalculatorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loan details from service', () => {
    expect(component.loanDetails).toEqual(mockLoanDetails);
    expect(component.loanRange).toEqual(mockLoanRange);
    expect(component.loanPeriodRange).toEqual(mockLoanPeriodRange);
  });

  it('should format currency correctly', () => {
    const result = component.formatCurrency(1000000);
    expect(result).toBe('Rp 1,000,000');
  });

  it('should format period correctly', () => {
    const result = component.formatPeriod(12);
    expect(result).toBe('12 Months');
  });

  it('should update loan amount when slider changes', () => {
    const newAmount = 10000000;
    component.onLoanAmountChange(newAmount);
    expect(service.updateLoanAmount).toHaveBeenCalledWith(newAmount);
  });

  it('should update loan period when slider changes', () => {
    const newPeriod = 8;
    component.onLoanPeriodChange(newPeriod);
    expect(service.updateLoanPeriod).toHaveBeenCalledWith(newPeriod);
  });

  it('should log loan details when apply button is clicked', () => {
    component.onApplyLoan();

    expect(consoleSpy).toHaveBeenCalledWith('Loan Application Details:', {
      maxFunding: 'Rp 17,484,500',
      vehicleName: 'Honda ADV 150 CBS',
      vehicleYear: 2022,
      loanAmount: 'Rp 14,500,000',
      loanPeriod: '12 Months',
      monthlyInstallment: 'Rp 150,000'
    });
  });

  it('should display all loan information in the template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.funding-card .amount')?.textContent)
      .toContain('Rp 17,484,500');
    expect(compiled.querySelector('.vehicle-name')?.textContent)
      .toContain('Honda ADV 150 CBS');
    expect(compiled.querySelector('.vehicle-year')?.textContent)
      .toContain('2022');
    expect(compiled.querySelector('.slider-section .amount')?.textContent)
      .toContain('Rp 14,500,000');
    expect(compiled.querySelector('.installment-section .amount')?.textContent)
      .toContain('Rp 150,000');
  });

  it('should have working apply loan button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const applyButton = compiled.querySelector('.apply-button') as HTMLButtonElement;

    expect(applyButton).toBeTruthy();
    expect(applyButton.textContent?.trim()).toBe('APPLY LOAN');

    applyButton.click();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
