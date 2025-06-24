import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { SubSink } from 'subsink';
import { AuthService } from '../../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-static-content',
    templateUrl: './static-content.component.html',
    styleUrls: ['./static-content.component.scss']
})
export class StaticContentComponent implements OnInit, OnDestroy {
    protected subs = new SubSink();
    staticData = { page_title: '', page_description: '' };
    sanitizedPageDescription: SafeHtml = '';    
    changeContent: EventEmitter<any> = new EventEmitter<any>();
    closeResult = '';
    loadingLogin: boolean = false;
    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.loadStaticContent();
    }

    loadStaticContent(): void {
        const staticTitle = sessionStorage.getItem('static_title');
        if (!staticTitle) {
            console.error('Static title is not available in session storage.');
            return;
        }

        const title = { page_title: staticTitle };

        this.authService.getStaticContent(title).subscribe({
            next: (res) => {
                if (res.statusCode === 200 && res.data.length > 0) {
                    this.staticData = res.data[0];
                    this.sanitizedPageDescription = this.sanitizeAndLinkify(this.staticData.page_description);
                } else {
                    console.warn('Static content response is invalid or empty.', res);
                }
            },
            error: (err) => {
                console.error('Error fetching static content:', err);
            }
        });
    }
    
    private sanitizeAndLinkify(content: string): SafeHtml {
        if (!content) return '';
        const linkifiedContent = content.replace(
            /(http[s]?:\/\/[^\s<>"]+|[^\s<>"]+\.com)/g,
            (match) => {
                const href = match.startsWith('http') ? match : `http://${match}`;
                return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
            }
        );
        return this.sanitizer.bypassSecurityTrustHtml(linkifiedContent);
    }

    getContent(event) {
        this.staticData = event[0];
    }

   

    

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

}
