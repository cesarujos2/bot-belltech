/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_URL: string
  readonly MAIN_VITE_PASS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
