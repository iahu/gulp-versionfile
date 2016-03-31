##gulp-version-file

**Inspired by [gulp-hash](https://github.com/Dragory/gulp-hash)**

Genere a version file, which contents is hash of source file content.
If you use `SSI` to control file version, you may want a version file like that.

###Usage
```js
gulp.src('src/**/*.js')
	.pipe(named())
	.pipe(browserify())
	.pipe(uglify())

	// generate a dest js file
	.pipe(gulp.dest( jsDest ))

	// generate a version file
	.pipe(versionFile({
		algorithm: 'sha1',
		template: '<%= name %><%= ext %>.ver',
		hashLength: 32
	}))
	.pipe(gulp.dest( verDest ));
```

####Options

|   Option   |           Default           |                                         Description                                          |
|------------|-----------------------------|----------------------------------------------------------------------------------------------|
| algorithm  | 'sha1'                      | see [node crypto api](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm) |
| template   | '<%= name %><%= ext %>.ver' | Filename template                                                                            |
| hashLength | 32                          | length of hash, which will write into file                                                   |


###License
MIT