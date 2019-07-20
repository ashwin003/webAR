import { Component } from '@angular/core';
import { fadeAnimation } from './animations/fadeAnimation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation] // register the animation
})
export class AppComponent {
  title = 'WebAR';
}
