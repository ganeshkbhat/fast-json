# json-faster
fast read write to json object using a flat json structure read write update. 

this package supports the fast, secure and private, memory leak resistant redis like key value json based data store [keyvalue-jsondb](https://github.com/ganeshkbhat/keyvalue-jsondb.git) package. 


### USAGE:

```

const JsonManager = require('json-faster').JsonManager; // Replace with the path to your implementation

// Usage Example:
const manager = new JsonManager();

// init or clear data 
manager.init({}); // inits or clears with a blank object
manager.init(); // inits or clears with a blank object

// Adding data
manager.write('key1', 'value1');
manager.write('key2', 'value2');
manager.write('anotherKey', 'value3');
manager.write('keyWithValue1', 'value1');

// Searching for values
console.log(manager.searchValue('value1'));
// Output: [{ key: 'key1', value: 'value1' }, { key: 'keyWithValue1', value: 'value1' }]

console.log(manager.searchValue(['value1', 'value3']));
// Output: [{ key: 'key1', value: 'value1' }, { key: 'keyWithValue1', value: 'value1' }, { key: 'anotherKey', value: 'value3' }]

console.log(manager.searchValue('value', { like: true }));
// Output: [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }, { key: 'keyWithValue1', value: 'value1' }, { key: 'anotherKey', value: 'value3' }]

console.log(manager.searchValue('^value\\d$', { regex: true }));
// Output: [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }, { key: 'keyWithValue1', value: 'value1' }]


// Adding data
manager.write('key1', 'value1');
manager.write('key2', 'value2');
manager.write('anotherKey', 'value3');
manager.write('keyWithValue1', 'value1');

// Searching for key-value pairs
console.log(manager.searchKeyValue('key1'));
// Output: [{ key: 'key1', value: 'value1' }]

console.log(manager.searchKeyValue(['key1', 'value3']));
// Output: [{ key: 'key1', value: 'value1' }, { key: 'anotherKey', value: 'value3' }]

console.log(manager.searchKeyValue('value1', { like: true }));
// Output: [{ key: 'key1', value: 'value1' }, { key: 'keyWithValue1', value: 'value1' }]

console.log(manager.searchKeyValue('^key\\d$', { regex: true }));
// Output: [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }]

console.log(manager.searchKeyValue('value2', { regex: true }));
// Output: [{ key: 'key2', value: 'value2' }]

// Reading key
console.log(manager.read('key1', false)); // undefined
console.log(manager.read('key1', true)); // null

// Writing and checking
manager.write('key1', 'value1');
console.log(manager.hasKey('key1')); // true
console.log(manager.getKey('key1')); // 'value1'

// Dumping data
console.log(manager.dump()); // { key1: 'value1' }

// Dumping data based on criteria
console.log(manager.dumpKeys('key1', { like: true }, "search")); // { key1: 'value1' }
// Output: [{ key: 'key1', value: 'value1' }]

// Searching keys
manager.write('key2', 'value2');
manager.write('anotherKey', 'value3');

// Dumping data based on criteria
console.log(manager.dumpKeys(['key1', 'key3', 'anotherKey'], { like: true }, "search")); // { key1: 'value1' }
// Output dumps: [{ key: 'key1', value: 'value1' }, { key: 'anotherKey', value: 'value3' }]

// Search for specific keys in an array
console.log(manager.search(['key1', 'key3', 'anotherKey']));
// Output: [{ key: 'key1', value: 'value1' }, { key: 'anotherKey', value: 'value3' }]

// Search using partial match
console.log(manager.search('key', { like: true }));
// Output: [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }]

// Search using regex
console.log(manager.search('^key\\d$', { regex: true }));
// Output: [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }]

// Delete keys
manager.deleteKey('key2');

```


```

const unflattenJson = require('json-faster').unflattenJson; // Replace with the path to your implementation
const flattenJsonWithEscaping = require('json-faster').flattenJsonWithEscaping; // Replace with the path to your implementation
const writeToFile = require('json-faster').writeToFile;

const nestedData3 = {
    test: {
        "tester.makeup": {
            testing: "10",
            makeup: 10
        },
        madeup: 20
    },
    fakeup: 30
}

writeToFile(JSON.stringify(flattenJsonWithEscaping(nestedData3)), "./demos/flattenjson.txt")
writeToFile(JSON.stringify(unflattenJson(flattenJsonWithEscaping(nestedData3))), "./demos/unflattenjson.txt")

```
