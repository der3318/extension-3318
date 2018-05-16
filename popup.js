function checkTime(i) {
	if (i < 10)	i = "0" + i;
	return i;
}

function displayTime() {
	var body = document.getElementsByTagName("body")[0];
	var htmltxt = document.getElementById("htmltxt");
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	var curHM = 60 * h + m;
	if(curHM < 60 * 8 + 30)	body.style.backgroundImage = "url('imgs/cherng_2330_0830.gif')";
	else if(curHM < 60 * 10)	body.style.backgroundImage = "url('imgs/cherng_0830_1000.gif')";
	else if(curHM < 60 * 12)	body.style.backgroundImage = "url('imgs/cherng_1000_1200.gif')";
	else if(curHM < 60 * 14)	body.style.backgroundImage = "url('imgs/cherng_1200_1400.gif')";
	else if(curHM < 60 * 16)	body.style.backgroundImage = "url('imgs/cherng_1400_1600.gif')";
	else if(curHM < 60 * 17)	body.style.backgroundImage = "url('imgs/cherng_1600_1700.gif')";
	else if(curHM < 60 * 17 + 30)	body.style.backgroundImage = "url('imgs/cherng_1700_1730.gif')";
	else if(curHM < 60 * 18 + 30)	body.style.backgroundImage = "url('imgs/cherng_1730_1830.gif')";
	else if(curHM < 60 * 20)	body.style.backgroundImage = "url('imgs/cherng_1830_2000.gif')";
	else if(curHM < 60 * 22 + 30)	body.style.backgroundImage = "url('imgs/cherng_2000_2230.gif')";
	else if(curHM < 60 * 23 + 30)	body.style.backgroundImage = "url('imgs/cherng_2230_2330.gif')";
	else	body.style.backgroundImage = "url('imgs/cherng_2330_0830.gif')";
	if(s >= 0 && s < 2) {
		var filename = "imgs/aikatsu.gif?time=" + h + ":"+ m;
		htmltxt.style.backgroundImage = "url('" + filename + "')";
		htmltxt.innerText = "";
	}
	else	{
		htmltxt.style.backgroundImage = "";
		htmltxt.innerText = pageSrc;
	}
	h = checkTime(h);
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById("time").innerHTML = h + ":" + m + ":" + s;
}

function setupLink() {
	var height = 600;
	if(window.outerHeight === height)	return;
	document.getElementById("window").href = "#";
	document.getElementById("window").addEventListener("click", function() {
		var windowDict = {"url": "popup.html", "type": "popup", "width": 800, "height": height};
		chrome.windows.create(windowDict, function(window) {});
	});
}

function displayUser() {
	chrome.identity.getProfileUserInfo(function(userInfo) {
		userTxt = "guest<br>ID null";
		if(userInfo.email)	userTxt = userInfo.email + "<br>ID " + userInfo.id;
		document.getElementById("user").innerHTML = userTxt;
	});
}

function displayURL() {
	chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function (tabs) {
		var url = tabs[0].url;
		document.getElementById("url").value = url;
	});
	document.getElementById("copy").addEventListener("click", function() {
		var copyText = document.getElementById("url");
		copyText.select();
		document.execCommand("Copy");
		alert("[Copy] " + copyText.value);
	});
}

function setupMapping() {
	var map = document.getElementById("map");
	chrome.storage.sync.get("escMapping", function(data) {
		if(data.escMapping === "true")	map.checked = true;
	});
	map.addEventListener("click", function() {
		if(map.checked)	chrome.storage.sync.set({escMapping: "true"});
		else	chrome.storage.sync.set({escMapping: "false"});
	});
}

function setupIgnore() {
	var ignore = document.getElementById("ignore");
	chrome.storage.sync.get("ignoreMe", function(data) {
		if(data.ignoreMe === "true")	ignore.checked = true;
	});
	ignore.addEventListener("click", function() {
		if(ignore.checked)	chrome.storage.sync.set({ignoreMe: "true"});
		else	chrome.storage.sync.set({ignoreMe: "false"});
		document.getElementById("history").style.display = "none";
		document.getElementById("historyLoader").style.display = "block";
	});
}

function getCount(parent, getChildrensChildren){
	var relevantChildren = 0;
	var children = parent.childNodes.length;
	for(var i=0; i < children; i++){
		if(parent.childNodes[i].nodeType != 3){
			if(getChildrensChildren)
				relevantChildren += getCount(parent.childNodes[i],true);
			relevantChildren++;
		}
	}
	return relevantChildren;
}

function displayHistory() {
	var xhr = new XMLHttpRequest();
	var domain = "http://SERVER-DOMAIN/api/history_view?";
	if(document.getElementById("ignore").checked)
		domain = domain + "skip=" + document.getElementById("user").innerHTML.split("<br>")[0];
	xhr.open("GET", domain, false);
	xhr.send();
	var historys = JSON.parse(xhr.responseText);
	var maxItem = getCount(document.getElementById("history"), false);
	var maxTitleLen = 20;
	var maxUrlLen = 35;
	var delta = historys.length - maxItem;
	var idx = 0;
	for(idx = delta ; idx < historys.length ; idx++) {
		if(idx < 0 || idx >= historys.length)	continue;
		var history = historys[idx];
		var id = maxItem - idx + delta;
		document.getElementById("time" + id).innerHTML = history.time.substring(0, 5);
		if( history.email.startsWith("EMAIL1") )
			document.getElementById("img" + id).src = "imgs/der.png";
		else if( history.email.startsWith("EMAIL2") )
			document.getElementById("img" + id).src = "imgs/banbi.png";
		var title = history.title;
		document.getElementById("title" + id).title = title;
		if(title.length > maxTitleLen)	title = title.substring(0, maxTitleLen - 3) + "...";
		document.getElementById("title" + id).innerHTML = title;
		var url = history.url;
		document.getElementById("title" + id).href = url;
		document.getElementById("title" + id).target = "_blank";
		document.getElementById("url" + id).title = url;
		if(url.length > maxUrlLen)	url = url.substring(0, maxUrlLen - 3) + "...";
		document.getElementById("url" + id).innerHTML = url;
	}
	document.getElementById("history").style.display = "block";
	document.getElementById("historyLoader").style.display = "none";
	var time8 = document.getElementById("time8");
	time8.innerHTML = "&emsp;&emsp;" + time8.innerHTML;
	time8.innerHTML += "<br><img src='imgs/slowpoke.gif' width='65' height='65'>";
}

function startTimer() {
	displayTime();
	setInterval(displayTime, time);
	setupLink();
	displayUser();
	displayURL();
	setupMapping();
	setupIgnore();
	setInterval(displayHistory, historyUpdateTime);
	chrome.tabs.executeScript(null, {
		file: "getPagesSource.js"
	}, function() {
		if (chrome.runtime.lastError)
			pageSrc = "[ERR] getPageSource.js\n" + chrome.runtime.lastError.message;
	});
}

var time = 1000;
var historyUpdateTime = 2000;
var pageSrc = "";
window.onload = startTimer;
chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.action == "getSource") {
		pageSrc = request.source;
	}
});


