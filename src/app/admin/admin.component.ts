import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent  implements OnInit {

  email: string = '';
  password: string = '';


  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {}

  async login() {
    try {
      await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      this.router.navigate(['/admin-panel']);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

}
