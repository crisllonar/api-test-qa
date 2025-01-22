const Person = require('../database/person');
const { v4: uuid } = require("uuid");


const getAllPersons = async (queryParams) => {
    try {
        return await Person.getAllPersons(queryParams);
    } catch (error) {
        throw error;
    }
}

const getPersonById = async (personId) => {
    try {
        return await Person.getPersonById(personId);
    } catch (error) {
        throw error;
    }
}

const createPerson = async (newPerson) => {
    try {
        return await Person.createNewPerson(newPerson);
    } catch (error) {
        throw error;
    } 
}   

const patchPerson = async (personId, body) => {
    try {
        return await Person.patchPerson(personId, body);
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