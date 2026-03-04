# FlowFix: Event-Driven Workflow Automation Platform

**FlowFix** is a high-reliability, open-source workflow automation platform inspired by Zapier. It empowers users to connect disparate web services (APIs) and automate tasks through a simple visual builder, using an event-driven architecture powered by Kafka for robust background job handling.

## ✨ Key Features

- **Event-Driven Core:** Utilizes **Apache Kafka** for asynchronous, guaranteed job processing, ensuring resilience and scalability for background task execution.

- **Visual Workflow Builder:** Intuitive UI (React/Next.js) allowing users to visually link a single **Trigger** to a sequence of **Actions** without writing code.

- **Secure API Integrations:** Integrates third-party APIs (e.g., Notion, Razorpay, Solana) with secure **AES Encryption** for protecting user credentials and API keys.

- **Dynamic State Propagation (Crucial):** **Engineered seamless state transfer** between actions by serializing the full execution context (including generated data like Notion URLs) directly into the Kafka payload for the next step.

- **Pluggable Integrations:** Built architecture to easily add new trigger and action APIs (e.g., Notion, Resend, Solana, Razorpay).

- **Full-Stack Implementation:** Complete solution including a decoupled API layer, dedicated background worker services, and a persistent PostgreSQL data store.

## 🛠️ Tech Stack & Tools

| **Category**    | **Technologies Used**                                    |
| :-------------- | :------------------------------------------------------- |
| **Frontend**    | React, **Next.js**, **Tailwind CSS**, TypeScript         |
| **Backend/API** | **Node.js**, **Express.js**, TypeScript, JWT             |
| **Database**    | **PostgreSQL**, **Prisma** (ORM)                         |
| **Messaging**   | **Apache Kafka**, Zookeeper                              |
| **DevOps**      | **Docker**, **Docker Compose**                           |
| **Security**    | AES Encryption (for credentials), bcrypt (for passwords) |
| **Monorepo**    | **Turborepo**                                            |

## 🏗️ Architecture Overview

The system is designed around separation of concerns using Dockerized microservices orchestrated by Kafka:

1. **`backend` (API/UI):** Handles user authentication, flow definition (CRUD), and serves the Next.js frontend.

2. **`worker` (Consumer):** Dedicated Node.js service(s) that consume Kafka messages, execute the defined action logic (e.g., Notion API call), and manage state persistence for the next step.

3. **`postgres`:** Centralized persistent storage for user data, flow definitions, and credentials.

4. **`kafka` / `zookeeper`:** Provides the highly reliable message bus essential for guaranteeing action execution and contextual data transfer between worker services.

## ⚙️ Local Development Setup

These instructions assume you have Git, Node.js, and Docker installed.

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/KrrishAg/FlowFix.git
cd flowfix
npm install
```

### 2. Start Infrastructure (Postgres & Kafka)

We use Docker Compose to manage all infrastructure dependencies.

```bash
docker-compose up -d --build
```

### 3. Database Migration & Seeding

Ensure the database schema is prepared and seeded with initial data (e.g., available Triggers/Actions).

```bash
cd packages/db
npx prisma migrate dev && npx prisma db seed
cd ../..
```

### 4. Run the application

Start the API backend and Next.js frontend using the Turborepo monorepo runner:

```bash
npm run dev
```

The application will be accessible at http://localhost:3000.

## 🧑‍💻 Usage

- **Sign Up:** Navigate to http://localhost:3000/signup.

- **Create Flow:** Go to the /dashboard and click "Create Flow

- **Configure:** Select a Trigger and sequence multiple Actions. Configure metadata for each step.

- **Publish:** Publish the flow. The dedicated Kafka Workers will execute the flow steps asynchronously.

## 🤝 Contribution

Contributions are welcome! Please open an issue first to discuss your proposed changes or features.
