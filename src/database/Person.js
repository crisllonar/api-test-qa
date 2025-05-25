const DB = require('./db.json');
const { v4: uuid } = require('uuid');
const {saveToDatabase} = require("./utils");
const {Pool} = require('pg');
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
            const query = 'SELECT id, email, first_name, last_name, phone, address, created_at, modified_at FROM persons WHERE active = true AND email = $1 AND last_name = $2;';
            const {rows} = await pool.query(query, [email, lastName]);
            return rows;
        } else if (email && !lastName) {
            const query = 'SELECT id, email, first_name, last_name, phone, address, created_at, modified_at FROM persons WHERE active = true AND email = $1;';
            const {rows} = await pool.query(query, [email]);
            return rows;
        } else if (!email && lastName) {
            const query = 'SELECT id, email, first_name, last_name, phone, address, created_at, modified_at FROM persons WHERE active = true AND last_name = $1;';
            const {rows} = await pool.query(query, [lastName]);
            return rows;
        } else {
            const query = 'SELECT id, email, first_name, last_name, phone, address, created_at, modified_at FROM persons where active = true ';
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
        const query = 'SELECT id, email, first_name, last_name, phone, address, created_at, modified_at FROM persons WHERE active = true AND id = $1;';
        const {rows} = await pool.query(query, [personId]);
        if (rows.length === 0) {
            throw {status: 404, message: `Person not found with the id '${personId}'`};
        } else {
            return rows;
        }
    } catch (error) {
        if (error.status === 400) {
            throw {status: 400, message: error};
        }
        throw {status: 500, message: error?.message || error};
    }
};

const createNewPerson = async (newPerson) => {

    const verifyPersonQuery = 'SELECT email FROM persons WHERE active = true AND email = $1;';
    let {rows} = await pool.query(verifyPersonQuery, [newPerson.email]);
    if (rows.length > 0) {
        throw {
            status: 409,
            message: `Person with the email: '${newPerson.email}' already exists`,
        };
    }

    try {
        const query = `
            INSERT INTO persons (id, email, first_name, last_name, phone, address, created_at, active)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, true) RETURNING id;
        `;
        const id = uuid();
        const values = [id, newPerson.email, newPerson.first_name, newPerson.last_name, newPerson.phone, newPerson.address];

        const result = await pool.query(query, values);
        return result.rows[0].id;
    } catch (error) {
        if (error.status === 400) {
            throw {status: 400, message: error};
        }
        throw {status: 500, message: error?.message || error};
    }
};

const patchPerson = async (personId, body) => {

    const last_name = body.lastName ? body.lastName : null;
    const first_name = body.firstName ? body.firstName : null;
    const phone = body.phone ? body.phone : null;
    const address = body.address ? body.address : null;

    try {
        const query = 'UPDATE persons SET ' +
            'first_name = COALESCE($2,first_name), ' +
            'last_name = COALESCE ($3,last_name), ' +
            'phone = COALESCE($4,phone), ' +
            'address = COALESCE($5,address), ' +
            'modified_at = CURRENT_TIMESTAMP ' +
            'WHERE active = true AND id = $1; ';
        const result = await pool.query(query, [personId, first_name, last_name, phone, address]);
        return result.rowCount
    } catch (error) {
        if (error.status === 400) {
            throw {status: 400, message: error};
        }
        throw {status: 500, message: error?.message || error};
    }
}

const deletePerson = async (personId) => {
    try {
        const verifyPersonQuery = 'SELECT id FROM persons WHERE active = true AND id = $1;';
        let {rows} = await pool.query(verifyPersonQuery, [personId]);
        if (rows.length === 0) {
            throw {
                status: 404,
                message: `Can't find person with the id '${personId}'`,
            };
        }

        const query = 'UPDATE persons SET active = false, modified_at = CURRENT_TIMESTAMP WHERE id = $1;';
        const result = await pool.query(query, [personId]);
        return result.rowCount
    } catch (error) {
        if (error.status === 400) {
            throw {status: 400, message: error};
        }
        throw {status: 500, message: error?.message || error};
    }
}

module.exports = {
    getAllPersons,
    createNewPerson,
    getPersonById,
    patchPerson,
    deletePerson
};