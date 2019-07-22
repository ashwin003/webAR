import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { QRCode } from '../models/qrCode';
import * as adapter from 'webrtc-adapter';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() updateTime = 500;

  @Output() onRead: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('videoWrapper', { static: false }) videoWrapper: ElementRef;
  @ViewChild('qrCanvas', { static: false }) qrCanvas: ElementRef;

  private canvasWidth = '100vw';
  private canvasHeight = '100vh';
  private facing = 'environment';
  private debug = true;
  private mirror = false;
  gCtx: CanvasRenderingContext2D;
  qrCode: QRCode = null;
  isDeviceConnected = false;
  gUM = false;
  videoElement: HTMLVideoElement;

  isWebkit = false;
  isMoz = false;
  stream: any;
  stop = false;

  nativeElement: ElementRef;
  supported = true;

  captureTimeout: any;

  constructor(private renderer: Renderer2, private element: ElementRef) {
    this.nativeElement = this.element.nativeElement;
    this.supported = this.isCanvasSupported();
  }

  ngOnInit(): void {
    if (this.debug) {
      console.log(`[QrScanner] QR Scanner init, facing ${this.facing}`);
    }
  }

  ngOnDestroy(): void {
    this.stopScanning();
  }

  ngAfterViewInit(): void {
    this.load();
    window.addEventListener('resize', () => {
      this.load();
    });
  }

  startScanning(): void {
    this.load();
  }

  private isCanvasSupported(): boolean {
    const canvas = this.renderer.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  }

  private load(): void {
    this.stop = false;
    this.isDeviceConnected = false;

    if (this.supported) {
      this.initCanvas(this.canvasWidth, this.canvasHeight);
      this.qrCode = new QRCode();
      this.qrCode.myCallback = (decoded: string) => this.decodeCallback(decoded);

      this.findMediaDevices.then((options) => this.connectDevice(options));
    }
  }

  private initCanvas(w: string, h: string): void {
    this.qrCanvas.nativeElement.style.width = w;
    this.qrCanvas.nativeElement.style.height = h;
    this.qrCanvas.nativeElement.width = this.vwTOpx(w);
    this.qrCanvas.nativeElement.height = this.vhTOpx(h);
    
    this.gCtx = this.qrCanvas.nativeElement.getContext('2d');
    this.gCtx.clearRect(0, 0, this.vwTOpx(w), this.vhTOpx(h));
    if (!this.mirror) { this.gCtx.translate(-1, 1); }
  }

  private decodeCallback(decoded: string) {
    this.onRead.emit(decoded);
    //this.stopScanning();
  }

  private connectDevice(options: any): void {

    const self = this;

    function success(stream: any): void {
      self.stream = stream;
      if (self.isWebkit || self.isMoz) {
        self.videoElement.srcObject = stream;
      } else {
        self.videoElement.src = stream;
      }
      self.gUM = true;
      self.captureTimeout = setTimeout(captureToCanvas, self.updateTime);
    }

    function error(error: any): void {
      self.gUM = false;
      return;
    }

    function captureToCanvas(): void {
      if (self.stop || !self.isDeviceConnected) {
        return;
      }
      if (self.gUM) {
        try {
          self.gCtx.drawImage(self.videoElement, 0, 0, self.vwTOpx(self.canvasWidth), self.vhTOpx(self.canvasHeight));
          self.qrCode.decode(self.qrCanvas.nativeElement);
        } catch (e) {
          if (self.debug) {
            console.log(e);
          }
          self.captureTimeout = setTimeout(captureToCanvas, self.updateTime);
        }
      }
    }

    if (this.isDeviceConnected && !this.captureTimeout) {
      this.captureTimeout = setTimeout(captureToCanvas, this.updateTime);
      return;
    }

    const _navigator: any = navigator;

    this.videoElement = this.renderer.createElement('video');
    this.videoElement.setAttribute('autoplay', 'true');
    this.videoElement.setAttribute('height', this.vhTOpx(this.canvasHeight).toString());
    if (!this.mirror) { this.videoElement.classList.add('mirrored') };
    this.renderer.appendChild(this.videoWrapper.nativeElement, this.videoElement);

    console.log(adapter);
    if (_navigator.getUserMedia) {
      this.isWebkit = true;
      _navigator.getUserMedia({ video: options, audio: false }, success, error);
    } else if (_navigator.webkitGetUserMedia) {
      this.isWebkit = true;
      _navigator.webkitGetUserMedia({ video: options, audio: false }, success, error);
    } else if (_navigator.mediaDevices && _navigator.mediaDevices.getUserMedia) {
      this.isMoz = true;
      _navigator.mediaDevices.getUserMedia({ video: options, audio: false }, success, error);
    }

    this.isDeviceConnected = true;
    this.captureTimeout = setTimeout(captureToCanvas, this.updateTime);
  }

  private get findMediaDevices(): Promise<{ deviceId: { exact: string }, facingMode: { exact: string } } | boolean> {

    const videoDevice =
      (dvc: MediaDeviceInfo) => dvc.kind === 'videoinput' && dvc.label.search(/back/i) > -1;

    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
          navigator.mediaDevices.enumerateDevices()
            .then((devices: MediaDeviceInfo[]) => {
              const device = devices.find((_device: MediaDeviceInfo) => videoDevice(_device));
              if (device) {
                resolve({ 'deviceId': { 'exact': device.deviceId }, 'facingMode': { 'exact':  this.facing } });
              } else {
                resolve(true);
              }
            });
        } catch (e) {
          if (this.debug) {
            console.log(e);
          }
          reject(e);
        }
      } else {
        if (this.debug) {
          console.log('[QrScanner] no navigator.mediaDevices.enumerateDevices');
        }
        resolve(true);
      }
    })
  }

  stopScanning(): void {

    if (this.captureTimeout) {
      clearTimeout(this.captureTimeout);
      this.captureTimeout = false;
    }

    this.stream.getTracks()[0].stop();
    this.stop = true;
  }

  private vwTOpx(value: string): number {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return (x*parseInt(value))/100;
  }

  private vhTOpx(value: string): number {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return (y*parseInt(value))/100;
  }
}
