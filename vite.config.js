import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin.html'),
                login: resolve(__dirname, 'login.html'),
                register: resolve(__dirname, 'register.html'),
                postAd: resolve(__dirname, 'post-ad.html'),
                forgotPassword: resolve(__dirname, 'forgot-password.html'),
                shops: resolve(__dirname, 'shops.html'),
                category: resolve(__dirname, 'category.html'),
                parts: resolve(__dirname, 'parts.html'),
                accessories: resolve(__dirname, 'accessories.html'),
                tires: resolve(__dirname, 'tires.html'),
                oils: resolve(__dirname, 'oils.html'),
                equipment: resolve(__dirname, 'equipment.html'),
                cars: resolve(__dirname, 'cars.html'),
            },
        },
    },
});
