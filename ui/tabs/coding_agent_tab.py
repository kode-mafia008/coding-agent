"""
Coding Agent Tab Component.

This file contains the UI components for the main chat interface.
"""

import gradio as gr
from typing import Dict, Tuple, Any

def create_coding_agent_tab() -> Dict[str, Any]:
    """
    Creates the main coding agent chat interface tab.
    
    Returns:
        Dictionary containing the tab components
    """
    with gr.TabItem("Coding Agent"):
        # Header section with controls
        with gr.Row(equal_height=True):
            with gr.Column(scale=1):
                # Left side - New Chat button with improved styling
                new_chat_btn = gr.Button("New Chat", variant="primary", size="lg")
            with gr.Column(scale=3):
                # Right side - current model display
                current_model = gr.Markdown("Current Model: gemini-2.0-flash")
        
        # Main chat interface
        with gr.Row():
            with gr.Column():
                # Chat interface
                chatbot = gr.Chatbot(height=600, type="messages")
                msg = gr.Textbox(
                    label="Message", 
                    placeholder="Ask me about coding, development, or technology...",
                    show_label=True
                )
    
    # Return components that will be needed for event handlers
    return {
        "chatbot": chatbot,
        "msg": msg,
        "new_chat_btn": new_chat_btn,
        "current_model": current_model
    }
