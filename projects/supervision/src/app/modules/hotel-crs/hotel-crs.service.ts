import { Injectable } from '@angular/core';
import { ApiHandlerService } from '../../core/api-handlers';
import { untilDestroyed } from '../../core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../core/services/swal.service';

@Injectable({
    providedIn: 'root'
})
export class HotelCrsService {
    seasonList = new BehaviorSubject<any>('');
     roomDetailList = new BehaviorSubject<any>('');
     addedHotelDetail = new BehaviorSubject<any>('');
     RoomImage =new BehaviorSubject<boolean>(false);
     roomId= new BehaviorSubject<any>('');
     showPrice=new BehaviorSubject<boolean>(false);
     showCancel=new BehaviorSubject<boolean>(false);
     updateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    constructor(
        private apiHandlerService: ApiHandlerService,
        private httpClient: HttpClient,
        private swalService:SwalService
    ) { }

    fetch(data?: any): Observable<any> {
        console.log("data",data)
        return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data[0] || {})
            .pipe(
                map(resp => {
                    return resp;
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }

    updateRoomImage(data): Observable<any> {
        return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data.topic=='uploadRoomLogo' ? data[0].data : data[0])
            .pipe(
                map(resp => {
                    return resp
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }
    update(data): Observable<any> {
        return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data.topic=='uploadHotelLogo' ? data[0].data : data[0])
            .pipe(
                map(resp => {
                    return resp
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }
    addHotelLogo(data): Observable<any> {
        return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data.topic=='addHotelImage' ? data[0].data : data[0])
            .pipe(
                map(resp => {
                    return resp
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }

    validateFileSize(fileSize) {
        if (fileSize > 100000) {
            this.swalService.alert.oops("Maximum upload file size: 1MB");
            return false;
        }
        else {
            return true
        }
    }

    ngOnDestroy() { }

}
