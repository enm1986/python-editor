import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import vsixPlugin from '@codingame/monaco-vscode-rollup-vsix-plugin';

export default {
    input: 'src/main.js', // Punto de entrada de tu aplicación
    output: {
        file: 'dist/bundle.js', // Archivo de salida
        format: 'esm' // Formato del bundle
    },
    plugins: [
        nodeResolve(), // Resuelve módulos de Node.js
        commonjs(), // Convierte módulos CommonJS a ES6
        vsixPlugin({
            // Opciones del plugin
            vsixPaths: [
                'ruta/a/tu/extension.vsix' // Ruta al archivo .vsix
            ],
            outputDir: 'dist/extensions' // Directorio de salida personalizado
        })
    ]
};