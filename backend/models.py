"""
Nexus Puppy Flow — Pydantic Models
Request/Response schemas for the REST API.
"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class WeightAdd(BaseModel):
    puppy_id: str
    date: str
    value: float


class FeedingUpdate(BaseModel):
    date: str
    time_key: str
    block_a: bool = False
    block_b: bool = False


class MedicalToggle(BaseModel):
    event_id: str


class CustomEventAdd(BaseModel):
    title: str
    date: str
    type: str = "checkup"
    description: str = ""


class BlanquitaMealMark(BaseModel):
    date: str
    time_str: str
    portion: float = 0
    notes: str = ""


class ReminderUpdate(BaseModel):
    enabled: bool
    minutes_before: int = 5


class MigrationData(BaseModel):
    data: Dict[str, Any]


class ExportResponse(BaseModel):
    ok: bool
    file: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class StatsResponse(BaseModel):
    total_puppies: int
    total_weights: int
    total_feedings: int
    total_medical: int
    total_custom_events: int
    total_blanquita_meals: int
    db_size_kb: float
    migration_log: List[Dict[str, Any]]


class ApiResponse(BaseModel):
    ok: bool
    message: Optional[str] = None
    data: Optional[Any] = None
