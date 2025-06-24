import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HotelCrsService } from '../../../../hotel-crs.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { environment } from 'projects/supervision/src/environments/environment';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
const log = new Logger('Hotel/AddUpdateHotel');
const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-hotel-image',
  templateUrl: './hotel-image.component.html',
  styleUrls: ['./hotel-image.component.scss']
})
export class HotelImageComponent implements OnInit {
    @Input() id;
    @ViewChild ('file',{static: false}) fileUploader:ElementRef;
    @Input() hotelOne: object = {};
    @Output() callResult = new EventEmitter<boolean>(true);
    hotelImageForm: FormGroup;
    logoConfig:FormGroup;
    UpdateLogo:FormGroup;
    submittedHotelImage: boolean = false;
    hotelImageList;
    addedHotelImage: any;
    isHotelImage: boolean;
    isRoomActive: boolean;
    dropdownSettingsForRoom = {};
    fileToUpload: File = null;
    hotelImages:any=[];
    imageSrc;
    showHotelImage:boolean;
    images: string[] = [];
    selactedFlies:File[]=[];
    hotelImage:any;
    @ViewChild('labelImport', { static: false })
    labelImport: ElementRef;
   // @Output() someEvent = new EventEmitter<any>();
     addedHotelDetail: any;
     displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "image", value: 'Images' },
        { key: "action", value: 'Actions' },
    ];
    noDataMessage: string;
    selectedImage: string | null = null;
    file: any;
  constructor(    private fb: FormBuilder,
    private hotelCrsService: HotelCrsService,
    private utilityService: UtilityService,
    private swalService: SwalService,
    private router:Router) { }

  ngOnInit() {
    this.createHotelImageForm()
    this.hotelCrsService.addedHotelDetail.subscribe(res => {
        this.addedHotelDetail = res;
    });
    if(!this.hotelOne){
        this.hotelOne =this.addedHotelDetail;
    }
    this.getHotelImageList()
  }
  createHotelImageForm() {
    this.hotelImageForm = this.fb.group({
        image_url: [''],
        hotel_id: [''],
        status: [true]
    });
    this.logoConfig = this.fb.group({
        banner_logo: new FormControl(""),
      });
}

    previewHotelImage($event) {
        this.file = $event.target.files[0];
        if (this.file && this.file.size) {
            let result = this.hotelCrsService.validateFileSize(this.file.size);
            if (!result) {
                this.fileUploader.nativeElement.value = null;
                return;
            }
        }
        this.hotelImages = ""// Initialize as an array to store multiple images
        const files = $event.target.files; // Get all selected files
        for (let i = 0; i < files.length; i++) {
            this.selactedFlies.push(files[i])
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imageSrc.push(reader.result); // Store image data for preview
            };
        }
    }

  onSubmitHotelImage() {
    this.submittedHotelImage = true;
    if (this.hotelImageForm.valid) {
        const formData = new FormData();
        let data: any = [{ data: formData }]
            formData.append('id', this.hotelOne['id'])
            this.selactedFlies.forEach(file => {
                formData.append('image', file, file.name);
              });
            data['topic'] = 'addHotelImage'; 
        
        this.hotelCrsService.addHotelLogo(data).subscribe(resp => {
            if (resp.statusCode == 201) {
                log.debug("Image Uploaded Sucessfully...!")
                this.addedHotelImage = resp
                this.isHotelImage = false;
                this.selactedFlies =[]
                this.getHotelImageList()
                this.isRoomActive = true;
                this.dropdownSettingsForRoom = {
                    singleSelection: false,
                    idField: 'id',
                    textField: 'room_amenity_name',
                }
            } else if (resp.statusCode == 400) {
                this.swalService.alert.oops(resp.msg)
            }
            else {
                this.swalService.alert.oops(resp.msg);
            }
        })
    } else { return; }
}
getImage(img) {
    return `${baseUrl + "/" + img}`;
}
getHotelImageList(){
    let hotel_id = this.hotelOne['id']
    const data = [{ hotel_id: hotel_id, offset: 0, limit: 10 }]
    data['topic'] = 'hotelImageList';
    this.hotelCrsService.fetch(data).subscribe(resp => {
        if (resp.statusCode == 200) {
            this.hotelImage =  resp['data'];
        }else if (resp.statusCode == 404) {
            this.noDataMessage = "No records found"
        }

    });
}
goToHotelList(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['/hotels/hotel-crs-lists']); 
    
}
delete(imageData){
    this.swalService.alert.delete((action)=>{
        if(action){
            let image_id = this.hotelOne['id']
            const data = [{ id: image_id ,image_url:imageData}]
            data['topic'] = 'deleteHotelImage';
            this.hotelCrsService.fetch(data).subscribe(response => {
             
                        if (response.statusCode == 200 || response.statusCode == 201 ) {
                        this.swalService.alert.success(`Hotel Image has been deleted successfully`);
                        this.getHotelImageList()
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}
// delete(imageData){
//     console.log("imageData",imageData)
//     let image_id = this.hotelOne['id']
//     const data = [{ id: image_id ,image_url:imageData}]
//     data['topic'] = 'deleteHotelImage';
//     this.hotelCrsService.fetch(data).subscribe(resp => {
//         if (resp.statusCode == 201) {
//             this.hotelImage = resp.data;
//             this.getHotelImageList()
//             console.log(" this.roomTypeList", this.hotelImage)
//             this.swalService.alert.success("Hotel detail deleted successfully!")
//         }

//     });
// }
openImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  closeModal(): void {
    this.selectedImage = null;
  }
get hotelImg() { return this.hotelImageForm.controls; }
}
