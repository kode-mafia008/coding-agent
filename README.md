# Multi-Model Chatbot with Gradio

This application provides a web-based interface for your LangGraph chatbot, allowing you to select from multiple AI models (Gemini, Claude, OpenAI) and configure API keys through a user-friendly interface.

## Features

- **Multiple Model Support**: Choose from various AI models by Google (Gemini), Anthropic (Claude), and OpenAI (GPT)
- **Local Web Interface**: Runs on your local machine with a modern web interface
- **API Key Management**: Set and save API keys directly through the interface
- **LangGraph Integration**: Uses your existing LangGraph-based chatbot

## Prerequisites

- Python 3.9 or higher
- API keys for the models you wish to use:
  - Google AI (Gemini)
  - Anthropic (Claude)
  - OpenAI (GPT)

## Installation

1. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Usage

1. Run the application:

```bash
python app.py
```

2. Open your browser and go to http://127.0.0.1:7860/

3. In the "API Keys" tab, enter your API keys for the models you want to use

4. Switch to the "Chat" tab to start chatting with your selected model

## Configuration

API keys are stored in the `.env` file in the project root. You can edit this file directly or use the API Keys tab in the application.

## How It Works

The application builds upon your existing LangGraph chatbot implementation, adding a web interface using Gradio. It dynamically creates a chatbot with the selected model and properly formats messages for the conversation flow.

## Customization

- Add additional models by updating the `AVAILABLE_MODELS` dictionary in `app.py`
- Modify the UI by editing the Gradio components in the `create_gradio_interface` function
