# LibraSys — Library Management System

A multi-technology Library Management System created as an IT Workshop project using **HTML, CSS, JavaScript, Java and Kotlin**.

## Live demo
After enabling GitHub Pages, the website will be available at:
https://arkadyutibiswas.github.io/LibraSys/

## Features
- Dashboard with live collection, available-copy, issued-book and student counts
- Searchable book catalogue with add, edit and delete actions
- Student registration and directory search
- Issue a book to a registered student and return it against its active issue record
- Transaction history with issue and return dates
- Responsive desktop and mobile layout
- Browser storage so demo changes remain saved in the same browser

## Technologies
| Technology | Purpose |
|---|---|
| HTML | Page structure and accessible forms |
| CSS | Responsive layout and visual design |
| JavaScript | Interactive dashboard and browser-side data handling |
| Java | Object-oriented console implementation |
| Kotlin | Console implementation using collections and `when` |

## Run the website locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Use the dashboard to add books and students, issue copies, and record returns.

The website is a front-end demonstration. Its data is stored in the current browser using localStorage; it is **not yet connected** to the Java or Kotlin console programs or a shared database. Clearing browser storage resets the demo data.

## Run the Java console version
From the repository root:

```bash
javac backend/java/*.java
java backend.java.Main
```

## Run the Kotlin console version
With the Kotlin compiler installed:

```bash
kotlinc kotlin/src/Main.kt -include-runtime -d librasys.jar
java -jar librasys.jar
```

## Project structure
```text
LibraSys/
├── index.html
├── styles.css
├── app.js
├── backend/
│   └── java/
│       ├── Book.java
│       ├── Student.java
│       ├── LibraryService.java
│       └── Main.java
└── kotlin/
    └── src/
        └── Main.kt
```

No login is required. The dashboard opens in demo mode with sample books, students and issue records.

---
Made for learning, organised for real use.