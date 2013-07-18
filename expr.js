var start = new Date().getTime();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var host='example.com';
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}
var counter=0; 
var count2= 0;
var links = [];
var links_visited={};
var visited_arr = [];
var getlinks = function(error, response, body){
	$ = cheerio.load(body.toString());
	$('a[href^="/"],[href^="http://www."'+host+'"],[href^="http://"'+host+'"]').each(function(idx,elem) {
		var new_link =$(elem).attr('href');
		if (new_link.substring(0,2)!='//' && new_link.substring(0,8)!='/images/' && !links_visited[new_link])
		{if (links.indexOf(new_link)==-1)
			links.push(new_link);}
	});
	console.log('links='+links.length+', links_visited='+visited_arr.length);
	if (!(link =  links.pop())) {
		fs.writeFile("output", visited_arr.join("\n"), function(err) {
			if(err) {console.log(err);} else {console.log("The file was saved!");}});
		var end = new Date().getTime();
		var time = end - start;
		console.log('Execution time: ' + time/1000+' seconds');
		return;
	}
	while (links_visited[link]==1) {
		if (!(link =  links.pop())) return;
	}
	links_visited[link]=1;
	visited_arr.push(decodeURIComponent(link));
	if (link.substring(0,1)=='/') link='http://'+host+link;
	request(link,getlinks);
}
request('http://'+host, getlinks);