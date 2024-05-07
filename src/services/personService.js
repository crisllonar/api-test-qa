const Person = require('../database/person');
const { v4: uuid } = require("uuid");


const getAllPersons = (queryParams) => {
    try {
        const allPerson = Person.getAllPersons(queryParams);
        return allPerson;
    } catch (error) {
        throw error;
    }
}

const getPersonById = (personId) => {
    try {
        const person = Person.getPersonById(personId);
        return person;
    } catch (error) {
        throw error;
    }
}

const createPerson = (newPerson) => {
    const personToInsert = {
      id: uuid(),
      ...newPerson,
      createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };
    try {
        const createdPerson = Person.createNewPerson(personToInsert);
        return createdPerson;
    } catch (error) {
        throw error;
    } 
}   

const patchPerson = (personId, body) => {
    try {
        const updatedPerson = Person.patchPerson(personId, body);
        return updatedPerson;
    } catch (error) {
        throw error;
    } 
}

const deletePerson = (personId) => {
    try {
        Person.deletePerson(personId);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllPersons,
    getPersonById,
    createPerson,
    patchPerson,
    deletePerson
}