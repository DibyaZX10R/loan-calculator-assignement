import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoanCalculatorService } from '../services/loan-calculator.service';
import { LoanDetails, LoanRange, LoanPeriodRange } from '../models/loan-details';

@Component({
  selector: 'app-loan-calculator',
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.scss']
})
export class LoanCalculatorComponent implements OnInit, OnDestroy {
  loanDetails!: LoanDetails;
  loanRange!: LoanRange;
  loanPeriodRange!: LoanPeriodRange;
  private destroy$ = new Subject<void>();

  constructor(private loanCalculatorService: LoanCalculatorService) {}

  ngOnInit(): void {
    this.loanRange = this.loanCalculatorService.getLoanRange();
    this.loanPeriodRange = this.loanCalculatorService.getLoanPeriodRange();

    this.loanCalculatorService.getLoanDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(details => {
        this.loanDetails = details;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLoanAmountChange(amount: number): void {
    this.loanCalculatorService.updateLoanAmount(amount);
  }

  onLoanPeriodChange(period: number): void {
    this.loanCalculatorService.updateLoanPeriod(period);
  }

  onApplyLoan(): void {
    console.log('Loan Application Details:', {
      maxFunding: this.formatCurrency(this.loanDetails.maxFunding),
      vehicleName: this.loanDetails.vehicleName,
      vehicleYear: this.loanDetails.vehicleYear,
      loanAmount: this.formatCurrency(this.loanDetails.loanAmount),
      loanPeriod: this.formatPeriod(this.loanDetails.loanPeriod),
      monthlyInstallment: this.formatCurrency(this.loanDetails.monthlyInstallment)
    });
  }

  formatCurrency(value: number): string {
    return `Rp ${value.toLocaleString()}`;
  }

  formatPeriod(value: number): string {
    return `${value} Months`;
  }
}
