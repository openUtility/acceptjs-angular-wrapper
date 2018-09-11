# acceptjs-angular-wrapper

exposing the Authorize.net Accept.js Host your own script from an Angular6 service.

```ts
// file app.module.ts
import { NgModule } from '@angular/core';
import { AcceptJSService, CreditCard } from 'acceptjs-angular-wrapper';

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
import { TK_CONFIG, Config, AcceptJSService } from 'acceptjs-angular-wrapper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(private _acceptJSSrv: AcceptJSService) { }

    onSubmit(cc: CreditCard) {
        nonce = this._acceptJSSrv.generatePaymentNonce(cc);
        // submit nonce to your server with payment amount
    }
}
```
