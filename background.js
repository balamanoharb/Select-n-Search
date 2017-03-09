var order = ["ele_4","ele_3","ele_1","ele_2","ele_5"];
var listobj = { "ele_1" : {
											"name" : "Google Image",
											"url" : "http://www.google.com/images?q=TESTQUERY",
											"status":"inactive",
											"label":"item1"
											},
						"ele_2":{
											"name" : "Wikipedia EN",
											"url" : "http://en.wikipedia.org/w/index.php?title=Special:Search&search=TESTQUERY",
											"status":"inactive",
											"label":"item2"
										},
						"ele_3":{
											"name" : "Facebook",
											"url" : "http://www.facebook.com/#!/search/?q=TESTQUERY",
											"status":"inactive",
											"label":"item3"
										},
						"ele_4":{
											"name" : "YouTube",
											"url" : "http://www.youtube.com/results?search_query=TESTQUERY",
											"status":"active",
											"label":"item4"
										},
						"ele_5":{
											"name":"StackOverflow",
											"url" : "http://stackoverflow.com/search?q=TESTQUERY",
											"status":"inactive",
											"label":"item5"
										}													
					};
var savedData = {};					
var count = 0;

function loadValues(callback){
			chrome.storage.sync.get(	"listOrder",function(data){
				if(data["listOrder"])
					callback("listOrder",data["listOrder"]);
				else
					callback("listOrder",undefined);
			});
			chrome.storage.sync.get(	"listObj",function(data){
				if(data["listObj"])
					callback("listObj",data["listObj"]);
				else
					callback("listObj",undefined);
			});
}

function setValue(key,val){
			savedData[key] = val;
			count++;
			if(count == 2){
				if(savedData["listObj"]){
					order = savedData["listOrder"];
					listobj = savedData["listObj"];
				}
				else{
					chrome.storage.sync.set({"listOrder":order,"listObj":listobj});
					}
				menuCreate(order,listobj);
			}
}

loadValues(setValue);

function tabCreateSearch(info,tab) {
	var address = listobj[info.menuItemId].url;
	var searchstring = info.selectionText;
	var query = address.replace("TESTQUERY", encodeURIComponent(searchstring));
	console.log(query);
	chrome.tabs.create({"url":query});
}

function menuCreate(listOrder,listObj){
	chrome.contextMenus.removeAll();
	var activeCount = 0;
	for(var i=0;i<listOrder.length;i++){
			if(listObj[listOrder[i]].status == "active"){
				activeCount++;
				}
	}
	var searchMenuText = "";
	if(activeCount == 1)
		searchMenuText = "Search ";
	for(var i=0;i<listOrder.length;i++){
			if(listObj[listOrder[i]].status == "active"){
				
				chrome.contextMenus.create({"title": searchMenuText + listObj[listOrder[i]].name  , 
																					"id" : listOrder[i] ,											
																					"contexts":["selection"],
																					"onclick": tabCreateSearch
				});
			}
		}
}


