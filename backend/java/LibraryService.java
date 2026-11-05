package backend.java;

import java.time.LocalDate;
import java.util.*;

/** Business logic for catalogue, members and circulation records. */
public class LibraryService {
    private final Map<String, Book> books = new LinkedHashMap<>();
    private final Map<String, Student> students = new LinkedHashMap<>();
    private final List<IssueRecord> transactions = new ArrayList<>();

    public void addBook(Book book) {
        if (books.containsKey(book.getBookId())) throw new IllegalArgumentException("Duplicate Book ID.");
        books.put(book.getBookId(), book);
    }
    public void registerStudent(Student student) {
        if (students.containsKey(student.getStudentId())) throw new IllegalArgumentException("Duplicate Student ID.");
        students.put(student.getStudentId(), student);
    }
    public Collection<Book> getAllBooks() { return Collections.unmodifiableCollection(books.values()); }
    public Book findBookById(String id) { return books.get(id.toUpperCase()); }
    public List<Book> searchByTitle(String query) {
        List<Book> found = new ArrayList<>();
        for (Book b : books.values()) if (b.getTitle().toLowerCase().contains(query.toLowerCase())) found.add(b);
        return found;
    }
    public List<IssueRecord> getActiveIssues() {
        List<IssueRecord> active = new ArrayList<>();
        for (IssueRecord r : transactions) if (!r.isReturned()) active.add(r);
        return active;
    }
    public List<IssueRecord> getTransactions() { return Collections.unmodifiableList(transactions); }
    public void issueBook(String bookId, String studentId) {
        Book b = findBookById(bookId);
        if (b == null) throw new IllegalArgumentException("Book not found.");
        if (!students.containsKey(studentId.toUpperCase())) throw new IllegalArgumentException("Student not found.");
        if (!b.issueCopy()) throw new IllegalStateException("No copies available.");
        transactions.add(new IssueRecord(b.getBookId(), studentId.toUpperCase(), LocalDate.now()));
    }
    public void returnBook(String bookId, String studentId) {
        for (int i = transactions.size() - 1; i >= 0; i--) {
            IssueRecord r = transactions.get(i);
            if (r.getBookId().equalsIgnoreCase(bookId) && r.getStudentId().equalsIgnoreCase(studentId) && !r.isReturned()) {
                r.markReturned(LocalDate.now()); books.get(r.getBookId()).returnCopy(); return;
            }
        }
        throw new IllegalArgumentException("No matching outstanding issue record.");
    }
    public Student findStudentById(String id) { return students.get(id.toUpperCase()); }

    public static class IssueRecord {
        private final String bookId, studentId;
        private final LocalDate issueDate;
        private LocalDate returnDate;
        IssueRecord(String bookId, String studentId, LocalDate issueDate) { this.bookId=bookId; this.studentId=studentId; this.issueDate=issueDate; }
        public String getBookId() { return bookId; }
        public String getStudentId() { return studentId; }
        public LocalDate getIssueDate() { return issueDate; }
        public LocalDate getReturnDate() { return returnDate; }
        public boolean isReturned() { return returnDate != null; }
        void markReturned(LocalDate date) { returnDate=date; }
    }
}