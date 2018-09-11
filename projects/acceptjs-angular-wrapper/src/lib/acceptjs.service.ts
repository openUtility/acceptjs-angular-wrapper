import { Injectable, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';


import { CreditCard } from './models/credit-card';
import { AcceptJSResponse } from './models/acceptjs-response';
import { AcceptJSPost } from './models/acceptjs-post';
import { Config } from './models/config';
import { TK_CONFIG } from './tk-config';

declare var Accept: any;

@Injectable({
  providedIn: 'root'
})
export class AcceptJSService implements OnDestroy {

  private _element: HTMLScriptElement;

  constructor(@Inject(TK_CONFIG) private _config: Config, @Inject(DOCUMENT) private document: any) {
    console.log('building');
    if (typeof Accept !== 'function') {
      this.addAcceptJsScript();
    }
  }

  public generatePaymentNonce(cc: CreditCard): Promise<string> {
    const secureData: AcceptJSPost = {
      authData: {
        clientKey:  this._config.clientKey,
        apiLoginID: this._config.apiLoginID
      },
      cardData: cc
    };
    return new Promise((resolve, reject) => {
      Accept.dispatchData(secureData, (response: AcceptJSResponse) => {
        if (response.messages.resultCode === 'Error') {
          reject(response);
          return;
        }
        const nonce = response.opaqueData.dataValue;
        resolve(nonce);
      });
    });
  }

  ngOnDestroy(): void {
    if (this._element) {
      const head = this.document.getElementsByTagName('head')[0];
      head.removeChild(this._element);
    }
  }

  /** add the accept JS file to the window */
  private addAcceptJsScript() {
    const headerEl = this.document.getElementsByTagName('head')[0];
    const element = this.document.createElement('script');
    element.src = this._config.acceptjsUrl;
    element.type = 'text/javascript';
    this._element = headerEl.appendChild(element);
  }
}
