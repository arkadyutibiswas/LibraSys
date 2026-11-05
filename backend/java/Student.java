package backend.java;

/** Stores a registered library member. */
public class Student {
    private final String studentId;
    private final String studentName;
    private final String email;

    public Student(String studentId, String studentName, String email) {
        if (studentId == null || studentId.trim().isEmpty() || studentName == null || studentName.trim().isEmpty())
            throw new IllegalArgumentException("Student ID and name are required.");
        if (email == null || !email.contains("@")) throw new IllegalArgumentException("Enter a valid email.");
        this.studentId = studentId.trim().toUpperCase();
        this.studentName = studentName.trim();
        this.email = email.trim();
    }
    public String getStudentId() { return studentId; }
    public String getStudentName() { return studentName; }
    public String getEmail() { return email; }
    @Override public String toString() { return studentId + " | " + studentName + " | " + email; }
}