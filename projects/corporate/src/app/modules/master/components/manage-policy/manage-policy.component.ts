import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-manage-policy',
  templateUrl: './manage-policy.component.html',
  styleUrls: ['./manage-policy.component.scss']
})
export class ManagePolicyComponent implements OnInit {

  policyPositionForm:FormGroup
  selectedTab: string = 'flight';
  positionList=[]; 
  private subSunk = new SubSink();
  protected subs = new SubSink();
  update:boolean=false; 

  constructor(
        private fb:FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService:SwalService,
        private masterService:MasterService
  ) { }

  ngOnInit() {
    this.masterService.golobalPositionName.next({});
    this.update=false;
    this.createPolicyPosition();
    this.getPositionList();
    localStorage.removeItem('positionId');
    this.updatePreFilledData();
  }

  createPolicyPosition(){
    this.policyPositionForm=this.fb.group({
        positionName:new FormControl('null',[Validators.required])
    })
  }
  updatePreFilledData(){
    this.subSunk.sink=this.masterService.policyUpdateData.subscribe(data=>{
        if(data.position_name){
            this.update=true;
            const position={
                position_name:data.position_name,
                id:data.position_id
            }
            this.positionList=[];
            this.positionList.push(position);
            localStorage.setItem('positionId', data.position_id);
            this.masterService.golobalPositionName.next(data.position_id)
            this.policyPositionForm.patchValue({'positionName':data.position_id})
         }
    })
}

  getPositionList(): void {
    this.subSunk.sink = this.apiHandlerService.apiHandler('getPosition', 'post', {}, {},{
    })
      .subscribe(res => {
          if (res.statusCode == 200 || res.statusCode == 201) {
            this.positionList=res.data;
          }
        },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
     });
  }

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  positionSelected(event:any){
    const positionId=event.target.value;
    localStorage.setItem('positionId', positionId);
    this.masterService.golobalPositionName.next(positionId)
  }

}
