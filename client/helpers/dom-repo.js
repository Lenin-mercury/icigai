const fs = require('fs');

let domdata = require('data/domdata.json');

export const domRepo = {
    getAll,
    getById,
    create
};

function getAll() {
    return domdata;
}

function getById(id) {
    return domdata.find(x => x.id.toString() === id.toString());
}

function create({ title, firstName, lastName, email, role, password }) {
    const dom = { title, firstName, lastName, email, role, password };

    // validate
    if (domdata.find(x => x.email === dom.email))
        throw `dom with the email ${dom.email} already exists`;

    // generate new dom id
    dom.id = domdata.length ? Math.max(...domdata.map(x => x.id)) + 1 : 1;

    // set date created and updated
    dom.dateCreated = new Date().toISOString();

    // add and save dom
    domdata.push(dom);
    saveData();
}

// private helper functions

function saveData() {
    fs.writeFileSync('data/domdata.json', JSON.stringify(domdata, null, 4));
}