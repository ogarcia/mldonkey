// Saves to sync
var storage = chrome.storage.sync;

var submitButton = document.querySelector('button.submit');
var mldprotocol = document.querySelector('[id="mldprotocol"]');
var mldurl = document.querySelector('[id="mldurl"]');
var mldport = document.querySelector('[id="mldport"]');
var mlduser = document.querySelector('[id="mlduser"]');
var mldpassword = document.querySelector('[id="mldpassword"]');

// Load any URL Configuration that may have previously been saved.
loadChanges();

submitButton.addEventListener('click', saveChanges);

// Change type of textbox when focus it
document.getElementById('mlduser').addEventListener('focus', function() {
	document.getElementById('mlduser').type = 'text';
});
document.getElementById('mldpassword').addEventListener('focus', function() {
	document.getElementById('mldpassword').type = 'text';
});
document.getElementById('mlduser').addEventListener('blur', function() {
	document.getElementById('mlduser').type = 'password';
});
document.getElementById('mldpassword').addEventListener('blur', function() {
	document.getElementById('mldpassword').type = 'password';
});

// Saves URL
function saveChanges() {
	mld = new Object();
	// Get a values saved in a form.
	mld.protocol = mldprotocol.value;
	mld.url = mldurl.value;
	mld.port = mldport.value;
	mld.user = mlduser.value;
	mld.password = mldpassword.value;
  	// Check that there's some code there.
  	if (!mld.url || !mld.port) {
  		message('Error: You must specify MLDonkey URL and Port');
  		return;
  	}
  	if (mld.port!=parseInt(mldport.value, 10)) {
  		message('Error: The MLDonkey port must be an integer');
  		return;
  	}
  	if (mld.port<1 || mld.port>65535) {
  		message('Error: The MLDonkey port must be between 1 and 65535');
  		return;
  	}
  	// Save it using the Chrome extension storage API.
  	storage.set({'MLD': mld}, function() {
  		// Notify that we saved.
  		message('Settings saved');
  	});
}

function loadChanges() {
	storage.get('MLD', function(items) {
		if (items.MLD) {
			mldprotocol.value = items.MLD.protocol;
			mldurl.value = items.MLD.url;
			mldport.value = items.MLD.port;
			mlduser.value = items.MLD.user;
			mldpassword.value = items.MLD.password;
			}
		});
}

function message(msg) {
	var message = document.querySelector('.message');
	message.innerText = msg;
	setTimeout(function() {
		message.innerText = '';
	}, 3000);
}