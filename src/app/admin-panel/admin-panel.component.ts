import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable} from 'rxjs';
import { NgForm } from '@angular/forms';
import { CandidateDetailsService } from '../services/candidate-details.service';
import { ModalController } from '@ionic/angular';
import { CommentModalComponent } from './components/comment-modal/comment-modal.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  data$: Observable<any[]> | undefined;
  comment: string = '';
  i: any;
  candidate: any = {};
  filteredData$: Observable<any[]> | undefined;
  searchTerm: string = '';

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private details: CandidateDetailsService,
    private modalCtrl: ModalController
  ) {
    this.fetchData();
  }

  ngOnInit() {
    // Fetch data from Firestore collection named 'items'
    this.data$ = this.firestore.collection('users').valueChanges();
    this.filteredData$ = this.data$;
    let index = 0;
    // this.data$.forEach((data: any) => {
    //   data.comment = "comment"+index
    //   index++
    // })
  }

  filterItems(event: CustomEvent) {
    // Retrieve the search term entered by the user
    const searchTerm = event.detail.value?.trim().toLowerCase();

    // If the search term is not empty, filter the data based on it
    if (searchTerm !== '') {
      // Use optional chaining to check if this.data$ is defined
      this.filteredData$ = this.data$?.pipe(
        map(items =>
          items.filter(item => {
            // Check if item.date exists and is a string before calling toLowerCase()
            const date = item.date && typeof item.date === 'string' ? item.date.toLowerCase() : '';
            return (
              (item.name && item.name.toLowerCase().includes(searchTerm)) ||
              (item.contactNumber && item.contactNumber.toLowerCase().includes(searchTerm)) ||
              (date.includes(searchTerm)) || // Check if the lowercase date contains the search term
              (item.status && item.status.toLowerCase().includes(searchTerm))
            );
          })
        )
      );
    } else {
      // If the search term is empty or data$ is undefined, show all data
      this.filteredData$ = this.data$;
    }
  }

  async getUsersMap() {
    const users: { [key: string]: string } = {}; // Define users as an object allowing string keys
    const collection = await this.firestore.collection('users').ref.get();
    collection.docs.forEach(doc => {
      const data: any = doc.data();
      users[data.id.toString()] = doc.id;
    });
    return users;
  }


  getComment(User: any) {
    console.log(User);
  }

  async fetchData() {
    try {
      const data = await this.firestore.collection('users').valueChanges();
      console.log('Fetched data:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  viewDetails(candidate: any) {
    // For example, navigate to a route named '/candidate-details' and pass candidate data as a query parameter
    this.details.setCandidate(candidate);
    this.router.navigate(['/candetails']);
  }
  ionViewDidEnter() {
    this.candidate = this.details.getCandidate();
    console.log(this.candidate);
  }

  onSubmitfunc(data: any) {
    console.log(data);
    // if (form.valid) {
    //   const formData = {
    //     comment: this.comment,
    //   };
    //   this.firestore.collection('users').doc(id).update(formData) // Update the existing document with the new comment
    //     .then(() => {
    //       console.log('Comment added successfully!');
    //       form.resetForm();
    //     })
    //     .catch(error => {
    //       console.error('Error adding comment: ', error);
    //     });
    // }
  }

  async addComment(item: any) {
    const modal = await this.modalCtrl.create({
      component: CommentModalComponent,
      componentProps: { user: item },
      id: 'commentmodal',
    });

    await modal.present();
  }
  async updateStatus(item: any, event: any) {
    // Update status in Firestore
    console.log(event);
    const data = { ...item };
    data['status'] = event.detail.value;

    let users: any = {};
    const collection = await this.firestore.collection('users').ref.get();
    collection.docs.forEach((doc) => {
      const data: any = doc.data();
      users[data.id.toString()] = doc.id;
    });

    this.firestore
      .collection('users')
      .doc(users[item.id])
      .update(data)
      .then(() => {
        console.log('Comment added successfully!');
      });
  }
}
