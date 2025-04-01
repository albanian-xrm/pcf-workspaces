// UMD module pattern

var myLib = (function (exports) {
  "use strict";

  function sayHello() {
    return "Hello from myLib";
  }

  exports.sayHello = sayHello;

  return exports;
})(/** @type {import('myLib')}  */ ({}));
