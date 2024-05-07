const DB = require('./db.json');
const { saveToDatabase } = require("./utils");

const getAllPersons = (queryParams) => {
    try {
        let persons = DB.person;
        if(queryParams.lastName) {
            return persons.filter((person) => 
                person.lastName.toLowerCase().includes(queryParams.lastName.toLowerCase()))
        }
        return persons;
    } catch (error) {
        if (error.status === 400) {
            if (error.status === 400) {
                throw { status: 400, message: error };
            }
        }
        throw { status: 500, message: error?.message || error };
    }
};

const getPersonById = (personId) => {
    try {
    const person = DB.person.find((person) => person.id === personId);
    if (!person) {
        throw {
            status: 400,
            message: `Can't find person with the id '${personId}'`,
          };
    }
    return person;
    } catch (error) {
        if (error.status === 400) {
            throw { status: 400, message: error };
        }
        throw { status: 500, message: error?.message || error };
    }
};

const createNewPerson =(newPerson) => {
    const isAlreadyExist = DB.person.find((person) => person.email === newPerson.email);
    if(isAlreadyExist) {
        throw {
            status: 400,
            message: `Person with the email: '${newPerson.email}' already exists`,
          };
    }
    try {
        DB.person.push(newPerson);
        saveToDatabase(DB);
        return newPerson;
    } catch (error) {
        if (error.status === 400) {
            throw { status: 400, message: error };
        }
        throw { status: 500, message: error?.message || error };
    };
};

const patchPerson = (personId, body) => {
    if (Object.keys(body).length === 0) {
        throw {
            status: 400,
            message: 'Update failed. Request body is empty.',
        };
    }

    try {
        const personIndex = DB.person.findIndex((person) => person.id === personId);
        if(personIndex === -1) {
            throw {
                status: 400,
                message: `Can't find person with the id '${personId}'`,
            };
        }
        const updatedPerson = {
            ...DB.person[personIndex],
            ...body.firstName ? { firstName: body.firstName } : {},
            ...body.lastName ? { lastName: body.lastName } : {},
            ...body.phones ? { phones: body.phones } : {},
            ...body.addresses ? { addresses: body.addresses } : {},
            updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        };
        DB.person[personIndex] = updatedPerson;
        saveToDatabase(DB);
        return updatedPerson;
    } catch (error) {
        if (error.status === 400) {
            throw { status: 400, message: error };
        }
        throw { status: 500, message: error?.message || error };
    }
}

const deletePerson = (personId) => {
    try {
        const personIndex = DB.person.findIndex((person) => person.id === personId);
        if(personIndex === -1) {
            throw {
                status: 400,
                message: `Can't find person with the id '${personId}'`,
            };
        }
        DB.person.splice(personIndex, 1);
        saveToDatabase(DB);
    } catch (error) {
        if (error.status === 400) {
            throw { status: 400, message: error };
        }
        throw { status: 500, message: error?.message || error };
    }
}

module.exports = {
    getAllPersons,
    createNewPerson,
    getPersonById,
    patchPerson,
    deletePerson
};