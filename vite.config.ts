import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import vsixPlugin from '@codingame/monaco-vscode-rollup-vsix-plugin';

export default defineConfig({
    // Configuración del servidor de desarrollo
    server: {
        port: 3000,
        open: true,
        cors: true,
    },

    // Configuración del build
    build: {
        target: 'esnext',
        outDir: 'dist',
        sourcemap: true,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    'monaco-editor': ['monaco-editor'],
                    'vscode-api': ['@codingame/monaco-vscode-api'],
                    'language-client': ['monaco-languageclient', 'vscode-ws-jsonrpc'],
                }
            }
        }
    },

    // Optimización de dependencias
    optimizeDeps: {
        include: [
            'monaco-editor',
            '@codingame/monaco-vscode-api',
            'monaco-languageclient',
            'vscode-ws-jsonrpc'
        ],
        esbuildOptions: {
            plugins: [
                importMetaUrlPlugin,
            ],
        }
    },

    // Plugins
    plugins: [
        vsixPlugin(), // Este plugin maneja automáticamente los archivos .vsix
    ],

    // Configuración de resolución
    resolve: {
        alias: {
            '@': '/src',
            '@extensions': '/src/extensions',
            '@services': '/src/services',
            '@config': '/src/config'
        }
    },

    // Variables de entorno
    define: {
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    }
});