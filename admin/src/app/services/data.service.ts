import { Injectable } from '@angular/core';
import { BehaviorSubject }  from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private itemSubject = new BehaviorSubject<any>({});
  allItems$ = this.itemSubject.asObservable();

  private pageManagerData = new BehaviorSubject<any>({});
  sentToPageManager$ = this.pageManagerData.asObservable();

  // Used from no-controller component
  private addedFromControllerComponent = new BehaviorSubject<any>({});
  $addedFromControllerComponent = this.addedFromControllerComponent.asObservable();

  // Generic data
  private internalCommunication = new BehaviorSubject<any>({});
  internalCommunicationData$ = this.internalCommunication.asObservable();

  constructor() { }

  updateItems(newData: any) {
    this.itemSubject.next(newData);
  }

  sendToPageManager(newData: any) {
    this.pageManagerData.next(newData);
  }

  emitInternalData(target: string, action: string, data: any) {
    this.internalCommunication.next({
      data: data,
      action: action,
      target: target
    });
  }
}
