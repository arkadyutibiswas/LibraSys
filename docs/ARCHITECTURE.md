# LibraSys Architecture

## Web application
The static web app is served from the repository root. `index.html` defines the dashboard and page sections, `styles.css` provides the responsive design, and `app.js` handles the interface and data operations.

The browser demo stores its dataset in localStorage under `librasys_db_v1`. This makes the demonstration persistent in one browser profile, but it does not provide multi-user synchronisation or a server-side database.

## Data model
- **Book:** ID, title, author, publication year, total copies, available copies and category.
- **Student:** ID, name, email and registration date.
- **Transaction:** transaction ID, book ID, student ID, issue date and optional return date.

A transaction with no return date is an active issue. Issuing a book decrements available copies; returning an active transaction increments them.

## Console implementations
The Java implementation separates the `Book` and `Student` models from the `LibraryService` business logic and `Main` menu.
The Kotlin implementation uses data classes, linked maps, a mutable transaction list and a `when` menu.

The Java and Kotlin console applications are separate learning implementations; neither is wired to the browser demo.
