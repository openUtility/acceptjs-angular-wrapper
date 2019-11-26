import { Injectable, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';


import { CreditCard } from './models/credit-card';
import { AcceptJSResponse } from './models/acceptjs-response';
import { AcceptJSPost } from './models/acceptjs-post';
import { Config } from './models/config';
import { TK_CONFIG } from './tk-config';
import { Observable, isObservable, Unsubscribable } from 'rxjs';

declare var Accept: any;

@Injectable({
  providedIn: 'root'
})
export class AcceptJSService implements OnDestroy {

  private element: HTMLScriptElement;
  private activeConfig: Config = null;
  private unsubscribeConfig: Unsubscribable;

  constructor(@Inject(TK_CONFIG) private config: Config | Observable<Config>, @Inject(DOCUMENT) private document: any) {
    // does accept already exist?
    const acceptExists = typeof Accept === 'function';

    if (isObservable(config)) {
      if (acceptExists) {
        throw new Error('Accept already exists');
      }
      this.unsubscribeConfig = config.subscribe(nConfig => {
        this.activeConfig = nConfig;
        this.removeAcceptJsScript();
        this.addAcceptJsScript();
      });
    } else {
      this.activeConfig = config;
      if (!acceptExists) {
        this.addAcceptJsScript();
      }
    }
  }

  public generatePaymentNonce(cc: CreditCard): Promise<string> {
    const secureData: AcceptJSPost = {
      authData: {
        clientKey:  this.activeConfig.clientKey,
        apiLoginID: this.activeConfig.apiLoginID
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
    if (this.unsubscribeConfig) {
      this.unsubscribeConfig.unsubscribe();
    }
    this.removeAcceptJsScript();
  }

  /** removes the script tag */
  private removeAcceptJsScript(): void {
    if (this.element) {
      const head = this.document.getElementsByTagName('head')[0];
      if (this.element.parentNode === head) {
        head.removeChild(this.element);
      }
      this.element = null;
    }
  }

  /** add the accept JS file to the window */
  private addAcceptJsScript() {
    const headerEl = this.document.getElementsByTagName('head')[0];
    const element = this.document.createElement('script');
    element.src = this.activeConfig.acceptjsUrl;
    element.type = 'text/javascript';
    this.element = headerEl.appendChild(element);
  }
}
