/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: 
 * Install: npm i json-faster --save
 * Github: https://github.com/ganeshkbhat/fast-json
 * npmjs Link: https://www.npmjs.com/package/json-faster
 * File: index.js
 * File Description: 
 * 
 * 
*/

/* eslint no-console: 0 */

'use strict';

const fs = require("fs");
const path = require("path");


/**
 * Converts a single-level JSON object with dot notation keys into a nested JSON object.
 * 
 * @param {Object} obj - The single-level JSON object to convert.
 * @returns {Object} - A nested JSON object.
 */
function unflattenJson(obj) {
    if (typeof obj !== 'object' || obj === null) {
        throw new Error("Input must be a non-null object.");
    }

    const result = {};

    for (const fullKey in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, fullKey)) {
            // Split keys while handling escaped dots
            const keys = fullKey.split(/(?<!\\)\./).map(key => key.replace(/\\\./g, '.'));

            let current = result;

            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    // Final key - assign the value
                    current[key] = obj[fullKey];
                } else {
                    // Intermediate key - create object if it doesn't exist
                    if (!current[key] || typeof current[key] !== 'object') {
                        current[key] = {};
                    }
                    current = current[key];
                }
            });
        }
    }

    return result;
}


/**
 * Flattens a nested JSON object into a single level with dot notation keys,
 * escaping dots in keys with double backslashes.
 * 
 * @param {Object} obj - The nested JSON object to flatten.
 * @param {string} [prefix=""] - The prefix for nested keys (used for recursion).
 * @returns {Object} - A single level object with escaped dot notation keys.
 */
function flattenJsonWithEscaping(obj, prefix = "") {
    if (typeof obj !== 'object' || obj === null) {
        throw new Error("Input must be a non-null object.");
    }

    const result = {};

    function escapeKey(key) {
        return key.replace(/\./g, '\\.');
    }

    function recurse(current, keyPrefix) {
        for (const key in current) {
            if (Object.prototype.hasOwnProperty.call(current, key)) {
                const escapedKey = escapeKey(key);
                const newKey = keyPrefix ? `${keyPrefix}.${escapedKey}` : escapedKey;

                if (typeof current[key] === 'object' && current[key] !== null) {
                    // Recurse for nested objects
                    recurse(current[key], newKey);
                } else {
                    // Assign primitive values
                    result[newKey] = current[key];
                }
            }
        }
    }

    recurse(obj, prefix);
    return result;
}


/**
 *
 *
 * @param {*} filename
 * @return {*} 
 */
function safeFilePath(filename) {
    // 
    // const fs = require("fs");
    // const path = require("path");
    // function readFile(filename) {
    //     // Directly using user input to construct the file path
    //     const filePath = path.join(__dirname, filename);
    //     return fs.readFileSync(filePath, "utf8");
    // }
    // 
    // // Example usage
    // const userInput = "../../etc/passwd"; // Malicious input
    // console.log(readFile(userInput)); // This could expose sensitive files
    // // Example usage
    // try {
    //     const userInput = "example.txt"; // Valid input
    //     console.log(readFileSafe(userInput));
    // } catch (err) {
    //     console.error(err.message);
    // }

    // Allow only filenames without directory traversal
    if (!/^[a-zA-Z0-9_\-\.]+$/.test(filename)) {
        throw new Error("Invalid filename");
    }

    // Construct the file path safely
    const filePath = path.join(__dirname, filename);

    // Ensure the resolved path is within the intended directory
    const resolvedPath = path.resolve(filePath);

    if (!resolvedPath.startsWith(__dirname)) {
        throw new Error("Access denied");
    }

    return resolvedPath;
}


/**
 *
 *
 * @param {*} obj
 * @param {*} filename
 * @return {*} 
 */
function writeToFile(obj, filename, safepath = false) {
    try {
        if (safepath === true) {
            fs.writeFileSync(safeFilePath(filename), obj)
        } else {
            fs.writeFileSync(safeFilePath(filename), obj)
        };
        return true
    } catch (e) {
        return JSON.stringify(e);
    }
}


/**
 * JsonManager
 * 
 * read, write, update, dump, init, hasKey, getKey, delKey, search, searchValue, searchKeyValue
 *
 * @return {*} 
 */
