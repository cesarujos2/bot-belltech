/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_URL: string
  readonly MAIN_VITE_PASS: string
  readonly MAIN_VITE_DRIVE:string
  readonly MAIN_VITE_EMAIL: string
  readonly MAIN_VITE_PASSEMAIL: string
  readonly MAIN_VITE_EMAILRECEP: string
  readonly MAIN_VITE_TIMEERRORESSEND: number
  readonly MAIN_VITE_ERRORCOUNTSEND: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
