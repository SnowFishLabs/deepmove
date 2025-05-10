import { Account, Ed25519PrivateKey, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import { stringify as yaml_stringify } from 'yaml'
import { readDirDeepSync } from 'read-dir-deep';
import { MoveGen } from './wasm/pkg/aptos_wasm';
import { Network } from './types';
import { parse } from 'smol-toml';
import shell from 'shelljs';
import fs from 'fs-extra';

export function upgrade_move_module(
    aptos_bin_path: string,
    package_path: string,
    network: Network,
    object_address: string
): string {
    set_aptos_yaml(package_path, network);

    let module_name = get_module_name(package_path)

    set_move_toml_addresses(module_name, package_path, "_");

    let cmd = `${aptos_bin_path} move upgrade-object --address-name ${module_name} --object-address ${object_address} --assume-yes`;
    console.log(cmd)
    let out = shell.exec(cmd).stdout;
    let new_object_address: string = "";
    let object_match = out.match(/object address\s*(\w+)/)

    if (object_match) {
        new_object_address = object_match[1];
    }

    return new_object_address;
}

export function publish_move_module(
    aptos_bin_path: string,
    package_path: string,
    network: Network
): string {
    set_aptos_yaml(package_path, network);

    let module_name = get_module_name(package_path)

    set_move_toml_addresses(module_name, package_path, "_");

    let cmd = `${aptos_bin_path} move deploy-object --address-name ${module_name} --assume-yes`;
    console.log(cmd)
    let out = shell.exec(cmd).stdout;
    let object_address: string = "";
    let object_match = out.match(/object address\s*(\w+)/)

    if (object_match) {
        object_address = object_match[1];
    }

    return object_address;
}

function set_aptos_yaml(package_path: string, network: Network) {
    let aptos_path = package_path + "/.aptos";

    if (!fs.existsSync(aptos_path)) {
        fs.mkdirpSync(aptos_path);
    }

    let yaml_path = aptos_path + "/config.yaml";

    let yaml_string = "";

    let network_string = network.substring(0, 1).toUpperCase() + network.substring(1);

    let private_key = process.env.APTOS_PRIVATE_KEY || "";
    let key = PrivateKey.formatPrivateKey(private_key, PrivateKeyVariants.Ed25519)
    const privateKey = new Ed25519PrivateKey(key);

    const aptos_account = Account.fromPrivateKey({ privateKey });
    let public_key = aptos_account.publicKey;
    let account_address = aptos_account.accountAddress;

    let content = {
        profiles: {
            default: {
                network: network_string,
                private_key: privateKey.toHexString(),
                public_key: public_key.toString(),
                account: account_address.toString(),
                rest_url: `https://fullnode.${network}.aptoslabs.com`,
                faucet_url: `https://faucet.${network}.aptoslabs.com`
            }
        }
    }

    yaml_string = yaml_stringify(content);

    fs.writeFileSync(yaml_path, yaml_string);
}

export function set_move_toml_addresses(module_name: string, package_path: string, address: string) {
    let toml_path = package_path + "/Move.toml";

    let toml_string = fs.readFileSync(toml_path).toString();
    let toml: any = parse(toml_string);

    let addresses = toml.addresses;

    if (addresses[module_name] != address) {
        addresses[module_name] = address;

        toml.addresses = addresses;

        let toml_string = fs.readFileSync(toml_path).toString();

        toml_string = MoveGen.toml_edit_addresses(toml_string, "addresses", module_name, address);

        fs.writeFileSync(toml_path, toml_string);
    }
}

export function get_module_name(package_path: string): string {
    let sources_path = package_path + "/sources";

    let files = readDirDeepSync(sources_path, { gitignore: false, ignore: [] });
    for (var i = 0; i < files.length; i++) {
        let move_code = fs.readFileSync(files[i]).toString();
        let module_match = move_code.match(/module\s*(\w+)\s*::/)
        if (module_match) {
            let module_name = module_match[1];
            return module_name;
        }
    }

    return "";
}