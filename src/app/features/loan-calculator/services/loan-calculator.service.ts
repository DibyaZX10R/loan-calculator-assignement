import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoanDetails, LoanRange, LoanPeriodRange } from '../models/loan-details';

@Injectable({
  providedIn: 'root'
})
export class LoanCalculatorService {
  private readonly INTEREST_RATE = 0.1; // 10% annual interest rate

  private loanDetailsSubject = new BehaviorSubject<LoanDetails>({
    maxFunding: 17484500,
    vehicleName: 'Honda ADV 150 CBS',
    vehicleYear: 2022,
    loanAmount: 14500000,
    loanPeriod: 12,
    monthlyInstallment: 0
  });

  private readonly loanRange: LoanRange = {
    min: 1000000,
    max: 17484500
  };

  private readonly loanPeriodRange: LoanPeriodRange = {
    min: 6,
    max: 15
  };

  constructor() {
    this.calculateMonthlyInstallment();
  }

  getLoanDetails(): Observable<LoanDetails> {
    return this.loanDetailsSubject.asObservable();
  }

  getLoanRange(): LoanRange {
    return this.loanRange;
  }

  getLoanPeriodRange(): LoanPeriodRange {
    return this.loanPeriodRange;
  }

  updateLoanAmount(amount: number): void {
    if (amount >= this.loanRange.min && amount <= this.loanRange.max) {
      const currentDetails = this.loanDetailsSubject.value;
      this.loanDetailsSubject.next({
        ...currentDetails,
        loanAmount: amount
      });
      this.calculateMonthlyInstallment();
    }
  }

  updateLoanPeriod(period: number): void {
    if (period >= this.loanPeriodRange.min && period <= this.loanPeriodRange.max) {
      const currentDetails = this.loanDetailsSubject.value;
      this.loanDetailsSubject.next({
        ...currentDetails,
        loanPeriod: period
      });
      this.calculateMonthlyInstallment();
    }
  }

  private calculateMonthlyInstallment(): void {
    const currentDetails = this.loanDetailsSubject.value;
    const monthlyInterestRate = this.INTEREST_RATE / 12;
    const numberOfPayments = currentDetails.loanPeriod;

    // Monthly Payment = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    // where P = Principal, r = monthly interest rate, n = number of payments
    const monthlyPayment =
      (currentDetails.loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    this.loanDetailsSubject.next({
      ...currentDetails,
      monthlyInstallment: Math.round(monthlyPayment)
    });
  }
}
