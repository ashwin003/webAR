import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DisplaySceneComponent } from './display-scene/display-scene.component';
import { ScannerComponent } from './scanner/scanner.component';

const routes: Routes = [
  {
    path: 'scene/:id',
    component: DisplaySceneComponent
  },
  {
    path: 'scan',
    component: ScannerComponent
  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
