/// <reference types="vite/client" />

/**
 * Vite 注入的前端环境变量（仅 VITE_ 前缀会暴露给浏览器）
 */
interface ImportMetaEnv {
  readonly VITE_AI_API_KEY: string | undefined;
  readonly VITE_AI_BASE_URL: string | undefined;
  readonly VITE_AI_MODEL: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
