import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { MasterService } from '../../../master.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-policy',
  templateUrl: './hotel-policy.component.html',
  styleUrls: ['./hotel-policy.component.scss']
})
export class HotelPolicyComponent implements OnInit {

    hotelPolicyForm:FormGroup;
    isUpdate: boolean;
    @Output() moveToTab=new EventEmitter<String>();
    starCategoryList:Array<any>=[
        {name:'1',isChecked:false},
        {name:'2',isChecked:false},
        {name:'3',isChecked:false},
        {name:'4',isChecked:false},
        {name:'5',isChecked:false}
    ]
    starCategoryCheckedList:Array<any>=[];
    citiesNameList:Array<string> =[];
    private subSunk = new SubSink();
    protected subs = new SubSink();
    positionList=[] 
    noOfDays='' ;
    removeButton:boolean;
    selectedMetroCities: any[] = []; 
    selectedMiniCities: any[] = [];
    selectedNonMetroCities: any[] = [];
    dropdownSettings = {
        singleSelection: false,
        idField: 'city_code', 
        textField: 'city_name',
        enableCheckAll: true,
        itemsShowLimit: 3,
        allowSearchFilter: true,
        closeDropDownOnSelection: false, 
        noDataAvailablePlaceholderText: 'No data available',
        showSelectedItemsAtTop: true, 
        defaultOpen: false, 
        searchPlaceholderText: 'Search...', 
        groupBy: 'group', 
        maxHeight: 200, 
        position: 'bottom', 
        autoPosition: false, 
        showCheckbox: true, 
        disabled: false 
      };

    constructor(
        private fb:FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private masterService: MasterService,
        private swalService: SwalService,
        private route: Router
    ) { }
  
    ngOnInit() {
      this.getCityName()
      this.getPositionList()
      this.createHotelPolicyForm();
      this.updatePreFilledData();
    }
  
