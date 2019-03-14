import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserDetail } from '../models/userDetail';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserdetailService {
  
  public usersCollection: AngularFirestoreCollection<UserDetail>;
  public users: Observable<UserDetail[]>;
  public userDoc: AngularFirestoreDocument<UserDetail>;
  public user: Observable<UserDetail>;
  public userUrl = `https://marketsdata.herokuapp.com/user`;

    constructor( 
        private http: HttpClient,
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

    getUserDetail(idUser: string) {
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

    insertUserDetails(user: UserDetail, userId){
        this.usersCollection.doc(userId).set(user);
    }

    addUser (user: User): Observable<User> {
      return this.http.post<User>(this.userUrl, user, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
    }

    deleteUser (id: string): Observable<any> {
      this.deleteUserDetail(id);
      const url = `${this.userUrl}/${id}`; 
      return this.http.delete(url, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
    }

    deleteUserDetail(idUser) {
      this.userDoc = this.afs.doc<UserDetail>(`userdetails/${idUser}`);
      this.userDoc.delete();
    }

    private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
       
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error.code}`);
      }
      // return an observable with a user-facing error message
      return throwError(
        `${error.error.code}`);
    };
}
