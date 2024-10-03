/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_URL: string
  readonly MAIN_VITE_PASS: string
  readonly MAIN_VITE_DRIVE:string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
