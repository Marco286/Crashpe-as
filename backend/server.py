from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64
import urllib.parse

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="CrashPeças API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# WhatsApp number for the business
WHATSAPP_NUMBER = "351912345678"  # Replace with actual number

# ============== Models ==============

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    image_url: str

class Part(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category: str
    price: Optional[float] = None
    condition: str  # "Nova", "Usada", "Recondicionada"
    compatibility: str
    image_url: str
    in_stock: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PartCreate(BaseModel):
    name: str
    description: str
    category: str
    price: Optional[float] = None
    condition: str
    compatibility: str
    image_url: str
    in_stock: bool = True

class PartRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: str
    phone: str
    car_brand: str
    car_model: str
    car_year: str
    engine_type: str
    part_type: str
    part_condition: str  # "Nova", "Usada", "Indiferente"
    additional_description: Optional[str] = None
    image_base64: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"

class PartRequestCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    car_brand: str
    car_model: str
    car_year: str
    engine_type: str
    part_type: str
    part_condition: str
    additional_description: Optional[str] = None
    image_base64: Optional[str] = None

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str

class WhatsAppLink(BaseModel):
    whatsapp_url: str
    message: str

# ============== Categories Data ==============

CATEGORIES = [
    {
        "id": "1",
        "name": "Motores",
        "slug": "motores",
        "description": "Motores completos e peças de motor",
        "image_url": "https://images.unsplash.com/photo-1655103955791-aae53be125c6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwyfHxjYXIlMjBlbmdpbmUlMjBtZWNoYW5pYyUyMHdvcmtzaG9wfGVufDB8fHx8MTc2OTU2OTE0N3ww&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "2",
        "name": "Portas",
        "slug": "portas",
        "description": "Portas e componentes de carroçaria",
        "image_url": "https://images.pexels.com/photos/17539732/pexels-photo-17539732.jpeg"
    },
    {
        "id": "3",
        "name": "Volantes",
        "slug": "volantes",
        "description": "Volantes e sistemas de direção",
        "image_url": "https://images.unsplash.com/photo-1601368705259-87b80da6fa0c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxjYXIlMjBzdGVlcmluZyUyMHdoZWVsJTIwbGVhdGhlciUyMGludGVyaW9yfGVufDB8fHx8MTc2OTU2OTE0OXww&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "4",
        "name": "Transmissões",
        "slug": "transmissoes",
        "description": "Caixas de velocidades e transmissões",
        "image_url": "https://images.unsplash.com/photo-1633281256183-c0f106f70d76?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwxfHxjYXIlMjB0cmFuc21pc3Npb24lMjBnZWFyYm94JTIwZW5naW5lJTIwcGFydHN8ZW58MHx8fHwxNzY5NTY5MTY3fDA&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "5",
        "name": "Peças Elétricas",
        "slug": "pecas-eletricas",
        "description": "Componentes elétricos e eletrónicos",
        "image_url": "https://images.unsplash.com/photo-1767990495521-95cceb571125?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbGVjdHJpY2FsJTIwcGFydHMlMjBmdXNlJTIwYm94JTIwYWx0ZXJuYXRvcnxlbnwwfHx8fDE3Njk1NjkxNjl8MA&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "6",
        "name": "Suspensão",
        "slug": "suspensao",
        "description": "Sistemas de suspensão e amortecedores",
        "image_url": "https://images.unsplash.com/photo-1760836395865-0c20fff2aefd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHxjYXIlMjBzdXNwZW5zaW9uJTIwc2hvY2slMjBhYnNvcmJlciUyMHBhcnRzfGVufDB8fHx8MTc2OTU2OTE1MXww&ixlib=rb-4.1.0&q=85"
    },
    {
        "id": "7",
        "name": "Outros",
        "slug": "outros",
        "description": "Outras peças e acessórios",
        "image_url": "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBtZWNoYW5pYyUyMHdvcmtzaG9wfGVufDB8fHx8MTc2OTU2OTE0N3ww&ixlib=rb-4.1.0&q=85"
    }
]

# Sample parts data
SAMPLE_PARTS = [
    {
        "id": "p1",
        "name": "Motor 1.6 TDI VAG",
        "description": "Motor completo 1.6 TDI em excelente estado. Compatível com várias viaturas do grupo VAG.",
        "category": "motores",
        "price": 2500.00,
        "condition": "Usada",
        "compatibility": "VW Golf VII, Seat Leon, Audi A3",
        "image_url": "https://images.unsplash.com/photo-1655103955791-aae53be125c6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwyfHxjYXIlMjBlbmdpbmUlMjBtZWNoYW5pYyUyMHdvcmtzaG9wfGVufDB8fHx8MTc2OTU2OTE0N3ww&ixlib=rb-4.1.0&q=85",
        "in_stock": True
    },
    {
        "id": "p2",
        "name": "Porta Dianteira Esquerda BMW E90",
        "description": "Porta dianteira lado condutor para BMW Série 3 E90. Cor preta, sem danos.",
        "category": "portas",
        "price": 350.00,
        "condition": "Usada",
        "compatibility": "BMW Série 3 E90/E91 (2005-2011)",
        "image_url": "https://images.pexels.com/photos/17539732/pexels-photo-17539732.jpeg",
        "in_stock": True
    },
    {
        "id": "p3",
        "name": "Volante Desportivo BMW M",
        "description": "Volante em pele com insígnias M. Excelente estado, sem desgaste.",
        "category": "volantes",
        "price": 450.00,
        "condition": "Usada",
        "compatibility": "BMW Série 3, 5, 7 (2010-2020)",
        "image_url": "https://images.unsplash.com/photo-1601368705259-87b80da6fa0c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxjYXIlMjBzdGVlcmluZyUyMHdoZWVsJTIwbGVhdGhlciUyMGludGVyaW9yfGVufDB8fHx8MTc2OTU2OTE0OXww&ixlib=rb-4.1.0&q=85",
        "in_stock": True
    },
    {
        "id": "p4",
        "name": "Caixa de Velocidades 6v Manual",
        "description": "Caixa de velocidades manual 6 velocidades. Testada e garantida.",
        "category": "transmissoes",
        "price": 800.00,
        "condition": "Recondicionada",
        "compatibility": "VW, Audi, Seat, Skoda",
        "image_url": "https://images.unsplash.com/photo-1633281256183-c0f106f70d76?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwxfHxjYXIlMjB0cmFuc21pc3Npb24lMjBnZWFyYm94JTIwZW5naW5lJTIwcGFydHN8ZW58MHx8fHwxNzY5NTY5MTY3fDA&ixlib=rb-4.1.0&q=85",
        "in_stock": True
    },
    {
        "id": "p5",
        "name": "Alternador Mercedes C200",
        "description": "Alternador original Mercedes. Funcionamento perfeito.",
        "category": "pecas-eletricas",
        "price": 180.00,
        "condition": "Usada",
        "compatibility": "Mercedes Classe C W204",
        "image_url": "https://images.unsplash.com/photo-1767990495521-95cceb571125?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbGVjdHJpY2FsJTIwcGFydHMlMjBmdXNlJTIwYm94JTIwYWx0ZXJuYXRvcnxlbnwwfHx8fDE3Njk1NjkxNjl8MA&ixlib=rb-4.1.0&q=85",
        "in_stock": True
    },
    {
        "id": "p6",
        "name": "Kit Coilovers Ajustáveis",
        "description": "Kit de suspensão coilover ajustável em altura. Novo, nunca usado.",
        "category": "suspensao",
        "price": 650.00,
        "condition": "Nova",
        "compatibility": "Universal - vários modelos",
        "image_url": "https://images.unsplash.com/photo-1760836395865-0c20fff2aefd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHxjYXIlMjBzdXNwZW5zaW9uJTIwc2hvY2slMjBhYnNvcmJlciUyMHBhcnRzfGVufDB8fHx8MTc2OTU2OTE1MXww&ixlib=rb-4.1.0&q=85",
        "in_stock": True
    },
    {
        "id": "p7",
        "name": "Motor 2.0 TSI Golf GTI",
        "description": "Motor EA888 2.0 TSI com 220cv. Baixa quilometragem, excelente estado.",
        "category": "motores",
        "price": 3500.00,
        "condition": "Usada",
        "compatibility": "VW Golf GTI, Audi A3 S-Line",
        "image_url": "https://images.unsplash.com/photo-1655103955791-aae53be125c6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwyfHxjYXIlMjBlbmdpbmUlMjBtZWNoYW5pYyUyMHdvcmtzaG9wfGVufDB8fHx8MTc2OTU2OTE0N3ww&ixlib=rb-4.1.0&q=85",
        "in_stock": True
    },
    {
        "id": "p8",
        "name": "Amortecedores Traseiros Bilstein",
        "description": "Par de amortecedores traseiros Bilstein B4. Novos na embalagem.",
        "category": "suspensao",
        "price": 280.00,
        "condition": "Nova",
        "compatibility": "BMW E46, E36",
        "image_url": "https://images.unsplash.com/photo-1760836395865-0c20fff2aefd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHxjYXIlMjBzdXNwZW5zaW9uJTIwc2hvY2slMjBhYnNvcmJlciUyMHBhcnRzfGVufDB8fHx8MTc2OTU2OTE1MXww&ixlib=rb-4.1.0&q=85",
        "in_stock": True
    }
]

# ============== Helper Functions ==============

def generate_whatsapp_message(request: PartRequestCreate) -> str:
    """Generate WhatsApp message from part request"""
    message = f"""🔧 *Novo Pedido de Peça - CrashPeças*

👤 *Cliente:* {request.full_name}
📧 *Email:* {request.email}
📱 *Telefone:* {request.phone}

🚗 *Veículo:*
• Marca: {request.car_brand}
• Modelo: {request.car_model}
• Ano: {request.car_year}
• Motorização: {request.engine_type}

🔩 *Peça Pretendida:*
• Tipo: {request.part_type}
• Estado: {request.part_condition}
"""
    if request.additional_description:
        message += f"\n📝 *Descrição Adicional:*\n{request.additional_description}"
    
    if request.image_base64:
        message += "\n\n📷 *Cliente anexou imagem*"
    
    return message

def generate_contact_whatsapp_message(contact: ContactCreate) -> str:
    """Generate WhatsApp message from contact form"""
    message = f"""📩 *Nova Mensagem de Contacto - CrashPeças*

👤 *Nome:* {contact.name}
📧 *Email:* {contact.email}
"""
    if contact.phone:
        message += f"📱 *Telefone:* {contact.phone}\n"
    
    message += f"""
📌 *Assunto:* {contact.subject}

💬 *Mensagem:*
{contact.message}
"""
    return message

def create_whatsapp_url(message: str) -> str:
    """Create WhatsApp URL with encoded message"""
    encoded_message = urllib.parse.quote(message)
    return f"https://wa.me/{WHATSAPP_NUMBER}?text={encoded_message}"

# ============== API Routes ==============

@api_router.get("/")
async def root():
    return {"message": "CrashPeças API - A sua solução em peças automóveis"}

# Categories
@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    return CATEGORIES

@api_router.get("/categories/{slug}")
async def get_category(slug: str):
    for cat in CATEGORIES:
        if cat["slug"] == slug:
            return cat
    raise HTTPException(status_code=404, detail="Categoria não encontrada")

# Parts
@api_router.get("/parts", response_model=List[Part])
async def get_parts(category: Optional[str] = None, condition: Optional[str] = None):
    parts = SAMPLE_PARTS.copy()
    
    if category:
        parts = [p for p in parts if p["category"] == category]
    
    if condition:
        parts = [p for p in parts if p["condition"] == condition]
    
    return parts

@api_router.get("/parts/{part_id}")
async def get_part(part_id: str):
    for part in SAMPLE_PARTS:
        if part["id"] == part_id:
            return part
    raise HTTPException(status_code=404, detail="Peça não encontrada")

# Part Requests
@api_router.post("/part-requests")
async def create_part_request(request: PartRequestCreate):
    # Create the request object
    part_request = PartRequest(**request.model_dump())
    
    # Save to database
    doc = part_request.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.part_requests.insert_one(doc)
    
    # Generate WhatsApp message
    message = generate_whatsapp_message(request)
    whatsapp_url = create_whatsapp_url(message)
    
    return {
        "success": True,
        "message": "Pedido registado com sucesso! Entraremos em contacto o mais breve possível.",
        "request_id": part_request.id,
        "whatsapp_url": whatsapp_url,
        "whatsapp_message": message
    }

@api_router.get("/part-requests", response_model=List[PartRequest])
async def get_part_requests():
    requests = await db.part_requests.find({}, {"_id": 0}).to_list(1000)
    for req in requests:
        if isinstance(req.get('created_at'), str):
            req['created_at'] = datetime.fromisoformat(req['created_at'])
    return requests

# Contact
@api_router.post("/contacts")
async def create_contact(contact: ContactCreate):
    contact_msg = ContactMessage(**contact.model_dump())
    
    # Save to database
    doc = contact_msg.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    
    # Generate WhatsApp message
    message = generate_contact_whatsapp_message(contact)
    whatsapp_url = create_whatsapp_url(message)
    
    return {
        "success": True,
        "message": "Mensagem enviada com sucesso! Entraremos em contacto brevemente.",
        "contact_id": contact_msg.id,
        "whatsapp_url": whatsapp_url,
        "whatsapp_message": message
    }

# Part info request (for individual part pages)
@api_router.post("/parts/{part_id}/request-info")
async def request_part_info(part_id: str, name: str = "", phone: str = ""):
    part = None
    for p in SAMPLE_PARTS:
        if p["id"] == part_id:
            part = p
            break
    
    if not part:
        raise HTTPException(status_code=404, detail="Peça não encontrada")
    
    message = f"""🔧 *Pedido de Informação - CrashPeças*

👤 *Cliente:* {name}
📱 *Telefone:* {phone}

🔩 *Peça:*
• Nome: {part['name']}
• Categoria: {part['category']}
• Preço: {part['price']}€
• Estado: {part['condition']}
• Compatibilidade: {part['compatibility']}
"""
    
    whatsapp_url = create_whatsapp_url(message)
    
    return {
        "success": True,
        "whatsapp_url": whatsapp_url,
        "message": message
    }

# Include the router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
