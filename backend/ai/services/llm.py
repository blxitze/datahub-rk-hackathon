"""
LLM Service Module

This module provides functions for interacting with OpenAI's API
for the DataHub platform's AI features.

Functions:
    - chat_with_model: Process chat messages about universities
    - summarize_comparison: Generate comparison summaries for universities
"""

import os
import json
from typing import List, Dict, Any
from openai import OpenAI


# Initialize OpenAI client
# The API key is loaded from environment variable OPENAI_API_KEY
def get_openai_client() -> OpenAI:
    """
    Get an OpenAI client instance.
    
    Returns:
        OpenAI: Configured OpenAI client
        
    Raises:
        ValueError: If OPENAI_API_KEY is not set
    """
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=api_key)


# System prompt for the chatbot
CHATBOT_SYSTEM_PROMPT = """You are a helpful assistant for DataHub, a platform for exploring universities and academic programs in Kazakhstan.

Your role is to help users with questions about:
- Universities in Kazakhstan (public and private)
- Academic programs and specializations
- Tuition fees and scholarship opportunities
- Dormitory availability and student housing
- Admission requirements and deadlines
- University rankings and ratings
- Campus facilities and student life
- Location and city information

Guidelines:
1. Be helpful, accurate, and concise in your responses
2. If you don't have specific information about a university, provide general guidance
3. Always be encouraging about education opportunities
4. When discussing tuition, mention that costs may vary and suggest checking official sources
5. Respond in the same language as the user's question (Russian, Kazakh, or English)
6. Keep responses focused and under 500 words unless more detail is specifically requested

If asked about something unrelated to education or universities, politely redirect the conversation back to educational topics."""


COMPARISON_SYSTEM_PROMPT = """You are an expert education consultant helping students compare universities in Kazakhstan.

Analyze the provided university data and create a comprehensive comparison summary that includes:

1. **Overview**: Brief introduction to each university (2-3 sentences each)
2. **Key Strengths**: Highlight the main advantages of each institution using bullet points
3. **Areas for Consideration**: Mention potential drawbacks or considerations
4. **Comparison by Criteria**: Compare universities by these factors using bullet points for each university:
   - Tuition and affordability
   - Available programs
   - Dormitory and housing options
   - Rating and reputation
   - Location and accessibility
5. **Recommendation**: Provide a balanced recommendation based on the data

IMPORTANT FORMATTING RULES:
- DO NOT use markdown tables (no | characters for tables)
- Use bullet points (- or •) and numbered lists instead of tables
- Use **bold** for emphasis and headings
- Use ## for section headers
- Keep comparisons as structured bullet points under each criterion
- Keep the summary under 800 words
- Respond in the same language as detected from university names (Russian/Kazakh names = Russian response)

Example format for comparison:
## Сравнение по стоимости
- **Университет А**: 1 500 000 ₸/год — доступная цена
- **Университет Б**: 2 000 000 ₸/год — выше среднего
- **Университет В**: Бесплатно (грант) — лучший вариант по цене

Guidelines:
- Be objective and fair in your analysis
- Use the actual data provided, don't make up information
- Highlight value propositions for different student needs"""


def chat_with_model(message: str, conversation_history: List[Dict[str, str]] = None) -> str:
    """
    Process a chat message and return an AI-generated response.
    
    Args:
        message: The user's message/question
        conversation_history: Optional list of previous messages for context
        
    Returns:
        str: The AI-generated response
        
    Raises:
        Exception: If the API call fails
    """
    client = get_openai_client()
    
    # Build messages array
    messages = [{"role": "system", "content": CHATBOT_SYSTEM_PROMPT}]
    
    # Add conversation history if provided
    if conversation_history:
        for msg in conversation_history[-10:]:  # Keep last 10 messages for context
            messages.append(msg)
    
    # Add the current user message
    messages.append({"role": "user", "content": message})
    
    try:
        response = client.chat.completions.create(
            model=os.environ.get('OPENAI_MODEL', 'gpt-4o-mini'),
            messages=messages,
            max_tokens=1000,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Failed to get response from OpenAI: {str(e)}")


def summarize_comparison(universities_data: List[Dict[str, Any]]) -> str:
    """
    Generate a comparison summary for the provided universities.
    
    Args:
        universities_data: List of university data dictionaries containing:
            - name: University name
            - city: Location
            - tuition: Annual tuition fee
            - rating: University rating
            - programs: List of available programs
            - has_dormitory: Dormitory availability
            - study_form: Study format (full-time, part-time, both)
            - description: University description
            - founded_year: Year of founding
            - students_count: Number of students
            
    Returns:
        str: Markdown-formatted comparison summary
        
    Raises:
        Exception: If the API call fails
    """
    client = get_openai_client()
    
    # Format universities data for the prompt
    universities_text = []
    for i, uni in enumerate(universities_data, 1):
        programs_list = [p.get('title', p.get('name', 'Unknown')) for p in uni.get('programs', [])]
        programs_str = ', '.join(programs_list[:10])  # Limit to first 10 programs
        if len(programs_list) > 10:
            programs_str += f" (+{len(programs_list) - 10} more)"
        
        # Format tuition
        tuition = uni.get('tuition', 0)
        if float(tuition) == 0:
            tuition_str = "Free (state grant)"
        else:
            tuition_str = f"{int(float(tuition)):,} ₸/year".replace(',', ' ')
        
        # Study form
        study_form = uni.get('study_form', 'full-time')
        study_form_map = {
            'full-time': 'Full-time',
            'part-time': 'Part-time',
            'both': 'Full-time and Part-time'
        }
        study_form_str = study_form_map.get(study_form, study_form)
        
        uni_text = f"""
University {i}: {uni.get('name', 'Unknown')}
- City: {uni.get('city', 'Unknown')}
- Tuition: {tuition_str}
- Rating: {uni.get('rating', 'N/A')}/5.0
- Programs: {programs_str if programs_str else 'Not specified'}
- Dormitory: {'Available' if uni.get('has_dormitory') else 'Not available'}
- Study Format: {study_form_str}
- Founded: {uni.get('founded_year', 'Unknown')}
- Students: {uni.get('students_count', 'Unknown')}
- Description: {uni.get('description', 'No description available')[:300]}...
"""
        universities_text.append(uni_text)
    
    user_prompt = f"""Please analyze and compare the following universities:

{''.join(universities_text)}

Provide a comprehensive comparison summary with pros/cons and a final recommendation."""

    try:
        response = client.chat.completions.create(
            model=os.environ.get('OPENAI_MODEL', 'gpt-4o-mini'),
            messages=[
                {"role": "system", "content": COMPARISON_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1500,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Failed to generate comparison summary: {str(e)}")



