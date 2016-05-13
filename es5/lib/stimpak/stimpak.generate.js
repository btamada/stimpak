"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = generate;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _lodash = require("lodash.template");

var _lodash2 = _interopRequireDefault(_lodash);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _vinyl = require("vinyl");

var _vinyl2 = _interopRequireDefault(_vinyl);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generate(callback) {
	if (this.destination()) {
		var _ = (0, _incognito2.default)(this);
		var action = _.action;

		action.step(renderFiles.bind(this)).results(callback);
	} else {
		callback(new Error("You must set .destination() before you can .generate()"));
	}

	return this;
}

function renderFiles(stimpak, done) {
	_flowsync2.default.mapSeries(stimpak.sources, renderSource.bind(this), done);
}

function renderSource(source, done) {
	var _this = this;

	var templateFileNames = _glob2.default.sync(source.glob(), {
		cwd: source.directory()
	});

	_flowsync2.default.mapSeries(templateFileNames, function (fileName, fileNameDone) {
		renderFile.call(_this, fileName, source, fileNameDone);
	}, done);
}

function renderFile(fileName, source, done) {
	var _this2 = this;

	var templateFilePath = source.directory() + "/" + fileName;
	var fileContents = renderTemplateFile.call(this, templateFilePath);
	var answers = this.answers();

	var filePath = fileName;

	for (var answerName in answers) {
		var answerValue = answers[answerName];
		var answerRegExp = new RegExp("##" + answerName + "##", "g");
		filePath = filePath.replace(answerRegExp, answerValue);
	}

	var newFile = new _vinyl2.default({
		cwd: this.destination(),
		base: this.destination(),
		path: this.destination() + "/" + filePath,
		contents: new Buffer(fileContents)
	});

	if (_fs2.default.existsSync(newFile.path)) {
		(function () {
			var oldFileContents = _fs2.default.readFileSync(newFile.path);

			var mergeStrategies = _this2.merge();

			if (mergeStrategies.length > 0) {
				mergeStrategies.forEach(function (mergeStrategy) {
					var mergePattern = new RegExp(mergeStrategy[0]);

					if (newFile.path.match(mergePattern)) {
						var mergeFunction = mergeStrategy[1];
						var oldFile = new _vinyl2.default({
							cwd: newFile.cwd,
							base: newFile.base,
							path: newFile.path,
							contents: oldFileContents
						});

						mergeFunction(_this2, newFile, oldFile, function (error, mergedFile) {
							if (error) {
								done(error);
							} else {
								writeFile(mergedFile.path, mergedFile.contents, done);
							}
						});

						// TODO: Write the merged file!
					} else {
							writeFile(newFile.path, newFile.contents, done);
						}
				});
			} else {
				writeFile(newFile.path, newFile.contents, done);
			}
		})();
	} else {
		writeFile(newFile.path, newFile.contents, done);
	}
}

function renderTemplateFile(templateFilePath) {
	var templateFileContents = _fs2.default.readFileSync(templateFilePath);
	var template = (0, _lodash2.default)(templateFileContents);
	var renderedTemplateContents = template(this.answers());

	return renderedTemplateContents;
}

function writeFile(filePath, fileContents, done) {
	_fs2.default.writeFileSync(filePath, fileContents);
	done();
}