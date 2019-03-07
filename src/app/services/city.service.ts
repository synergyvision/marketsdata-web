import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  
  public citiesCollection: AngularFirestoreCollection<City>;
  public cities: Observable<City[]>;
  
    constructor( 
        private afs: AngularFirestore,
        ) {
          this.citiesCollection = afs.collection<City>('cities', ref => {
            
            return ref
                      .orderBy("population", "desc")
                      .limit(5)
          });
          this.cities = this.citiesCollection.valueChanges();
      }

    getCiudades() {
         return this.cities = this.citiesCollection.snapshotChanges()
         .pipe(map(changes =>{
           return changes.map(action => {
             const data = action.payload.doc.data() as City;
             return data;
           });
         }));
    }
}
