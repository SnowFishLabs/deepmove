import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { stringify as toml_stringify } from 'smol-toml';
import { MoveGen } from './wasm/pkg/sui_wasm';
import { fromBase64 } from '@mysten/bcs';
import { Network } from './sui_wasm';
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

    let fullNodeUrl = getFullnodeUrl(network)
    let result_ids: string[] = [];

    console.log(`Download move bytecodes of ${module_objectid} from ${fullNodeUrl}`);
    await get_online_packages(network, module_objectid, result_ids, package_path)

    const suiClient = new SuiClient({ url: fullNodeUrl });
    let results = await suiClient.multiGetObjects({
        ids: result_ids,
        options: {
            showBcs: true,
            showContent: true,
            showDisplay: true
        }
    })

    if (results) {
        for (var i = 0; i < results.length; i++) {
            let r = results[i];
            if (r.data) {
                let bcs: any = r.data.bcs;
                let objectid = r.data.objectId;
                let moduleMap = bcs.moduleMap;
                for (var module_name in moduleMap) {
                    let module_base64 = moduleMap[module_name]
                    move_gen.run_module_gen(out, objectid, new Uint8Array(fromBase64(module_base64)))
                }
                console.log(`Disassemble move bytecodes of ${objectid} into move interfaces`);
                let out_bcs = out + "/" + module_objectid + "/bcs";
                if (!fs.existsSync(out_bcs)) {
                    fs.mkdirpSync(out_bcs)
                }
                let out_bcs_file = `${out_bcs}/${objectid}.json`;
                fs.writeFileSync(out_bcs_file, JSON.stringify(moduleMap, null, 2));
            }
        }

        let toml_path = package_path + "/Move.toml";
        let toml_string = fs.readFileSync(toml_path).toString();

        toml_string = MoveGen.toml_edit_dependencies(toml_string, "dependencies-remote", module_objectid, "network", network);
        toml_string = MoveGen.toml_edit_dependencies(toml_string, "dependencies", module_objectid, "local", `./deps/${module_objectid}`);

        console.log(`Update Move.toml [dependencies-remote] and [dependencies] of ${module_objectid}`);

        fs.writeFileSync(toml_path, toml_string);

        console.log(`Clone move bytecodes of ${module_objectid} done!`);
    }
}

async function get_online_packages(
    network: Network, 
    objectid: string, 
    result_ids: string[], 
    package_path: string
) {
    let out = package_path + "/deps";

    const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
    let result = await suiClient.getObject({
        id: objectid,
        options: {
            showBcs: true,
        }
    })
    if (result_ids.indexOf(objectid) == -1) {
        result_ids.push(objectid);
    }

    if (result && result.data?.bcs) {
        let bcs: any = result.data.bcs;
        let linkageTable = bcs.linkageTable;

        let deps_modules: string[] = [];
        for (var package_id in linkageTable) {
            let upgraded_id = linkageTable[package_id].upgraded_id;
            if (upgraded_id == "0x0000000000000000000000000000000000000000000000000000000000000001") continue;
            if (upgraded_id == "0x0000000000000000000000000000000000000000000000000000000000000002") continue;

            if (deps_modules.indexOf(upgraded_id) == -1) {
                deps_modules.push(upgraded_id);
            }
            if (result_ids.indexOf(upgraded_id) == -1) {
                result_ids.push(upgraded_id);
                await get_online_packages(network, upgraded_id, result_ids, package_path);
            }
        }
        if (fs.existsSync(out)) {
            gen_move_toml(deps_modules, out, objectid)
        }
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
    dependencies["Sui"] = {
        local: `../sui/crates/sui-framework/packages/sui-framework`
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
            "published-at": objectId
        },
        dependencies: dependencies,
        addresses: {
            std: "0x1",
            sui: "0x2"
        },
        'dev-dependencies': {},
        'dev-addresses': {}
    };

    let move_toml_result = toml_stringify(contents);
    fs.writeFileSync(move_toml, move_toml_result);
}