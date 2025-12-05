"""
AI App Tests

Unit tests for the AI endpoints including chatbot and comparison summary.
These tests mock the OpenAI API to avoid actual API calls during testing.
"""

import os
from unittest.mock import patch, MagicMock
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from universities.models import University, Program


class ChatViewTests(APITestCase):
    """Tests for the /api/ai/chat/ endpoint."""
    
    def setUp(self):
        """Set up test data."""
        self.url = reverse('ai:chat')
        self.valid_message = {"message": "What universities are in Almaty?"}
    
    @patch('ai.services.llm.get_openai_client')
    def test_chat_success(self, mock_get_client):
        """Test successful chat response."""
        # Mock the OpenAI client
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "There are several universities in Almaty..."
        mock_client.chat.completions.create.return_value = mock_response
        mock_get_client.return_value = mock_client
        
        response = self.client.post(self.url, self.valid_message, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('response', response.data)
        self.assertEqual(response.data['response'], "There are several universities in Almaty...")
    
    def test_chat_empty_message(self):
        """Test chat with empty message returns error."""
        response = self.client.post(self.url, {"message": ""}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    def test_chat_whitespace_message(self):
        """Test chat with whitespace-only message returns error."""
        response = self.client.post(self.url, {"message": "   "}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    def test_chat_missing_message(self):
        """Test chat without message field returns error."""
        response = self.client.post(self.url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    @patch('ai.services.llm.get_openai_client')
    def test_chat_with_conversation_history(self, mock_get_client):
        """Test chat with conversation history."""
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Based on our previous discussion..."
        mock_client.chat.completions.create.return_value = mock_response
        mock_get_client.return_value = mock_client
        
        data = {
            "message": "Tell me more about tuition",
            "conversation_history": [
                {"role": "user", "content": "What universities are in Almaty?"},
                {"role": "assistant", "content": "There are several universities..."}
            ]
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
    
    @patch('ai.services.llm.get_openai_client')
    def test_chat_api_key_not_set(self, mock_get_client):
        """Test chat when API key is not configured."""
        mock_get_client.side_effect = ValueError("OPENAI_API_KEY environment variable is not set")
        
        response = self.client.post(self.url, self.valid_message, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertFalse(response.data['success'])


class CompareSummaryViewTests(APITestCase):
    """Tests for the /api/ai/compare-summary/ endpoint."""
    
    def setUp(self):
        """Set up test data."""
        self.url = reverse('ai:compare-summary')
        
        # Create test programs
        self.program1 = Program.objects.create(title="Computer Science", code="CS101")
        self.program2 = Program.objects.create(title="Data Science", code="DS101")
        
        # Create test universities
        self.university1 = University.objects.create(
            name="Test University 1",
            city="Almaty",
            description="A test university",
            tuition=1000000,
            rating=4.5,
            study_form="full-time",
            has_dormitory=True
        )
        self.university1.programs.add(self.program1)
        
        self.university2 = University.objects.create(
            name="Test University 2",
            city="Astana",
            description="Another test university",
            tuition=1500000,
            rating=4.2,
            study_form="both",
            has_dormitory=False
        )
        self.university2.programs.add(self.program2)
        
        self.university3 = University.objects.create(
            name="Test University 3",
            city="Almaty",
            description="Third test university",
            tuition=0,
            rating=4.8,
            study_form="full-time",
            has_dormitory=True
        )
        self.university3.programs.add(self.program1, self.program2)
    
    @patch('ai.services.llm.get_openai_client')
    def test_compare_summary_success(self, mock_get_client):
        """Test successful comparison summary generation."""
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "## Comparison Summary\n\nHere is the analysis..."
        mock_client.chat.completions.create.return_value = mock_response
        mock_get_client.return_value = mock_client
        
        data = {"university_ids": [self.university1.id, self.university2.id]}
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('summary', response.data)
        self.assertEqual(response.data['universities_compared'], 2)
    
    @patch('ai.services.llm.get_openai_client')
    def test_compare_summary_three_universities(self, mock_get_client):
        """Test comparison with three universities."""
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "## Comparison of 3 Universities..."
        mock_client.chat.completions.create.return_value = mock_response
        mock_get_client.return_value = mock_client
        
        data = {"university_ids": [
            self.university1.id, 
            self.university2.id, 
            self.university3.id
        ]}
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['universities_compared'], 3)
    
    def test_compare_summary_single_university(self):
        """Test comparison with only one university returns error."""
        data = {"university_ids": [self.university1.id]}
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    def test_compare_summary_empty_list(self):
        """Test comparison with empty list returns error."""
        data = {"university_ids": []}
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    def test_compare_summary_missing_field(self):
        """Test comparison without university_ids field returns error."""
        response = self.client.post(self.url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    def test_compare_summary_invalid_ids(self):
        """Test comparison with non-existent university IDs returns error."""
        data = {"university_ids": [9999, 9998]}
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(response.data['success'])
    
    def test_compare_summary_duplicate_ids(self):
        """Test comparison handles duplicate IDs correctly."""
        data = {"university_ids": [self.university1.id, self.university1.id]}
        response = self.client.post(self.url, data, format='json')
        
        # Should fail because after deduplication, only 1 university remains
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    @patch('ai.services.llm.get_openai_client')
    def test_compare_summary_api_key_not_set(self, mock_get_client):
        """Test comparison when API key is not configured."""
        mock_get_client.side_effect = ValueError("OPENAI_API_KEY environment variable is not set")
        
        data = {"university_ids": [self.university1.id, self.university2.id]}
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertFalse(response.data['success'])


class LLMServiceTests(TestCase):
    """Tests for the LLM service functions."""
    
    @patch.dict(os.environ, {'OPENAI_API_KEY': 'test-key'})
    @patch('ai.services.llm.OpenAI')
    def test_chat_with_model_success(self, mock_openai_class):
        """Test chat_with_model function success."""
        from ai.services.llm import chat_with_model
        
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Test response"
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai_class.return_value = mock_client
        
        result = chat_with_model("Test message")
        
        self.assertEqual(result, "Test response")
        mock_client.chat.completions.create.assert_called_once()
    
    @patch.dict(os.environ, {'OPENAI_API_KEY': 'test-key'})
    @patch('ai.services.llm.OpenAI')
    def test_summarize_comparison_success(self, mock_openai_class):
        """Test summarize_comparison function success."""
        from ai.services.llm import summarize_comparison
        
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "## Comparison Summary"
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai_class.return_value = mock_client
        
        universities_data = [
            {
                "name": "University A",
                "city": "Almaty",
                "tuition": "1000000",
                "rating": "4.5",
                "programs": [{"title": "CS"}],
                "has_dormitory": True,
                "study_form": "full-time",
                "description": "Test university"
            },
            {
                "name": "University B",
                "city": "Astana",
                "tuition": "0",
                "rating": "4.8",
                "programs": [],
                "has_dormitory": False,
                "study_form": "both",
                "description": "Another test"
            }
        ]
        
        result = summarize_comparison(universities_data)
        
        self.assertEqual(result, "## Comparison Summary")
        mock_client.chat.completions.create.assert_called_once()
    
    @patch.dict(os.environ, {}, clear=True)
    def test_get_openai_client_no_api_key(self):
        """Test get_openai_client raises error when API key not set."""
        # Need to remove the key if it exists
        if 'OPENAI_API_KEY' in os.environ:
            del os.environ['OPENAI_API_KEY']
        
        from ai.services.llm import get_openai_client
        
        with self.assertRaises(ValueError) as context:
            get_openai_client()
        
        self.assertIn("OPENAI_API_KEY", str(context.exception))
