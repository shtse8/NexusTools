# System Patterns: NexusTools Core Toolkit MCP Server

## 1. Architecture Overview

The NexusTools MCP server is a standalone Node.js application designed to run as
a child process, communicating with its parent (the AI agent host) via standard
input/output (stdio) using the Model Context Protocol (MCP). It provides a
**core set of essential filesystem tools**.

```mermaid
graph LR
    A[Agent Host Environment] -- MCP over Stdio --> B(NexusTools MCP Server);
    B -- Node.js fs/path/glob --> C[User Filesystem (Project Root)];
    C -- Results/Data --> B;
    B -- MCP over Stdio --> A;
```

## 2. Key Technical Decisions & Patterns

- **MCP SDK Usage:** Leverages the `@modelcontextprotocol/sdk` for handling MCP
  communication (request parsing, response formatting, error handling). This
  standardizes interaction and reduces boilerplate code.
- **Stdio Transport:** Uses `StdioServerTransport` from the SDK for
  communication, suitable for running as a managed child process.
- **Asynchronous Operations:** All filesystem interactions and request handling
  are implemented using `async/await` and Node.js's promise-based `fs` module
  (`fs.promises`) for non-blocking I/O.
- **Strict Path Resolution:** A dedicated `resolvePath` function is used for
  _every_ path received from the agent.
  - It normalizes the path.
  - It resolves the path relative to a dynamically determined `PROJECT_ROOT`
    (calculated based on the server script's location).
  - It explicitly checks if the resolved absolute path still starts with the
    `PROJECT_ROOT` absolute path to prevent path traversal vulnerabilities
    (e.g., `../../sensitive-file`).
  - It rejects absolute paths provided by the agent.
- **Tool-Handler Mapping:** The `CallToolRequestSchema` handler maps incoming
  tool names directly to their corresponding asynchronous handler functions
  (e.g., `handleListFiles`, `handleReadContent`, `handleWriteContent`).
- **Partial Read Implementation:** The `handleReadContent` function includes
  logic to process optional `start_line` and `end_line` arguments, splitting the
  file content by lines and returning only the requested range.
- **Error Handling:**
  - Uses `try...catch` blocks within each tool handler.
  - Catches specific Node.js filesystem errors (like `ENOENT`, `EPERM`,
    `EACCES`) and maps them to appropriate MCP error codes (`InvalidRequest`).
  - Uses custom `McpError` objects for standardized error reporting back to the
    agent.
  - Logs unexpected errors to the server's console (`stderr`) for debugging.
- **Glob for Listing/Searching:** Uses the `glob` library for flexible file
  listing and searching based on glob patterns. (Note: The complexity of
  `list_files` options might be simplified compared to the original Filesystem
  MCP).
- **TypeScript:** Provides static typing for better code maintainability, early
  error detection, and improved developer experience. Uses ES module syntax
  (`import`/`export`).

## 3. Component Relationships

- **`index.ts`:** Main entry point. Sets up the MCP server instance, defines
  tool schemas, registers request handlers, and starts the server connection.
  Identifies the server as "NexusTools".
- **`Server` (from SDK):** Core MCP server class handling protocol logic.
- **`StdioServerTransport` (from SDK):** Handles reading/writing MCP messages
  via stdio.
- **Tool Handler Functions (`handleListFiles`, `handleStatItems`, etc.):**
  Contain the specific logic for each core tool, including argument parsing
  (Zod), path resolution, filesystem interaction (including partial read logic
  in `handleReadContent`), and result formatting.
- **`resolvePath` Helper:** Centralized security function for path validation.
- **`formatStats` Helper:** Utility to create a consistent stats object
  structure (if used by `stat_items` or `list_files`).
- **Node.js Modules (`fs`, `path`):** Used for actual filesystem operations and
  path manipulation.
- **`glob` Library:** Used for pattern-based file searching and listing.
