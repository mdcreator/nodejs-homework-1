import * as fs from "fs/promises";
import * as path from "path";
import shortid from "shortid";
import { handleError } from "./lib/handlerror.js";
import { isAccessible } from "./lib/accessible.js";
import createDirnameandFileName from "./lib/dirname.js";

// contacts.js
const { __dirname } = createDirnameandFileName(import.meta.url);
const contactsPath = path.join(__dirname, "/db/contacts.json");

async function getContactsList(p) {
  try {
    const contacts = JSON.parse(await fs.readFile(p));
    return contacts;
  } catch (e) {
    handleError(e);
  }
}

// TODO: задокументировать каждую функцию
async function listContacts(path = contactsPath) {
  try {
    if (await isAccessible(path)) {
      console.table(await getContactsList(path));
    } else {
      throw { message: `Wrong path: '${path}'` };
    }
  } catch (error) {
    handleError(error);
  }
}

async function getContactById(contactId, path = contactsPath) {
  try {
    if (await isAccessible(path)) {
      const contacts = await getContactsList(path);
      const contact = contacts.find((c) => c.id.toString() === contactId);
      if (!contact)
        throw { message: `No contact was found with ID '${contactId}'` };
      console.log(contact);
      return contact;
    } else {
      throw { message: `Wrong path: '${path}'` };
    }
  } catch (error) {
    handleError(error);
  }
}

async function removeContact(contactId, path = contactsPath) {
  try {
    if (await isAccessible(path)) {
      const contacts = await getContactsList(path);
      const filteredContacts = contacts.filter(
        (c) => c.id.toString() !== contactId
      );
      if (contacts.length === filteredContacts.length)
        throw {
          message: `No contact was found with ID '${contactId}', and no contact  was deleted`,
        };
      await fs.writeFile(path, JSON.stringify(filteredContacts));
      console.log(`Contact with ID '${contactId}' was removed successfully`);
      listContacts(path);
    } else {
      throw {
        message: `Wrong path: '$path}'`,
      };
    }
  } catch (error) {
    handleerror(error);
  }
}

async function addContact(newOneContact, path = contactsPath) {
  try {
    if (await isAccessible(path)) {
      const contactToAdd = {
        id: shortid.generate(),
        ...newOneContact,
      };
      const contacts = await getContactsList(path);
      const newContacts = [...contacts, contactToAdd];
      await fs.writeFile(path, JSON.stringify(newContacts));
      console.log(`Contact was added successfully`);
      listContacts(path);
    } else {
      throw {
        message: `Wrong path: '${path}'`,
      };
    }
  } catch (error) {
    handleError(error);
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
