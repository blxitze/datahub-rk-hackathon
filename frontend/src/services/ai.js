/**
 * AI API Service
 * 
 * Provides functions for interacting with the AI backend endpoints:
 * - sendChatMessage: Send a message to the AI chatbot
 * - getCompareSummary: Get an AI-generated comparison summary
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const aiApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Send a message to the AI chatbot
 * 
 * @param {string} message - The user's message/question
 * @param {Array} conversationHistory - Optional array of previous messages for context
 * @returns {Promise<{response: string, success: boolean}>} - AI response
 */
export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const response = await aiApi.post('/ai/chat/', {
      message,
      conversation_history: conversationHistory,
    })
    return response.data
  } catch (error) {
    console.error('Chat API error:', error)
    throw error.response?.data || { success: false, error: 'Failed to send message' }
  }
}

/**
 * Get an AI-generated comparison summary for universities
 * 
 * @param {Array<number>} universityIds - Array of university IDs to compare
 * @returns {Promise<{summary: string, success: boolean, universities_compared: number}>} - Comparison summary
 */
export const getCompareSummary = async (universityIds) => {
  try {
    const response = await aiApi.post('/ai/compare-summary/', {
      university_ids: universityIds,
    })
    return response.data
  } catch (error) {
    console.error('Compare summary API error:', error)
    throw error.response?.data || { success: false, error: 'Failed to generate summary' }
  }
}

export default aiApi
