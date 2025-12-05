"""
AI App Serializers

Serializers for validating and transforming AI-related request/response data.
"""

from rest_framework import serializers


class ChatMessageSerializer(serializers.Serializer):
    """
    Serializer for chat message requests.
    
    Validates incoming chat messages from the frontend chatbot widget.
    """
    message = serializers.CharField(
        max_length=2000,
        required=True,
        help_text="User's question or message to the AI assistant"
    )
    conversation_history = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list,
        help_text="Optional conversation history for context"
    )

    def validate_message(self, value):
        """Validate that the message is not empty or just whitespace."""
        if not value.strip():
            raise serializers.ValidationError("Message cannot be empty")
        return value.strip()


class ChatResponseSerializer(serializers.Serializer):
    """
    Serializer for chat response data.
    
    Formats the AI response for the frontend.
    """
    response = serializers.CharField(help_text="AI-generated response")
    success = serializers.BooleanField(default=True)


class CompareSummaryRequestSerializer(serializers.Serializer):
    """
    Serializer for comparison summary requests.
    
    Validates the list of university IDs to compare.
    """
    university_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        min_length=2,
        max_length=5,
        required=True,
        help_text="List of university IDs to compare (2-5 universities)"
    )

    def validate_university_ids(self, value):
        """Ensure we have a valid list of unique university IDs."""
        unique_ids = list(set(value))
        if len(unique_ids) < 2:
            raise serializers.ValidationError("At least 2 different universities are required for comparison")
        return unique_ids


class CompareSummaryResponseSerializer(serializers.Serializer):
    """
    Serializer for comparison summary response.
    
    Formats the AI-generated comparison summary for the frontend.
    """
    summary = serializers.CharField(help_text="AI-generated comparison summary in markdown format")
    success = serializers.BooleanField(default=True)
    universities_compared = serializers.IntegerField(help_text="Number of universities compared")
