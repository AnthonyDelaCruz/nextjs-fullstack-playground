## Description
Basic full stack application playground to try out new Shadcn charts and Lucia auth for authentication

## Tech Stack
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Shadcn](https://ui.shadcn.com/)
- [Postgres](https://www.postgresql.org/)
- [Lucia Auth](https://lucia-auth.com/)
- [Docker](https://www.docker.com/)

Screenshots of the application
![Screenshot 2024-08-04 at 1 00 46 PM](https://github.com/user-attachments/assets/7b73384e-b233-4f30-8e24-061083f2f5a2)
![Screenshot 2024-08-04 at 1 02 28 PM](https://github.com/user-attachments/assets/259e6f35-1759-439e-8e16-0e4c693b577c)
![Screenshot 2024-08-04 at 1 02 43 PM](https://github.com/user-attachments/assets/4258ff87-f6fd-4092-b3cf-3b4e920ce9d8)

## Pre-requisites

- Docker
- Docker Compose

Refer to [get docker webpage](https://docs.docker.com/get-docker/) to install docker on your machine.

## Getting Started

Create a `.env` file based on the `.env.example` file

## Running the application

Start all required services using docker compose

```
npm run docker:dev
```

This will run 2 services in docker containers:

- Postgres database
- Next.js application

The **Next.js** application will be available at http://localhost:3000

## !! Note !!

- On application startup, the database will be seeded with some data, it will create 2 users, one **Admin** and the other with a **User** role. The user with the User role will have 15 pre-made check-ins attached to them across 3 months for data visualization purposes, the data was randomized so there will be a chance that the check-in info will not make sense.
  But you can still register new users in the `/authenticate` page and also create check-ins of your own.

Admin Credentials:

- Username: tm-admin
- Password: super-secret-password

User Credentials:

- Username: tm-tony
- Password: super-secret-password

If you install new dependencies, you will need to rebuild the docker images, run the command
to stop the containers first in **Stopping the application step** then run the build command below. After the images are rebuilt you can run the dev command again, refer to the **Running the application** step.

```
npm run docker:build
```

## Stopping the application

```
npm run docker:down
```
