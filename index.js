import program from "./lib/commander.js";
import contacts from "./contacts.js";
const { listContacts, getContactById, removeContact, addContact } = contacts;

program.parse();
const options = program.opts();

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      listContacts();
      break;
    case "get":
      getContactById(id);
      break;
    case "add":
      addContact({
        name,
        email,
        phone,
      });
      break;
    case "remove":
      removeContact(id);
      break;
    default:
      console.warn("\x1B[31m Unnown action type!");
  }
}

invokeAction(options);
