package joke.api.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import joke.api.entities.Joke;

/**
 * Spring Data JPA repository for the Joke entity. Provides general functionality
 * currently. Could use CrudRepository or ListCrudRepository instead, but JpaRepository is more common.
 */
public interface  JokeRepository extends JpaRepository<Joke, Integer>, JpaSpecificationExecutor<Joke> {
    
    // Specific utilities for retrieval

    @Query("SELECT j FROM Joke j WHERE lower(j.author.authorFirstName) LIKE lower(concat('%', :name, '%')) OR lower(j.author.authorLastName) LIKE lower(concat('%', :name, '%'))")
    List<Joke> searchByAuthorName(@Param("name") String name, Pageable pageable);
    public List<Joke> findByJokeType(String jokeType);
    
    

    // Find all
    public Page<Joke> findAll(Pageable pageable);
    public List<Joke> findAll();

    // Utilities for JOTD
    public Joke findJokeByLastJotdDatetime(LocalDate lastJotdDate);

    @Query(value = "SELECT * FROM jokes WHERE (last_jotd_datetime IS NULL OR last_jotd_datetime < :threshold) ORDER BY random() LIMIT 1", nativeQuery = true)
    public Joke findRandomJokeOfTheDayCandidate(@Param("threshold") LocalDate tenDaysAgo);

    @Modifying
    @Query(value = "UPDATE jokes SET last_jotd_datetime = :date WHERE joke_id = :jokeId", nativeQuery = true)
    public void updateJokeOfTheDay(@Param("date") LocalDate date, @Param("jokeId") Integer jokeId);
}
