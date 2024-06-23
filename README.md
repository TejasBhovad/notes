# Notes Site

Simple WebApp to aggregate notes in one plaxe

# Current stack:

1.  NextJS
2.  ShadCN UI
3.  Drizzle ORM
4.  Neon DB
5.  Framer motion

> Project Docuementation: https://tejasbhovad.notion.site/Notes-Site-d7245491911a4859bbe2d31eb2a4dd23?pvs=4

# Todo (Testng DB):

- update tables and re-migrate cause time stamps not correctly working []

## Adding Stuff

- check adding user [x]
- check adding subjects [x]
- check adding references within subjects [x]
- check adding folders within subjects [x]
- check adding notes within folders [x]

## Querying Stuff

- query user with all notes uploaded [x]
- query subjects with all reference ids, folder ids [x]
- query all references [x]
- query all folders [x]

# Commands

`pnpm drizzle-kit generate`

`pnpm drizzle-kit push`

`pnpm drizzle-kit studio`
