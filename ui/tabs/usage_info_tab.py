"""
Usage & Information Tab Component.

This file contains the UI components for displaying usage information and technology details.
"""

import gradio as gr

def create_usage_info_tab():
    """
    Creates the usage and information tab with technology details.
    
    Returns:
        None (no components need to be returned for event handlers)
    """
    with gr.TabItem("Usage & Information"):
        gr.Markdown("### Coding Agent Capabilities")
        gr.Markdown("""
        This coding agent is designed to help with a variety of programming and technology topics.
        You can ask questions, request code examples, debug issues, and learn about concepts in the following areas:
        """)
        
        with gr.Accordion("SQL", open=False):
            gr.Markdown("""
            - Query writing and optimization
            - Database design and schema creation
            - Data manipulation and analytics
            - SQL best practices
            
            **Resources:** [PostgreSQL Docs](https://www.postgresql.org/docs/), [MySQL Docs](https://dev.mysql.com/doc/), [SQLite Docs](https://www.sqlite.org/docs.html)
            """)
            
        with gr.Accordion("Python", open=False):
            gr.Markdown("""
            - General Python programming
            - Data structures and algorithms
            - Package and dependency management
            - Testing and debugging
            
            **Resources:** [Python Documentation](https://docs.python.org/3/), [Real Python](https://realpython.com/)
            """)
            
        with gr.Accordion("AWS", open=False):
            gr.Markdown("""
            - AWS service overview and selection
            - Infrastructure as Code (IaC)
            - Deployment strategies
            - AWS best practices
            
            **Resources:** [AWS Documentation](https://docs.aws.amazon.com/), [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/)
            """)
            
        with gr.Accordion("Linux", open=False):
            gr.Markdown("""
            - Command line usage
            - Shell scripting
            - System administration
            - Service management
            
            **Resources:** [Linux Documentation Project](https://tldp.org/), [Linux man pages](https://www.kernel.org/doc/man-pages/)
            """)
            
        with gr.Accordion("Docker", open=False):
            gr.Markdown("""
            - Container creation and management
            - Docker Compose
            - Dockerfile optimization
            - Container orchestration
            
            **Resources:** [Docker Documentation](https://docs.docker.com/), [Docker Hub](https://hub.docker.com/)
            """)
            
        with gr.Accordion("FastAPI", open=False):
            gr.Markdown("""
            - API development
            - Request/response handling
            - Authentication and middleware
            - API documentation
            
            **Resources:** [FastAPI Documentation](https://fastapi.tiangolo.com/), [FastAPI GitHub](https://github.com/tiangolo/fastapi)
            """)
            
        with gr.Accordion("Django", open=False):
            gr.Markdown("""
            - Web application development
            - Models and database interactions
            - Views and templates
            - Authentication and security
            
            **Resources:** [Django Documentation](https://docs.djangoproject.com/), [Django REST Framework](https://www.django-rest-framework.org/)
            """)
            
        with gr.Accordion("Langchain", open=False):
            gr.Markdown("""
            - Chain creation and management
            - LLM integration
            - Agent development
            - Memory and retrieval
            
            **Resources:** [Langchain Documentation](https://python.langchain.com/docs/get_started/introduction), [Langchain GitHub](https://github.com/langchain-ai/langchain)
            """)
            
        with gr.Accordion("Langgraph", open=False):
            gr.Markdown("""
            - Graph-based workflows
            - State management
            - Event-driven architectures
            - Agent orchestration
            
            **Resources:** [Langgraph Documentation](https://python.langchain.com/docs/langgraph), [Langgraph GitHub](https://github.com/langchain-ai/langgraph)
            """)
            
        with gr.Accordion("Langsmith", open=False):
            gr.Markdown("""
            - LLM application debugging
            - Performance monitoring
            - Tracing and observability
            - Testing and evaluation
            
            **Resources:** [Langsmith Documentation](https://docs.smith.langchain.com/), [Langsmith Dashboard](https://smith.langchain.com/)
            """)
            
        with gr.Accordion("Deep Learning", open=False):
            gr.Markdown("""
            - Neural network architecture
            - Model training and evaluation
            - Transfer learning
            - Common frameworks (TensorFlow, PyTorch)
            
            **Resources:** [TensorFlow Documentation](https://www.tensorflow.org/guide), [PyTorch Documentation](https://pytorch.org/docs/stable/index.html)
            """)
            
        with gr.Accordion("ML Algorithms", open=False):
            gr.Markdown("""
            - Classification and regression
            - Clustering and dimensionality reduction
            - Model evaluation and metrics
            - Feature engineering
            
            **Resources:** [Scikit-learn Documentation](https://scikit-learn.org/stable/user_guide.html), [ML Mastery](https://machinelearningmastery.com/)
            """)
    
    # This tab has no components that need event handlers
    return None
