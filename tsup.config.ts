import { defineConfig } from 'tsup'

export default defineConfig([{
  entry: ['./src/sui/sui_wasm.ts'],
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  outDir: 'wasm/sui-wasm/dist'
}, {
  entry: ['./src/aptos/aptos_wasm.ts'],
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  outDir: 'wasm/aptos-wasm/dist'
}
])