import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from 'src/models/transaction.model';

const validator = (form: FormGroup, field: string) => async (value: AbstractControl) => {
  const currency = form.get('currency')?.value;
  const amount = form.get('amount')?.value;

  if (currency === 'EUR' && amount < 1000) return { min: true };
  if (currency === 'DKK' && amount < 50) return { min: true };

  if (field === 'currency') {
    form.get('amount')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  return null;
}

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit {

  form = new FormGroup({
    amount: new FormControl(0),
    currency: new FormControl('DKK')
  })

  transaction$ = new BehaviorSubject<Transaction>({
    amount: 0,
    currency: "DKK",
    symbol: "kr"
  })

  constructor() { }


  ngOnInit(): void {
    this.form.get('amount')?.addAsyncValidators(validator(this.form, 'amount'))
    this.form.get('currency')?.addAsyncValidators(validator(this.form, 'currency'))
  }

}
