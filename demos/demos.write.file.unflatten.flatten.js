
const unflattenJson = require('../index').unflattenJson; // Replace with the path to your implementation
const flattenJsonWithEscaping = require('../index').flattenJsonWithEscaping; // Replace with the path to your implementation
const writeToFile = require('../index').writeToFile;

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

