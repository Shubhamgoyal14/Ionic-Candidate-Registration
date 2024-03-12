// front.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss'],
})
export class FrontComponent {

  constructor(private router: Router) { }

  registerBtn() {
    this.router.navigate(['/formc']);
  }

  AdminLogin() {
    this.router.navigate(['/admin']);
  }

}
