import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-display-scene',
  templateUrl: './display-scene.component.html',
  styleUrls: ['./display-scene.component.scss']
})
export class DisplaySceneComponent implements OnInit {

  selectedScene: any;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      this.selectedScene = data[0];
    });
  }

  getFullPath(path: string): string {
    return window.location.origin + '/' + environment.appName + path;
  }

}
