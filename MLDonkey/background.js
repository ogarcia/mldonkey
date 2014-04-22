// Copyright (c) 2014 Óscar García Amor. All rights reserved.
// Distributed under terms of the MIT license.

// Declare a variable to generate unique notification IDs
var notIDN = 0;

// Declare a variable to store MLDonkey URL
var mldfullurl = null;

// Set the function that manages the notification buttons
chrome.notifications.onButtonClicked.addListener(buttonCallback);

// Called when a message is passed.  We assume that the content script
// wants to show the page action.
function onRequest(request, sender, sendResponse) {
	// If elink found show icon
	if (1 == request.elinkFound){
		  // Show the page action for the tab that the sender (content script)
		  // was on.
		  chrome.pageAction.show(sender.tab.id);
	};
	// Return nothing to let the connection be cleaned up.
	sendResponse({});
	// If want notify
	if (1 == request.notify) {
		shownotification(request.status, request.task, request.url);
	}
	// Return nothing to let the connection be cleaned up.
	sendResponse({});
};

// Create a notification
function shownotification (status, text, url){
	// By default no title or action
	var title = '';
	var action = '';

	// Configure notification by status
	switch (status){
		case 1:
			title = 'Successfully added';
			action = 'Open MLDonkey';
			notID = "id" + notIDN++;
			break;
		case 2:
			title = 'Already added';
			action = 'Open MLDonkey';
			notID = "id" + notIDN++;
			break;
		case 3:
			title = 'Warning!';
			action = 'Go to configuration';
			notID = "err"
			break;
		default:
			title = 'Failed to add';
			action = 'Go to configuration';
			notID = "err"
	}

	// Set notification Options
	var options = {
		type: "basic",
		title: title,
		message: text,
		iconUrl: "icon128.png",
		buttons: [
			{ title: action, iconUrl: "ic_action_forward.png" },
		]
	}

	// Set MLDonkey Full URL
	mldfullurl = url;

	// Show notification
	chrome.notifications.create(notID, options, function (notID){});
}

// Notification button pressed callback
function buttonCallback (notID, btnIndex) {
	if (notID == "err") {
		// Go to config
		var win=window.open("options.html", '_blank');
		win.focus();
	} else {
		var win=window.open(mldfullurl, '_blank');
		win.focus();
	}
	chrome.notifications.clear(notID, function (wasCleared){});
}

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
