/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	
	macAddress: "98:D3:31:40:09:E9",  // get your mac address from bluetoothSerial.list
    chars: "",
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        console.log("Starting  app");
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        connectButton.addEventListener('touchend', app.manageConnection, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        // check to see if Bluetooth is turned on.
        // this function is called only
        //if isEnabled(), below, returns success:
        var listPorts = function() {
            // list the available BT ports:
            bluetoothSerial.list(
                function(results) {
                    app.display(JSON.stringify(results));
                },
                function(error) {
                    app.display(JSON.stringify(error));
                }
            );
        }

        // if isEnabled returns failure, this function is called:
        var notEnabled = function() {
            app.display("Bluetooth is not enabled.")
        }

         // check if Bluetooth is on:
        bluetoothSerial.isEnabled(
            listPorts,
            notEnabled
        );
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    /*
    Connects if not connected, and disconnects if connected:
*/
    manageConnection: function() {
		alertify.log("connecting");
		
        // connect() will get called only if isConnected() (below)
        // returns failure. In other words, if not connected, then connect:
        var connect = function () {
            // if not connected, do this:
            // clear the screen and display an attempt to connect
            connectButton.innerHTML = "Connecting";
            app.clear();
            app.display("Attempting to connect. " +
                "Make sure the serial port is open on the target device.");
            // attempt to connect:
            bluetoothSerial.connect(
                app.macAddress,  // device to connect to
                app.openPort,    // start listening if you succeed
                app.showError    // show the error if you fail
                
            );
            //alertify.log("connected");
        };

        // disconnect() will get called only if isConnected() (below)
        // returns success  In other words, if  connected, then disconnect:
        var disconnect = function () {
            app.display("attempting to disconnect");
            // if connected, do this:
            bluetoothSerial.disconnect(
                app.closePort,     // stop listening to the port
                app.showError      // show the error if you fail
            );
			//alertify.log("connected");
        };

        // here's the real action of the manageConnection function:
        bluetoothSerial.isConnected(disconnect, connect);
    },
/*
    subscribes to a Bluetooth serial listener for newline
    and changes the button:
*/
    openPort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Connected to: " + app.macAddress);
        AskEq();
        AskVol();
        // change the button's name:
        connectButton.innerHTML = "Disconnect";
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        bluetoothSerial.subscribe('asin', function (data) {
            app.clear();
            //app.display(data);
            //alertify.log(data);
            btread(data);
        });
    },

/*
    unsubscribes from any Bluetooth serial listener and changes the button:
*/
    closePort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Disconnected from: " + app.macAddress);
        // change the button's name:
        connectButton.innerHTML = "Connect";
        // unsubscribe from listening:
        bluetoothSerial.unsubscribe(
                function (data) {
                    app.display(data);
                },
                app.showError
        );
    },
/*
    appends @error to the message div:
*/
    showError: function(error) {
        app.display(error);
        if(error.indexOf('was lost')>-1||
		error.indexOf('nable to connect')>-1
        )
        {
			connectButton.innerHTML = "connect";
			alertify.error(error);
		}

    },

/*
    appends @message to the message div:
*/
    display: function(message) {
        var display = document.getElementById("message"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        display.appendChild(lineBreak);          // add a line break
        display.appendChild(label);              // add the message node
    },
/*
    clears the message div:
*/
    clear: function() {
        var display = document.getElementById("message");
        display.innerHTML = "";
    }
    
};

app.initialize();
//app.closePort();
//app.openPort();


var read_failure=function(){
	alertify.log("error read");
	
}

var btread=function(dat){
	
	//alertify.log('recv:'+dat);
	//if(dat.indexOf("nisa")>-1)
	{
		
		//dats=dat.split();
		//alertify.log('len:'+dat[4].charCodeAt(0));

		if(dat[5]==='e')
		{
			var ii=6;
			//alertify.log('eq updating');
			$( "#eq-right > span" ).each(function() {
				$( this ).slider( "value", (dat[ii].charCodeAt(0)-6)*3 );
				ii++;
			});
			var iii=16;
			$( "#eq-left > span" ).each(function() {
				$( this ).slider( "value", (dat[iii].charCodeAt(0)-6)*3 );
				iii++;
			});
			//alertify.log('eq updated');
		}
		else if(dat[5]==='v')
		{
			//setVolDisplay()
			$( "#master" ).slider("value", dat[6].charCodeAt(0));
			$( "#master" ).slider("value", dat[7].charCodeAt(0));
			$( "#master" ).slider("value", dat[8].charCodeAt(0));
			//alertify.log('vol updated');
		}
	}
	
}

setInterval(function(){
 /*try{
	 
 }
 catch{
	 
 }*/
 //bluetoothSerial.write("nisa");
 AskEq();
 AskVol();
},2000);
