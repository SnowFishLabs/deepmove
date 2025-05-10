import * as _mysten_sui_client from '@mysten/sui/client';
import { SuiClient } from '@mysten/sui/client';
import { TestContext } from 'vitest';
import * as _mysten_bcs from '@mysten/bcs';
import { TransactionArgument } from '@mysten/sui/transactions';

/* tslint:disable */
/* eslint-disable */
type CallArgument = { Raw: [number[], string] };

declare class MoveCodeHelper {
  private constructor();
  free(): void;
  static new(): MoveCodeHelper;
  register_module(module: string, binary: Uint8Array): void;
  build_bytecode_model(): void;
  get_package_info(): string;
  get_modules(): string;
  get_functions(module_name: string): string;
  get_structs(module_name: string): string;
  get_dependencies(module_name: string): string;
  get_friends(module_name: string): string;
  get_named_constants(module_name: string): string;
  get_objects(module_name: string): string;
  get_shared_objects(module_name: string, transitive: boolean): string;
  get_transferred_objects(module_name: string, transitive: boolean): string;
  get_frozen_objects(module_name: string, transitive: boolean): string;
  get_events(module_name: string, transitive: boolean): string;
  disassemble(module_name: string): string;
  disassemble_function(module_name: string, func_name: string): string;
  disassemble_function_body(module_name: string, func_name: string): string;
  disassemble_struct(module_name: string, struct_name: string): string;
  move_disassemble(module_name: string): string;
  get_otw_structs(module_name: string): string;
  get_tx_context_functions(module_name: string): string;
  get_entry_functions(module_name: string): string;
  get_private_functions(module_name: string): string;
  get_friend_functions(module_name: string): string;
  get_public_functions(module_name: string): string;
  get_phantom_structs(module_name: string): string;
  unused_private_functions(module_name: string): string;
  unused_constant(module_name: string): string;
  unchecked_return(module_name: string): string;
}
declare class MoveGen {
  private constructor();
  free(): void;
  static new(): MoveGen;
  static toml_edit_dependencies(toml_string: string, key0: string, key1: string, key2: string, value1: string): string;
  register_module(module: string, binary: Uint8Array): void;
  build_bytecode_model(): void;
  run_move_gen(out: string): void;
  run_move_tx_gen(out: string): void;
  run_module_gen(out: string, package_id: string, binary: Uint8Array): void;
}
declare class SuiWasm {
  private constructor();
  free(): void;
  new_bytes(bytes: Uint8Array, type_tag: string): CallArgument;
  static new_wasm(): SuiWasm;
  set_tracer_enable(v: boolean, trace_location: string): void;
  reset_gas_cost(): void;
  get_gas_cost(): bigint;
  get_gas_report(): string;
  refresh_vm(): void;
  publish_module(binary: Uint8Array): void;
  setup_storage(): void;
  add_source_map(binary: Uint8Array): void;
  add_source_map_json(json: string): void;
  add_source_code(code: string): void;
  call_return_bcs(account_address: string, module: string, _function: string, ty_args: string[], args: CallArgument[]): CallArgument[];
}

declare function beforeTest(ctx: TestContext & object): void;
declare function afterTest(ctx: TestContext & object): void;
declare function afterTestAll(ctx: any): void;
declare function get_gas_cost(name: string, suite: string): number;
declare function get_gas_report(id: string): string;

declare function gen_move_ptb_scripts(move_gen: MoveGen, package_path: string): void;
declare function gen_move_test_scripts(move_gen: MoveGen, package_path: string): void;

declare function deps_init(package_path: string): Promise<void>;

declare function hexToNumArray(x: string): number[];
declare function has_value(v: any): boolean;
declare function has_arr(v: any): boolean;
declare function to_arr_value(v: any): any;
declare function copy_arr_value(from_arr: any, to_arr: any): void;
declare function into_arr_value(arr: any, dep?: number): any;
declare function get_arr_deps(arr: any): number;
declare function get_arr_bcs_vector(val: any, deps: number): any;
declare function into_arr_bcs_vector(arr: any): any;

