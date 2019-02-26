import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserDetail } from '../models/userDetail';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserdetailService {
  
  public usersCollection: AngularFirestoreCollection<UserDetail>;
  public users: Observable<UserDetail[]>;
  public userDoc: AngularFirestoreDocument<UserDetail>;
  public user: Observable<UserDetail>;
  public selectedUser: UserDetail = {
      id: '',
      name: '',
      lastName: '',
      age: '',
      job: ''
  };

    constructor( 
        private afs: AngularFirestore,
        private afAuth: AngularFireAuth
        ) {
          this.usersCollection = afs.collection<UserDetail>('userdetails');
          this.users = this.usersCollection.valueChanges();
      }

    getUsersDetails(){
         return this.users = this.usersCollection.snapshotChanges()
         .pipe(map(changes =>{
           return changes.map(action => {
             const data = action.payload.doc.data() as UserDetail;
             data.id = action.payload.doc.id;
             return data;
           });
         }));
    }

    getUserDetailWithoutId(idUser: string){
        this.userDoc = this.afs.doc<UserDetail>(`userdetails/${idUser}`);
        return this.userDoc;
    }

    getUserDetail(idUser: string){
      this.userDoc = this.afs.doc<UserDetail>(`userdetails/${idUser}`);
      return this.user = this.userDoc.snapshotChanges().pipe(map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as UserDetail;
          data.id = action.payload.id;
          return data;
        }
      }));
    }

    insertUserDetails(user: UserDetail){
        let currentUser = this.afAuth.auth.currentUser;
        let userId = currentUser.uid;
        this.usersCollection.doc(userId).set(user);
    }
}
