import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OwlOptions, CarouselComponent } from 'ngx-owl-carousel-o';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';

@Component({
    selector: 'app-hotel-detail-images',
    templateUrl: './hotel-detail-images.component.html',
    styleUrls: ['./hotel-detail-images.component.scss']
})
export class HotelDetailImagesComponent implements OnInit {

    @Input() hotel: any;
    @Input() traveller: any;
    @ViewChild('owlCar1', { static: false }) private owlCar1: CarouselComponent;
    @ViewChild('itemTemplate', { static: false }) itemTemplate;
    items: GalleryItem[];
    imageData: Array<any> = [];
    slidesPerPage: number = 6;
    hotels: {}[] = [];
    customOptions: OwlOptions = {
        items: 1,
        margin: 4,
        autoplaySpeed: 2000,
        nav: false,
        autoplay: true,
        dots: false,
        loop: true,
        autoplayTimeout: 5000,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    };

    customOptions2: OwlOptions = {
        items: 7,
        margin: 0,
        dots: false,
        nav: false,
        center:false,
        animateOut: 'fadeOut',
        smartSpeed: 200,
        autoplaySpeed: 500,
        slideBy: this.slidesPerPage,
        responsiveRefreshRate: 100,
        autoplayHoverPause: true,
        autoplayTimeout: 5000,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
    }

    constructor(
        public gallery: Gallery,
        public lightbox: Lightbox
    ) { }

    ngOnInit() {
        this.imageData = this.hotel.HotelPicture;
        this.items = this.imageData.map(item => new ImageItem({ src: item, text: 'Name of image' }));
        this.hotels = this.hotel.HotelPicture ? this.hotel.HotelPicture : [];
        const lightboxRef = this.gallery.ref('lightbox');
        lightboxRef.setConfig({
            imageSize: ImageSize.Cover,
            //thumbPosition: ThumbnailsPosition.Bottom,
            itemTemplate: this.itemTemplate,

        });
        lightboxRef.load(this.items);
    }
}
