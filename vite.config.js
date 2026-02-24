import {defineConfig} from 'vite'

export default defineConfig({
    base: '/FanZinZin/',
    build: {
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks: {
                    'pdf-lib': ['pdf-lib']
                }
            }
        }
    },
    optimizeDeps: {
        include: ['pdf-lib']
    }
})
