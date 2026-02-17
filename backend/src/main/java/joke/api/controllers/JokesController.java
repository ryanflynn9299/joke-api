package joke.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import joke.api.entities.Joke;
import joke.api.services.JokesService;

@RestController
@RequestMapping("/api/v1")
public class JokesController {
    @Autowired
    private JokesService jokesService;

    @GetMapping("/jokes/jotd")
    public Joke getJokeOfTheDay() {
        return jokesService.getJokeOfTheDay();
    }

    @GetMapping("/jokes/{id}")
    public Joke getJokeById(@PathVariable Long id) {
        return jokesService.getJokeById(id);
    }

    @GetMapping("/jokes")
    public List<Joke> getAllJokes() {
        return jokesService.getAllJokes();
    }
}