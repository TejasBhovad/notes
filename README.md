# Notes Site

Simple WebApp to aggregate notes in one place

> Site live at [dypatil.vercel.app](https://dypatil.vercel.app)

![home](/github/home.jpeg)
![upload](/github/upload.jpeg)

## Current stack:

1.  NextJS
2.  ShadCN UI library
3.  Drizzle (ORM)
4.  Neon DB (Postgres Database)
5.  Framer motion
6.  AuthJS (Authentication)
7.  PostHog (Analytics)

> Project Docuementation: https://tejasbhovad.notion.site/Notes-Site-d7245491911a4859bbe2d31eb2a4dd23?pvs=4

## Todo:

[moved to project documentation]

## Steps to Run locally

1. populate the `.env.example` files with own keys
2. install dependencies using `pnpm install` command
3. generate and push schema using drizzle orm

- `pnpm drizzle-kit generate`: Generate Schema for DB

- `pnpm drizzle-kit push`: Push Schema to DB

- `pnpm drizzle-kit studio`: view DB locally(you may need certain things installed and will be prompted to install those if needed)

4. `pnpm dev` to start the development server
