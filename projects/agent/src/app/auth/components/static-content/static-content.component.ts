import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'app-static-content',
    templateUrl: './static-content.component.html',
    styleUrls: ['./static-content.component.scss']
})
export class StaticContentComponent implements OnInit, OnDestroy {
    protected subs = new SubSink();
    staticData = { page_title: '', page_description: '' };
    constructor(
        private authService: AuthService,
    ) { }

    ngOnInit() {
        this.loadStaticContent();
    }

    loadStaticContent() {
        let title = { page_title: "" }
        title.page_title = localStorage.getItem('static_title');
        this.authService.getStaticContent(title).subscribe(res => {
            if (res.statusCode == 200) {
                this.staticData = res.data[0];
            }
        }, (err) => {
        });
    }

    getContent(event) {
        this.staticData = event[0];
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

}
