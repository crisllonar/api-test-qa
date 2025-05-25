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
        !body.phone ||
        !body.address
    ) {
        res
        .status(400)
        .send({
            error:
            "One of the following keys is missing or is empty in request body: 'first_name', 'last_name', 'email', 'phone', 'addresses'",
        });
        return;
    }
    const newPerson = {
        email: body.email,
        first_name: body.firstName,
        last_name: body.lastName,
        phone: body.phone,
        address: body.address
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

const patchPerson = async (req, res) => {
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
    if (Object.keys(body).length === 0) {
        throw {
            status: 400,
            message: 'Update failed. Request body is empty.',
        };
    }

    try {
        await personService.patchPerson(personId, body);
        res.status(204).send();
    } catch (error) {
        res
        .status(error?.status || 500)
        .send({ error: error?.message || error });
    }
}

const deletePerson = async (req, res) => {
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
        await personService.deletePerson(personId);
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