# Project Brief: NexusTools Core Toolkit MCP Server

## 1. Project Goal

The primary goal of this project is to create a Model Context Protocol (MCP)
server named "NexusTools". This server will provide a **core set of essential
and efficient tools** for AI agents (like Cline) to interact with the user's
filesystem in a controlled and secure manner. Key features include batch
operations and **partial file reading** to optimize token usage and performance,
operating relative to a defined project root directory.

## 2. Core Requirements

- **MCP Compliance:** The server must adhere to the Model Context Protocol
  specifications for communication.
- **Relative Pathing:** All filesystem operations must be strictly relative to
  the project root directory. Absolute paths should be disallowed, and path
  traversal attempts must be prevented.
- **Core Essential Tools:** Implement an efficient set of tools for common agent
  tasks:
  - `list_files`: List files/directories within a specified directory
    (potentially simplified options compared to a full `glob` wrapper).
  - `stat_items`: Get detailed status information for multiple specified paths.
  - `read_content`: Read content from multiple specified files, **supporting
    partial reads via optional `start_line` and `end_line` parameters**.
  - `write_content`: Write or append content to multiple specified files
    (creating directories if needed).
  - `delete_items`: Delete multiple specified files or directories.
  - `create_directories`: Create multiple specified directories (including
    intermediate ones).
  - `move_items`: Move or rename multiple specified files/directories.
  - `copy_items`: Copy multiple specified files/directories.
  - `search_files`: Search for regex patterns within files in a specified
    directory.
  - `replace_content`: Search and replace content within files across multiple
    specified paths.
- **Technology Stack:** Use Node.js and TypeScript. Leverage the
  `@modelcontextprotocol/sdk` for MCP implementation. Use `fs` and `path`
  modules. `glob` may be used for searching/listing if necessary.
- **Efficiency:** Tools should be implemented efficiently, supporting batch
  operations where applicable and optimizing for reduced token usage (e.g.,
  partial reads).
- **Security:** Robust path resolution and validation are critical to prevent
  access outside the designated project root.

## 3. Scope

- **In Scope:** Implementation of the NexusTools MCP server logic, definition of
  the core tool schemas (including partial read options), handling requests,
  performing filesystem operations via Node.js modules, and basic error
  handling.
- **Out of Scope:** Tools removed from the original Filesystem MCP
  (`chmod_items`, `chown_items`), advanced features like file watching, complex
  permission management, handling extremely large files requiring advanced
  streaming (beyond the implemented partial reads), or integration with version
  control systems.

## 4. Success Criteria

- The server compiles successfully using TypeScript.
- The server connects and responds to MCP requests (e.g., `list_tools`)
  identifying itself as "NexusTools".
- All implemented core tools function correctly according to their descriptions,
  respecting relative path constraints.
- The `read_content` tool correctly handles full and partial reads based on
  `start_line`/`end_line` parameters.
- Path traversal attempts are correctly blocked.
- The server handles basic errors gracefully (e.g., file not found).
- Removed tools (`chmod_items`, `chown_items`) are no longer available.
