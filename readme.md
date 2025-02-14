# SQL Query Checker

![SQL Query Checker](https://img.shields.io/badge/SQL-Checker-blue?style=for-the-badge)

A powerful **SQL Query Checker & Formatter** that helps detect spelling mistakes, syntax errors, and formatting issues in SQL queries. 🚀

## ✨ Features

✅ **Real-time spell checking** for SQL keywords  
✅ **SQL syntax validation** (e.g., missing semicolons, unmatched parentheses, incorrect `JOIN` usage)  
✅ **Auto-formatting** for cleaner and more readable SQL queries  
✅ **CodeMirror Integration** for a smooth editing experience  
✅ **Supports MySQL syntax checking**  
✅ **Interactive error highlighting**  

## 🛠 Installation & Setup

### 🔹 Clone the Repository
```sh
$ git clone https://github.com/yourusername/sql-query-checker.git
$ cd sql-query-checker
```

### 🔹 Install Dependencies (if needed)
This project mainly uses frontend technologies, so no backend setup is required. Just open `index.html` in your browser!

## 🚀 Usage
1. **Enter your SQL query** in the editor.
2. **Errors will be highlighted** in real-time.
3. Click **Format SQL** to clean up your query.
4. Click **Clear Editor** to reset the input.

## 📝 Example Queries
### ✅ **Correct Query**
```sql
SELECT name, email FROM users WHERE id = 1;
```
✔ No issues found!

### ❌ **Query with Errors**
```sql
SELCT name, email FRM users WHER id = 1
```
❌ Misspelled keywords: `SELCT` → `SELECT`, `FRM` → `FROM`, `WHER` → `WHERE`  
❌ Missing semicolon at the end of the query

## 🛠 Technologies Used
- **JavaScript** (CodeMirror for syntax highlighting)
- **HTML & CSS** (Frontend UI)
- **MySQL Query Checking**

## 📜 License
This project is licensed under the **MIT License**.

## 🤝 Contributing
Pull requests are welcome! If you find any issues or have suggestions, open an issue or contribute directly.

## ⭐ Acknowledgments
Special thanks to **CodeMirror** for providing an excellent SQL editor experience!

---

🔥 **Star this repo if you found it useful!** ⭐

