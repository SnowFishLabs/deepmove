import { deps_init } from '@deepmove/sui';
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
var toml = require("smol-toml");
var shell = require("shelljs");
var fs = require("fs-extra");
var path = require("path");

export default function (opts) {
    return new Command(opts);
};

var Command = function (opt) {
    this.move_package = "";
}

Command.prototype.handle = async function (agent, comd, argv, rl, msg) {
    let project_path = process.cwd();
    let toml_path = project_path + "/Move.toml";

    if (!fs.existsSync(toml_path)) {
        console.error(`Unable to find package manifest at ${project_path}`)
        return;
    }

    let toml_string = fs.readFileSync(toml_path).toString();
    let toml_content = toml.parse(toml_string);
    let move_package = toml_content.package.name;
    this.move_package = move_package;

    this.updateMoveToml(toml_path);

    let template_path_js = require.resolve("../../template/index");
    let template_path = path.dirname(template_path_js);

    const steps = 3;

    console.log(`[1/${steps}] Copying files...`);

    this.copyFiles(template_path, project_path);

    let chain = process.env.CURRENT_CHAIN;

    let chain_path = template_path + "/" + chain;

    this.copyFiles(chain_path, project_path);

    console.log(`[2/${steps}] Update Move dependencies...`);
    
    await deps_init(project_path);

    console.log(`[3/${steps}] Installing Npm dependencies...`);

    shell.exec(`npm install --ignore-scripts`);

    rl.prompt();
}

Command.prototype.updateMoveToml = function (toml_path) {
    let toml_string = fs.readFileSync(toml_path).toString();

    let toml_content = toml.parse(toml_string);
    let deps = toml_content["dependencies"];

    let dependencies_remote = `[dependencies-remote]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet", override = true }

[dependencies]
    `;

    let flag = false;
    for(var k in deps) {
        flag = true;
    }

    if (!flag) {
        toml_string = toml_string.replace(/\[dependencies\]/g, dependencies_remote)
        fs.writeFileSync(toml_path, toml_string);
    } else {
        toml_string = toml_string.replace(/\[dependencies\]/g, `[dependencies-remote]`)
        fs.writeFileSync(toml_path, toml_string);
    }
}

Command.prototype.copyFiles = function (from_path, to_path) {
    let files = fs.readdirSync(from_path);

    for (var i = 0; i < files.length; i++) {
        let f = files[i];
        if (f == "index.js") continue;

        let from_file = `${from_path}/${f}`;
        let state_file = fs.statSync(from_file);

        if (!state_file.isFile()) {
            continue;
        }

        let target_file = `${to_path}/${f}`;

        let content = fs.readFileSync(from_file).toString();

        content = content.replace(/\{\{package\}\}/g, this.move_package);

        if (!fs.existsSync(target_file)) {
            fs.writeFileSync(target_file, content);
        }
    }
}