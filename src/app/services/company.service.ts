import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Company } from '../models/company';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  
  public companiesCollection: AngularFirestoreCollection<Company>;
  public companies: Observable<Company[]>;
  public companyDoc: AngularFirestoreDocument<Company>;
  public company: Observable<Company>;
    constructor( 
        private afs: AngularFirestore,
        ) {
          this.companiesCollection = afs.collection<Company>('companies');
          this.companies = this.companiesCollection.valueChanges();
      }

    getCompanies(){
         return this.companies = this.companiesCollection.snapshotChanges()
         .pipe(map(changes =>{
           return changes.map(action => {
             const data = action.payload.doc.data() as Company;
             return data;
           });
         }));
    }

    getCompany(companyId){
      this.companyDoc = this.afs.doc<Company>(`companies/${companyId}`);
      return this.company = this.companyDoc.snapshotChanges().pipe(map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as Company;
          data.id = action.payload.id;
          return data;
        }
      }));
    }
 
}
