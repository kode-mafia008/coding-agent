"""
Model Settings Tab Component.

This file contains the UI components for model selection.
"""

import gradio as gr
from typing import Dict, Any, List

def create_model_settings_tab(available_models: Dict[str, List[str]]) -> Dict[str, Any]:
    """
    Creates the model settings tab.
    
    Args:
        available_models: Dictionary mapping provider names to lists of available models
        
    Returns:
        Dictionary containing the tab components
    """
    with gr.TabItem("Model Settings"):
        gr.Markdown("### Select AI Model")
        gr.Markdown("Choose which model you'd like to use for your coding agent.")
        
        with gr.Row():
            with gr.Column():
                provider = gr.Dropdown(
                    choices=list(available_models.keys()),
                    label="Model Provider",
                    value="gemini"
                )
                model = gr.Dropdown(
                    choices=available_models["gemini"],
                    label="Model",
                    value="gemini-2.0-flash"
                )
                apply_model_btn = gr.Button("Apply Model Selection", variant="primary")
            
            with gr.Column():
                gr.Markdown("### Model Information")
                provider_info = gr.Markdown("""
                #### Google Gemini
                Gemini is Google's family of multimodal AI models, capable of understanding text, code, audio, images, and video.
                
                Current selection: **gemini-2.0-flash**
                
                Learn more: [Google AI Gemini](https://ai.google.dev/models/gemini)
                """)
    
    # Return components that will be needed for event handlers
    return {
        "provider": provider,
        "model": model,
        "apply_model_btn": apply_model_btn,
        "provider_info": provider_info
    }
