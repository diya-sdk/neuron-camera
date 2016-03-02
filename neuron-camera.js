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
		height: { notify: true, value:240 }
	},
	ready: function () {
		var that = this;
		this.video = this.$.camera;
	},

	start: function () {
		var that = this;
		navigator.getUserMedia({video:{
			mandatory:{
				minWidth:this.width,minHeight:this.height,
				maxWidth:this.width,maxHeight:this.height
				//minFrameRate:1,maxFrameRate:1
			}
		}}, function (stream) {
			that.fire("stream", {stream:stream}); // Notify the underlying diya-sdk RTC channel that a new stream is available
			that.video.src = window.URL.createObjectURL(stream);
			that.video.controls = true;
			that.localMediaStream = stream;
		}, errorCallback);
	},

	stop: function () {
		this.video.pause();
		this.localMediaStream.stop();  // Doesn't do anything in Chrome.
	}
});


function errorCallback(e) {
	if (e.code == 1) {
		alert('User denied access to their camera');
	} else {
		alert('getUserMedia() not supported in your browser.');
	}
}
