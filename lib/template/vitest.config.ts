import { defineConfig } from 'vitest/config';
import GasReporter from './gas-reporter'

let isGasReport: boolean = false;
if (process.env.GAS_REPORT) {
	isGasReport = true;
}

export default defineConfig({
	test: {
		reporters: [new GasReporter({ isGasReport })]
	},
});
