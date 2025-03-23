import '@codingame/monaco-vscode-python-default-extension';
import "@codingame/monaco-vscode-theme-defaults-default-extension";

// Idiomas
// import "@codingame/monaco-vscode-language-pack-es"

// Temas
import "@codingame/monaco-vscode-theme-abyss-default-extension"
import "@codingame/monaco-vscode-theme-kimbie-dark-default-extension"
import "@codingame/monaco-vscode-theme-red-default-extension"
import "@codingame/monaco-vscode-theme-tomorrow-night-blue-default-extension"
import "@codingame/monaco-vscode-theme-quietlight-default-extension"
import "@codingame/monaco-vscode-theme-solarized-light-default-extension"
import "@codingame/monaco-vscode-theme-solarized-dark-default-extension"
import "@codingame/monaco-vscode-theme-monokai-default-extension"
import "@codingame/monaco-vscode-theme-monokai-dimmed-default-extension"

import "@codingame/monaco-vscode-keybindings-service-override"

import './style.css'
import * as monaco from 'monaco-editor';
import {initialize as initializeServices} from "@codingame/monaco-vscode-api"
import {extensions, } from "vscode";
import "vscode/localExtensionHost";

import {initWebSocketAndStartClient} from './lsp-client'

import getBaseServiceOverride from "@codingame/monaco-vscode-base-service-override"
import getPreferencesServiceOverride from "@codingame/monaco-vscode-preferences-service-override"
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getTextMateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getModelServiceOverride from "@codingame/monaco-vscode-model-service-override";
import getExtensionServiceOverride from "@codingame/monaco-vscode-extensions-service-override";
import getSnippetsServiceOverride from '@codingame/monaco-vscode-snippets-service-override';
// import getNotificationsServiceOverride from  "@codingame/monaco-vscode-notifications-service-override";
// import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override"
// import getExtensionGalleryServiceOverride from "@codingame/monaco-vscode-extension-gallery-service-override"
// import getAIServiceOverride from '@codingame/monaco-vscode-ai-service-override';
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override"

export type WorkerLoader = () => Worker;
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
    TextEditorWorker: () => new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), {type: 'module'}),
    TextMateWorker: () => new Worker(new URL('@codingame/monaco-vscode-textmate-service-override/worker', import.meta.url), {type: 'module'})
}

window.MonacoEnvironment = {
    getWorker: function (_moduleId, label) {
        console.log('getWorker', _moduleId, label);
        const workerFactory = workerLoaders[label]
        if (workerFactory != null) {
            return workerFactory()
        }
        throw new Error(`Worker ${label} not found`)
    }
}

await initializeServices({
    ...getBaseServiceOverride(),
    ...getPreferencesServiceOverride(),
    ...getTextMateServiceOverride(),
    ...getThemeServiceOverride(),
    ...getLanguagesServiceOverride(),
    ...getModelServiceOverride(),
    ...getExtensionServiceOverride(),
    ...getSnippetsServiceOverride(),
    ...getKeybindingsServiceOverride(),
    // ...getNotificationsServiceOverride(),
    // ...getConfigurationServiceOverride(),
    // ...getAIServiceOverride({
    //     // Opciones de configuración (opcional)
    //     enableAI: true, // Habilita el servicio de IA
    //     // Si estás usando GitHub Copilot, proporciona un token aquí
    //     // copilotToken: 'TU_TOKEN_DE_COPILOT'
    // }),
});


monaco.editor.create(document.getElementById('editor')!, {
    value: "import numpy as np\nprint('Hello world!')",
    language: 'python',
    automaticLayout: true,
});


// initWebSocketAndStartClient("ws://localhost:5007/")
initWebSocketAndStartClient("ws://localhost:8000/lsp")
