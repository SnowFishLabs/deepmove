import { get_move_code_helper, get_move_gen } from './sui_wasm';
import { readDirDeepSync } from 'read-dir-deep';
import { fromBase64 } from '@mysten/bcs';
import { parse } from 'smol-toml';
import fs from 'fs-extra';

export function setup(
    runtime: any, 
    package_path: string
) {
    let toml_path = package_path + "/Move.toml";
    let toml_string = fs.readFileSync(toml_path).toString();
    let toml: any = parse(toml_string);
    let package_name = toml.package.name;

    for (var dep_module in toml.dependencies) {
        if (dep_module.startsWith("0x") && toml.dependencies[dep_module]["local"]) {
            let local_bcs_path = toml.dependencies[dep_module]["local"] + "/bcs";
            if (fs.existsSync(local_bcs_path)) {
                let bcs_json_files = fs.readdirSync(local_bcs_path);
                for (var i = 0; i < bcs_json_files.length; i++) {
                    let bcs_json_file = local_bcs_path + "/" + bcs_json_files[i];
                    var bcs_json_data = fs.readFileSync(bcs_json_file).toString();
                    if (bcs_json_data) {
                        var bcs_json = JSON.parse(bcs_json_data);
                        for (var bcs_module in bcs_json) {
                            runtime.publish_module(fromBase64(bcs_json[bcs_module]))
                        }
                    }
                }
            }
        }
    }

    let bytecode_path = package_path + `/build/${package_name}/bytecode_modules`;

    let files = readDirDeepSync(bytecode_path, { gitignore: false, ignore: [] });
    for (var i = 0; i < files.length; i++) {
        if (files[i].indexOf("dependencies/0x") != -1) {
            continue;
        }
        let bytes = fs.readFileSync(files[i]);
        let unit8_bytes = new Uint8Array(bytes);
        runtime.publish_module(unit8_bytes)
    }

    let sourec_map_path = package_path + `/build/${package_name}/source_maps`;
    if (!fs.existsSync(sourec_map_path)) {
        sourec_map_path = package_path + `/build/${package_name}/debug_info`;
    }

    files = readDirDeepSync(sourec_map_path, { gitignore: false, ignore: [] });
    for (var i = 0; i < files.length; i++) {
        if (files[i].indexOf(".json") == -1) {
            continue;
        }
        let bytes = fs.readFileSync(files[i]).toString();
        runtime.add_source_map_json(bytes)
    }

    let sourec_codes_path = package_path + `/build/${package_name}/sources`;

    files = readDirDeepSync(sourec_codes_path, { gitignore: false, ignore: [] });
    for (var i = 0; i < files.length; i++) {
        if (files[i].indexOf(".move") == -1) {
            continue;
        }
        let bytes = fs.readFileSync(files[i]).toString();
        runtime.add_source_code(bytes)
    }

    runtime.setup_storage()
}

export function setup_move(
    runtime: any, 
    package_path: string, 
    include_deps: boolean
) {
    let toml_path = package_path + "/Move.toml";
    let toml_string = fs.readFileSync(toml_path).toString();
    let toml: any = parse(toml_string);
    let package_name = toml.package.name;

    if (include_deps) {
        for (var dep_module in toml.dependencies) {
            if (dep_module.startsWith("0x") && toml.dependencies[dep_module]["local"]) {
                let local_bcs_path = toml.dependencies[dep_module]["local"] + "/bcs";
                if (fs.existsSync(local_bcs_path)) {
                    let bcs_json_files = fs.readdirSync(local_bcs_path);
                    for (var i = 0; i < bcs_json_files.length; i++) {
                        let bcs_json_file = local_bcs_path + "/" + bcs_json_files[i];
                        let bcs_json_module = bcs_json_files[i].substring(0, (bcs_json_files[i].indexOf(".json")))
                        var bcs_json_data = fs.readFileSync(bcs_json_file).toString();
                        if (bcs_json_data) {
                            var bcs_json = JSON.parse(bcs_json_data);
                            for (var bcs_module in bcs_json) {
                                runtime.register_module(bcs_json_module, fromBase64(bcs_json[bcs_module]))
                            }
                        }
                    }
                }
            }
        }
    }

    let bytecode_path = package_path + `/build/${package_name}/bytecode_modules`;
    let files: string[] = [];

    if (include_deps) {
        files = readDirDeepSync(bytecode_path, { gitignore: false, ignore: [] });
    } else {
        var dirfiles = fs.readdirSync(bytecode_path);

        files = dirfiles.map(function (f) {
            return bytecode_path + "/" + f;
        })
    }

    for (var i = 0; i < files.length; i++) {
        let file = files[i];
        let regex = /\/dependencies\/(.*?)\/.*?.mv/
        let match: any = file.match(regex);
        if (match) {
            match = match[1];
        } else {
            match = package_name;
        }
        if (file.indexOf("dependencies/0x") != -1) {
            continue;
        }
        // if (file.indexOf("_tests.mv") != -1) {
        //     continue;
        // }
        if (file.indexOf(".mv") == -1) {
            continue;
        }
        var bytes = fs.readFileSync(file);
        runtime.register_module(match, new Uint8Array(bytes))
    }

    runtime.build_bytecode_model();
}

export function setup_move_gen(package_path: string, include_deps: boolean) {
    setup_move(get_move_gen(), package_path, include_deps);
}

export function setup_move_code_helper(package_path: string, include_deps: boolean) {
    setup_move(get_move_code_helper(), package_path, include_deps);
}