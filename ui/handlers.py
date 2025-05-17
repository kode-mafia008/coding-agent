"""
Event handlers for the Coding Agent UI.

This file contains all the event handler functions and registrations.
"""

import gradio as gr
from typing import Dict, List, Any

# Import the chat history management module
from .chat_history import save_chat_history, get_chat_histories, load_chat_history, delete_chat_history

def register_handlers(
    coding_tab: Dict[str, Any],
    histories_tab: Dict[str, Any],
    model_settings: Dict[str, Any],
    api_settings: Dict[str, Any],
    available_models: Dict[str, List[str]],
    run_chatbot=None,
    save_api_keys=None,
    shared_state=None
):
    """
    Register all event handlers for the UI components.
    
    Args:
        coding_tab: Dictionary of coding tab components
        histories_tab: Dictionary of histories tab components
        model_settings: Dictionary of model settings components
        api_settings: Dictionary of API settings components
        available_models: Dictionary mapping provider names to lists of available models
    """
    # Extract components from dictionaries for convenience
    chatbot = coding_tab["chatbot"]
    msg = coding_tab["msg"]
    new_chat_btn = coding_tab["new_chat_btn"]
    current_model = coding_tab["current_model"]
    
    chat_history_dropdown = histories_tab["chat_history_dropdown"]
    load_history_btn = histories_tab["load_history_btn"]
    delete_history_btn = histories_tab["delete_history_btn"]
    history_display = histories_tab["history_display"]
    
    provider = model_settings["provider"]
    model = model_settings["model"]
    apply_model_btn = model_settings["apply_model_btn"]
    provider_info = model_settings["provider_info"]
    
    google_key = api_settings["google_key"]
    anthropic_key = api_settings["anthropic_key"]
    openai_key = api_settings["openai_key"]
    save_btn = api_settings["save_btn"]
    api_result = api_settings["api_result"]
    
    # Update model choices when provider changes
    def update_model_choices(provider_name):
        return gr.Dropdown(choices=available_models[provider_name], value=available_models[provider_name][0])
    
    provider.change(update_model_choices, inputs=provider, outputs=model)
    
    # Function to get full model name (provider:model)
    def get_full_model_name(provider_name, model_name):
        if provider_name == "gemini":
            return f"google_genai:{model_name}"
        else:
            return f"{provider_name}:{model_name}"
    
    # Send message on Enter - use provided function or fall back to placeholder
    chat_fn = run_chatbot if run_chatbot else lambda user_input, chat_history, model_name: placeholder_run_chatbot(user_input, chat_history, model_name)
    
    msg.submit(
        fn=lambda user_input, chat_history, provider_name, model_name: chat_fn(
            user_input, 
            chat_history, 
            get_full_model_name(provider_name, model_name)
        ),
        inputs=[msg, chatbot, provider, model],
        outputs=[msg, chatbot]
    )
    
    # Function to generate the model display text consistently
    def get_model_display_text(provider_name, model_name):
        return f"Current Model: {model_name}"
    
    # Update the current model display when applying a model selection
    def update_current_model(provider_name, model_name):
        model_text = get_model_display_text(provider_name, model_name)
        print(f"Updated model to: {provider_name}:{model_name}")
        return model_text
    
    # This function updates both the model dropdown and the main tab's model display
    def update_model_everywhere(provider_name, model_name):
        model_text = get_model_display_text(provider_name, model_name)
        print(f"Syncing model {provider_name}:{model_name} to all tabs")
        # Return the same model text for all model displays that need updating
        return model_text
    
    # Apply button directly updates the main Coding Agent tab's model display
    apply_model_btn.click(
        fn=update_model_everywhere,
        inputs=[provider, model],
        # Directly update the current_model display in the Coding Agent tab
        outputs=current_model
    )
    
    # Keep track of the currently selected model globally
    # This is necessary because the model selection happens in a different tab
    # than where it's displayed in the Coding Agent tab
    global_model_state = {
        "provider": provider.value,
        "model": model.value
    }
    
    # Event handler that fires when a new model provider is selected
    def on_provider_change(provider_name):
        global_model_state["provider"] = provider_name
        return gr.update(choices=available_models[provider_name], value=available_models[provider_name][0])
    
    # Event handler that fires when a specific model is selected
    def on_model_change(model_name):
        global_model_state["model"] = model_name
        return None  # No UI updates
    
    # Register additional change events to track model selection
    provider.change(fn=on_provider_change, inputs=provider, outputs=model)
    model.change(fn=on_model_change, inputs=model, outputs=None)
    
    # Save API keys function - use provided function or fall back to placeholder
    api_fn = save_api_keys if save_api_keys else placeholder_save_api_keys
    
    save_btn.click(
        fn=api_fn,
        inputs=[google_key, anthropic_key, openai_key],
        outputs=api_result
    )
    
    # New chat functionality with history saving
    def create_new_chat(chat_history, provider_name, model_name):
        saved_id = None
        
        # Save the current chat if it's not empty
        if chat_history:
            full_model_name = get_full_model_name(provider_name, model_name)
            saved_id = save_chat_history(chat_history, full_model_name)
            print(f"Saved chat history with ID: {saved_id}")
        
        # Update the histories dropdown with fresh data
        histories = get_chat_histories()
        
        # Make sure Current Session is always first in the list
        history_choices = ["Current Session"]
        if histories:
            history_titles = [title for _, title in histories]
            history_choices.extend(history_titles)
            print(f"Available histories: {history_choices}")
        
        # Return empty chat, current model name, and updated dropdown choices
        # Always set value to "Current Session" for a new chat
        return [], f"Current Model: {model_name}", gr.update(choices=history_choices, value="Current Session")
    
    new_chat_btn.click(
        fn=create_new_chat,
        inputs=[chatbot, provider, model],
        outputs=[chatbot, current_model, chat_history_dropdown]
    )
    
    # Load selected chat history
    def load_history(selected_history):
        # Skip if "Current Session" is selected
        if selected_history == "Current Session":
            return gr.update(), gr.update(value="Please select a saved chat history."), gr.update()
        
        # Get all histories
        histories = get_chat_histories()
        
        # Find the selected history ID
        selected_id = None
        for hist_id, title in histories:
            if title == selected_history:
                selected_id = hist_id
                break
        
        if not selected_id:
            return gr.update(), gr.update(value="History not found."), gr.update()
        
        # Load the chat history
        chat_messages, model_name = load_chat_history(selected_id)
        
        # Check if we got back a valid chat history
        if not chat_messages:
            return gr.update(), gr.update(value="Failed to load chat history."), gr.update()
        
        # If a model was saved with this history, display it
        model_display = f"Current Model: {model_name}" if model_name else current_model.value
        
        return chat_messages, gr.update(value=f"Successfully loaded {len(chat_messages)} messages."), model_display
    
    load_history_btn.click(
        fn=load_history,
        inputs=[chat_history_dropdown],
        outputs=[chatbot, api_result, current_model]
    )
    
    # Delete selected chat history
    def delete_history(selected_history):
        # Skip if "Current Session" is selected
        if selected_history == "Current Session":
            return gr.update(), gr.update(value="Cannot delete current session.")
            
        # Get all histories
        histories = get_chat_histories()
        
        # Find the selected history ID
        selected_id = None
        for hist_id, title in histories:
            if title == selected_history:
                selected_id = hist_id
                break
        
        if not selected_id:
            return gr.update(), gr.update(value="History not found.")
        
        # Delete the chat history
        success = delete_chat_history(selected_id)
        print(f"Deleted history {selected_id}: {success}")
        
        # Update the dropdown list
        histories = get_chat_histories()
        
        # Make sure Current Session is always first in the list
        history_choices = ["Current Session"]
        if histories:
            history_titles = [title for _, title in histories]
            history_choices.extend(history_titles)
        
        status_msg = "History deleted successfully." if success else "Failed to delete history."
        print(f"Available histories after delete: {history_choices}")
        
        return gr.update(choices=history_choices, value="Current Session"), \
               gr.update(value=status_msg)
    
    delete_history_btn.click(
        fn=delete_history,
        inputs=[chat_history_dropdown],
        outputs=[chat_history_dropdown, api_result]
    )
    
    # Function to update the model information when provider changes
    def update_provider_info(provider_name):
        provider_info_text = {
            "gemini": """
            #### Google Gemini
            Gemini is Google's family of multimodal AI models, capable of understanding text, code, audio, images, and video.
            
            Learn more: [Google AI Gemini](https://ai.google.dev/models/gemini)
            """,
            "claude": """
            #### Anthropic Claude
            Claude is a family of AI assistants created by Anthropic to be helpful, harmless, and honest.
            
            Learn more: [Anthropic Claude](https://www.anthropic.com/claude)
            """,
            "openai": """
            #### OpenAI GPT
            GPT (Generative Pre-trained Transformer) models are a series of large language models developed by OpenAI.
            
            Learn more: [OpenAI](https://platform.openai.com/docs/models)
            """
        }
        return provider_info_text.get(provider_name, "Select a provider to see more information.")
    
    provider.change(
        fn=update_provider_info,
        inputs=[provider],
        outputs=[provider_info]
    )

# Placeholder functions only used if real implementations aren't provided
def placeholder_run_chatbot(user_input, chat_history, model_name):
    """Placeholder for the actual run_chatbot function from the main application."""
    # This would be imported from the main application
    # For now, just return a simple response
    if not user_input.strip():
        return "", chat_history
    
    try:
        # Simulate a response for development
        chat_history.append({"role": "user", "content": user_input})
        chat_history.append({"role": "assistant", "content": f"Placeholder response to: {user_input}"})
    except Exception as e:
        chat_history.append({"role": "user", "content": user_input})
        chat_history.append({"role": "assistant", "content": f"Error: {str(e)}"})
    
    return "", chat_history

def placeholder_save_api_keys(google_key, anthropic_key, openai_key):
    """Placeholder for the actual save_api_keys function from the main application."""
    # This would be imported from the main application
    return "API keys saved successfully (placeholder implementation)"
