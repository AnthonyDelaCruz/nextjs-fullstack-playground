import { Routes } from "@/constants/routes";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen max-w-[600px] container py-24 flex flex-col items-center gap-5">
      <Link href={Routes.DASHBOARD} className="flex gap-2 font-bold">
        Back to App <ArrowRight />
      </Link>
      <h1 className="text-2xl lg:text-4xl font-bold">Project Journal</h1>

      <div>
        <h2 className="font-semibold text-xl">July 12, 2024</h2>
        <p className="text-semibold">Deciding tech stack for the project</p>
        <br />
        <div className="space-y-2">
          <p className="text-normal">
            Why NextJS, Prisma, Postgres, Lucia Auth?
          </p>
          <p className="text-gray-700 text-sm">
            - Chose NextJS (App Router) for file based routing, nested layouts
            and React Server Components
          </p>
          <p className="text-gray-700 text-sm">
            - Chose Prisma for migrations and as an ORM, also for the
            auto-generated types that is modeled after the database schema
          </p>
          <p className="text-gray-700 text-sm">
            - Chose Postgres as the relational database since the data for this
            project will be related to one another, and this also happens to be
            the DB I have the most experience with.
          </p>
          <p className="text-gray-700 text-sm">
            - For authentication, I chose Lucia Auth. I contemplated with wether
            to NextAuth or Lucia Auth, but decided to go with Lucia Auth since
            it does the job of authentication and still gives you more control
            compared to other auth libraries. For this project, I wanted to do a
            credential based authentication with username and password, NextAuth
            deliberately made it difficult to do this.
          </p>
          <p className="text-gray-700 text-sm">
            - Chose Shadcn as the UI library since it very extensible and comes
            with very good default styling, theming and accessibility since it
            uses radix under the hood.
          </p>
          <p className="text-semibold">
            Dockerizing the development environment
          </p>
          <p className="text-gray-700 text-sm">
            - Used Docker Compose to initialize the development environment with
            Postgres, Prisma and NextJS. A dev that has docker on their machine
            will be able to run, build, tear down the entire application with a
            single command.
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-xl">July 13, 2024</h2>
        <p className="text-normal">Breaking down project into smaller tasks</p>
        <br />

        <div className="space-y-2">
          <p className="text-gray-700 text-normal">Docker</p>
          <div className="space-y-2">
            <p className="text-gray-700 text-sm">
              - Created the docker-compose and docker files, NextJS made it easy
              since they have examples of how to dockerize NextJS application
              for both development and production, for this project we only use
              their development example and extended it with what we need.{" "}
              <Link
                className="text-blue-500 font-semibold underline"
                href="https://github.com/vercel/next.js/tree/canary/examples/with-docker"
              >
                Dockerizing your NextJS app
              </Link>
            </p>
          </div>
          <p className="text-gray-700 text-normal">Initial UI</p>
          <div className="space-y-2">
            <p className="text-gray-700 text-sm">
              - The requirement of this application states that it should be
              able to support users other than you, with this I started to
              create authentication forms for both login and signup. I did this
              client side so that I could use{" "}
              <Link
                className="text-blue-500 font-semibold underline"
                href="https://www.react-hook-form.com/"
              >
                react-hook-form
              </Link>{" "}
              for easier form state management and{" "}
              <Link
                className="text-blue-500 font-semibold underline"
                href="https://zod.dev/"
              >
                zod
              </Link>{" "}
              for form validation, both of the mentioned libraries are also what
              shadcn uses for their Form components.
            </p>
          </div>
          <p className="text-gray-700 text-normal">Implementing Lucia Auth</p>
          <div className="space-y-2">
            <p className="text-gray-700 text-sm">
              - After forms are done, I started to implement{" "}
              <Link
                className="text-blue-500 font-semibold underline"
                href="https://lucia-auth.com/"
              >
                Lucia Auth
              </Link>{" "}
              with Prisma, though Lucia is fairly new and the docs are a bit all
              over the place, once I got the mental model of what it does, it
              was faily simple to grasp, at least for what I implemented this
              project.
            </p>
          </div>
          <p className="text-gray-700 text-normal">
            Creating the database schema
          </p>
          <div className="space-y-2">
            <p className="text-gray-700 text-sm">
              - I proceeded to create the database schemas with how I imagined
              it would be in the application.
              <br />
              <br />
              TLDR
              <br />
              - User
              <br />
              - Checkin (has many to one relationship with User)
              <br />
              - Tags (has many to many relationship with Checkin)
              <br />
              - Sessions (has one to one relationship with User)
              <br />
              <br />
              and a few more others that I will not mention. View{" "}
              <code className="bg-gray-300">schema.prisma</code> file for a more
              detailed view of the database schema.
            </p>
          </div>
          <p className="text-gray-700 text-normal">NextJS Server Actions</p>
          <div className="space-y-2">
            <p className="text-gray-700 text-sm">
              - The new App Router version of NextJS allows you to run functions
              that only get invoked on the server side, this is what I will use
              for creating, viewing, deleting check-ins as well as logging in,
              signing up and logging out. I went this route since the only
              consumer for our database resources is this application so I did
              not create a separate backend for this project.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-xl">July 14, 2024</h2>
        <p className="text-normal">Putting it all together</p>
        <br />

        <div className="space-y-2">
          <p className="text-gray-700 text-normal">
            Shadcn, Recharts, Tanstack Table, Admin Roles
          </p>
          <div className="space-y-2">
            <p className="text-gray-700 text-sm">
              - I heavily used shadcn components for Dialogs, Dropdowns, Forms,
              Tabs and it still amazes me how much it makes our life easier when
              it comes to developing UI, especially in the accessibility aspect,
              which I admit I did not pour much though into when making UIs.
            </p>
            <p className="text-gray-700 text-sm">
              - For data visualization, shadcn uses recharts for their data
              visualization components, I transformed the check-ins fetched form
              the server client side into data how I want them to be represented
              when passed to the charts.
            </p>
            <p className="text-gray-700 text-sm">
              - For the requirement of displaying over 1000 check-ins, I used{" "}
              <Link
                className="font-semibold underline text-blue-500"
                href="https://tanstack.com/table/latest"
              >
                Tanstack Table
              </Link>
              , which is a headless table component for React. I did not opt for
              server side pagination since the upper limit for the check-ins for
              this use-case is in the thousands, which I believe can be handled
              in the client side and is acceptable for this project. Pagination
              for check-in records will be handled by Tanstack Table.
            </p>
            <p className="text-gray-700 text-sm">
              - For user roles, there are only 2, which are the Admin and the
              User. I created a seed script that will create these users, the
              default user with the User role will have check-ins attached to
              them across 3 months for data visualization purposes.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-xl">Issues Encountered</h2>
        <p className="text-normal">
          Below are some of the issues I experienced and how I worked around
          them.
        </p>
        <br />

        <div className="space-y-2">
          <p className="text-gray-700 text-normal">Migrations</p>

          <div className="space-y-2">
            <p className="text-gray-700 text-sm">
              - As someone who is still exploring docker, I ran into an issue
              where my prisma definitions did not update when I ran{" "}
              <code className="bg-gray-300">prisma migrate dev</code>, after
              losing some braincells trying to find what is wrong, I found that
              when running said command above, it also updates your{" "}
              <code className="bg-gray-300">node_modules</code> folder, which is{" "}
              <span className="font-bold">NOT</span> carried over to you docker
              container. Solution for this was to run this command inside the{" "}
              <code className="bg-gray-300">dockerFile</code> file, so that in
              application start-up, it will have the latest definitions of your
              database schema.
            </p>
          </div>

          <p className="text-gray-700 text-normal">Multi-select Tags</p>
          <div className="space-y-2">
            <p className="text-gray-700 text-sm">
              - My original plan was to have the user assign multiple tags to a
              checkin. But I soon realized how this made it harder when
              visualizing the data since I will not know how much of the
              duration is attributed to which tag. In this case I replaced the
              multi-select component back to a single select. The original
              multi-select component is still available in the codebase, it is
              in <code className="bg-gray-300">MultiSelectInput.tsx</code>{" "}
              Another issue I had with this component is that it messes up the
              tab indexes when using the keyboard to navigate through the create
              check-in form, I still have not found a workaround for that issue.
            </p>
          </div>

          <p className="text-gray-700 text-normal">Multi user roles</p>
          <div className="space-y-2">
            <p className="text-gray-700 text-sm">
              - I planned to have multiple roles attached to a user to display
              more granular authorization checks in the application, the plan
              was to extract the <span className="font-bold">roles</span> array
              from the current logged in user and then apply the checks based on
              the values attached, but the issue I ran into was related to Lucia
              Auth. By default, Lucia Auth only queries the user table from the
              database when you validate a session to fetch the current user, it
              does not support querying for related data. With this limitation,
              I updated the models and attached the role column to the user
              model instead, there may be other alternatives to this issue, but
              due to the time constraint I chose to keep it simple.
            </p>
          </div>

          <p className="text-gray-700 text-normal font-bold">
            If you have read this far...
          </p>
          <div className="space-y-2">
            <p className="text-gray-700 text-sm">
              - Thank you for taking the time to review my entry, and do please
              provide some feedback, I am always open to suggestions and
              improvements. <HeartFilledIcon />
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
