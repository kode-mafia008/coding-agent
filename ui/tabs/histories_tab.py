"""
Chat Histories Tab Component.

This file contains the UI components for viewing and managing chat histories.
"""

import gradio as gr
from typing import Dict, Any

# Import the chat history management module
from ..chat_history import get_chat_histories

def create_histories_tab() -> Dict[str, Any]:
    """
    Creates the chat histories management tab.
    
    Returns:
        Dictionary containing the tab components
    """
    with gr.TabItem("Histories"):
        gr.Markdown("### Chat Histories")
        
        # Get existing histories
        histories = get_chat_histories()
        history_choices = ["Current Session"] + [title for _, title in histories] if histories else ["Current Session"]
        
        with gr.Row():
            chat_history_dropdown = gr.Dropdown(
                choices=history_choices, 
                label="Select Chat History",
                value="Current Session",
                elem_id="history_dropdown" # Add element ID for easier targeting
            )
            load_history_btn = gr.Button("Load Selected History")
            delete_history_btn = gr.Button("Delete Selected History", variant="stop")
        
        history_display = gr.Chatbot(height=500, type="messages")
        gr.Markdown("Select a history from the dropdown above to view and load it.")
    
    # Return components that will be needed for event handlers
    return {
        "chat_history_dropdown": chat_history_dropdown,
        "load_history_btn": load_history_btn,
        "delete_history_btn": delete_history_btn,
        "history_display": history_display
    }
