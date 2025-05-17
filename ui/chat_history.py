"""
Chat History Management.

This module manages the storage and retrieval of chat histories.
"""

import os
import json
from datetime import datetime
from typing import List, Dict, Any

import os

# Directory to store chat histories - using an absolute path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HISTORY_DIR = os.path.join(BASE_DIR, "chat_histories")

def ensure_history_dir():
    """Ensure the chat history directory exists."""
    if not os.path.exists(HISTORY_DIR):
        os.makedirs(HISTORY_DIR)

def generate_history_id():
    """Generate a unique ID for a new chat history."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"chat_{timestamp}"


def generate_chat_title(chat_history):
    """Generate a descriptive title for the chat history based on its content.
    
    Args:
        chat_history: List of message dictionaries
        
    Returns:
        str: A descriptive title for the chat history
    """
    # Start with a timestamp-based title
    timestamp = datetime.now().strftime("%A, %B %d, %Y - %H:%M")
    
    # Default title if we can't extract anything meaningful
    title = f"{timestamp} - Chat Session"
    
    # Try to extract topic from the first user message and assistant response
    if not chat_history or len(chat_history) < 2:
        return title
    
    try:
        # Get the first user message
        first_user_msg = None
        for msg in chat_history:
            if msg.get("role") == "user":
                first_user_msg = msg.get("content", "")
                break
        
        if not first_user_msg:
            return title
            
        # Extract a keyword or phrase from the user message
        # First try to find main keywords in the query
        topic = None
        
        # Try to find a topic in common programming/tech terms
        tech_terms = ["AWS", "S3", "Python", "JavaScript", "SQL", "Docker", "Kubernetes", 
                     "ML", "API", "Django", "React", "Angular", "Vue", "Node.js", "FastAPI",
                     "Flask", "Database", "Git", "DevOps", "Cloud"]
        
        for term in tech_terms:
            if term.lower() in first_user_msg.lower():
                topic = term
                break
        
        # If we haven't found a tech term, extract phrases like "how to", "create a", etc.
        if not topic:
            common_phrases = ["how to", "create a", "build a", "implement", "design", 
                            "develop", "code for", "example of", "tutorial"]
            
            for phrase in common_phrases:
                if phrase in first_user_msg.lower():
                    # Extract a few words after the phrase
                    start_idx = first_user_msg.lower().find(phrase) + len(phrase)
                    end_idx = min(start_idx + 30, len(first_user_msg))  # Get about 30 chars
                    snippet = first_user_msg[start_idx:end_idx].strip()
                    # Truncate at the first period or other sentence-ending punctuation
                    for punct in [".", "?", "!", "\n"]:
                        if punct in snippet:
                            snippet = snippet.split(punct)[0]
                    topic = f"{phrase} {snippet}"
                    break
        
        # If we still don't have a topic, just use the first 5-7 words
        if not topic:
            words = first_user_msg.split()
            topic = " ".join(words[:min(7, len(words))])
            if len(topic) > 40:  # If it's too long, truncate
                topic = topic[:37] + "..."
        
        # Generate the title with the topic
        title = f"{timestamp} - {topic}"
        
    except Exception as e:
        print(f"Error generating chat title: {e}")
        # Fall back to the default title
    
    return title

def save_chat_history(chat_history: List[Dict[str, Any]], model_name: str = None):
    """
    Save the current chat history.
    
    Args:
        chat_history: List of message dictionaries
        model_name: The model used for this chat
        
    Returns:
        str: The ID of the saved history
    """
    ensure_history_dir()
    
    # Skip if history is empty
    if not chat_history:
        return None
    
    history_id = generate_history_id()
    
    # Generate a descriptive title based on the chat content
    title = generate_chat_title(chat_history)
    
    # Create a history object with metadata
    history_obj = {
        "id": history_id,
        "timestamp": datetime.now().isoformat(),
        "model": model_name,
        "title": title,
        "messages": chat_history
    }
    
    # Save to file
    history_path = os.path.join(HISTORY_DIR, f"{history_id}.json")
    with open(history_path, "w") as f:
        json.dump(history_obj, f, indent=2)
    
    return history_id

def get_chat_histories():
    """
    Get a list of all saved chat histories.
    
    Returns:
        List of tuples (id, title)
    """
    ensure_history_dir()
    
    histories = []
    for filename in os.listdir(HISTORY_DIR):
        if filename.endswith(".json"):
            try:
                with open(os.path.join(HISTORY_DIR, filename), "r") as f:
                    history = json.load(f)
                    histories.append((history["id"], history.get("title", "Untitled Chat")))
            except Exception as e:
                print(f"Error loading history {filename}: {e}")
    
    # Sort by ID (which contains timestamp) in reverse order
    histories.sort(reverse=True)
    return histories

def load_chat_history(history_id):
    """
    Load a specific chat history.
    
    Args:
        history_id: ID of the history to load
        
    Returns:
        tuple: (chat_history, model_name)
    """
    try:
        history_path = os.path.join(HISTORY_DIR, f"{history_id}.json")
        print(f"Attempting to load history from: {history_path}")
        
        if not os.path.exists(history_path):
            print(f"History file not found: {history_path}")
            return [], None
            
        with open(history_path, "r") as f:
            history = json.load(f)
            messages = history.get("messages", [])
            model = history.get("model", None)
            
            # Ensure messages are in the correct format
            for msg in messages:
                if not isinstance(msg, dict) or "role" not in msg or "content" not in msg:
                    print(f"Invalid message format in history: {msg}")
                    # Try to fix the format if possible
                    if isinstance(msg, dict):
                        msg["role"] = msg.get("role", "assistant")
                        msg["content"] = msg.get("content", "")
            
            print(f"Successfully loaded history with {len(messages)} messages")
            return messages, model
    except json.JSONDecodeError as e:
        print(f"JSON error loading history {history_id}: {e}")
        return [], None
    except Exception as e:
        print(f"Error loading history {history_id}: {str(e)}")
        return [], None

def delete_chat_history(history_id):
    """
    Delete a specific chat history.
    
    Args:
        history_id: ID of the history to delete
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        history_path = os.path.join(HISTORY_DIR, f"{history_id}.json")
        if os.path.exists(history_path):
            os.remove(history_path)
            return True
    except Exception as e:
        print(f"Error deleting history {history_id}: {e}")
    
    return False
