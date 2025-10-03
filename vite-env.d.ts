/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HTTP_SERVER: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
