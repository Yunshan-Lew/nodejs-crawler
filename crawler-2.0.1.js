var https = require("https");
var querystring = require('querystring');
var Promise = require("bluebird");
var cheerio = require("cheerio");

var baseUrl = "https://www.jql.cn/borrow/detail/";
var videoIds = [];
for(i=0; i<10; i++){
	videoIds[videoIds.length] = 20160700501 + i;
}


function filterChapter(html){
	var $ = cheerio.load(html);
	var title = $($('.invest-content-item-title')[0]).text().trim();
	var number = $($('.investDetail .mid p')[0]).text().trim();
	var profit = $($('.investDetail .mid p')[1]).text().trim();
	var deadline = $($('.investDetail .mid p')[2]).text().trim();
	var courseData = {
		title: title,
		number: number,
		profit: profit,
		deadline: deadline
	};
	return courseData;
}

function print(infos){
	infos.forEach(function(info){
		console.log("### " + info.title + " ###" + "\n");
		console.log(">> " + info.number + "\n");
		console.log(">> " + info.profit + "\n");
		console.log(">> " + info.deadline + "\n");
	});
}

function getPageAsync(url){
	return new Promise(function(resolve,reject){
		console.log("正在爬取：" + url);
		
		https.get(url, function(res){
			var html = '';
			res.on("data", function(data){
				html += data;
			});
			res.on("end", function(data){
				resolve(html);
			});
		}).on("error", function(e){
			reject(e);
			console.log("获取标的数据出错！")
		});
	});
}

var coursePages = [];

videoIds.forEach(function(id){
	coursePages.push(getPageAsync(baseUrl + id));
});

Promise
	.all(coursePages)
	.then(function(pages){
		var coursesData = [];
		pages.forEach(function(html){
			var courses = filterChapter(html);
			coursesData.push(courses);
		});
		print(coursesData);
	});