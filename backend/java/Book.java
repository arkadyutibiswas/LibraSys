package backend.java;

/** Represents one title in the library catalogue. */
public class Book {
    private final String bookId;
    private String title;
    private String author;
    private int publicationYear;
    private int totalCopies;
    private int availableCopies;

    public Book(String bookId, String title, String author, int publicationYear, int totalCopies) {
        if (bookId == null || bookId.trim().isEmpty()) throw new IllegalArgumentException("Book ID is required.");
        if (title == null || title.trim().isEmpty()) throw new IllegalArgumentException("Title is required.");
        if (author == null || author.trim().isEmpty()) throw new IllegalArgumentException("Author is required.");
        if (publicationYear < 0 || totalCopies < 1) throw new IllegalArgumentException("Invalid year or copy count.");
        this.bookId = bookId.trim().toUpperCase();
        this.title = title.trim();
        this.author = author.trim();
        this.publicationYear = publicationYear;
        this.totalCopies = totalCopies;
        this.availableCopies = totalCopies;
    }
    public String getBookId() { return bookId; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public int getPublicationYear() { return publicationYear; }
    public int getTotalCopies() { return totalCopies; }
    public int getAvailableCopies() { return availableCopies; }
    public boolean isAvailable() { return availableCopies > 0; }
    public void updateDetails(String title, String author, int year, int total) {
        int issued = totalCopies - availableCopies;
        if (title == null || title.trim().isEmpty() || author == null || author.trim().isEmpty() || year < 0 || total < Math.max(1, issued))
            throw new IllegalArgumentException("Invalid book details.");
        this.title = title.trim(); this.author = author.trim(); this.publicationYear = year;
        this.totalCopies = total; this.availableCopies = total - issued;
    }
    public boolean issueCopy() { if (availableCopies == 0) return false; availableCopies--; return true; }
    public void returnCopy() { if (availableCopies < totalCopies) availableCopies++; }
    @Override public String toString() {
        return String.format("%-8s %-28s %-24s %-8d %d/%d", bookId, title, author, publicationYear, availableCopies, totalCopies);
    }
}