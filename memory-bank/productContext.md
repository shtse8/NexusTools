# Product Context: NexusTools Core Toolkit MCP Server

## 1. Problem Solved

AI agents like Cline often need to interact with a user's project files to
perform tasks such as reading code, writing new code, modifying configurations,
or searching for specific information. Directly granting unrestricted filesystem
access poses significant security risks. Furthermore, requiring the user to
manually perform every filesystem action requested by the agent is inefficient
and hinders the agent's autonomy.

This NexusTools MCP server acts as a secure and **efficient core toolkit**
bridge, solving the following problems:

- **Security:** It confines the agent's filesystem operations strictly within
  the boundaries of the designated project root directory, preventing accidental
  or malicious access to sensitive system files outside the project scope.
- **Efficiency & Token Optimization:** It provides the agent with a dedicated
  set of **essential tools** (`list_files`, `read_content`, `write_content`,
  `move_items`, `copy_items`, etc.) designed for common agent workflows.
  - **Batch Operations:** Many tools support operating on multiple
    files/directories in one request.
  - **Partial Reads:** The `read_content` tool allows reading specific line
    ranges, significantly reducing token usage and processing time when dealing
    with large files.
- **Control:** Operations are performed relative to the project root, ensuring
  predictability and consistency.
- **Standardization:** It uses the Model Context Protocol (MCP), providing a
  standardized way for the agent and the server to communicate about core
  filesystem capabilities and operations.

## 2. How It Should Work

- The server runs as a background process, typically managed by the agent's host
  environment (e.g., Cline's VSCode extension).
- It listens for incoming MCP requests over a defined transport (initially
  stdio).
- Upon receiving a `call_tool` request for a NexusTools operation:
  1. It validates the request parameters against the tool's schema (using Zod).
  2. It resolves all provided relative paths against the `PROJECT_ROOT`.
  3. It performs security checks to ensure paths do not attempt to escape the
     `PROJECT_ROOT`.
  4. It executes the corresponding Node.js filesystem function (`fs.readFile`,
     `fs.writeFile`, etc.), **handling partial read logic for `read_content`
     based on `start_line`/`end_line` arguments**.
  5. It formats the result (or error) according to MCP specifications and sends
     it back to the agent.
- It responds to `list_tools` requests by providing a list of all available
  NexusTools and their input schemas.

## 3. User Experience Goals

- **Seamless Integration:** The server should operate transparently in the
  background. The user primarily interacts with the agent, and the agent
  utilizes the server's tools as needed.
- **Security Assurance:** The user should feel confident that the agent's
  filesystem access is restricted to the intended project directory.
- **Reliability:** The tools should perform filesystem operations reliably and
  predictably. Errors should be reported clearly back to the agent.
- **Performance:** Filesystem operations should be reasonably fast, not
  introducing significant delays into the agent's workflow. Partial reads should
  noticeably improve performance when applicable.
