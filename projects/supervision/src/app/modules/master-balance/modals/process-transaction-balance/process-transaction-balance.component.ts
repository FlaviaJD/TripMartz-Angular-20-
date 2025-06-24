import { Component, OnInit, Inject } from '@angular/core';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { AppService } from 'projects/supervision/src/app/app.service';


const log = new Logger('MasterBalanceManager/ProcessTransactionBalanceComponent')

@Component({
    selector: 'app-process-transaction-balance',
    templateUrl: './process-transaction-balance.component.html',
    styleUrls: ['./process-transaction-balance.component.scss']
})
export class ProcessTransactionBalanceComponent implements OnInit {
    regConf: FormGroup;
    defaultCurrency: string = '';
    constructor(
        private formBuilder: FormBuilder,
        private matDialogRef: MatDialogRef<ProcessTransactionBalanceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private util: UtilityService,
        private appService: AppService
    ) { }

    ngOnInit() {
        this.defaultCurrency = this.appService.defaultCurrency;
        this.createForm();
        this.regConf.patchValue({
            status: this.data['transaction_status']
        });
        let currentUser = this.util.readStorage('currentSupervisionUser', localStorage);
        this.data['processedby'] = currentUser['first_name'] + ' ' + currentUser['last_name'];
    }

    createForm(): void {
        this.regConf = this.formBuilder.group({
            status: new FormControl('', [Validators.required]),
            remarks: new FormControl('',[Validators.required])
        })
    }

    save() {
        log.debug(this.regConf.value)
        if (!this.regConf.valid)
            return;
       this.matDialogRef.close(Object.assign(this.data, this.regConf.value));
    }

    close() {
        this.matDialogRef.close({});
    }
}
