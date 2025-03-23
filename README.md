### Vite config
npm install @codingame/esbuild-import-meta-url-plugin

npm install @codingame/monaco-vscode-api
npm install vscode@npm:@codingame/monaco-vscode-extension-api
npm install monaco-editor@npm:@codingame/monaco-vscode-editor-api

npm install vscode@npm:@codingame/monaco-vscode-api
npm install monaco-editor@npm:@codingame/monaco-vscode-editor-api
npm install -D @types/vscode


https://github.com/CodinGame/monaco-vscode-api/wiki/List-of-service-overrides
### Services included by default
npm install @codingame/monaco-vscode-base-service-override
npm install @codingame/monaco-vscode-host-service-override
npm install @codingame/monaco-vscode-extensions-service-override
npm install @codingame/monaco-vscode-files-service-override
npm install @codingame/monaco-vscode-quickaccess-service-override

###  Services
npm install @codingame/monaco-vscode-configuration-service-override
npm install @codingame/monaco-vscode-languages-service-override
npm install @codingame/monaco-vscode-textmate-service-override
npm install @codingame/monaco-vscode-theme-service-override
npm install @codingame/monaco-vscode-python-default-extension
npm install @codingame/monaco-vscode-theme-defaults-default-extension


### LSP
npm install vscode-ws-jsonrpc
npm install monaco-languageclient


import {initialize} from '@codingame/monaco-vscode-api'

## Pylsp
pylsp --ws --port 5007

## Extensiones
https://www.vsixhub.com/

````javascript
import {initialize} from 'vscode/extensions';
import {registerExtension} from 'vscode/extensions';

// Inicializa el API de VSCode
initialize();

// Cargar la extensión empaquetada
registerExtension({
    async load() {
        // Importa la extensión empaquetada
        const extension = await import('ruta/a/tu/extension.vsix');
        return extension.default;
    }
}).then(extension => {
    console.log('Extensión cargada:', extension);
}).catch(error => {
    console.error('Error al cargar la extensión:', error);
});
````

## Snippets

- Cargar snippets desde un archivo JSON
````javascript
import { snippets } from 'vscode/extensions';

// Definir un snippet en formato JSON
const mySnippets = {
"Print to console": {
"prefix": "log",
"body": [
"console.log('$1');",
"$2"
],
"description": "Log output to console"
}
};

// Registrar los snippets
snippets.registerSnippets('javascript', mySnippets);
````

## AI
````javascript
import { ai } from 'vscode/extensions';

// Configurar un proveedor de IA
ai.registerAIProvider({
    provideInlineCompletions: async (model, position, context, token) => {
        // Aquí puedes implementar la lógica para obtener sugerencias de IA
        // Por ejemplo, hacer una solicitud a la API de GitHub Copilot o OpenAI Codex
        const suggestions = await fetchAISuggestions(model, position, context);
        return {
            items: suggestions.map(suggestion => ({
                insertText: suggestion.text,
                range: suggestion.range
            }))
        };
    }
});
````