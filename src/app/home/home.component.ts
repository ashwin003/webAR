import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  title: string = 'InstructionAR';
  slides: any[];
  slideCount: number;
  activeSlide: number = 0;

  @ViewChild('slider', { static: true }) sliderWrapper: ElementRef;
  constructor() { }

  ngOnInit() {
    this.slides = this.getSlides();

    this.slideCount = this.slides.length;
    const sliderEl = this.sliderWrapper.nativeElement;

    const sliderManager = new Hammer.Manager(sliderEl);
    sliderManager.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));

    const instance = this;
    sliderManager.on('pan', function (e) {

      var percentage = 100 / instance.slideCount * e.deltaX / window.innerWidth;
      var transformPercentage = percentage - 100 / instance.slideCount * instance.activeSlide; // NEW
      sliderEl.style.transform = 'translateX( ' + transformPercentage + '% )';
      if (e.isFinal) { // NEW: this only runs on event end
        if (percentage < 0)
          instance.goToSlide(instance.activeSlide + 1);
        else if (percentage > 0)
          instance.goToSlide(instance.activeSlide - 1);
        else
          instance.goToSlide(instance.activeSlide);
      }
    });
  }

  private getSlides(): any[] {
    return [
      {
        number: 0,
        title: 'Your window to a smarter world',
        image: 'assets/img1.png',
        message: 'Annotations in the real world make information more accessible than ever before'
      },
      {
        number: 1,
        title: 'Easy to consume information',
        image: 'assets/img2.png',
        message: 'Simply scan a supported QR Code with your device and continue as per the on screen instructions to retrieve and enjoy the virtual objects bleeding into the real world'
      },
      {
        number: 2,
        title: 'Easy to transmit information',
        image: 'assets/img3.png',
        message: 'Even a humble paper brochure could be used to transmit multi-layered information courtesy augmentation'
      }
    ];
  }

  private goToSlide(slideNumber: number): void {
    const sliderEl = this.sliderWrapper.nativeElement;
    if (slideNumber < 0)
      this.activeSlide = 0;
    else if (slideNumber > this.slideCount - 1)
      this.activeSlide = this.slideCount - 1
    else
      this.activeSlide = slideNumber;

    const percentage = -(100 / this.slideCount) * this.activeSlide;
    sliderEl.style.transform = 'translateX(' + percentage + '%)';
  }
}
