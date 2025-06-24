import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers/api-handlers.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

@Component({
    selector: 'app-add-currency',
    templateUrl: './add-currency.component.html',
    styleUrls: ['./add-currency.component.scss']
})
export class AddCurrencyComponent implements OnInit {
    currencyConfig: FormGroup;
    constructor(
        private fb: FormBuilder,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private router: Router
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.currencyConfig = this.fb.group({
            currency: new FormControl('', [Validators.required]),
            status: new FormControl('', [Validators.required]),
            value: new FormControl('', [Validators.required]),
        });
    }

    onUpdateStatus(event, data) {
        if (event && event.checked) {
            data.status = 1;
        }
        else {
            data.status = 0;
        }
    }

    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
      }

      onSubmit(){
          if (this.currencyConfig.invalid)
          return;
          else
          this.addCurrency(this.currencyConfig);
      }

    addCurrency(currencyConfig) {
        if (currencyConfig && currencyConfig.value) {
            currencyConfig.value.value = currencyConfig.value.value.toString();
            currencyConfig.value.currency = currencyConfig.value.currency.toUpperCase();
            this.apiHandlerService.apiHandler('addCurrencyConversion', 'POST', {}, {}, currencyConfig.value).subscribe(resp => {
                if (resp && resp.Status) {
                    this.swalService.alert.success("Currency added successfully.");
                    this.router.navigate(['/settings/currencyConversion']);
                }
            }, (err) => {
                if (err && err.error && err.error && err.error.Message) {
                    this.swalService.alert.oops(err.error.Message);
                }
            });
        }
    }

      onReset(){
        this.currencyConfig.reset();
      }

}
