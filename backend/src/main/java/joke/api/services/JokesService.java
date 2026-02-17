package joke.api.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.micrometer.observation.annotation.Observed;
import joke.api.entities.Joke;
import joke.api.repositories.JokeRepository;

@Service
public class JokesService {
    /**
     * Responsibilities and features
     * 1) Orchestrate read - Priority
     *      - Read JOTD
     *      - Read n jokes
     *      - Read all jokes
     *      - Read all by author
     *      - Read pageable
     * 
     * 2) Orchestrate create new entities - next priority
     *      - Create one joke
     *      - Create several jokes
     * 
     * 3) Orchestrate update existing entities
     *      - PUT and PATCH one
     *      - PUT and PATCH multiple (low priority)
     *      - PATCH updates modified date, PUT does not
     * 
     * 4) Orchestrate Delete - (low priority)
     *      - soft delete (privileged)
     *      - hard delete (privileged)
     *      - bulk soft delete
     *      - no bulk soft delete
     */
    private final JokeRepository jokeRepository;

    @Autowired
    public JokesService(JokeRepository jokeRepository) {
        this.jokeRepository = jokeRepository;
    }

    @Observed
    @Transactional
    public Joke getJokeOfTheDay() {
        LocalDate today = LocalDate.now();
        Joke jotd = this.jokeRepository.findJokeByLastJotdDate(today);
        return jotd;
    }

    @Observed
    @Transactional
    public Joke getJokeById(Long id) {
        return jokeRepository.findByJokeId(id);
    }

    @Observed
    @Transactional
    public List<Joke> getNJokes(int n) {
        return jokeRepository.findJokesWithLimit(n);
    }

    @Observed
    @Transactional
    public List<Joke> getAllJokes() {
        return jokeRepository.findByIsDeletedFalse();
    }
}
