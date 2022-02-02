import { v4 as uuid } from "uuid"

const fs = require("fs")
let users = require("data/users.json")

export const usersRepo = {
  getAll,
  updateItems,
  delete:_delete
}

function getAll() {
  return users
}

function updateItems(id, { email, value, isprivate, itemsid }) {
  const user = users.find((x) => x.email === email)
  console.log(itemsid,"*/*/*/*/*/*/*/*/*");
  const item = {
    id: itemsid ? itemsid : uuid() ,
    value: value,
    isprivate: isprivate,
    dateCreated:new Date().toISOString()
  }
   if (isprivate) {
       user.privateItems.push(item)
   }else{
       user.publicItems.push(item)
   }
 // save data
  saveData()
}

function _delete(id, { sourceemail, value, isprivate, itemsid }) {
  // filter out deleted user and save
  user = users.filter(x => x.email === sourceemail);
  console.log(user.publicItems, "------------");

  saveData();

}


// private helper functions

function saveData() {
  fs.writeFileSync("data/users.json", JSON.stringify(users, null, 4))
}
