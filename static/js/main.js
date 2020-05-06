(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.payment || (g.payment = {})).js = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var QJ, rreturn, rtrim;

QJ = function(selector) {
  if (QJ.isDOMElement(selector)) {
    return selector;
  }
  return document.querySelectorAll(selector);
};

QJ.isDOMElement = function(el) {
  return el && (el.nodeName != null);
};

rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

QJ.trim = function(text) {
  if (text === null) {
    return "";
  } else {
    return (text + "").replace(rtrim, "");
  }
};

rreturn = /\r/g;

QJ.val = function(el, val) {
  var ret;
  if (arguments.length > 1) {
    return el.value = val;
  } else {
    ret = el.value;
    if (typeof ret === "string") {
      return ret.replace(rreturn, "");
    } else {
      if (ret === null) {
        return "";
      } else {
        return ret;
      }
    }
  }
};

QJ.preventDefault = function(eventObject) {
  if (typeof eventObject.preventDefault === "function") {
    eventObject.preventDefault();
    return;
  }
  eventObject.returnValue = false;
  return false;
};

QJ.normalizeEvent = function(e) {
  var original;
  original = e;
  e = {
    which: original.which != null ? original.which : void 0,
    target: original.target || original.srcElement,
    preventDefault: function() {
      return QJ.preventDefault(original);
    },
    originalEvent: original,
    data: original.data || original.detail
  };
  if (e.which == null) {
    e.which = original.charCode != null ? original.charCode : original.keyCode;
  }
  return e;
};

QJ.on = function(element, eventName, callback) {
  var el, i, j, len, len1, multEventName, originalCallback, ref;
  if (element.length) {
    for (i = 0, len = element.length; i < len; i++) {
      el = element[i];
      QJ.on(el, eventName, callback);
    }
    return;
  }
  if (eventName.match(" ")) {
    ref = eventName.split(" ");
    for (j = 0, len1 = ref.length; j < len1; j++) {
      multEventName = ref[j];
      QJ.on(element, multEventName, callback);
    }
    return;
  }
  originalCallback = callback;
  callback = function(e) {
    e = QJ.normalizeEvent(e);
    return originalCallback(e);
  };
  if (element.addEventListener) {
    return element.addEventListener(eventName, callback, false);
  }
  if (element.attachEvent) {
    eventName = "on" + eventName;
    return element.attachEvent(eventName, callback);
  }
  element['on' + eventName] = callback;
};

QJ.addClass = function(el, className) {
  var e;
  if (el.length) {
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = el.length; i < len; i++) {
        e = el[i];
        results.push(QJ.addClass(e, className));
      }
      return results;
    })();
  }
  if (el.classList) {
    return el.classList.add(className);
  } else {
    return el.className += ' ' + className;
  }
};

QJ.hasClass = function(el, className) {
  var e, hasClass, i, len;
  if (el.length) {
    hasClass = true;
    for (i = 0, len = el.length; i < len; i++) {
      e = el[i];
      hasClass = hasClass && QJ.hasClass(e, className);
    }
    return hasClass;
  }
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
};

QJ.removeClass = function(el, className) {
  var cls, e, i, len, ref, results;
  if (el.length) {
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = el.length; i < len; i++) {
        e = el[i];
        results.push(QJ.removeClass(e, className));
      }
      return results;
    })();
  }
  if (el.classList) {
    ref = className.split(' ');
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      cls = ref[i];
      results.push(el.classList.remove(cls));
    }
    return results;
  } else {
    return el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

QJ.toggleClass = function(el, className, bool) {
  var e;
  if (el.length) {
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = el.length; i < len; i++) {
        e = el[i];
        results.push(QJ.toggleClass(e, className, bool));
      }
      return results;
    })();
  }
  if (bool) {
    if (!QJ.hasClass(el, className)) {
      return QJ.addClass(el, className);
    }
  } else {
    return QJ.removeClass(el, className);
  }
};

QJ.append = function(el, toAppend) {
  var e;
  if (el.length) {
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = el.length; i < len; i++) {
        e = el[i];
        results.push(QJ.append(e, toAppend));
      }
      return results;
    })();
  }
  return el.insertAdjacentHTML('beforeend', toAppend);
};

QJ.find = function(el, selector) {
  if (el instanceof NodeList || el instanceof Array) {
    el = el[0];
  }
  return el.querySelectorAll(selector);
};

QJ.trigger = function(el, name, data) {
  var e, error, ev;
  try {
    ev = new CustomEvent(name, {
      detail: data
    });
  } catch (error) {
    e = error;
    ev = document.createEvent('CustomEvent');
    if (ev.initCustomEvent) {
      ev.initCustomEvent(name, true, true, data);
    } else {
      ev.initEvent(name, true, true, data);
    }
  }
  return el.dispatchEvent(ev);
};

