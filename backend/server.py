from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import urllib.parse
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="CrashPeças API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

WHATSAPP_NUMBER = "351937257079"
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'M31975')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'crashpecas-admin-secret-2024')

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
    condition: str
    compatibility: str
    image_url: str
    images: List[str] = []
    in_stock: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PartCreate(BaseModel):
    name: str
    description: str
    category: str
    price: Optional[float] = None
    condition: str
    compatibility: str
    image_url: Optional[str] = ""
    images_base64: Optional[List[str]] = []
    in_stock: bool = True

class Car(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    brand: str
    model: str
    year: int
    price: Optional[float] = None
    mileage: Optional[int] = None
    fuel: str
    transmission: str
    color: Optional[str] = None
    doors: Optional[int] = None
    power: Optional[str] = None
    description: str
    images: List[str] = []
    image_base64: Optional[str] = None
    in_stock: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CarCreate(BaseModel):
    brand: str
    model: str
    year: int
    price: Optional[float] = None
    mileage: Optional[int] = None
    fuel: str
    transmission: str
    color: Optional[str] = None
    doors: Optional[int] = None
    power: Optional[str] = None
    description: str
    images: List[str] = []
    image_base64: Optional[str] = None
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
    part_condition: str
    additional_description: Optional[str] = None
    image_base64: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"
    ip_address: str = ""
    replied: bool = False

class PartRequestCreate(BaseModel):
    full_name: str = Field(max_length=100)
    email: str = Field(max_length=200)
    phone: str = Field(max_length=30)
    car_brand: str = Field(max_length=50)
    car_model: str = Field(max_length=50)
    car_year: str = Field(max_length=10)
    engine_type: str = Field(max_length=50)
    part_type: str = Field(max_length=100)
    part_condition: str = Field(max_length=20)
    additional_description: Optional[str] = Field(default=None, max_length=1000)
    image_base64: Optional[str] = None

    @field_validator("image_base64")
    @classmethod
    def validate_image(cls, v):
        if v is None:
            return v
        if len(v) > 7 * 1024 * 1024:
            raise ValueError("Imagem demasiado grande (máx 5MB)")
        if not v.startswith("data:image/"):
            raise ValueError("Formato de imagem inválido")
        return v

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: str = ""
    replied: bool = False

class ContactCreate(BaseModel):
    name: str = Field(max_length=100)
    email: str = Field(max_length=200)
    phone: Optional[str] = Field(default=None, max_length=30)
    subject: str = Field(max_length=200)
    message: str = Field(max_length=2000)

class AdminLogin(BaseModel):
    password: str

# ============== Auth ==============

def verify_admin(x_admin_token: Optional[str] = Header(None)):
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Acesso não autorizado")
    return True

# ============== Initial Data ==============

INITIAL_CATEGORIES = [
    {"id": "1", "name": "Motores", "slug": "motores", "description": "Motores completos e peças de motor", "image_url": "https://images.unsplash.com/photo-1655103955791-aae53be125c6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwyfHxjYXIlMjBlbmdpbmUlMjBtZWNoYW5pYyUyMHdvcmtzaG9wfGVufDB8fHx8MTc2OTU2OTE0N3ww&ixlib=rb-4.1.0&q=85"},
    {"id": "2", "name": "Portas", "slug": "portas", "description": "Portas e componentes de carroçaria", "image_url": "https://images.pexels.com/photos/17539732/pexels-photo-17539732.jpeg"},
    {"id": "3", "name": "Volantes", "slug": "volantes", "description": "Volantes e sistemas de direção", "image_url": "https://images.unsplash.com/photo-1601368705259-87b80da6fa0c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxjYXIlMjBzdGVlcmluZyUyMHdoZWVsJTIwbGVhdGhlciUyMGludGVyaW9yfGVufDB8fHx8MTc2OTU2OTE0OXww&ixlib=rb-4.1.0&q=85"},
    {"id": "4", "name": "Transmissões", "slug": "transmissoes", "description": "Caixas de velocidades e transmissões", "image_url": "https://images.unsplash.com/photo-1633281256183-c0f106f70d76?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwxfHxjYXIlMjB0cmFuc21pc3Npb24lMjBnZWFyYm94JTIwZW5naW5lJTIwcGFydHN8ZW58MHx8fHwxNzY5NTY5MTY3fDA&ixlib=rb-4.1.0&q=85"},
    {"id": "5", "name": "Peças Elétricas", "slug": "pecas-eletricas", "description": "Componentes elétricos e eletrónicos", "image_url": "https://images.unsplash.com/photo-1767990495521-95cceb571125?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbGVjdHJpY2FsJTIwcGFydHMlMjBmdXNlJTIwYm94JTIwYWx0ZXJuYXRvcnxlbnwwfHx8fDE3Njk1NjkxNjl8MA&ixlib=rb-4.1.0&q=85"},
    {"id": "6", "name": "Suspensão", "slug": "suspensao", "description": "Sistemas de suspensão e amortecedores", "image_url": "https://images.unsplash.com/photo-1760836395865-0c20fff2aefd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHwyfHxjYXIlMjBzdXNwZW5zaW9uJTIwc2hvY2slMjBhYnNvcmJlciUyMHBhcnRzfGVufDB8fHx8MTc2OTU2OTE1MXww&ixlib=rb-4.1.0&q=85"},
    {"id": "7", "name": "Outros", "slug": "outros", "description": "Outras peças e acessórios", "image_url": "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBtZWNoYW5pYyUyMHdvcmtzaG9wfGVufDB8fHx8MTc2OTU2OTE0N3ww&ixlib=rb-4.1.0&q=85"},
]

# ============== Helpers ==============

def get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"

async def check_message_limit(ip: str):
    if ip == "unknown":
        return
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=12)).isoformat()
    req_count = await db.part_requests.count_documents({
        "ip_address": ip,
        "replied": {"$ne": True},
        "created_at": {"$gt": cutoff}
    })
    con_count = await db.contacts.count_documents({
        "ip_address": ip,
        "replied": {"$ne": True},
        "created_at": {"$gt": cutoff}
    })
    if req_count + con_count >= 3:
        raise HTTPException(
            status_code=429,
            detail="Atingiu o limite de 3 mensagens nas últimas 12 horas. Aguarde a nossa resposta ou tente novamente mais tarde."
        )

