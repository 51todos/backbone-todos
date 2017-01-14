/**
 * File class with simple file api for Chrome
 * @author 黄振涌 (Peter Huang) feipigzi@gmail.com
 * @license MIT
 */
/**
 * File class with simple file api for *Chrome*
 * @param {String} path '/' relatived app root (u can not see in folder)
 * @param {Int} size num of bytes,default 1024 * 1024 byte
 * @param {Type} type window.TEMPORARY or window.PERSISTENT default TEMPORARY
 *  TEMPORARY : browser can delete ur file whenever it like, maybe avail space is not enough or ...
 *  PERSISTENT : browser should access ur auth when deal with ur file
 */
//File = function (path, size, type) {
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory); // AMD
	} else {
		window.VTP = VTP || {};
		factory(window.VTP); // Browser global
	}
})(function(ns) {

	var File = ns.File = function(path, size, type) {
		if (!path) {
			throw ('path can not be empty');
		}
		this._path = path;
		this._size = size || 1024 * 1024;

		if (type && !(type === window.TEMPORARY || type === window.PERSISTENT)) {
			throw ('type must be window.TEMPORARY or window.PERSISTENT');
		}
		this._type = type ? type : window.TEMPORARY;


		this._fileWriter = null;
		this._fileEntry = null;
		this._fs = null;

		this._openingFs = false;
		this._openingFile = false;
		this._creatingWriter = false;

		this._downloadFrame = null;

		this._openFs();
	};

	/**
	 * the io operation is async，u can only get ur value in `callback` function
	 * but, the order of calling api may be sync, it means u invoke `write` after `empty`
	 * then it may execute empty first then write, even if it can not empty at once
	 */
	// File.prototype = {
	VTP.File.prototype = {

		download: function() {
			var me = this;
			me._openFile(function() {
				me._getDownloadFrame().src = me._fileEntry.toURL();
			});
		},

		_getDownloadFrame: function() {
			if (!this._downloadFrame) {
				var iframe = document.createElement('iframe');
				iframe.style.display = 'none';
				document.body.appendChild(iframe);
				this._downloadFrame = iframe;
			}
			return this._downloadFrame;
		},

		close: function() {
			this._fileWriter = null;
			this._fileEntry = null;
			this._fs = null;
		},

		/**
		 *
		 * @param  {String/Blob}   blob
		 * @param  @optional {Int}   offset   write from this position (offset from 0)
		 * @param  {Function} callback
		 */
		//@method write: function (blob, callback) {
		write: function(blob, offset, callback) {
			var me = this;

			if (typeof offset === 'function') {
				callback = offset;
				offset = 0;
			}

			//undefied / null / ''
			if (blob == null || blob === '') {
				me.empty();
				return;
			}

			me._openFile(function() {
				me._fileEntry.createWriter(function(fw) {
					console.info('----write----');
					fw.write(me.getBlob(blob));
				}, me._createWriterError);
			});
		},

		append: function(blob, callback) {
			var me = this;

			//undefied / null / ''
			if (blob == null || blob === '') {
				return;
			}

			me._openFile(function() {
				me._fileEntry.createWriter(function(fw) {
					console.info('----append----');
					fw.seek(me._fileWriter.length);
					fw.write(me.getBlob(blob));
				}, me._createWriterError);
			});
		},

		/**
		 * @param  {Function} callback function (content) {}
		 */
		read: function(callback) {
			var me = this;

			this._openFile(function() {

				me._fileEntry.file(function(file) {
					var reader = new FileReader();

					reader.onloadend = function(e) {
						console.info('----read----' + this.result);
						callback && callback(this.result);
					};

					reader.readAsText(file);

				}, me._readError); //.file

			});
		},

		empty: function() {
			var me = this;
			me._openFile(function() {
				me._fileEntry.createWriter(function(fw) {
					console.info('----empty----');
					fw.truncate(0);
				}, me._createWriterError);
			});
			return me;
		},

		getBlob: function(data) {
			if (data instanceof Blob) {
				return data;
			} else {
				return new Blob([data]);
			}
		},


		_openFs: function(callback) {
			var me = this;

			if (me._fs) {
				callback && callback(me._fs);
				return;
			}

			if (this._openingFs) {
				setTimeout(function() {
					me._openFs(callback);
				}, 10);
			} else {
				me._openingFs = true;

				self.webkitRequestFileSystem(me._type, me._size, function(fileSys) {

					me._openingFs = false;

					if (!me._fs) {
						me._fs = fileSys;
					}
					callback && callback(me._fs);
				}, me._openFsError);
			}

		},
		//@deprecate since use same writer to write after truncate at once may lead to Exception
		_confirmWriter: function(callback) {
			var me = this;

			if (me._fileWriter) {
				callback && callback(me._fileWriter);
				return;
			}

			if (this._creatingWriter) {
				setTimeout(function() {
					me._confirmWriter(callback);
				}, 10);
			} else {
				me._creatingWriter = true;

				me._openFile(function() {
					me._fileEntry.createWriter(function(fw) {
						me._creatingWriter = false;
						if (!me._fileWriter) {
							me._fileWriter = fw;
						}
						callback && callback(me._fileWriter);
					}, me._createWriterError);
				});
			}
		},

		_openFile: function(callback) {
			var me = this;

			if (me._fileEntry) {
				callback && callback(me._fileEntry);
				return;
			}

			if (this._openingFile) {
				setTimeout(function() {
					me._openFile(callback);
				}, 10);
			} else {
				me._openingFile = true;

				me._openFs(function() {

					me._fs.root.getFile(me._path, {
						create: true
					}, function(fileEntry) {

						me._openingFile = false;

						if (!me._fileEntry) {
							me._fileEntry = fileEntry;
						}
						callback && callback(me._fileEntry);

					}, me._openFileError); //getFile

				}); //_openingFs

			}
		},

		_createWriterError: function(e) {
			throw (e);
		},

		_openFileError: function(e) {
			throw (e);
		},

		_readError: function(e) {
			throw (e);
		},

		_openFsError: function(e) {
			throw (e);
		}


	};

	return File;


});