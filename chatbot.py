import json
import random
import re


class RuleBasedChatbot:
    """Rule-based chatbot using predefined intents and patterns."""

    def __init__(self, intents_file="intents.json"):
        self.intents = self.load_intents(intents_file)

    def load_intents(self, intents_file):
        """Load chatbot data from JSON file."""

        try:
            with open(intents_file, "r", encoding="utf-8") as file:
                data = json.load(file)

            return data.get("intents", [])

        except FileNotFoundError:
            print("Error: intents.json file not found.")
            return []

        except json.JSONDecodeError:
            print("Error: Invalid JSON format.")
            return []

    def clean_text(self, text):
        """Normalize user input for better matching."""

        text = text.lower().strip()

        # Remove punctuation
        text = re.sub(r"[^\w\s]", "", text)

        # Remove extra spaces
        text = re.sub(r"\s+", " ", text)

        return text

    def calculate_score(self, user_input, pattern):
        """Calculate similarity score between input and pattern."""

        user_words = set(self.clean_text(user_input).split())
        pattern_words = set(self.clean_text(pattern).split())

        if not user_words or not pattern_words:
            return 0

        matching_words = user_words.intersection(pattern_words)

        return len(matching_words) / len(pattern_words)

    def get_response(self, user_input):
        """Find the best matching intent and return a response."""

        if not user_input.strip():
            return "Please type something so I can help you. 😊"

        best_intent = None
        best_score = 0

        for intent in self.intents:

            for pattern in intent.get("patterns", []):

                score = self.calculate_score(
                    user_input,
                    pattern
                )

                if score > best_score:
                    best_score = score
                    best_intent = intent

        # Minimum confidence required
        if best_intent and best_score >= 0.5:

            responses = best_intent.get("responses", [])

            if responses:
                return random.choice(responses)

        return (
            "I'm sorry, I didn't understand that. 🤔 "
            "Try asking me something else."
        )


if __name__ == "__main__":

    chatbot = RuleBasedChatbot()

    print("\n================================")
    print("🤖 RULE-BASED AI CHATBOT")
    print("================================")
    print("Type 'bye' to exit.\n")

    while True:

        user_input = input("You: ")

        response = chatbot.get_response(user_input)

        print("Bot:", response)

        if user_input.lower().strip() in [
            "bye",
            "goodbye",
            "exit",
            "quit"
        ]:
            break