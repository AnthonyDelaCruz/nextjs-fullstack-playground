import { hash } from "@node-rs/argon2";
import db from "../src/lib/db";
import { Roles, TimeUnit } from "@prisma/client";
import { startOfMonth, subMonths } from "date-fns";

const DEVELOPER_TASKS = [
  {
    name: "Feature Development",
  },
  {
    name: "Bug Fixing",
  },
  {
    name: "Code Review",
  },
  {
    name: "Refactoring",
  },
  {
    name: "Pair Programming",
  },
];

const DEVELOPER_ACTIVITIES = [
  "Codded landing page",
  "Created a new feature",
  "Fixed a bug",
  "Refactored code",
  "Paired with a teammate",
  "Reviewed code",
  "Attended a meeting",
  "Worked on a project",
  "Contributed to open-source",
  "Participated in a hackathon",
];

async function main() {
  const hasTags = await db.tags.count();

  if (!!hasTags) {
    console.log("Tags already exist, skipping seeding");
    return;
  } else {
    await db.tags.createMany({
      data: DEVELOPER_TASKS,
    });

    console.log("Tags seeded successfully");
  }

  const hasUsers = await db.user.count();

  if (!!hasUsers) {
    console.log("Users already exist, skipping seeding");
    return;
  } else {
    const password = "super-secret-password";
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const users = await db.$transaction([
      db.user.create({
        data: {
          username: "tm-admin",
          passwordHash,
          role: Roles.ADMIN,
        },
      }),
      db.user.create({
        data: {
          username: "tm-tony",
          passwordHash,
          role: Roles.USER,
        },
      }),
    ]);

    console.log("Users seeded successfully");

    const dates = [
      startOfMonth(new Date()), // Start of July
      startOfMonth(subMonths(new Date(), 1)), // Start of June
      startOfMonth(subMonths(new Date(), 2)), // Start of May
    ];

    const tags = await db.tags.findMany();

    // Create 5 checkins for each date to visualization purposes
    for (const date of dates) {
      await db.$transaction([
        db.checkin.create({
          data: {
            timeSpent: Math.floor(Math.random() * 5) + 1,
            timeUnit: TimeUnit.HOUR,
            activity:
              DEVELOPER_ACTIVITIES[
                Math.floor(Math.random() * DEVELOPER_ACTIVITIES.length)
              ],
            tags: {
              connect: {
                id: tags[Math.floor(Math.random() * tags.length)].id,
              },
            },
            createdAt: date,
            user: {
              connect: {
                id: users[1].id,
              },
            },
          },
        }),
        db.checkin.create({
          data: {
            timeSpent: Math.floor(Math.random() * 5) + 1,
            timeUnit: TimeUnit.HOUR,
            activity:
              DEVELOPER_ACTIVITIES[
                Math.floor(Math.random() * DEVELOPER_ACTIVITIES.length)
              ],
            tags: {
              connect: {
                id: tags[Math.floor(Math.random() * tags.length)].id,
              },
            },
            createdAt: date,
            user: {
              connect: {
                id: users[1].id,
              },
            },
          },
        }),
        db.checkin.create({
          data: {
            timeSpent: Math.floor(Math.random() * 5) + 1,
            timeUnit: TimeUnit.HOUR,
            activity:
              DEVELOPER_ACTIVITIES[
                Math.floor(Math.random() * DEVELOPER_ACTIVITIES.length)
              ],
            tags: {
              connect: {
                id: tags[Math.floor(Math.random() * tags.length)].id,
              },
            },
            createdAt: date,
            user: {
              connect: {
                id: users[1].id,
              },
            },
          },
        }),
        db.checkin.create({
          data: {
            timeSpent: Math.floor(Math.random() * 5) + 1,
            timeUnit: TimeUnit.HOUR,
            activity:
              DEVELOPER_ACTIVITIES[
                Math.floor(Math.random() * DEVELOPER_ACTIVITIES.length)
              ],
            tags: {
              connect: {
                id: tags[Math.floor(Math.random() * tags.length)].id,
              },
            },
            createdAt: date,
            user: {
              connect: {
                id: users[1].id,
              },
            },
          },
        }),
        db.checkin.create({
          data: {
            timeSpent: Math.floor(Math.random() * 5) + 1,
            timeUnit: TimeUnit.HOUR,
            activity:
              DEVELOPER_ACTIVITIES[
                Math.floor(Math.random() * DEVELOPER_ACTIVITIES.length)
              ],
            tags: {
              connect: {
                id: tags[Math.floor(Math.random() * tags.length)].id,
              },
            },
            createdAt: date,
            user: {
              connect: {
                id: users[1].id,
              },
            },
          },
        }),
      ]);
    }

    console.log("Check-ins seeded successfully");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
