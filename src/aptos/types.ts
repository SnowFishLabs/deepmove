import { bcs, fromHex, toHex } from "@mysten/bcs";
import { get_wasm } from "./aptos_wasm";

export type Network = 'mainnet' | 'testnet' | 'devnet' | 'localnet';

export type SuiPublishResult = {
    digest: string,
    packageId: string,
    upgradeCapId: string,
    publisherIds: string[],
    created: { type: string; objectId: string; owner: string }[],
    mutated: { type: string; objectId: string; owner: string }[],
}

export type Primitive = boolean | string | number | bigint
export type TypeArgument = StructClass | Primitive

export type u64 = string | number | bigint;

export interface StructClass {
    $type: string

    from(v: any): any;
    serialize_bcs(): any
    return_bcs(): any
    into_value(): any
    serialize(arg: any): any
    get_bcs(): any
    get_value(): any
    from_bcs_t(arg: any): any
    from_bcs(arg: any): any
    from_bcs_vector(args: any): any
    from_bcs_vector_t(args: any): any
}

export class Signer implements StructClass {
    value: string;
    readonly $type: string = "signer";

    static $type() {
        return "signer";
    }

    constructor(value: string) {
        this.value = value;
    }

    from(v: Signer) {
        this.value = v.value;
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    into_value() {
        return this.value;
    }

    from_bcs_t(bytes: any) {
        return this.from_bcs(this.get_bcs().parse(bytes));
    }

    from_bcs_vector_t(bytes: any) {
        return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes));
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    from_bcs(arg: Signer) {
        return arg
    }

    from_bcs_vector(args: Signer[]) {
        return args
    }

    static get bcs() {
        let wasm = get_wasm() as any;
        if (wasm.serialized_signer) {
            return bcs.bytes(33).transform({
                input: (val: Signer) => wasm.serialized_signer(val.into_value()).Raw[0],
                output: (val: Uint8Array) => new Signer(toHex(val)),
            })
        } else {
            return bcs.bytes(32).transform({
                // To change the input type, you need to provide a type definition for the input
                input: (val: Signer) => fromHex(val.into_value()),
                output: (val) => new Signer(toHex(val)),
            })
        }
    }

    get_bcs() {
        return Signer.bcs
    }

    get_value() {
        return this.value;
    }
}

export class Address implements StructClass {
    value: string;
    readonly $type: string = "address";

    static $type() {
        return "address";
    }

    constructor(value: string) {
        this.value = value;
    }

    from(v: Address) {
        this.value = v.value;
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    into_value() {
        return this.value;
    }

    from_bcs_t(bytes: any) {
        return this.from_bcs(this.get_bcs().parse(bytes));
    }

    from_bcs_vector_t(bytes: any) {
        return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes));
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    from_bcs(arg: Address) {
        return arg
    }

    from_bcs_vector(args: Address[]) {
        return args
    }

    static get bcs() {
        return bcs.bytes(32).transform({
            // To change the input type, you need to provide a type definition for the input
            input: (val: Address) => fromHex(val.into_value()),
            output: (val) => new Address(toHex(val)),
        })
    }

    get_bcs() {
        return Address.bcs
    }

    get_value() {
        return this.value;
    }
}

export class Boolean implements StructClass {
    value: boolean;
    readonly $type: string = "bool";

    static $type() {
        return "bool";
    }

    constructor(value: boolean) {
        this.value = value;
    }

    from(v: Boolean) {
        this.value = v.value;
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    into_value() {
        return this.value;
    }

    from_bcs_t(bytes: any) {
        return this.from_bcs(this.get_bcs().parse(bytes));
    }

    from_bcs_vector_t(bytes: any) {
        return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes));
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    from_bcs(arg: Boolean) {
        return arg
    }

    from_bcs_vector(args: Boolean[]) {
        return args
    }

    static get bcs() {
        return bcs.bool().transform({
            input: (val: boolean) => val,
            output: (val: boolean) => new Boolean(val)
        })
    }

