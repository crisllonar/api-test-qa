const DB = require('./db.json');
const { saveToDatabase } = require("./utils");
const { Pool }  = require('pg');
const constants = require("../config/constants");

const pool = new Pool({
    user: constants.user,
    host: constants.host,
    database: constants.database,
    password: constants.password,
    port: constants.port
});


const getAllPersons = async (queryParams) => {
    try {
        const {email, lastName} = queryParams;

        if (email && lastName) {
            const query = 'SELECT id, email, first_name, last_name, phones, addresses FROM persons WHERE email = $1 AND last_name = $2;';
            const {rows} = await pool.query(query, [email, lastName]);
            return rows;
        } else if (email && !lastName) {
            const query = 'SELECT id, email, first_name, last_name, phones, addresses FROM persons WHERE email = $1;';
            const {rows} = await pool.query(query, [email]);
            return rows;
        } else if (!email && lastName) {
            const query = 'SELECT id, email, first_name, last_name, phones, addresses FROM persons WHERE last_name = $1;';
            const {rows} = await pool.query(query, [lastName]);
            return rows;
        } else {
            const query = 'SELECT id, email, first_name, last_name, phones, addresses FROM persons;';
            const {rows} = await pool.query(query);
            return rows;
        }
    } catch (error) {
        if (error.status === 400) {
            throw {status: 400, message: error};
        }
        throw {status: 500, message: error?.message || error};
    }
};

const getPersonById = async (personId) => {
    try {
        const query = 'SELECT id, email, first_name, last_name, phones, addresses FROM persons WHERE id = $1;';
        const {rows} = await pool.query(query, [personId]);
        if (rows.length === 0) {
            throw {status: 404, message: `Person not found with the id '${personId}'`};
        } else {
            return rows;
        }
    } catch (error) {
        if (error.status === 400) {
            throw { status: 400, message: error };
        }
        throw { status: 500, message: error?.message || error };
    }
};

const createNewPerson = async (newPerson) => {

    const verifyPersonQuery = 'SELECT email FROM persons WHERE email = $1;';
    let {rows} = await pool.query(verifyPersonQuery, [newPerson.email]);
    if (rows.length > 0) {
        throw {
            status: 400,
            message: `Person with the email: '${newPerson.email}' already exists`,
        };
    }
    console.log(rows.length)

    try {
        const query = `
        INSERT INTO persons (email, first_name, last_name, phones, addresses)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
        `;

        const values = [newPerson.email, newPerson.first_name, newPerson.last_name, newPerson.phones, newPerson.addresses];

        const result = await pool.query(query, values);
        return result.rows[0].id;
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
            ...body.first_name ? { first_name: body.first_name } : {},
            ...body.last_name ? { last_name: body.last_name } : {},
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