!function(t){function e(r){if(n[r])return n[r].exports;var s=n[r]={i:r,l:!1,exports:{}};return t[r].call(s.exports,s,s.exports,e),s.l=!0,s.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=1)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e,n){void 0===e&&(e="2018/01/01 00:00:00"),this.visibleDays=!1,this.targetDate=new Date(e).getTime(),this.countdown=document.getElementById(t),this.visibleDays=!!n}return t.prototype.getCountdown=function(){var t=(new Date).getTime(),e=(this.targetDate-t)/1e3;this.days=this.pad(parseInt(String(e/86400))),e%=86400,this.hours=this.pad(parseInt(String(e/3600))),e%=3600,this.minutes=this.pad(parseInt(String(e/60))),this.seconds=this.pad(parseInt(String(e%60))),"00"===this.days&&"00"===this.hours&&"00"===this.minutes&&"00"===this.seconds&&this.stop(),this.countdown.innerHTML=this.daysStr+this.hoursStr+this.minutesStr+this.secondsStr},Object.defineProperty(t.prototype,"daysStr",{get:function(){return this.visibleDays?"<span>"+this.days+"</span>:":""},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"hoursStr",{get:function(){return"<span>"+this.hours+"</span>:"},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"minutesStr",{get:function(){return"<span>"+this.minutes+"</span>:"},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"secondsStr",{get:function(){return"<span>"+this.seconds+"</span>"},enumerable:!0,configurable:!0}),t.prototype.pad=function(t){return t<=0?"00":(t<10?"0":"")+t},t.prototype.start=function(){this.stop(),this.getCountdown();var t=this;return this.timer=setInterval(function(){t.getCountdown()},1e3),this},t.prototype.stop=function(){clearInterval(this.timer)},t}();e.clock=function(t,e,n){return new r(t,e,n)},e.default=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0);n.n(r);n.i(r.clock)("clock","2218/11/01 24:00:00").start()}]);
//# sourceMappingURL=index.js.map
