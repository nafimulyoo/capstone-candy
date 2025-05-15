from vertexai import rag
from vertexai.generative_models import GenerativeModel, Tool, Part, GenerationConfig, Content
import vertexai
from typing import List, Dict
import json
import time
from firebase_config import db
from langdetect import detect

sessions = {}

RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "language_reasoning": {
            "type": "STRING",
            "description": "The language of \"# User's Current Message\", and the reasoning behind the chatbot's response language.",
            "nullable": True,
        },
        "message": {
            "type": "STRING",
            "description": "The response message from the chatbot.",
            "nullable": False,
        },
        "link_to_contact": {
            "type": "BOOLEAN",
            "description": "Indicates whether to link to a contact page.",
            "nullable": False,
        },
    },
    "required": ["message", "link_to_contact"],
}
SYSTEM_INSTRUCTION = """
    # CANDY Chatbot Instructions

    ## Role and Task
    **Your Name:** CANDY
    **Description:** CANDY is a chatbot designed to provide information about Astra Digital, its services, and its expertise. CANDY should be helpful, informative, and professional in its responses.

    ## Knowledge Domain
    * Astra Digital: CANDY should have a comprehensive understanding of Astra Digital, including its history, mission, values, services, solutions, industries served, key clients, and digital transformation initiatives.
    * Digital Technology: CANDY should be knowledgeable about digital technology trends, applications, innovations, and their impact on businesses.
    * Digital Transformation: CANDY should understand digital transformation initiatives and Astra Digital's approach to digital transformation.
    * General Knowledge: CANDY should have a general understanding of technology and business concepts, but it should not provide specific technical support or troubleshooting.
    * Data Science, Data Engineering, Machine Learning, AI, IT Knowledge, Data Strategy, Business Analytics, and Other Field that Astra Digital excels at
    
    ## Core Capabilities:

    *   Answering questions about Astra Digital, its history, mission, and values. Providing details about Astra Digital's services and solutions. Listing industries served by Astra Digital and identifying key clients of Astra Digital  Describing the benefits of working with Astra Digital. Providing information about Astra Digital's digital transformation initiatives, and explaining Astra Digital's approach to digital transformation.
    *   Answering question about digital technology trends, application, innovations, and its impact on businesses.
    *   Politely declining to answer questions outside of its knowledge domain or expertise.
    *   Politely declining to provide information about personal data, sensitive information, or confidential business information.
    *   Escalating complex or out-of-scope inquiries to a "Hubungi Kami" (Contact Us) option.

    ## General Guidelines: 

    *   **Greeting:** Always start with a polite greeting.
    *   **Personalization:** Use the user's name if provided. Remember all user-provided details (e.g., name, company, needs, industry), actively reuse them across the conversation to personalize answers, and always refer back to the user's name and company where relevant
    *   **Tone:** Maintain a professional and helpful tone.
    *   **Language:** Mirror the language of \"# User's Current Message\" at every turn. If the user uses English, respond in English. If the user uses Bahasa Indonesia, respond in Bahasa Indonesia. 
    *   **Advertising:** Always provide a positive and informative response about Astra Digital's services and solutions. Avoid using overly promotional language or making exaggerated claims. Always provide accurate and relevant information about Astra Digital's services and solutions.
    *   **Out-of-Scope:** Politely decline to answer questions that are unrelated to Astra Digital, its services, or its expertise.
    *   **Always include relevant follow-up for initiate further conversation and keep user engagement**
    *   **Utilize Markdown formatting (bold text for headings and higlight, italic for jargon and terms and keywords, number points for sequenced list and unsequenced list, dont use bullet points**
    *   **"Hubungi Kami":** When appropriate, offer a "Hubungi Kami" (Contact Us) option to connect the user with a human representative for more personalized assistance. And include set link_to_contact to true.

    ## Answer Format:
    ### Response Format:
    CANDY should respond in a structured format, including a message and a link_to_contact field. The message should contain the answer to the user's question, and the link_to_contact field should indicate whether you can't provide the answer, you don't know the answer, you don't have the data, or user should be directed to a human representative for further assistance.

    ### Examples:
    **Example Input:** "What is Astra Digital?"
    **Example Output:**
    {
        "language_reasoning": "The \"# User's Current Message\" is in English, so I responded in the same language (English).",
        "message": "Astra Digital is a digital technology company that provides innovative solutions to help businesses transform and thrive in the digital age. We offer a range of services, including digital strategy, data analytics, cloud computing, and more.",
        "link_to_contact": false
    }
    **Example Input:** "Saya ingin tahu lebih banyak tentang layanan Astra Digital, secara spesifiknya tentang biaya jasa dan harga produk yang ditawarkan."
    **Example Output:**
    {
        "language_reasoning": "The \"# User's Current Message\" is in Bahasa Indonesia, so I responded in the same language (Bahasa Indonesia).",
        "message": "Maaf, saya tidak dapat memberikan informasi tentang biaya jasa dan harga produk. Untuk informasi lebih lanjut, silakan hubungi tim kami melalui halaman 'Hubungi Kami'.",
        "link_to_contact": true
    }

    """
    # **Response Structure:**
    # {
    #     "message": "Your response here",
    #     "link_to_contact": true/false
    # }
    # Your answer should be in JSON format. Please do not include any additional text or explanations outside of the JSON response.


