import type { FlatConfigComposer } from "../../../node_modules/.pnpm/eslint-flat-config-utils@2.1.1/node_modules/eslint-flat-config-utils/dist/index.mjs"
import { defineFlatConfigs } from "../../../node_modules/.pnpm/@nuxt+eslint-config@1.9.0_@typescript-eslint+utils@8.41.0_eslint@9.34.0_jiti@2.5.1__typ_f928c9516af9ea2c1d839d0e082df257/node_modules/@nuxt/eslint-config/dist/flat.mjs"
import type { NuxtESLintConfigOptionsResolved } from "../../../node_modules/.pnpm/@nuxt+eslint-config@1.9.0_@typescript-eslint+utils@8.41.0_eslint@9.34.0_jiti@2.5.1__typ_f928c9516af9ea2c1d839d0e082df257/node_modules/@nuxt/eslint-config/dist/flat.mjs"

declare const configs: FlatConfigComposer
declare const options: NuxtESLintConfigOptionsResolved
declare const withNuxt: typeof defineFlatConfigs
export default withNuxt
export { withNuxt, defineFlatConfigs, configs, options }