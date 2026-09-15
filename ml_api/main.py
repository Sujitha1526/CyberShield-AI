from __future__ import annotations

import re
from pathlib import Path
from typing import List

import joblib
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="CyberShield ML API", version="1.0.0")

ML_DIR = Path(__file__).parent
MODEL_CANDIDATES = [
    ML_DIR / "model.pkl",
    ML_DIR / "model (1).pkl",
    ML_DIR.parent / "model.pkl",
    ML_DIR.parent / "model (1).pkl",
]
VECTORIZER_CANDIDATES = [
    ML_DIR / "vectorizer.pkl",
    ML_DIR / "vectorizer (1).pkl",
    ML_DIR.parent / "vectorizer.pkl",
    ML_DIR.parent / "vectorizer (1).pkl",
]

model = None
vectorizer = None

TOXIC_WORDS = {
    "idiot", "stupid", "worthless", "hate", "loser", "dumb", "trash", "ugly", "kill", "moron",
    "shut up", "fool", "pathetic", "nobody likes you", "useless", "retard", "bitch", "slut"
}


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1)


class PredictResponse(BaseModel):
    prediction: int
    confidence: float
    toxicity_score: float
    abusive_words: List[str]


def extract_abusive_words(text: str) -> List[str]:
    lowered = text.lower()
    found = []
    for phrase in TOXIC_WORDS:
        if phrase in lowered:
            found.append(phrase)
    return sorted(set(found))


def heuristic_predict(text: str) -> tuple[int, float, float, List[str]]:
    abusive_words = extract_abusive_words(text)
    exclamations = text.count("!")
    uppercase_ratio = (sum(1 for c in text if c.isupper()) / len(text)) if text else 0

    signal = len(abusive_words) * 0.22 + exclamations * 0.02 + uppercase_ratio * 0.4
    toxicity = float(np.clip(signal, 0, 1))

    prediction = 1 if toxicity >= 0.35 else 0
    confidence = float(np.clip(0.55 + toxicity * 0.4, 0.5, 0.99))

    return prediction, confidence, toxicity, abusive_words


def _pick_existing_path(candidates: List[Path]) -> Path | None:
    for path in candidates:
        if path.exists() and path.is_file():
            return path
    return None


@app.on_event("startup")
def load_artifacts() -> None:
    global model, vectorizer
    try:
        model_path = _pick_existing_path(MODEL_CANDIDATES)
        vectorizer_path = _pick_existing_path(VECTORIZER_CANDIDATES)

        if model_path and vectorizer_path:
            model = joblib.load(model_path)
            vectorizer = joblib.load(vectorizer_path)
            print(f"Loaded trained model: {model_path.name} | vectorizer: {vectorizer_path.name}")
        else:
            print("Model artifacts not found. Running with heuristic fallback.")
    except Exception as exc:
        model = None
        vectorizer = None
        print(f"Model loading failed, fallback enabled: {exc}")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model_loaded": bool(model and vectorizer)}


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest) -> PredictResponse:
    text = re.sub(r"\s+", " ", payload.text).strip()

    if model is not None and vectorizer is not None:
        try:
            x = vectorizer.transform([text])
            prediction = int(model.predict(x)[0])
            if hasattr(model, "predict_proba"):
                confidence = float(np.max(model.predict_proba(x)[0]))
            elif hasattr(model, "decision_function"):
                dist = float(model.decision_function(x)[0])
                prob = 1.0 / (1.0 + np.exp(-dist))
                confidence = float(prob if prediction == 1 else 1.0 - prob)
            else:
                confidence = 0.82
                
            abusive_words = extract_abusive_words(text)
            
            base_toxicity = confidence if prediction == 1 else 1.0 - confidence
            word_penalty = min(0.35, len(abusive_words) * 0.15)
            
            if prediction == 1:
                toxicity_score = float(np.clip(base_toxicity + word_penalty, 0.5, 0.99))
            else:
                toxicity_score = float(np.clip(base_toxicity + word_penalty, 0.0, 0.49))

            return PredictResponse(
                prediction=prediction,
                confidence=confidence,
                toxicity_score=toxicity_score,
                abusive_words=abusive_words,
            )
        except Exception:
            pass

    prediction, confidence, toxicity, abusive_words = heuristic_predict(text)
    return PredictResponse(
        prediction=prediction,
        confidence=confidence,
        toxicity_score=toxicity,
        abusive_words=abusive_words,
    )
