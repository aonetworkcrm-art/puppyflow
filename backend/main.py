"""
Nexus Puppy Flow — REST API Server
FastAPI backend with SQLite database for the puppy tracking app.
Run: uvicorn main:app --reload --port 8000
"""

import os
import json
import tempfile
from datetime import datetime
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from database import (
    init_db, seed_puppies, get_puppies, get_weights, add_weight,
    delete_weight, get_feedings, upsert_feeding, get_medical_events,
    toggle_medical_event, add_custom_event, get_blanquita_meals,
    mark_blanquita_meal, get_reminder_config, update_reminder_config,
    migrate_from_localstorage, get_stats, export_all_json, export_excel
)
from models import (
    WeightAdd, FeedingUpdate, MedicalToggle, CustomEventAdd,
    BlanquitaMealMark, ReminderUpdate, MigrationData,
    ApiResponse
)

app = FastAPI(
    title="Nexus Puppy Flow API",
    description="Backend para el sistema de monitoreo de camada de perros",
    version="2.0.0",
)

# CORS — allow frontend from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Startup ───

@app.on_event("startup")
def startup():
    init_db()
    seed_puppies()
    print(f"🚀 Nexus Puppy Flow API v2.0 iniciado")


# ─── Health ───

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "db": os.path.exists("nexus_puppy.db"),
    }


# ─── Puppies ───

@app.get("/api/puppies")
def api_get_puppies():
    return {"ok": True, "data": get_puppies()}


# ─── Weights ───

@app.get("/api/weights")
def api_get_weights(puppy_id: str = Query(None)):
    return {"ok": True, "data": get_weights(puppy_id)}


@app.post("/api/weights")
def api_add_weight(body: WeightAdd):
    result = add_weight(body.puppy_id, body.date, body.value)
    return {"ok": True, **result}


@app.delete("/api/weights/{weight_id}")
def api_delete_weight(weight_id: int):
    result = delete_weight(weight_id)
    return {"ok": True, **result}


# ─── Feedings ───

@app.get("/api/feedings")
def api_get_feedings(date: str = Query(None)):
    return {"ok": True, "data": get_feedings(date)}


@app.post("/api/feedings")
def api_upsert_feeding(body: FeedingUpdate):
    result = upsert_feeding(body.date, body.time_key, body.block_a, body.block_b)
    return {"ok": True, **result}


# ─── Medical Events ───

@app.get("/api/medical")
def api_get_medical():
    return {"ok": True, "data": get_medical_events()}


@app.post("/api/medical/toggle")
def api_toggle_medical(body: MedicalToggle):
    result = toggle_medical_event(body.event_id)
    return {"ok": True, **result}


@app.post("/api/medical/custom")
def api_add_custom(body: CustomEventAdd):
    result = add_custom_event(body.title, body.date, body.type, body.description)
    return {"ok": True, **result}


# ─── Blanquita Meals ───

@app.get("/api/blanquita/meals")
def api_get_blanquita_meals(date: str = Query(None)):
    return {"ok": True, "data": get_blanquita_meals(date)}


@app.post("/api/blanquita/meals")
def api_mark_blanquita_meal(body: BlanquitaMealMark):
    result = mark_blanquita_meal(body.date, body.time_str, body.portion, body.notes)
    return {"ok": True, **result}


# ─── Blanquita Reminders ───

@app.get("/api/blanquita/reminders")
def api_get_reminders():
    return {"ok": True, "data": get_reminder_config()}


@app.post("/api/blanquita/reminders")
def api_update_reminders(body: ReminderUpdate):
    result = update_reminder_config(body.enabled, body.minutes_before)
    return {"ok": True, **result}


# ─── Stats ───

@app.get("/api/stats")
def api_get_stats():
    return {"ok": True, "data": get_stats()}


# ─── Migration ───

@app.post("/api/migrate")
def api_migrate(body: MigrationData):
    """Import data from localStorage JSON format."""
    result = migrate_from_localstorage(body.data)
    return {"ok": True, **result}


# ─── Export ───

@app.get("/api/export/json")
def api_export_json():
    """Export all data as JSON download."""
    json_str = export_all_json()
    return JSONResponse(
        content=json.loads(json_str),
        headers={"Content-Disposition": f'attachment; filename="nexus-puppy-export-{datetime.now().strftime("%Y-%m-%d")}.json"'},
    )


@app.get("/api/export/csv/weights")
def api_export_weights_csv():
    """Export weights as CSV."""
    weights = get_weights()
    lines = ["Fecha,Cachorro,Peso (g)"]
    for w in weights:
        puppy_name = w["puppy_id"]
        # Try to get name from puppies
        for p in get_puppies():
            if p["id"] == w["puppy_id"]:
                puppy_name = p["name"]
                break
        lines.append(f'{w["date"]},{puppy_name},{w["value"]}')
    csv_content = "\n".join(lines)
    return JSONResponse(
        content={"ok": True, "csv": csv_content},
    )


@app.get("/api/export/excel")
def api_export_excel():
    """Export all data as Excel file."""
    try:
        fd, path = tempfile.mkstemp(suffix=".xlsx")
        os.close(fd)
        export_excel(path)
        filename = f'nexus-puppy-flow-{datetime.now().strftime("%Y-%m-%d")}.xlsx'
        return FileResponse(
            path=path,
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating Excel: {str(e)}")


# ─── Run ───

if __name__ == "__main__":
    import uvicorn
    print("🐾 Nexus Puppy Flow API v2.0")
    print("📍 http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
