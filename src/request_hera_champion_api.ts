// Define interfaces for the data structure
interface Emotion {
  emotion: string;
  value: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PredefinedResponse {
  id: string;
  intent: string;
  response: string;
  score: number;
}

interface ContentModifier {
  feature: string;
  description: string;
}

interface Thresholds {
  predefined_response: number;
  generate_rephrase: number;
  generate_fallback: number;
}

interface Generator {
  model_name: string;
  max_tokens: number;
  temperature: number;
  preprompt_id: string;
}

interface Config {
  thresholds: Thresholds;
  generator: Generator;
}

export interface ConversationState {
  stage: number;
  step: number;
  history: Message[];
  emotions: Emotion[];
}

interface RequestData {
  client_request_id: string;
  dataframe_split: {
    columns: string[];
    data: Array<any[]>
  }
}

export interface HeraResponse {
  response: string;
  conversationState: ConversationState;
}

export const defaultConversationState: ConversationState = {
  stage: 1,
  step: 1,
  history: [],
  emotions: [
    { emotion: "anger", value: 0.25 },
    { emotion: "fear", value: 0.25 },
    { emotion: "joy", value: 0.25 },
    { emotion: "sadness", value: 0.25 }
  ]
};

export const defaultConfig: Config = {
  thresholds: {
    predefined_response: 0.8,
    generate_rephrase: 0.6,
    generate_fallback: 0.4
  },
  generator: {
    model_name: "gpt-4o-mini",
    max_tokens: 256,
    temperature: 0.7,
    preprompt_id: "cai-vsim-patient-emotional"
  }
};

export const generalContentModifiers: ContentModifier[] = [
  {
    feature: "Agent name",
    description: "Millie Larsen"
  },
  {
    feature: "Agent type",
    description: "Patient"
  },
  {
    feature: "Agent description",
    description: "I am a virtual assistant designed to help you with your medical needs."
  },
  {
    feature: "Food preferences",
    description: "I really love pizza and then I think icecream is cool, haha. Peanuts is a no go, as I am allergic to it."
  }
];

export const stageContentModifiers: ContentModifier[] = [
  {
    feature: "stage_description_subjective",
    description: "I am Millie Larsen. I am really tired and my leg hurts. I am at the hospital and I am not feeling well."
  },
  {
    feature: "Current state of mind",
    description: "At the moment I don't feel well and I am really tired."
  },
  {
    feature: "Current location",
    description: "I am at the hospital, just got here."
  },
  {
    feature: "Most recent received medical treatment",
    description: "I received some pain medication for my leg at 12:00, but it is still hurting."
  }
];

// Function to make Hera API request 
export async function requestHeraApi(
  userInput: string, 
  currentConversationState: ConversationState = defaultConversationState
): Promise<HeraResponse> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${process.env.REACT_APP_DATABRICKS_TOKEN || ""}`);

  // Create a new conversation state with the updated history
  const updatedConversationState: ConversationState = {
    ...currentConversationState,
    history: [
      ...currentConversationState.history,
      { role: 'user', content: userInput }
    ]
  };

  // No need for the separate apiConversationState - use the structure directly
  const requestData: RequestData = {
    "client_request_id": "request-" + Date.now() + "-" + Math.random().toString(36).substring(2,7),
    "dataframe_split": {
      "columns": [
        "user_input",
        "content_id",
        "content_version",
        "conversation_state",
        "config",
        "top_n",
        "generate_rephrase_precondition",
        "general_content_modifier",
        "stage_content_modifier",
        "session_id",
        "hardware_id",
        "user_id"
      ],
      "data": [
        [
          userInput,
          "vsim-medsurg-patient-millie_larsen",
          "",
          updatedConversationState, // Use the conversation state directly
          defaultConfig,
          5,
          [
            {
              "id": "",
              "intent": "",
              "response": "",
              "score": 0.1
            }
          ],
          generalContentModifiers,
          stageContentModifiers,
          "session-" + Date.now(),
          "device-id",
          "user-id"
        ]
      ]
    }
  };

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(requestData),
    redirect: "follow" as RequestRedirect
  };

  try {
    console.debug("Sending request to Hera Champion API:", JSON.stringify(requestData, null, 2));
    console.debug("Detailed emotions structure:", 
      JSON.stringify(updatedConversationState.emotions), 
      "Type:", Array.isArray(updatedConversationState.emotions) ? "Array" : typeof updatedConversationState.emotions);
    
    // Use the environment variable for the endpoint path
    const endpointPath = process.env.REACT_APP_DATABRICKS_HTTP_PATH || "/serving-endpoints/convai-vsim-v0/invocations";
    const response = await fetch(endpointPath, requestOptions);
    
    // Log response status
    console.debug("Hera API response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hera API error response:", errorText);
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.debug("Hera API response:", JSON.stringify(result, null, 2));
    
    // Updated parsing logic based on expected response format
    if (!result.predictions) {
      console.error("Unexpected response format - missing predictions:", result);
      throw new Error("Unexpected response format from API - missing predictions");
    }
    
    // The predictions could be an object or an array, handle both cases
    let assistantResponse = "";
    
    if (Array.isArray(result.predictions)) {
      // Handle the array format we were expecting before
      assistantResponse = result.predictions[0] || "I'm sorry, I couldn't understand that.";
    } else {
      // Handle the object format
      assistantResponse = result.predictions.response || 
                          result.predictions.intent_response ||
                          "I'm sorry, I couldn't understand that.";
    }
    
    // Update conversation state with assistant's response
    const newConversationState: ConversationState = {
      ...updatedConversationState,
      step: updatedConversationState.step,
      history: [
        ...updatedConversationState.history,
        { role: 'assistant', content: assistantResponse }
      ]
    };
    
    return {
      response: assistantResponse,
      conversationState: newConversationState
    };
  } catch (error) {
    console.error("Error calling Hera API:", error);
    console.debug("Falling back to predefined responses due to API error");
    
    // Create a more comprehensive set of mock responses for development if the API is unavailable
    const mockResponses: { [key: string]: string } = {
      // Basic greetings
      "hello": "Hello! I'm Millie. How can I help you today?",
      "hi": "Hi there! I'm Millie Larsen. I'm not feeling so great today.",
      "how are you": "I'm not feeling very well. My leg is really hurting me.",
      
      // Pain location/description questions
      "where is your pain": "It's in my right leg, mainly around my shin area. It's pretty bad.",
      "where does it hurt": "My right leg is really painful, especially around the shin area.",
      "pain location": "The pain is concentrated in my right shin, but sometimes it radiates up my leg.",
      "describe pain": "It's a sharp, throbbing pain that's worse when I try to put weight on it.",
      "type of pain": "It's a combination of sharp and throbbing pain. Sometimes it feels like it's burning.",
      
      // Pain assessment questions
      "rate your pain": "It's about an 8 out of 10 right now. It's really throbbing.",
      "pain level": "On a scale of 1 to 10, it's about an 8. It's quite severe.",
      "scale": "If I had to rate it, I'd say 8 out of 10. It's very painful.",
      "how bad": "It's pretty bad - about an 8 out of 10. Makes it hard to think about anything else.",
      
      // Pain history questions
      "when did the pain start": "It started about two days ago after I was moving some furniture in my apartment.",
      "how long": "The pain has been going on for about two days now.",
      "what happened": "I was moving furniture in my apartment two days ago, and then my leg started hurting badly.",
      "what caused": "I think it might have been from moving furniture in my apartment. I felt something pull in my leg.",
      
      // Alleviating/worsening factors
      "what makes it better": "Keeping it elevated helps a little, and ice gave me some temporary relief.",
      "what helps": "Elevating my leg seems to help a bit, and the ice they gave me earlier provided some relief.",
      "what makes it worse": "Standing or walking definitely makes it worse. Any pressure on it is really painful.",
      "what aggravates": "Putting any weight on it makes the pain much worse. Even light touch can be painful.",
      
      // Medical history
      "allergies": "I'm allergic to peanuts, and I had a rash once from penicillin.",
      "medical history": "I've been pretty healthy overall. No major surgeries or conditions, except for the peanut and penicillin allergies.",
      "medications": "I took some ibuprofen at home for the pain, but it didn't really help much.",
      "medication": "I took some ibuprofen at home, but it didn't help much. They gave me something stronger here, but I'm still in pain.",
      
      // General hospital questions
      "hospital": "I came to the hospital today because the pain in my leg was getting unbearable.",
      "doctor": "The doctor examined my leg earlier and ordered some tests. I'm waiting to hear more.",
      "nurse": "The nurses have been checking on me regularly. They gave me some pain medication about an hour ago.",
      "tests": "They took some blood tests and did an X-ray of my leg. I'm waiting for the results."
    };
    
    // Use a more sophisticated matching approach
    const userInputLower = userInput.toLowerCase();
    
    // First try to find an exact match
    let matchedKey = Object.keys(mockResponses).find(key => 
      userInputLower.includes(key.toLowerCase())
    );
    
    // If no match, try to find keywords related to common medical assessment questions
    if (!matchedKey) {
      if (userInputLower.includes("pain") && (userInputLower.includes("describe") || userInputLower.includes("what"))) {
        matchedKey = "describe pain";
      } else if (userInputLower.includes("pain") && (userInputLower.includes("rate") || userInputLower.includes("scale") || userInputLower.includes("level"))) {
        matchedKey = "rate your pain";
      } else if (userInputLower.includes("pain") && (userInputLower.includes("where") || userInputLower.includes("location"))) {
        matchedKey = "where is your pain";
      } else if (userInputLower.includes("start") || userInputLower.includes("begin") || userInputLower.includes("when")) {
        matchedKey = "when did the pain start";
      } else if (userInputLower.includes("better") || userInputLower.includes("help") || userInputLower.includes("relief")) {
        matchedKey = "what makes it better";
      } else if (userInputLower.includes("worse") || userInputLower.includes("aggravate") || userInputLower.includes("increase")) {
        matchedKey = "what makes it worse";
      }
    }
    
    const fallbackResponse = matchedKey 
      ? mockResponses[matchedKey]
      : "I'm sorry, I couldn't understand that. Could you please rephrase your question? I can tell you about my pain, when it started, what makes it better or worse, or any other concerns you have.";
    
    // Update conversation state with fallback response
    const newConversationState: ConversationState = {
      ...updatedConversationState,
      step: updatedConversationState.step,
      history: [
        ...updatedConversationState.history,
        { role: 'assistant', content: fallbackResponse }
      ]
    };
    
    console.debug("Using fallback response:", fallbackResponse);
    
    return {
      response: fallbackResponse,
      conversationState: newConversationState
    };
  }
}