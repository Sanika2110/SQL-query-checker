// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById("sqlInput"), {
    mode: "text/x-sql",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: true,
    extraKeys: {
        "Ctrl-Space": "autocomplete",
        "Ctrl-F": "findPersistent"
    },
    hintOptions: {
        tables: {
            users: ["id", "name", "email", "created_at"],
            posts: ["id", "title", "content", "user_id", "created_at"],
            comments: ["id", "post_id", "user_id", "content", "created_at"]
        }
    }
});

// Elements
const errorList = document.getElementById('errorList');
const formatBtn = document.getElementById('formatBtn');
const clearBtn = document.getElementById('clearBtn');

let checkTimeout;

// SQL keyword dictionary for spell checking
const sqlKeywords = new Map([
    ['CREAT', 'CREATE'], ['SELCT', 'SELECT'],['SELEC', 'SELECT'], ['WHER', 'WHERE'], ['DELET', 'DELETE'],
    ['UPDAT', 'UPDATE'], ['INSRT', 'INSERT'], ['FRM', 'FROM'], ['TABL', 'TABLE'],
    ['DATABAS', 'DATABASE'], ['COLUM', 'COLUMN'], ['GROOP', 'GROUP'], ['ORDR', 'ORDER'],
    ['JOINNG', 'JOIN'], ['HAVNG', 'HAVING'], ['DISTINCTT', 'DISTINCT'], ['UNOIN', 'UNION'],
    ['VALU', 'VALUES'],['creat', 'CREATE'], ['selct', 'SELECT'],['selec', 'SELECT'], ['wher', 'WHERE'], ['delet', 'DELETE'],
    ['updat', 'UPDATE'], ['insrt', 'INSERT'], ['frm', 'FROM'], ['tabl', 'TABLE'],
    ['databas', 'DATABASE'], ['colum', 'COLUMN'], ['groop', 'GROUP'], ['ordr', 'ORDER'],
    ['joining', 'JOIN'], ['havng', 'HAVING'], ['distinctt', 'DISTINCT'], ['unoin', 'UNION'],
    ['valu', 'VALUES']
]);

// Function to format SQL query
function formatSQL(sql) {
    sqlKeywords.forEach((correct, misspelled) => {
        const regex = new RegExp(`\\b${misspelled}\\b`, 'gi');
        sql = sql.replace(regex, correct);
    });

    return sql
        .replace(/\s+/g, ' ')
        .replace(/\s*([,()])\s*/g, '$1 ')
        .replace(/\(/g, '\n(')
        .replace(/\)/g, ')\n')
        .replace(/\b(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|VALUES)\b/gi, '\n$1')
        .replace(/\b(LEFT|RIGHT|INNER|OUTER|CROSS|FULL)?\s*JOIN\b/gi, '\n$1 JOIN')
        .replace(/\b(AND|OR)\b/gi, '\n  $1')
        .replace(/\b(INSERT|UPDATE|DELETE)\b/gi, '\n$1')
        .replace(/\bSET\b/gi, '\nSET')
        .replace(/\n\s*\n/g, '\n')
        .trim();
}

// Function to check SQL query for errors
function checkQuery() {
    const query = editor.getValue().trim();
    const errors = [];

    // Check for misspelled SQL keywords
    const misspelledWords = spellCheckSQL(query);
    misspelledWords.forEach(({ word, correct }) => {
        errors.push({
            message: `Misspelled keyword: ${word}`,
            suggestion: `Did you mean: ${correct}?`,
            severity: "error"
        });
    });

    // Check if query ends with a semicolon
    if (query.length > 0 && !query.endsWith(';')) {
        errors.push({
            message: "Missing semicolon at the end of the query",
            suggestion: "Ensure your query ends with a ';'",
            severity: "error"
        });
    }

    // Check for incomplete CREATE TABLE statements
    if (/CREATE TABLE\s+\w+(\s*\(.*\))?/i.test(query) && !query.includes('(')) {
        errors.push({
            message: "Incomplete CREATE TABLE statement",
            suggestion: "Ensure you define columns within parentheses, e.g., CREATE TABLE users (id INT, name VARCHAR(255));",
            severity: "error"
        });
    }

    // Check for unmatched parentheses
    const openParens = (query.match(/\(/g) || []).length;
    const closeParens = (query.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
        errors.push({
            message: "Unmatched parentheses detected",
            suggestion: "Ensure all opening parentheses '(' have matching closing parentheses ')'.",
            severity: "error"
        });
    }

    // Check for invalid GROUP BY usage
    if (/GROUP BY/i.test(query) && !/SELECT.*GROUP BY/i.test(query)) {
        errors.push({
            message: "Incorrect GROUP BY usage",
            suggestion: "Ensure GROUP BY is used correctly after SELECT.",
            severity: "error"
        });
    }

    // Check for incorrect JOIN usage
    if (/JOIN/i.test(query) && !/FROM\s+\w+\s+JOIN\s+\w+/i.test(query)) {
        errors.push({
            message: "Incorrect JOIN syntax",
            suggestion: "Ensure JOIN is used properly, e.g., SELECT * FROM users JOIN orders ON users.id = orders.user_id;",
            severity: "error"
        });
    }

    displayErrors(errors);
}

// Function to display errors
function displayErrors(errors) {
    errorList.innerHTML = '';
    if (errors.length === 0) {
        errorList.innerHTML = `<div class="list-group-item list-group-item-success"><i class="bi bi-check-circle-fill me-2"></i>No issues found!</div>`;
    } else {
        errors.forEach(error => {
            const errorItem = document.createElement('div');
            errorItem.classList.add('list-group-item', 'error-item', 'text-danger');
            errorItem.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${error.message} - ${error.suggestion}`;
            errorList.appendChild(errorItem);
        });
    }
}

// Function to check for misspelled SQL keywords
function spellCheckSQL(sql) {
    const misspelledWords = [];
    const words = sql.match(/\b\w+\b/g);
    if (words) {
        words.forEach(word => {
            const upperWord = word.toUpperCase();
            if (sqlKeywords.has(upperWord)) {
                misspelledWords.push({
                    word: upperWord,
                    correct: sqlKeywords.get(upperWord)
                });
            }
        });
    }
    return misspelledWords;
}

// Event listeners
editor.on('change', () => {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(checkQuery, 500);
});

formatBtn.addEventListener('click', () => {
    editor.setValue(formatSQL(editor.getValue()));
});

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the editor?')) {
        editor.setValue('');
    }
});
