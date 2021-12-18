import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-edit-money-form',
  templateUrl: './edit-money-form.component.html',
  styleUrls: ['./edit-money-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditMoneyFormComponent),
      multi: true
    }
  ]
})
export class EditMoneyFormComponent implements OnInit {

  @Input()
  public form: FormGroup = new FormGroup({
    amount: new FormControl(),
    currency: new FormControl()
  });

  get amount(): AbstractControl | null {    
    return this.form.get('amount');
  }

  get currency() {
    return this.form.get('currency');
  }

  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    // this.form = <FormGroup>this.controlContainer.control;
    // this.form.get('amount')?.addAsyncValidators(validator(this.form, 'amount'))
    // this.form.get('currency')?.addAsyncValidators(validator(this.form, 'currency'))
  }

  onFormSubmit(): void {
    debugger;
  }

}
