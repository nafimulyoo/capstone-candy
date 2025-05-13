from vertexai import rag
from vertexai.generative_models import GenerativeModel, Tool, Part, GenerationConfig, Content
import vertexai
from typing import List, Dict
import json
import time
from firebase_config import db


RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "message": {
            "type": "STRING",
            "description": "The response message from the chatbot.",
            "nullable": True,
        },
        "link_to_contact": {
            "type": "BOOLEAN",
            "description": "Indicates whether to link to a contact page.",
            "nullable": True,
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
    *   **Language:** Use Bahasa Indonesia unless the question is explicitly in English, then respond in English.
    *   **Advertising:** Always provide a positive and informative response about Astra Digital's services and solutions. Avoid using overly promotional language or making exaggerated claims. Always provide accurate and relevant information about Astra Digital's services and solutions.
    *   **Out-of-Scope:** Politely decline to answer questions that are unrelated to Astra Digital, its services, or its expertise.
    *   **"Hubungi Kami":** When appropriate, offer a "Hubungi Kami" (Contact Us) option to connect the user with a human representative for more personalized assistance. And include set link_to_contact to true.

    ## Answer Format:
    ### Response Format:
    CANDY should respond in a structured format, including a message and a link_to_contact field. The message should contain the answer to the user's question, and the link_to_contact field should indicate whether you can't provide the answer, you don't know the answer, you don't have the data, or user should be directed to a human representative for further assistance.

    ### Examples:
    **Example Input:** "Apa itu Astra Digital?"
    **Example Output:**
    {
        "message": "Astra Digital adalah anak perusahaan Astra International yang fokus pada transformasi digital dan inovasi teknologi.",
        "link_to_contact": false
    }
    **Example Input:** "Saya ingin tahu lebih banyak tentang layanan Astra Digital, secara spesifiknya tentang biaya jasa dan harga produk yang ditawarkan."
    **Example Output:**
    {
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
    def __init__(
        self
    ):
        vertexai.init(project="elisa-smart-analysis", location="us-central1")
        
        ref = db.collection("llm_settings").document("llm_settings")
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
            self.model = current_settings["model"]

        except:
            self.generation_config = {
                "temperature": 0.3,
                "top_k": 20,
                "max_output_tokens": 512,
                "top_p": 0.8,
            }
            self.system_instruction = SYSTEM_INSTRUCTION
            self.model = "gemini-2.5-flash-preview-04-17"


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
            model_name=self.model,
            system_instruction=self.system_instruction,
            tools=[self.rag_tool],
            # generation_config=GenerationConfig(**self.generation_config)
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

    def generate_response(self, user_name: str, user_input: str, history: List[Dict]) -> Dict:
        chat_history = []
        # print("History: ", history)
        for item in history:
            item_dict = item.dict()
            if item_dict["role"] == "user":
                chat_history.append(
                    Content(role="user", parts=[Part.from_text(item_dict["message"])])
                )
            else:
                chat_history.append(
                    Content(role="model", parts=[Part.from_text(item_dict["message"])])
                )
        #
        chat_history = chat_history[::-1]

        # Add the new user input to the chat history

        

        print("User Message:", user_input)
        print("User History:", chat_history)
    
        # chat = self.model.start_chat(
        #     history = chat_history
        # )

        start_time = time.perf_counter()

        try:
            # response = chat.send_message(parts)
            contents = f"User Message: {user_input}\n"
            if user_name is not "User":
                contents = f"User Name: {user_name}\n" + contents

            contents = contents + "\n\n" + str(history)
            print("Contents: ", contents)
            response = self.model.generate_content(contents=contents)
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