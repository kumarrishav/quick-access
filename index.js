(function () {

  var QuickAccess = {
    _elements: {},
    supportItems: ['gallary', 'dial', 'sms', 'mail', 'addContact'],
    workingItems: [],

    initialize: function initialize() {
      this._elements = {
        quickSettingsContainer: document.querySelector('#quick-settings > ul'),
        lastButton: document.querySelector('#quick-settings-full-app').parentNode
      };

      this.workingItems = this.supportItems;

      var KEY = 'quick.settings.addon';
      var settings = window.navigator.mozSettings;
      var req = settings.createLock().get(KEY);
      req.onsccess = () => {
        var result = req.result[KEY];
        if (typeof result === 'undefined') {
          console.log('initial to default');
          this.workingItems = this.supportItems;
        } else {
          this.workingItems = result
        }
      };
      req.onerror = () => {
        console.log('Error fail to get settings');
        this.workingItems = this.supportItems;
      };

      this.renderItems();
    },

    renderItems: function renderItems() {
      this._elements.quickSettingsContainer.style.flexWrap = 'wrap';

      // Remove previously appended buttons if any
      while (this._elements.lastButton.nextSibling) {
        this._elements.quickSettingsContainer.removeChild(
          this._elements.lastButton.nextSibling);
      }

      var availableItems = {
      	'gallary': this.initGalleryButton,
      	//'record': this.initRecordButton,
      	'dial' : this.initDialButton,
        'sms': this.initSmsButton,
        'mail': this.initMailButton,
        'addContact': this.initAddContactButton
      };

      // if (this.workingItems.indexOf('config') < 0) {
      //   this.workingItems.push('config');
      // }

      var btn = null;
      this.workingItems.forEach((item) => {
        btn = this.createButton(item);
        availableItems[item].call(this, btn.firstChild);
        this._elements.quickSettingsContainer.appendChild(btn);
      });

      // Add additional li as placeholders to layout buttons correctly
      var fillLi = 5 - this.workingItems.length % 5;
      for (i=0; i < fillLi; i++) {
        this._elements.quickSettingsContainer.appendChild(
          document.createElement('li'));
      }

      var allSettings = document.querySelectorAll('#quick-settings > ul > li');
      for (var i=0; i < allSettings.length; i++) {
        allSettings[i].style.flex = '1 1 20%';
      }
    },

    // Template:
    // <li><a href="#" id="quick-settings-wifi" class="icon bb-button" data-icon="wifi-4" data-enabled="false" role="button" data-l10n-id="quick-settings-wifiButton-off"></a></li>
    createButton: function createButton(name) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#';
      a.id = 'quick-settings-' + name;
      a.classList.add('icon');
      a.classList.add('bb-button');
      a.setAttribute('role', 'button');
      li.appendChild(a);

      return li;
    },

    //open gallary
    initGalleryButton: function initGalleryButton(button) {
      function onClick() {
        new MozActivity({
          name: 'browse'
        });
      }

      button.dataset.icon = 'camera';
      button.dataset.enabled = false;
      button.dataset.l10nId = 'quick-settings-galleryButton-off';
      button.addEventListener('click', onClick);
    },

    //Dial number
    initDialButton: function initDailButton(button) {
      	function onClick() {
        	new MozActivity({
          		name: 'dial',
                data: {
                    type: "webtelephony/number"
                }
      		});
		}

      button.dataset.icon = 'call';
      button.dataset.enabled = false;
      button.dataset.l10nId = 'quick-settings-dialButton-off';
      button.addEventListener('click', onClick);
    },

    //compose sms
    initSmsButton: function initSmsButton(button) {
      	function onClick() {
        	new MozActivity({
                name: "new", 
                data: {
                    type: "websms/sms"
                }
      		});
		}

      button.dataset.icon = 'messages';
      button.dataset.enabled = false;
      button.dataset.l10nId = 'quick-settings-smsButton-off';
      button.addEventListener('click', onClick);
    },

    //compose mail
    initMailButton: function initMailButton(button) {
      	function onClick() {
        	new MozActivity({
                name: "new",
                data: {
                    type : "mail"
                }
      		});
		}

	  button.dataset.icon = 'compose';
      button.dataset.enabled = false;
      button.dataset.l10nId = 'quick-settings-mailButton-off';
      button.addEventListener('click', onClick);
    },

	//add contact
    initAddContactButton: function initAddContactButton(button) {
      function onClick() {
        new MozActivity({
          name: 'new', 
          data: {
          	type: "webcontacts/contact"
          }
        });
      }

      button.dataset.icon = 'add';
      button.dataset.enabled = false;
      button.dataset.l10nId = 'quick-settings-addContactButton-off';
      button.addEventListener('click', onClick);
    }
  };

  // If injecting into an app that was already running at the time
  // the app was enabled, simply initialize it.
  if (document.documentElement) {
    QuickAccess.initialize();
  } else {
    // Otherwise, we need to wait for the DOM to be ready before
    // starting initialization since add-ons are usually (always?)
    // injected *before* `document.documentElement` is defined.
    window.addEventListener('DOMContentLoaded', QuickAccess.initialize);
  }
}());
