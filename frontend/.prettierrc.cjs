/** @type {import("prettier").Config} */
module.exports = {
    plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
    tabWidth: 4,
    singleQuote: true,
    printWidth: 120,
    singleAttributePerLine: true,
    importOrder: [
        '.css$',
        '^react$',
        '<BUILTIN_MODULES>',
        '<THIRD_PARTY_MODULES>',
        '^./(.*)$',
        '^../(.*)$',
        '^@/(.*)$',
        '^@radix(.*)$',
        '<TYPES>',
        '<TYPES>^(@)',
        '<TYPES>^[.]',
    ],
    importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
};
