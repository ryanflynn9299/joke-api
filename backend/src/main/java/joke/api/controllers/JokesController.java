package joke.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import joke.api.entities.Joke;
import joke.api.services.JokesService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1")
public class JokesController {
    @Autowired
    private JokesService jokesService;

    @GetMapping("/joke-of-the-day")
    public Joke getJokeOfTheDay() {
        return jokesService.getJokeOfTheDay();
    }

    @GetMapping("/jokes/{id}")
    public Joke getJokeById(@PathVariable Integer id) {
        return jokesService.getJokeById(id);
    }

    @GetMapping("/jokes")
    public List<Joke> getAllJokes() {
        return jokesService.getAllJokes();
    }

    @GetMapping("/jokes/search")
    public Page<Joke> searchJokes(@RequestParam(name = "q", required = false) String query, Pageable pageable) {
        return jokesService.searchJokes(query, pageable);
    }
}