package joke.api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import joke.api.entities.Author;


public interface AuthorRepository extends JpaRepository<Author, Long> {

    List<Author> findByAuthorFirstName(String authorFirstName);
    Author findByAuthorId(Long authorId);
}
