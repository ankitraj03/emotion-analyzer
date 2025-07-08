from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)


def analyze_emotion(text):
    text = text.lower()

    emotion_map = {
        'happy': ['happy', 'joy', 'excited', 'great', 'good'],
        'sad': ['sad', 'unhappy', 'cry', 'depressed'],
        'angry': ['angry', 'mad', 'furious', 'irritated'],
        'anxious': ['nervous', 'worried', 'anxious', 'scared'],
        'confident': ['confident', 'strong', 'ready', 'capable'],
    }

    for emotion, keywords in emotion_map.items():
        if any(word in text for word in keywords):
            return emotion.capitalize()

    return random.choice(['Neutral', 'Confused', 'Meh', 'Calm'])

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        user_text = data.get('text', '')
        emotion = analyze_emotion(user_text)

        return jsonify({'emotion': emotion})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
