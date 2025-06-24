import { Injectable } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CmsService {
    isDevelopement: BehaviorSubject<boolean> = new BehaviorSubject(false);
    toUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    StaticContent: BehaviorSubject<any> = new BehaviorSubject<any>({});
    hotelAirlineData: BehaviorSubject<any> = new BehaviorSubject<any>({});

    constructor(
        private apiHandlerService: ApiHandlerService,
    ) { }

    updateContent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateStaticPageContent', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }

    addContent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('addStaticPageContent', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }

    getStaticContent(data): Observable<any> {
        return this.apiHandlerService.apiHandler('staticPageContentList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    airlineHotelPartnerList(data): Observable<any> {
        return this.apiHandlerService.apiHandler('airlineHotelPartnerList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }

    fetchTitleList(): Observable<any> {
        return this.apiHandlerService.apiHandler('userTitleList', 'post', {}, {})
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }

    getAlertData(): Observable<any> {
        return this.apiHandlerService.apiHandler('getAgentLoginAlert', 'post', {}, {})
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }

    postAlertData(data,urlfilter): Observable<any> {
        let apiCall = urlfilter ? "addAgentLoginAlert" : "updateAgentLoginAlert";
        return this.apiHandlerService.apiHandler(apiCall, 'post', {}, {}, data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }

    fetchSliderList(data): Observable<any> {
        return this.apiHandlerService.apiHandler('sliderSettingsList', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }

    updateSliderListStatus(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updatCoreSliderSettingStatus', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }

    updateContentListStatus(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updatCoreStaticPageContentStatus', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    updateAirlineHotelPartnerStatus(data): Observable<any> {
        return this.apiHandlerService.apiHandler('updateAirlineHotelPartnerStatus', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }
    deleteAirlineHotelPartner(data): Observable<any> {
        return this.apiHandlerService.apiHandler('deleteAirlineHotelPartnerImage', 'post', {}, {},data)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }

    deleteSliderContent(id): Observable<any> {
        return this.apiHandlerService.apiHandler('deleteCoreSliderSettings', 'post', {}, {},id)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );

    }


    deleteStaticPageContent(id): Observable<any> {
        return this.apiHandlerService.apiHandler('deleteStaticPageContent', 'post', {}, {},id)
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.data || [],
                            msg: resp.Message || 'OK'
                        }
                    else
                        return {
                            statusCode: 404,
                            data: resp.Data || [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            );
    }

    ngOnDestroy() { }

}
