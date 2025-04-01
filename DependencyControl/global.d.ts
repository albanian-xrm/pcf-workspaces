/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable no-var */

/// <reference path="../StubLibrary/myLib.d.ts" />
import * as MyLib from 'myLib';

declare global {
    var myLib: typeof MyLib;
}

export { };
