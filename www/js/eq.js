
var header="nisa";

/*deklarasi control*/
$(function(){
	var cb=$("<button>")
		.html("connect")
		.attr({
			"id":"connect",
			"class":"ui-button"
		})
		.click(function(){
			alertify.log("connecting");
		});
	var sp=$("<span>");
	var sp2=$("<span>");
	var ln=$("<input>")
		.attr({
			"id":"link",
			"type":"checkbox"
		});
	var lbln=$("<label>")
		.html('L(.")R')
		.attr({
			"for":"link"
		});
	
	var lbln2=$("<label>")
		.html('------')
		.attr({
			"for":"link"
		});
	//$("#control1").append(cb);
	sp.append(lbln);
	sp2.append(lbln2);
	
	$("#control2").append(sp);
	$("#control2lab").append(sp2);
	
});
//declare button
$(function(){
	
	$("#p-flat").click(function(){
        loadPreset(0);
    }); 
	$("#p-jazz").click(function(){
        loadPreset(1);
    }); 
    $("#p-rock").click(function(){
        loadPreset(2);
    }); 
    $("#p-classic").click(function(){
        loadPreset(4);
    }); 
    $("#p-pop").click(function(){
        loadPreset(3);
    }); 
    $("#p-user1").click(function(){
        loadPreset(5);
    }); 
    $("#p-user2").click(function(){
        loadPreset(6);
    }); 
    $("#p-user3").click(function(){
        loadPreset(7);
    }); 
    $("#p-user4").click(function(){
        loadPreset(8);
    }); 
    
    $("#p-user5").click(function(){
        loadPreset(9);
    }); 
	
	
	$("#ps-user1").click(function(){
        savePreset(5);
    }); 
    $("#ps-user2").click(function(){
        savePreset(6);
    }); 
    $("#ps-user3").click(function(){
        savePreset(7);
    }); 
    $("#ps-user4").click(function(){
        savePreset(8);
    }); 
    $("#ps-user5").click(function(){
        savePreset(9);
    }); 
    $("#v-update").click(function(){
        AskEq();AskVol();
    }); 
    
    
    
});

//declare eq
$(function() {
	// setup master volume
	$( "#master" ).slider({
		value: 11,
		min:0,
		max:11,
		orientation: "horizontal",
		range: "min",
		slide:function(event,ui){
			changeEq(2,10,ui.value);
			//AskVol();
		}
		//animate: true
	});
	// setup graphic EQ
	$( "#eq-left > span" ).each(function() {
		// read initial values from markup and remove that
		var value = parseInt( $( this ).text(), 10 );
		$( this ).empty().slider({
			value: value,
			range: "min",
			min:-18,
			max:18,
			step: 3,
			//animate: true,
			orientation: "vertical",
			slide:function(event,ui){
				changeEq($(this).attr("data-chan"),
				$(this).attr("data-band"),
				((ui.value/3)+6)
				);
				//alertify.log(ui.value);
			}
		});
	});
	$( "#eq-right > span" ).each(function() {
		// read initial values from markup and remove that
		var value = parseInt( $( this ).text(), 10 );
		$( this ).empty().slider({
			value: value,
			range: "min",
			min:-18,
			max:18,
			step: 3,
			//animate: true,
			orientation: "vertical",
			slide:function(event,ui){
				changeEq($(this).attr("data-chan"),
				$(this).attr("data-band"),
				((ui.value/3)+6)
				);
				
			}
		});
	});
	
	$( "#link" ).button();
});


//function
var changeEq = function(c,b,v){
		
		//alertify.log("channel:"+c+" band:"+b+" value:"+v);
		//alertify.log("band:"+b);
		//alertify.log("value:"+v);
		var cs='a';
		var command="nisa"+
		String.fromCharCode(4)+
		's'+
		String.fromCharCode(b)+
		String.fromCharCode(c)+
		String.fromCharCode(v)+
		String.fromCharCode(cs);
		
		
		bluetoothSerial.write(command);
		//alertify.log(command);
		//AskEq();
}

var AskEq = function(){

		var cs='a';
		var command="nisa"+
		String.fromCharCode(2)+
		'a'+'e'+
		String.fromCharCode(cs);
		
		bluetoothSerial.write(command);
		//alertify.log("updating");
}
var AskVol = function(){

		var cs='a';
		var command="nisa"+
		String.fromCharCode(2)+
		'a'+'v'+
		String.fromCharCode(cs);
		
		bluetoothSerial.write(command);
		//alertify.log("updating");
}
var loadPreset=function(idx){
	var cs='a';
		var command="nisa"+
		String.fromCharCode(3)+
		'p'+'l'+
		String.fromCharCode(idx)+
		String.fromCharCode(cs);
		
		
		bluetoothSerial.write(command);
		//alertify.log("idx:"+idx);
		AskEq();
}


var savePreset=function(idx){
	var cs='a';
		var command="nisa"+
		String.fromCharCode(3)+
		'p'+'s'+
		String.fromCharCode(idx)+
		String.fromCharCode(cs);
		
		
		bluetoothSerial.write(command);
		//alertify.log("idx:"+idx);
}

//call init function
$(function() {
	//changeEq(0,100,80);
	
});
//alertify.log("eq");
