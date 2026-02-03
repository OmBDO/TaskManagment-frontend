import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { fadeAnimation } from '../core/constant/animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet],
  animations: [fadeAnimation],
})
export class AppComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
