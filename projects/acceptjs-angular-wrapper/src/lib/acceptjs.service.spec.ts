import { TestBed, inject } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import { AcceptJSService } from './acceptjs.service';

import { TK_CONFIG } from './tk-config';

import { Config, CreditCard } from './models';
import { MockDocument } from './testing/mock-document';

const testConfig: Config = {
  acceptjsUrl: 'mockAcceptjs.js'
  , apiLoginID: '123'
  , clientKey: '456'
};

const newMockDoc = new MockDocument();

describe('AcceptService', () => {
  let mcDocGetElementsByTagSpy = null;
  const header: HTMLElement = document.createElement('head');
  beforeEach(() => {
    mcDocGetElementsByTagSpy = spyOn(newMockDoc, 'getElementsByTagName').and.callFake(() => [header]);
    TestBed.configureTestingModule({
      providers: [
        AcceptJSService,
        {
          provide: TK_CONFIG,
          useValue: testConfig
        },
        {
          provide: DOCUMENT,
          useValue: newMockDoc
        }
      ]
    });


  });

  it('should create the service', inject([AcceptJSService], (service: AcceptJSService) => {
    expect(service).toBeTruthy();
  }));

  describe('dom events', () => {
    const domEvHeader: HTMLElement = document.createElement('head');

    beforeEach(() => {
      mcDocGetElementsByTagSpy.and.callFake(() => [domEvHeader]);
    });

    afterEach(() => {
      // remove the attached header from each one, since 'destroy' isn't called.
      [].forEach.call(domEvHeader.childNodes, (v, k) => {
        domEvHeader.removeChild(v);
      });
    });

    it('should attach the AcceptJS script to the dom', inject([AcceptJSService],
      (service: AcceptJSService) => {
        expect(domEvHeader.childNodes.length).toBe(1);
    }));

    it('should detatch the AcceptJS script from the dom on destroy', inject([AcceptJSService],
      (service: AcceptJSService) => {
        service.ngOnDestroy();
        expect(domEvHeader.childNodes.length).toBe(0);
   }));
  });

  describe('methods', () => {
    let acpSrv: AcceptJSService = null;
    const testCC: CreditCard = {
      cardNumber: '4111111111111111'
      , cardCode: '1234'
      , month: '12'
      , year: '2055'
    };
    let mockAccept = null;
    beforeAll(inject([AcceptJSService],
      (service: AcceptJSService) => {
        acpSrv = service;
        mockAccept = jasmine.createSpyObj('Accept', ['dispatchData']);
        window['Accept'] = mockAccept;

    }));
    afterAll(() => {
      delete window['Accept'];
    });
    it('should return a nonce when a valid responce returns', async () => {
      try {
        mockAccept.dispatchData.and.callFake((data, fn) => {
          expect(data.authData.clientKey).toEqual(testConfig.clientKey);
          expect(data.authData.apiLoginID).toEqual(testConfig.apiLoginID);
          expect(data.cardData).toBe(testCC);
          fn({messages: {resultCode: 'ok'}, opaqueData: {dataValue: 'ABC'}});
        });
        const rply = await acpSrv.generatePaymentNonce(testCC);
        expect(rply).toEqual('ABC');
      } catch (ex) {
        console.error(ex);
        expect(ex).toBeFalsy();
      }
    });

    it('should reject when the request errors', async () => {
      const rtnData = {messages: {resultCode: 'Error'}};
      try {
        mockAccept.dispatchData.and.callFake((data, fn) => {
          fn(rtnData);
        });
        const rply = await acpSrv.generatePaymentNonce(testCC);
        expect(rply).toBeFalsy();
      } catch (ex) {
        expect(ex).toBe(rtnData);
      }
    });
  });
});
