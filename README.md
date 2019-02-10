# acceptjs-angular-wrapper

exposing the Authorize.net Accept.js Host your own script from an Angular service.

This service exposed one method ```generatePaymentNonce``` which will return a string promise of the nonce.
any script errors, or api errors should be returned in the promise rejection.

```ts
// file app.module.ts
import { NgModule } from '@angular/core';
import { TK_CONFIG, Config, AcceptJSService } from '@openutility/acceptjs-angular-wrapper';

/*
  Build the configuration file passing in the AcceptJS
  URL (testing or prod)
  and your apiLoginID and client key
//*/
const AcceptJSConfig: Config = {
  acceptjsUrl: 'mockAcceptjs.js'
  , apiLoginID: '123'
  , clientKey: '456'
};

@NgModule({
  providers: [
    {
      provide: TK_CONFIG,
      useValue: AcceptJSConfig
    },
    AcceptJSService
  ]
})
export class AppModule { }
```

```ts
// file app.component.ts
import { Component, OnInit  } from '@angular/core';
import { TK_CONFIG, Config, AcceptJSService } from '@openutility/acceptjs-angular-wrapper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(private _acceptJSSrv: AcceptJSService) { }

    async onSubmit(cc: CreditCard): void {
      try {
        const nonce = await this._acceptJSSrv.generatePaymentNonce(cc);
        // submit nonce to your server with payment amount
      } catch (ex) {
        console.error(ex);
      }
    }
}
```
