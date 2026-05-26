import { readFileSync, writeFileSync } from 'node:fs';

import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

import vuetify from 'vite-plugin-vuetify';

function sanitizeCssCode(code) {
    let sanitized = code
        .replace(/\s*-webkit-text-size-adjust:\s*[^;]+;/g, '')
        .replace(/\s*-moz-osx-font-smoothing:\s*[^;]+;/g, '')
        .replace(/\s*forced-color-adjust:\s*preserve-parent-color\s*;?/g, '')
        .replace(/\s*filter:\s*Flip[HV]\s*;/g, '')
        .replace(/\s*-ms-filter:\s*"Flip[HV]"\s*;?/g, '')
        .replace(/([;{]\s*)(?:gap|row-gap|column-gap):\s*auto\s*(!important)?\s*;?/g, '$1');

    sanitized = sanitized
        .replace(/(^|[}\n])[^{}]*::-(?:moz-focus-inner|ms-expand|ms-value|ms-clear|webkit-scrollbar(?:-[\w-]+)?)[^{]*\{[^{}]*\}/g, '$1')
        .replace(/,\s*[^,{}]*::-(?:moz-focus-inner|ms-expand|ms-value|ms-clear|webkit-scrollbar(?:-[\w-]+)?)/g, '')
        .replace(/(^|[}\n])[^,{}]*::-(?:moz-focus-inner|ms-expand|ms-value|ms-clear|webkit-scrollbar(?:-[\w-]+)?),\s*/g, '$1');

    return sanitized;
}

function sanitizeImportedCss() {
    const cssRequestPattern = /(\.css|vue&type=style)/;
    const mdiCssPattern = /@mdi\/font\/css\/materialdesignicons\.css/;
    const vuetifyStylesPattern = /vuetify\/lib\/styles\/main\.css/;

    return {
        name: 'sanitize-imported-css',

        enforce: 'post',

        load(id) {
            const filePath = id.split('?')[0];

            if (mdiCssPattern.test(id)) {
                return sanitizeCssCode(readFileSync(filePath, 'utf8'));
            }

            if (vuetifyStylesPattern.test(filePath)) {
                return sanitizeCssCode(readFileSync(filePath, 'utf8'));
            }

            return null;
        },

        transform(code, id) {
            if (!cssRequestPattern.test(id) || mdiCssPattern.test(id) || vuetifyStylesPattern.test(id)) {
                return null;
            }

            const sanitized = sanitizeCssCode(code);

            if (sanitized === code) {
                return null;
            }

            return {
                code: sanitized,
                map: null
            };
        },

        generateBundle(_, bundle) {
            for (const asset of Object.values(bundle)) {
                if (asset.type !== 'asset' || !asset.fileName.endsWith('.css')) {
                    continue;
                }

                asset.source = sanitizeCssCode(String(asset.source));
            }
        },

        writeBundle(options, bundle) {
            for (const asset of Object.values(bundle)) {
                if (asset.type !== 'asset' || !asset.fileName.endsWith('.css')) {
                    continue;
                }

                const filePath = `${options.dir}/${asset.fileName}`;
                writeFileSync(filePath, sanitizeCssCode(readFileSync(filePath, 'utf8')));
            }
        }
    };
}

export default defineConfig({
    plugins: [
        vue(),

        vuetify({
            autoImport: true
        }),

        sanitizeImportedCss()
    ]
});
