# TODO App

A full-stack TODO app: a React client and an Express + MongoDB API, organised as a pnpm + Turborepo monorepo.

You can list, create, edit, complete and delete todos. Every change appears instantly through optimistic updates and is rolled back if the server rejects it.

## Stack

| Part     | Technology                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| Client   | React 19, Vite, TypeScript, Redux Toolkit Query, shadcn/ui, Tailwind CSS v4, react-hook-form + zod, sonner |
| Server   | Node.js, Express 5, TypeScript, Mongoose 9, zod                                                            |
| Database | MongoDB (local or Atlas)                                                                                   |
| Tooling  | pnpm workspaces, Turborepo, ESLint (typescript-eslint), Prettier                                           |

## Repository layout

```
.
├── apps/
│   ├── client/                 # React app → see apps/client/README.md
│   └── server/                 # Express API → see apps/server/README.md
├── packages/
│   ├── eslint-config/          # shared ESLint configs
│   └── typescript-config/      # shared tsconfig base
├── turbo.json                  # Turborepo task pipeline
└── pnpm-workspace.yaml
```

## Quick start

**Prerequisites:** Node.js 22.12+, pnpm 11 (`corepack enable`), and a MongoDB instance (local or Atlas).

```bash
pnpm install
cp apps/server/.env.example apps/server/.env   # set MONGODB_URI if yours differs
pnpm dev
```

- Client: http://localhost:5173
- API: http://localhost:5000/api/todos

`pnpm dev` starts both apps in parallel. The client's `.env` is optional: by default it calls the API at `http://localhost:5000/api`.

## Scripts

Run these from the repository root. Turborepo runs each one in every app that defines it and caches the results.

| Command             | What it does                                |
| ------------------- | ------------------------------------------- |
| `pnpm dev`          | Starts the client and the API in watch mode |
| `pnpm build`        | Builds both apps                            |
| `pnpm lint`         | Runs ESLint in both apps                    |
| `pnpm check-types`  | Type-checks both apps                       |
| `pnpm format`       | Formats the repo with Prettier              |
| `pnpm format:check` | Checks formatting without changing files    |

To run a single app, use a filter: `pnpm --filter server dev` or `pnpm --filter client dev`.

## API

| Method | Endpoint              | Description                         |
| ------ | --------------------- | ----------------------------------- |
| GET    | `/api/todos`          | Get all todos                       |
| POST   | `/api/todos`          | Create a todo                       |
| PUT    | `/api/todos/:id`      | Update a todo's title / description |
| PATCH  | `/api/todos/:id/done` | Toggle a todo's done status         |
| DELETE | `/api/todos/:id`      | Delete a todo                       |

Request and response details, validation rules and the error format are in [`apps/server/README.md`](apps/server/README.md).

## More documentation

- [`apps/server/README.md`](apps/server/README.md): server setup, MongoDB connection (local and Atlas), API reference, assumptions and limitations
- [`apps/client/README.md`](apps/client/README.md): client setup, environment variables, architecture, assumptions and limitations
