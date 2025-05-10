import { Aptos, AptosConfig, type MoveModuleBytecode, Network } from "@aptos-labs/ts-sdk";
import { stringify as toml_stringify } from 'smol-toml';
import { MoveGen } from './wasm/pkg/aptos_wasm';
import { fromHex } from '@mysten/bcs';
import fs from 'fs-extra';

export async function clone_chain_move_module(
    move_gen: MoveGen,
    network: Network,
    module_objectid: string,
    package_path: string
) {
    let out = package_path + "/deps";
    if (!fs.existsSync(out)) {
        fs.mkdirpSync(out);
    }

    if (!fs.existsSync(out)) {
        fs.mkdirpSync(out);
    }

    let object_modules: Record<string, MoveModuleBytecode[]> = {};

    await get_online_packages(move_gen, network, module_objectid, object_modules, package_path);

    for (var objectid in object_modules) {
        let modules = object_modules[objectid];

        let module_bcs: any = {};
        modules.forEach(object_module => {
            let bcs = object_module.bytecode;
            move_gen.run_module_gen(out, objectid, new Uint8Array(fromHex(bcs)))

            let module_name = object_module.abi?.name;
            if (module_name) {
                module_bcs[module_name] = bcs;
            }
            console.log(`Disassemble move bytecodes of ${objectid} ${object_module.abi?.name} into move interfaces`);
        })

        let out_bcs = out + "/" + module_objectid + "/bcs";
        if (!fs.existsSync(out_bcs)) {
            fs.mkdirpSync(out_bcs)
        }
        let out_bcs_file = `${out_bcs}/${objectid}.json`;
        fs.writeFileSync(out_bcs_file, JSON.stringify(module_bcs, null, 2));
    }

    let toml_path = package_path + "/Move.toml";
    let toml_string = fs.readFileSync(toml_path).toString();

    toml_string = MoveGen.toml_edit_dependencies(toml_string, "dependencies-remote", module_objectid, "network", network);
    toml_string = MoveGen.toml_edit_dependencies(toml_string, "dependencies", module_objectid, "local", `./deps/${module_objectid}`);

    console.log(`Update Move.toml [dependencies-remote] and [dependencies] of ${module_objectid}`);

    fs.writeFileSync(toml_path, toml_string);

    console.log(`Clone move bytecodes of ${module_objectid} done!`);
}

async function get_online_packages(
    move_gen: MoveGen,
    network: Network,
    objectid: string,
    object_modules: Record<string, MoveModuleBytecode[]>,
    package_path: string
) {
    let out = package_path + "/deps";

    const config = new AptosConfig({ network: network });

    const aptos = new Aptos(config);

    const modules = await aptos.getAccountModules({
        accountAddress: objectid, // replace with a real account address
    });

    object_modules[objectid] = modules;

    let dependencies_modules: Record<string, boolean> = {};
    dependencies_modules[objectid] = true;

    for (var i = 0; i < modules.length; i++) {
        let module = modules[i];
        let bcs = module.bytecode;
        let deps_string = move_gen.get_module_dependencies(new Uint8Array(fromHex(bcs)));
        let deps = JSON.parse(deps_string);

        deps.forEach(function(dep: string) {
            if (dep.length > 10) {
                dependencies_modules[dep] = true;
            }
        })
    }

    let deps_modules: string[] = [];
    for (var dependencies_module in dependencies_modules) {
        if (!object_modules[dependencies_module]) {
            await get_online_packages(move_gen, network, dependencies_module, object_modules, package_path)

            deps_modules.push(dependencies_module);
        }
    }

    if (fs.existsSync(out)) {
        gen_move_toml(deps_modules, out, objectid)
    }
}

function gen_move_toml(
    deps_modules: string[],
    out: string,
    objectId: string
) {
    let out_dir = out + "/" + objectId;
    if (!fs.existsSync(out_dir)) {
        fs.mkdirpSync(out_dir)
    }
    let move_toml = out_dir + "/Move.toml";

    let dependencies: Record<string, any> = {};
    dependencies["AptosFramework"] = {
        local: `../aptosframework/aptos-move/framework/aptos-framework`
    }

    for (var i = 0; i < deps_modules.length; i++) {
        if (deps_modules[i] == "0x0000000000000000000000000000000000000000000000000000000000000001") continue;
        if (deps_modules[i] == "0x0000000000000000000000000000000000000000000000000000000000000002") continue;
        let local_name: string = deps_modules[i];
        let local_path = "../" + deps_modules[i];
        dependencies[local_name] = {
            local: local_path
        }
    }

    let contents = {
        package: {
            name: objectId,
            "published-at": objectId,
            version: "1.0.0"
        },
        dependencies: dependencies,
        addresses: {
            std: "0x1",
        },
        'dev-dependencies': {},
        'dev-addresses': {}
    };

    let move_toml_result = toml_stringify(contents);
    fs.writeFileSync(move_toml, move_toml_result);
}