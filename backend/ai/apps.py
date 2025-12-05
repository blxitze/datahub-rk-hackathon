"""
AI App Configuration

This app provides AI-powered features including:
- Chatbot for answering questions about universities
- Comparison summary generation using LLM
"""

from django.apps import AppConfig


class AiConfig(AppConfig):
    """Configuration for the AI Django app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ai'
    verbose_name = 'AI Features'
