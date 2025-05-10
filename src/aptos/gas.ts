import { get_wasm } from './aptos_wasm';
import { TestContext } from 'vitest';
import fs from 'fs-extra';

let gasRecords: any = {};

export function beforeTest(ctx: TestContext & object) {
    if (ctx.task && ctx.task.suite) {
        let name = ctx.task.name;
        let suite = ctx.task.suite.name;

        get_wasm().reset_gas_cost();

        if (!gasRecords[suite]) {
            gasRecords[suite] = {};
        }

        gasRecords[suite][name] = 0;
    }
}

export function afterTest(ctx: TestContext & object) {
    if (ctx.task && ctx.task.suite) {
        let name = ctx.task.name;
        let suite = ctx.task.suite.name;

        gasRecords[suite][name] = get_wasm().get_gas_cost() + "";
    }
}

export function afterTestAll(ctx: any) {
    let dir = process.cwd() + "/.tests/gas_cost";
    if (!fs.existsSync(dir)) {
        fs.mkdirpSync(dir);
    }
    for (var suite in gasRecords) {
        let data = gasRecords[suite];
        let out = dir + `/${suite}.json`;
        fs.writeFileSync(out, JSON.stringify(data, null, 2));
    }

    let gas_report_dir = process.cwd() + "/.tests/gas_report";
    if (!fs.existsSync(gas_report_dir)) {
        fs.mkdirpSync(gas_report_dir);
    }
    let out = gas_report_dir + `/${ctx.id}.json`;
    let gas_report = get_wasm().get_gas_report();
    fs.writeFileSync(out, gas_report);
}

export function get_gas_cost(name: string, suite: string): number {
    let dir = process.cwd() + "/.tests/gas_cost";
    let out = dir + `/${suite}.json`;

    if (fs.existsSync(out)) {
        let data = fs.readFileSync(out).toString();
        gasRecords[suite] = JSON.parse(data);
    }
    if (gasRecords[suite]) {
        return parseInt(gasRecords[suite][name]) || 0;
    }
    return 0;
}

export function get_gas_report(id: string): string {
    let gas_report_dir = process.cwd() + "/.tests/gas_report";
    let out = gas_report_dir + `/${id}.json`;
    if (fs.existsSync(out)) {
        return fs.readFileSync(out).toString();
    } else {
        return ""
    }
}