import { Component } from '@angular/core';
import { LoanCalculatorModule } from './features/loan-calculator/loan-calculator.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoanCalculatorModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'loan-calculator';
}
