import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Output,EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { MasterService } from '../../../master.service';

@Component({
  selector: 'app-flight-policy',
  templateUrl: './flight-policy.component.html',
  styleUrls: ['./flight-policy.component.scss']
})
export class FlightPolicyComponent implements OnInit {

    flightPolicyForm:FormGroup;
    @Output() moveToTab=new EventEmitter<String>();
    cabinList:Array<any>=[
        {name:'Economy',isChecked:false},
        {name:'Premium Economy',isChecked:false},
        {name:'Business',isChecked:false},
        {name:'First',isChecked:false},
        {name:'Any',isChecked:false}
    ]
    listHeader:Array<string>=['Cabin Class','Onward Upper Limit','Return Upper Limit']
    cabin:Array<string>=[];
    approverNameList=[]
    private subSunk = new SubSink();
    protected subs = new SubSink();
    removeButton:boolean;
    approvarList:Array<string>=[];
    submitted:boolean;
    selectedPosition='';
    searchedList: Array<any> = Array();
    sectorIndex:0;
    control;
    
    constructor(
        private fb:FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService:SwalService,
        private masterService:MasterService,
        private cdf:ChangeDetectorRef
    ) { }
  
    ngOnInit() {
        this.getApprovarList();
        this.createFlightPolicyForm();
        this.masterService.golobalPositionName.subscribe(data => {
            if (data.constructor != Object) {
                this.selectedPosition = data;
            }
        }
        )
        this.updatePreFilledData();
    }
  
    createFlightPolicyForm(){
      this.flightPolicyForm=this.fb.group({
        airDomestic:new FormControl('',[Validators.required]),
        airInternational:new FormControl('',[Validators.required]),
        cabin:new FormControl('',[Validators.required]),
        domesticLimit:this.fb.group({
            domesticEconomyClass:this.fb.group({
                eOnwardUpperLimit:new FormControl(''),
                eReturnUpperLimit:new FormControl('')
            }),
            domesticPremiumEconomyClass:this.fb.group({
                pOnwardUpperLimit:new FormControl(''),
                pReturnUpperLimit:new FormControl('')
            }),
            domesticBusinessClass:this.fb.group({
                bOnwardUpperLimit:new FormControl(''),
                bReturnUpperLimit:new FormControl('')
            }),
            domesticFirstClass:this.fb.group({
                fOnwardUpperLimit:new FormControl(''),
                fReturnUpperLimit:new FormControl('')
            }),
            domesticDisplayBeyondLimit:new FormControl('true')
        }),
        internationalLimit:this.fb.group({
            domesticEconomyClass:this.fb.group({
                eOnwardUpperLimit:new FormControl(''),
                eReturnUpperLimit:new FormControl('')
            }),
            domesticPremiumEconomyClass:this.fb.group({
                pOnwardUpperLimit:new FormControl(''),
                pReturnUpperLimit:new FormControl('')
            }),
            domesticBusinessClass:this.fb.group({
                bOnwardUpperLimit:new FormControl(''),
                bReturnUpperLimit:new FormControl('')
            }),
            domesticFirstClass:this.fb.group({
                fOnwardUpperLimit:new FormControl(''),
                fReturnUpperLimit:new FormControl('')
            }),
            internationalDisplayBeyondLimit:new FormControl('true')
        }),
        isSector:new FormControl('',[Validators.required]),
        bufferAmount:new FormControl('',[Validators.required]),
        bufferType:new FormControl('',[Validators.required]),
        isDayToDeparture:new FormControl('',[Validators.required]),
        approval:this.fb.group({
            approverOne:this.fb.group({
                levelOneApprover:new FormControl('',),
                levelOneApproverName:new FormControl('')
            }),
            approverTwo:this.fb.group({
                levelTwoApprover:new FormControl('',),
                levelTwoApproverName:new FormControl('',),
            })
        }),
        sector:this.fb.array([]),
        askingForReason:new FormControl('true'),
        daysToDepart:new FormControl('', Validators.pattern('^[0-9]*$')),
        beyoundDaysToDepart:new FormControl('true')
      })
    //   this.addFormField('initail')
    }

    get sector() {
        return this.flightPolicyForm.get('sector') as FormArray;
    }

    addFormField(additionalControl:string){
        const sector=this.fb.group({
            fromAirport:new FormControl('',[Validators.required]),
            toAirport:new FormControl('',[Validators.required]),
        });
        this.sector.push(sector);
        if(additionalControl=='add'){
            this.removeButton=true;
        }
    }

