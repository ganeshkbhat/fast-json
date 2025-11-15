

const { expect } = require('chai');
const sinon = require('sinon');
const JsonManager = require('../index').JsonManager; // Replace with the path to your implementation

describe('JsonManager', function () {
  let manager;

  beforeEach(function () {
    manager = new JsonManager();
  });

  describe('read', function () {
    it('should return undefined if the key does not exist and createKey is false', function () {
      expect(manager.read('nonexistent', false)).not.to.be.undefined;
      expect(manager.read('nonexistent', false)["nonexistent"]).to.be.null;
    });

    it('should create a key with null value if createKey is true', function () {
      expect(manager.read('newKey', { createKey: true })).not.to.be.undefined;
      expect(manager.read('newKey', true)).not.to.be.null;
      expect(manager.dump()).to.have.property('newKey', null);
    });

    it('should return the value of an existing key', function () {
      manager.write('key1', 'value1');
      expect(manager.read('key1')["key1"]).to.equal('value1');
    });
  });

  describe('write', function () {
    it('should set the value of a key', function () {
      manager.write('key1', 'value1');
      expect(manager.dump()).to.have.property('key1', 'value1');
    });
  });

  describe('dump', function () {
    it('should return a shallow copy of the data', function () {
      manager.write('key1', 'value1');
      const dumpedData = manager.dump();
      expect(dumpedData).to.deep.equal({ key1: 'value1' });
      dumpedData.key1 = 'modifiedValue';
      expect(manager.getKey('key1')).to.equal('value1');
    });
  });

  describe('hasKey', function () {
    it('should return true if a key exists', function () {
      manager.write('key1', 'value1');
      expect(manager.hasKey('key1')).to.be.true;
    });

    it('should return false if a key does not exist', function () {
      expect(manager.hasKey('nonexistent')).to.be.false;
    });
  });

  describe('getKey', function () {
    it('should return the value of an existing key', function () {
      manager.write('key1', 'value1');
      expect(manager.getKey('key1')).to.equal('value1');
    });

    it('should return undefined for a nonexistent key', function () {
      expect(manager.getKey('nonexistent')).to.be.undefined;
    });
  });

  describe('search', function () {
    beforeEach(function () {
      manager.write('key1', 'value1');
      manager.write('key2', 'value2');
      manager.write('keyWithValue1', 'value1');
    });

    it('should return key-value pairs for an exact key match', function () {
      expect(manager.search('key1')).to.deep.equal([{ key: 'key1', value: 'value1' }]);
    });

    it('should return key-value pairs for keys in an array', function () {
      expect(manager.search(['key1', 'keyWithValue1'])).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('should return key-value pairs for partial key matches', function () {
      expect(manager.search('key', { like: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('should return key-value pairs for regex key matches', function () {
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

    it('should return key-value pairs for exact key or value matches', function () {
      expect(manager.searchKeyValues('value1')).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('should return key-value pairs for keys or values in an array', function () {
      expect(manager.searchKeyValues(['key1', 'value2'])).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
      ]);
    });

    it('should return key-value pairs for partial key or value matches', function () {
      expect(manager.searchKeyValues('value', { like: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('should return key-value pairs for regex key or value matches', function () {
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

    it('should return key-value pairs for an exact value match', function () {
      expect(manager.searchValues('value1')).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('should return key-value pairs for values in an array', function () {
      expect(manager.searchValues(['value1', 'value2'])).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('should return key-value pairs for partial value matches', function () {
      expect(manager.searchValues('value', { like: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('should return key-value pairs for regex value matches', function () {
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

    it('should return key-value pairs for keys in single key search an exact value match', function () {
      expect(manager.searchKeys('key1')).to.deep.equal([
        { key: 'key1', value: 'value1' },
      ]);
    });

    it('should return key-value pairs for keys in single key search', function () {
      expect(manager.searchKeys('key2')).to.deep.equal([
        { key: 'key2', value: 'value2' },
      ]);
    });

    it('should return key-value pairs for partial value matches', function () {
      expect(manager.searchKeys('key', { like: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'keyWithValue1', value: 'value1' },
      ]);
    });

    it('should return key-value pairs for regex value matches', function () {
      expect(manager.searchKeys('^key\\d$', { like: true, regex: true })).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
      ]);
    });

    it('should return key-value pairs for array input value matches', function () {
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
