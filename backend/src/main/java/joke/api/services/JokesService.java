package joke.api.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.micrometer.observation.annotation.Observed;
import joke.api.entities.Joke;
import joke.api.repositories.JokeRepository;
import joke.daemon.services.JokeOfTheDayService;

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
    private final JokeOfTheDayService jokeOfTheDayService;

    @Autowired
    public JokesService(JokeRepository jokeRepository, JokeOfTheDayService jokeOfTheDayService) {
        this.jokeRepository = jokeRepository;
        this.jokeOfTheDayService = jokeOfTheDayService;
    }

    @Observed
    @Transactional
    public Joke getJokeOfTheDay() {
        LocalDate today = LocalDate.now();
        Joke jotd = this.jokeRepository.findJokeByLastJotdDatetime(today);

        if (jotd == null) {
            return resetJotdAndQueryAgain();
        }

        return jotd;
    }

    @Observed
    @Transactional
    public Joke getJokeById(Integer id) {
        return jokeRepository.findById(id).orElse(null);
    }

    @Observed
    @Transactional
    public List<Joke> getNJokes(int n) {
        return jokeRepository.findAll(PageRequest.of(0, n)).getContent();
    }

    @Observed
    @Transactional
    public List<Joke> getAllJokes() {
        return jokeRepository.findAll();
    }

    public Page<Joke> searchJokes(String searchTerm, Pageable pageable) {
        Specification<Joke> spec = JokesSpecification.withDynamicKeywordFilter(searchTerm);
        return jokeRepository.findAll(spec, pageable);
    }

    private Joke resetJotdAndQueryAgain() {
        this.jokeOfTheDayService.resetJokeOfTheDay();

        LocalDate today = LocalDate.now();
        return this.jokeRepository.findJokeByLastJotdDatetime(today);
    }
}
