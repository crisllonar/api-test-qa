const personService = require('../services/personService');


const getAllPersons  = async (req, res) => {
    try {
        const allPerson = await personService.getAllPersons(req.query);
        res.status(200).send(allPerson);
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({error: error?.message || error});
    }
}

const getPersonById = async (req, res) => {
    const {
        params: { personId },
    } = req;

    if(!personId) {
        res
        .status(400)
        .send({
            error: "Parameter ':personId' can not be empty"
        });
    }
    try {
        const person = await personService.getPersonById(personId);
        res.status(200).send(person);
    } catch (error) {
        res
        .status(error?.status || 500)
        .send({ error: error?.message || error });
    }
}

const createNewPerson = async (req, res) => {
    const { body } = req;
    if(
        !body.email ||
        !body.firstName ||
        !body.lastName ||
        !body.phones ||
        !body.addresses
    ) {
        res
        .status(400)
        .send({
            error:
            "One of the following keys is missing or is empty in request body: 'first_name', 'last_name', 'email', 'phones', 'addresses'",
        });
        return;
    };

    const newPerson = {
        email: body.email,
        first_name: body.firstName,
        last_name: body.lastName,
        phones: body.phones,
        addresses: body.addresses
    };
    try {
        const createdPersonId = await personService.createPerson(newPerson);
        res.status(201).json({ id: createdPersonId });
    } catch (error) {
        res
        .status(error?.status || 500)
        .send({ error: error?.message || error });
    }
   
}

const patchPerson = (req, res) => {
    const {
        body,
        params: { personId },
    } = req;
    if(!personId) {
        res
        .status(400)
        .send({
            status: "ERROR",
            data: {
                error: "Parameter ':personId' can not be empty",
            },
        });
        return;
    }
    try {
        const updatedPerson = personService.patchPerson(personId, body);
        res.status(200).send(updatedPerson);
    } catch (error) {
        res
        .status(error?.status || 500)
        .send({ error: error?.message || error });
    }
}

const deletePerson = (req, res) => {
    const {
        params: { personId },
    } = req;
    if(!personId) {
        res
        .status(400)
        .send({
            status: "ERROR",
            data: {
                error: "Parameter ':personId' can not be empty",
            },
        });
        return;
    }
    try {
        personService.deletePerson(personId);
        res.status(204).send({status:"OK"});
    } catch (error) {
        res
        .status(error?.status || 500)
        .send({ error: error?.message || error  
        });
    }
} 

module.exports = {
    getAllPersons,
    getPersonById,
    createNewPerson,
    patchPerson,
    deletePerson
}