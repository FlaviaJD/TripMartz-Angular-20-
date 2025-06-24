import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  selector: 'app-room-image',
  templateUrl: './room-image.component.html',
  styleUrls: ['./room-image.component.scss']
})
export class RoomImageComponent implements OnInit {
    @Input() roomImage: object = {};
    @Input() hotelOne: object = {};
    @Output() isSeason = new EventEmitter<any>();
    hotelImageForm: FormGroup;
    submittedHotelImage: boolean = false;
    hotelImages;
    roomId:object = {};
    hotelImageList;
    addedHotelImage: any;
    isHotelImage: boolean;
    isRoomActive: boolean;
    roomImageList:any;
    dropdownSettingsForRoom = {};
   // @Output() someEvent = new EventEmitter<any>();
     addedHotelDetail: any;
     selactedFlies:File[]=[];
     imageSrc:any;
     images: string[] = [];
     displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SI No.' },
        { key: "image", value: 'Image' },
        { key: "action", value: 'Actions' },
    ];
    selectedImage: string | null = null;
  constructor(    private fb: FormBuilder,
    private hotelCrsService: HotelCrsService,
    private utilityService: UtilityService,
    private swalService: SwalService,
    private router:Router) { }

  ngOnInit() {
    this.createHotelImageForm()
    // if(this.roomImage['room_image']){
    //     this.editRoomImage()
    // }
    this.getRoomImageList()
  }
  createHotelImageForm() {
    this.hotelImageForm = this.fb.group({
        image_url: [''],
        hotel_room_id: [''],
        status: [true]
    });
}

editRoomImage(){
    this.hotelImages =this.roomImage['room_image'];
    this.images = this.hotelImages.split(',').map(image => image.trim());
    this.imageSrc = "";
}
previewRoomImage($event) {
    this.hotelImages =""// Initialize as an array to store multiple images
    const files = $event.target.files; // Get all selected files
    for (let i = 0; i < files.length; i++) {
        this.selactedFlies.push(files[i])
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imageSrc.push(reader.result); // Store image data for preview
            };
            //reader.readAsDataURL(file);
        }
    }
  onSubmitHotelImage() {
    this.submittedHotelImage = true;
    if (this.hotelImageForm.valid) {
        const formData = new FormData();
        this.selactedFlies.forEach(file => {
            formData.append('image', file, file.name);
          });
        // formData.append('image', this.hotelImages)
        formData.append('hotel_room_id', this.roomImage['id'])
        let data: any = [{ data: formData }]
        // formData.append('image', this.imagePath);
        // formData.append('id', this.hotelOne['id'])
        data['topic'] = 'uploadRoomLogo';
        this.hotelCrsService.updateRoomImage(data).subscribe(resp => {
            if (resp.statusCode == 201) {
                log.debug("Image Uploaded Sucessfully...!")
                this.addedHotelImage = resp
                // this.hotelForm.reset();
                this.getRoomImageList()
                this.isHotelImage = false;
               //this.isRoomDetail = true;
            //    this.showRoomList = true;
                //this.showRoomForm = false;
                this.isRoomActive = true;
                this.dropdownSettingsForRoom = {
                    singleSelection: false,
                    idField: 'id',
                    textField: 'room_amenity_name',
                }
                // this.createHotelRoomForm();
                // this.getHotelRoomTypeList();
                // this.getHotelRoomAmenityList();
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
getRoomImageList(){
    let hotel_room_id = this.roomImage['id'];
    const data = [{ hotel_room_id: hotel_room_id, offset: 0, limit: 10 }]
    data['topic'] = 'getRoomList';
    this.hotelCrsService.fetch(data).subscribe(resp => {
        if (resp.statusCode == 200) {
            this.roomImageList =  resp['data'];
        }

    });
}
// delete(imageData){
//     let image_id = imageData['id']
//     const data = [{ id: image_id }]
//     data['topic'] = 'deleteRoomList';
//     this.hotelCrsService.fetch(data).subscribe(resp => {
//         if (resp.statusCode == 200) {
//             this.getRoomImageList()
//             this.swalService.alert.success("Hotel detail deleted successfully!")
//         }

//     });
// }
delete(imageData){
    this.swalService.alert.delete((action)=>{
        if(action){
            let image_id = imageData['id']
            const data = [{ id: image_id }]
            data['topic'] = 'deleteRoomList';
            this.hotelCrsService.fetch(data).subscribe(response => {
             
                        if (response.statusCode == 200 || response.statusCode == 201 ) {
                        this.swalService.alert.success(`Hotel Room Image has been deleted successfully`);
                        this.getRoomImageList()
                        }
                    },(err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    }
                );
        }
    })
}
// goToRoomList(){
//     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
//     this.router.onSameUrlNavigation = 'reload';
//     this.router.navigate(['/hotels/hotel-crs-lists']);
// }
goToRoomList(){
    this.isSeason.emit({rooms:this.roomImage,hoteltrigger:'goToRoomDetail'})

}
openImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  closeModal(): void {
    this.selectedImage = null;
  }
get hotelImage() { return this.hotelImageForm.controls; }
}
