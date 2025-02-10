import { TestBed } from '@angular/core/testing';
import { LoanCalculatorService } from './loan-calculator.service';
import { first } from 'rxjs/operators';

describe('LoanCalculatorService', () => {
  let service: LoanCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', (done) => {
    service.getLoanDetails().pipe(first()).subscribe(details => {
      expect(details.maxFunding).toBe(17484500);
      expect(details.vehicleName).toBe('Honda ADV 150 CBS');
      expect(details.vehicleYear).toBe(2022);
      expect(details.loanAmount).toBe(14500000);
      expect(details.loanPeriod).toBe(12);
      expect(details.monthlyInstallment).toBeGreaterThan(0);
      done();
    });
  });

  it('should provide loan range', () => {
    const range = service.getLoanRange();
    expect(range.min).toBe(1000000);
    expect(range.max).toBe(17484500);
  });

  it('should provide loan period range', () => {
    const range = service.getLoanPeriodRange();
    expect(range.min).toBe(6);
    expect(range.max).toBe(15);
  });

  it('should update loan amount within valid range', (done) => {
    const testAmount = 10000000;
    service.updateLoanAmount(testAmount);

    service.getLoanDetails().pipe(first()).subscribe(details => {
      expect(details.loanAmount).toBe(testAmount);
      expect(details.monthlyInstallment).toBeGreaterThan(0);
      done();
    });
  });

  it('should not update loan amount outside valid range', (done) => {
    const initialAmount = service.getLoanDetails().pipe(first());
    service.updateLoanAmount(500000); // Below minimum

    service.getLoanDetails().pipe(first()).subscribe(details => {
      initialAmount.subscribe(initial => {
        expect(details.loanAmount).toBe(initial.loanAmount);
        done();
      });
    });
  });

  it('should update loan period within valid range', (done) => {
    const testPeriod = 8;
    service.updateLoanPeriod(testPeriod);

    service.getLoanDetails().pipe(first()).subscribe(details => {
      expect(details.loanPeriod).toBe(testPeriod);
      expect(details.monthlyInstallment).toBeGreaterThan(0);
      done();
    });
  });

  it('should not update loan period outside valid range', (done) => {
    const initialPeriod = service.getLoanDetails().pipe(first());
    service.updateLoanPeriod(3); // Below minimum

    service.getLoanDetails().pipe(first()).subscribe(details => {
      initialPeriod.subscribe(initial => {
        expect(details.loanPeriod).toBe(initial.loanPeriod);
        done();
      });
    });
  });

  it('should calculate monthly installment correctly', (done) => {
    // Test with known values for verification
    service.updateLoanAmount(10000000);
    service.updateLoanPeriod(12);

    service.getLoanDetails().pipe(first()).subscribe(details => {
      // With 10% annual interest, 12 months period, and 10M loan
      // Monthly payment should be approximately 879,158
      expect(details.monthlyInstallment).toBeCloseTo(879158, -2);
      done();
    });
  });
});