    createHotelPolicyForm(){
      this.hotelPolicyForm=this.fb.group({
        hotelDomestic:new FormControl('',[Validators.required]),
        hotelInternational:new FormControl('',[Validators.required]),
        starCategory:new FormControl('',[Validators.required]),
        beyondTheLimit:new FormControl('',[Validators.required]),
        generic_budget_limit:new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]),
        cities:this.fb.group({
            metro:new FormControl(''),
            miniMetro:new FormControl(''),
            nonMetro:new FormControl('')
        }),
        limit:this.fb.group({
            metro:new FormControl(''),
            miniMetro:new FormControl(''),
            nonMetro:new FormControl(''),
            displayBeyondLimit:new FormControl(true)
        }),
        isDayToDeparture:new FormControl(false),
        departInfo:this.fb.array([])
        // daysToDepart:new FormControl(''),
        // beyoundDaysToDepart:new FormControl(''),
        // departmentName:new FormControl('')
        
      })
      this.addFormField('initial')
    }

    get departInfo() {
        return this.hotelPolicyForm.get('departInfo') as FormArray;
    }

    addFormField(additionalControl:string){
        const depart=this.fb.group({
            daysToDepart:new FormControl(''),
            beyoundDaysToDepart:new FormControl(''),
            departmentName:new FormControl(''),
            departmentNameForGr:new FormControl(''),
            departmentNameForSm:new FormControl('')
        });
       
        this.departInfo.push(depart);
        if(additionalControl=='add'){
            this.removeButton=true;
        }
    }

    removeFormField(index: number) {
        if(index!=0){
            this.departInfo.removeAt(index);
        }
    }

    updatePreFilledData() {
        this.subSunk.sink = this.masterService.policyUpdateData.subscribe((data => {
            this.getCityName(true,data);
        }))
    }


    setMetroCity(item) {
        if (item.cities && typeof item.cities === 'string') {
            const selectedCities = item.cities.split(',').map(city => city.trim());
            this.selectedMetroCities= this.citiesNameList.filter((city: any) => selectedCities.includes(city.city_code));     
        }
    }

    setMiniCity(item) {
        if (item.cities && typeof item.cities === 'string') {
            const selectedCities = item.cities.split(',').map(city => city.trim());
            this.selectedMiniCities= this.citiesNameList.filter((city: any) => selectedCities.includes(city.city_code));     
        }
    }

    setNonMetroCity(item) {
        if (item.cities && typeof item.cities === 'string') {
            const selectedCities = item.cities.split(',').map(city => city.trim());
            this.selectedNonMetroCities= this.citiesNameList.filter((city: any) => selectedCities.includes(city.city_code));     
        }
    }

    getPositionList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPosition', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.positionList=res.data;
              }
            });
    }

    getCityName(value?,data?){
        this.subSunk.sink = this.apiHandlerService.apiHandler('autoCompleteCrs', 'post', {}, {},{
        })
        .subscribe(res => {
            if (res.statusCode == 200 || res.statusCode == 201) {
            this.citiesNameList=res.data;
            value?this.setUpdateData(data):null
            }
        });
    }

    setUpdateData(data){
        const limit = this.hotelPolicyForm.get('limit') as FormGroup;
            if (data) {
                this.hotelPolicyForm.patchValue({
                    'hotelDomestic': String(data.hotel_dom),
                    'hotelInternational': String(data.hotel_int),
                    //'starCategory': data.star_category,
                    'beyondTheLimit': String(data.beyond_star),
                    'generic_budget_limit': data.generic_budget_limit,
                    'isDayToDeparture': data.hotel_is_day_to_departure,
                });
                data['policyHotels'].forEach(item => {
                    if (item.type != undefined && item.type == 1) {
                        this.setMetroCity(item);
                        this.hotelPolicyForm.patchValue({
                            // 'cities': {
                            //     'metro': item.cities
                            // }, 
                            'limit': {
                                'metro': item.upper_limit
                            } 
                        })
                    }
                    if(item.type != undefined && item.type==2){
                        this.setMiniCity(item);
                        this.hotelPolicyForm.patchValue({
                            // 'cities': {
                            //     'miniMetro': item.cities
                            // }, 
                            'limit': {
                                'miniMetro': item.upper_limit
                            } 
                        })
                    }
                    if(item.type != undefined && item.type==3){
                        this.setNonMetroCity(item);
                        this.hotelPolicyForm.patchValue({
                            // 'cities': {
                            //     'nonMetro': item.cities
                            // }, 
                            'limit': {
                                'nonMetro': item.upper_limit
                            } 
                        })
                    }
                })
            }
            limit.patchValue({
                displayBeyondLimit:data.hotel_beyond_limit
            })
            // data['hotel_departure']=JSON.parse(data['hotel_departure'])
            if (typeof data['hotel_departure'] === 'string') {
                data['hotel_departure'] = JSON.parse(data['hotel_departure']);
            }
            if(data['hotel_departure']!=undefined && data['hotel_departure'].length){
                const departs = this.hotelPolicyForm.get('departInfo') as FormArray;
                departs.clear();
                for(let i=0;i<data['hotel_departure'].length;i++){
                    departs.push(this.fb.group({
                        daysToDepart:new FormControl(''),
                        beyoundDaysToDepart:new FormControl(''),
                        departmentName:new FormControl(''),
                        departmentNameForGr:new FormControl(''),
                        departmentNameForSm:new FormControl('')
                    }));
                }
                let policyDataArray=[]
                data['hotel_departure'].forEach((item)=>{
                    policyDataArray.push({
                        daysToDepart:item.daysToDepart,
                        beyoundDaysToDepart:String(item.beyoundDaysToDepart),
                        departmentName:item.departmentName,
                        departmentNameForGr:item.departmentNameForGr,
                        departmentNameForSm:item.departmentNameForSm
                    })
                })

                policyDataArray.forEach((newData, index) => {
                    const depart = departs.at(index) as FormGroup;
                    depart.patchValue(newData);
                });
            }
            this.starCategoryCheckedList=data.star_category.split(',').map(c => c.trim());
            this.starCategoryCheckedList = this.starCategoryCheckedList.reduce((acc, value) => {
                if (value !== '') {
                    acc.push(value);
                }
                return acc;
            }, []);

        this.hotelPolicyForm.get('starCategory').clearValidators();
        this.hotelPolicyForm.get('starCategory').updateValueAndValidity();
        this.starCategoryList.forEach(item => {
            if (this.starCategoryCheckedList.includes(item.name)) {
                item.isChecked = true;
            }
        });
        }

    setValidation(value){
        const departInfoArray = this.hotelPolicyForm.get('departInfo') as FormArray;
        if(value=='true'){
            departInfoArray.controls[0].get('departmentName').setValidators([Validators.required]);
            departInfoArray.controls[0].get('daysToDepart').setValidators([Validators.required]);
            departInfoArray.controls[0].get('beyoundDaysToDepart').setValidators([Validators.required]);
        }
        else {
            departInfoArray.controls[0].get('departmentName').clearValidators();
            departInfoArray.controls[0].get('daysToDepart').clearValidators();
            departInfoArray.controls[0].get('beyoundDaysToDepart').clearValidators();
            // After clearing validators, you need to update the form control's validity status
            departInfoArray.controls[0].get('departmentName').updateValueAndValidity();
            departInfoArray.controls[0].get('daysToDepart').updateValueAndValidity();
            departInfoArray.controls[0].get('beyoundDaysToDepart').updateValueAndValidity();
        }
    }

    checkBoxSelection(inputEvent:any,checkedItem:string){
        this.hotelPolicyForm.get('starCategory').setValidators([Validators.required]);
        this.hotelPolicyForm.get('starCategory').updateValueAndValidity();
        let isChecked=inputEvent.target.checked;
        if(isChecked){
            this.starCategoryCheckedList.push(checkedItem);
        } else{
            this.starCategoryCheckedList = this.starCategoryCheckedList.filter((item) => !item.includes(checkedItem));
        }
    }

    goToPreviousPage(){
        this.moveToTab.emit('flight')
    }

    departDateApprove(index){
        const departInfoArray = this.hotelPolicyForm.get('departInfo') as FormArray;
        const daysToDepartArray = departInfoArray.at(index).get('daysToDepart') as FormArray;
        this.noOfDays= daysToDepartArray.value;
        return this.noOfDays.length
    }

    onSubmit(){
        if(!this.hotelPolicyForm.valid){
            return;
        }
        const cities = this.hotelPolicyForm.get('cities') as FormGroup;
        const limit = this.hotelPolicyForm.get('limit') as FormGroup;
        let hotel;
        const isDepart=this.hotelPolicyForm.get('isDayToDeparture').value;
        if(isDepart=='true'){
            hotel = (this.hotelPolicyForm.get('departInfo') as FormArray).value;;
        }
        let selectedMetroCities= this.selectedMetroCities.map(value=>value.city_code);
        let selectedMiniCities= this.selectedMiniCities.map(value=>value.city_code);
        let selectedNonMetroCities= this.selectedNonMetroCities.map(value=>value.city_code);
        const hotelData= {
            hotel_dom : JSON.parse(this.hotelPolicyForm.get('hotelDomestic').value ? this.hotelPolicyForm.get('hotelDomestic').value : false),
            hotel_int : JSON.parse(this.hotelPolicyForm.get('hotelInternational').value ? this.hotelPolicyForm.get('hotelInternational').value : false), 
            beyond_star : JSON.parse(this.hotelPolicyForm.get('beyondTheLimit').value ? this.hotelPolicyForm.get('beyondTheLimit').value :false),
            hotel_beyond_limit : limit.get('displayBeyondLimit').value ? true :false,
            star_category : this.starCategoryCheckedList.join(','),
            generic_budget_limit: +this.hotelPolicyForm.get('generic_budget_limit').value,
            hotel_departure : JSON.stringify(hotel ? hotel : []),
            hotel_is_day_to_departure : false,
            hotels:[
                {
                    type:1,//economy
                    upper_limit:Number(limit.get('metro').value),
                    cities: selectedMetroCities.join(',')
                },
                {
                    type:2, // business
                    upper_limit:Number(limit.get('miniMetro').value),
                    cities: selectedMiniCities.join(',')
                },
                {
                    type:3, //first class
                    upper_limit:Number(limit.get('nonMetro').value),
                    cities: selectedNonMetroCities.join(',')
                }
            ]
        }
        this.masterService.hotelPolicyData.next(hotelData);
      let value= 0;
      const cabData= {
          car:+value,
          cabType:''
      }
      this.masterService.cabPolicyData.next(cabData);
      let flighPolicyInfo, hotelPolicyInfo,trainPolicyInfo,busPolicyInfo,cabPolicyInfo,postionId;
      let policyId
      let p=localStorage.getItem('positionId')
      this.masterService.flightPolicyData.subscribe((data)=>{
          flighPolicyInfo=data;
      })
      this.masterService.hotelPolicyData.subscribe((data)=>{
          hotelPolicyInfo=data;
      })

      this.masterService.trainPolicyData.subscribe((data)=>{
          trainPolicyInfo=data;
      })

      this.masterService.busPolicyData.subscribe((data)=>{
          busPolicyInfo=data;
      })

      this.masterService.cabPolicyData.subscribe((data)=>{
          cabPolicyInfo=data;
      })

      this.masterService.policyUpdateData.subscribe(item=>{
          if(item.position_name){
              this.isUpdate=true;
              policyId=item.id
          }
      })
      if(!this.isUpdate){
          this.subSunk.sink = this.apiHandlerService.apiHandler('addPolicy', 'post', {}, {},{
              position_id:Number(localStorage.getItem('positionId')),
              ...flighPolicyInfo,
              ...hotelPolicyInfo,
              ...busPolicyInfo,
              ...cabPolicyInfo,
              ...trainPolicyInfo

          })
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                  // this.positionList=res.data;
                  this.swalService.alert.success('Policy has been added sucessfully');
                  this.route.navigate(['master/policy-list']);
                }
              },(err: HttpErrorResponse) => {
                  this.swalService.alert.error(err['error']['Message']);
           });
      } else{
          this.subSunk.sink = this.apiHandlerService.apiHandler('updatePolicy', 'post', {}, {},{
              position_id:Number(localStorage.getItem('positionId')),
              id:policyId,
              ...flighPolicyInfo,
              ...hotelPolicyInfo,
              ...busPolicyInfo,
              ...cabPolicyInfo,
              ...trainPolicyInfo
          })
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                  this.swalService.alert.success('Policy has been updated sucessfully');
                  this.route.navigate(['master/policy-list']);
                }
              },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
        }

    }

    onMetroSelect(event: any) {
        this.selectedMetroCities.push(event);
    }

    onMetroDeselect(event: any) {
        const index = this.selectedMetroCities.findIndex(city=> city.city_code === event.city_code);
        if (index !== -1) {
            this.selectedMetroCities.splice(index, 1);
        }
    }

    onMiniSelect(event:any){
        this.selectedMiniCities.push(event);
    }

    onMiniDeselect(event: any) {
        const index = this.selectedMiniCities.findIndex(city => city.city_code === event.city_code);
        if (index !== -1) {
            this.selectedMiniCities.splice(index, 1);
        }
    }

    onNonMetroSelect(event){
        this.selectedNonMetroCities.push(event);
    }

    onNonMetroDeselect(event){
        const index = this.selectedNonMetroCities.findIndex(city => city.city_code === event.city_code);
        if (index !== -1) {
            this.selectedNonMetroCities.splice(index, 1);
        }    
    }


}
