// index.http.ts
import express from 'express';
import dotenv from 'dotenv';
import { agentConfig } from './src/index';

dotenv.config();
const app = express();
const port = process.env.PORT || 5678;

app.use(express.json());

app.post('/', async (req, res) => {
  try {
    const input = req.body?.input || {};
    const output = await agentConfig.tools[0].invoke(input.query);
    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ MCP HTTP Server running on port ${port}`);
});
