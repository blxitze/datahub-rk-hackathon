"""
AI App URL Configuration

Defines the URL patterns for AI-related endpoints:
- /api/ai/chat/ - Chatbot endpoint
- /api/ai/compare-summary/ - Comparison summary endpoint
"""

from django.urls import path
from .views import ChatView, CompareSummaryView


app_name = 'ai'

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('compare-summary/', CompareSummaryView.as_view(), name='compare-summary'),
]