    get_bcs() {
        return Boolean.bcs
    }

    get_value() {
        return this.value;
    }
}

export class Ascii implements StructClass {
    value: string;
    readonly $type: string = "0x1::ascii::String";

    static $type() {
        return "0x1::ascii::String";
    }

    constructor(value: string) {
        this.value = value;
    }

    from(v: Ascii) {
        this.value = v.value;
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    into_value() {
        return this.value;
    }

    from_bcs_t(bytes: any) {
        return this.from_bcs(this.get_bcs().parse(bytes));
    }

    from_bcs_vector_t(bytes: any) {
        return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes));
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    from_bcs(arg: Ascii) {
        return arg
    }

    from_bcs_vector(args: Ascii[]) {
        return args
    }

    static get bcs() {
        return bcs.string().transform({
            input: (val: string) => val,
            output: (val: string) => new Ascii(val)
        })
    }

    get_bcs() {
        return Ascii.bcs
    }

    get_value() {
        return this.value;
    }
}

export class String implements StructClass {
    value: string;
    readonly $type: string = "0x1::string::String";

    static $type() {
        return "0x1::string::String";
    }

    constructor(value: string) {
        this.value = value;
    }

    into_uint8array(): Uint8Array {
        return new TextEncoder().encode(this.value)
    }

    into_u8array(): U8[] {
        let uint8 = new TextEncoder().encode(this.value)
        let r: U8[] = [];
        for (var i = 0; i < uint8.length; i++) {
            r.push(new U8(uint8[i]))
        }
        return r;
    }

    from(v: String) {
        this.value = v.value;
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    into_value() {
        return this.value;
    }

    from_bcs_t(bytes: any) {
        return this.from_bcs(this.get_bcs().parse(bytes));
    }

    from_bcs_vector_t(bytes: any) {
        return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes));
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    from_bcs(arg: String) {
        return arg
    }

    from_bcs_vector(args: String[]) {
        return args
    }

    static get bcs() {
        return bcs.string().transform({
            input: (val: string) => val,
            output: (val: string) => new String(val)
        })
    }

    get_bcs() {
        return String.bcs
    }

    get_value() {
        return this.value;
    }
}

export class U8 implements StructClass {
    value: number;
    readonly $type: string = "u8";

    static $type() {
        return "u8";
    }

    constructor(value: number) {
        this.value = value;
    }

    from(v: U8) {
        this.value = v.value;
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    into_value() {
        return this.value;
    }

    from_bcs_t(bytes: any) {
        return this.from_bcs(this.get_bcs().parse(bytes));
    }

    from_bcs_vector_t(bytes: any) {
        return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes));
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    from_bcs(arg: U8) {
        return arg
    }

    from_bcs_vector(args: U8[]) {
        return args;
    }

    static get bcs() {
        return bcs.u8().transform({
            input: (val: number) => val,
            output: (val: number) => new U8(val),
        })
    }

    get_bcs() {
        return U8.bcs
    }

    get_value() {
        return this.value;
    }
}

export class U16 implements StructClass {
    value: number;
    readonly $type: string = "u16";

    static $type() {
        return "u16";
    }

    constructor(value: number) {
        this.value = value;
    }

    from(v: U16) {
        this.value = v.value;
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    into_value() {
        return this.value;
    }

    from_bcs_t(bytes: any) {
        return this.from_bcs(this.get_bcs().parse(bytes));
    }

    from_bcs_vector_t(bytes: any) {
        return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes));
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    from_bcs(arg: any) {
        return arg
    }

    from_bcs_vector(args: U16[]) {
        return args;
    }

    static get bcs() {
        return bcs.u16().transform({
            input: (val: number) => val,
            output: (val: number) => new U16(val)
        })
    }

    get_bcs() {
        return U16.bcs
    }

    get_value() {
        return this.value;
    }
}

