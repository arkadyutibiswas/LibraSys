import java.time.LocalDate

data class Book(
    val id: String, val title: String, val author: String,
    val publicationYear: Int, val totalCopies: Int, var availableCopies: Int = totalCopies
)
data class Student(val id: String, val name: String)
data class IssueRecord(val bookId: String, val studentId: String, val issueDate: LocalDate, var returnDate: LocalDate? = null)

class Library {
    val books = linkedMapOf<String, Book>()
    val students = linkedMapOf<String, Student>()
    val transactions = mutableListOf<IssueRecord>()

    fun addBook(book: Book) {
        require(book.id.isNotBlank() && book.title.isNotBlank() && book.author.isNotBlank()) { "Book details cannot be empty." }
        require(book.publicationYear >= 0 && book.totalCopies > 0) { "Invalid year or copy count." }
        require(!books.containsKey(book.id.uppercase())) { "Duplicate Book ID." }
        books[book.id.uppercase()] = book.copy(id = book.id.uppercase())
    }
    fun issueBook(bookId: String, studentId: String) {
        val book = books[bookId.uppercase()] ?: error("Book not found.")
        require(students.containsKey(studentId.uppercase())) { "Student not found." }
        require(book.availableCopies > 0) { "No copies available." }
        book.availableCopies--
        transactions.add(IssueRecord(book.id, studentId.uppercase(), LocalDate.now()))
    }
    fun returnBook(bookId: String, studentId: String) {
        val record = transactions.lastOrNull { it.bookId.equals(bookId, true) && it.studentId.equals(studentId, true) && it.returnDate == null }
            ?: error("No matching outstanding issue record.")
        record.returnDate = LocalDate.now()
        books[record.bookId]?.let { it.availableCopies++ }
    }
    fun activeIssues() = transactions.filter { it.returnDate == null }
}

fun main() {
    val library = Library()
    library.addBook(Book("B101", "The Alchemist", "Paulo Coelho", 1988, 5))
    library.addBook(Book("B102", "Wings of Fire", "A. P. J. Abdul Kalam", 1999, 4))
    library.addBook(Book("B103", "Atomic Habits", "James Clear", 2018, 6))
    library.students["S101"] = Student("S101", "Aarav Sharma")
    library.students["S102"] = Student("S102", "Ananya Das")

    while (true) {
        println("\n========== LIBRASYS ==========")
        println("1. Display All Books")
        println("2. Search Book by ID")
        println("3. Search Book by Title")
        println("4. Issue Book")
        println("5. Return Book")
        println("6. Display Issued Books")
        println("0. Exit")
        print("Enter your choice: ")
        val choice = readLine()?.trim()?.toIntOrNull() ?: -1
        try {
            when (choice) {
                1 -> {
                    println("%-8s %-28s %-24s %-8s %s".format("ID", "TITLE", "AUTHOR", "YEAR", "AVAILABLE/TOTAL"))
                    library.books.values.forEach { println("%-8s %-28s %-24s %-8d %d/%d".format(it.id, it.title, it.author, it.publicationYear, it.availableCopies, it.totalCopies)) }
                }
                2 -> { print("Enter Book ID: "); val b=library.books[readLine()?.trim()?.uppercase()]; println(b ?: "Book not found.") }
                3 -> { print("Enter title keyword: "); val q=readLine()?.trim().orEmpty(); val found=library.books.values.filter { it.title.contains(q, true) }; if(found.isEmpty()) println("No matching books found.") else found.forEach { println(it) } }
                4 -> { print("Book ID: "); val b=readLine()?.trim().orEmpty(); print("Student ID: "); val s=readLine()?.trim().orEmpty(); library.issueBook(b,s); println("Book issued successfully.") }
                5 -> { print("Book ID: "); val b=readLine()?.trim().orEmpty(); print("Student ID: "); val s=readLine()?.trim().orEmpty(); library.returnBook(b,s); println("Book returned successfully.") }
                6 -> { val active=library.activeIssues(); if(active.isEmpty()) println("No books are currently issued.") else active.forEach { println("${it.bookId} | ${it.studentId} | ${it.issueDate}") } }
                0 -> { println("Thank you for using LibraSys!"); return }
                else -> println("Invalid choice. Try again.")
            }
        } catch (e: IllegalArgumentException) { println("Error: ${e.message}") }
          catch (e: IllegalStateException) { println("Error: ${e.message}") }
    }
}