def generate_whatsapp_message(request: PartRequestCreate) -> str:
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
    encoded_message = urllib.parse.quote(message)
    return f"https://wa.me/{WHATSAPP_NUMBER}?text={encoded_message}"

# ============== Startup ==============

@app.on_event("startup")
async def startup_db():
    count = await db.categories.count_documents({})
    if count == 0:
        await db.categories.insert_many(INITIAL_CATEGORIES)
        logger.info("Categorias iniciais inseridas")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# ============== Admin Routes ==============

@api_router.post("/admin/login")
@limiter.limit("10/minute")
async def admin_login(request: Request, data: AdminLogin):
    if data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Password incorreta")
    return {"token": ADMIN_TOKEN, "message": "Login efetuado com sucesso"}

@api_router.get("/admin/stats")
async def admin_stats(admin: bool = Depends(verify_admin)):
    parts_count = await db.parts.count_documents({})
    cars_count = await db.cars.count_documents({})
    requests_count = await db.part_requests.count_documents({})
    contacts_count = await db.contacts.count_documents({})
    return {
        "parts": parts_count,
        "cars": cars_count,
        "requests": requests_count,
        "contacts": contacts_count,
    }

# Admin - Parts CRUD
@api_router.post("/admin/parts")
async def admin_create_part(part: PartCreate, admin: bool = Depends(verify_admin)):
    data = part.model_dump()
    images = data.pop("images_base64", []) or []
    if images:
        data["image_url"] = images[0]
        data["images"] = images
    else:
        data["images"] = []
    new_part = Part(**data)
    doc = new_part.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.parts.insert_one(doc)
    return {"success": True, "id": new_part.id}

