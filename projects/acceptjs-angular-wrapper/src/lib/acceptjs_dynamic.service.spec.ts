import { TestBed, inject, fakeAsync } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import { AcceptJSService } from './acceptjs.service';

import { TK_CONFIG } from './tk-config';

import { Config } from './models';
import { MockDocument } from './testing/mock-document';
import { BehaviorSubject } from 'rxjs';

const testConfig: Config = {
  acceptjsUrl: 'mockAcceptjs.js'
  , apiLoginID: '123'
  , clientKey: '456'
};
const testConfig2: Config = {
  acceptjsUrl: 'mockAcceptjs2.js'
  , apiLoginID: '444'
  , clientKey: '555'
};

const dynamicConfig = new BehaviorSubject<Config>(testConfig);

const newMockDoc = new MockDocument();

describe('AcceptService_dynamic', () => {
  let mcDocGetElementsByTagSpy = null;
  const header: HTMLElement = document.createElement('head');
  beforeEach(() => {
    mcDocGetElementsByTagSpy = spyOn(newMockDoc, 'getElementsByTagName').and.callFake(() => [header]);
    TestBed.configureTestingModule({
      providers: [
        AcceptJSService,
        {
          provide: TK_CONFIG,
          useValue: dynamicConfig
        },
        {
          provide: DOCUMENT,
          useValue: newMockDoc
        }
      ]
    });


  });

  describe('dom events', () => {
    const domEvHeader: HTMLElement = document.createElement('head');
    let accpSrv: AcceptJSService;

    beforeEach(() => {
      mcDocGetElementsByTagSpy.and.callFake(() => [domEvHeader]);
    });

    beforeEach(inject([AcceptJSService], (service: AcceptJSService) => {
        accpSrv = service;
    }));

    afterEach(fakeAsync(() => {
      // remove the attached header from each one, since 'destroy' isn't called.
      // dynamicConfig.next(testConfig);
      accpSrv.ngOnDestroy();
      [].forEach.call(domEvHeader.childNodes, (v, k) => {
        domEvHeader.removeChild(v);
      });
    }));

    it('should attach the AcceptJS script to the dom', fakeAsync(() => {
        expect(domEvHeader.childNodes.length).toBe(1);
        expect((domEvHeader.childNodes[0] as any).getAttribute('src')).toEqual(testConfig.acceptjsUrl);
    }));

    it('should detatch the AcceptJS script from the dom on destroy',  fakeAsync(() => {
        accpSrv.ngOnDestroy();
        expect(domEvHeader.childNodes.length).toBe(0);
    }));

    it('should change the script when the Object changes', fakeAsync(() => {
        expect(domEvHeader.childNodes.length).toBe(1);
        expect((domEvHeader.childNodes[0] as any).getAttribute('src')).toEqual(testConfig.acceptjsUrl);
        dynamicConfig.next(testConfig2);
        expect(domEvHeader.childNodes.length).toBe(1);
        expect((domEvHeader.childNodes[0] as any).getAttribute('src')).toEqual(testConfig2.acceptjsUrl);
    }));
  });
});
