// Copyright (c) 2012 Óscar García Amor. All rights reserved.
// Distributed under terms of the MIT license.

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
		shownotification(request.status, request.task);
	}
	// Return nothing to let the connection be cleaned up.
	sendResponse({});
};

// Create a notification
function shownotification (status, text){
	// By default no title
	var title = '';
	// Set title from MLDonley notification
	switch(status){
		case 1:
			title = 'Successfully added:';
			break;
		case 2:
			title = 'Warning!';
			break;
		default:
			title = 'Failed to add:';
	}
	var notification = webkitNotifications.createNotification('icon48.png', title, text);
	notification.show();
}

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);