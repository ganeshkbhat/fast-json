
// lock flag and remove flag demo while read-write
// todo : allow event driven management
const JsonManager = require('../index').JsonManager; // Replace with the path to your implementation

// Usage Example:
const manager = new JsonManager();

// init or clear data 
manager.init({}); // inits or clears with a blank object
manager.init(); // inits or clears with a blank object

if (!manager.lock()) {
    manager.setlock(true)
    console.log("Filing a lock")
}
// Adding data
manager.write('key1', 'value1');
manager.write('key2', 'value2');
manager.write('anotherKey', 'value3');
manager.write('keyWithValue1', 'value1');

if (!!manager.lock()) {
    manager.droplock()
    console.log("Dropping lock")
}

manager.write('anotherKey', 'value3');
manager.write('keyWithValue1', 'value1');

console.log("writing without a lock")