module.exports = QJ;


},{}],2:[function(require,module,exports){
(function (global){
var Payment, QJ, cardFromNumber, cardFromType, cards, defaultFormat, formatBackCardNumber, formatBackExpiry, formatCardNumber, formatExpiry, formatForwardExpiry, formatForwardSlash, formatMonthExpiry, hasTextSelected, luhnCheck, reFormatCardNumber, restrictCVC, restrictCardNumber, restrictCombinedExpiry, restrictExpiry, restrictMonthExpiry, restrictNumeric, restrictYearExpiry, setCardType,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

QJ = require('qj/src/qj.coffee');

defaultFormat = /(\d{1,4})/g;

cards = [
  {
    type: 'amex',
    pattern: /^3[47]/,
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    length: [15],
    cvcLength: [4],
    luhn: true
  }, {
    type: 'dankort',
    pattern: /^5019/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'dinersclub',
    pattern: /^(36|38|30[0-5])/,
    format: defaultFormat,
    length: [14],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'discover',
    pattern: /^(6011|65|64[4-9]|622)/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'jcb',
    pattern: /^35/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'laser',
    pattern: /^(6706|6771|6709)/,
    format: defaultFormat,
    length: [16, 17, 18, 19],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'maestro',
    pattern: /^(5018|5020|5038|6304|6703|6759|676[1-3])/,
    format: defaultFormat,
    length: [12, 13, 14, 15, 16, 17, 18, 19],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'mastercard',
    pattern: /^5[1-5]/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'unionpay',
    pattern: /^62/,
    format: defaultFormat,
    length: [16, 17, 18, 19],
    cvcLength: [3],
    luhn: false
  }, {
    type: 'visaelectron',
    pattern: /^4(026|17500|405|508|844|91[37])/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'visa',
    pattern: /^4/,
    format: defaultFormat,
    length: [13, 16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'elo',
    pattern: /^4011|438935|45(1416|76)|50(4175|6699|67|90[4-7])|63(6297|6368)/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }
];

cardFromNumber = function(num) {
  var card, i, len;
  num = (num + '').replace(/\D/g, '');
  for (i = 0, len = cards.length; i < len; i++) {
    card = cards[i];
    if (card.pattern.test(num)) {
      return card;
    }
  }
};

cardFromType = function(type) {
  var card, i, len;
  for (i = 0, len = cards.length; i < len; i++) {
    card = cards[i];
    if (card.type === type) {
      return card;
    }
  }
};

luhnCheck = function(num) {
  var digit, digits, i, len, odd, sum;
  odd = true;
  sum = 0;
  digits = (num + '').split('').reverse();
  for (i = 0, len = digits.length; i < len; i++) {
    digit = digits[i];
    digit = parseInt(digit, 10);
    if ((odd = !odd)) {
      digit *= 2;
    }
    if (digit > 9) {
      digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

hasTextSelected = function(target) {
  var ref;
  if ((target.selectionStart != null) && target.selectionStart !== target.selectionEnd) {
    return true;
  }
  if ((typeof document !== "undefined" && document !== null ? (ref = document.selection) != null ? ref.createRange : void 0 : void 0) != null) {
    if (document.selection.createRange().text) {
      return true;
    }
  }
  return false;
};

reFormatCardNumber = function(e) {
  return setTimeout((function(_this) {
    return function() {
      var target, value;
      target = e.target;
      value = QJ.val(target);
      value = Payment.fns.formatCardNumber(value);
      return QJ.val(target, value);
    };
  })(this));
};

formatCardNumber = function(e) {
  var card, digit, length, re, target, upperLength, value;
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  target = e.target;
  value = QJ.val(target);
  card = cardFromNumber(value + digit);
  length = (value.replace(/\D/g, '') + digit).length;
  upperLength = 16;
  if (card) {
    upperLength = card.length[card.length.length - 1];
  }
  if (length >= upperLength) {
    return;
  }
  if ((target.selectionStart != null) && target.selectionStart !== value.length) {
    return;
  }
  if (card && card.type === 'amex') {
    re = /^(\d{4}|\d{4}\s\d{6})$/;
  } else {
    re = /(?:^|\s)(\d{4})$/;
  }
  if (re.test(value)) {
    e.preventDefault();
    return QJ.val(target, value + ' ' + digit);
  } else if (re.test(value + digit)) {
    e.preventDefault();
    return QJ.val(target, value + digit + ' ');
  }
};

formatBackCardNumber = function(e) {
  var target, value;
  target = e.target;
  value = QJ.val(target);
  if (e.meta) {
    return;
  }
  if (e.which !== 8) {
    return;
  }
  if ((target.selectionStart != null) && target.selectionStart !== value.length) {
    return;
  }
  if (/\d\s$/.test(value)) {
    e.preventDefault();
    return QJ.val(target, value.replace(/\d\s$/, ''));
  } else if (/\s\d?$/.test(value)) {
    e.preventDefault();
    return QJ.val(target, value.replace(/\s\d?$/, ''));
  }
};

formatExpiry = function(e) {
  var digit, target, val;
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  target = e.target;
  val = QJ.val(target) + digit;
  if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
    e.preventDefault();
    return QJ.val(target, "0" + val + " / ");
  } else if (/^\d\d$/.test(val)) {
    e.preventDefault();
    return QJ.val(target, val + " / ");
  }
};

formatMonthExpiry = function(e) {
  var digit, target, val;
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  target = e.target;
  val = QJ.val(target) + digit;
  if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
    e.preventDefault();
    return QJ.val(target, "0" + val);
  } else if (/^\d\d$/.test(val)) {
    e.preventDefault();
    return QJ.val(target, "" + val);
  }
};

formatForwardExpiry = function(e) {
  var digit, target, val;
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  target = e.target;
  val = QJ.val(target);
  if (/^\d\d$/.test(val)) {
    return QJ.val(target, val + " / ");
  }
};

formatForwardSlash = function(e) {
  var slash, target, val;
  slash = String.fromCharCode(e.which);
  if (slash !== '/') {
    return;
  }
  target = e.target;
  val = QJ.val(target);
  if (/^\d$/.test(val) && val !== '0') {
    return QJ.val(target, "0" + val + " / ");
  }
};

formatBackExpiry = function(e) {
  var target, value;
  if (e.metaKey) {
    return;
  }
  target = e.target;
  value = QJ.val(target);
  if (e.which !== 8) {
    return;
  }
  if ((target.selectionStart != null) && target.selectionStart !== value.length) {
    return;
  }
  if (/\d(\s|\/)+$/.test(value)) {
    e.preventDefault();
    return QJ.val(target, value.replace(/\d(\s|\/)*$/, ''));
  } else if (/\s\/\s?\d?$/.test(value)) {
    e.preventDefault();
    return QJ.val(target, value.replace(/\s\/\s?\d?$/, ''));
  }
};

restrictNumeric = function(e) {
  var input;
  if (e.metaKey || e.ctrlKey) {
    return true;
  }
  if (e.which === 32) {
    return e.preventDefault();
  }
  if (e.which === 0) {
    return true;
  }
  if (e.which < 33) {
    return true;
  }
  input = String.fromCharCode(e.which);
  if (!/[\d\s]/.test(input)) {
    return e.preventDefault();
  }
};

restrictCardNumber = function(e) {
  var card, digit, target, value;
  target = e.target;
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  if (hasTextSelected(target)) {
    return;
  }
  value = (QJ.val(target) + digit).replace(/\D/g, '');
  card = cardFromNumber(value);
  if (card) {
    if (!(value.length <= card.length[card.length.length - 1])) {
      return e.preventDefault();
    }
  } else {
    if (!(value.length <= 16)) {
      return e.preventDefault();
    }
  }
};

restrictExpiry = function(e, length) {
  var digit, target, value;
  target = e.target;
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  if (hasTextSelected(target)) {
    return;
  }
  value = QJ.val(target) + digit;
  value = value.replace(/\D/g, '');
  if (value.length > length) {
    return e.preventDefault();
  }
};

restrictCombinedExpiry = function(e) {
  return restrictExpiry(e, 6);
};

restrictMonthExpiry = function(e) {
  return restrictExpiry(e, 2);
};

restrictYearExpiry = function(e) {
  return restrictExpiry(e, 4);
};

restrictCVC = function(e) {
  var digit, target, val;
  target = e.target;
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  if (hasTextSelected(target)) {
    return;
  }
  val = QJ.val(target) + digit;
  if (!(val.length <= 4)) {
    return e.preventDefault();
  }
};

setCardType = function(e) {
  var allTypes, card, cardType, target, val;
  target = e.target;
  val = QJ.val(target);
  cardType = Payment.fns.cardType(val) || 'unknown';
  if (!QJ.hasClass(target, cardType)) {
    allTypes = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = cards.length; i < len; i++) {
        card = cards[i];
        results.push(card.type);
      }
      return results;
    })();
    QJ.removeClass(target, 'unknown');
    QJ.removeClass(target, allTypes.join(' '));
    QJ.addClass(target, cardType);
    QJ.toggleClass(target, 'identified', cardType !== 'unknown');
    return QJ.trigger(target, 'payment.cardType', cardType);
  }
};

Payment = (function() {
  function Payment() {}

  Payment.fns = {
    cardExpiryVal: function(value) {
      var month, prefix, ref, year;
      value = value.replace(/\s/g, '');
      ref = value.split('/', 2), month = ref[0], year = ref[1];
      if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
        prefix = (new Date).getFullYear();
        prefix = prefix.toString().slice(0, 2);
        year = prefix + year;
      }
      month = parseInt(month, 10);
      year = parseInt(year, 10);
      return {
        month: month,
        year: year
      };
    },
    validateCardNumber: function(num) {
      var card, ref;
      num = (num + '').replace(/\s+|-/g, '');
      if (!/^\d+$/.test(num)) {
        return false;
      }
      card = cardFromNumber(num);
      if (!card) {
        return false;
      }
      return (ref = num.length, indexOf.call(card.length, ref) >= 0) && (card.luhn === false || luhnCheck(num));
    },
    validateCardExpiry: function(month, year) {
      var currentTime, expiry, prefix, ref;
      if (typeof month === 'object' && 'month' in month) {
        ref = month, month = ref.month, year = ref.year;
      }
      if (!(month && year)) {
        return false;
      }
      month = QJ.trim(month);
      year = QJ.trim(year);
      if (!/^\d+$/.test(month)) {
        return false;
      }
      if (!/^\d+$/.test(year)) {
        return false;
      }
      if (!(parseInt(month, 10) <= 12)) {
        return false;
      }
      if (year.length === 2) {
        prefix = (new Date).getFullYear();
        prefix = prefix.toString().slice(0, 2);
        year = prefix + year;
      }
      expiry = new Date(year, month);
      currentTime = new Date;
      expiry.setMonth(expiry.getMonth() - 1);
      expiry.setMonth(expiry.getMonth() + 1, 1);
      return expiry > currentTime;
    },
    validateCardCVC: function(cvc, type) {
      var ref, ref1;
      cvc = QJ.trim(cvc);
      if (!/^\d+$/.test(cvc)) {
        return false;
      }
      if (type && cardFromType(type)) {
        return ref = cvc.length, indexOf.call((ref1 = cardFromType(type)) != null ? ref1.cvcLength : void 0, ref) >= 0;
      } else {
        return cvc.length >= 3 && cvc.length <= 4;
      }
    },
    cardType: function(num) {
      var ref;
      if (!num) {
        return null;
      }
      return ((ref = cardFromNumber(num)) != null ? ref.type : void 0) || null;
    },
    formatCardNumber: function(num) {
      var card, groups, ref, upperLength;
      card = cardFromNumber(num);
      if (!card) {
        return num;
      }
      upperLength = card.length[card.length.length - 1];
      num = num.replace(/\D/g, '');
      num = num.slice(0, +upperLength + 1 || 9e9);
      if (card.format.global) {
        return (ref = num.match(card.format)) != null ? ref.join(' ') : void 0;
      } else {
        groups = card.format.exec(num);
        if (groups != null) {
          groups.shift();
        }
        return groups != null ? groups.join(' ') : void 0;
      }
    }
  };

  Payment.restrictNumeric = function(el) {
    return QJ.on(el, 'keypress', restrictNumeric);
  };

  Payment.cardExpiryVal = function(el) {
    return Payment.fns.cardExpiryVal(QJ.val(el));
  };

  Payment.formatCardCVC = function(el) {
    Payment.restrictNumeric(el);
    QJ.on(el, 'keypress', restrictCVC);
    return el;
  };

  Payment.formatCardExpiry = function(el) {
    var month, year;
    Payment.restrictNumeric(el);
    if (el.length && el.length === 2) {
      month = el[0], year = el[1];
      this.formatCardExpiryMultiple(month, year);
    } else {
      QJ.on(el, 'keypress', restrictCombinedExpiry);
      QJ.on(el, 'keypress', formatExpiry);
      QJ.on(el, 'keypress', formatForwardSlash);
      QJ.on(el, 'keypress', formatForwardExpiry);
      QJ.on(el, 'keydown', formatBackExpiry);
    }
    return el;
  };

  Payment.formatCardExpiryMultiple = function(month, year) {
    QJ.on(month, 'keypress', restrictMonthExpiry);
    QJ.on(month, 'keypress', formatMonthExpiry);
    return QJ.on(year, 'keypress', restrictYearExpiry);
  };

  Payment.formatCardNumber = function(el) {
    Payment.restrictNumeric(el);
    QJ.on(el, 'keypress', restrictCardNumber);
    QJ.on(el, 'keypress', formatCardNumber);
    QJ.on(el, 'keydown', formatBackCardNumber);
    QJ.on(el, 'keyup', setCardType);
    QJ.on(el, 'paste', reFormatCardNumber);
    return el;
  };

  Payment.getCardArray = function() {
    return cards;
  };

  Payment.setCardArray = function(cardArray) {
    cards = cardArray;
    return true;
  };

  Payment.addToCardArray = function(cardObject) {
    return cards.push(cardObject);
  };

  Payment.removeFromCardArray = function(type) {
    var key, value;
    for (key in cards) {
      value = cards[key];
      if (value.type === type) {
        cards.splice(key, 1);
      }
    }
    return true;
  };

  return Payment;

})();

module.exports = Payment;

global.Payment = Payment;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"qj/src/qj.coffee":1}]},{},[2])(2)
});// MinnPost Giving plugin
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = 'minnpost_giving',
  defaults = {
    'debug' : false, // this can be set to true on page level options
    'tabs' : true, // are we doing the tab thing
    'stripe_publishable_key' : '',
    'plaid_env' : '',
    'plaid_public_key' : '',
    'plaid_link' : '#authorize-ach',
    'minnpost_root' : 'https://www.minnpost.com',
    'donate_form_selector': '#donate',
    'review_step_selector' : '#panel--review',
    'details_step_selector' : '#panel--details',
    'attendees_step_selector' : '#panel--attendees',
    'donate_step_selector' : '#panel--pay',
    'confirm_form_selector' : '#confirm',
    'confirm_step_selector' : '#panel--confirmation',
    'active' : 'panel--pay',
    'confirm' : 'panel--confirmation',
    'query' : 'step',
    'pay_cc_processing_selector' : 'input[id="edit-pay-fees"]',
    'fee_amount' : '.processing-amount',
    'level_amount_selector' : '#panel--review .amount .level-amount',
    'original_amount_selector' : '#amount',
    'frequency_selector' : '.frequency',
    'full_amount_selector' : '.full-amount',
    'update_amount_selector' : '#new-amount',
    'level_indicator_selector' : 'h2.level',
    'level_name_selector' : '.level-name',
    'review_benefits_selector' : '.review-benefits',
    'allow_upsell' : true,
    'upsell_btn_selector' : '.btn--upsell',
    'upsell_selector' : '.well--upsell',
    'upsell_amount_selector' : '.upsell-amount',
    'swag_selector' : '.swag',
    'swag_decline_selector' : '#swag-no',
    'swag_nyt_selector' : 'input[name="nyt"]',
    'separate_swag_selector' : 'fieldset.swag--separate',
    'separate_swag_redeem' : '.swag-redeem--separate',
    'swag_selector_choose_multiple' : '.swag--choose-multiple',
    'swag_choose_multiple_name' : 'swag_thankyou',
    'atlantic_status' : 'input[name="swag_atlanticsubscription"]',
    'atlantic_existing' : '#atlantic_existing',
    'atlantic_selector' : '.form-item--atlantic_id',
    'name_selector' : '.form-item--display-name',
    'honor_memory_name_selector' : '.form-item--honor-memory',
    'honor_or_memory_chooser' : 'input[name="in-honor-or-memory"]',
    'honor_name_selector' : '.honor',
    'memory_name_selector' : '.memory',
    'honor_selector' : '#edit-in-honor',
    'memory_selector' : '#edit-in-memory',
    'notify_selector' : '.notify_someone',
    'notify_field_selector' : '.form-item--notify',
    'anonymous_selector' : '#edit-anonymous',
    'show_billing_country_selector' : '#billing_show_country',
    'billing_country_selector' : '.form-item--country',
    'show_shipping_country_selector' : '#shipping_show_country',
    'shipping_country_selector' : '.form-item--shipping-country',
    //'needs_shipping_selector' : '.swag--shipping',
    'shipping_address_selector' : '.form-item--shipping-address',
    'use_for_shipping_selector' : '#useforshipping',
    'email_field_selector' : '#edit-email',
    'password_field_selector' : '#password',
    'first_name_field_selector' : '#first_name',
    'last_name_field_selector' : '#last_name',
    'account_city_selector' : '#billing_city',
    'account_state_selector' : '#billing_state',
    'account_zip_selector' : '#billing_zip',
    'create_mp_selector' : '#creatempaccount',
    'password_selector' : '.form-item--password',
    'additional_amount_field' : '#additional_donation',
    'additional_amount_selector' : '.additional_donation',
    'has_additional_text_selector' : '.has_additional',
    'billing_selector' : 'fieldset.billing',
    'shipping_selector' : 'fieldset.shipping',
    'credit_card_fieldset' : '.payment-method-group',
    'choose_payment' : '#choose-payment-method',
    'payment_method_selector' : '.payment-method',
    'cc_num_selector' : '#card-number',
    'cc_exp_selector' : '#card-expiry',
    'cc_cvv_selector' : '#card-cvc',
    'payment_button_selector' : '#submit',
    'confirm_button_selector' : '#finish',
    'opp_id_selector' : '#flask_id',
    'recurring_selector' : '#recurring',
    'newsletter_group_selector' : '.support-newsletters',
    'reason_field_selector' : '#reason_for_supporting',
    'share_reason_selector' : '#reason_shareable',
    'confirm_top_selector' : '.support--post-confirm',
    'existing_newsletter_settings' : '',
    'levels' : {
      1 : {
        'name' : 'bronze',
        'max' : 60
      },
      2 : {
        'name' : 'silver',
        'min' : 60,
        'max' : 120
      },
      3 : {
        'name' : 'gold',
        'min' : 120,
        'max' : 240
      },
      4 : {
        'name' : 'platinum',
        'min' : 240
      }
    },
    'upsell' : {
      'bronze' : true,
      'silver' : 9,
      'gold' : 19,
      'platinum' : false
    },

  }; // end defaults

  // The actual plugin constructor
  function Plugin( element, options ) {

    this.element = element;

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend( {}, defaults, options );

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  } // end constructor

  Plugin.prototype = {

    init: function(reset, amount) {

      // Place initialization logic here
      // You already have access to the DOM element and
      // the options via the instance, e.g. this.element
      // and this.options
      // you can add more functions like the one below and
      // call them like so: this.yourOtherFunction(this.element, this.options).

      // modify options as needed
      //var this.options.amount = '';
      if (reset !== true) {
        this.options.amount = parseFloat($(this.options.level_amount_selector, this.element).text());
      } else {
        this.options.amount = amount;
      }
      this.options.original_amount = parseInt($(this.options.original_amount_selector, this.element).val(), 10);
      this.options.frequency = parseFloat($(this.options.frequency_selector, this.element).attr('data-year-freq'));
      var recurring = $(this.options.recurring_selector, this.element).val();
      if (typeof recurring !== 'undefined') {
        this.options.recurring = recurring.charAt(0).toUpperCase() + recurring.slice(1);
      }
      
      this.options.processing_fee = (Math.round(parseFloat(this.options.fee_amount)*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
      this.options.processing_fee_text = this.options.processing_fee;
      
      this.options.upsell_amount = parseFloat($(this.options.upsell_amount_selector, this.element).text());
      this.options.upsold = this.options.amount + this.options.upsell_amount;
      this.options.cardType = null;
      this.options.create_account = false;

      var button_text = $('button.give, input.give').text();
      this.options.button_text = button_text;

      this.stripe = Stripe(this.options.stripe_publishable_key);
      this.elements = this.stripe.elements();

      // use a referrer for edit link if we have one
      if (document.referrer !== '') {
        $('#edit_url').prop('href', document.referrer);
      }

      if (this.options.debug === true) {
        this.debug(this.options);
        // return;
      }

      // tab stuff
      var query_panel = this.qs[this.options.query];
      if (typeof query_panel === 'undefined') {
        query_panel = this.options.active;
      }

      // call functions

      this.paymentPanels(query_panel); // tabs

      this.amountAsRadio(this.element, this.options); // if the amount field is a radio button
      this.amountUpdated(this.element, this.options); // if the amount text field can change

      if ($(this.options.pay_cc_processing_selector).length > 0) {
        this.creditCardProcessingFees(this.options); // processing fees
      }

      if ($(this.options.details_step_selector).length > 0 || $(this.options.review_step_selector).length > 0) {
        this.options.level = this.checkLevel(this.element, this.options, 'name'); // check what level it is
        this.options.levelnum = this.checkLevel(this.element, this.options, 'num'); // check what level it is as a number
        this.honorOrMemory(this.element, this.options); // in honor or in memory of someone
        this.swag(this.element, this.options, false); // manage swag display
        this.upsell(this.element, this.options, this.options.amount, this.options.frequency); // upsell to next level
      }
      
      if ($(this.options.donate_step_selector).length > 0) {
        this.donateAnonymously(this.element, this.options); // anonymous
        this.outsideUnitedStates(this.element, this.options); // outside US
        this.shippingAddress(this.element, this.options); // shipping address
        this.allowMinnpostAccount(this.element, this.options, false); // option for creating minnpost account
        this.choosePaymentMethod(this.element, this.options); // switch between card and ach
        this.creditCardFields(this.element, this.options); // do stuff with the credit card fields
        this.achFields(this.element, this.options); // do stuff for ach payments, if applicable to the form
        this.validateAndSubmit(this.element, this.options); // validate and submit the form
      }

      if ($(this.options.confirm_step_selector).length > 0) {
        this.showNewsletterSettings(this.element, this.options);
        this.confirmMessageSubmit(this.element, this.options); // submit the stuff on the confirmation page
      }

    }, // init

    qs: (function(a) {
      if (a === '') {
        return {};
      }
      var b = {};
      for (var i = 0; i < a.length; ++i) {
        var p=a[i].split('=', 2);
        if (p.length === 1) {
          b[p[0]] = '';
        } else {
          b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
        }
      }
      return b;
    })(window.location.search.substr(1).split('&')),

    debug: function(message) {
      if (this.options.debug === true) {
        if (typeof message !== 'object') {
          console.log(message);
        } else {
          console.dir(message);
        }
        console.dir(this);
      }
    }, // debug

    getQueryStrings: function(link) {
      if (typeof link === 'undefined' || link === '') {
        return {};
      } else {
        link = '?' + link.split('?')[1];
        link = link.substr(1).split('&');
      }
      var b = {};
      for (var i = 0; i < link.length; ++i) {
        var p=link[i].split('=', 2);
        if (p.length === 1) {
          b[p[0]] = '';
        } else {
          b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
        }
      }
      return b;
    }, // getQueryStrings

    paymentPanels: function(active) {
      var that = this;
      var usetabs = this.options.tabs;
      var title = 'MinnPost | Support Us | ';
      var page = $('.progress--donation li.' + active).text();
      var next = $('.progress--donation li.' + active).next().text();
      var step = $('.progress--donation li.' + active).index() + 1;
      var nav_item_count = $('.progress--donation li').length;
      var opp_id = $(this.options.opp_id_selector).val();
      var next_step = step + 1;
      var post_purchase = false;

      this.debug( 'step is ' + step + ' and nav item count is ' + nav_item_count + ' and opp id is ' + opp_id + ' and next step is ' + next_step );

      // this is the last visible step
      if ($(this.options.confirm_step_selector).length > 0) {
        active = this.options.confirm;
        $('.progress--donation li.' + active + ' span').addClass('active');
        step = $('.progress--donation li.' + active).index() + 1;
        // there is a continuation of the main form on this page. there is a button to click
        // this means there is another step
        if ($(this.options.confirm_button_selector).length > 0) {
          nav_item_count += 1;
        }
      }

      if (step === nav_item_count - 1 && $(this.options.opp_id_selector).length > 0) {
        this.debug('this is a payment step but there is a step after it');
        step = 'purchase';
      } else if (step === nav_item_count && $(this.options.opp_id_selector).length > 0) {
        this.debug('this is a payment step and there is no step after it');
        step = 'purchase';
      } else if (step === nav_item_count && $(this.options.opp_id_selector).length === 0) {
        this.debug('this is a post-finish step. it does not have an id');
        step = step + 1;
        post_purchase = true;
      }

      document.title = title + page;
      this.analyticsTrackingStep(step, title, post_purchase);

      // make some tabs for form
      if (usetabs === true) {
        $('.panel').hide();
      } else {
        $('.panel').show();
      }
      // activate the tabs
      if ($('.progress--donation li .active').length === 0) {
        $('#' + active).show();
        $('.progress--donation li.' + active + ' a').addClass('active');
      } else {
        active = $('.progress--donation li .active').parent().prop('class');
        $('#' + active).show();
      }
      
      /*$('.progress--donation li a, a.btn.btn--next').click(function(event) {
        event.preventDefault();
        $('.progress--donation li a').removeClass('active');
        var link = $(this).prop('href');
        var query = that.getQueryStrings(link);
        query = query['step'];
        $('.progress--donation li.' + query + ' a').addClass('active');
        that.paymentPanels(query);    
      });*/
    }, // paymentPanels

    analyticsTrackingStep: function(step, title, post_purchase) {
      var level = this.checkLevel(this.element, this.options, 'name'); // check what level it is
      var levelnum = this.checkLevel(this.element, this.options, 'num'); // check what level it is as a number
      var amount = $(this.options.original_amount_selector).val();
      var recurring = this.options.recurring;
      var opp_id = $(this.options.opp_id_selector).val();

      // if we're not after the purchase, use addProduct
      if ( post_purchase !== true ) {
        ga('ec:addProduct', {
          'id': 'minnpost_' + level.toLowerCase() + '_membership',
          'name': 'MinnPost ' + level.charAt(0).toUpperCase() + level.slice(1) + ' Membership',
          'category': 'Donation',
          'brand': 'MinnPost',
          'variant':  recurring,
          'price': amount,
          'quantity': 1
        });
      }

      if (step === 'purchase') {
        this.debug('add a purchase action. step is ' + step);
        ga('ec:setAction', step,{
          'id': opp_id, // Transaction id - Type: string
          'affiliation': 'MinnPost', // Store name - Type: string
          'revenue': amount, // Total Revenue - Type: numeric
        });
      } else {
        this.debug('add a checkout action. step is ' + step);
        ga('ec:setAction','checkout', {
          'step': step,            // A value of 1 indicates first checkout step.Value of 2 indicates second checkout step
        });
      }

      ga('set', {
        page: window.location.pathname,
        title: title
      });
      ga('send', 'pageview', window.location.pathname);

    }, // analyticsTrackingStep

    amountUpdated: function(element, options) {
      // when new amount text field can change, we need to change the hidden field
      var that = this;
      var payment_type = $(options.choose_payment + ' input').val();
      $(options.update_amount_selector, element).change(function() {
        $(options.original_amount_selector, element).val($(this).val());
        options.original_amount = parseInt($(options.original_amount_selector, element).val(), 10);
        if ( payment_type === 'ach' ) {
          that.calculateFees(that.options.original_amount, 'ach');
        } else {
          that.calculateFees(that.options.original_amount, 'visa');
        }
      });
    }, // amountUpdated

    amountAsRadio: function(element, options) {
      // when amount field is a radio button, we need to check it whenever it changes
      var that = this;
      var payment_type = $(options.choose_payment + ' input').val();
      $(options.original_amount_selector, element).change(function() {
        if ($(this).is(':radio')) {
            options.original_amount = parseInt($(options.original_amount_selector + ':checked', element).val(), 10);
            if ( payment_type === 'ach' ) {
              that.calculateFees(that.options.original_amount, 'ach');
            } else {
              that.calculateFees(that.options.original_amount, 'visa');
            }
          }
      });
      if ($(options.additional_amount_field, element).length > 0 ) {
        $(options.additional_amount_field, element).on('change paste keyup', function() {
          options.original_amount += parseInt($(options.additional_amount_field).val(), 10);
          if ( payment_type === 'ach' ) {
            that.calculateFees(that.options.original_amount, 'ach');
          } else {
            that.calculateFees(that.options.original_amount, 'visa');
          }
        });
      }
    }, // amountAsRadio

    calculateFees: function(amount, payment_type) {
      // this sends the amount and payment type to python; get the fee and display it to the user on the checkbox label
      var that = this;
      var data = {
        amount: amount,
        payment_type: payment_type
      };
      $.ajax({
        method: 'POST',
        url: '/calculate-fees/',
        data: data
      }).done(function( data ) {
        if ($(data.fees).length > 0) {
          $(that.options.fee_amount).text(data.fees);
          that.creditCardFeeCheckbox($(that.options.pay_cc_processing_selector));
        }
      });
    }, // calculateFees

    creditCardProcessingFees: function(options) {
      // this adds or subtracts the fee to the original amount when the user indicates they do or do not want to pay the fees
      var that = this;
      that.creditCardFeeCheckbox($(this.options.pay_cc_processing_selector));
      $(this.options.pay_cc_processing_selector).on('change', function () {
          that.creditCardFeeCheckbox(this);
      });
    }, // creditCardProcessingFees

    creditCardFeeCheckbox: function(field) {
      var full_amount;
      var that = this;
      if ($(field).is(':checked') || $(field).prop('checked')) {
        $('.amount .level-amount').addClass('full-amount');
        full_amount = (that.options.original_amount + parseFloat($(that.options.fee_amount).text()));
      } else {
        full_amount = that.options.original_amount;
      }
      $(that.options.full_amount_selector).text(parseFloat(full_amount).toFixed(2));
    }, // creditCardFeeCheckbox

    donateAnonymously: function(element, options) {
      if ($(options.anonymous_selector, element).is(':checked')) {
        $(options.name_selector + ' div:first', element).hide();
      } else {
        $(options.name_selector + ' div:first', element).show();
      }

      $(options.anonymous_selector, element).change(function() {
        if ($(this).is(':checked')) {
          $(options.name_selector + ' div:first', element).hide();
        } else {
          $(options.name_selector + ' div:first', element).show();
        }
      });
    }, // donateAnonymously

    checkLevel: function(element, options, returnvalue) {
      var level = '';
      var levelnum = 0;
      var levelclass = 'level level--';
      var amount_yearly;
      var frequency = options.frequency;
      var amount = options.original_amount;

      if (frequency === 12) {
        amount_yearly = amount * frequency;
      } else if (frequency === 1) {
        amount_yearly = amount;
      }
      
      $.each(options.levels, function(index, value) {
        var name = value.name;
        var num = index;
        var max = value.max;
        var min = value.min;
        if (typeof min !== 'undefined' && typeof max !== 'undefined') {
          if (amount_yearly >= min && amount_yearly < max) {
            level = name;
            levelnum = num;
            levelclass += num;
            return false;
          }
        } else if (typeof max !== 'undefined') {
          if (amount_yearly < max) {
            level = name;
            levelnum = num;
            levelclass += num;
            return false;
          }
        } else if (typeof min !== 'undefined') {
          if (amount_yearly >= min) {
            level = name;
            levelnum = num;
            levelclass += num;
            return false;
          }
        }
      });
      if ($(options.level_indicator_selector).length > 0 && $(options.review_benefits_selector).length > 0) {
        $(options.level_indicator_selector, element).prop('class', levelclass);
        $(options.level_name_selector).text(level.charAt(0).toUpperCase() + level.slice(1));

        var review_level_benefits = this.getQueryStrings($(options.review_benefits_selector, element).prop('href'));
        review_level_benefits = review_level_benefits['level'];
        
        var link = $(options.review_benefits_selector, element).prop('href');
        link = link.replace(review_level_benefits, level);
        $(options.review_benefits_selector).prop('href', link);
      }
      if (returnvalue === 'name') {
        return level;
      } else if (returnvalue === 'num') {
        return levelnum;  
      }
    }, // checkLevel

    upsell: function(element, options, amount, frequency) {
      if (options.allow_upsell === true) {
        var that = this;
        var amount_monthly;

        if (frequency === 12) {
          amount_monthly = amount;
        } else if (frequency === 1) {
          amount_monthly = amount / frequency;
        }

        $.each(options.upsell, function(index, value) {
          if (index === options.level) { // current level upsell
            if ((value !== true && amount_monthly < value) || value === false) {
              $(options.upsell_selector, element).hide();
            }
          }
        });

        $(options.upsell_btn_selector, element).click(function(event) {
          var upsold = options.upsold;
          that.options.amount = upsold;
          $(options.level_amount_selector, element).text(upsold);
          $(options.full_amount_selector, element).text(upsold);
          $(options.original_amount_selector, element).val(upsold);
          $(this).remove();
          event.stopPropagation();
          event.preventDefault();
          that.init(true, upsold);
        });
      } else {
        $(options.upsell_selector, element).hide();
      }
    }, // upsell

    honorOrMemory: function(element, options) {
      if ($(options.honor_selector, element).is(':checked')) {
        $(options.honor_memory_name_selector + ' div' + options.honor_name_selector, element).show();
      } else {
        $(options.honor_memory_name_selector + ' div' + options.honor_name_selector, element).hide();
        $(options.honor_name_selector + ' input', element).val('');
      }

      if ($(options.memory_selector, element).is(':checked')) {
        $(options.honor_memory_name_selector + ' div' + options.memory_name_selector, element).show();
      } else {
        $(options.honor_memory_name_selector + ' div' + options.memory_name_selector, element).hide();
        $(options.memory_name_selector + ' input', element).val('');
      }

      $(options.honor_or_memory_chooser, element).change(function() {
        if ($(options.honor_selector).is(':checked')) {
          $(options.honor_memory_name_selector + ' div' + options.honor_name_selector, element).show();
        } else {
          $(options.honor_memory_name_selector + ' div' + options.honor_name_selector, element).hide();
          $(options.honor_name_selector + ' input', element).val('');
        }
        if ($(options.memory_selector).is(':checked')) {
          $(options.honor_memory_name_selector + ' div' + options.memory_name_selector, element).show();
        } else {
          $(options.honor_memory_name_selector + ' div' + options.memory_name_selector, element).hide();
          $(options.memory_name_selector + ' input', element).val('');
        }
      });

    }, // honorOrMemory

    swag: function(element, options, change) {
      
      var that = this;
      var currentlevel = that.options.levelnum;

      if (change === false) { // keep this from repeating
        $(options.swag_selector, element).hide(); // hide all the swag items first
        $(options.swag_selector, element).filter(function(index) { // only show items that are less than or equal to donation level
          return $(this).prop('class').slice(-1) <= currentlevel;
        }).show();

        $(options.separate_swag_redeem, element).click(function(event) { // if user clicks to redeem a separate item (ie atlantic)
          event.stopImmediatePropagation();
          $(options.separate_swag_selector, element).toggle(); // show the options there
          return false;
        });
      }

      if ($(options.atlantic_existing, element).is(':checked')) { // if user has existing atlantic subscription
        $(options.atlantic_selector, element).show();
      } else {
        $(options.atlantic_selector, element).hide();
      }

      $(options.atlantic_status, element).change(function() { // if user clicks one of the atlantic radio buttons
        that.swag(element, options, true);
      });

      $(options.swag_decline_selector, element).click(function(event) {
        $(options.swag_nyt_selector, element).prop('checked', false);
      });

      var maximum_choose = $(options.swag_selector_choose_multiple, element).data('maximum-choose');
      $(options.swag_selector_choose_multiple, element).show();
      $(options.swag_selector_choose_multiple, element).find('label, .swag').show();
      var count_checked = $(options.swag_selector_choose_multiple + ' input[name="' + options.swag_choose_multiple_name + '"]:checked').length;
      $('input', options.swag_selector_choose_multiple).change(function() { // if user clicks one of the atlantic radio buttons
        if ( $(this).prop('type') == 'checkbox') {
          count_checked = $(options.swag_selector_choose_multiple + ' input[name="' + options.swag_choose_multiple_name + '"]:checked').length;
          if (maximum_choose === count_checked) {
            $('input:not(:checked)', options.swag_selector_choose_multiple).attr('disabled',true);
          } else {
            $('input:not(:checked)', options.swag_selector_choose_multiple).attr('disabled',false);
          }
        }
      });

    }, // swag

    outsideUnitedStates: function(element, options) {
      $(options.show_billing_country_selector).click(function() {
        $(options.billing_country_selector).show();
        $(this).parent().hide();
        return false;
      });
      $(options.show_shipping_country_selector).click(function() {
        $(options.shipping_country_selector).show();
        $(this).parent().hide();
        return false;
      });
    }, // outsideUnitedStates

    shippingAddress: function(element, options) {
      var that = this;
      var show_shipping = false;
      if ($(options.use_for_shipping_selector).length > 0) { // we have a shipping checkbox
        show_shipping = true;
      }
//      show_shipping = !!$(options.use_for_shipping_selector + ':checked', element).length;
//      //this.debug('show is there');

/*      $(options.use_for_shipping_selector, element).change(function() {
        that.shippingAddress(element, options);
        //this.debug('change it');
      });
*/
      if (show_shipping === true ) {
        $(options.use_for_shipping_selector, element).parent().show();
        if ($(options.use_for_shipping_selector, element).is(':checked')) { // use same as billing
          $(options.shipping_selector).hide();
        } else { // separate shipping and billing
          $(options.shipping_selector).show();
        }
        $(options.use_for_shipping_selector, element).change(function() {
          that.shippingAddress(element, options);
        });
      }
      
    }, // shippingAddress

    allowMinnpostAccount: function(element, options, changed) {
      var that = this;
      var account_exists = false;

      $(options.email_field_selector, element).parent().append('<p class="error spam-email">This email address has been detected as a spammer.</p>');
      $('.spam-email').hide();

      $(options.email_field_selector, element).change(function() {
        $('.spam-email').hide();
        $(this).removeClass('invalid error');
      });

      function doneTyping () {
        var email = $(options.email_field_selector, element).val();
        account_exists = that.checkMinnpostAccount(element, options, email);
      }

      //setup before functions
      var typingTimer;                //timer identifier
      var doneTypingInterval = 5000;  //time in ms, 5 second for example

      //on keyup, start the countdown
      $(options.email_field_selector, element).keyup(function(){
        clearTimeout(typingTimer);
        if ($(options.email_field_selector, element).val) {
          typingTimer = setTimeout(doneTyping, doneTypingInterval);
        }
      });

      //user is "finished typing," do something

      if ($(options.create_mp_selector, element).is(':checked')) {
        $(options.password_selector, element).show();
        options.create_account = true;
      } else {
        $(options.password_selector, element).hide();
      }

      $(options.create_mp_selector, element).change(function() {
        that.allowMinnpostAccount(element, options, true);
      });

      if (changed === false) {
        // allow users to show plain text, or to see pw criteria
        $(options.password_selector, element).append('<div class="help-link"><span>Password help</span></div><div class="form-help">Password must be at least 6 characters.</div><label class="additional-option"><input type="checkbox" name="showpassword" id="showpassword"> Show password</label>');
        $(options.create_mp_selector, element).parent().before('<p class="account-exists success">There is already a MinnPost.com account with this email.</p>');
        $('.account-exists').hide();
        $('#showpassword').click(function() {
          if ($(this).is(':checked')) {
            $('#password').get(0).type = 'text';
          } else {
            $('#password').get(0).type = 'password';
          }
        });

        $('.form-item .form-help').hide();
      }
      $('.help-link').click(function() {
        $(this).next('.form-help').toggle();
        return false;
      });
    }, // allowMinnpostAccount

    checkMinnpostAccount: function(element, options, email) {
      var user = {
        email: email
      };
      var that = this;
      $.ajax({
        method: 'GET',
        url: options.minnpost_root + '/wp-json/user-account-management/v1/check-account',
        data: user
      }).done(function( result ) {
        if (result.status === 'success' && result.reason === 'user exists') { // user exists
          if ($(options.create_mp_selector, element).is(':checked')) {
            $(options.password_selector, element).hide();
            $(options.create_mp_selector, element).parent().hide();
            $('.account-exists', element).show();
          }
          $(options.create_mp_selector, element).on('change', function() {
            if ($(options.create_mp_selector, element).is(':checked')) {
              $(options.password_selector, element).hide();
              $(options.create_mp_selector, element).parent().hide();
              $('.account-exists', element).show();
            }
          });
        } else if ( result.status === 'spam' ) {
          $(that.options.email_field_selector).addClass('invalid error');
          $( '.spam-email').show();
        } else { // user does not exist or ajax call failed
          if ($(options.create_mp_selector, element).is(':checked')) {
            $(options.password_selector, element).show();
            options.create_account = true;
          } else {
            $(options.password_selector, element).hide();
          }
          $('.account-exists', element).hide();
          return false;
        }
      });
    }, // checkMinnpostAccount

    choosePaymentMethod: function(element, options) {

      var that = this;

      if ($(options.choose_payment).length > 0) {      
        if ($(options.choose_payment + ' input').is(':checked')) {
          var checked = $(options.choose_payment + ' input:checked').attr('id');
          var checked_value = $(options.choose_payment + ' input:checked').val();
          $(options.payment_method_selector).removeClass('active');
          $(options.payment_method_selector + '.' + checked).addClass('active');
          $(options.payment_method_selector + ':not(.active) label').removeClass('required');
          $(options.payment_method_selector + ':not(.active) input').prop('required', false);
          $(options.payment_method_selector + '.active label').addClass('required');
          $(options.payment_method_selector + '.active input').prop('required', true);
          if ( checked_value === 'ach' ) {
            that.calculateFees(that.options.original_amount, 'ach');
          } else {
            that.calculateFees(that.options.original_amount, 'visa');
          }
        }

        $(options.choose_payment + ' input').change(function (event) {
          $(options.payment_method_selector).removeClass('active');
          $(options.payment_method_selector + '.' + this.id).addClass('active');
          $(options.payment_method_selector + ':not(.active) label').removeClass('required');
          $(options.payment_method_selector + ':not(.active) input').prop('required', false);
          $(options.payment_method_selector + '.active label').addClass('required');
          $(options.payment_method_selector + '.active input').prop('required', true);
          $('#bankToken').remove();
          if ( this.value === 'ach' ) {
            that.calculateFees(that.options.original_amount, 'ach');
          } else {
            that.calculateFees(that.options.original_amount, 'visa');
          }
        });
      }
    }, // choosePaymentMethod

    creditCardFields: function(element, options) {

      var that = this;

      $(that.options.donate_form_selector).prepend('<input type="hidden" id="source" name="source" value="' + document.referrer + '" />');

      var style = {
        base: {
          iconColor: '#666EE8',
          lineHeight: '37px',
          fontWeight: 400,
          fontFamily: 'Georgia,Cambria,Times New Roman,Times,serif',
          fontSize: '16px',
        },
      };

      // Add an instance of the card UI component into the `card-element` <div>
      //card.mount('#card-element');
      if ( $('.credit-card-group').length === 0 && $('.payment-method.choose-card').length === 0) {
        return;
      }
      that.cardNumberElement = that.elements.create('cardNumber', {
        style: style
      });
      that.cardNumberElement.mount(options.cc_num_selector);

      that.cardExpiryElement = that.elements.create('cardExpiry', {
        style: style
      });
      that.cardExpiryElement.mount(options.cc_exp_selector);

      that.cardCvcElement = that.elements.create('cardCvc', {
        style: style
      });
      that.cardCvcElement.mount(options.cc_cvv_selector);

      // validate/error handle the card fields
      that.cardNumberElement.on('change', function(event) {
        // error handling
        that.stripeErrorDisplay(event, $(options.cc_num_selector, element), element, options );
        // if it changed, reset the button
        that.buttonStatus(options, $(that.options.donate_form_selector).find('button'), false);
        // Switch brand logo
        if (event.brand) {
          that.calculateFees(that.options.original_amount, event.brand);
          that.setBrandIcon(event.brand);
        }
        //setOutcome(event);
      });

      that.cardExpiryElement.on('change', function(event) {
        // error handling
        that.stripeErrorDisplay(event, $(options.cc_exp_selector, element), element, options );
        // if it changed, reset the button
        that.buttonStatus(options, $(that.options.donate_form_selector).find('button'), false);
      });

      that.cardCvcElement.on('change', function(event) {
        // error handling
        that.stripeErrorDisplay(event, $(options.cc_cvv_selector, element), element, options );
        // if it changed, reset the button
        that.buttonStatus(options, $(that.options.donate_form_selector).find('button'), false);
      });

      // this is the method to create a single card field and mount it
      /*var card = that.elements.create(
        'card',
        {
          hidePostalCode: true
        }
      );
      // Add an instance of the card UI component into the `card-element` <div>
      card.mount('#card-element');*/

    }, // creditCardFields

    setBrandIcon: function(brand) {
      var cardBrandToPfClass = {
        'visa': 'pf-visa',
        'mastercard': 'pf-mastercard',
        'amex': 'pf-american-express',
        'discover': 'pf-discover',
        'diners': 'pf-diners',
        'jcb': 'pf-jcb',
        'unknown': 'pf-credit-card',
      }
      var brandIconElement = document.getElementById('brand-icon');
      var pfClass = 'pf-credit-card';
      if (brand in cardBrandToPfClass) {
        pfClass = cardBrandToPfClass[brand];
      }
      for (var i = brandIconElement.classList.length - 1; i >= 0; i--) {
        brandIconElement.classList.remove(brandIconElement.classList[i]);
      }
      brandIconElement.classList.add('pf');
      brandIconElement.classList.add(pfClass);
    },

    achFields: function(element, options) {
      var that = this;
      if (options.plaid_env != '' && options.key != '' && typeof Plaid !== 'undefined') {
        var linkHandler = Plaid.create({
          selectAccount: true,
          apiVersion: 'v2',
          env: options.plaid_env,
          clientName: 'MinnPost',
          key: options.plaid_public_key,
          product: 'auth',
          onLoad: function() {
            // The Link module finished loading.
          },
          onSuccess: function(public_token, metadata) {
            // The onSuccess function is called when the user has successfully
            // authenticated and selected an account to use.
            //
            // When called, you will send the public_token and the selected
            // account ID, metadata.account_id, to your backend app server.
            //
            // sendDataToBackendServer({
            //   public_token: public_token,
            //   account_id: metadata.account_id
            // });

            //this.debug('Public Token: ' + public_token);
            //this.debug('Customer-selected account ID: ' + metadata.account_id);

            var supportform = $(options.donate_form_selector);

            // response contains id and card, which contains additional card details
            // Insert the data into the form so it gets submitted to the server
            supportform.append($('<input type=\"hidden\" name=\"public_token\" />').val(public_token));
            supportform.append($('<input type=\"hidden\" name=\"account_id\" />').val(metadata.account_id));

            // get the account validated by ajax
            $.ajax({
              url:'/plaid_token/',
              //cache: false,
              data: $(supportform).serialize(),
              type: 'POST'
            })
            .done(function(response) {
              if (typeof response.error !== 'undefined') {
                // there is an error.
                $(options.plaid_link).parent().after('<p class="error">' + response.error + '</p>')
              } else {
                //this.debug('print response here');
                //this.debug(response);
                $(options.donate_form_selector).prepend('<input type="hidden" id="bankToken" name="bankToken" value="' + response.stripe_bank_account_token + '" />');
                $(options.plaid_link, element).html('<strong>Your account was successfully authorized</strong>').contents().unwrap();
                that.calculateFees(that.options.original_amount, 'ach'); // calculate the ach fees
                // add the field(s) we need to the form for submitting
              }
            })
            .error(function(response) {
              $(options.plaid_link).parent().after('<p class="error">' + response.error + '</p>')
            });


            
          },
          onExit: function(err, metadata) {
            // The user exited the Link flow.
          },
        });
        $(options.plaid_link, element).click(function(event) {
          event.preventDefault();
          $(options.payment_method_selector + ' .error').remove(); // remove method error message if it is there
          linkHandler.open();
        });
      }
    }, // achFields

    hasHtml5Validation: function(element, options) {
      //this.debug('value is ' + typeof document.createElement('input').checkValidity === 'function');
      return typeof document.createElement('input').checkValidity === 'function';
    },

    buttonStatus: function(options, button, disabled) {
      // remove the old token so we can generate a new one
      var supportform = $(options.donate_form_selector);
      $('input[name="stripeToken"]', supportform).remove();
      $('input[name="payment_type"]', supportform).remove();
      button.prop('disabled', disabled);
      if (disabled === false) {
        button.text(options.button_text);
      } else {
        button.text('Processing');
      }
    },

    validateAndSubmit: function(element, options) {
      var that = this;
      $(options.donate_form_selector).submit(function(event) {
        event.preventDefault();

        // do some fallback stuff for non-html5 browsers
        if (that.hasHtml5Validation(element, options)) {
            if (!this.checkValidity()) {
              $(this).addClass('invalid');
              $('html, body').animate({
                scrollTop: $(this).find('input:invalid').parent().offset().top
              }, 2000);
              //this.debug('top is ' + );
              $(this).find('input:invalid').parent().addClass('error');
            } else {
              $(this).removeClass('invalid');
              $(this).find('input:invalid').parent().removeClass('error');
            }
        }

        // validate and submit the form
        $('.check-field').remove();
        $('input, label', element).removeClass('error');
        var valid = true;
        var payment_method = 'card';
        if ($(options.choose_payment).length > 0) {
          payment_method = $(options.choose_payment + ' input:checked').val();
        }
        $(options.choose_payment + ' input').change(function() {
          $(options.payment_method_selector + ' .error').remove(); // remove method error message if it is there
          // if it changed, reset the button
          that.buttonStatus(options, $(that.options.donate_form_selector).find('button'), false);
        });

        if (payment_method === 'ach') {
          if ($('input[name="bankToken"]').length === 0) {
            valid = false;
            $(options.payment_method_selector).prepend('<p class="error">You are required to enter credit card information, or to authorize MinnPost to charge your bank account, to make a payment.</p>');
          }
        }

        var user = {
          email: $(options.email_field_selector, element).val(),
          first_name: $(options.first_name_field_selector, element).val(),
          last_name: $(options.last_name_field_selector, element).val(),
          password: $(options.password_field_selector, element).val(),
          city: $(options.account_city_selector, element).val(),
          state: $(options.account_state_selector, element).val(),
          zip: $(options.account_zip_selector, element).val(),
        };

        // check the user info for spam
        $.ajax({
          method: 'GET',
          url: options.minnpost_root + '/wp-json/user-account-management/v1/check-account',
          data: user
        }).done(function( result ) {
          if ( result.status === 'spam' ) {
            valid = false;
            $(options.email_field_selector).addClass('invalid error');
            $( '.spam-email').show();
          }
        });

        if (valid === true) {
          // 1. process donation to stripe
          that.buttonStatus(options, $(that.options.donate_form_selector).find('button'), true);

          var tokenData = that.generateTokenData();

          // 2. create minnpost account if specified
          if (options.create_account === true) {
            $.ajax({
              method: 'POST',
              url: options.minnpost_root + '/wp-json/user-account-management/v1/create-user',
              data: user
            }).done(function( data ) {
              grecaptcha.reset();
              if (data.status === 'success' && data.reason === 'new user') {
                // user created - they should receive email
                // submit the form
                //supportform.get(0).submit();
              } else {
                // user not created
                // still submit the form
                //supportform.get(0).submit();
              }
            });
          }

          if ($('input[name="bankToken"]').length == 0) {
            // finally, get a token from stripe, and try to charge it if it is not ach
            that.createToken(that.cardNumberElement, tokenData);
          } else {
            // if it is ach, we already have a token so pass it to stripe.
            that.stripeTokenHandler( $('#bankToken').val(), 'ach' );
          }
        } else {
          // this means valid is false
          that.buttonStatus(options, $(that.options.donate_form_selector).find('button'), false);
        }

      });
    }, // validateAndSubmit

    stripeErrorDisplay: function(event, this_selector, element, options) {
      // listen for errors and display/hide error messages
      var which_error = this_selector.attr('id');
      if (event.error) {
        $('.card-instruction.' + which_error).text(event.error.message + ' Please try again.');
        $('.card-instruction.' + which_error).addClass('invalid');
        this_selector.parent().addClass('error');
      } else {
        $('.card-instruction.' + which_error).removeClass('invalid');
        $('.card-instruction.' + which_error).empty();
        $(options.cc_num_selector, element).removeClass('error');
        $(options.cc_exp_selector, element).removeClass('error');
        $(options.cc_cvv_selector, element).removeClass('error');
        $(options.cc_num_selector, element).parent().removeClass('error');
        $(options.cc_exp_selector, element).parent().removeClass('error');
        $(options.cc_cvv_selector, element).parent().removeClass('error');
      }
    }, // stripeErrorDisplay

    generateTokenData: function() {
      var tokenData = {};

      var full_name = '';
      if ($('#full_name').length > 0) {
        full_name = $('#full_name').val();
      } else {
        full_name = $('#first_name').val() + ' ' + $('#last_name').val();
      }
      tokenData.name = full_name;

      var street = 'None';
      if ($('input[name="full_address"]').val() != '') {
        street = $('#full_address').val();
        if ($('input[name="billing_street"]').val() != '') {
          street = $('input[name="billing_street"]').val();
        }
        tokenData.address_line1 = street;
      }

      var city = 'None';
      if ($('input[name="billing_city"]').val() != '') {
        city = $('input[name="billing_city"]').val();
        tokenData.address_city = city;
      }

      var state = 'None';
      if ($('input[name="billing_state"]').val() != '') {
        state = $('input[name="billing_state"]').val();
        tokenData.address_state = state;
      }

      var zip = 'None';
      if ($('input[name="billing_zip"]').val() != '') {
        zip = $('input[name="billing_zip"]').val();
        tokenData.address_zip = zip;
      }

      var country = 'US';
      if ($('input[name="billing_country"]').val() != '') {
        country = $('input[name="billing_country"]').val();
      }
      tokenData.address_country = country;

      return tokenData;
    }, // generateTokenData

    createToken: function(card, tokenData) {
      var that = this;
      that.stripe.createToken(card, tokenData).then(function(result) {
        if (result.error) {
          // Show the errors on the form
          that.buttonStatus(options, $(that.options.donate_form_selector).find('button'), false);
          var field = result.error.field + '_field_selector';
          var message = '';
          if (typeof result.error.message === 'string') {
            message = result.error.message;
          } else {
            message = result.error.message[0];
          }
          if ($(field).length > 0) {
            $(that.options[field], element).addClass('error');
            $(that.options[field], element).prev().addClass('error');
            $(that.options[field], element).after('<span class="check-field invalid">' + message + '</span>');
          }
        } else {
          // Send the token to your server
          that.stripeTokenHandler(result.token, 'card');
        }
      });
    }, // createToken

    stripeTokenHandler: function(token, type) {
      var that = this;
      // Insert the token ID into the form so it gets submitted to the server
      var supportform = $(this.options.donate_form_selector);
      if ( type === 'card' ) {
        supportform.append($('<input type=\"hidden\" name=\"stripeToken\">').val(token.id));
        if ($('input[name="payment_type"]').length > 0) {
          $('input[name="payment_type"]').val(token.card.brand);
        } else {
          supportform.append($('<input type=\"hidden\" name=\"payment_type\" />').val(token.card.brand));  
        }
      } else if ( type === 'ach' ) {
        if ($('input[name="payment_type"]').length > 0) {
          $('input[name="payment_type"]').val(type);
        } else {
          supportform.append($('<input type=\"hidden\" name=\"payment_type\" />').val(type));  
        }
      }

      // Submit the form
      //supportform.submit();
      $.ajax({
        url:'/charge_ajax/',
        cache: false,
        data: $(supportform).serialize(),
        type: 'POST'
      })
      .done(function(response) {
        if (typeof response.errors !== 'undefined') {
          // do not submit. there is an error.
          that.buttonStatus(that.options, $(that.options.donate_form_selector).find('button'), false);
          // add some error messages and styles
          $.each(response.errors, function( index, error ) {
            var field = error.field + '_field_selector';
            var message = '';
            if (typeof error.message === 'string') {
              message = error.message;
            } else {
              message = error.message[0];
            }
            if ($(that.options[field]).length > 0) {
              $(that.options[field]).addClass('error');
              $(that.options[field]).prev().addClass('error');
              $(that.options[field]).after('<span class="check-field invalid">' + message + '</span>');
            }

            if (typeof error !== 'undefined') {
              that.buttonStatus(that.options, $(that.options.donate_form_selector).find('button'), false);
              if (error.code == 'invalid_number' || error.code == 'incorrect_number' || error.code == 'card_declined' || error.code == 'processing_error') {
                // error handling
                that.stripeErrorDisplay(response.errors, $(that.options.cc_num_selector), that.element, that.options );
              }

              if (error.code == 'invalid_expiry_month' || error.code == 'invalid_expiry_year' || error.code == 'expired_card') {
                // error handling
                that.stripeErrorDisplay(response.errors, $(that.options.cc_exp_selector), that.element, that.options );
              }

              if (error.code == 'invalid_cvc' || error.code == 'incorrect_cvc') {
                // error handling
                that.stripeErrorDisplay(response.errors, $(that.options.cc_cvv_selector), that.element, that.options );
              }

              if (error.field == 'recaptcha') {
                $('button.give').before('<p class="recaptcha-error">' + message + '</p>')
              }

              if (error.type == 'invalid_request_error') {
                $('button.give').before('<p class="error">' + error.message + '</p>')
              }

            }

            if (typeof response.errors[0] !== 'undefined') {
              var field = response.errors[0].field + '_field_selector';
              if ($(field).length > 0) {
                $('html, body').animate({
                  scrollTop: $(options[field]).parent().offset().top
                }, 2000);
              }
            }

          });
        } else {
          supportform.get(0).submit(); // continue submitting the form
        }
      })
      .error(function(response) {
        that.buttonStatus(that.options, $(that.options.donate_form_selector).find('button'), false);
      });

    },

    showNewsletterSettings: function(element, options) {
      var that = this;

      var newsletter_group_html = '';
      if ($(options.newsletter_group_selector).length > 0 ) {
        var get_data = {
          shortcode: 'newsletter_form',
          placement: 'useraccount'
        };
        $.ajax({
          method: 'GET',
          url: options.minnpost_root + '/wp-json/minnpost-api/v2/mailchimp/form',
          data: get_data
        }).done(function( result ) {
          if ( typeof result.group_fields !== 'undefined' ) {
            $.each(result.group_fields, function( index, category ) {
              newsletter_group_html += '<fieldset class="m-form-item support-newsletter m-form-item-' + category.type + '">';
              newsletter_group_html += '<label>' + category.name + ':</label>';
              if ( category.contains.length > 0 ) {
                newsletter_group_html += '<div class="form-item form-item--newsletter">';
                $.each(category[category.contains], function( index, item ) {
                  newsletter_group_html += '<label><input name="groups_submitted[]" type="checkbox" value="' + item.id + '">' + item.name + '</label>';
                });
                newsletter_group_html += '</div>';
              }
              newsletter_group_html += '</fieldset>';
            });
            $(options.newsletter_group_selector).html(newsletter_group_html);
          }
        });
      }

      if ($(options.newsletter_group_selector).length > 0 && typeof $(options.email_field_selector, element).val() !== 'undefined') {
        var get_data = {
          email: $(options.email_field_selector, element).val()
        };
        $.ajax({
          method: 'GET',
          url: options.minnpost_root + '/wp-json/minnpost-api/v2/mailchimp/user',
          data: get_data
        }).done(function( result ) {
          if ( typeof result.mailchimp_status !== 'undefined' ) {
            $(options.email_field_selector, element).after('<input name="mailchimp_status" type="hidden" value="' + result.mailchimp_status + '">');
          }
          if ( typeof result.mailchimp_user_id !== 'undefined' ) {
            $(options.email_field_selector, element).after('<input name="mailchimp_user_id" type="hidden" value="' + result.mailchimp_user_id + '">');
          }
          if (result.mailchimp_status === 'subscribed') {
            // user created - show a success message
            $('.confirm-instructions').text($('.confirm-instructions').attr('data-known-user'));
            var groups = result.groups;
            $.each(groups, function( index, value ) {
              if ( value === true ) {
                $(':checkbox[value="' + index + '"]').prop('checked',true);
              } else {
                $(':checkbox[value="' + index + '"]').prop('checked',false);
              }
            });
          }
        });
      }

    }, // showNewsletterSettings

    confirmMessageSubmit: function(element, options) {

      var existing_newsletter_settings = $(options.newsletter_group_selector + ' input').serialize();
      //this.debug(existing_newsletter_settings);

      $(options.confirm_form_selector).submit(function(event) {
        event.preventDefault();

        var confirmform = $(options.confirm_form_selector);
        // submit settings to mailchimp
        // need to get user info on a hidden field here

        var newsletter_groups = $(options.newsletter_group_selector + ' input:checked');
        var new_newsletter_settings = newsletter_groups.serialize();

        if ((existing_newsletter_settings !== new_newsletter_settings) && (typeof newsletter_groups !== 'undefined')) {
          //add our own ajax check as X-Requested-With is not always reliable
          //ajax_form_data = new_newsletter_settings + '&ajaxrequest=true&subscribe';

          var post_data = {
            email: $(options.email_field_selector, element).val(),
            first_name: $(options.first_name_field_selector, element).val(),
            last_name: $(options.last_name_field_selector, element).val(),
            groups_submitted: {}
          };

          post_data.groups_available = 'all';

          if ( $('input[name="mailchimp_status"]').length > 0 ) {
            post_data.mailchimp_status = $('input[name="mailchimp_status"]').val();
          }

          if ( $('input[name="mailchimp_user_id"]').length > 0 ) {
            post_data.mailchimp_user_id = $('input[name="mailchimp_user_id"]').val();
          }

          if (typeof newsletter_groups !== 'undefined') {
            $.each(newsletter_groups, function(index, value) {
              var group = $(this).val();
              post_data.groups_submitted[index] = group;
            });
          }

          $.ajax({
            url: options.minnpost_root + '/wp-json/minnpost-api/v2/mailchimp/user',
            type: 'post',
            dataType : 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(post_data)
          })
          .done(function(response) { // response from the PHP action
            var message = '';
            if ( response.success === true ) {
              /*switch (response.data.user_status) {
                case 'existing':
                  message = 'Thanks for updating your email preferences. They will go into effect immediately.';
                  break;
                case 'new':
                  message = 'We have added you to the MinnPost mailing list.';
                  break;
                case 'pending':
                  message = 'We have added you to the MinnPost mailing list. You will need to click the confirmation link in the email we sent to begin receiving messages.';
                  break;
              }*/
              //confirmform.get(0).submit();
            }
            confirmform.get(0).submit();
            //$('.m-hold-message').html('<div class="m-form-message m-form-message-info">' + message + '</div>');
          })
          .fail(function(response) {
            // we should put an actual error message here someday, probably
            //$('.m-hold-message').html('<div class="m-form-message m-form-message-info">An error has occured. Please try again.</div>');
            confirmform.get(0).submit();
          });

        } else { // end part where settings changed
          confirmform.get(0).submit();
        }

      });
      //return false;
    }, // confirmMessageSubmit

  }; // plugin.prototype

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
      }
    });
  };

})( jQuery, window, document );