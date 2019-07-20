import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-display-scene',
  templateUrl: './display-scene.component.html',
  styleUrls: ['./display-scene.component.scss']
})
export class DisplaySceneComponent implements OnInit {

  selectedScene: any;
  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(param => {
      const id = param.id;

      this.dataService.getData().subscribe(data => {
        this.selectedScene = data.find((v,i) => v.id == id);
      });
    });
  }

  getFullPath(path: string): string {
    return window.location.origin + '/' + environment.appName + path;
  }

}
