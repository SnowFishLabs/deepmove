import { fromHex } from "@mysten/sui/utils";
import { StructClass } from "./sui_wasm";
import { bcs } from "@mysten/sui/bcs";

export function hexToNumArray(x: string) {
    return Array.from(fromHex(x))
}

export function has_value(v: any): boolean {
    if (Array.isArray(v)) {
        return v.length > 0;
    } else {
        return v ? true : false;
    }
}

export function has_arr(v: any): boolean {
    let flat_arr = v.flat(Infinity);
    return flat_arr.length > 0;
}

export function to_arr_value(v: any): any {
    if (Array.isArray(v)) {
        let flat_arr = v.flat(Infinity);
        for (var i = 0; i < flat_arr.length; i++) {
            if (typeof flat_arr != 'undefined') return flat_arr[i];
        }
    } else {
        return v;
    }
}

export function copy_arr_value(from_arr: any, to_arr: any) {
    if (from_arr && to_arr && Array.isArray(from_arr) && Array.isArray(to_arr)) {
        for (var i = 0; i < from_arr.length; i++) {
            to_arr[i] = from_arr[i];
        }
    }
}

export function into_arr_value(arr: any, dep = Infinity): any {
    let newArr: any[] = [];
    arr.forEach((ele: any) => {
        if (Array.isArray(ele) && dep > 0) {
            newArr.push(into_arr_value(ele, dep - 1));
        } else {
            newArr.push((ele as StructClass).into_value ? (ele as StructClass).into_value() : ele);
        }
    });
    return newArr;
}

export function get_arr_deps(arr: any) {
    if (!Array.isArray(arr)) {
        return 0;
    }

    let depth = 1;
    for (let i = 0; i < arr.length; i++) {
        const cur = arr[i];
        if (Array.isArray(cur)) {
            const curDepth = get_arr_deps(cur) + 1;
            depth = Math.max(depth, curDepth);
        }
    }

    return depth;
}

export function get_arr_bcs_vector(val: any, deps: number): any {
    if (deps > 0) {
        return bcs.vector(get_arr_bcs_vector(val, deps - 1))
    } else {
        return val.serialize_bcs()
    }
}

export function into_arr_bcs_vector(arr: any): any {
    let deps = get_arr_deps(arr);
    let val = to_arr_value(arr);
    return get_arr_bcs_vector(val, deps);
}