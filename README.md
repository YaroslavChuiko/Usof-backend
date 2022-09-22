# Usof-backend

## Getting Started

##### Create mysql database

Run `create.sql` and `data.sql` files with mysql server to create and fill database 

##### Install dependencies

`npm install`

##### Connect to database

Open file `.env` and edit `DATABASE_URL` it should look like this example `mysql://USER:PASSWORD@HOST:PORT/DATABASE`

##### Introspect your database

Run the following command to introspect your database: `npx prisma db pull`

##### Generate Prisma Client

This command reads your Prisma schema and generates your Prisma Client library: `npx prisma generate`

##### Start the API server

Run `npm run dev` to start Next.js in development mode

or

Run `npm run build` to build the application for production usage

Run `npm run start` to start a Next.js production server

##### Login

Follow the default link http://localhost:3000 and enter username: `admin`, password: `admin`

### Built With

- Next.js
- Mysql
- Prisma
- React-admin
- React
- Jsonwebtoken
- Formidable
- Nodemailer
