"""
Help Tab Component.

This file contains the UI components for help and instructions.
"""

import gradio as gr

def create_help_tab():
    """
    Creates the help tab with usage instructions.
    
    Returns:
        None (no components need to be returned for event handlers)
    """
    with gr.TabItem("Help"):
        gr.Markdown("### How to Use the Coding Agent")
        gr.Markdown("""
        #### Getting Started
        1. Set your API keys in the "API Settings" tab
        2. Select your preferred model in the "Model Settings" tab
        3. Go to the "Coding Agent" tab and start chatting!
        
        #### Using the Chat
        - Type your coding question and press Enter
        - Start a new chat with the "New Chat" button
        - Access previous chats from the "Histories" tab
        
        #### Tips for Better Results
        - Be specific with your questions
        - Provide context about your project when relevant
        - Mention language/framework when asking for code examples
        - For complex topics, break down your questions into smaller parts
        """)
        
    # This tab has no components that need event handlers
    return None
