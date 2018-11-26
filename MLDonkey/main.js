// Copyright (c) 2012 Óscar García Amor. All rights reserved.
// Distributed under terms of the MIT license.

// Declare an object to get configuration from sync
var storage = chrome.storage.sync;

// By default no configuration
var mldfullurl=null;

// Search for any elink in current page
function elink() {
    try {
        var cnt = $('a[href^=ed2k]').length;
        return cnt>0;
    } catch (e) {
        return false;
    }
}

// Load configuration from sync storage
function getconfig(){
	storage.get('MLD', function(items) {
		if (items.MLD) {
			var mldprotocol = items.MLD.protocol;
			var mldurl = items.MLD.url;
			var mldport = items.MLD.port;
			var mlduser = items.MLD.user;
			var mldpassword = items.MLD.password;
			// Construct the full MLDonkey URI
			if (mlduser)
				mldfullurl=mldprotocol+"://"+mlduser+":"+mldpassword+"@"+mldurl+":"+mldport;
			else
				mldfullurl=mldprotocol+"://"+mldurl+":"+mldport;
		}
	});
}

// Do anything only if any elink found
if (elink()) {
	// Show the icon in omnibox
	chrome.extension.sendRequest({elinkFound:1}, function(response){});

	// Get options from sync storage
	getconfig();

	$('a[href^=ed2k]').click(function(e){
		// Get options from sync storage
		getconfig();
		// Prevent xdg-open
		e.preventDefault();
		// If extension is not configured report it
		if(mldfullurl==null || mldfullurl==""){
			var msg="Please configure extension";
			chrome.extension.sendRequest({notify:1,status:3,task:msg}, function(response){});
		}
		else{
			// Get the elink name
			var itemName = this.innerText;
			// Send elink to MLDonkey
			$.ajax({
				type:"GET",
				url:mldfullurl+"/submit?q="+escape(this.href),
				timeout:1000,
				async: true,
				success:function(result){
					// Search for the result if item alredy shared or in download queue
					if (result.search("File is already in download queue") == -1 && result.search("File is already shared in") == -1) {
						// Send ok notification
						chrome.extension.sendRequest({notify:1,status:1,task:itemName,url:mldfullurl}, function(response){});
					} else {
						// Send already donwload notification
						var msg = itemName + " is already shared or in download queue"
						chrome.extension.sendRequest({notify:1,status:2,task:msg,url:mldfullurl}, function(response){});
					}
				},
				error:function(err){
					// Send error notification
					chrome.extension.sendRequest({notify:1,status:0,task:err.status+" "+err.statusText}, function(response){});
				}
			});
		}
	});
	
}
