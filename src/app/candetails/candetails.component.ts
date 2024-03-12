import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { CandidateDetailsService } from '../services/candidate-details.service';


@Component({
  selector: 'app-candetails',
  templateUrl: './candetails.component.html',
  styleUrls: ['./candetails.component.scss'],
})
export class CandetailsComponent {
  comment: string = ''
  candidate: any = {};

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, private details: CandidateDetailsService) { }

  ionViewDidEnter() {
    this.candidate = this.details.getCandidate()
    console.log(this.candidate)
  }

}
