#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { DataForSEOClient, DataForSEOConfig } from './client/dataforseo.client.js';
import { SerpApiModule } from './modules/serp/serp-api.module.js';
import { KeywordsDataApiModule } from './modules/keywords-data/keywords-data-api.module.js';
import { OnPageApiModule } from './modules/onpage/onpage-api.module.js';
import { DataForSEOLabsApi } from './modules/dataforseo-labs/dataforseo-labs-api.module.js';
import { EnabledModulesSchema, isModuleEnabled, defaultEnabledModules } from './config/modules.config.js';
import { BaseModule } from './modules/base.module.js';
import { z } from 'zod';
import { BacklinksApiModule } from "./modules/backlinks/backlinks-api.module.js";
import { BusinessDataApiModule } from "./modules/business-data-api/business-data-api.module.js";
import { DomainAnalyticsApiModule } from "./modules/domain-analytics/domain-analytics-api.module.js";

interface ToolDefinition {
  description: string;
  params: z.ZodRawShape;
  handler: (params: any) => Promise<any>;
}

console.error('Starting DataForSEO MCP Server...');

// Configurazione client
const dataForSEOConfig: DataForSEOConfig = {
  username: process.env.DATAFORSEO_USERNAME || "",
  password: process.env.DATAFORSEO_PASSWORD || "",
};
const dataForSEOClient = new DataForSEOClient(dataForSEOConfig);
console.error('DataForSEO client initialized');

// Parse dei moduli abilitati
const enabledModules = EnabledModulesSchema.parse(process.env.ENABLED_MODULES || defaultEnabledModules);

// Inizializza moduli
const modules: BaseModule[] = [];

if (isModuleEnabled('SERP', enabledModules)) {
  modules.push(new SerpApiModule(dataForSEOClient));
}
if (isModuleEnabled('KEYWORDS_DATA', enabledModules)) {
  modules.push(new KeywordsDataApiModule(dataForSEOClient));
}
if (isModuleEnabled('ONPAGE', enabledModules)) {
  modules.push(new OnPageApiModule(dataForSEOClient));
}
if (isModuleEnabled('DATAFORSEO_LABS', enabledModules)) {
  modules.push(new DataForSEOLabsApi(dataForSEOClient));
}
if (isModuleEnabled('BACKLINKS', enabledModules)) {
  modules.push(new BacklinksApiModule(dataForSEOClient));
}
if (isModuleEnabled('BUSINESS_DATA', enabledModules)) {
  modules.push(new BusinessDataApiModule(dataForSEOClient));
}
if (isModuleEnabled('DOMAIN_ANALYTICS', enabledModules)) {
  modules.push(new DomainAnalyticsApiModule(dataForSEOClient));
}
console.error('Modules initialized');

// Registrazione strumenti
function registerModuleTools(server: McpServer) {
  modules.forEach(module => {
    const tools = module.getTools();
    Object.entries(tools).forEach(([name, tool]) => {
      const typedTool = tool as ToolDefinition;
      const schema = z.object(typedTool.params);
      server.tool(
        name,
        typedTool.description,
        schema.shape,
        typedTool.handler
      );
    });
  });
}

// Configurazione esportata
export const agentConfig = {
  name: "dataforseo",
  version: "1.0.0",
  setup: async (server: McpServer) => {
    registerModuleTools(server);
  }
};

// Esecuzione diretta solo in modalità CLI (stdio)
if (import.meta.url.endsWith(process.argv[1])) {
  const server = new McpServer(agentConfig);
  const transport = new StdioServerTransport();

  server.connect(transport).then(() => {
    console.error("✅ MCP Server running via stdio");
  }).catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
}
