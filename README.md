# Library-Management-System

Library Management System is a software built with Node.js and PostgreSQL to manage the operations of a library.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the latest version of [Node.js](https://nodejs.org/en/download/) (v20.9.0 or later).
* You have a Windows/Linux/Mac machine.
* You have installed [PostgreSQL](https://www.postgresql.org/download/) (v16.1 or later).

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

4. Start the PostgreSQL service.
```bash
sudo service postgresql start
```

5. Create a `.env` file in the root of your project to select the required port:

```env
PORT=0000
```

6. Edit the .env file to reference your own PostgreSQL database. Make sure the DATABASE_URL matches the connection string of your database.:

```env
DATABASE_URL=postgres://<username>:<password>@localhost/library-management-system
```

7. Setup the database schema using Prisma. Navigate to the prisma directory and run the following command:

```bash
npx prisma db push
```


8. Run the following command to start the application:
```bash
npm start
```





