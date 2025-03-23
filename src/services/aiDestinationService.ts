import { Toolhouse } from '@toolhouseai/sdk';
import OpenAI from 'openai';
import { UserPreferences } from '../types';

const MODEL = 'llama-3.3-70b-versatile';

interface AIDestinationResult {
  destinations: {
    name: string;
    country: string;
    image: string;
    description: string;
    budget: string;
    bestTimeToVisit: string;
    highlights: string[];
  }[];
}

export async function getAIDestinationRecommendations(
  preferences: UserPreferences,
  userLocation: string = ''
): Promise<AIDestinationResult> {
  try {
    const toolhouse = new Toolhouse({
      apiKey: "th-xUDBrKuu9UyJ4-lQYw65r40fOzurwx3OLt6vBTKXSzA",
      metadata: {
        "id": "daniele",
        "timezone": "0"
      }
    });
    
    const client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.NEXT_PUBLIC_GROQCLOUD_API_KEY || '',
    });

    // Format the user preferences for the AI agent
    const travelType = preferences.travelType || 'international';
    const budget = preferences.budget || 'medium';
    const interests = preferences.interests.join(", ");

    const prompt = `I'm looking for travel destination recommendations with these preferences:
      - Budget: ${budget}
      - Location: ${userLocation}
      - Travel Type: ${travelType}
      - Interests: ${interests}
      - Duration: ${preferences.duration || '1 week'}
      
      Please provide 3-5 destination recommendations that match these preferences.`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
      "role": "user",
      "content": prompt,
    }];
    
    // Get the available tools
    const tools = await toolhouse.getTools() as OpenAI.Chat.Completions.ChatCompletionTool[];
    
    // Make the initial request
    const chatCompletion = await client.chat.completions.create({
      messages,
      model: MODEL,
      tools
    });
    
    // Run the tools to get information
    const openAiMessage = await toolhouse.runTools(chatCompletion) as OpenAI.Chat.Completions.ChatCompletionMessageParam[];
    
    // Combine messages
    const newMessages = [...messages, ...openAiMessage];
    
    // Get the final completion
    const chatCompleted = await client.chat.completions.create({
      messages: newMessages,
      model: MODEL,
      tools
    });
    
    // Extract and format the results
    const responseContent = chatCompleted.choices[0].message.content;
    
    // This is a placeholder - we would need to parse the actual response format
    // In a real implementation, you'd structure this based on how the AI returns data
    const parsedData: AIDestinationResult = {
      destinations: parseAIResponse(responseContent || '')
    };
    
    return parsedData;
  } catch (error) {
    console.error('Error fetching AI destination recommendations:', error);
    // Return empty results in case of error
    return { destinations: [] };
  }
}

// Helper function to parse the AI response
function parseAIResponse(response: string): any[] {
  // This is a placeholder implementation that would need to be customized 
  // based on the actual response format from your AI service
  try {
    // Try to parse as JSON if the response is in that format
    if (response.includes('{') && response.includes('}')) {
      // Find JSON content in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]).destinations || [];
      }
    }

    // Fallback: Simple text parsing for destinations in a predefined format
    const destinations = [];
    const sections = response.split(/Destination \d+:/g).filter(Boolean);
    
    for (const section of sections) {
      const nameMatch = section.match(/Name: ([^\n]+)/);
      const countryMatch = section.match(/Country: ([^\n]+)/);
      const imageMatch = section.match(/Image: ([^\n]+)/);
      const descriptionMatch = section.match(/Description: ([^]*?)(?=Budget:|Best Time|Why Visit|\Z)/s);
      const budgetMatch = section.match(/Budget: ([^\n]+)/);
      const timeMatch = section.match(/Best Time to Visit: ([^\n]+)/);
      const highlightsMatch = section.match(/Why Visit:([^]*?)(?=\n\n|\Z)/s);
      
      if (nameMatch) {
        const highlights = highlightsMatch ? 
          highlightsMatch[1].split(/[-•]/).filter(Boolean).map(h => h.trim()) : [];
        
        destinations.push({
          name: nameMatch[1].trim(),
          country: countryMatch ? countryMatch[1].trim() : '',
          image: imageMatch ? imageMatch[1].trim() : '',
          description: descriptionMatch ? descriptionMatch[1].trim() : '',
          budget: budgetMatch ? budgetMatch[1].trim() : '',
          bestTimeToVisit: timeMatch ? timeMatch[1].trim() : '',
          highlights: highlights
        });
      }
    }
    
    return destinations;
  } catch (e) {
    console.error('Error parsing AI response:', e);
    return [];
  }
}