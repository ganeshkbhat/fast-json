

const { expect } = require('chai');
const sinon = require('sinon');
const JsonManager = require('../index').JsonManager; // Replace with the path to your implementation

describe('JsonManager', function () {
  let manager;

  beforeEach(function () {
    manager = new JsonManager();
  });

  describe('read', function () {
    it('read: should return undefined if the key does not exist and createKey is false', function () {
      expect(manager.read('nonexistent', { createKey: false })).to.be.undefined;
      expect(manager.read('nonexistent', { createKey: true })["nonexistent"]).to.be.null;
    });

    it('read: should create a key with null value if createKey is true', function () {
      expect(manager.read('newKey', { createKey: true })).not.to.be.undefined;
      expect(manager.read('newKey', true)).not.to.be.null;
      expect(manager.dump()).to.have.property('newKey', null);
    });

    it('read: should return the value of an existing key', function () {
      manager.write('key1', 'value1');
      expect(manager.read('key1')["key1"]).to.equal('value1');
    });
  });

  describe('write', function () {
    it('write: should set the value of a key', function () {
      manager.write('key1', 'value1');
      expect(manager.dump()).to.have.property('key1', 'value1');
    });
  });

  describe('init', function () {
    it('init: should set the value of a key', function () {
      manager.init({ 'key1': 'value1' });
      expect(manager.dump()).to.have.property('key1', 'value1');
      expect(manager.dump().key1).to.be.equal('value1');
    });
  });

  describe('dump', function () {
    it('dump: should return a shallow copy of the data', function () {
      manager.write('key1', 'value1');
      const dumpedData = manager.dump();
      expect(dumpedData).to.deep.equal({ key1: 'value1' });
      dumpedData.key1 = 'modifiedValue';
      expect(manager.getKey('key1')).to.equal('value1');
    });
  });

  describe('update', function () {
    it('update: should return a shallow copy of the data', function () {
      manager.write('key1', 'value1');
      manager.update({ "key1": "value2" })
      // manager.update({key: "key1", value: "value2"})
      expect(manager.dump()).to.have.property('key1', 'value2');
      expect(manager.read("key1").key1).to.be.equal("value2")
    });
  });

  describe('delete', function () {
    it('delete: should return a shallow copy of the data to test delete function', function () {
      manager.write('key1', 'value1');
      manager.deleteKey('key1', 'value1');
      expect(manager.dump()).not.to.have.property('key1', 'value1');
      expect(manager.read("key1")).to.be.equal(undefined)
      manager.write('key12', 'value112');
      manager.deleteKey('key12');
      expect(manager.dump()).not.to.have.property('key12');
      expect(manager.read("key12")).to.be.undefined;
    });
  });

  describe('deleteKey', function () {
    it('deleteKey: should return a shallow copy of the data to test delete function .deleteKeys("key12") - 1', function () {
      manager.write('key1', 'value1');
      manager.deleteKey('key1');
      expect(manager.dump()).not.to.have.property('key1', 'value1');
      expect(manager.read("key1")).to.be.equal(undefined)

      expect(manager.dump()).not.to.have.property('key1');
      expect(manager.read("key1")).to.be.undefined;
    });
    it('deleteKey: should return a shallow copy of the data to test delete function .deleteKeys("key12") - 2', function () {
      manager.write('key1', 'value1');
      manager.deleteKey('key1');
      expect(manager.dump()).not.to.have.property('key1', 'value1');
      expect(manager.read("key1")).to.be.equal(undefined)
      manager.write('key12', "value112");
      manager.deleteKey('key12');
      manager.deleteKey("key2");
      expect(manager.dump()).not.to.have.property('key12');
      expect(manager.read("key12")).to.be.undefined;
      expect(manager.dump()).not.to.have.property('key1');
      expect(manager.read("key1")).to.be.undefined;
    });
  });

  describe('deleteKeys', function () {
    it('deleteKeys 1: should return a shallow copy of the data to test delete function .deleteKeys(["key12", "key2"])', function () {
      manager.write('key1', 'value1');
      manager.write('key12', "value112");
      manager.deleteKeys(['key12', "key2"]);
      expect(manager.dump()).not.to.have.property('key12');
      expect(manager.read("key12")).to.be.undefined;
      expect(manager.dump()).to.have.property('key1');
      expect(manager.read("key1").key1).to.be.equal("value1");
      expect(manager.read("key12")).to.be.equal(undefined);
    });

    it('deleteKeys 2: should throw error or warning when deleting from delete function .deleteKeys(["key2"])', function () {
      manager.write('key1', 'value1');
      manager.write('key12', "value112");
      expect(manager.dump()).not.to.have.property('key2');
      let deletedResult = manager.deleteKeys(["key2"]);
      console.log("deletedResult", deletedResult)
      expect(manager.dump()).not.to.have.property('key2');
      expect(manager.read("key2")).to.be.undefined;
      expect(manager.dump()).to.have.property('key1');
      expect(manager.read("key1").key2).to.be.equal(undefined);
      expect(manager.read("key12").key2).to.be.equal(undefined);
      expect(manager.read("key2")).to.be.equal(undefined);
    });

    it('deleteKeys 3: should throw error or warning when deleting from delete function .deleteKeys(["key2"]) when item is deleted', function () {
      manager.write('key1', 'value1');
      manager.write('key12', "value112");
      expect(manager.dump()).not.to.have.property('key2');
      expect(manager.read("key12").key12).not.to.be.equal(undefined);
      let deletedResult = manager.deleteKeys(["key2", "key12"]);
      console.log("deletedResult", deletedResult)
      expect(manager.read("key12")).to.be.equal(undefined);
      expect(manager.read("key2")).to.be.equal(undefined);
    });

    it('deleteKeys 4: should return a shallow copy of the many or multiple data keys to test delete function', function () {
      manager.init({})
      // deletekey tests are failing
      manager.write('key1', 'value1');
      manager.write('key12', 'value110');
      manager.deleteKey(['key1']);
      let c = manager.update('key12', "value112");
      let d = manager.deleteKey('key12')
      let e = manager.get("key12")
      // manager.deleteKey("key12");
      // manager.deleteKey(["key12"]);
      // manager.deleteKey(["key12", "key1"]);
      // manager.deleteKeys(['key12']);
      // manager.deleteKey(['key12']);
      console.log("delete 4", d, "c", c)
      expect(d).to.equal(true);
      expect(manager.dump().key12).to.be.equal(undefined);
      expect(manager.dump().key12).not.to.be.equal("key12");
      expect(manager.read("key12")).not.to.be.equal({ "key12": "value112" });
      expect(manager.get("key12")).to.be.equal(undefined);
      expect(manager.dump()).not.to.have.property('key1');
      expect(manager.read("key1")).to.be.undefined;
    });
  });


  describe('load', function () {
    it('load: should return a shallow copy of the data', function () {
      manager.write('key1', 'value1');
      manager.load({ "key1": "value2" })
      expect(manager.dump()).to.have.property('key1', 'value2');
      expect(manager.read("key1").key1).to.be.equal("value2")
    });
  });

  describe('dumpkeys', function () {
    it('dumpkeys: should return a shallow copy of the data', function () {

    });
  });

  describe('hasKey', function () {
    it('hasKey: should return true if a key exists', function () {
      manager.write('key1', 'value1');
      expect(manager.hasKey('key1')).to.be.true;
    });

    it('hasKey: should return false if a key does not exist', function () {
      expect(manager.hasKey('nonexistent')).to.be.false;
    });
  });

  describe('getKey', function () {
    it('getKey: should return the value of an existing key', function () {
      manager.write('key1', 'value1');
      expect(manager.getKey('key1')).to.equal('value1');
    });

    it('getKey: should return undefined for a nonexistent key', function () {
      expect(manager.getKey('nonexistent')).to.be.undefined;
    });
  });

  describe('search', function () {
    beforeEach(function () {
      manager.write('key1', 'value1');
      manager.write('key2', 'value2');
      manager.write('keyWithValue1', 'value1');
    });

    it('search: should return key-value pairs for an exact key match', function () {
      expect(manager.search('key1')).to.deep.equal([{ key: 'key1', value: 'value1' }]);
    });

    it('search: should return key-value pairs for keys in an array', function () {
      expect(manager.search(['key1', 'keyWithValue1'])).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('search: should return key-value pairs for partial key matches', function () {
      expect(manager.search('key', { like: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('search: should return key-value pairs for regex key matches', function () {
      expect(manager.search('^key\\d$', { regex: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
      ]);
    });
  });

  describe('searchKeyValues', function () {
    beforeEach(function () {
      manager.write('key1', 'value1');
      manager.write('key2', 'value2');
      manager.write('keyWithValue1', 'value1');
    });

    it('searchKeyValues: should return key-value pairs for exact key or value matches', function () {
      expect(manager.searchKeyValues('value1')).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('searchKeyValues: should return key-value pairs for keys or values in an array', function () {
      expect(manager.searchKeyValues(['key1', 'value2'])).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
      ]);
    });

    it('searchKeyValues: should return key-value pairs for partial key or value matches', function () {
      expect(manager.searchKeyValues('value', { like: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('searchKeyValues: should return key-value pairs for regex key or value matches', function () {
      expect(manager.searchKeyValues('^value\\d$', { regex: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });
  });

  describe('searchValues', function () {
    beforeEach(function () {
      manager.write('key1', 'value1');
      manager.write('key2', 'value2');
      manager.write('keyWithValue1', 'value1');
    });

    it('searchValues: should return key-value pairs for an exact value match', function () {
      expect(manager.searchValues('value1')).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('searchValues: should return key-value pairs for values in an array', function () {
      expect(manager.searchValues(['value1', 'value2'])).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('searchValues: should return key-value pairs for partial value matches', function () {
      expect(manager.searchValues('value', { like: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('searchValues: should return key-value pairs for regex value matches', function () {
      expect(manager.searchValues('^value\\d$', { regex: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });
  });

  describe('searchkeys', function () {
    beforeEach(function () {
      manager.write('key1', 'value1');
      manager.write('key2', 'value2');
      manager.write('keyWithValue1', 'value1');
    });

    it('searchkeys: should return key-value pairs for keys in single key search an exact value match', function () {
      expect(manager.searchKeys('key1')).to.deep.equal([
        { key: 'key1', value: 'value1' },
      ]);
    });

    it('searchkeys: should return key-value pairs for keys in single key search', function () {
      expect(manager.searchKeys('key2')).to.deep.equal([
        { key: 'key2', value: 'value2' },
      ]);
    });

    it('searchkeys: should return key-value pairs for partial value matches', function () {
      expect(manager.searchKeys('key', { like: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('searchkeys: should return key-value pairs for regex value matches', function () {
      expect(manager.searchKeys('^key\\d$', { like: true, regex: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
      ]);
    });

    it('searchkeys: should return key-value pairs for array input value matches', function () {
      // // should not support arrray as input
      expect(manager.searchKeys(['test'], { like: true, regex: true })).to.deep.equal([]);
    });
  });
});

// describe('JsonManager', () => {
//   let jsonManager;

//   beforeEach(() => {
//     jsonManager = JsonManager();
//   });

//   describe('read', () => {
//     it('should return the value of an existing key', () => {
//       jsonManager.write('key1', 'value1');
//       const result = jsonManager.read('key1');
//       expect(result).to.equal('value1');
//     });

//     it('should return undefined for a non-existing key without createKey option', () => {
//       const result = jsonManager.read('key2');
//       expect(result).to.be.undefined;
//     });

//     it('should create a key with null value if createKey option is true', () => {
//       const result = jsonManager.read('key3', { createKey: true });
//       expect(result).to.be.null;
//       expect(jsonManager.hasKey('key3')).to.be.true;
//     });
//   });

//   describe('write', () => {
//     it('should set a value for a key', () => {
//       jsonManager.write('key1', 'value1');
//       expect(jsonManager.read('key1')).to.equal('value1');
//     });
//   });

//   describe('dump', () => {
//     it('should return a shallow copy of the data object', () => {
//       jsonManager.write('key1', 'value1');
//       const dump = jsonManager.dump();
//       expect(dump).to.deep.equal({ key1: 'value1' });
//     });
//   });

//   describe('dumpKeys', () => {
//     it('should search keys based on criteria', () => {
//       jsonManager.write('key1', 'value1');
//       jsonManager.write('key2', 'value2');
//       const results = jsonManager.dumpKeys('key1');
//       expect(results).to.deep.equal([{ key: 'key1', value: 'value1' }]);
//     });
//   });

//   describe('dumpToFile', () => {
//     it('should write the JSON object to a file', () => {
//       const writeStub = sinon.stub(fs, 'writeFileSync');
//       jsonManager.write('key1', 'value1');
//       const result = jsonManager.dumpToFile(jsonManager.dump(), 'test.json');
//       expect(result).to.be.true;
//       expect(writeStub.calledOnce).to.be.true;
//       writeStub.restore();
//     });
//   });

//   describe('hasKey', () => {
//     it('should return true if the key exists', () => {
//       jsonManager.write('key1', 'value1');
//       expect(jsonManager.hasKey('key1')).to.be.true;
//     });

//     it('should return false if the key does not exist', () => {
//       expect(jsonManager.hasKey('key2')).to.be.false;
//     });
//   });

//   describe('getKey', () => {
//     it('should return the value of an existing key', () => {
//       jsonManager.write('key1', 'value1');
//       expect(jsonManager.getKey('key1')).to.equal('value1');
//     });

//     it('should return undefined for a non-existing key', () => {
//       expect(jsonManager.getKey('key2')).to.be.undefined;
//     });
//   });

//   describe('deleteKey', () => {
//     it('should delete an existing key and return true', () => {
//       jsonManager.write('key1', 'value1');
//       const result = jsonManager.deleteKey('key1');
//       expect(result).to.be.true;
//       expect(jsonManager.hasKey('key1')).to.be.false;
//     });

//     it('should return false if the key does not exist', () => {
//       const result = jsonManager.deleteKey('key2');
//       expect(result).to.be.false;
//     });
//   });

//   describe('init', () => {
//     it('should initialize the data object with the provided object', () => {
//       jsonManager.init({ key1: 'value1' });
//       expect(jsonManager.dump()).to.deep.equal({ key1: 'value1' });
//     });
//   });

//   describe('update', () => {
//     it('should update the data object with the provided object', () => {
//       jsonManager.init({ key1: 'value1' });
//       jsonManager.update({ key2: 'value2' });
//       expect(jsonManager.dump()).to.deep.equal({ key1: 'value1', key2: 'value2' });
//     });
//   });

//   describe('search', () => {
//     it('should return matching key-value pairs based on criteria', () => {
//       jsonManager.write('key1', 'value1');
//       jsonManager.write('key2', 'value2');
//       const results = jsonManager.search('key1');
//       expect(results).to.deep.equal([{ key: 'key1', value: 'value1' }]);
//     });
//   });

//   describe('searchValues', () => {
//     it('should return matching key-value pairs based on value criteria', () => {
//       jsonManager.write('key1', 'value1');
//       jsonManager.write('key2', 'value2');
//       const results = jsonManager.searchValues('value1');
//       expect(results).to.deep.equal([{ key: 'key1', value: 'value1' }]);
//     });
//   });

//   describe('searchKeyValue', () => {
//     it('should return matching key-value pairs based on key or value criteria', () => {
//       jsonManager.write('key1', 'value1');
//       jsonManager.write('key2', 'value2');
//       const results = jsonManager.searchKeyValue('key1');
//       expect(results).to.deep.equal([{ key: 'key1', value: 'value1' }]);
//     });
//   });
// });
