# Library-Management-System

Library Management System is a software built with Node.js and PostgreSQL to manage the operations of a library.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the latest version of [Node.js](https://nodejs.org/en/download/) (v20.9.0 or later).
* You have a Windows/Linux/Mac machine.
* You have installed [PostgreSQL](https://www.postgresql.org/download/) (v16.1 or later).
*  You have Docker installed on your machine. You can download and install Docker from here [Docker](https://www.docker.com/products/docker-desktop/) (v4.26.0).

## Installing Library-Management-System

To install Library-Management-System, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/<your-username>/Library-Management-System.git
```

2. Navigate into the project directory:
```bash
cd Library-Management-System
```

3. Install the dependencies:
```bash
npm install
```

4. Start the PostgreSQL service (note for linux if using windows make sure the service is running).
```bash
sudo service postgresql start
```

5. Create a `.env` file in the root of your project to select the required port and set jwtsecret and REDIS_URL here the redis url is for one i hosted on docker on my machine:

```env
PORT=0000
JWT_SECRET=secret
REDIS_URL=redis://localhost:6379
```

6. Modify the .env file in *IN THE DATABASE DIRECTORY* to point to your specific PostgreSQL database. Ensure that the DATABASE_URL aligns with the connection string of your database. Note that you should not create the database; simply provide the correct string, and Prisma will handle the table setup:

```env
DATABASE_URL=postgres://<username>:<password>@localhost/library-management-system
```

7. Setup the database schema using Prisma. Navigate to the database directory run the following command:

```bash
npx prisma db push
```

8. Setup redis on docker by running this command:

```bash
docker-compose up -d
```

9. Finally run the following command to start the application:
```bash
npm start
```

## User Interaction

1. Login Sequence

![login sequence diagram](./sequence_diagram/login_sequence_diagram.png)

2. User Request

![user request sequence diagram](./sequence_diagram/users_sequence_diagram.png)