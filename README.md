# LibraSys — Student Library Portal

A multi-technology Library Management System created as an IT Workshop project using HTML, CSS, JavaScript, Java and Kotlin.

## Live demo
https://arkadyutibiswas.github.io/LibraSys/

## Student portal features
- Student-focused dashboard with catalogue and personal borrowing summary
- Search and filter 28 well-known books across fiction, fantasy, classics, mystery, science, technology, biography and self-development
- Open book details with descriptions, author, category, year and availability
- Borrow available books from the catalogue
- Request an unavailable title or suggest a title not yet listed
- Track personal book requests and their demo status
- Personal borrowing history with 14-day due dates and overdue status
- Return-book action in the demo
- Demo student switcher to preview the portal from different sample student accounts
- Responsive layout, visible champagne-gold accents and interactive button states
- Browser localStorage persistence

## Technologies
| Technology | Purpose |
|---|---|
| HTML | Page structure and accessible controls |
| CSS | Responsive layout, theme and interactions |
| JavaScript | Catalogue, borrowing records and browser-side data |
| Java | Object-oriented console implementation |
| Kotlin | Console implementation using collections and when |

## Run the website
Open index.html in a modern browser, or visit the GitHub Pages link above.

The website is a front-end student demo. Catalogue, borrowing and book-request data are stored in the current browser using localStorage; requests are not sent to a librarian and their “Pending review” status is illustrative only. It is not connected to a shared database or to the Java/Kotlin console programs. The demo profile switcher is not real authentication, and browser-side permissions are not a security boundary. A real multi-user deployment would need a backend, verified student login, server-side authorization and a staff workflow to review requests.

Existing browser data is preserved when the expanded catalogue is loaded; new catalogue titles are added without deleting existing borrowing records.

## Run the Java console version
```bash
javac backend/java/*.java
java backend.java.Main
```

## Run the Kotlin console version
```bash
kotlinc kotlin/src/Main.kt -include-runtime -d librasys.jar
java -jar librasys.jar
```

Made for learning, organised for readers.
