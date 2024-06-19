"use server";
import db from "@/src/db.js";
import { users, subjects, references, notes, folders } from "@/src/schema.js";
import { asc, eq } from "drizzle-orm";

// USER
export const createUser = async ({
  name,
  email,
  image,
  role = "user",
  subscribed_to = [],
}) => {
  try {
    console.log("creating user", name, email, image, role, subscribed_to);
    const user = await db
      .insert(users)
      .values({
        name,
        email,
        image,
        role,
        subscribed_to,
      })
      .returning();
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getUserByEmail = async (email) => {
  console.log("fetching user by email", email);
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user;
};

// SUBJECT
export const createSubject = async ({
  name,
  created_by,
  description,
  archived = false,
}) => {
  try {
    console.log("creating subject", name, created_by, description);
    const subject = await db.insert(subjects).values({
      name,
      created_by,
      description,
      archived,
    });
    return subject;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// REFERENCE
export const createReference = async ({
  name,
  subject_id,
  type = "link",
  url,
  user_id,
}) => {
  try {
    console.log("creating reference", name, subject_id, type, url, user_id);
    const reference = await db.insert(references).values({
      name,
      subject_id,
      type,
      url,
      user_id,
    });
    return reference;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// FOLDER
export const createFolder = async ({ name, subject_id, user_id }) => {
  try {
    console.log("creating folder", name, subject_id, user_id);
    const folder = await db.insert(folders).values({
      name,
      subject_id,
      user_id,
    });

    return folder;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// NOTE
export const createNote = async ({
  name,
  user_id,
  folder_id,
  include_global = false,
}) => {
  try {
    console.log("creating note", name, user_id, folder_id, include_global);
    const note = await db.insert(notes).values({
      name,
      user_id,
      folder_id,
      include_global,
    });
    return note;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// FETCH ALL SUBJECTS WHICH ARE NOT ARCHIVED
export const fetchSubjects = async () => {
  const subjectsList = await db
    .select()
    .from(subjects)
    .where(eq(subjects.archived, false))
    .orderBy(asc(subjects.created_at));
  return subjectsList;
};

// FETCH ALL ARCHIVED SUBJECTS
export const fetchArchivedSubjects = async () => {
  const subjectsList = await db
    .select()
    .from(subjects)
    .where(eq(subjects.archived, true))
    .orderBy(asc(subjects.created_at));
  return subjectsList;
};

// FETCH ALL REFERENCES FOR A SUBJECT
export const fetchReferences = async (subject_id) => {
  const referencesList = await db
    .select()
    .from(references)
    .where(eq(references.subject_id, subject_id))
    .orderBy(asc(references.created_at));
  return referencesList;
};

// FETCH ALL FOLDERS FOR A SUBJECT
export const fetchFolders = async (subject_id) => {
  const foldersList = await db
    .select()
    .from(folders)
    .where(eq(folders.subject_id, subject_id))
    .orderBy(asc(folders.created_at));
  return foldersList;
};

// FETCH ALL NOTES FOR A FOLDER
export const fetchNotes = async (folder_id) => {
  const notesList = await db
    .select()
    .from(notes)
    .where(eq(notes.folder_id, folder_id))
    .orderBy(asc(notes.created_at));
  return notesList;
};

// FETCH ALL NOTES FOR created_by USER
export const fetchNotesByUser = async (user_id) => {
  const notesList = await db
    .select()
    .from(notes)
    .where(eq(notes.user_id, user_id))
    .orderBy(asc(notes.created_at));
  return notesList;
};

// FETCH ALL REFERENCES FOR created_by USER
export const fetchReferencesByUser = async (user_id) => {
  const referencesList = await db
    .select()
    .from(references)
    .where(eq(references.user_id, user_id))
    .orderBy(asc(references.created_at));
  return referencesList;
};

// FETCH ALL FOLDERS FOR created_by USER
export const fetchFoldersByUser = async (user_id) => {
  const foldersList = await db
    .select()
    .from(folders)
    .where(eq(folders.user_id, user_id))
    .orderBy(asc(folders.created_at));
  return foldersList;
};

// GET ALL USERS
export const fetchAllUsers = async () => {
  console.log("fetching all users");
  const usersList = await db.select().from(users).orderBy(asc(users.id));
  return usersList;
};
