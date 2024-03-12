import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent  implements OnInit {
  @Input() user: any = {};
  comment: string = '';

  constructor(
    private firestore: AngularFirestore,
    private modalController: ModalController,
    private toastController: ToastController,
  ) { }
    async showToast(text: string){
      const toast = await this.toastController.create({
        message: text,
        duration: 2000
      });
      await toast.present();

    }
  ngOnInit() {
    this.firestore.collection('users', ref => ref.where('id', '==', this.user.id)).doc(this.user.id).snapshotChanges().subscribe((data) => {
      console.log(data);
    })
  }

  async addComment() {
    const data = {...this.user};
    data["comment"] = this.comment;

    let users: any = {};
    const collection = await this.firestore.collection('users').ref.get();
    collection.docs.forEach(doc => {
      const data: any = doc.data();
      users[data.id.toString()] = doc.id;
    })

    this.firestore.collection('users').doc(users[this.user.id]).update(data) // Update the existing document with the new comment
      .then(() => {
        console.log('Comment added successfully!');
        this.modalController.dismiss();
        this.showToast("Comment added successfully!");
      })
      .catch(error => {
        console.error('Error adding comment: ', error);
        this.modalController.dismiss();
        this.showToast("Error in adding comment!");
      });

  }

}
