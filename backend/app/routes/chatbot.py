import os
import json
import logging
from flask import Blueprint, request, jsonify
import requests

logger = logging.getLogger(__name__)

chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/chat')

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM_PROMPT = """You are WanderBot, the friendly, world-class AI travel concierge for the WonderLust travel booking platform.
Your mission is to inspire, guide, and help travelers discover incredible destinations, find ideal hotels, book transport tickets (flights, trains, ferries), and connect with certified local guides.

WonderLust Platform Highlights:
- Top Featured Destinations: Bali (beaches, cultural temples, Ubud retreats), Paris (Eiffel Tower, Louvre, romantic bistros), Tokyo (Shibuya, cherry blossoms, futuristic dining), Swiss Alps (Matterhorn, skiing, scenic rail tours), Rome (Colosseum, Vatican, artisan pasta), New York City (Broadway, Central Park, skyline views), Santorini (sunset calderas, cliffside villas), and Kyoto (tranquil shrines, bamboo groves).
- Platform Services: Instant hotel bookings with free cancellation filters, multi-modal transport ticket reservation (flight, train, bus), verified local guide hiring, and real-time itinerary planning.
- Currency: Global support (USD $, EUR €, GBP £, INR ₹, etc.).

Your Personality & Response Style:
- Warm, enthusiastic, adventurous, yet practical and concise.
- Provide actionable recommendations (e.g. best areas to stay, hidden gems, ideal time of year to visit, estimated budgets, local culinary must-tries).
- Use structured, easy-to-read markdown formatting: bullet points, bold key highlights, and appropriate travel emojis.
- When relevant, encourage the user to explore WonderLust's Search page, Hotels section, Tickets, or Local Guides.
- Keep answers engaging, helpful, and typically within 2-4 focused paragraphs or structured bullet lists unless the user asks for a comprehensive detailed day-by-day itinerary.
"""

DEFAULT_SUGGESTIONS = [
    {
        "id": "itinerary-tokyo",
        "title": "3 Days in Tokyo 🗼",
        "prompt": "Can you design a 3-day cultural and foodie itinerary for Tokyo?"
    },
    {
        "id": "bali-hotels",
        "title": "Top Stays in Bali 🌴",
        "prompt": "What are the best areas and hotels to stay in Bali for a relaxing vacation?"
    },
    {
        "id": "budget-europe",
        "title": "Europe on a Budget 🎒",
        "prompt": "How can I travel across Europe on a moderate budget? Give me practical tips and cheap scenic routes."
    },
    {
        "id": "paris-hidden",
        "title": "Romantic Paris Spots 🥐",
        "prompt": "What are romantic hidden gems and charming bistros in Paris away from massive tourist crowds?"
    },
    {
        "id": "packing-swiss",
        "title": "Swiss Alps Checklist 🏔️",
        "prompt": "What essentials should I pack for a trip to the Swiss Alps in winter vs summer?"
    }
]


SUPPORTED_MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b"
]


def call_groq_api(messages_payload, model="openai/gpt-oss-120b"):
    """
    Call Groq OpenAI-compatible Chat Completion endpoint with fallback support.
    """
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set in the environment.")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Sequence of candidate models to try
    models_to_try = [model] + [m for m in SUPPORTED_MODELS if m != model]

    last_error = None
    for candidate_model in models_to_try:
        body = {
            "model": candidate_model,
            "messages": messages_payload,
            "temperature": 0.7,
            "max_tokens": 1024,
            "top_p": 0.95,
            "stream": False
        }

        try:
            response = requests.post(GROQ_API_URL, headers=headers, json=body, timeout=30)
            if response.ok:
                data = response.json()
                reply = data["choices"][0]["message"]["content"]
                used_model = data.get("model", candidate_model)
                return reply, used_model
            else:
                logger.warning(f"Groq model {candidate_model} returned status {response.status_code}: {response.text}")
                last_error = f"Status {response.status_code}: {response.text}"
        except Exception as ex:
            logger.warning(f"Error calling Groq with model {candidate_model}: {ex}")
            last_error = str(ex)

    raise RuntimeError(f"All Groq models failed. Last error: {last_error}")


@chatbot_bp.route('', methods=['POST'])
def chat():
    """
    POST /api/chat
    Payload:
      {
        "messages": [
          {"role": "user", "content": "Hello!"},
          {"role": "assistant", "content": "Hi there! Where would you like to travel?"},
          {"role": "user", "content": "I want to visit Japan"}
        ]
      }
      OR simple:
      { "message": "Suggest hotels in Paris" }
    """
    data = request.get_json() or {}

    raw_messages = data.get('messages')
    single_message = data.get('message')

    conversation = []

    if isinstance(raw_messages, list) and len(raw_messages) > 0:
        for msg in raw_messages[-12:]:  # Limit to last 12 turns for speed & context
            if isinstance(msg, dict) and msg.get('role') in ('user', 'assistant') and msg.get('content'):
                conversation.append({
                    "role": msg['role'],
                    "content": str(msg['content']).strip()
                })
    elif single_message and isinstance(single_message, str) and single_message.strip():
        conversation.append({"role": "user", "content": single_message.strip()})

    if not conversation or conversation[-1]["role"] != "user":
        return jsonify({
            "error": "A user message is required to start or continue the chat."
        }), 400

    # Build full prompt with system message
    groq_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + conversation

    target_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b").strip() or "openai/gpt-oss-120b"

    try:
        reply_content, used_model = call_groq_api(groq_messages, model=target_model)
        return jsonify({
            "success": True,
            "reply": reply_content,
            "model": used_model
        }), 200

    except ValueError as ve:
        logger.error(f"Configuration error: {ve}")
        return jsonify({
            "success": False,
            "error": "AI service configuration error. Please ensure GROQ_API_KEY is configured."
        }), 500

    except Exception as e:
        logger.error(f"Chatbot execution error: {e}", exc_info=True)
        # Graceful fallback so user is never left hanging
        return jsonify({
            "success": True,
            "reply": "I'm having a little trouble connecting to my live travel radar right now! 🌐 Please try asking your question again in just a moment, or browse our **Destinations** and **Hotels** tabs for immediate booking options.",
            "model": "fallback",
            "warning": str(e)
        }), 200


@chatbot_bp.route('/suggestions', methods=['GET'])
def get_suggestions():
    """
    GET /api/chat/suggestions
    Returns curated quick starter prompts for travelers.
    """
    return jsonify({
        "success": True,
        "suggestions": DEFAULT_SUGGESTIONS
    }), 200
