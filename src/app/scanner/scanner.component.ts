import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {
  
  message = 'Please scan a supported QR Code to proceed';
  constructor(private router: Router) { }

  ngOnInit() {
  }

  onRead(id: string): void {
    this.message = 'Code scanned. Now moving to the next level';
    this.router.navigate(['scene', id]);
  }
}
