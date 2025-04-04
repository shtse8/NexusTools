// src/handlers/editFile.ts
import { promises as fs } from "fs";
import path from "path";
import { z } from 'zod';
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { resolvePath } from '../utils/pathUtils.js';
import { createPatch } from 'diff'; // Import the diff library function

// Define the structure for a single edit operation
const EditOperationSchema = z.object({
  search: z.string().describe("The text or regex pattern to search for."),
  replace: z.string().describe("The text to replace the search pattern with."),
  is_regex: z.boolean().optional().default(false).describe("Treat the search pattern as a regular expression."),
  ignore_case: z.boolean().optional().default(false).describe("Perform case-insensitive matching."),
  // Future considerations: start_line, end_line, context_lines
}).strict();

// Define the main arguments schema for the edit_file tool
export const EditFileArgsSchema = z.object({
  path: z.string().describe("Relative path of the file to edit."),
  edits: z.array(EditOperationSchema).min(1).describe("An array of edit operations to perform."),
  dry_run: z.boolean().optional().default(false).describe("If true, only generate a diff preview without modifying the file."),
}).strict();

type EditFileArgs = z.infer<typeof EditFileArgsSchema>;

/**
 * Handles the 'edit_file' MCP tool request.
 * Applies complex edits to a file with pattern matching and preview.
 */
const handleEditFileFunc = async (args: unknown): Promise<{ content: { type: string; text: string }[] }> => {
  let parsedArgs: EditFileArgs;
  try {
    parsedArgs = EditFileArgsSchema.parse(args);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid arguments: ${error.errors.map(e => `${e.path.join('.')} (${e.message})`).join(', ')}`);
    }
    throw new McpError(ErrorCode.InvalidParams, 'Argument validation failed');
  }

  const { path: relativePath, edits, dry_run: dryRun } = parsedArgs;
  const absolutePath = resolvePath(relativePath);

  let originalContent: string;
  try {
    originalContent = await fs.readFile(absolutePath, 'utf-8');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new McpError(ErrorCode.InvalidRequest, `File not found: ${relativePath}`);
    }
    throw new McpError(ErrorCode.InternalError, `Failed to read file: ${error.message}`);
  }

  // --- Placeholder for complex edit logic ---
  // TODO:
  // 1. Implement matching logic (string/regex, case sensitivity)
  // 2. Implement replacement logic (preserving indentation)
  // 3. Handle multiple edits sequentially, adjusting indices/lines
  // 4. Generate diff (e.g., using 'diff' library)
  // 5. Apply changes if not dryRun
  // 6. Return diff or success message

  let modifiedContent = originalContent; // Start with original
  // Diff generation will happen after potential modification

  // --- Apply Edits Line-by-Line (Attempting Indentation Preservation) ---
  const originalLines = originalContent.split(/\r?\n/);
  let modifiedLines = [...originalLines]; // Work on a copy

  for (const edit of edits) {
    if (edit.is_regex) {
      // Regex logic is complex, especially with indentation and multi-line. Not implemented yet.
      throw new McpError(ErrorCode.InvalidRequest, `Regex edits are not yet supported by this tool.`); // Use InvalidRequest as NotImplemented isn't valid
    }

    // Apply non-regex edits line by line
    const currentLines = [...modifiedLines]; // Use the result of the previous edit for the next one
    modifiedLines = []; // Reset for the current edit pass
    for (let i = 0; i < currentLines.length; i++) {
        let line = currentLines[i];
        const indentationMatch = line.match(/^\s*/);
        const indentation = indentationMatch ? indentationMatch[0] : '';
        const lineContent = line.substring(indentation.length);

        // Simple string replacement within the line content
        // Note: Still naive regarding multiple occurrences, case sensitivity (uses ignore_case flag partially)
        let updatedLineContent = lineContent;
        if (edit.ignore_case) {
            // Basic case-insensitive check (indexOf is faster than regex for simple checks)
            if (lineContent.toLowerCase().includes(edit.search.toLowerCase())) {
                 // Use regex for case-insensitive replace (less efficient but handles ignore_case)
                 try {
                    const searchRegex = new RegExp(
                        // Escape regex special chars in the search string
                        edit.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                        'gi' // Global, case-insensitive
                    );
                    updatedLineContent = lineContent.replace(searchRegex, edit.replace);
                 } catch (regexError: any) {
                     throw new McpError(ErrorCode.InvalidParams, `Error creating regex for case-insensitive search "${edit.search}": ${regexError.message}`);
                 }
            }
        } else {
            // Case-sensitive replace using split/join
            if (lineContent.includes(edit.search)) {
                updatedLineContent = lineContent.split(edit.search).join(edit.replace);
            }
        }


        // Reconstruct the line with original indentation
        modifiedLines.push(indentation + updatedLineContent);
    }
  } // End loop through edits

  modifiedContent = modifiedLines.join('\n'); // Join lines back (using \n for consistency)

  // --- Diff Generation ---
  // Generate the diff regardless of dryRun to show the potential changes
  let diffOutput = createPatch(relativePath, originalContent, modifiedContent);

  // --- Apply Changes (if not dry run) ---
  if (!dryRun) {
    try {
      await fs.writeFile(absolutePath, modifiedContent, 'utf-8');
      diffOutput += "\n\nChanges applied successfully."; // Append success message
    } catch (error: any) {
      throw new McpError(ErrorCode.InternalError, `Failed to write changes: ${error.message}`);
    }
  } else {
      diffOutput += "\n\nDry run: No changes applied.";
  }


  return { content: [{ type: "text", text: diffOutput }] };
};

// Export the complete tool definition
export const editFileToolDefinition = {
    name: "edit_file",
    description: "Make selective edits to a file using pattern matching. Supports dry runs for preview.",
    schema: EditFileArgsSchema,
    handler: handleEditFileFunc,
};