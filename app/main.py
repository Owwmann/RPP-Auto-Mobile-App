# ... (other imports)
from app.api.v1 import mechanics
# ... (other imports)
app.include_router(mechanics.router, prefix="/api/v1/mechanics", tags=["mechanics"])
