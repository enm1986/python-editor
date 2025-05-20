import './style.css'
import './extensions/blinds-theme.vsix'
import './extensions/dark-colors-theme.vsix'
import './extensions/dracula-high-contrast.vsix'
import './extensions/jetbrains-darcula-theme.vsix'
import './extensions/see-the-color.vsix'
import './extensions/vsc-material-theme.vsix'

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

import * as monaco from 'monaco-editor';
import {initialize as initializeServices} from "@codingame/monaco-vscode-api"
import {registerExtension} from "@codingame/monaco-vscode-api/extensions";
// import {extensions} from "vscode";
import "vscode/localExtensionHost";

import {initWebSocketAndStartClient} from './lsp-client'

import getBaseServiceOverride from "@codingame/monaco-vscode-base-service-override"
// import getHostServiceOverride from "@codingame/monaco-vscode-host-service-override"
// import getExtensionServiceOverride from "@codingame/monaco-vscode-extensions-service-override";
// import getFilesServiceOverride from "@codingame/monaco-vscode-files-service-override";
// import getQuickAccessServiceOverride from "@codingame/monaco-vscode-quickaccess-service-override";
// import getNotificationsServiceOverride from "@codingame/monaco-vscode-notifications-service-override";
// import getDialogsServiceOverride from "@codingame/monaco-vscode-dialogs-service-override"
// import getModelServiceOverride from "@codingame/monaco-vscode-model-service-override";
// import getEditorServiceOverride from "@codingame/monaco-vscode-editor-service-override"
// import getViewsServiceOverride from "@codingame/monaco-vscode-views-service-override"
// import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override"
// import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override"
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getTextMateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
// import getTreeSitterServiceOverride from "@codingame/monaco-vscode-treesitter-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getSnippetsServiceOverride from "@codingame/monaco-vscode-snippets-service-override";
// import getDebugServiceOverride from "@codingame/monaco-vscode-debug-service-override";
// import getPreferencesServiceOverride from "@codingame/monaco-vscode-preferences-service-override";
// import getStorageServiceOverride from "@codingame/monaco-vscode-storage-service-override";
// import getNotebookServiceOverride from "@codingame/monaco-vscode-notebook-service-override";
// import getExtensionGalleryServiceOverride from "@codingame/monaco-vscode-extension-gallery-service-override"
// import getAIServiceOverride from "@codingame/monaco-vscode-ai-service-override"';


export type WorkerLoader = () => Worker;
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
    TextEditorWorker: () => new Worker(
        new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
        {type: 'module'}
    ),
    TextMateWorker: () => new Worker(
        new URL('@codingame/monaco-vscode-textmate-service-override/worker', import.meta.url),
        {type: 'module'}
    )
}

window.MonacoEnvironment = {
    getWorker: function (_moduleId: any, label: string | number) {
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
    // ...getHostServiceOverride(),
    // ...getExtensionServiceOverride(),
    // ...getQuickAccessServiceOverride(),
    // ...getNotificationsServiceOverride(),
    // ...getModelServiceOverride(),
    // ...getEditorServiceOverride(),
    // ...getConfigurationServiceOverride(),
    // ...getKeybindingsServiceOverride(),
    ...getLanguagesServiceOverride(),
    ...getTextMateServiceOverride(),
    ...getThemeServiceOverride(),
    ...getSnippetsServiceOverride(),
    // ...getPreferencesServiceOverride(),
    // ...getStorageServiceOverride(),
    // ...getAIServiceOverride({
    //     // Opciones de configuración (opcional)
    //     enableAI: true, // Habilita el servicio de IA
    //     // Si estás usando GitHub Copilot, proporciona un token aquí
    //     // copilotToken: 'TU_TOKEN_DE_COPILOT'
    // }),
});

const workspace = 'client'
const workspace_data = {
    "campos": {
        "APL": "TextCtrl"
    }
}


monaco.editor.create(document.getElementById('editor')!, {
    value: "import numpy as np\nprint('Hello world!')",
    language: 'python',
    automaticLayout: true,
});


// initWebSocketAndStartClient(`ws://localhost:5007`)
const websocket = initWebSocketAndStartClient(`ws://localhost:8000/lsp/${workspace}`)
try {
    await updateWorkspace(websocket, workspace_data);
} catch (error) {
    console.error("Error en updateWorkspace:", error);
}


function waitForWebSocketConnection(websocket: WebSocket): Promise<void> {
    return new Promise((resolve, reject) => {
        const maxAttempts = 10;
        const intervalTime = 500; // medio segundo entre intentos
        let currentAttempt = 0;

        // Si ya está conectado, resolvemos inmediatamente
        if (websocket.readyState === WebSocket.OPEN) {
            resolve();
            return;
        }

        // Si está cerrado o con error, rechazamos inmediatamente
        if (websocket.readyState === WebSocket.CLOSED || websocket.readyState === WebSocket.CLOSING) {
            reject(new Error('WebSocket está cerrado o cerrándose'));
            return;
        }

        const interval = setInterval(() => {
            if (websocket.readyState === WebSocket.OPEN) {
                clearInterval(interval);
                resolve();
            } else {
                currentAttempt++;
                if (currentAttempt >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error('Tiempo de espera agotado para la conexión WebSocket'));
                }
            }
        }, intervalTime);

        websocket.addEventListener('error', () => {
            clearInterval(interval);
            reject(new Error('Error en la conexión WebSocket'));
        });
    });
}


async function updateWorkspace(websocket: WebSocket, data: any) {
    try {
        await waitForWebSocketConnection(websocket);

        const message = {
            method: 'updateWorkspace',
            data: data
        };

        websocket.send(JSON.stringify(message));

    } catch (error) {
        console.error("Error al enviar updateWorkspace:", error);
        throw error;
    }
}