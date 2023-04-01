const util = require('util');
const fs = require('fs');
const { v4: uuid4 } = require("uuid");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    read() {
        return readFileAsync('db/db.json', "utf8")
    }
    write(note) {
        return writeFileAsync('db/db.json', JSON.stringify(note))
    }
    addNotes(note) {
        const { title, text } = note
        if (!title || !text) {
            throw new Error("title and text cannot be blank")
        }

        const newNotes = { title, text, id: uuid4() }

        return this.getNotes()
            .then(notes => [...notes, newNotes])
            .then(updateNotes => this.write(updateNotes))
            .then(() => this.addNotes)
    }
    getNotes() {
        return this.read()
            .then(notes => {
                return JSON.parse(notes) || [];
            })
    }
    removeNotes(id) {
        return this.getNotes()
            .then(notes => notes.filter(note => note.id !== id))
            .then(keptNotes => this.write(keptNotes))
    }
}

module.exports = new Store;
