package joke.api.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import joke.api.entities.Joke;

/**
 * Spring Data JPA repository for the Joke entity. Provides general functionality
 * currently. Could use CrudRepository or ListCrudRepository instead, but JpaRepository is more common.
 */
public interface  JokeRepository extends JpaRepository<Joke, Long> {
    // Used for main JOTD retrieval
    public Joke findJokeByLastJotdDate(LocalDate lastJotdDate);

    // Specific utilities for retrieval
    public Joke findByJokeId(Long jokeId);
    @Query("SELECT j FROM Joke j WHERE j.author.id = :authorId")
    public List<Joke> findByAuthorIdAndIsDeletedFalse(Long authorId);
    public List<Joke> findByJokeTypeAndIsDeletedFalse(String jokeType);
    @Query(value = "SELECT * FROM jokes WHERE is_deleted = false LIMIT :limit", nativeQuery = true)
    public List<Joke> findJokesWithLimit(@Param("limit") int limit);

    // Find all
    public List<Joke> findByIsDeletedFalse(Pageable pageable);
    public List<Joke> findByIsDeletedFalse();
}
