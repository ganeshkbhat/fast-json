

const JsonManager = require('../index').JsonManager; // Replace with the path to your implementation

// Usage Example:
const manager = new JsonManager();
manager.init({
    12: 20000,
    879898: ["test", "for", "alues"],
    "testing": "for alues",
    "123tsj": "testing",
    "store": ["vaue", "loads", 10],
    'user_id': 101,
    'username': 'alpha_user',
    'status': 'Active',
    'tags': ['premium', 'new_member', 'verified'],
    'location': 'New York City',
    'last_login': '2025-11-10',
    'settings': { theme: 'dark', notifications: true },
    'scores': [95, 88, 92]
})

// Find the entry where the key is 'status' OR the value is 'Active'
const exactMatchResult = manager.searchKeyValue('Active');

console.log('1. Exact Match Result (Active):', exactMatchResult);
/*
[
  { key: 'status', value: 'Active' },
]
*/

// Find entries where the key or value contains the substring 'new'
const likeMatchResult = manager.searchKeyValue('new', { like: true });

console.log('2. Partial Match (like: new):', likeMatchResult);
/*
[
  { key: 'username', value: 'alpha_user' }, // Matches 'new' in 'New York City' (from location if checked)
  { key: 'tags', value: ['premium', 'new_member', 'verified'] }, // Matches 'new' in 'new_member' array
]
*/

// Find entries where the key or value starts with 'u' (case-insensitive due to 'i' flag in implementation)
const regexMatchResult = manager.searchKeyValue('^u', { regex: true });

console.log('3. Regex Match (Starts with ^u):', regexMatchResult);
/*
[
  { key: 'user_id', value: 101 },        // Matches key: 'user_id'
  { key: 'username', value: 'alpha_user' } // Matches key: 'username'
]
*/

// Find any entry with key/value exactly matching '101' OR 'New York City'
const arrayMatchResult = manager.searchKeyValue([101, 'New York City', 'non_existent']);

console.log('4. Array Criteria Match:', arrayMatchResult);
/*
[
  { key: 'user_id', value: 101 },
  { key: 'location', value: 'New York City' }
]
*/

