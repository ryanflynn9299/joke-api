package joke.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import joke.api.entities.Author;
import joke.api.repositories.AuthorRepository;

@Service
public class AuthorService {
    private final AuthorRepository authorRepository;


    @Autowired
    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public Author getAuthorById(Long id) {
        return this.authorRepository.findByAuthorId(id);
    }
} 
