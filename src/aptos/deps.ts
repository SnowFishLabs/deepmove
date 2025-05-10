import { parse, stringify as toml_stringify } from 'smol-toml';
import { MoveGen } from './wasm/pkg/aptos_wasm';
import shell from 'shelljs';
import fs from 'fs-extra';
import path from 'path';

let STD_NAME = "aptosframework";

export async function deps_init(package_path: string) {
    let toml_path = package_path + "/Move.toml";

    if (!fs.existsSync(toml_path)) {
        console.error(`Unable to find package manifest at ${package_path}`)
        return;
    }

    let toml_string = fs.readFileSync(toml_path).toString();
    let toml: any = parse(toml_string);
    let deps_remotes = toml["dependencies-remote"];

    let deps_dir = package_path + "/deps";
    deps_dir = deps_dir.replaceAll("\\", "/");
    let deps_std_dir = package_path + `/deps/${STD_NAME}`;

    try {
        for (var dep in deps_remotes) {
            let dep_name = dep.toLowerCase();
            let dep_p = deps_remotes[dep];
            if (dep_p["git"] && dep_p["subdir"] && dep_p["rev"]) {
                let remote_git = dep_p["git"];
                let remote_subdir = dep_p["subdir"];
                let remote_rev = dep_p["rev"];
                let git_dir = `${deps_dir}/${dep_name}`;
                let deps_package_dir = `${git_dir}/${remote_subdir}`;
                let deps_toml_path = `${deps_package_dir}/Move.toml`;

                fs.removeSync(git_dir);
                fs.mkdirpSync(git_dir);

                shell.cd(git_dir);

                shell.exec('git init')

                shell.exec(`git remote add origin ${remote_git}`);

                shell.exec('git config core.sparsecheckout true')

                let sparse_checkout_path = git_dir + "/.git/info/sparse-checkout";

                if (dep_name == STD_NAME) {
                    let remote_subdir_final = remote_subdir;
                    let subdirs = remote_subdir.split("/");
                    if (subdirs.length) {
                        subdirs.pop();
                        remote_subdir_final = subdirs.join("/");
                    }

                    if (remote_subdir_final) {
                        fs.writeFileSync(sparse_checkout_path, remote_subdir_final);
                    }
                } else {
                    if (remote_subdir) {
                        fs.writeFileSync(sparse_checkout_path, `${remote_subdir}`);
                    }
                }

                shell.exec(`git pull origin ${remote_rev} --depth 1`);
                shell.exec(`git checkout -b ${remote_rev}`);

                if (dep_name != STD_NAME) {
                    let relative_std_dir = path.relative(deps_package_dir, deps_std_dir);
                    relative_std_dir = relative_std_dir.replaceAll("\\", "/");
                    update_deps_toml(deps_toml_path, `${relative_std_dir}/aptos-framework`);
                }

                toml_string = MoveGen.toml_edit_dependencies(toml_string, "dependencies", dep, "local", `./deps/${dep_name}/${remote_subdir}`);
            }
        }

        fs.writeFileSync(toml_path, toml_string);
    } catch (e) {
        console.error(e)
    } finally {
        shell.cd(package_path);
    }

    for (var dep in deps_remotes) {
        let dep_p = deps_remotes[dep];

        if (dep_p["network"]) {
            // let network = dep_p["network"];
            // let module_objectid = dep;
            // await clone_chain_move_module(get_move_gen(), network, module_objectid, package_path);
        }
    }
}

function update_deps_toml(deps_toml_path: string, deps_std: string) {
    if (fs.existsSync(deps_toml_path)) {
        let toml_string = fs.readFileSync(deps_toml_path).toString();
        let toml: any = parse(toml_string);

        let dependencies = toml["dependencies"];

        let has_std = false;
        for (var dep in dependencies) {
            let dep_name = dep.toLowerCase();

            if (dep_name == STD_NAME) {
                dependencies[dep] = {
                    local: deps_std
                }
                has_std = true;
            }
        }

        if (has_std) {
            delete dependencies["AptosStdlib"];
            delete dependencies["MoveStdlib"];
        }

        let result_toml_string = toml_stringify(toml);
        fs.writeFileSync(deps_toml_path, result_toml_string);
    }
}