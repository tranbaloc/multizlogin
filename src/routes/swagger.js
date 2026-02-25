import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

const router = express.Router();

// Dành cho ES Module: xác định __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc file OpenAPI spec
const openapiPath = path.join(process.cwd(), 'src', 'config', 'openapi.json');
let openapiSpec = {};

try {
    if (fs.existsSync(openapiPath)) {
        const raw = fs.readFileSync(openapiPath, 'utf-8');
        openapiSpec = JSON.parse(raw);
        console.log('Loaded OpenAPI spec from', openapiPath);
    } else {
        console.warn('OpenAPI spec file not found at', openapiPath);
    }
} catch (err) {
    console.error('Error loading OpenAPI spec:', err);
}

// Route trả về JSON spec
router.get('/openapi.json', (req, res) => {
    if (!openapiSpec || Object.keys(openapiSpec).length === 0) {
        return res.status(500).json({ success: false, error: 'OpenAPI spec not loaded' });
    }
    res.json(openapiSpec);
});

// Swagger UI
router.use('/', swaggerUi.serve, swaggerUi.setup(openapiSpec));

export default router;

