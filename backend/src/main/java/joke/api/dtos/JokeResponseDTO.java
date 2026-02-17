package joke.api.dtos;

import java.time.LocalDateTime;

import joke.api.entities.Author;
import joke.api.entities.JokeType;

public record JokeResponseDTO(Long id, String content, JokeType jokeType, Author author, 
    LocalDateTime createdDateTime, LocalDateTime updatedDateTime) {}
