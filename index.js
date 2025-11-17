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
 * read, write, update, dump, init, hasKey, getKey, delKey, search, searchValues, searchKeyValue
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
            return searchValues(criteria, options);
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
            delete data[key];
            return true
        } catch (e) {
            return false;
        }
    }

    /**
     * Deletes multiple key-value entries.
     * @param {string[]} keysArray An array of keys to delete.
     * @returns {string[]} An array containing the keys that were successfully deleted.
     */
    function deleteKeys(keysArray) {
        if (!Array.isArray(keysArray)) {
            console.error("Error: deleteKeys requires an array of keys.");
            return [];
        }

        const deletedKeys = [];
        for (const key of keysArray) {
            if (data.hasOwnProperty(key)) {
                delete data[key];
                deletedKeys.push(key);
            } else {
                console.warn(`Warning: Key '${key}' not found, skipping deletion.`);
            }
        }
        return deletedKeys;
    }

    // instantiates the new value
    function init(obj = {}) {
        // return data = flattenJsonWithEscaping(obj);
        return data = obj;
    }

    // instantiates the new value
    function load(obj = {}) {
        // return data = flattenJsonWithEscaping(obj);
        data = { ...data, ...obj };
        return data
    }

    // updates the json with new json structure
    function update(obj) {
        // return { ...data, ...flattenJsonWithEscaping(obj) };
        data = { ...data, ...obj };
        return data
    }

    /**
     * Helper function to determine if a term matches the criteria based on options (Exact, Like, Regex).
     * @param {any} term The key or value to test.
     * @param {string|RegExp|Array} criteria The search term(s).
     * @param {object} options Search options ({ like: boolean, regex: boolean }).
     * @returns {boolean} True if the term matches the criteria.
     */
    function isMatch(term, criteria, options) {
        if (options.regex && criteria instanceof RegExp) {
            // If criteria is already a RegExp object
            return criteria.test(String(term));
        } else if (options.regex) {
            // If criteria is a string to be converted to RegExp
            try {
                // Using 'i' for case-insensitive regex search
                const regex = new RegExp(criteria, 'i');
                return regex.test(String(term));
            } catch (e) {
                console.error("Invalid regex criteria:", e);
                return false;
            }
        } else if (options.like) {
            // Partial matching (like), converted to string and lowercase for case-insensitive partial search
            const termStr = String(term).toLowerCase();
            const criteriaStr = String(criteria).toLowerCase();
            return termStr.includes(criteriaStr);
        } else {
            // Exact match
            return term === criteria;
        }
    }

    /**
     * Searches for key/value pairs in the 'data' object based on the criteria.
     * Supports exact match, partial match ('like'), and regular expressions.
     * It iterates over arrays found as values to search within them.
     * * @param {string|RegExp|Array} criteria The search term(s). 
     * @param {object} [options={ like: false, regex: false }] Search options.
     * @returns {Array<{key: string, value: any}>} An array of objects that match the criteria.
     */
    function searchKeyValues(criteria, options = { like: false, regex: false }) {
        const results = [];
        const entries = Object.entries(data);

        // --- 1. Handle Array Criteria (Exact Match Only) ---
        if (Array.isArray(criteria)) {
            for (const [key, value] of entries) {
                // Check key match
                if (criteria.includes(key)) {
                    results.push({ key, value });
                    continue;
                }

                // Check single value match
                if (!Array.isArray(value) && criteria.includes(value)) {
                    results.push({ key, value });
                    continue;
                }

                // Check array value elements match
                if (Array.isArray(value)) {
                    for (const item of value) {
                        if (criteria.includes(item)) {
                            results.push({ key, value });
                            break;
                        }
                    }
                }
            }
            return results;
        }

        // --- 2. Handle Single Criteria (Exact, Like, or Regex) ---
        for (const [key, value] of entries) {
            let isValueMatch = false;

            // Check if the VALUE matches (or any element if it's an array)
            if (Array.isArray(value)) {
                for (const item of value) {
                    if (isMatch(item, criteria, options)) {
                        isValueMatch = true;
                        break;
                    }
                }
            } else {
                if (isMatch(value, criteria, options)) {
                    isValueMatch = true;
                }
            }

            // Check if the KEY matches
            const isKeyMatch = isMatch(key, criteria, options);

            if (isKeyMatch || isValueMatch) {
                results.push({ key, value });
            }
        }

        return results;
    }

    /**
     * Searches ONLY the keys of the object and returns the full key/value pairs that match.
     * * @param {string|RegExp} criteria The search term.
     * @param {object} [options={ like: false, regex: false }] Search options.
     * @returns {Array<{key: string, value: any}>} An array of objects where the key matches the criteria.
     */
    function searchKeys(criteria, options = { like: false, regex: false }) {
        const results = [];

        // // Array criteria is not supported for searchKeys, only single string/RegExp
        // if (Array.isArray(criteria)) {
        //     console.error("searchKeys only supports string or RegExp criteria.");
        //     return results;
        // }

        for (const [key, value] of Object.entries(data)) {
            if (isMatch(key, criteria, options)) {
                results.push({ key, value });
            }
        }
        return results;
    }

    /**
     * Searches ONLY the values and returns the key/value pairs that matched.
     * @returns {Array<{key: string, value: any}>}
     */
    function searchValues(criteria, options = { like: false, regex: false }) {
        const results = [];
        const entries = Object.entries(data);

        // --- 1. Handle Array Criteria (Exact Match Only) ---
        if (Array.isArray(criteria)) {
            for (const [key, value] of entries) {
                let found = false;

                // Check single value match
                if (!Array.isArray(value) && criteria.includes(value)) {
                    found = true;
                } else if (Array.isArray(value)) {
                    // Check array value elements match
                    for (const item of value) {
                        if (criteria.includes(item)) {
                            found = true;
                            break;
                        }
                    }
                }

                if (found) {
                    results.push({ key, value }); // PUSH PAIR
                }
            }
            return results;
        }

        // --- 2. Handle Single Criteria (Exact, Like, or Regex) ---
        for (const [key, value] of entries) {
            let isValueMatch = false;

            // Check if the VALUE matches (or any element if it's an array)
            if (Array.isArray(value)) {
                for (const item of value) {
                    if (isMatch(item, criteria, options)) {
                        isValueMatch = true;
                        break;
                    }
                }
            } else if (isMatch(value, criteria, options)) {
                isValueMatch = true;
            }

            if (isValueMatch) {
                results.push({ key, value }); // PUSH PAIR
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
        deleteKeys,
        search: searchKeyValues,
        searchKeys,
        searchValues,
        searchKeyValues
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