    removeFormField(index: number) {
        if(index!=0){
            this.sector.removeAt(index);
        }
    }

    updatePreFilledData(){
        this.subSunk.sink=this.masterService.policyUpdateData.subscribe((data=>{
            if(data){
                this.flightPolicyForm.patchValue({
                'airDomestic': String(data.air_dom),
                'airInternational': String(data.air_int),
                'cabin': data.cabin,
                'domesticLimit': {
                    'domesticDisplayBeyondLimit': String(data.dom_beyond_limit)
                },
                'internationalLimit': {
                    'internationalDisplayBeyondLimit': String(data.int_beyond_limit)
                },
                'isSector': String(data.flight_is_short_sector),
                'bufferAmount': (+data.bufferAmount),
                'bufferType': String(data.bufferType),
                'isDayToDeparture': String(data.flight_is_day_to_departure),
                'approval': {
                    'approverOne': {
                    'levelOneApprover': String(data.level_one_approval),
                    'levelOneApproverName': data.level_one_approval_user_id
                    },
                    'approverTwo': {
                    'levelTwoApprover': String(data.level_two_approval),
                    'levelTwoApproverName': data.level_two_approval_user_id
                    }
                },
                'askingForReason': String(data.flight_display_asking_for_a_reason),
                'daysToDepart': data.flight_departure_noOfDays,
                'beyoundDaysToDepart': String(data.beyond_days)
                });
                data['policyFlights'].forEach(item=>{
                    if(item.cabin != undefined && item.cabin==1){
                        if(item.trip_type != undefined && item.trip_type==1){
                            this.flightPolicyForm.patchValue({
                                'domesticLimit': {
                                    'domesticEconomyClass': {
                                    'eOnwardUpperLimit': item.upper_limit,
                                    'eReturnUpperLimit': item.return_upper_limit
                                    }
                                } 
                            })
                        } else{
                            this.flightPolicyForm.patchValue({
                                'internationalLimit': {
                                    'domesticEconomyClass': {
                                    'eOnwardUpperLimit': item.upper_limit,
                                    'eReturnUpperLimit': item.return_upper_limit
                                    }
                                }
                            })
                        }
                    }
                    if(item.cabin != undefined && item.cabin==2){
                        if(item.trip_type != undefined && item.trip_type==1){
                            this.flightPolicyForm.patchValue({
                                'domesticLimit': {
                                    'domesticBusinessClass': {
                                    'bOnwardUpperLimit': item.upper_limit,
                                    'bReturnUpperLimit': item.return_upper_limit
                                    }
                                } 
                            })
                        } else{
                            this.flightPolicyForm.patchValue({
                                'internationalLimit': {
                                    'domesticBusinessClass': {
                                    'bOnwardUpperLimit': item.upper_limit,
                                    'bReturnUpperLimit': item.return_upper_limit
                                    }
                                }
                            })
                        }
                    }
                    if(item.cabin != undefined && item.cabin==3){
                        if(item.trip_type != undefined && item.trip_type==1){
                            this.flightPolicyForm.patchValue({
                                'domesticLimit': {
                                    'domesticFirstClass': {
                                    'fOnwardUpperLimit': item.upper_limit,
                                    'fReturnUpperLimit': item.return_upper_limit
                                    }
                                } 
                            })
                        } else{
                            this.flightPolicyForm.patchValue({
                                'internationalLimit': {
                                    'domesticFirstClass': {
                                    'fOnwardUpperLimit': item.upper_limit,
                                    'fReturnUpperLimit': item.return_upper_limit
                                    }
                                }
                            })
                        }
                    }
                    if(item.cabin != undefined && item.cabin==4){
                        if(item.trip_type != undefined && item.trip_type==1){
                            this.flightPolicyForm.patchValue({
                                'domesticLimit': {
                                    'domesticPremiumEconomyClass': {
                                    'pOnwardUpperLimit': item.upper_limit,
                                    'pReturnUpperLimit': item.return_upper_limit
                                    }
                                } 
                            })
                        } else{
                            this.flightPolicyForm.patchValue({
                                'internationalLimit': {
                                    'domesticPremiumEconomyClass': {
                                    'pOnwardUpperLimit': item.upper_limit,
                                    'pReturnUpperLimit': item.return_upper_limit
                                    }
                                }
                            })
                        }
                    }
                })
                // data['flight_short_sector']= data['flight_short_sector'] ? JSON.parse(data['flight_short_sector']):[];
                if (typeof data['flight_short_sector'] === 'string') {
                    data['flight_short_sector'] = JSON.parse(data['flight_short_sector']);
                }
                if(data['flight_short_sector']!=undefined && data['flight_short_sector'].length>0){
                    const sectors = this.flightPolicyForm.get('sector') as FormArray;
                    sectors.clear();
                    for(let i=0;i<data['flight_short_sector'].length;i++){
                        sectors.push(this.fb.group({
                            fromAirport: new FormControl(''),
                            toAirport: new FormControl(''),
                        }));
                    }
                    let policyDataArray=[]
                    data['flight_short_sector'].forEach((item)=>{
                        policyDataArray.push({
                            'fromAirport':item.fromAirport,
                            'toAirport':item.toAirport
                        })
                    })

                    policyDataArray.forEach((newData, index) => {
                        const sector = sectors.at(index) as FormGroup;
                        if(sector){
                            sector.patchValue(newData);
                        }
                    });
                }
                this.cabin=data.cabin.split(',').map(c => c.trim());
                this.cabin = this.cabin.reduce((acc, value) => {
                    if (value !== '') {
                        acc.push(value);
                    }
                    return acc;
                }, []);
                this.cabinList.forEach(item => {
                    if (this.cabin.includes(item.name)) {
                        item.isChecked = true;
                    }
                });

                this.approvalValidationSet(String(data.level_one_approval),'1');
                this.approvalValidationSet(String(data.level_two_approval),'2')
            }
        }))
    }
    

