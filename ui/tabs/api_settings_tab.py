"""
API Settings Tab Component.

This file contains the UI components for API key management.
"""

import gradio as gr
from typing import Dict, Any

def create_api_settings_tab(api_keys: Dict[str, str]) -> Dict[str, Any]:
    """
    Creates the API settings tab.
    
    Args:
        api_keys: Dictionary of API keys for different providers
        
    Returns:
        Dictionary containing the tab components
    """
    with gr.TabItem("API Settings"):
        gr.Markdown("### API Keys Configuration")
        gr.Markdown("Set your API keys for the different LLM providers. These will be saved in your .env file.")
        
        with gr.Group():
            google_key = gr.Textbox(
                label="Google API Key", 
                value=api_keys["GOOGLE_API_KEY"],
                type="password",
                container=True,
                lines=1
            )
            anthropic_key = gr.Textbox(
                label="Anthropic API Key", 
                value=api_keys["ANTHROPIC_API_KEY"],
                type="password",
                container=True,
                lines=1
            )
            openai_key = gr.Textbox(
                label="OpenAI API Key", 
                value=api_keys["OPENAI_API_KEY"],
                type="password",
                container=True,
                lines=1
            )
            save_btn = gr.Button("Save API Keys", variant="primary")
            api_result = gr.Markdown("")
    
    # Return components that will be needed for event handlers
    return {
        "google_key": google_key,
        "anthropic_key": anthropic_key,
        "openai_key": openai_key,
        "save_btn": save_btn,
        "api_result": api_result
    }
