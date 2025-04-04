import { listFilesToolDefinition } from './listFiles.js';
import { statItemsToolDefinition } from './statItems.js';
import { readContentToolDefinition } from './readContent.js';
import { writeContentToolDefinition } from './writeContent.js';
import { deleteItemsToolDefinition } from './deleteItems.js';
import { createDirectoriesToolDefinition } from './createDirectories.js';
import { moveItemsToolDefinition } from './moveItems.js';
import { copyItemsToolDefinition } from './copyItems.js';
import { searchFilesToolDefinition } from './searchFiles.js';
import { replaceContentToolDefinition } from './replaceContent.js';
import { editFileToolDefinition } from './editFile.js'; // Import the new tool

// Define the structure for a tool definition (used internally and for index.ts)
// We need Zod here to define the schema type correctly
import { z } from 'zod';
export interface ToolDefinition {
    name: string;
    description: string;
    schema: z.ZodType<any, any, any>; // Use Zod schema type
    handler: (args: unknown) => Promise<any>; // Handler function type
}

// Aggregate all tool definitions into a single array
export const allToolDefinitions: ToolDefinition[] = [
    listFilesToolDefinition,
    statItemsToolDefinition,
    readContentToolDefinition,
    writeContentToolDefinition,
    deleteItemsToolDefinition,
    createDirectoriesToolDefinition,
    moveItemsToolDefinition,
    copyItemsToolDefinition,
    searchFilesToolDefinition,
    replaceContentToolDefinition,
    editFileToolDefinition, // Add the new tool definition
];