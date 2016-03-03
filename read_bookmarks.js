// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function processBookmarkTree(tree){
	var r = [];
	for (var i=0;i<tree.length;i++){
		var node = tree[i];
		if (node.hasOwnProperty('url')){
			r.push(node);
		}
		else {
			r = r.concat(processBookmarkTree(node.children));
		}
	}
	return r;
}

document.addEventListener('DOMContentLoaded', function() {
	renderStatus('Retrieving Chrome bookmarks...');
	
	chrome.bookmarks.getTree(function(bTree){
		renderStatus('Found your Chrome bookmarks below:');
		
		var bookmarkList = processBookmarkTree(bTree);
		
		// (bubble) sort bookmarks by date added in reverse
		for(var i=0;i<bookmarkList.length-1;i++){
			for(var j=i+1; j<bookmarkList.length; j++){
				if(bookmarkList[i].dateAdded < bookmarkList[j].dateAdded){
					var node = bookmarkList[i];
					bookmarkList[i] = bookmarkList[j];
					bookmarkList[j] = node;
				}
			}
		}
		
		var s = [];
		var i = 0;
		for (var j=0;j<bookmarkList.length;j++) {
			item = bookmarkList[j];
			var da = new Date(item.dateAdded);
			var sda = da.getDate() + '/' + (da.getMonth()+1) + '/' + da.getFullYear() + ' ' + da.getHours() + ':' + da.getMinutes();
			s[i++] = '<p><span class="title">';
			s[i++] = item.title;
			s[i++] = '</span>&nbsp;<span class="date-added">';
			s[i++] = sda;
			s[i++] = '</span><br/>';
			s[i++] = '<a href="';
			s[i++] = item.url;
			s[i++] = '">';
			s[i++] = item.url;
			s[i++] = '</a>';
			s[i++] = '</p>';
		}
		
		jQuery('#bookmark-list').append(s.join(''));
	});
});
