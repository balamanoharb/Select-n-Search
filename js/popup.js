$(document).ready(function() {
		//debugging
		var errlog = chrome.extension.getBackgroundPage().console;	
		var bgpage = chrome.extension.getBackgroundPage();
		var savedData = {};
		var count = 0;
		var order = bgpage.order;
		var sortablelist= bgpage.listobj;
		var obj = {"listOrder" : order,
								"listObj": sortablelist
							};
		
		//initial object literal - this will be used if the local saved data is empty.
		function triggerDomCreate(){
			var arg1,arg2;
			if(savedData["listOrder"]){
				arg1 = savedData["listObj"];
				arg2 = savedData["listOrder"];
				
			}
			else{
				arg1 = sortablelist;
				arg2 = order;
			}
			createList(arg1,arg2);
			//making the list draggable using jquery sortable. every time something is dragged this will be triggered
			$( "#sortable" ).sortable({
																	cancel:".ui-state-disabled",
																	stop: function(event,ui) {
																					$(this).find('.ui-state-disabled').appendTo(this);
																					updateList();
																					},																
																	items: "li:not(.ui-state-disabled)" 
											});
											
			//make the list not selectable.									
			$( "#sortable" ).disableSelection();

			//binding events to update classes in future.
			$( "#sortable" ).bind("click",function(event,ui){
				$("#sortable").find('.ui-state-disabled').appendTo(this);
				updateList();
			});

			//adding event functions after binding.
			$("#sortable input").click(function() {
				if (this.checked) {
					$(this.parentElement).removeClass("ui-state-disabled");
				} else { 
					$(this.parentElement).addClass("ui-state-disabled");
				}
			});
		}
		
		function setValue(key,val){
			savedData[key] = val;
			count++;
			if(count==2){
				
				triggerDomCreate();
			}
		}
		/*DOM creation
			arguments : sortablelist - object data
									 order - order of id to be generated
		*/
		function createList(sortablelist,order){
				var listheader = document.createElement('ul');
				listheader.id = "sortable";
				
				for(var i=0;i<order.length;i++){
					var ele = order[i];
					var listitem = document.createElement("li");
					listitem.id = ele;
					listitem.className = "ui-state-default";
					
					var inputele = document.createElement("input");
					inputele.type="checkbox";
					if(sortablelist[ele].status == 'active'){
						inputele.checked="checked";
					}
					else{
						listitem.className += " " + "ui-state-disabled";
					}
					
					var spanele = document.createElement("span");
					spanele.innerText = sortablelist[ele].name;
					
					listitem.appendChild(inputele);
					listitem.appendChild(spanele);
					listheader.appendChild(listitem);
			}
			document.body.appendChild(listheader);
		};
		
		function updateList(){
			var x = document.getElementById("sortable").children;
			for(var i = 0;i<x.length;i++){
				order[i] = x[i].id;
				sortablelist[x[i].id].status = x[i].className.indexOf("ui-state-disabled") >= 0 ? "inactive" : "active";
			}
			chrome.storage.sync.set(obj);
			bgpage.menuCreate(obj["listOrder"],obj["listObj"]);
		}
	
	bgpage.loadValues(setValue);
});

