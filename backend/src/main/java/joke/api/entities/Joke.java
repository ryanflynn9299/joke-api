package joke.api.entities;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.SourceType;

import jakarta.persistence.Transient;
import java.util.List;
import java.util.ArrayList;

@Entity
@SQLRestriction("is_deleted = false")
@Table(name = "jokes")
public class Joke {
    @Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
    private int jokeId;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String jokeContent;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JokeType jokeType;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;

    @CreationTimestamp(source=SourceType.DB)
    @Column(updatable = false, nullable = false)
    private OffsetDateTime createdDate;

    @UpdateTimestamp(source=SourceType.DB)
    @Column(nullable = false)
    private OffsetDateTime modifiedDate;

    @Column(name = "last_jotd_datetime")
    private LocalDate lastJotdDatetime;

    @Column(name="is_deleted")
    private Boolean isDeleted;       // always False, never read if true


    @Override
    public String toString() {
        return String.format("Joke[content=%s, author=%d]", 
            this.jokeContent, this.author.getAuthorId());
    }

    public Integer getId() {
        return this.jokeId;
    }

    public String getJokeContent() {
        return this.jokeContent;
    }

    public JokeType getJokeType() {
        return this.jokeType;
    }

    public Author getAuthor() {
        return this.author;
    }

    public OffsetDateTime getCreatedDateTime() {
        return this.createdDate;
    }

    public OffsetDateTime getModidifiedDateTime() {
        return this.modifiedDate;
    }

    public LocalDate getLastJotdDatetime() {
        return this.lastJotdDatetime;
    }

    @Transient
    public List<JokeSegment> getSegments() {
        if (this.jokeContent == null || this.jokeContent.isEmpty()) {
            return new ArrayList<>();
        }
        String[] parts = this.jokeContent.split(";");
        List<JokeSegment> segments = new ArrayList<>();
        
        for (int i = 0; i < parts.length; i++) {
            String text = parts[i].trim();
            if (text.isEmpty()) continue;
            
            String type = (i == 0) ? "SETUP" : 
                          (i == parts.length - 1) ? "PUNCHLINE" : "INTERACTION";
            segments.add(new JokeSegment(text, type, i));
        }
        return segments;
    }
}
