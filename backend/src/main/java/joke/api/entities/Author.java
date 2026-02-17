package joke.api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "author")
public class Author {
    @Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
    private int authorId;

    @Column(nullable = false)
    private String authorFirstName;

    @Column(nullable = false)
    private String authorLastName;

    protected Author() {
        
    }


    @Override
    public String toString() {
        return String.format("Author[id=%d, first=%s, last=%s]", 
            this.authorId, this.authorFirstName, this.authorLastName);
    }

    public Integer getAuthorId() {
        return this.authorId;
    }

    public String getAuthorFirstName() {
        return this.authorFirstName;
    }

    public String getAuthorLastName() {
        return this.authorLastName;
    }

    public String getAuthorFullName() {
        return String.format("%s %s", this.authorFirstName, this.authorLastName);
    }
}
