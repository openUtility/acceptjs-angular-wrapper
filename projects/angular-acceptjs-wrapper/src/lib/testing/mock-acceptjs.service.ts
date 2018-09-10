import { Injectable, OnDestroy, Inject } from '@angular/core';


import { CreditCard } from '../models/credit-card';


@Injectable({
  providedIn: 'root'
})
export class MockAcceptJSService {


  constructor() { }

  public nonceReply: string;

  public rejectReply: string;

  public lastCCPassed: CreditCard;

  public generatePaymentNonce(cc: CreditCard): Promise<string> {
    return new Promise((resolve, reject) => {
      this.lastCCPassed = cc;
      if (this.rejectReply) {
        reject(this.rejectReply);
        return;
      }
      resolve(this.nonceReply || 'ABC123456');
    });
  }
}
