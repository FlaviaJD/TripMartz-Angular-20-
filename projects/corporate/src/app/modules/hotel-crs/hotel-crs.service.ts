import { Injectable } from '@angular/core';
import { ApiHandlerService } from '../../core/api-handlers';
import { untilDestroyed } from '../../core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HotelCrsService {

    constructor(
        private apiHandlerService: ApiHandlerService,
        private httpClient: HttpClient
    ) { }

    fetch(data?: any): Observable<any> {
        return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data[0] || {})
            .pipe(
                map(resp => {
                    return resp;
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }

    update(data): Observable<any> {
        return this.apiHandlerService.apiHandler(data.topic || '', 'post', {}, {}, data.topic=='uploadHotelLogo' || data.topic=='uploadRoomImage' ? data[0].data : data[0])
            .pipe(
                map(resp => {
                    return resp
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }

    ngOnDestroy() { }

}
