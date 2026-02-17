INSERT INTO author(author_first_name, author_last_name, last_posted_date)
VALUES ('Ryan','Flynn','2026-02-04')
ON CONFLICT (author_id) DO NOTHING;

INSERT INTO jokes(content, author_id, joke_type)
VALUES ('Why was Cinderella so bad at soccer?;She ran away from the ball!', 1, 'ONE_LINER')
ON CONFLICT (joke_id) DO NOTHING;

INSERT INTO jokes(content, author_id, joke_type)
VALUES ('Why can''t you hear a pterodactyl going to the bathroom?;Because the “P” is silent.', 1, 'ONE_LINER')
ON CONFLICT (joke_id) DO NOTHING;

INSERT INTO jokes(content, author_id, joke_type)
VALUES ('What do you call a well-balanced horse?;Stable.', 1, 'ONE_LINER')
ON CONFLICT (joke_id) DO NOTHING;

INSERT INTO jokes(content, author_id, joke_type)
VALUES ('What do you call an angry carrot?;A steamed veggie.', 1, 'ONE_LINER')
ON CONFLICT (joke_id) DO NOTHING;