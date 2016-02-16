Polymer({
	is: 'neuron-camera',
	properties: {
		height: { notify: true },
		width: { notify: true }
	},
	ready: function () {
		var that = this;
		this.width = 320;
		this.height = 240;
		this.incr = 1;
		this.video = this.$.basicStream;
		this.ctx1 = this.$.c1.getContext("2d");
		this.localMediaStream = null;
		this.imgId  = 0;
		this.rtcSizeMax = 16000;
		this.sizeImg = this.width * this.height;
		this.nbChunks = Math.ceil((this.sizeImg) /this.rtcSizeMax);
		this.sizeLastChunk = (this.sizeImg) % this.rtcSizeMax;
	},

	startVideo: function () {
		var that = this;
		if (navigator.getUserMedia) {
			navigator.getUserMedia('video', function (stream) {
				that.video.src = stream;
				that.video.controls = true;
				// that.video.maxWidth = 240;
				// that.video.maxHeight = 180;
				that.localMediaStream = stream;
			}, errorCallback);
		} else if (navigator.webkitGetUserMedia) {
			navigator.webkitGetUserMedia({ video: true }, function (stream) {
				that.video.src = window.URL.createObjectURL(stream);
				that.video.controls = true;
				// that.video.maxWidth = 240;
				// that.video.maxHeight = 180;
				that.localMediaStream = stream;
			}, errorCallback);
		} else {
			errorCallback({ target: that.video });
		}
	},
	stopVideo: function () {
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
