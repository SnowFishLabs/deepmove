import { getTestName, getTests } from '@vitest/runner/utils'
import { get_gas_cost, get_gas_report } from '@deepmove/sui';
import { DefaultReporter } from 'vitest/reporters';
import type { RunnerTask } from 'vitest/node'
import { File } from '@vitest/runner';
import CliTable3 from "cli-table3";
import c from 'tinyrainbow'

export interface GasOptions {
  summary?: boolean;
  isTTY?: boolean;
  isGasReport?: boolean;
}

export default class GasReporter extends DefaultReporter {
  isGasReport: boolean
  constructor(options: GasOptions = {}) {
    super(options);

    this.isGasReport = options.isGasReport || false;
  }

  printTask(task: RunnerTask): void {
    if (this.isTTY) {
      return super.printTask(task)
    }

    // test title
    if (('filepath' in task)) {
      const tests = getTests(task)
      const failed = tests.filter(t => t.result?.state === 'fail')
      const skipped = tests.filter(t => t.mode === 'skip' || t.mode === 'todo')

      let state = c.dim(`${tests.length} test${tests.length > 1 ? 's' : ''}`)

      if (failed.length) {
        state += c.dim(' | ') + c.red(`${failed.length} failed`)
      }

      if (skipped.length) {
        state += c.dim(' | ') + c.yellow(`${skipped.length} skipped`)
      }

      state += this.getDurationPrefix2(task);

      this.log(` ${getStateSymbol(task)} ${task.name} ${state}`)
      return;
    }

    if (task.type !== 'test' || !task.result?.state || task.result?.state === 'run' || task.result?.state === 'queued') {
      return
    }

    let title = ` ${getStateSymbol(task)} `

    if (task.file.projectName) {
      title += formatProjectName(task.file.projectName)
    }

    title += getTestName(task, c.dim(' > '))

    if (this.ctx.config.logHeapUsage && task.result.heap != null) {
      title += c.magenta(` ${Math.floor(task.result.heap / 1024 / 1024)} MB heap used`)
    }

    if (task.result?.note) {
      title += c.dim(c.gray(` [${task.result.note}]`))
    }

    title += this.getDurationPrefix2(task)

    if (task.suite) {
      let name = task.name;
      let suite = task.suite.name;
      let gas_cost = get_gas_cost(name, suite);

      if (gas_cost) {
        if (gas_cost > 100) {
          title += c.yellow(` (gas ${gas_cost})`)
        } else {
          title += c.gray(` (gas ${gas_cost})`)
        }
      }
    }

    this.ctx.logger.log(`   ${title}`)

    if (task.result.state === 'fail') {
      task.result.errors?.forEach(error => this.log(c.red(`   ${F_RIGHT} ${error?.message}`)))
    }
  }

  private getDurationPrefix2(task: RunnerTask) {
    if (!task.result?.duration) {
      return ''
    }

    const color = task.result.duration > this.ctx.config.slowTestThreshold
      ? c.yellow
      : c.gray

    return color(` ${Math.round(task.result.duration)}${c.dim('ms')}`)
  }

  onFinished(files?: File[], errors?: unknown[]): void {
    super.onFinished(files, errors);
    if (this.isGasReport) {
      this.report_gas_summary(files);
    }
  }

  report_gas_summary(files?: File[]) {
    if (!files) return;

    let gas_results: any = {};
    for (var i = 0; i < files.length; i++) {
      let id = files[i].id;
      let gas_report = get_gas_report(id);
      if (gas_report) {
        let reports = JSON.parse(gas_report);
        for (var k in reports) {
          let d = k.split("::");
          let address = d[0];
          let module = d[1];
          let func = d[2];
          let costs = reports[k];

          let k2 = address + "::" + module;

          if (!gas_results[k2]) {
            gas_results[k2] = {};
          }

          gas_results[k2][func] = costs;
        }
      }
    }

    this.ctx.logger.log()
    this.ctx.logger.log("Gas Reports")
    this.ctx.logger.log()

    for (var k in gas_results) {
      let d = k.split("::");
      this.format_table(d[0], d[1], gas_results[k]);
    }
  }

  format_table(address: string, module: string, gas_result: any) {
    var table = new CliTable3({
      chars: {
        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
        , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
        , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
        , 'right': '║', 'right-mid': '╢', 'middle': '│'
      }
    });

    table.push(
      ['address', 'module', '', '', '', ''],
      [address, module, '', '', '', ''],
      ['function', 'min', 'avg', 'median', 'max', 'calls'],
    );

    for (var func in gas_result) {
      let costs: number[] = gas_result[func];
      costs.sort((a, b) => a - b);
      let min = Math.min.apply(null, costs);
      let avg = Math.floor(costs.reduce(function (x, y) { return x + y; }) / costs.length);
      let median = this.get_median(costs);
      let max = Math.max.apply(null, costs);
      let calls = costs.length;

      table.push([func, min, avg, median, max, calls]);
    }

    this.ctx.logger.log(table.toString())
  }

  get_median(arr: number[]): number {
    let middleIndex = Math.floor(arr.length / 2);
    if (arr.length % 2 === 0) {
      return (arr[middleIndex - 1] + arr[middleIndex]) / 2;
    } else {
      return arr[middleIndex];
    }
  }
}

export const F_RIGHT = '→'
export const F_DOWN = '↓'
export const F_UP = '↑'
export const F_DOWN_RIGHT = '↳'
export const F_POINTER = '❯'
export const F_DOT = '·'
export const F_CHECK = '✓'
export const F_CROSS = '×'
export const F_LONG_DASH = '⎯'
export const F_RIGHT_TRI = '▶'
export const F_TREE_NODE_MIDDLE = '├──'
export const F_TREE_NODE_END = '└──'

export const pointer: string = c.yellow(F_POINTER)
export const skipped: string = c.dim(c.gray(F_DOWN))
export const benchmarkPass: string = c.green(F_DOT)
export const testPass: string = c.green(F_CHECK)
export const taskFail: string = c.red(F_CROSS)
export const suiteFail: string = c.red(F_POINTER)
export const pending: string = c.gray('·')

function getStateSymbol(task: RunnerTask): string {
  if (task.mode === 'skip' || task.mode === 'todo') {
    return skipped
  }

  if (!task.result) {
    return pending
  }

  if (task.result.state === 'run' || task.result.state === 'queued') {
    if (task.type === 'suite') {
      return pointer
    }
  }

  if (task.result.state === 'pass') {
    return task.meta?.benchmark ? benchmarkPass : testPass
  }

  if (task.result.state === 'fail') {
    return task.type === 'suite' ? suiteFail : taskFail
  }

  return ' '
}

export function formatProjectName(name: string | undefined, suffix = ' '): string {
  if (!name) {
    return ''
  }
  if (!c.isColorSupported) {
    return `|${name}|${suffix}`
  }
  const index = name
    .split('')
    .reduce((acc, v, idx) => acc + v.charCodeAt(0) + idx, 0)

  const colors = [c.bgYellow, c.bgCyan, c.bgGreen, c.bgMagenta]

  return c.black(colors[index % colors.length](` ${name} `)) + suffix
}