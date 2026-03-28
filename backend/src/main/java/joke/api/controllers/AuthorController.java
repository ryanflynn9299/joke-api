package joke.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import joke.api.entities.Author;
import joke.api.services.AuthorService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1")
public class AuthorController {

    @Autowired
    private AuthorService authorService;

    @GetMapping("/authors/{id}")
    public Author getAuthorById(@PathVariable Integer id) {
        return authorService.getAuthorById(id);
    }

}
