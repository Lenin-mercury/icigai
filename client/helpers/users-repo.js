import { v4 as uuid } from "uuid"

const fs = require("fs")
let users = require("data/users.json")

export const usersRepo = {
  getAll,
  updateItems
}

function getAll() {
  return users
}

function updateItems(id, { email, value, isprivate }) {
  const user = users.find((x) => x.email === email)
  const item = {
    id: uuid(),
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

// private helper functions

function saveData() {
  fs.writeFileSync("data/users.json", JSON.stringify(users, null, 4))
}
