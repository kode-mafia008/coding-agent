"""
Main Gradio interface for the Coding Agent application.
"""

import gradio as gr
from typing import Dict, Any

from .tabs import (
    create_coding_agent_tab,
    create_histories_tab,
    create_model_settings_tab,
    create_api_settings_tab,
    create_help_tab,
    create_usage_info_tab
)
from .handlers import register_handlers

def create_interface(run_chatbot, save_api_keys, available_models: Dict[str, list], api_keys: Dict[str, str]) -> gr.Blocks:
    """
    Creates the main Gradio interface with all tabs.
    
    Args:
        run_chatbot: Function to run the chatbot with user input
        save_api_keys: Function to save API keys
        available_models: Dictionary mapping provider names to lists of available models
        api_keys: Dictionary of API keys for different providers
        
    Returns:
        gr.Blocks: The complete Gradio interface
    """
    with gr.Blocks() as app:
        gr.Markdown("# Coding Agent Assistant")
        
        # Create tabs for different sections
        with gr.Tabs() as tabs:
            # Create each tab with its components
            coding_tab_components = create_coding_agent_tab()
            histories_tab_components = create_histories_tab()
            model_settings_components = create_model_settings_tab(available_models)
            api_settings_components = create_api_settings_tab(api_keys)
            create_help_tab()
            create_usage_info_tab()
        
        # Create a shared state dictionary to pass between components
        shared_state = {
            "current_model_display": coding_tab_components["current_model"],
        }
        
        # Register all event handlers
        register_handlers(
            coding_tab_components,
            histories_tab_components,
            model_settings_components,
            api_settings_components,
            available_models,
            run_chatbot=run_chatbot,
            save_api_keys=save_api_keys,
            shared_state=shared_state
        )
    
    return app
