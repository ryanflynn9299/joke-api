package joke.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.micrometer.observation.annotation.Observed;
import joke.api.entities.Author;
import joke.api.repositories.AuthorRepository;

@Service
public class AuthorService {
    private final AuthorRepository authorRepository;


    @Autowired
    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @Observed
    @Transactional
    public Author getAuthorById(Integer id) {
        return this.authorRepository.findById(id).orElse(null);
    }
} 
