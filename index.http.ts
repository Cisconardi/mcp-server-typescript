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
    const agent = agentConfig;

    const output = await agent.tools[0].invoke(input.query); // usa il primo tool
    res.json({ output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ HTTP MCP Server running on port ${port}`);
});