function JsonManager() {
    var data = {};

    // Write method to set a value for a key
    function write(key, value) {
        data[key] = value;
        // return {[data[key]]: value}
    }

    // Checks if a key exists
    function hasKey(key) {
        return !!data.hasOwnProperty(key) || !!data[key];
    }

    // Gets the value of a key
    function getKey(key) {
        return (!!hasKey(key)) ? data[key] : undefined;
    }

    // Read method with createKey functionality
    function read(key, options = { createKey: false }) {
        if (!!data[key]) {
            return { [key]: data[key] }; // data[key]/
        }
        if (!!options.createKey || !data[key]) {
            data[key] = null;
            return { [key]: data[key] }; // data[key]/
        }
        return undefined;
    }

    // Dumps the entire JSON object
    function dump() {
        // return { ...unflattenJson(data) }; // Return a shallow copy to prevent direct modification
        return { ...data }; // Return a shallow copy to prevent direct modification
    }

    // Dumps the entire criteria searchedJSON object
    function dumpKeys(criteria, options = { like: false, regex: false }, type = "search") {
        if (type === "value") {
            return searchValue(criteria, options);
        } else if (type === "keyvalue") {
            return searchKeyValue(criteria, options);
        } else {
            return search(criteria, options);
        }
    }

    // Dumps the entire JSON object to file
    function dumpToFile(obj, filename) {
        return writeToFile(JSON.stringify(obj), filename);
    }

    // Deletes the value of a key
    function deleteKey(key) {
        try {
            delete data[key]
            return true;
        } catch (e) {
            return false;
        }
    }

    // instantiates the new value
    function init(obj = {}) {
        // return data = flattenJsonWithEscaping(obj);
        return data = obj;
    }

    // instantiates the new value
    function load(obj = {}) {
        // return data = flattenJsonWithEscaping(obj);
        data = {...data, ...obj};
        return data
    }

    // updates the json with new json structure
    function update(obj) {
        // return { ...data, ...flattenJsonWithEscaping(obj) };
        data = { ...data, ...obj };
        return data
    }

    // Searches keys and returns an array of key-value pairs
    function search(criteria, options = { like: false, regex: false }) {
        const results = [];

        if (Array.isArray(criteria)) {
            // Search for keys in an array
            for (const key of criteria) {
                if (data.hasOwnProperty(key)) {
                    results.push({ key, value: data[key] });
                }
            }
        } else if (options.regex) {
            // Search using a regex
            // recheck this with tests
            const regex = new RegExp(criteria);
            for (const key of Object.keys(data)) {
                if (regex.test(key)) {
                    results.push({ key, value: data[key] });
                }
            }
        } else if (options.like) {
            // Partial matching
            for (const key of Object.keys(data)) {
                if (key.includes(criteria)) {
                    results.push({ key, value: data[key] });
                }
            }
        } else {
            // Exact key match
            if (data.hasOwnProperty(criteria)) {
                results.push({ key: criteria, value: data[criteria] });
            }
        }

        return results;
    }

    // Searches values and returns an array of key-value pairs
    function searchValue(criteria, options = { like: false, regex: false }) {
        const results = [];

        if (Array.isArray(criteria)) {
            // Search for values in an array
            for (const [key, value] of Object.entries(data)) {
                if (criteria.includes(value)) {
                    results.push({ key, value });
                }
            }
        } else if (options.regex) {
            // Search using a regex
            const regex = new RegExp(criteria);
            for (const [key, value] of Object.entries(data)) {
                if (regex.test(String(value))) {
                    results.push({ key, value });
                }
            }
        } else if (options.like) {
            // Partial matching
            for (const [key, value] of Object.entries(data)) {
                if (String(value).includes(criteria)) {
                    results.push({ key, value });
                }
            }
        } else {
            // Exact value match
            for (const [key, value] of Object.entries(data)) {
                if (value === criteria) {
                    results.push({ key, value });
                }
            }
        }

        return results;
    }

    // Searches both keys and values and returns an array of key-value pairs
    function searchKeyValue(criteria, options = { like: false, regex: false }) {
        const results = [];

        if (Array.isArray(criteria)) {
            // Search for keys or values in an array
            for (const key of Object.keys(data)) {
                if (
                    criteria.includes(key) ||
                    criteria.includes(data[key])
                ) {
                    results.push({ key, value: data[key] });
                }
            }
        } else if (options.regex) {
            // Search using a regex
            const regex = new RegExp(criteria);
            for (const [key, value] of Object.entries(data)) {
                if (regex.test(key) || regex.test(String(value))) {
                    results.push({ key, value });
                }
            }
        } else if (options.like) {
            // Partial matching
            for (const [key, value] of Object.entries(data)) {
                if (key.includes(criteria) || String(value).includes(criteria)) {
                    results.push({ key, value });
                }
            }
        } else {
            // Exact match for either key or value
            for (const [key, value] of Object.entries(data)) {
                if (key === criteria || value === criteria) {
                    results.push({ key, value });
                }
            }
        }

        return results;
    }

    return {
        read,
        write,
        update,
        dump,
        dumpKeys,
        dumpToFile,
        init,
        load,
        hasKey,
        getKey,
        get: getKey,
        deleteKey,
        search,
        searchValue,
        searchKeyValue
    }

}


module.exports = {
    JsonManager,
    writeToFile,
    flattenJsonWithEscaping,
    unflattenJson,
    flatten: flattenJsonWithEscaping,
    unflatten: unflattenJson
}