type Network = 'mainnet' | 'testnet' | 'devnet' | 'localnet';
type SuiPublishResult = {
    digest: string;
    packageId: string;
    upgradeCapId: string;
    publisherIds: string[];
    created: {
        type: string;
        objectId: string;
        owner: string;
    }[];
    mutated: {
        type: string;
        objectId: string;
        owner: string;
    }[];
};
type Primitive = boolean | string | number | bigint;
type TypeArgument = StructClass | Primitive;
type u64 = string | number | bigint;
declare function isTransactionArgument(arg: any): arg is TransactionArgument;
interface StructClass {
    $type: string;
    from(v: any): any;
    serialize_bcs(): any;
    return_bcs(): any;
    into_value(): any;
    serialize(arg: any): any;
    get_bcs(): any;
    get_value(): any;
    from_bcs_t(arg: any): any;
    from_bcs(arg: any): any;
    from_bcs_vector(args: any): any;
    from_bcs_vector_t(args: any): any;
}
declare class Address implements StructClass {
    value: string;
    readonly $type: string;
    static $type(): string;
    constructor(value: string);
    from(v: Address): void;
    serialize_bcs(): _mysten_bcs.BcsType<Address, Address>;
    return_bcs(): _mysten_bcs.BcsType<Address, Address>;
    into_value(): string;
    from_bcs_t(bytes: any): Address;
    from_bcs_vector_t(bytes: any): Address[];
    serialize(arg: any): _mysten_bcs.SerializedBcs<Address, Address>;
    from_bcs(arg: Address): Address;
    from_bcs_vector(args: Address[]): Address[];
    static get bcs(): _mysten_bcs.BcsType<Address, Address>;
    get_bcs(): _mysten_bcs.BcsType<Address, Address>;
    get_value(): string;
}
declare class Boolean implements StructClass {
    value: boolean;
    readonly $type: string;
    static $type(): string;
    constructor(value: boolean);
    from(v: Boolean): void;
    serialize_bcs(): _mysten_bcs.BcsType<Boolean, boolean>;
    return_bcs(): _mysten_bcs.BcsType<Boolean, boolean>;
    into_value(): boolean;
    from_bcs_t(bytes: any): Boolean;
    from_bcs_vector_t(bytes: any): Boolean[];
    serialize(arg: any): _mysten_bcs.SerializedBcs<Boolean, boolean>;
    from_bcs(arg: Boolean): Boolean;
    from_bcs_vector(args: Boolean[]): Boolean[];
    static get bcs(): _mysten_bcs.BcsType<Boolean, boolean>;
    get_bcs(): _mysten_bcs.BcsType<Boolean, boolean>;
    get_value(): boolean;
}
declare class Ascii implements StructClass {
    value: string;
    readonly $type: string;
    static $type(): string;
    constructor(value: string);
    from(v: Ascii): void;
    serialize_bcs(): _mysten_bcs.BcsType<Ascii, string>;
    return_bcs(): _mysten_bcs.BcsType<Ascii, string>;
    into_value(): string;
    from_bcs_t(bytes: any): Ascii;
    from_bcs_vector_t(bytes: any): Ascii[];
    serialize(arg: any): _mysten_bcs.SerializedBcs<Ascii, string>;
    from_bcs(arg: Ascii): Ascii;
    from_bcs_vector(args: Ascii[]): Ascii[];
    static get bcs(): _mysten_bcs.BcsType<Ascii, string>;
    get_bcs(): _mysten_bcs.BcsType<Ascii, string>;
    get_value(): string;
}
declare class String implements StructClass {
    value: string;
    readonly $type: string;
    static $type(): string;
    constructor(value: string);
    into_uint8array(): Uint8Array;
    into_u8array(): U8[];
    from(v: String): void;
    serialize_bcs(): _mysten_bcs.BcsType<String, string>;
    return_bcs(): _mysten_bcs.BcsType<String, string>;
    into_value(): string;
    from_bcs_t(bytes: any): String;
    from_bcs_vector_t(bytes: any): String[];
    serialize(arg: any): _mysten_bcs.SerializedBcs<String, string>;
    from_bcs(arg: String): String;
    from_bcs_vector(args: String[]): String[];
    static get bcs(): _mysten_bcs.BcsType<String, string>;
    get_bcs(): _mysten_bcs.BcsType<String, string>;
    get_value(): string;
}
declare class U8 implements StructClass {
    value: number;
    readonly $type: string;
    static $type(): string;
    constructor(value: number);
    from(v: U8): void;
    serialize_bcs(): _mysten_bcs.BcsType<U8, number>;
    return_bcs(): _mysten_bcs.BcsType<U8, number>;
    into_value(): number;
    from_bcs_t(bytes: any): U8;
    from_bcs_vector_t(bytes: any): U8[];
    serialize(arg: any): _mysten_bcs.SerializedBcs<U8, number>;
    from_bcs(arg: U8): U8;
    from_bcs_vector(args: U8[]): U8[];
    static get bcs(): _mysten_bcs.BcsType<U8, number>;
    get_bcs(): _mysten_bcs.BcsType<U8, number>;
    get_value(): number;
}
declare class U16 implements StructClass {
    value: number;
    readonly $type: string;
    static $type(): string;
    constructor(value: number);
    from(v: U16): void;
    serialize_bcs(): _mysten_bcs.BcsType<U16, number>;
    return_bcs(): _mysten_bcs.BcsType<U16, number>;
    into_value(): number;
    from_bcs_t(bytes: any): any;
    from_bcs_vector_t(bytes: any): U16[];
    serialize(arg: any): _mysten_bcs.SerializedBcs<U16, number>;
    from_bcs(arg: any): any;
    from_bcs_vector(args: U16[]): U16[];
    static get bcs(): _mysten_bcs.BcsType<U16, number>;
    get_bcs(): _mysten_bcs.BcsType<U16, number>;
    get_value(): number;
}
declare class U32 implements StructClass {
    value: number;
    readonly $type: string;
    static $type(): string;
    constructor(value: number);
    from(v: U32): void;
    serialize_bcs(): _mysten_bcs.BcsType<U32, number>;
    return_bcs(): _mysten_bcs.BcsType<U32, number>;
    into_value(): number;
    from_bcs_t(bytes: any): U32;
    from_bcs_vector_t(bytes: any): U32[];
    serialize(arg: any): _mysten_bcs.SerializedBcs<U32, number>;
    from_bcs(arg: U32): U32;
    from_bcs_vector(args: U32[]): U32[];
    static get bcs(): _mysten_bcs.BcsType<U32, number>;
    get_bcs(): _mysten_bcs.BcsType<U32, number>;
    get_value(): number;
}
declare class U64 implements StructClass {
    value: string | number | bigint;
    readonly $type: string;
    static $type(): string;
    constructor(value: string | number | bigint);
    from(v: U64): void;
    serialize_bcs(): _mysten_bcs.BcsType<U64, string | number | bigint>;
    return_bcs(): _mysten_bcs.BcsType<U64, string | number | bigint>;
    into_value(): string | number | bigint;
    from_bcs_t(bytes: any): U64;
    from_bcs_vector_t(bytes: any): U64[];
    serialize(arg: any): _mysten_bcs.SerializedBcs<U64, string | number | bigint>;
    from_bcs(arg: U64): U64;
    from_bcs_vector(args: U64[]): U64[];
    static get bcs(): _mysten_bcs.BcsType<U64, string | number | bigint>;
    get_bcs(): _mysten_bcs.BcsType<U64, string | number | bigint>;
    get_value(): string | number | bigint;
    static v1_bcs(v: U64[]): U64;
    static v2_bcs(v: U64[][]): U64;
}
declare class U128 implements StructClass {
    value: string | number | bigint;
    readonly $type: string;
    static $type(): string;
    constructor(value: string | number | bigint);
    from(v: U128): void;
    serialize_bcs(): _mysten_bcs.BcsType<U128, string | number | bigint>;
    return_bcs(): _mysten_bcs.BcsType<U128, string | number | bigint>;
    into_value(): string | number | bigint;
    from_bcs_t(bytes: any): U128;
    from_bcs_vector_t(bytes: any): U128[];
    serialize(arg: any): _mysten_bcs.SerializedBcs<U128, string | number | bigint>;
    from_bcs(arg: U128): U128;
    from_bcs_vector(args: U128[]): U128[];
    static get bcs(): _mysten_bcs.BcsType<U128, string | number | bigint>;
    get_bcs(): _mysten_bcs.BcsType<U128, string | number | bigint>;
    get_value(): string | number | bigint;
}
declare class U256 implements StructClass {
    value: string | number | bigint;
    readonly $type: string;
    static $type(): string;
    constructor(value: string | number | bigint);
    from(v: U256): void;
    serialize_bcs(): _mysten_bcs.BcsType<U256, string | number | bigint>;
    return_bcs(): _mysten_bcs.BcsType<U256, string | number | bigint>;
    into_value(): string | number | bigint;
    from_bcs_t(bytes: any): U256;
    from_bcs_vector_t(bytes: any): U256[];
    serialize(arg: any): _mysten_bcs.SerializedBcs<U256, string | number | bigint>;
    from_bcs(arg: U256): U256;
    from_bcs_vector(args: U256[]): U256[];
    static get bcs(): _mysten_bcs.BcsType<U256, string | number | bigint>;
    get_bcs(): _mysten_bcs.BcsType<U256, string | number | bigint>;
    get_value(): string | number | bigint;
}

