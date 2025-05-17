import os
import gradio as gr
from typing import Annotated, Dict, List, Optional
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages
from langchain.chat_models import init_chat_model
from langchain.schema import HumanMessage, AIMessage
from dotenv import load_dotenv

# Import the UI components
from ui.interface import create_interface

# Load environment variables from .env file
load_dotenv()

# Define API keys - initialize with env vars if available
API_KEYS = {
    "GOOGLE_API_KEY": os.getenv("GOOGLE_API_KEY", ""),
    "ANTHROPIC_API_KEY": os.getenv("ANTHROPIC_API_KEY", ""),
    "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY", "")
}

# Available models
AVAILABLE_MODELS = {
    "gemini": ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro", "gemini-pro-vision"],
    "claude": ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
    "openai": ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"]
}

# StateGraph definition for the chatbot
class State(TypedDict):
    messages: Annotated[list, add_messages]
    model_name: str

# Initialize the LLM with the selected model
def get_llm(model_name: str):
    provider, model = model_name.split(":", 1)
    
    if provider == "google_genai":
        os.environ["GOOGLE_API_KEY"] = API_KEYS["GOOGLE_API_KEY"]
    elif provider == "anthropic":
        os.environ["ANTHROPIC_API_KEY"] = API_KEYS["ANTHROPIC_API_KEY"]
    elif provider == "openai":
        os.environ["OPENAI_API_KEY"] = API_KEYS["OPENAI_API_KEY"]

    return init_chat_model(model_name)

# Create a chatbot node that processes messages
def chatbot(state: State):
    llm = get_llm(state["model_name"])
    messages = state["messages"]
    
    # Convert messages to the format expected by the LLM
    response = llm.invoke(messages)
    return {"messages": [response]}

# Build the graph
def build_graph(model_name):
    # Create a new graph builder
    graph_builder = StateGraph(State)
    
    # Add the chatbot node
    graph_builder.add_node("chatbot", chatbot)
    
    # Add an entry point
    graph_builder.add_edge(START, "chatbot")
    
    # Compile the graph without explicit end node
    # The graph will automatically end after the last node
    return graph_builder.compile()

# Main function to run the chatbot with the given input and model
def run_chatbot(user_input, chat_history, model_name):
    # Skip empty inputs
    if not user_input.strip():
        return "", chat_history
    
    # Format the chat history for the LLM
    messages = []
    for message in chat_history:
        if message["role"] == "user":
            messages.append(HumanMessage(content=message["content"]))
        elif message["role"] == "assistant":
            messages.append(AIMessage(content=message["content"]))
    
    # Add the current user input
    messages.append(HumanMessage(content=user_input))
    
    # Initialize the graph with the selected model
    graph = build_graph(model_name)
    
    # Run the graph with the initial state
    try:
        result = graph.invoke({
            "messages": messages,
            "model_name": model_name
        })
        
        # Extract the assistant's response
        assistant_response = result["messages"][-1].content
        
        # Update chat history with proper format for 'messages' type chatbot
        chat_history.append({"role": "user", "content": user_input})
        chat_history.append({"role": "assistant", "content": assistant_response})
    except Exception as e:
        error_msg = str(e)
        chat_history.append({"role": "user", "content": user_input})
        chat_history.append({"role": "assistant", "content": f"Error: {error_msg}\n\nTry checking your API keys or selecting a different model."})
    
    return "", chat_history

# Save API keys to .env file
def save_api_keys(google_key, anthropic_key, openai_key):
    # Update the global API keys
    API_KEYS["GOOGLE_API_KEY"] = google_key
    API_KEYS["ANTHROPIC_API_KEY"] = anthropic_key
    API_KEYS["OPENAI_API_KEY"] = openai_key
    
    # Write to .env file
    with open(".env", "w") as f:
        f.write(f"GOOGLE_API_KEY={google_key}\n")
        f.write(f"ANTHROPIC_API_KEY={anthropic_key}\n")
        f.write(f"OPENAI_API_KEY={openai_key}\n")
    
    # Also set environment variables for the current session
    os.environ["GOOGLE_API_KEY"] = google_key
    os.environ["ANTHROPIC_API_KEY"] = anthropic_key
    os.environ["OPENAI_API_KEY"] = openai_key
    
    return "API keys saved successfully!"

# Add main entry point for application launch
if __name__ == "__main__":
    # Create the Gradio interface using the imported function from ui.interface
    app = create_interface(
        run_chatbot=run_chatbot,
        save_api_keys=save_api_keys,
        api_keys=API_KEYS,
        available_models=AVAILABLE_MODELS
    )
    # Launch the app
    app.launch(server_name="127.0.0.1", share=True,pwa=True)