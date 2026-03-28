package joke.daemon.services;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.micrometer.observation.annotation.Observed;
import joke.api.entities.Joke;
import joke.api.repositories.JokeRepository;

@Service
public class JokeOfTheDayService {
    private final JokeRepository jokeRepository;

    private final static int JOTD_CANDIDATE_LOOKBACK_DAYS = 10;

    @Autowired
    public JokeOfTheDayService(JokeRepository jokeRepository) {
        this.jokeRepository = jokeRepository;
    }

    /**
     * Idempotently reset the joke of the day, picking a random joke that
     * has not been used in the last 10 days (see the threshold value at top of the file).
     * 
     * @return void
     */
    @Observed
    @Transactional
    public synchronized void resetJokeOfTheDay() {
        LocalDate today = LocalDate.now();
        Joke jotd = this.jokeRepository.findJokeByLastJotdDatetime(today);
        if (jotd != null) {
            return;
        }

        LocalDate xDaysAgo = today.minusDays(JOTD_CANDIDATE_LOOKBACK_DAYS);

        Joke randomJotdCandidate = this.jokeRepository.findRandomJokeOfTheDayCandidate(xDaysAgo);
        this.jokeRepository.updateJokeOfTheDay(today, randomJotdCandidate.getId());
    }

}