    getApporverList() {
        
    }

    checkBoxSelection(inputEvent: any, checkedItem: string) {
        const isChecked = inputEvent.target.checked;
        if (checkedItem === 'Any') {
            this.setAllItems(isChecked);
        } else {
            if (isChecked) {
                this.cabin.push(checkedItem);
            } else {
                this.cabin = this.cabin.filter(item => !item.toLowerCase().includes(checkedItem.toLowerCase()));
            }
        }
    }
    
    setAllItems(isChecked) {
        this.cabin = isChecked ? ['Economy','Premium Economy', 'Business', 'First'] : [];
        this.cabinList.forEach(item => {
            item.isChecked = isChecked && this.cabin.includes(item.value);
        });
    }
    

    checkSectorEnable(inputField:any){
        return this.flightPolicyForm.get(inputField).value=='true';
    }

    getApprovarList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getApprovalList', 'post', {}, {},
            {is_approvar:true})
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.approvarList=res.data;
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
    }

    approverRequired(apprNo:any){
        if(apprNo==1){
            return (this.flightPolicyForm.get('approval.approverOne') as FormGroup).get('levelOneApprover').value=='true'
        } else{
            return (this.flightPolicyForm.get('approval.approverTwo') as FormGroup).get('levelTwoApprover').value=='true'
        }
    }

    approvalValidationSet(value,type){
        if(type=='1'){
            const approval=this.flightPolicyForm.get('approval.approverOne') as FormGroup;
            const levelOneApproverNameControl = approval.get('levelOneApproverName');
            if(value=='true'){
                 levelOneApproverNameControl.setValidators([Validators.required]);
            } else {
                levelOneApproverNameControl.setValidators(null);
            }
            levelOneApproverNameControl.updateValueAndValidity();

        } else{
            const approval=this.flightPolicyForm.get('approval.approverTwo') as FormGroup;
            const levelTwoApproverNameControl = approval.get('levelTwoApproverName');
            if(value=='true'){
                levelTwoApproverNameControl.setValidators([Validators.required]);
            } else {
                levelTwoApproverNameControl.setValidators(null);
            }
            levelTwoApproverNameControl.updateValueAndValidity();
        }
        this.cdf.detectChanges();
    }

    sortSectionValidationSet(value){
        const askingReason= this.flightPolicyForm.get('askingForReason');
        if(value=='true'){
            askingReason.clearValidators();
            askingReason.reset();
            this.flightPolicyForm.setControl('askingForReason', this.fb.control('true', [Validators.required]));
            this.addFormField('initail');
            askingReason.updateValueAndValidity();
        }
        else{
            this.flightPolicyForm.setControl('askingForReason', this.fb.control(''));
            this.sector.removeAt(0);
            askingReason.updateValueAndValidity();
        }
    }

    setDayToDepartValidation(value){
        const isDayDept = this.flightPolicyForm.get('daysToDepart');
        if(value=='true'){
            isDayDept.clearValidators();
            isDayDept.reset();
            this.flightPolicyForm.setControl('daysToDepart', this.fb.control('', [Validators.required, Validators.pattern('^[0-9]*$')]));
            this.flightPolicyForm.setControl('beyoundDaysToDepart', this.fb.control('true', [Validators.required]));
            isDayDept.updateValueAndValidity();
        } else {
            this.flightPolicyForm.setControl('daysToDepart', this.fb.control(''));
            this.flightPolicyForm.setControl('beyoundDaysToDepart', this.fb.control(''));
            isDayDept.updateValueAndValidity();
        }
    }


    onSubmit(){
        this.submitted=true;
        if(!this.flightPolicyForm.valid){
            return;
        }
        if(this.cabin.length==0){
            return;
        }
        if(this.selectedPosition==''){
            this.swalService.alert.oops('Select Position Name')
            return;
        }
        const domesticLimit = this.flightPolicyForm.get('domesticLimit') as FormGroup;
        const internationalLimit = this.flightPolicyForm.get('internationalLimit') as FormGroup;
        const domesticFirstClassGroupDom = this.flightPolicyForm.get('domesticLimit.domesticFirstClass') as FormGroup;
        const domesticBusinessClassGroupDom = this.flightPolicyForm.get('domesticLimit.domesticBusinessClass') as FormGroup;
        const domesticEconomyClassDom = this.flightPolicyForm.get('domesticLimit.domesticEconomyClass') as FormGroup;
        const domesticPremuimEconomyDom = this.flightPolicyForm.get('domesticLimit.domesticPremiumEconomyClass') as FormGroup;
        const firstClassGroupInt = this.flightPolicyForm.get('internationalLimit.domesticFirstClass') as FormGroup;
        const businessClassInt = this.flightPolicyForm.get('internationalLimit.domesticBusinessClass') as FormGroup;
        const economyClassInt = this.flightPolicyForm.get('internationalLimit.domesticEconomyClass') as FormGroup;
        const premuimeconomyClassInt = this.flightPolicyForm.get('internationalLimit.domesticPremiumEconomyClass') as FormGroup;
        const approvalOne = this.flightPolicyForm.get('approval.approverOne') as FormGroup;
        const approvalTwo = this.flightPolicyForm.get('approval.approverTwo') as FormGroup;
        let flightSector;
        let sectValue=(this.flightPolicyForm.get('sector') as FormArray).value;
        const isSector=this.flightPolicyForm.get('isSector').value;
        if(isSector=='true'){
            flightSector = (this.flightPolicyForm.get('sector') as FormArray).value;;
        }
        const flightData= {
            air_dom : JSON.parse(this.flightPolicyForm.get('airDomestic').value ? this.flightPolicyForm.get('airDomestic').value :false),
            air_int : JSON.parse(this.flightPolicyForm.get('airInternational').value ? this.flightPolicyForm.get('airInternational').value : false),
            dom_beyond_limit : JSON.parse(domesticLimit.get('domesticDisplayBeyondLimit').value ? domesticLimit.get('domesticDisplayBeyondLimit').value :false),
            int_beyond_limit : JSON.parse(internationalLimit.get('internationalDisplayBeyondLimit').value ? internationalLimit.get('internationalDisplayBeyondLimit').value :false),
            level_one_approval : JSON.parse(approvalOne.get('levelOneApprover').value ? approvalOne.get('levelOneApprover').value :false),
            level_one_approval_user_id : approvalOne.get('levelOneApproverName').value ? approvalOne.get('levelOneApproverName').value :'',
            level_two_approval : JSON.parse(approvalTwo.get('levelTwoApprover').value ? approvalTwo.get('levelTwoApprover').value :false),
            level_two_approval_user_id : approvalTwo.get('levelTwoApproverName').value ? approvalTwo.get('levelTwoApproverName').value :'',
            beyond_days : JSON.parse(this.flightPolicyForm.get('beyoundDaysToDepart').value ? this.flightPolicyForm.get('beyoundDaysToDepart').value : false),
            cabin : this.cabin.join(','),
            bufferType : this.flightPolicyForm.get('bufferType').value,
            bufferAmount : +(this.flightPolicyForm.get('bufferAmount').value),
            flight_departure_noOfDays : JSON.parse(this.flightPolicyForm.get('daysToDepart').value ? this.flightPolicyForm.get('daysToDepart').value : "0"),
            // flight_departure_approvar_name //isDayToDeparture
            flight_is_day_to_departure : JSON.parse(this.flightPolicyForm.get('isDayToDeparture').value ? this.flightPolicyForm.get('isDayToDeparture').value :false),
            flight_is_short_sector : JSON.parse(this.flightPolicyForm.get('isSector').value ? this.flightPolicyForm.get('isSector').value :false),
            flight_short_sector : JSON.stringify(flightSector ? flightSector : []),
            flight_display_asking_for_a_reason : JSON.parse(this.flightPolicyForm.get('askingForReason').value ? this.flightPolicyForm.get('askingForReason').value :false),
            flights:[
                {
                    cabin:1,//economy
                    upper_limit:Number(domesticEconomyClassDom.get('eOnwardUpperLimit').value),
                    return_upper_limit:Number(domesticEconomyClassDom.get('eReturnUpperLimit').value),
                    grace_ul:0,
                    grace_rul:0,
                    trip_type:1 // domestic
                },
                {
                    cabin:2, // business
                    upper_limit:Number(domesticBusinessClassGroupDom.get('bOnwardUpperLimit').value),
                    return_upper_limit:Number(domesticBusinessClassGroupDom.get('bReturnUpperLimit').value),
                    grace_ul:0,
                    grace_rul:0,
                    trip_type:1 // domestic
                },
                {
                    cabin:3, //first class
                    upper_limit:Number(domesticFirstClassGroupDom.get('fOnwardUpperLimit').value),
                    return_upper_limit:Number(domesticFirstClassGroupDom.get('fReturnUpperLimit').value),
                    grace_ul:0,
                    grace_rul:0,
                    trip_type:1 // domestic
                },
                {
                    cabin:4, //Premium Economy class
                    upper_limit:Number(domesticPremuimEconomyDom.get('pOnwardUpperLimit').value),
                    return_upper_limit:Number(domesticPremuimEconomyDom.get('pReturnUpperLimit').value),
                    grace_ul:0,
                    grace_rul:0,
                    trip_type:1 // domestic
                },
                {
                    cabin:1,//economy
                    upper_limit:Number(economyClassInt.get('eOnwardUpperLimit').value),
                    return_upper_limit:Number(economyClassInt.get('eReturnUpperLimit').value),
                    grace_ul:0,
                    grace_rul:0,
                    trip_type:2 // international
                },
                {
                    cabin:2, // business
                    upper_limit:Number(businessClassInt.get('bOnwardUpperLimit').value),
                    return_upper_limit:Number(businessClassInt.get('bReturnUpperLimit').value),
                    grace_ul:0,
                    grace_rul:0,
                    trip_type:2 // international
                },
                {
                    cabin:3, //first class
                    upper_limit:Number(firstClassGroupInt.get('fOnwardUpperLimit').value),
                    return_upper_limit:Number(firstClassGroupInt.get('fReturnUpperLimit').value),
                    grace_ul:0,
                    grace_rul:0,
                    trip_type:2 // international
                },
                {
                    cabin:4, //Premium Economy class
                    upper_limit:Number(premuimeconomyClassInt.get('pOnwardUpperLimit').value),
                    return_upper_limit:Number(premuimeconomyClassInt.get('pReturnUpperLimit').value),
                    grace_ul:0,
                    grace_rul:0,
                    trip_type:2 // international
                }
            ]
        }
        console.log(flightData);
        this.masterService.flightPolicyData.next(flightData);
        this.moveToTab.emit('hotel')
    }


    getCity(event: any,controlArray,controlName): void {
        let city = `${event.AirportCode}`;
        if (city) {
            if(controlName=="fromAirport"){
                controlArray.patchValue({
                    fromAirport:city
                })
            }
            else{
                controlArray.patchValue({
                    toAirport:city
                })
            }
        }
    }

    getSearchedList(event: any,index,control): void {
        this.sectorIndex=index;
        this.control=control
        // if (event.target.id === 'departureCity') {
        //     this.depart = true;
        // } else if (event.target.id === 'destinationCity') {
        //     this.depart = false;
        // }
         if (event && event.target.value) {
            const text = `${event.target.value}`.trim();
            if(text && text.length>=3){
                this.apiHandlerService.apiHandler('airportList', 'POST', '', '', { text })
                .subscribe((resp: any) => {
                    if (resp.Status) {
                        this.searchedList = resp.data;
                    } else {
                        const msg = resp['Message'];
                        this.searchedList=[];
                    }
                    
                });
            }
            else{
                this.searchedList=[];
            }
        }
    }



}
