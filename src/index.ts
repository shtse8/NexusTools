#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod'; // Import Zod
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
// Import the aggregated tool definitions
import { allToolDefinitions } from './handlers/index.js';
// Removed incorrect import left over from partial diff

// --- Tool Names (Constants) ---
// Removed tool name constants, names are now in the definitions

// --- Server Setup ---

const server = new Server(
  {
    name: "nexus-tools",
    version: "0.1.0", // Reset version for the new toolkit
    description: "MCP Server providing a core toolkit for AI agents."
  },
  {
    capabilities: { tools: {} },
  }
);

// Helper function to convert Zod schema to JSON schema for MCP
const generateInputSchema = (schema: z.ZodType<any, any, any>): object => {
    // Need to cast as 'any' because zodToJsonSchema might return slightly incompatible types for MCP SDK
    return zodToJsonSchema(schema, { target: 'openApi3' }) as any;
};

server.setRequestHandler(ListToolsRequestSchema, async () => {
  // Removed log
  // Map the aggregated definitions to the format expected by the SDK
  const availableTools = allToolDefinitions.map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: generateInputSchema(def.schema), // Generate JSON schema from Zod schema
  }));
  return { tools: availableTools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Use imported handlers
  // Find the tool definition by name and call its handler
  const toolDefinition = allToolDefinitions.find(def => def.name === request.params.name);

  if (!toolDefinition) {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
  }

  // Call the handler associated with the found definition
  // The handler itself will perform Zod validation on the arguments
  return toolDefinition.handler(request.params.arguments);
});

// --- Server Start ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[NexusTools MCP] Server running on stdio');
}

main().catch((error) => {
  console.error("[NexusTools MCP] Server error:", error);
  process.exit(1);
});
