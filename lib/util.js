var consts = require('./consts');
var cliff = require("./cliff");
var fs = require('fs-extra');

var Util = {};

module.exports = Util;

Util.log = function (str) {
	process.stdout.write(str + '\n');
}

Util.help = function () {
	Util.log(consts.HELP_INFO_1)

	let chain = process.env.CURRENT_CHAIN;
	var COMANDS_ALL;
	if (chain == "sui") {
		COMANDS_ALL = consts.COMANDS_ALL_SUI;
	} else if (chain == "aptos") {
		COMANDS_ALL = consts.COMANDS_ALL_APTOS;
	}

	Util.log(cliff.stringifyRows(COMANDS_ALL));

	Util.log(consts.HELP_INFO_2)
}

Util.helpCommand = function (comd) {
	if (consts.COMANDS_MAP[comd]) {
		var INFOS = consts.COMANDS_MAP[comd];
		Util.log(INFOS);
	}
}

Util.errorHandle = function (comd, rl) {
	Util.log('\nunknow command : ' + comd);
	Util.log('type help for help infomation\n');
	rl.prompt();
}

Util.argsFilter = function (argv) {
	var lines;
	if (argv.indexOf('\'') > 0) {
		lines = argv.split('\'');
	}
	var getArg = function (argv) {
		var argvs = argv.split(' ');
		for (var i = 0; i < argvs.length; i++) {
			if (argvs[i] === ' ' || argvs[i] === '') {
				argvs.splice(i, 1);
			}
		}
		return argvs;
	};
	if (!!lines) {
		var head = getArg(lines[0]);
		for (var i = 1; i < lines.length - 1; i++) {
			head = head.concat(lines[i]);
		}
		var bottom = getArg(lines[lines.length - 1]);
		return head.concat(bottom);
	} else {
		return getArg(argv);
	}
}

Util.getSuiBin = function () {
	return generateBinPath();
}

var SUI_BINARY_PATH = process.env.SUI_BINARY_PATH;

function generateBinPath() {
	if (SUI_BINARY_PATH) {
		if (!fs.existsSync(SUI_BINARY_PATH)) {
			console.warn(`[Deepmove] Ignoring bad configuration: SUI_BINARY_PATH=${SUI_BINARY_PATH}`);
		} else {
			return { binPath: SUI_BINARY_PATH };
		}
	}

	return { binPath: "sui" };
}

// 'mainnet' | 'testnet' | 'devnet' | 'localnet';
Util.isValidNetwork = function (network) {
	return network == 'mainnet' || network == 'testnet' || network == 'devnet' || network == 'localnet';
}

Util.isValidChain = function (chain) {
	let c = chain.toLowerCase();
	return consts.SUPPORTED_CHAINS.indexOf(c) != -1;
}

Util.updatePublishPackageInfos = function (package_path, network, package_infos) {
	let t_path = package_path + "/.deepmove";
	if (!fs.existsSync(t_path)) {
		fs.mkdirpSync(t_path);
	}

	let p = t_path + `/publish_${network}.json`;
	fs.writeFileSync(p, JSON.stringify(package_infos, null, 2));
}

Util.getPublishPackageInfos = function (package_path, network) {
	let p = package_path + `/.deepmove/publish_${network}.json`;
	if (fs.existsSync(p)) {
		let d = fs.readFileSync(p).toString();
		return JSON.parse(d);
	}
}