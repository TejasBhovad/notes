import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  image: text("image"),
  email: text("email").notNull().unique(),
  role: text("role").default("user"),
  subscribed_to: json("subscribed_to").default([]),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  archived: boolean("archived").default(false),
  description: text("description"),
  created_by: integer("created_by").references(() => users.id, {
    onDelete: "no action",
  }), // Added created_by field
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const references = pgTable("references", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject_id: integer("subject_id").references(() => subjects.id, {
    onDelete: "cascade",
  }),
  type: text("type").notNull().default("link"),
  url: text("url").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  user_id: integer("user_id").references(() => users.id),
});

export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject_id: integer("subject_id").references(() => subjects.id),
  user_id: integer("user_id").references(() => users.id),
  created_at: text("created_at").default("now()"),
  updated_at: text("updated_at").default("now()"),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  folder_id: integer("folder_id").references(() => folders.id, {
    onDelete: "cascade",
  }),
  include_global: boolean("include_global").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  folders: many(folders),
  notes: many(notes),
  subjects: many(subjects),
  references: many(references),
}));

export const subjectsRelations = relations(subjects, ({ many, one }) => ({
  folders: many(folders),
  references: many(references),
  createdBy: one(users, {
    fields: [subjects.created_by],
    references: [users.id],
  }), // Relation for created_by field
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [folders.subject_id],
    references: [subjects.id],
  }),
  user: one(users, { fields: [folders.user_id], references: [users.id] }),
  notes: many(notes),
}));

export const referencesRelations = relations(references, ({ one }) => ({
  subject: one(subjects, {
    fields: [references.subject_id],
    references: [subjects.id],
  }),
  // user can create multiple references
  user: one(users, { fields: [references.user_id], references: [users.id] }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, { fields: [notes.user_id], references: [users.id] }),
  folder: one(folders, { fields: [notes.folder_id], references: [folders.id] }),
}));