export class U32 implements StructClass {
    value: number;
    readonly $type: string = "u32";

    static $type() {
        return "u32";
    }

    constructor(value: number) {
        this.value = value;
    }

    from(v: U32) {
        this.value = v.value;
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    into_value() {
        return this.value;
    }

    from_bcs_t(bytes: any) {
        return this.from_bcs(this.get_bcs().parse(bytes));
    }

    from_bcs_vector_t(bytes: any) {
        return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes));
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    from_bcs(arg: U32) {
        return arg
    }

    from_bcs_vector(args: U32[]) {
        return args
    }

    static get bcs() {
        return bcs.u32().transform({
            input: (val: number) => val,
            output: (val: number) => new U32(val)
        })
    }

    get_bcs() {
        return U32.bcs
    }

    get_value() {
        return this.value;
    }
}

export class U64 implements StructClass {
    value: string | number | bigint;
    readonly $type: string = "u64";

    static $type() {
        return "u64";
    }

    constructor(value: string | number | bigint) {
        this.value = value;
    }

    from(v: U64) {
        this.value = v.value;
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    into_value() {
        return this.value;
    }

    from_bcs_t(bytes: any) {
        return this.from_bcs(this.get_bcs().parse(bytes));
    }

    from_bcs_vector_t(bytes: any) {
        return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes));
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    from_bcs(arg: U64) {
        return arg
    }

    from_bcs_vector(args: U64[]) {
        return args
    }

    static get bcs() {
        return bcs.u64().transform({
            input: (val: string | number | bigint) => val,
            output: (val: string | number | bigint) => {
                if (!isNaN(Number(val))) {
                    return new U64(Number(val))
                }

                return new U64(val);
            }
        })
    }

    get_bcs() {
        return U64.bcs
    }

    get_value() {
        return this.value;
    }

    static v1_bcs(v: U64[]) {
        return v[0]
    }

    static v2_bcs(v: U64[][]) {
        return v[0][0]
    }
}

export class U128 implements StructClass {
    value: string | number | bigint;
    readonly $type: string = "u128";

    static $type() {
        return "u128";
    }

    constructor(value: string | number | bigint) {
        this.value = value;
    }

    from(v: U128) {
        this.value = v.value;
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    into_value() {
        return this.value;
    }

    from_bcs_t(bytes: any) {
        return this.from_bcs(this.get_bcs().parse(bytes));
    }

    from_bcs_vector_t(bytes: any) {
        return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes));
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    from_bcs(arg: U128) {
        return arg
    }

    from_bcs_vector(args: U128[]) {
        return args
    }

    static get bcs() {
        return bcs.u128().transform({
            input: (val: string | number | bigint) => val,
            output: (val: string | number | bigint) => {
                if (!isNaN(Number(val))) {
                    return new U128(Number(val))
                }

                return new U128(val)
            }
        })
    }

    get_bcs() {
        return U128.bcs
    }

    get_value() {
        return this.value;
    }
}

export class U256 implements StructClass {
    value: string | number | bigint;
    readonly $type: string = "u256";

    static $type() {
        return "u256";
    }

    constructor(value: string | number | bigint) {
        this.value = value;
    }

    from(v: U256) {
        this.value = v.value;
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    into_value() {
        return this.value;
    }

    from_bcs_t(bytes: any) {
        return this.from_bcs(this.get_bcs().parse(bytes));
    }

    from_bcs_vector_t(bytes: any) {
        return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes));
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    from_bcs(arg: U256) {
        return arg
    }

    from_bcs_vector(args: U256[]) {
        return args
    }

    static get bcs() {
        return bcs.u256().transform({
            input: (val: string | number | bigint) => val,
            output: (val: string | number | bigint) => {
                if (!isNaN(Number(val))) {
                    return new U256(Number(val))
                }

                return new U256(val)
            }
        })
    }

    get_bcs() {
        return U256.bcs
    }

    get_value() {
        return this.value;
    }
}