This is a time tracking application built using [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), [Shadcn](https://ui.shadcn.com/), [Postgres](https://www.postgresql.org/), [Lucia Auth](https://lucia-auth.com/) and [Docker](https://www.docker.com/)

Screenshots of the application
![user-table](https://github.com/user-attachments/assets/a19b0fb5-2664-4a13-af20-e66e5f912f0f)
![charts](https://github.com/user-attachments/assets/43bb63ee-c0a0-448a-bd62-d6b4cee196fd)


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
