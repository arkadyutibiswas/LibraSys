package backend.java;

import java.util.Scanner;

public class Main {
    private static final Scanner input = new Scanner(System.in);
    private static final LibraryService library = new LibraryService();

    public static void main(String[] args) {
        seedData();
        int choice;
        do {
            System.out.println("\n========== LIBRASYS ==========");
            System.out.println("1. Display All Books");
            System.out.println("2. Search Book by ID");
            System.out.println("3. Search Book by Title");
            System.out.println("4. Issue Book");
            System.out.println("5. Return Book");
            System.out.println("6. Display Issued Books");
            System.out.println("0. Exit");
            System.out.print("Enter your choice: ");
            choice = readInt();
            try {
                switch (choice) {
                    case 1: displayBooks(); break;
                    case 2: searchById(); break;
                    case 3: searchByTitle(); break;
                    case 4: issueBook(); break;
                    case 5: returnBook(); break;
                    case 6: displayIssued(); break;
                    case 0: System.out.println("Thank you for using LibraSys!"); break;
                    default: System.out.println("Invalid choice. Try again.");
                }
            } catch (RuntimeException ex) { System.out.println("Error: " + ex.getMessage()); }
        } while (choice != 0);
    }
    private static int readInt() {
        try { return Integer.parseInt(input.nextLine().trim()); }
        catch (NumberFormatException ex) { return -1; }
    }
    private static void seedData() {
        library.addBook(new Book("B101","The Alchemist","Paulo Coelho",1988,5));
        library.addBook(new Book("B102","Wings of Fire","A. P. J. Abdul Kalam",1999,4));
        library.addBook(new Book("B103","Atomic Habits","James Clear",2018,6));
        library.registerStudent(new Student("S101","Aarav Sharma","aarav@college.edu"));
        library.registerStudent(new Student("S102","Ananya Das","ananya@college.edu"));
    }
    private static void displayBooks() {
        System.out.printf("%-8s %-28s %-24s %-8s %s%n","ID","TITLE","AUTHOR","YEAR","AVAILABLE/TOTAL");
        for (Book b : library.getAllBooks()) System.out.println(b);
    }
    private static void searchById() {
        System.out.print("Enter Book ID: "); Book b=library.findBookById(input.nextLine().trim());
        System.out.println(b==null?"Book not found.":b);
    }
    private static void searchByTitle() {
        System.out.print("Enter title keyword: "); var found=library.searchByTitle(input.nextLine().trim());
        if(found.isEmpty()) System.out.println("No matching books found.");
        else for(Book b:found) System.out.println(b);
    }
    private static void issueBook() {
        System.out.print("Book ID: "); String b=input.nextLine().trim();
        System.out.print("Student ID: "); String s=input.nextLine().trim();
        library.issueBook(b,s); System.out.println("Book issued successfully.");
    }
    private static void returnBook() {
        System.out.print("Book ID: "); String b=input.nextLine().trim();
        System.out.print("Student ID: "); String s=input.nextLine().trim();
        library.returnBook(b,s); System.out.println("Book returned successfully.");
    }
    private static void displayIssued() {
        var active=library.getActiveIssues();
        if(active.isEmpty()) { System.out.println("No books are currently issued."); return; }
        for(var r:active) System.out.println(r.getBookId()+" | "+r.getStudentId()+" | "+r.getIssueDate());
    }
}