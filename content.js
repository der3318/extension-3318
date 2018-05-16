/*
var elements = document.getElementsByTagName("*");
for (var i = 0 ; i < elements.length ; i++) {
	var element = elements[i];
	for (var j = 0 ; j < element.childNodes.length ; j++) {
		var node = element.childNodes[j];
		if (node.nodeType !== 3)  continue;
		var text = node.nodeValue;
		var replacedText = text.replace("NL777", "der777");
		element.replaceChild(document.createTextNode(replacedText), node);
	}
}
*/

document.addEventListener("keyup", function(event) {
	if(event.keyCode !== 27)	return;
	chrome.storage.sync.get("escMapping", function(data) {
		if(data.escMapping === "true") {
			var win = window.open("https://mail.google.com/mail/", "_blank");
			win.focus();
		}
	});
});

