import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
    base: command === 'serve' ? '/' : '/',
    build: {
        outDir: 'dist'
    }
}))