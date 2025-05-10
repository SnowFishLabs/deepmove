import { Network } from "./types";

export type Config = {
    network: Network,
    packages: Record<string, string>,
    objects: Record<string, string>
};

let wasm_config: Config | null = null;

export function get_package_address(package_name: string): string {
    if (wasm_config && wasm_config.packages && wasm_config.packages[package_name]) {
        return wasm_config.packages[package_name]
    }
    return ""
}

export function get_object_address(object_key: string): string {
    if (wasm_config && wasm_config.objects && wasm_config.objects[object_key]) {
        return wasm_config.objects[object_key]
    }
    return ""
}

export function get_config(): Config | null {
    return wasm_config;
}

export function set_config(config: Config) {
    if (config != undefined) {
        wasm_config = config;
    }
}