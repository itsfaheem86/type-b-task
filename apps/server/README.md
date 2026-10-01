# Server

REST API for the TODO app, built with Express 5, Mongoose 9 and TypeScript. It is part of a pnpm + Turborepo monorepo; the React client lives in `apps/client`.

## Prerequisites

- Node.js 22.12 or newer
- pnpm 11 (`corepack enable` picks up the version pinned in the root `package.json`)
- MongoDB: either a local server or a MongoDB Atlas cluster (see [MongoDB connection](#mongodb-connection))

## Setup

From the repository root:

```bash
pnpm install
cp apps/server/.env.example apps/server/.env   # then edit MONGODB_URI if needed
```

## Running

| Command (from the repo root)     | What it does                                                |
| -------------------------------- | ----------------------------------------------------------- |
| `pnpm dev`                       | Starts the API **and** the client in watch mode (Turborepo) |
| `pnpm --filter server dev`       | Starts only the API, restarting on file changes (`tsx`)     |
| `pnpm --filter server build`     | Compiles TypeScript from `src/` to `dist/`                  |
| `pnpm --filter server start`     | Runs the compiled build (`dist/server.js`)                  |
| `pnpm lint` / `pnpm check-types` | ESLint / TypeScript checks across the monorepo              |

The API listens on `http://localhost:5000` by default. On startup it logs `MongoDB connected` and `Server listening on port 5000`.

## Environment variables

Variables are read from `apps/server/.env` using Node's built-in `--env-file` support (no `dotenv` dependency). Variables already set in the shell take precedence over the file.

| Variable      | Required | Default | Description                     |
| ------------- | -------- | ------- | ------------------------------- |
| `MONGODB_URI` | yes      | none    | MongoDB connection string       |
| `PORT`        | no       | `5000`  | Port the HTTP server listens on |

If `MONGODB_URI` is missing, the server exits immediately with `MONGODB_URI is not set`.

## MongoDB connection

The database name is part of the connection string (`todos` in the examples). The database and the `todos` collection are created automatically on the first insert.

### Local MongoDB

Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) or run it in Docker:

```bash
docker run -d --name mongo -p 27017:27017 mongo
```

```env
MONGODB_URI=mongodb://localhost:27017/todos
```

> If the connection is refused even though MongoDB is running, use `127.0.0.1` instead of `localhost`. Node may resolve `localhost` to the IPv6 address `::1`, while MongoDB listens on IPv4 only by default.

### MongoDB Atlas

1. Create a cluster and a database user in Atlas.
2. Under **Network Access**, allow your IP address.
3. Copy the connection string from **Connect → Drivers** and add the database name before the query string:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/todos?retryWrites=true&w=majority
```

Special characters in the password (such as `@`, `:` or `/`) must be URL-encoded.

## API

Base URL: `/api/todos`. All requests and responses use JSON.

| Method | Endpoint              | Body                       | Success                        |
| ------ | --------------------- | -------------------------- | ------------------------------ |
| GET    | `/api/todos`          | none                       | `200` list, newest first       |
| POST   | `/api/todos`          | `{ title, description? }`  | `201` the created todo         |
| PUT    | `/api/todos/:id`      | `{ title?, description? }` | `200` the updated todo         |
| PATCH  | `/api/todos/:id/done` | none                       | `200` todo with `done` flipped |
| DELETE | `/api/todos/:id`      | none                       | `204` no content               |

A todo looks like this:

```json
{
  "_id": "6abe338dbb564027e8e0a6fc",
  "title": "Buy milk",
  "description": "2L",
  "done": false,
  "createdAt": "2026-10-01T10:18:53.665Z",
  "updatedAt": "2026-10-01T10:18:53.665Z",
  "__v": 0
}
```

### Validation rules

- `title` is required on create. It is trimmed, and an empty or whitespace-only title is rejected.
- `description` is optional and trimmed.
- `PUT` needs at least one of `title` or `description`.
- Unknown fields are ignored. In particular, `done` can't be set through `POST` or `PUT`; it only changes through `PATCH /api/todos/:id/done`.

### Errors

Every error response has the same shape, so the client can always show `message`:

```json
{
  "message": "Validation failed",
  "errors": [{ "field": "title", "message": "Title is required" }]
}
```

| Status | When                                                                                                                                           |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `400`  | Validation failed (`errors` lists each field), malformed JSON, or an invalid id                                                                |
| `404`  | No todo with that id, or an unknown route                                                                                                      |
| `500`  | Unexpected error (for example, the database is down). The details are logged on the server, and the client only gets `"Something went wrong"`. |

## Project structure

The code follows an MVC layout:

```
src/
├── server.ts                  # entry point: checks env, connects to MongoDB, starts listening
├── app.ts                     # Express app: middleware, routes, error handling
├── config/db.ts               # Mongoose connection
├── routes/todo.routes.ts      # URL + method → validation → controller
├── schemas/todo.schema.ts     # zod schemas for request bodies
├── middleware/
│   ├── validate.ts            # validateBody(schema), validateId
│   └── error-handler.ts       # notFound + global JSON error handler
├── controllers/todo.controller.ts
├── models/todo.model.ts       # Mongoose schema (timestamps: true)
└── utils/http-error.ts        # HttpError(status, message, errors?)
```

A request goes **route → validation middleware → controller → model**. Controllers and middleware throw an `HttpError` for expected failures. Express 5 forwards thrown errors and rejected promises to the global error handler, which turns every error into the JSON shape above, so no `try/catch` is needed in the controllers.

## Assumptions and limitations

- **Single user:** there is no authentication, and every client sees and edits the same list.
- **No pagination:** `GET /api/todos` returns all todos, which is fine at TODO-list scale.
- **Open CORS:** any origin is allowed (`cors()` defaults). In production this should be restricted to the client's origin.
- **Clearing a description:** `PUT` with `"description": ""` stores an empty string rather than removing the field.
- **`__v` in responses:** Mongoose's internal version key is returned along with the documented fields.
- **Malformed JSON messages:** the `400` for an unparseable body passes through the JSON parser's own message.
- **No automated tests:** the endpoints were tested manually against a local MongoDB.
