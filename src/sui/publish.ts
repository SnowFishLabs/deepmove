import { getFullnodeUrl, SuiClient, SuiObjectChange, SuiTransactionBlockResponse } from '@mysten/sui/client';
import { Transaction, UpgradePolicy } from '@mysten/sui/transactions';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Network, SuiPublishResult } from './types';
import { bcs } from '@mysten/sui/bcs';
import shell from 'shelljs';
import fs from 'fs-extra';

export async function upgrade_move_module(
    sui_bin_path: string, 
    package_path: string, 
    network: Network, 
    old_package_id: string, 
    upgrade_cap_id: string
): Promise<SuiPublishResult> {
    shell.cd(package_path);

    let move_lock = package_path + "/Move.lock";
    fs.removeSync(move_lock)

    let buildCommandOutput = shell.exec(`${sui_bin_path} move build --dump-bytecode-as-base64`).stdout;
    const { modules, dependencies, digest } = JSON.parse(buildCommandOutput);

    const client = new SuiClient({ url: getFullnodeUrl(network) });
    const tx = new Transaction();
    const pair = decodeSuiPrivateKey(process.env.SUI_PRIVATE_KEY || "");
    const keypair = Ed25519Keypair.fromSecretKey(pair.secretKey);
    let publish_to: string = keypair.getPublicKey().toSuiAddress();

    const ticket = tx.moveCall({
        target: `0x2::package::authorize_upgrade`,
        arguments: [
            tx.object(upgrade_cap_id),
            tx.pure.u8(UpgradePolicy.COMPATIBLE),
            tx.pure(bcs.byteVector().serialize(new Uint8Array(digest)).toBytes()),
        ],
    });

    // Upgrade the package with the ticket, get the receipt
    const receipt = tx.upgrade({
        modules,
        dependencies,
        package: old_package_id,
        ticket,
    });

    // Commit the upgrade with the receipt
    tx.moveCall({
        target: `0x2::package::commit_upgrade`,
        arguments: [tx.object(upgrade_cap_id), receipt],
    });

    // set the sender
    tx.setSender(publish_to);

    const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
    });

    const publishTxn = await client.waitForTransaction({
        digest: result.digest,
        options: {
            showEffects: true,
            showObjectChanges: true
        },
    });

    return parsePublishTxn(publishTxn);
}

export async function publish_move_module(
    sui_bin_path: string, 
    package_path: string, 
    network: Network
): Promise<SuiPublishResult> {
    shell.cd(package_path);

    let move_lock = package_path + "/Move.lock";
    fs.removeSync(move_lock)

    let buildCommandOutput = shell.exec(`${sui_bin_path} move build --dump-bytecode-as-base64`).stdout;
    const { modules, dependencies } = JSON.parse(buildCommandOutput);

    return await publish(network, modules, dependencies);
}

async function publish(
    network: Network, 
    modules: string[], 
    dependencies: string[]
): Promise<SuiPublishResult> {
    const client = new SuiClient({ url: getFullnodeUrl(network) });
    const tx = new Transaction();
    const pair = decodeSuiPrivateKey(process.env.SUI_PRIVATE_KEY || "");
    const keypair = Ed25519Keypair.fromSecretKey(pair.secretKey);
    let publish_to: string = keypair.getPublicKey().toSuiAddress();

    const upgradeCap = tx.publish({ modules, dependencies })
    tx.transferObjects([upgradeCap], tx.pure.address(publish_to));

    const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
    });

    const publishTxn = await client.waitForTransaction({
        digest: result.digest,
        options: {
            showEffects: true,
            showObjectChanges: true
        },
    });

    return parsePublishTxn(publishTxn);
}

const parsePublishTxn = ({ objectChanges, digest }: SuiTransactionBlockResponse) => {
    if (!objectChanges) throw new Error("objectChanges is null or undefined");

    const parseRes = {
        digest: digest,
        packageId: "",
        upgradeCapId: "",
        publisherIds: [] as string[],
        created: [] as { type: string; objectId: string; owner: string }[],
        mutated: [] as { type: string; objectId: string; owner: string }[],
    };
    if (objectChanges) {
        for (const change of objectChanges) {
            if ((change.type === "created" || change.type === "mutated") && change.objectType.endsWith("package::UpgradeCap")) {
                parseRes.upgradeCapId = change.objectId;
            } else if (change.type === "created" && change.objectType.endsWith("package::Publisher")) {
                parseRes.publisherIds.push(change.objectId);
            } else if (change.type === "published") {
                parseRes.packageId = change.packageId;
            } else if (change.type === "created") {
                const owner = parseOwnerFromObjectChange(change);
                parseRes.created.push({ type: change.objectType, objectId: change.objectId, owner });
            } else if (change.type === "mutated") {
                const owner = parseOwnerFromObjectChange(change);
                parseRes.mutated.push({ type: change.objectType, objectId: change.objectId, owner });
            }
        }
    }
    return parseRes;
};


const parseOwnerFromObjectChange = (change: SuiObjectChange & ({ type: "created" } | { type: "mutated" })) => {
    const sender = change?.sender;
    if (typeof change.owner === "object" && "AddressOwner" in change.owner) {
        return change.owner.AddressOwner === sender ? `(you) ${sender}` : change.owner.AddressOwner;
    } else if (typeof change.owner === "object" && "Shared" in change.owner) {
        return "Shared";
    } else if (typeof change.owner === "object" && "Immutable" in change.owner) {
        return "Immutable";
    } else {
        return "";
    }
};