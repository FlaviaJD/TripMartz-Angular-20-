import { Injectable, OnDestroy } from '@angular/core';
import { ApiHandlerService } from 'projects/agent/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/agent/src/app/core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class HeaderService implements OnDestroy {
    agentData = new BehaviorSubject<boolean>(true);
    selectedModule = new BehaviorSubject <any>('');
    constructor(
        private apiHandlerService: ApiHandlerService,
    ) { }

    fetch(data?: any): Observable<any> {
        return this.apiHandlerService.apiHandler( data.topic || '', 'post', {}, {}, data[0] || {})
            .pipe(
                map(resp => {
                    if (resp.Status)
                        return {
                            statusCode: 200,
                            data: resp.Data || [],
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
            )
    }

    update(data): Observable<any> {
        return this.apiHandlerService.apiHandler( data.topic || '', 'post', {}, {}, data[0] || {})
            .pipe(
                map(resp => {
                    if (resp.Status && (resp.Data.msg || resp.Data.data))
                        return {
                            statusCode: 200,
                            data: resp.Data || [],
                            msg: resp.Message || 'OK'
                        }
                    else if (resp.Status && resp.Data.error_msg)
                        return {
                            statusCode: 400,
                            data: [],
                            msg: resp.Message || 'BAD REQUEST'

                        }
                    else
                        return {
                            statusCode: 404,
                            data: [],
                            msg: resp.Message || 'NOT FOUND'
                        }
                }),
                shareReplay(1),
                untilDestroyed(this),
            )
    }

    ngOnDestroy() { }
}
