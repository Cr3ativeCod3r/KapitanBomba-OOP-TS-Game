import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
    base: command === 'serve' ? '/' : '/galaktycznepotyczki.pl',
    build: {
        outDir: 'dist'
    }
}))