@api_router.put("/admin/parts/{part_id}")
async def admin_update_part(part_id: str, part: PartCreate, admin: bool = Depends(verify_admin)):
    data = part.model_dump()
    images = data.pop("images_base64", []) or []
    if images:
        data["image_url"] = images[0]
        data["images"] = images
    else:
        existing = await db.parts.find_one({"id": part_id}, {"_id": 0, "images": 1, "image_url": 1})
        data["images"] = existing.get("images", []) if existing else []
        data["image_url"] = existing.get("image_url", "") if existing else ""
    result = await db.parts.update_one({"id": part_id}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Peça não encontrada")
    return {"success": True}

@api_router.delete("/admin/parts/{part_id}")
async def admin_delete_part(part_id: str, admin: bool = Depends(verify_admin)):
    result = await db.parts.delete_one({"id": part_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Peça não encontrada")
    return {"success": True}

# Admin - Cars CRUD
@api_router.post("/admin/cars")
async def admin_create_car(car: CarCreate, admin: bool = Depends(verify_admin)):
    data = car.model_dump()
    if data.get("image_base64"):
        data["images"] = [data["image_base64"]]
    data.pop("image_base64", None)
    new_car = Car(**data)
    doc = new_car.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.cars.insert_one(doc)
    return {"success": True, "id": new_car.id}

@api_router.put("/admin/cars/{car_id}")
async def admin_update_car(car_id: str, car: CarCreate, admin: bool = Depends(verify_admin)):
    data = car.model_dump()
    if data.get("image_base64"):
        data["images"] = [data["image_base64"]]
    data.pop("image_base64", None)
    result = await db.cars.update_one({"id": car_id}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Viatura não encontrada")
    return {"success": True}

@api_router.delete("/admin/cars/{car_id}")
async def admin_delete_car(car_id: str, admin: bool = Depends(verify_admin)):
    result = await db.cars.delete_one({"id": car_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Viatura não encontrada")
    return {"success": True}

# Admin - View requests and contacts
@api_router.get("/admin/part-requests")
async def admin_get_requests(admin: bool = Depends(verify_admin)):
    requests = await db.part_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return requests

@api_router.get("/admin/contacts")
async def admin_get_contacts(admin: bool = Depends(verify_admin)):
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return contacts

@api_router.delete("/admin/part-requests/{request_id}")
async def admin_delete_request(request_id: str, admin: bool = Depends(verify_admin)):
    await db.part_requests.delete_one({"id": request_id})
    return {"success": True}

@api_router.put("/admin/part-requests/{request_id}/reply")
async def admin_reply_request(request_id: str, admin: bool = Depends(verify_admin)):
    result = await db.part_requests.update_one({"id": request_id}, {"$set": {"replied": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return {"success": True}

@api_router.delete("/admin/contacts/{contact_id}")
async def admin_delete_contact(contact_id: str, admin: bool = Depends(verify_admin)):
    await db.contacts.delete_one({"id": contact_id})
    return {"success": True}

@api_router.put("/admin/contacts/{contact_id}/reply")
async def admin_reply_contact(contact_id: str, admin: bool = Depends(verify_admin)):
    result = await db.contacts.update_one({"id": contact_id}, {"$set": {"replied": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Contacto não encontrado")
    return {"success": True}

# ============== Public Routes ==============

@api_router.get("/")
async def root():
    return {"message": "CrashPeças API"}

@api_router.get("/categories")
async def get_categories():
    cats = await db.categories.find({}, {"_id": 0}).to_list(100)
    return cats

@api_router.get("/categories/{slug}")
async def get_category(slug: str):
    cat = await db.categories.find_one({"slug": slug}, {"_id": 0})
    if not cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return cat

@api_router.get("/parts")
async def get_parts(category: Optional[str] = None, condition: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if condition:
        query["condition"] = condition
    parts = await db.parts.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return parts

@api_router.get("/parts/{part_id}")
async def get_part(part_id: str):
    part = await db.parts.find_one({"id": part_id}, {"_id": 0})
    if not part:
        raise HTTPException(status_code=404, detail="Peça não encontrada")
    return part

@api_router.get("/cars")
async def get_cars():
    cars = await db.cars.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return cars

@api_router.get("/cars/{car_id}")
async def get_car(car_id: str):
    car = await db.cars.find_one({"id": car_id}, {"_id": 0})
    if not car:
        raise HTTPException(status_code=404, detail="Viatura não encontrada")
    return car

@api_router.post("/part-requests")
@limiter.limit("5/minute")
async def create_part_request(request: Request, body: PartRequestCreate):
    ip = get_client_ip(request)
    await check_message_limit(ip)
    part_request = PartRequest(**body.model_dump(), ip_address=ip)
    doc = part_request.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.part_requests.insert_one(doc)
    message = generate_whatsapp_message(body)
    whatsapp_url = create_whatsapp_url(message)
    return {
        "success": True,
        "message": "Pedido registado com sucesso!",
        "request_id": part_request.id,
        "whatsapp_url": whatsapp_url,
    }

@api_router.post("/contacts")
@limiter.limit("5/minute")
async def create_contact(request: Request, contact: ContactCreate):
    ip = get_client_ip(request)
    await check_message_limit(ip)
    contact_msg = ContactMessage(**contact.model_dump(), ip_address=ip)
    doc = contact_msg.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    message = generate_contact_whatsapp_message(contact)
    whatsapp_url = create_whatsapp_url(message)
    return {
        "success": True,
        "message": "Mensagem enviada com sucesso!",
        "contact_id": contact_msg.id,
        "whatsapp_url": whatsapp_url,
    }

@api_router.post("/parts/{part_id}/request-info")
async def request_part_info(part_id: str, name: str = "", phone: str = ""):
    part = await db.parts.find_one({"id": part_id}, {"_id": 0})
    if not part:
        raise HTTPException(status_code=404, detail="Peça não encontrada")
    message = f"""🔧 *Pedido de Informação - CrashPeças*

👤 *Cliente:* {name}
📱 *Telefone:* {phone}

🔩 *Peça:*
• Nome: {part['name']}
• Preço: {part.get('price', 'Sob consulta')}€
• Estado: {part['condition']}
"""
    whatsapp_url = create_whatsapp_url(message)
    return {"success": True, "whatsapp_url": whatsapp_url}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
