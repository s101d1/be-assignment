# <b>REST API Backend that manages user’s accounts and transactions (send/withdraw)</b>

The backend is built with [Fastify](https://fastify.dev/) framework.

JWT is used for authentication by using [fastify/jwt](https://github.com/fastify/fastify-jwt) plugin.

The SQL database connection is handled by [Prisma](https://www.prisma.io/) ORM library.

## <b> Getting Started </b>

### Requirements

* Node v18+
* Docker
* PostgreSQL (if you want to run the app without docker)

### How to run the app without docker

* Install the required packages:
    ```bash
    $ npm install
    ```

* Prepare a PostgreSQL database instance and modify the `DATABASE_URL` environment variable in `.env` file accordingly.

* Create the database schema:
    ```bash
    $ npx prisma migrate dev --name init
    $ npx prisma generate
    ```

* Run the app:
    ```bash
    $ npm run dev
    ```

    The server will run at http://localhost:3000

    The swagger API docs can be accessed at http://localhost:3000/docs

### How to run the app in docker container

* Make sure you have `docker-compose` or `docker compose` plugin installed, and then run:
    ```bash
    $ docker-compose up --build
    ```
    or with docker compose plugin:
    ```bash
    $ docker compose up --build
    ```

    The server will run at http://localhost:3000

    The swagger API docs can be accessed at http://localhost:3000/docs

## API Endpoints Information

1. `POST /signup` (Signup endpoint)
    * Create a new user.
    * Accepts `email`, `password`, `confirm_password`, and `name` values.
    * Returns a token (JWT) with 1 hour expiry time if successful.

2. `POST /login` (Login endpoint)
    * Perform log-in for existing user.
    * Accepts `email` and `password` values.
    * Returns a token (JWT) with 1 hour expiry time if successful.

3. `POST /accounts` (Create new account endpoint)
    * Create a new account for the logged-in user.
    * Endpoint is protected by JWT authentication (`Bearer <token>` header is required).
    * Accepts `type` ("DEBIT", "CREDIT", "LOAN"), `currency`, and `initialBalance` values.
    * Only one account per `type` can exist and `initialBalance` must be 0 or bigger.

4. `GET /accounts` (Get accounts endpoint)
    * Return list of accounts and their transactions for the logged-in user.
    * Endpoint is protected by JWT authentication (`Bearer <token>` header is required).

5. `POST /transactions/send` (Create new Send transaction endpoint)
    * Create a new Send transaction for an account owned by the logged-in user.
    * Endpoint is protected by JWT authentication (`Bearer <token>` header is required).
    * Accepts `currency`, `amount`, `toAddress`, and `accountId` values.
    * `amount` value must be greater than 0 and there should be enough balance in the account to perform the transaction.
    * After 30 seconds, the transaction status will be updated to "COMPLETED" (if no error) and the account's balance will be deducted by the transaction amount.

6. `POST /transactions/withdraw` (Create new Withdraw transaction endpoint)
    * Create a new Withdraw transaction for an account owned by the logged-in user.
    * Endpoint is protected by JWT authentication (`Bearer <token>` header is required).
    * Accepts `currency`, `amount`, `toAddress`, and `accountId` values.
    * `amount` value must be greater than 0 and there should be enough balance in the account to perform the transaction.
    * After 30 seconds, the transaction status will be updated to "COMPLETED" if successful, and the account's balance will be deducted by the transaction amount. If there is error, the transaction status will be updated to "FAILED".

The API endpoint's request parameter and response body details can be seen in the swagger API docs (http://localhost:3000/docs)
