'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Set Version and/or Build Number of Cordova config.xml.
 * @param {string} [configPath]
 * @param {string} [version]
 * @param {number} [buildNumber]
 */
let cordovaSetVersion = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (...args) {
        var _parseArguments = parseArguments(...args),
            _parseArguments2 = (0, _slicedToArray3.default)(_parseArguments, 3);

        let configPath = _parseArguments2[0],
            version = _parseArguments2[1],
            buildNumber = _parseArguments2[2];


        configPath = configPath || DefaultConfigPath;
        version = version || null;
        buildNumber = buildNumber || null;

        checkTypeErrors(configPath, version, buildNumber);

        let xml = yield getXml(configPath);

        if (!version && !buildNumber) {
            version = yield getVersionFromPackage(version);
        }

        xml = setAttributes(xml, version, buildNumber);

        const newData = xmlBuilder.buildObject(xml);
        return writeFile(configPath, newData, { encoding: 'UTF-8' });
    });

    return function cordovaSetVersion() {
        return _ref.apply(this, arguments);
    };
})();

let getXml = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (configPath) {
        const configFile = yield readFile(configPath, 'UTF-8');

        return (0, _xml2jsEs6Promise2.default)(configFile);
    });

    return function getXml(_x) {
        return _ref2.apply(this, arguments);
    };
})();

let getVersionFromPackage = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)(function* () {
        const packageFile = yield readFile('./package.json', 'UTF-8');
        const pkg = JSON.parse(packageFile);
        const version = pkg.version;


        return version;
    });

    return function getVersionFromPackage() {
        return _ref3.apply(this, arguments);
    };
})();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utilPromisify = require('util-promisify');

var _utilPromisify2 = _interopRequireDefault(_utilPromisify);

var _xml2jsEs6Promise = require('xml2js-es6-promise');

var _xml2jsEs6Promise2 = _interopRequireDefault(_xml2jsEs6Promise);

var _xml2js = require('xml2js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFile = (0, _utilPromisify2.default)(_fs2.default.readFile);
const writeFile = (0, _utilPromisify2.default)(_fs2.default.writeFile);

const xmlBuilder = new _xml2js.Builder();
const DefaultConfigPath = './config.xml';

function parseArguments(...args) {
    switch (args.length) {
        case 0:
            return [null, null, null];
        case 1:
            return parse1Argument(args[0]);
        case 2:
            return parse2Arguments(args[0], args[1]);
        default:
            return args;
    }
}

function parse1Argument(arg) {
    if (typeof arg === 'string' && arg.indexOf('.xml') < 0) {
        return [null, arg, null];
    }

    if (typeof arg === 'number') {
        return [null, null, arg];
    }

    return [arg, null, null];
}

function parse2Arguments(arg1, arg2) {
    const arg1IsString = typeof arg1 === 'string';
    const arg1IsStringXml = arg1IsString && arg1.indexOf('.xml') >= 0;
    const arg2IsNumber = typeof arg2 === 'number';

    if (arg2IsNumber && (arg1IsStringXml || !arg1IsString)) {
        return [arg1, null, arg2];
    }

    if (arg1IsString && !arg1IsStringXml) {
        return [null, arg1, arg2];
    }

    return [arg1, arg2, null];
}

function checkTypeErrors(configPath, version, buildNumber) {
    if (typeof configPath !== 'string') {
        throw TypeError('"configPath" argument must be a string');
    }

    if (version && typeof version !== 'string') {
        throw TypeError('"version" argument must be a string');
    }

    if (buildNumber && typeof buildNumber !== 'number') {
        throw TypeError('"buildNumber" argument must be an integer');
    }

    if (buildNumber && buildNumber !== parseInt(buildNumber, 10)) {
        throw TypeError('"buildNumber" argument must be an integer');
    }
}

function setAttributes(xml, version, buildNumber) {
    const newXml = xml;

    let header = xml.widget.preference.find(function (preference) {
        return preference.$.name == 'AppendUserAgent';
    });

    if (version) {
        newXml.widget.$.version = version;
        if (header) {
            header.$.value = 'Dentally iOS ' + version;
        }
    }

    if (buildNumber) {
        newXml.widget.$['android-versionCode'] = buildNumber;
        newXml.widget.$['ios-CFBundleVersion'] = buildNumber;
        newXml.widget.$['osx-CFBundleVersion'] = buildNumber;
    }

    return newXml;
}

exports.default = cordovaSetVersion;
module.exports = exports.default;