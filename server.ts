import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the Vite build directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// API Routes placeholder
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Fallback for SPA or multi-page app
app.get('*', (req: Request, res: Response) => {
    // Vite build usually creates files like index.html, parts.html etc.
    // express.static handles those if the URL matches.
    // If we reach here, it's a 404.
    res.status(404).send('Səhifə tapılmadı');
});

app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} ünvanında başladıldı`);
});