declare function clone_chain_move_module(move_gen: MoveGen, network: Network, module_objectid: string, package_path: string): Promise<void>;

declare function debug_move_function(wasm_runtime: any, code_helper: any, package_path: string, module_name: string, func_name: string): void;

declare function setup(runtime: any, package_path: string): void;
declare function setup_move(runtime: any, package_path: string, include_deps: boolean): void;
declare function setup_move_gen(package_path: string, include_deps: boolean): void;
declare function setup_move_code_helper(package_path: string, include_deps: boolean): void;

type Config = {
    network: Network;
    packages: Record<string, string>;
    objects: Record<string, string>;
};
declare function get_package_address(package_name: string): string;
declare function get_object_address(object_key: string): string;
declare function get_config(): Config | null;
declare function set_config(config: Config): void;

declare function upgrade_move_module(sui_bin_path: string, package_path: string, network: Network, old_package_id: string, upgrade_cap_id: string): Promise<SuiPublishResult>;
declare function publish_move_module(sui_bin_path: string, package_path: string, network: Network): Promise<SuiPublishResult>;

declare function refresh_vm(): void;
declare function new_wasm(): SuiWasm;
declare function new_move_code_helper(): MoveCodeHelper;
declare function new_move_gen(): MoveGen;
declare function get_wasm(): SuiWasm;
declare function get_move_gen(): MoveGen;
declare function get_move_code_helper(): MoveCodeHelper;
declare function new_sui_client(): SuiClient | null;
declare function sign_execute_transaction(client: SuiClient, tx: any): Promise<_mysten_sui_client.SuiTransactionBlockResponse>;

export { Address, Ascii, Boolean, type Config, type Network, type Primitive, String, type StructClass, type SuiPublishResult, type TypeArgument, U128, U16, U256, U32, U64, U8, afterTest, afterTestAll, beforeTest, clone_chain_move_module, copy_arr_value, debug_move_function, deps_init, gen_move_ptb_scripts, gen_move_test_scripts, get_arr_bcs_vector, get_arr_deps, get_config, get_gas_cost, get_gas_report, get_move_code_helper, get_move_gen, get_object_address, get_package_address, get_wasm, has_arr, has_value, hexToNumArray, into_arr_bcs_vector, into_arr_value, isTransactionArgument, new_move_code_helper, new_move_gen, new_sui_client, new_wasm, publish_move_module, refresh_vm, set_config, setup, setup_move, setup_move_code_helper, setup_move_gen, sign_execute_transaction, to_arr_value, type u64, upgrade_move_module };
