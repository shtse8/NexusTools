import { promises as fs } from "fs";
import { z } from 'zod';
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { resolvePath } from '../utils/pathUtils.js';

/**
 * Handles the 'read_content' MCP tool request.
 * Reads content from multiple specified files.
 */

// Define Zod schema and export it
export const ReadContentArgsSchema = z.object({
  paths: z.array(z.string()).min(1, { message: "Paths array cannot be empty" }).describe("Array of relative file paths to read."),
  start_line: z.number().int().positive().optional().describe("The starting line number to read from (1-based)."),
  end_line: z.number().int().positive().optional().describe("The ending line number to read to (1-based, inclusive)."),
}).strict();

// Infer TypeScript type
type ReadContentArgs = z.infer<typeof ReadContentArgsSchema>;

// Removed duplicated non-exported schema/type definitions

const handleReadContentFunc = async (args: unknown) => {
  // Validate and parse arguments
  let parsedArgs: ReadContentArgs;
  try {
      parsedArgs = ReadContentArgsSchema.parse(args);
  } catch (error) {
      if (error instanceof z.ZodError) {
          throw new McpError(ErrorCode.InvalidParams, `Invalid arguments: ${error.errors.map(e => `${e.path.join('.')} (${e.message})`).join(', ')}`);
      }
      throw new McpError(ErrorCode.InvalidParams, 'Argument validation failed');
  }
  const { paths: relativePaths, start_line, end_line } = parsedArgs;

  // Define result structure
  // Define result structure
  type ReadResult = {
      path: string;
      content?: string;
      error?: string;
  };

  const results = await Promise.allSettled(relativePaths.map(async (relativePath): Promise<ReadResult> => {
    const pathOutput = relativePath.replace(/\\/g, '/'); // Ensure consistent path separators early
    try {
      const targetPath = resolvePath(relativePath);
      const stats = await fs.stat(targetPath);
      if (!stats.isFile()) {
        return { path: pathOutput, error: `Path is not a file` };
      }

      let content = await fs.readFile(targetPath, 'utf-8');

      // Handle partial read if start_line or end_line is provided
      if (start_line || end_line) {
        const lines = content.split(/\r?\n/);
        const totalLines = lines.length;

        // Adjust for potentially empty last line after split if file ends with newline
        // const effectiveTotalLines = content.endsWith('\n') || content.endsWith('\r\n') ? totalLines -1 : totalLines;
        // Note: Simpler to just use totalLines and let slice handle boundaries.

        const readStart = start_line ? Math.max(1, start_line) : 1; // Default to 1 if only end_line is given
        const readEnd = end_line ? Math.min(totalLines, end_line) : totalLines; // Default to end if only start_line is given

        if (readStart > readEnd) {
          return { path: pathOutput, error: `start_line (${readStart}) cannot be greater than end_line (${readEnd})` };
        }
        if (readStart > totalLines) {
            // If start is beyond the file length, return empty content or an error? Let's return empty.
             content = "";
        } else {
            // Slice uses 0-based index, end is exclusive.
            // Adjust start_line (1-based) to 0-based index.
            // Adjust end_line (1-based, inclusive) to slice's exclusive end index.
            content = lines.slice(readStart - 1, readEnd).join('\n');
        }
      }

      return { path: pathOutput, content: content };
    } catch (error: any) {
      if (error.code === 'ENOENT') {
          return { path: pathOutput, error: `File not found` };
      }
      if (error instanceof McpError) {
          return { path: pathOutput, error: error.message };
      }
      console.error(`[Filesystem MCP - readContent] Error reading file ${relativePath}:`, error);
      return { path: pathOutput, error: `Failed to read file: ${error.message}` };
    }
  }));

  // Process results from Promise.allSettled
  const outputContents: ReadResult[] = results.map((result, index) => {
      if (result.status === 'fulfilled') {
          return result.value;
      } else {
          // Handle rejected promises (should ideally not happen with current try/catch)
          console.error(`[Filesystem MCP - readContent] Unexpected rejection for path ${relativePaths[index]}:`, result.reason);
          return { path: relativePaths[index].replace(/\\/g, '/'), error: 'Unexpected error during processing.' };
      }
  });

  // Sort results by original path order for predictability
  outputContents.sort((a, b) => relativePaths.indexOf(a.path ?? '') - relativePaths.indexOf(b.path ?? '')); // Handle potential undefined path in sort

  return { content: [{ type: "text", text: JSON.stringify(outputContents, null, 2) }] };
};

// Export the complete tool definition
export const readContentToolDefinition = {
    name: "read_content",
    description: "Read content from multiple specified files.",
    schema: ReadContentArgsSchema,
    handler: handleReadContentFunc,
};