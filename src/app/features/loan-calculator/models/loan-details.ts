export interface LoanDetails {
  maxFunding: number;
  vehicleName: string;
  vehicleYear: number;
  loanAmount: number;
  loanPeriod: number;
  monthlyInstallment: number;
}

export interface LoanRange {
  min: number;
  max: number;
}

export interface LoanPeriodRange {
  min: number;
  max: number;
}
