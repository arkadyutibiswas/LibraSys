# LibraSys Test Checklist

## Web demo
- [ ] Open the root website and confirm the dashboard loads.
- [ ] Add a book with a unique ID; confirm it appears in inventory and dashboard counts.
- [ ] Add a duplicate ID; confirm validation prevents it.
- [ ] Search by title, author and ID.
- [ ] Edit a book and confirm copies already issued are accounted for.
- [ ] Register a student and search the directory.
- [ ] Issue an available book; confirm available copies decrease.
- [ ] Return the active issue; confirm available copies increase and transaction status changes.
- [ ] Try deleting a book with an active issue; confirm deletion is blocked.
- [ ] Refresh; confirm changes remain in the same browser.

## Java console
- [ ] Compile with `javac backend/java/*.java`.
- [ ] Display books and search by ID/title.
- [ ] Issue an available book to a registered student.
- [ ] Return the same book for that student.
- [ ] Confirm a second return is rejected.

## Kotlin console
- [ ] Compile with `kotlinc kotlin/src/Main.kt -include-runtime -d librasys.jar`.
- [ ] Display and search books.
- [ ] Issue and return a book.
- [ ] Confirm invalid menu choices and invalid issue/return requests are handled.