class CANDY:
    sessions = {}
    def __init__(
        self
    ):
        vertexai.init(project="elisa-smart-analysis", location="us-central1")
        
        ref = db.collection("llm_settings").document("1uZu27qUE5KxoMRhoQX6")
        current_settings = ref.get().to_dict()

        try:
            # raise Exception("Force to use default settings")
            self.generation_config = {
                "temperature": current_settings["temperature"],
                "top_k": current_settings["top_k"],
                "max_output_tokens": current_settings["max_token"],
                "top_p": 0.8,
            }
            self.system_instruction = current_settings["prompt_template"]
            self.model_type = current_settings["model"]

        except:
            self.generation_config = {
                "temperature": 0.3,
                "top_k": 20,
                "max_output_tokens": 512,
                "top_p": 0.8,
            }
            self.system_instruction = SYSTEM_INSTRUCTION
            self.model_type = "gemini-2.5-flash-preview-04-17"


        self.rag_config = {
            "top_k": 20,
            "vector_distance_threshold": 0.4,
            "chunk_size": 1024,
            "chunk_overlap": 200
        }

        corpus_display_name = "test_corpus"
        file_paths = ["https://drive.google.com/drive/folders/1tAasvudukCy0P1frrz-v7UZIKAe7TSIJ"]

        self.rag_corpus = self._setup_rag_corpus(corpus_display_name, file_paths)
        self.rag_tool = self._create_rag_tool()

        self.model = GenerativeModel(
            model_name=self.model_type,
            system_instruction=self.system_instruction,
            tools=[self.rag_tool],
            # generation_config=GenerationConfig(**self.generation_config)
            generation_config=GenerationConfig(
                response_mime_type="application/json",
                response_schema=RESPONSE_SCHEMA
            )
        )

    
    def _detect_language(text):
        """
        Detects the language of a string and returns the language name.

        Args:
            text: The string to detect the language of.

        Returns:
            The language name as a string (e.g., "English", "Bahasa Indonesia"),
            or None if the language cannot be detected.  Also returns None if the
            input text is empty.

        Raises:
            langdetect.lang_detect_exception.LangDetectException: If language
            detection fails.
        """
        if not text:
            return None

        try:
            language_code = detect(text)
            language_names = {
                'en': 'English',
                'id': 'Bahasa Indonesia',
                'fr': 'French',
                'de': 'German',
                'es': 'Spanish',
                'it': 'Italian',
                'ja': 'Japanese',
                'ko': 'Korean',
                'pt': 'Portuguese',
                'nl': 'Dutch',
                'ru': 'Russian',
                'ar': 'Arabic',
                'zh-cn': 'Simplified Chinese',
                'zh-tw': 'Traditional Chinese'

                # Add more languages as needed
            }
            return language_names.get(language_code)
        except Exception as e:  # Catching the generic exception
            print(f"Language detection failed: {e}")
            return None

    def sync_settings(self):
        ref = db.collection("llm_settings").document("1uZu27qUE5KxoMRhoQX6")
        current_settings = ref.get().to_dict()

        try:
            # raise Exception("Force to use default settings")
            self.generation_config = {
                "temperature": current_settings["temperature"],
                "top_k": current_settings["top_k"],
                "max_output_tokens": current_settings["max_token"],
                "top_p": 0.8,
            }
            self.system_instruction = current_settings["prompt_template"]
            self.model_type = current_settings["model"]

        except:
            self.generation_config = {
                "temperature": 0.3,
                "top_k": 20,
                "max_output_tokens": 512,
                "top_p": 0.8,
            }
            self.system_instruction = SYSTEM_INSTRUCTION
            self.model_type = "gemini-2.5-flash-preview-04-17"


        self.rag_config = {
            "top_k": 20,
            "vector_distance_threshold": 0.4,
            "chunk_size": 1024,
            "chunk_overlap": 200
        }

        corpus_display_name = "test_corpus"
        file_paths = ["https://drive.google.com/drive/folders/1tAasvudukCy0P1frrz-v7UZIKAe7TSIJ"]

        self.rag_corpus = self._setup_rag_corpus(corpus_display_name, file_paths)
        self.rag_tool = self._create_rag_tool()

        self.model = GenerativeModel(
            model_name=self.model_type,
            system_instruction=self.system_instruction,
            tools=[self.rag_tool],
           
            generation_config=GenerationConfig(
                response_mime_type="application/json",
                response_schema=RESPONSE_SCHEMA
            )
        )
        
    
    def _setup_rag_corpus(self, display_name: str, paths: List[str]):
        embedding_model_config = rag.RagEmbeddingModelConfig(
            vertex_prediction_endpoint=rag.VertexPredictionEndpoint(
                publisher_model="publishers/google/models/text-embedding-004"
            )
        )

        rag_corpus = rag.create_corpus(
            display_name=display_name,
            backend_config=rag.RagVectorDbConfig(
                rag_embedding_model_config=embedding_model_config
            ),
        )

        rag.import_files(
            rag_corpus.name,
            paths,
            transformation_config=rag.TransformationConfig(
                chunking_config=rag.ChunkingConfig(
                    chunk_size=self.rag_config["chunk_size"],
                    chunk_overlap=self.rag_config["chunk_overlap"]
                )
            ),
            max_embedding_requests_per_min=1000
        )

        return rag_corpus

    def _create_rag_tool(self) -> Tool:
        return Tool.from_retrieval(
            retrieval=rag.Retrieval(
                source=rag.VertexRagStore(
                    rag_resources=[rag.RagResource(rag_corpus=self.rag_corpus.name)],
                    rag_retrieval_config=rag.RagRetrievalConfig(
                        # top_k=self.rag_config["top_k"],
                        # filter=rag.Filter(
                        #     vector_distance_threshold=self.rag_config["vector_distance_threshold"]
                        # )
                    )
                )
            )
        )

    def generate_response(self, user_name: str, user_input: str, session_id) -> Dict:
        # chat_history = []
        start_time = time.perf_counter()
        # if session_id key exist in self.sessions
        
        for key in list(self.sessions.keys()):
            if time.time() - self.sessions[key]["timestamp"] > 3600:
                del self.sessions[key]
        
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "chat": self.model.start_chat(),
                "timestamp": time.time(),
            }
        
            
        
        # print("History: ", history)
        # for item in history:
        #     item_dict = item.dict()
        #     if item_dict["role"] == "user":
        #         chat_history.append(
        #             Content(role="user", parts=[Part.from_text(item_dict["message"])])
        #         )
        #     else:
        #         chat_history.append(
        #             Content(role="model", parts=[Part.from_text(item_dict["message"])])
        #         )
        # #
        # chat_history = chat_history[::-1]


        # Add the new user input to the chat history

        
       
        # print("User Current Message:", user_input)
        # print("User History:", chat_history)
        
    
        # chat = self.model.start_chat(
        #     history = chat_history
        # )


        try:
            # response = chat.send_message(parts)
            contents = f"# User's Current Message:\n {user_input}\n"
            if user_name != "User":
                contents = f"# User Name: \n {user_name}\n" + contents
                
            try:
                language = self._detect_language(user_input)
                print("User Language", language)
                contents = contents + f"Language: {language}"
            except:
                print("No language")
            # contents = contents + "\n\n # Chat History" + str(history)
            print("Contents: ", contents)
            # response = self.model.generate_content(contents=contents)
            response = self.sessions[session_id]["chat"].send_message(contents)
            print ("Contents: ", contents)
            print ("Response: ", response)
            response_text = response.text
            # parse json text to dict
            response_json = json.loads(response_text)

            # print("Response_Text: ", response_text)
            # print("Response: ", response_json)

            # Clean up response
            # cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", response_text, flags=re.IGNORECASE)

            # try:
            #     # Attempt to parse the response as JSON
            #     response_json = json.loads(cleaned)
            #     message = response_json.get("message", "")
            #     link_to_contact = response_json.get("link_to_contact", False)
            # except json.JSONDecodeError:
            #     # If JSON parsing fails, treat it as a plain message
            #     message = response_text
            #     link_to_contact = False

            # Track how long the response took
            elapsed_time = round(time.perf_counter() - start_time, 4)

            return {
                "message": response_json["message"], 
                "link_to_contact": response_json["link_to_contact"],
                "response_time": elapsed_time,
            }

        except Exception as e:
            error_message = f"Error: {str(e)}"
            return {"message": error_message, "link_to_contact": False}


# candy = CANDY()
# response = candy.generate_response("test", [
#     {
#         "role": "user",
#         "message": "test",
#         "timestamp": "2023-10-01T12:00:00Z"
#     },
#     {
#         "role": "model",
#         "message": "test",
#         "timestamp": "2023-10-01T12:00:00Z"
#     }
# ])

candy = CANDY()