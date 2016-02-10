// MinnPost Giving plugin
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
    'minnpost_root' : 'https://www.minnpost.com',
    'donate_form_selector': '#donate',
    'review_step_selector' : '#panel--review',
    'attendees_step_selector' : '#panel--attendees',
    'donate_step_selector' : '#panel--pay',
    'confirm_form_selector' : '#confirm',
    'confirm_step_selector' : '#panel--confirmation',
    'active' : 'panel--review',
    'confirm' : 'panel--confirmation',
    'query' : 'step',
    'percentage' : 0.029,
    'fixed_amount' : 0.3,
    'pay_cc_processing_selector' : 'input[id="edit-pay-fees"]',
    'level_amount_selector' : '#panel--review .amount .level-amount',
    'original_amount_selector' : '#amount',
    'frequency_selector' : '.frequency',
    'full_amount_selector' : '.full-amount',
    'level_indicator_selector' : 'h2.level',
    'level_name_selector' : '.level-name',
    'review_benefits_selector' : '.review-benefits',
    'allow_upsell' : true,
    'upsell_btn_selector' : '.btn--upsell',
    'upsell_selector' : '.well--upsell',
    'upsell_amount_selector' : '.upsell-amount',
    'swag_selector' : '.swag',
    'separate_swag_selector' : 'fieldset.swag--separate',
    'separate_swag_redeem' : '.swag-redeem--separate',
    'atlantic_status' : 'input[name="swag_atlanticsubscription"]',
    'atlantic_existing' : '#atlantic_existing',
    'atlantic_selector' : '.form-item--atlantic_id',
    'name_selector' : '.form-item--display-name',
    'honor_selector' : '.honor',
    'notify_selector' : '.notify_someone',
    'notify_field_selector' : '.form-item--notify',
    'anonymous_selector' : '#edit-anonymous',
    //'needs_shipping_selector' : '.swag--shipping',
    'shipping_address_selector' : '.form-item--shipping-address',
    'use_for_shipping_selector' : '#useforshipping',
    'email_field_selector' : '#edit-email',
    'password_field_selector' : '#password',
    'firstname_field_selector' : '#first_name',
    'lastname_field_selector' : '#last_name',
    'account_city_selector' : '#billing_city_geocode',
    'account_state_selector' : '#billing_state_geocode',
    'account_zip_selector' : '#billing_zip_geocode',
    'create_mp_selector' : '#creatempaccount',
    'password_selector' : '.form-item--password',
    'calculated_amount_selector' : '.calculated-amount',
    'quantity_field' : '#quantity',
    'quantity_selector' : '.quantity',
    'item_selector': '.purchase-item',
    'single_unit_price_attribute' : 'unit-price',
    'additional_amount_field' : '#additional_donation',
    'additional_amount_selector' : '.additional_donation',
    'has_additional_text_selector' : '.has_additional',
    'promo_selector' : '.form-item--promo-code',
    'use_promocode_selector' : '#use-promo-code',
    'promocode_selector' : '#promo_code',
    'calendar_button_selector' : '.addeventatc',
    'billing_selector' : 'fieldset.billing',
    'shipping_selector' : 'fieldset.shipping',
    'credit_card_fieldset' : '.credit-card-group',
    'cc_num_selector' : '#cc-number',
    'cc_exp_selector' : '#cc-exp',
    'cc_cvv_selector' : '#cc-cvc',
    'payment_button_selector' : '#submit',
    'confirm_button_selector' : '#finish',
    'opp_id_selector' : '#opp_id',
    'recurring_selector' : '#recurring',
    'newsletter_group_selector' : '[name="newsletters"]',
    'message_group_selector' : '[name="messages"]',
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
      this.options.processing_percent = parseFloat(this.options.percentage);
      this.options.fixed_fee = parseFloat(this.options.fixed_amount);
      
      this.options.new_amount = (this.options.original_amount + this.options.fixed_fee) / (1 - this.options.processing_percent);
      this.options.processing_fee = this.options.new_amount - this.options.original_amount;
      this.options.processing_fee = (Math.round(parseFloat(this.options.processing_fee)*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
      this.options.processing_fee_text = this.options.processing_fee;
      
      this.options.upsell_amount = parseFloat($(this.options.upsell_amount_selector, this.element).text());
      this.options.upsold = this.options.amount + this.options.upsell_amount;
      this.options.cardType = null;
      this.options.create_account = false;

      var button_text = $('button.give, input.give').text();
      this.options.button_text = button_text;

      Stripe.setPublishableKey(this.options.stripe_publishable_key);

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

      // geocomplete addresses if library loaded successfully
      if (typeof google !== 'undefined' && google.hasOwnProperty('maps') && $('fieldset[data-geo="data-geo"]').length > 0) {
        // add combined address fields for geocomplete
        $('> div', this.options.billing_selector).not('.form-item--geocode').hide();
        $('> div', this.options.shipping_selector).not('.form-item--geocode').hide();
        $(this.options.billing_selector, this.element).prepend('<div class="form-item form-item--billing-address form-item--geocode"><label for="full_address" class="required">Billing Address: </label><input type="text" autocapitalize="off" autocorrect="off" name="full_address" id="full_address" class="geocomplete form-text" required placeholder=""></div>');
        this.getFullAddress($('#full_address'));
        if ($(this.options.shipping_selector).length > 0) {
          $(this.options.shipping_selector, this.element).append('<div class="form-item form-item--shipping-address form-item--geocode"><label for="full_shipping_address">Shipping Address: </label><input type="text" autocapitalize="off" autocorrect="off" name="full_shipping_address" id="full_shipping_address" class="geocomplete form-text" placeholder=""></div>');
          this.getFullAddress($('#full_shipping_address'));
        }
      } else {
        $('> div', this.options.billing_selector).not('.form-item--geocode').show();
        $('> div', this.options.shipping_selector).not('.form-item--geocode').show();
      }

      this.paymentPanels(query_panel); // tabs

      if ($(this.options.pay_cc_processing_selector).length > 0) {
        this.creditCardProcessingFees(this.options, reset); // processing fees
        $(this.options.review_step_selector).prepend('<input type="hidden" id="edit-pay-fees" name="pay_fees" value="0" />');
      }

      if ($(this.options.review_step_selector).length > 0) {
        this.options.level = this.checkLevel(this.element, this.options, 'name'); // check what level it is
        this.options.levelnum = this.checkLevel(this.element, this.options, 'num'); // check what level it is as a number
        this.honorOrMemory(this.element, this.options); // in honor or in memory of someone
        this.swag(this.element, this.options, false); // manage swag display
        this.upsell(this.element, this.options, this.options.amount, this.options.frequency); // upsell to next level
      }
      
      if ($(this.options.donate_step_selector).length > 0) {
        this.donateAnonymously(this.element, this.options); // anonymous
        this.shippingAddress(this.element, this.options); // shipping address
        this.allowMinnpostAccount(this.element, this.options, false); // option for creating minnpost account
        this.creditCardFields(this.element, this.options); // do stuff with the credit card fields
        this.validateAndSubmit(this.element, this.options); // validate and submit the form
      }

      if ($(this.options.calculated_amount_selector).length > 0) {
        this.calculateAmount(this.element, this.options, ''); //
      } // calculate amount based on quantity

      if ($(this.options.use_promocode_selector).length > 0) {
        this.usePromoCode(this.element, this.options); // handle promo code field
      } // allow users to enter a promo code on a page

      if ($(this.options.calendar_button_selector).length > 0) {
        this.addToCalendar(this.element, this.options);
      } // there is an event details item; allow for an add to calendar button

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

    getFullAddress: function(selector) {
      var that = this;
      var autocomplete = new google.maps.places.Autocomplete(selector[0], {});
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                var address = {};
        // Create a simplified version of the address components.
        $.each(place.address_components, function(index, object){
          var name = object.types[0];
          $.each(object.types, function(index, name) {
            address[name] = object.long_name;
            address[name + '_short'] = object.short_name;
          });
        });
                var fieldset = $(selector).closest('fieldset[data-geo="data-geo"]');
                var prefix = $(fieldset).prop('class');
                /*$(fieldset).append('<input type="hidden" name="' + prefix + '_street" value="' + address.street_number + ' ' + address.route_short + '" />');
                $(fieldset).append('<input type="hidden" name="' + prefix + '_city" value="' + address.locality + '" />');
                $(fieldset).append('<input type="hidden" name="' + prefix + '_state" value="' + address.administrative_area_level_1_short + '" />');
                $(fieldset).append('<input type="hidden" name="' + prefix + '_zip" value="' + address.postal_code + '" />');
                $(fieldset).append('<input type="hidden" name="' + prefix + '_country" value="' + address.country_short + '" />');*/
                //$(fieldset).find('input[data-geo-value="address"]').val(address.street_number + ' ' + address.route_short);

                $('#' + prefix + '_street_geocode').val(address.street_number + ' ' + address.route_short);
                $('#' + prefix + '_city_geocode').val(address.locality);
                $('#' + prefix + '_state_geocode').val(address.administrative_area_level_1_short);
                $('#' + prefix + '_zip_geocode').val(address.postal_code);
                $('#' + prefix + '_country_geocode').val(address.country_short);
            });
    }, // getFullAddress

    paymentPanels: function(active) {
      var that = this;
      var usetabs = this.options.tabs;
      var title = 'MinnPost | Support Us | ';
      var page = $('.progress--donation li.' + active).text();
      var next = $('.progress--donation li.' + active).next().text();
      var step = $('.progress--donation li .active').parent().index() + 1;
      var next_step = step + 1;
      document.title = title + page;
      this.analyticsTrackingStep(step);

      // make some tabs for form
      if (usetabs === true) {
        $('.panel').hide();
      } else {
        $('.panel').show();
      }
      // activate the tabs
      if ($('.progress--donation li .active').length === 0) {
        $('#' + active).fadeIn();
        $('.progress--donation li.' + active + ' a').addClass('active');
      } else {
        active = $('.progress--donation li .active').parent().prop('class');
        $('#' + active).fadeIn();
      }
      
      $('.progress--donation li a, a.btn.btn--next').click(function(event) {
        event.preventDefault();
        $('.progress--donation li a').removeClass('active');
        var link = $(this).prop('href');
        var query = that.getQueryStrings(link);
        query = query['step'];
        $('.progress--donation li.' + query + ' a').addClass('active');
        that.paymentPanels(query);    
      });
    }, // paymentPanels

    analyticsTrackingStep: function(step) {

      var level = this.checkLevel(this.element, this.options, 'name'); // check what level it is
      var levelnum = this.checkLevel(this.element, this.options, 'num'); // check what level it is as a number
      var amount = $(this.options.original_amount_selector).val();
      var recurring = this.options.recurring;
      var opp_id = $(this.options.opp_id_selector).val();

      ga('ec:addProduct', {
        'id': 'minnpost_' + level.toLowerCase() + '_membership',
        'name': 'MinnPost ' + level.charAt(0).toUpperCase() + level.slice(1) + ' Membership',
        'category': 'Donation',
        'brand': 'MinnPost',
        'variant':  recurring,
        'price': amount,
        'quantity': 1
      });

      if (step == 1 || step == 2) {
        ga('ec:setAction','checkout', {
          'step': step,            // A value of 1 indicates first checkout step.Value of 2 indicates second checkout step
        });
      } else if (step == 3) {
        ga('ec:setAction', 'purchase',{
          'id': opp_id, // Transaction id - Type: string
          'affiliation': 'MinnPost', // Store name - Type: string
          'revenue': amount, // Total Revenue - Type: numeric
        });
      } // need something for step 4. maybe an event

    }, // analyticsTrackingStep

    creditCardProcessingFees: function(options, reset) {
      var full_amount;
      var that = this;
      var remove = false;
      $(this.options.pay_cc_processing_selector).parent().html('<a href="#" class="add-credit-card-processing">Add $<span class="processing-amount"></span></a> <span class="processing-explain">to each transaction to cover MinnPost\'s credit card fees?</span>');      
      $('.processing-amount').text(options.processing_fee_text);
      if (this.options.original_amount != this.options.amount) {
        $('.add-credit-card-processing').text('Remove $' + options.processing_fee_text);
        $('#edit-pay-fees').val(1);
        remove = true;
        $('.processing-explain').hide();
      }
      if (reset === true) {
        remove = false;
        full_amount = that.options.original_amount;
        $('.add-credit-card-processing').text('Add $' + that.options.processing_fee_text);
        $('#edit-pay-fees').val(0);
        $('.processing-explain').show();
        //$('#amount').val(full_amount);
      }
      $('.add-credit-card-processing').click(function(event) {
        $('.amount .level-amount').addClass('full-amount');
        if (!remove) {
          remove = true;
          full_amount = that.options.new_amount;
          $('.add-credit-card-processing').text('Remove $' + options.processing_fee_text);
          $('#edit-pay-fees').val(1);
          $('.processing-explain').hide();
        } else {
          remove = false;
          full_amount = that.options.original_amount;
          $('.add-credit-card-processing').text('Add $' + options.processing_fee_text);
          $('#edit-pay-fees').val(0);
          $('.processing-explain').show();
        }
        $('.add-credit-card-processing').toggleClass('remove');
        $(options.full_amount_selector).text(parseFloat(full_amount).toFixed(2));
        //$('#amount').val(parseFloat(full_amount).toFixed(2));
        event.stopPropagation();
        event.preventDefault();
      });
    }, // creditCardProcessingFees

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
      var that = this;
      var key_escape = 27;

      $(options.honor_selector + ' fieldset').prepend('<a href="#" class="close">Close</a>');
      $(options.honor_selector + ' p a', element).click(function() {
        var link_class = $(this).prop('class');
        $('fieldset.' + link_class, element).addClass('visible').show();
        return false;
      });
      $(options.honor_selector + ' fieldset a.close', element).click(function() {
        var link_class = $(this).parent().prop('class').substring(0, $(this).parent().prop('class').length - 8);
        $('fieldset.' + link_class, element).removeClass('visible').hide();
        return false;
      });

      $(document).keyup(function(e) {
        if (e.keyCode === key_escape) {
          $('fieldset.visible', element).removeClass('visible').hide();
        }
      });

      if ($(options.notify_selector, element).is(':checked')) {
        $(options.notify_field_selector, element).show();
      } else {
        $(options.notify_field_selector, element).hide();
      }
      $(options.notify_selector, element).change(function() {
        if ($(this).is(':checked')) {
          $(options.notify_field_selector, element).show();
        } else {
          $(options.notify_field_selector, element).hide();
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

    }, // swag

    shippingAddress: function(element, options) {
      var that = this;
      var show_shipping = false;
      if ($(options.use_for_shipping_selector).length > 0) { // we have a shipping checkbox
        show_shipping = true;
      }
//      show_shipping = !!$(options.use_for_shipping_selector + ':checked', element).length;
//      console.log('show is there');

/*      $(options.use_for_shipping_selector, element).change(function() {
        that.shippingAddress(element, options);
        console.log('change it');
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

      function doneTyping () {
        var email = $(options.email_field_selector, element).val();
        account_exists = that.checkMinnpostAccountExists(element, options, email);
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
      $('.form-item--with-help label, .form-item--with-help input').next('.help-link').click(function() {
        $(this).next('.form-help').toggle();
        return false;
      });
    }, // allowMinnpostAccount

    populateAttendees: function(quantity) {
      var attendees = '';
      var attendee = $('.attendees > fieldset:first').html();
      for (i = 1; i <= quantity; i++) {
        attendees += '<fieldset class="attendee">' + attendee.replace(/_1/g, '_' + i) + '</fieldset>';
      }
      $('.attendees').html(attendees);
    },

    displayAmount: function(element, options, single_unit_price, quantity, additional_amount, valid_code) {
      var amount = single_unit_price * parseInt(quantity, 10);
      if (additional_amount === '') {
        additional_amount = 0;
        $(options.create_mp_selector).parent().hide();
      } else {
        amount += parseInt(additional_amount, 10);
        levelcheck = {original_amount: additional_amount, frequency: 1, levels: options.levels};
        level = this.checkLevel(element, levelcheck, 'num');
        if (level >= 2) {
          $(options.create_mp_selector).parent().show();
        }
        $(options.has_additional_text_selector).html($(options.has_additional_text_selector).data('text'));
        $(options.additional_amount_selector).text(parseFloat($(options.additional_amount_field).val()));
      }

      $(options.calculated_amount_selector).text(amount); // this is the preview text
      $(options.original_amount_selector).val(quantity * single_unit_price); // this is the amount field
      $(options.quantity_selector).text(quantity); // everywhere there's a quantity

      if (quantity == 1) {
        $('.attendee-title').text($('.attendee-title').data('single'));
      } else {
        $('.attendee-title').text($('.attendee-title').data('plural'));
      }

      $('.code-result').remove();
      if (valid_code === true) {
        $('.apply-promo-code').after('<p class="code-result success">Your member discount code was successfully added.</p>');
        $('.show-' + options.single_unit_price_attribute).text(single_unit_price);
        $('.apply-promo-code').text('Applied').addClass('btn--disabled');
      } else if (valid_code === false) {
        $('.apply-promo-code').after('<p class="code-result error">This code is incorrect. Try again.</p>');
      }

    },

    calculateAmount: function(element, options, data) {
      //console.log('start. set variables and plain text, and remove code result.');
      var that = this;
      var quantity = $(options.quantity_field).val();

      var single_unit_price = $(options.quantity_field).data(options.single_unit_price_attribute);
      var additional_amount = $(options.additional_amount_field).val();
      if (data.success === true) {
        single_unit_price = data.single_unit_price;
      }
      that.displayAmount(element, options, single_unit_price, quantity, additional_amount, data.success);

      $(options.quantity_field + ', ' + options.additional_amount_field).change(function() { // the quantity or additional amount changed
        quantity = $(options.quantity_field).val();
        additional_amount = $(options.additional_amount_field).val();
        if (quantity != 1) {
          $(options.item_selector).text($(options.item_selector).data('plural'));
        } else {
          $(options.item_selector).text($(options.item_selector).data('single'));
        }

        that.displayAmount(element, options, single_unit_price, quantity, additional_amount);
        
      });

      var attendees = '';
      $(options.attendees_step_selector).find('.btn').click(function() {
        attendees = that.populateAttendees(quantity);
      });

      $('.progress--donation .panel--attendees').find('a').click(function() {
        attendees = that.populateAttendees(quantity);
      });

      if ($(this.options.promocode_selector).length > 0) {
        //$(this.options.promocode_selector).after('');
        $('.apply-promo-code').click(function(event) {
          var code = $(options.promocode_selector, element).val();
          //use_promo = that.checkPromoCode(code);
          event.preventDefault();
            var data = {
              promo_code: code
            };
            $.ajax({
              method: 'POST',
              url: '/event-check-promo/',
              data: data
            }).done(function( data ) {
              that.calculateAmount(element, options, data);
              //that.displayAmount(element, options, data.single_unit_price, quantity, additional_amount, data.success);
            });
        });
      }

    }, // calculateAmount

    checkPromoCode: function(code) {
      var data = {
        promo_code: code
      };
      $.ajax({
        method: 'POST',
        url: '/event-check-promo/',
        data: data
      }).done(function( data ) {
        if (data.success === true) {
          return true;
        } else {
          return false;
        }
      });
    }, // checkPromoCode

    usePromoCode: function(element, options) {
      $(this.options.use_promocode_selector).parent().html('<a href="#" class="use-promo-code">Use promo code</a>');
      if ($(this.options.promocode_selector).val() === '') {
        $(options.promo_selector + ' div:first', element).hide();
      } else {
         $(options.promo_selector + ' div:last', element).hide();
      }
      $('.use-promo-code').click(function(event) {
        $(options.promo_selector + ' div:first', element).show();
        $(options.promo_selector + ' div:last', element).hide();
        event.preventDefault();
      });
    }, //usePromoCode

    addToCalendar: function(element, options) {
      $(options.calendar_button_selector).css('display', 'inline-block');
    }, // addToCalendar

    checkMinnpostAccountExists: function(element, options, email) {     
      var user = {
        email: email
      };
      $.ajax({
        method: 'POST',
        url: options.minnpost_root + '/accounts/exists',
        data: user
      }).done(function( data ) {
        if (data.status === 'success' && data.reason === 'user exists') { // user exists
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
    }, // checkMinnpostAccountExists

    creditCardFields: function(element, options) {
      if (typeof Payment !== 'undefined') {
        // format values
        Payment.formatCardNumber($(options.cc_num_selector, element));
        Payment.formatCardExpiry($(options.cc_exp_selector, element));
        Payment.formatCardCVC($(options.cc_cvv_selector, element));
        
        // get and show the card type
        $(options.cc_num_selector, element).parent().prepend('<span class="card-image"></span>');
        $(options.cc_num_selector, element).keyup(function() {
          options.cardType = Payment.fns.cardType($(options.cc_num_selector, element).val());
          /*if (options.cardType !== null) {            
            $('.card-image').prop('class', 'card-image ' + options.cardType);
          }*/
          $('.card-image').prop('class', 'card-image ' + $('#cc-number').prop('class'));
        });



        /*$(options.credit_card_fieldset + ' input').focusin(function() {
          $(this).parent().addClass('focus');
        }).focusout(function() {
          $(this).parent().removeClass('focus');
        });*/
      }
    }, // creditCardFields

    validateAndSubmit: function(element, options) {
      var that = this;
      $(this.options.donate_form_selector).prepend('<input type="hidden" id="source" name="source" value="' + document.referrer + '" />');
      $(options.donate_form_selector).submit(function(event) {
        event.preventDefault();
        // validate and submit the form
        var valid = true;
        if (typeof Payment !== 'undefined') {
          var exp = Payment.fns.cardExpiryVal($(options.cc_exp_selector, element).val());
          var valid_cc = Payment.fns.validateCardNumber($(options.cc_num_selector, element).val());
          var valid_exp = Payment.fns.validateCardExpiry(exp.month, exp.year);
          var valid_cvv = Payment.fns.validateCardCVC($(options.cc_cvv_selector, element).val(), options.cardType);
          if (valid_cc === false || valid_exp === false || valid_cvv === false) {
            that.debug('cc ' + valid_cc + ' exp ' + valid_exp + ' cvv ' + valid_cvv);
            valid = false;
            $(options.cc_num_selector, element).parent().addClass('error');
            if (valid_cc === false) {
              $(options.cc_num_selector, element).addClass('error');
            } else {
              $(options.cc_exp_selector, element).removeClass('error');
              $(options.cc_cvv_selector, element).removeClass('error');
            }
            if (valid_exp === false) {
              $(options.cc_exp_selector, element).addClass('error');
            } else {
              $(options.cc_num_selector, element).removeClass('error');
              $(options.cc_cvv_selector, element).removeClass('error');
            }
            if (valid_cvv === false) {
              $(options.cc_cvv_selector, element).addClass('error');
            } else {
              $(options.cc_num_selector, element).removeClass('error');
              $(options.cc_exp_selector, element).removeClass('error');
            }
          } else {
            $(options.cc_num_selector, element).parent().removeClass('error');
            $(options.cc_num_selector, element).removeClass('error');
            $(options.cc_exp_selector, element).removeClass('error');
            $(options.cc_cvv_selector, element).removeClass('error');
          }
        }

        if (valid === true) {

          // 1. process donation to stripe          
          var supportform = $(options.donate_form_selector);

          var stripeResponseHandler = function(status, response) {
            var supportform = $(options.donate_form_selector);

            if (response.error) {
              // Show the errors on the form
              supportform.find('.payment-errors').text(response.error.message);
              supportform.find('button').removeProp('disabled');
              supportform.find('button').text(options.button_text);
            } else {
              // response contains id and card, which contains additional card details
              var token = response.id;
              // Insert the token into the form so it gets submitted to the server
              if ($('input[name="stripeToken"]').length > 0) {
                $('input[name="stripeToken"]').val(token);
              } else {
                supportform.append($('<input type=\"hidden\" name=\"stripeToken\" />').val(token));  
              }

              // get the card validated first by ajax
              //setTimeout(function() {
                $.ajax({
                  url:'/charge_ajax/',
                  cache: false,
                  data: $(supportform).serialize(),
                  type: 'POST'
                })
                .done(function(response) {
                  if (typeof response.error !== 'undefined') {
                    // do not submit. there is an error.
                    supportform.find('.payment-errors').text(response.error.message);
                    supportform.find('button').removeProp('disabled');
                    supportform.find('button').text(options.button_text);

                    // add some error messages and styles
                    if (response.error.code == 'invalid_number' || response.error.code == 'incorrect_number' || response.error.code == 'card_declined' || response.error.code == 'processing_error') {
                      $(options.cc_num_selector, element).addClass('error');
                      $(options.cc_num_selector, element).prev().addClass('error');
                      $(options.cc_num_selector, element).after('<span class="card-instruction invalid">' + response.error.message + '</span>');
                    }

                    if (response.error.code == 'invalid_expiry_month' || response.error.code == 'invalid_expiry_year' || response.error.code == 'expired_card') {
                      $(options.cc_exp_selector, element).addClass('error');
                      $(options.cc_exp_selector, element).prev().addClass('error');
                      $(options.cc_num_selector, element).after('<span class="card-instruction invalid">' + response.error.message + '</span>');
                    }

                    if (response.error.code == 'invalid_cvc' || response.error.code == 'incorrect_cvc') {
                      $(options.cc_cvv_selector, element).addClass('error');
                      $(options.cc_cvv_selector, element).prev().addClass('error');
                      $(options.cc_num_selector, element).after('<span class="card-instruction invalid">' + response.error.message + '</span>');
                    }

                  } else {
                    //console.dir(response);
                    //that.analyticsTrackingStep('charged');
                    supportform.get(0).submit(); // continue submitting the form
                  }
                })
                .error(function(response) {
                  supportform.find('.payment-errors').text(response.error.message);
                  supportform.find('button').removeProp('disabled');
                  supportform.find('button').text(options.button_text);
                });
              //},500);

              // Disable the submit button to prevent repeated clicks
              supportform.find('button').prop('disabled', true);
              supportform.find('button').text('Processing');

            }
          }; // end stripeResponseHandler          

          // prepare for stripeResponseHandler
          var full_name = '';
          if ($('#full_name').length > 0) {
            full_name = $('#full_name').val();
          } else {
            full_name = $('#first_name').val() + ' ' + $('#last_name').val();
          }

          var street = $('#full_address').val();
          if ($('input[name="billing_street_geocode"]').val() != '') {
            street = $('input[name="billing_street_geocode"]').val();
          }

          var city = 'None';
          if ($('input[name="billing_city_geocode"]').val() != '') {
            city = $('input[name="billing_city_geocode"]').val();
          }

          var state = 'None';
          if ($('input[name="billing_state_geocode"]').val() != '') {
            state = $('input[name="billing_state_geocode"]').val();
          }

          var zip = 'None';
          if ($('input[name="billing_zip_geocode"]').val() != '') {
            zip = $('input[name="billing_zip_geocode"]').val();
          }

          var country = 'US';
          if ($('input[name="billing_country_geocode"]').val() != '') {
            country = $('input[name="billing_country_geocode"]').val();
          }

          // 2. create minnpost account if specified
          if (options.create_account === true) {
            var user = {
              email: $(options.email_field_selector, element).val(),
              first: $(options.firstname_field_selector, element).val(),
              last: $(options.lastname_field_selector, element).val(),
              password: $(options.password_field_selector, element).val(),
              city: $(options.account_city_selector, element).val(),
              state: $(options.account_state_selector, element).val(),
              zip: $(options.account_zip_selector, element).val(),
            };
            $.ajax({
              method: 'POST',
              url: options.minnpost_root + '/accounts/create',
              data: user
            }).done(function( data ) {
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

          // finally, get a token from stripe, and try to charge it
          Stripe.card.createToken({
              number: $('#cc-number').val(),
              cvc: $('#cc-cvc').val(),
              exp: $('#cc-exp').val(),
              name: full_name,
              address_line1: street,
              address_city: city,
              address_state: state,
              address_zip: zip,
              address_country: country,
            }, stripeResponseHandler);
          //return true;

        } // valid = true

      });
      //return false;
    }, // validateAndSubmit

    showNewsletterSettings: function(element, options) {
      var that = this;
      if ($(options.newsletter_group_selector).length > 0 && typeof $(options.email_field_selector, element).val() !== 'undefined') {
        var post_data = {
          email: $(options.email_field_selector, element).val()
        };
        $.ajax({
          method: 'POST',
          url: options.minnpost_root + '/mailchimp/minnpost/groups',
          data: post_data
        }).done(function( result ) {
          if (result.status === 'success' && result.reason === 'user exists') {
            // user created - show a success message
            $('.confirm-instructions').text($('.confirm-instructions').attr('data-known-user'));
            var groups = result.groups;
            $.each(groups, function( index, value ) {
              $(':checkbox[value="' + value + '"]').prop('checked','true');
            });

            //this.options.existing_newsletter_settings = $('.support-newsletter :input').serialize();

          }
        });
      }

    }, // showNewsletterSettings

    confirmMessageSubmit: function(element, options) {

      //var existing_newsletter_settings = this.options.existing_newsletter_settings;
      var existing_newsletter_settings = $('.support-newsletter :input').serialize();
      //console.dir(existing_newsletter_settings);

      $(options.confirm_form_selector).submit(function(event) {
        event.preventDefault();

        var confirmform = $(options.confirm_form_selector);
        // submit settings to mailchimp
        // need to get user info on a hidden field here

        var newsletter_groups = $(options.newsletter_group_selector + ':checked');
        var message_groups = $(options.message_group_selector + ':checked');
        var new_newsletter_settings = $('.support-newsletter :input:checked').serialize();

        if ((existing_newsletter_settings !== new_newsletter_settings) && (typeof newsletter_groups !== 'undefined' || typeof message_groups !== 'undefined')) {
          var post_data = {
            minnpost_mailchimp_js_form_action: 'newsletter_subscribe',
            minnpost_mailchimp_email: $(options.email_field_selector, element).val(),
            minnpost_mailchimp_firstname: $(options.firstname_field_selector, element).val(),
            minnpost_mailchimp_lastname: $(options.lastname_field_selector, element).val(),
            minnpost_mailchimp_groups: {},
            minnpost_mailchimp_periodic: {}
          };

          if (typeof newsletter_groups !== 'undefined') {
            $.each(newsletter_groups, function() {
              var group = $(this).val();
              post_data.minnpost_mailchimp_groups[group] = group;
            });
          }

          if (typeof message_groups !== 'undefined') {
            $.each(message_groups, function() {
              var group = $(this).val();
              post_data.minnpost_mailchimp_periodic[group] = group;
            });
          }

          $.ajax({
            method: 'POST',
            url: options.minnpost_root + '/mailchimp/minnpost/api',
            data: post_data
          }).done(function( result ) {
            if (result.status === 'success') {
              // user created - show a success message?
              //console.dir(result);
              confirmform.get(0).submit();
            } else {
              // user not created - show error message
              //console.dir(result);
              confirmform.get(0).submit();
            }
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