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
    ]
} satisfies UserConfig;