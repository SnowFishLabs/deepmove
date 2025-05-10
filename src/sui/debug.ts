import { setup, setup_move } from './sui_wasm';
import { parse } from 'smol-toml';
import fs from 'fs-extra';

export function debug_move_function(
    wasm_runtime: any, 
    code_helper: any, 
    package_path: string, 
    module_name: string, 
    func_name: string
) {
    let toml_path = package_path + "/Move.toml";

    if (!fs.existsSync(toml_path)) {
        console.error(`Unable to find package manifest at ${package_path}`)
        return;
    }

    setup_move(code_helper, package_path, true);

    let funcs = code_helper.get_functions(module_name);
    let func_names = JSON.parse(funcs);

    if (!func_names.length) {
        console.error(`Unable to find module: ${module_name}`)
        return;
    }

    if (func_names.indexOf(func_name) == -1) {
        console.error(`Unable to find function: ${func_name} in module: ${module_name}`)
        return;
    }

    let toml_string = fs.readFileSync(toml_path).toString();
    let toml: any = parse(toml_string);

    let package_name = toml.package.name;
    let package_address = toml.addresses[package_name];

    setup(wasm_runtime, package_path);

    let trace_dir = package_path + "/traces";
    let trace_file = `${package_path}/traces/${package_name}__${module_name}__${func_name}.json`;

    fs.removeSync(trace_dir);
    fs.mkdirpSync(trace_dir);

    wasm_runtime.set_tracer_enable(true, trace_file)
    wasm_runtime.call_return_bcs(package_address, module_name, func_name, [], [])
}