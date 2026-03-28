package joke.api.entities;

public class JokeSegment {
    private String text;
    private String type;
    private int revealStep;

    public JokeSegment(String text, String type, int revealStep) {
        this.text = text;
        this.type = type;
        this.revealStep = revealStep;
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getRevealStep() { return revealStep; }
    public void setRevealStep(int revealStep) { this.revealStep = revealStep; }
}
