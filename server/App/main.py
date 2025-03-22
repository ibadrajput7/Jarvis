from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from App.routers.user_authentication import router as user_router
from App.jarvis import JarvisAssistant

app = FastAPI(title="Basic Web")

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/jarvis")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    jarvis = JarvisAssistant(websocket)
    
    try:
        while True:
            data = await websocket.receive_json()
            if data["action"] == "start":
                await jarvis.run_jarvis()
            elif data["action"] == "stop":
                jarvis.stop()
    except Exception as e:
        print(f"WebSocket error: {e}")

@app.get("/")
def health():
    return {"message": "Uvicorn is Running"}

app.include_router(user_router, prefix='/auth', tags=['User Login & Signup'])