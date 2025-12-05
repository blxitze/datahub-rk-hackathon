"""
AI App Views

API views for AI-powered features including chatbot and comparison summaries.
"""

import logging
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from universities.models import University
from universities.serializers import UniversityDetailSerializer
from .serializers import (
    ChatMessageSerializer,
    ChatResponseSerializer,
    CompareSummaryRequestSerializer,
    CompareSummaryResponseSerializer,
)
from .services import chat_with_model, summarize_comparison


logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class ChatView(APIView):
    """
    AI Chatbot endpoint for answering questions about universities.
    
    POST /api/ai/chat/
    
    Request body:
        {
            "message": "User's question",
            "conversation_history": [optional list of previous messages]
        }
    
    Response:
        {
            "response": "AI-generated answer",
            "success": true
        }
    """
    # Disable authentication to avoid CSRF issues for public API
    authentication_classes = []
    
    def post(self, request):
        """Process a chat message and return AI response."""
        serializer = ChatMessageSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            message = serializer.validated_data['message']
            conversation_history = serializer.validated_data.get('conversation_history', [])
            
            # Get AI response
            response_text = chat_with_model(message, conversation_history)
            
            response_serializer = ChatResponseSerializer(data={
                "response": response_text,
                "success": True
            })
            response_serializer.is_valid()
            
            return Response(response_serializer.data)
            
        except ValueError as e:
            # API key not configured
            logger.error(f"OpenAI API key error: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "AI service is not configured. Please contact support."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            logger.error(f"Chat error: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "Failed to get AI response. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class CompareSummaryView(APIView):
    """
    AI-powered comparison summary generator.
    
    POST /api/ai/compare-summary/
    
    Request body:
        {
            "university_ids": [1, 4, 7]
        }
    
    Response:
        {
            "summary": "Markdown-formatted comparison summary",
            "success": true,
            "universities_compared": 3
        }
    """
    # Disable authentication to avoid CSRF issues for public API
    authentication_classes = []
    
    def post(self, request):
        """Generate a comparison summary for the specified universities."""
        serializer = CompareSummaryRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "error": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            university_ids = serializer.validated_data['university_ids']
            
            # Fetch universities from database
            universities = University.objects.filter(id__in=university_ids).prefetch_related('programs')
            
            if not universities.exists():
                return Response(
                    {
                        "success": False,
                        "error": "No universities found with the provided IDs"
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Serialize university data for the LLM
            university_serializer = UniversityDetailSerializer(universities, many=True)
            universities_data = university_serializer.data
            
            # Generate comparison summary
            summary_text = summarize_comparison(universities_data)
            
            response_data = {
                "summary": summary_text,
                "success": True,
                "universities_compared": len(universities_data)
            }
            
            response_serializer = CompareSummaryResponseSerializer(data=response_data)
            response_serializer.is_valid()
            
            return Response(response_serializer.data)
            
        except ValueError as e:
            # API key not configured
            logger.error(f"OpenAI API key error: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "AI service is not configured. Please contact support."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            logger.error(f"Comparison summary error: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": "Failed to generate comparison summary. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


