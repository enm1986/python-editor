import type {UserConfig} from 'vite';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import vsixPlugin from '@codingame/monaco-vscode-rollup-vsix-plugin'

export default {
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                importMetaUrlPlugin, // Plugin para manejar import.meta.url
            ]
        }
    },
    plugins: [
        // Plugin para copiar archivos .vsix a la carpeta de salida
        vsixPlugin(),
        // viteStaticCopy({
        //     targets: [
        //         {
        //             src: 'public/extensions/jetbrains-darcula-theme-1.3.4.vsix', // Ruta al archivo .vsix
        //             dest: 'extensions' // Carpeta de destino en el build
        //         }
        //     ]
        // })
        // {
        //     name: 'load-vscode-css-as-string',
        //     enforce: 'pre',
        //     async resolveId(source, importer, options) {
        //         const resolved = (await this.resolve(source, importer, options))!
        //         if (
        //             resolved.id.match(
        //                 /node_modules\/(@codingame\/monaco-vscode|vscode|monaco-editor).*\.css$/
        //             )
        //         ) {
        //             return {
        //                 ...resolved,
        //                 id: resolved.id + '?inline'
        //             }
        //         }
        //         return undefined
        //     }
        // }
    ]
} satisfies UserConfig;