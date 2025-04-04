# Tech Context: NexusTools Core Toolkit MCP Server

## 1. Core Technologies

- **Runtime:** Node.js (Version should be compatible with used libraries, likely
  >= 18)
- **Language:** TypeScript (Compiled to JavaScript for execution)
- **Package Manager:** npm (Node Package Manager)

## 2. Key Libraries/Dependencies

- **`@modelcontextprotocol/sdk`:** The official SDK for implementing MCP servers
  and clients. Used for:
  - `Server`: Core server class.
  - `StdioServerTransport`: Communication via standard input/output.
  - Schema definitions (`CallToolRequestSchema`, `ListToolsRequestSchema`).
  - Error types (`McpError`, `ErrorCode`).
- **`zod`:** Library for schema declaration and validation. Used for defining
  and parsing tool arguments.
- **`zod-to-json-schema`:** Utility to convert Zod schemas into JSON schemas for
  MCP tool definitions.
- **`glob`:** Library for matching files using glob patterns (like `*`, `**/*`,
  `*.ts`). Used in `search_files` and potentially `list_files`.
- **`typescript`:** TypeScript compiler (`tsc`).
- **`@types/node`:** TypeScript type definitions for Node.js built-in modules
  (`fs`, `path`, `process`, etc.).
- **`@types/glob`:** TypeScript type definitions for the `glob` library.

## 3. Development Setup

- **Source Code:** Located in the `src` directory (`nexus-tools/src`).
- **Main File:** `src/index.ts`.
- **Configuration:**
  - `tsconfig.json`: Configures the TypeScript compiler options (target ES
    version, module system, output directory, etc.). Set to output JavaScript
    files to the `build` directory.
  - `package.json`: Defines project metadata (`@shtse8/nexus-tools`, version
    `0.1.0`, etc.), dependencies, and npm scripts.
    - `dependencies`: `@modelcontextprotocol/sdk`, `glob`, `zod`,
      `zod-to-json-schema`.
    - `devDependencies`: `typescript`, `@types/node`, `@types/glob`.
    - `scripts`:
      - `build`: Compiles TypeScript code using `tsc` and sets execute
        permissions on the output script.
      - `prepare`: Runs `build` automatically on `npm install`.
      - `watch`: Recompiles TypeScript on file changes.
      - `inspector`: Runs the MCP inspector tool against the built server.
- **Build Output:** Compiled JavaScript code is placed in the `build` directory
  (`nexus-tools/build`).
- **Execution:** The server is intended to be run via `node build/index.js` or
  using the binary defined in `package.json` (`nexus-tools`).

## 4. Technical Constraints & Considerations

- **Node.js Environment:** The server relies on the Node.js runtime and its
  built-in modules, particularly `fs` (filesystem) and `path`.
- **Permissions:** The server process runs with the permissions of the user who
  started it. Filesystem operations might fail due to insufficient permissions
  on the target files/directories.
- **Cross-Platform Compatibility:** While Node.js aims for cross-platform
  compatibility, filesystem behaviors (path separators, case sensitivity) can
  differ slightly between Windows, macOS, and Linux. Code uses `path.join`,
  `path.resolve`, `path.normalize`, and replaces backslashes (`\`) with forward
  slashes (`/`) in output paths to mitigate some issues.
- **Error Handling:** Relies on Node.js error codes (`ENOENT`, `EPERM`, etc.)
  for specific filesystem error detection.
- **Security Model:** Security relies entirely on the `resolvePath` function
  correctly preventing access outside the `PROJECT_ROOT`. No other sandboxing
  mechanism is implemented.
