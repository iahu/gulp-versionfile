var crypto = require('crypto'),
	through2 = require('through2'),
	gutil = require('gulp-util'),
	assign = require('lodash.assign'),
	template = require('lodash.template'),
	path = require('path');

module.exports = function (options) {
	options = assign({}, {
		algorithm: 'sha1',
		template: '<%= name %><%= ext %>.ver',
		hashLength: 32
	}, options);
	var hasher = crypto.createHash(options.algorithm);

	return through2.obj(function (file, enc, cb) {
		if (file.isDirectory()) {
			this.push(file);
			cb();
			return;
		}

		var fileExt = path.extname(file.relative),
			fileName = path.basename(file.relative, fileExt);

		var hasher = crypto.createHash(options.algorithm);

		var piped = file.pipe(through2(
			function(chunk, enc, updateCb) {
				hasher.update(chunk);
				updateCb(null, chunk);
			},

			function(flushCb) {
				if (options.version !== '') hasher.update(String(options.version));
				file.hash = hasher.digest('hex').slice(0, options.hashLength);

				this.push(new gutil.File({
					path: path.join(path.dirname(file.path), template(options.template)({
						name: fileName,
						ext: fileExt
					})),
					contents: new Buffer(file.hash)
				}));

				cb();
				flushCb();
			}.bind(this)
		));

		if (file.isStream()) {
			var newContents = through2();
			piped.pipe(newContents);
			file.contents = newContents;
		}
	});
};
