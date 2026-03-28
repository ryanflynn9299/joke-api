package joke.api.services;

import org.springframework.data.jpa.domain.Specification;
import joke.api.entities.Joke;

public class JokesSpecification {
    
    /**
     * Creates a Specification that filters jokes based on a keyword.
     * The keyword is searched in the joke content, author first name, and author last name.
     * @param keyword The keyword to search for.
     * @return A Specification that filters jokes based on the keyword.
     */
    public static Specification<Joke> withDynamicKeywordFilter(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isBlank()) {
                return criteriaBuilder.conjunction(); // empty conjunction is true
            }
            String pattern = "%" + keyword.toLowerCase() + "%";
            return criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.lower(root.get("jokeContent")), pattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("author").get("authorFirstName")), pattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("author").get("authorLastName")), pattern)
            );
        };
    }
}
