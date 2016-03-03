//////////////
// POLYFILL //
//////////////

if(!navigator.getUserMedia && navigator.webkitGetUserMedia) {
	navigator.getUserMedia = function(opt, callback, errorCallback ) {
		return navigator.webkitGetUserMedia(opt, function (stream) {
			callback(stream);
		}, errorCallback);
	};
}

navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);



///////////////////


Polymer({
	is: 'neuron-camera',
	properties: {
		width: { notify: true, value:320 },
		height: { notify: true, value:240 },
		camera: { value:null }
	},
	ready: function () {
		var that = this;
		this.video = this.$.camera;
	},

	start: function () {
		var that = this;
		var constraints = {
			video:{
				mandatory:{
					minWidth:this.width,minHeight:this.height,
					maxWidth:this.width,maxHeight:this.height
					//minFrameRate:1,maxFrameRate:1
				}
			}
		};
		if(this.camera==="front") constraints.facingMode = "user";
		else if(this.camera==="rear") constraints.facingMode = "environment";
		navigator.getUserMedia(constraints, function (stream) {
			that.stream = stream;
			that.fire("stream", {stream:stream}); // Notify the underlying diya-sdk RTC channel that a new stream is available
			that.video.src = window.URL.createObjectURL(stream);
			that.video.controls = true;
			that.localMediaStream = stream;
		}, errorCallback);
	},

	stop: function () {
		if(!this.stream) return;
		this.stream.getAudioTracks().forEach(function(track) { track.stop();  });
		this.stream.getVideoTracks().forEach(function(track) { track.stop();  });
		this.video.src = "";
		this.fire("stop", {stream:this.stream});
	}
});


function errorCallback(e) {
	if (e.code == 1) {
		alert('User denied access to camera');
	} else {
		alert('getUserMedia() not supported in your browser.');
	}
}
