package joke.daemon.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import joke.daemon.services.JokeOfTheDayService;

@Component
public class JokeOfTheDayDaemon implements CommandLineRunner {
    private final JokeOfTheDayService jokeOfTheDayService;

    @Autowired
    public JokeOfTheDayDaemon(JokeOfTheDayService jokeOfTheDayService) {
        this.jokeOfTheDayService = jokeOfTheDayService;
    }
    
    @Scheduled(cron = "0 */15 * * * ?", zone = "America/New_York")
    public void resetJokeOfTheDay() {
        jokeOfTheDayService.resetJokeOfTheDay();
    }

    @Override
    public void run(String... args) throws Exception {
        // reset the JOTD on startup. If the JOTD is already set for the day,
        // it will not be reset.
        jokeOfTheDayService.resetJokeOfTheDay();
    }
}
