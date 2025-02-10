import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanCalculatorComponent } from './loan-calculator/loan-calculator.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoanCalculatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    LoanCalculatorComponent
  ]
})
export class LoanCalculatorModule { }
