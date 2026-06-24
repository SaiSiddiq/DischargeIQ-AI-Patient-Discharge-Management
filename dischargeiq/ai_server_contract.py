# =========================================================================
# DischargeIQ - AI Engine FastAPI Server Contract
# Purpose: Mock model server displaying Pydantic schemas & ML endpoints
# Framework: FastAPI
# =========================================================================

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import time
import random

app = FastAPI(
    title="DischargeIQ AI Engine",
    description="Microservice exposing readmission risk classifiers and LLM clinical summary generators.",
    version="2.4.0"
)

# =========================================================================
# PYDANTIC INPUT/OUTPUT SCHEMAS
# =========================================================================

class VitalSign(BaseModel):
    metric: str = Field(..., example="Systolic Blood Pressure")
    value: float = Field(..., example=122.5)
    unit: str = Field(..., example="mmHg")
    status: str = Field(..., example="NORMAL") -- STABLE, ELEVATED, ABNORMAL

class PatientDossier(BaseModel):
    patient_id: str = Field(..., example="PT-2041")
    age: int = Field(..., ge=0, example=72)
    gender: str = Field(..., example="Male")
    diagnosis: str = Field(..., example="Heart Failure Exacerbation")
    admission_date: str = Field(..., example="2026-06-18")
    past_admissions_12m: int = Field(..., ge=0, example=3)
    vitals: List[VitalSign]
    medications: List[str] = Field(..., example=["Lisinopril 10mg", "Metoprolol 25mg"])
    lab_abnormalities_count: int = Field(..., ge=0, example=4)

class RiskPredictionResponse(BaseModel):
    patient_id: str
    risk_score: float = Field(..., description="Readmission probability percentage")
    risk_level: str = Field(..., description="LOW, MEDIUM, or HIGH risk classification")
    contributing_factors: List[str] = Field(..., description="Identified SHAP feature drivers")
    suggested_interventions: List[str] = Field(..., description="Targeted safety actions")
    inference_time_ms: float

class SummaryGenerationRequest(BaseModel):
    patient_id: str
    dossier: PatientDossier
    custom_instructions: Optional[str] = Field(None, example="Highlight low-sodium dietary guidelines.")

class SOAPSummaryResponse(BaseModel):
    patient_id: str
    overview: str = Field(..., description="Clinical history & timeline overview")
    diagnosis_and_procedures: str = Field(..., description="Final diagnoses and inpatient treatments")
    medications_reconciliation: str = Field(..., description="Reconciled medications schedule")
    followup_plan: str = Field(..., description="Outpatient follow-ups & warning instructions")
    llm_version: str
    tokens_consumed: int
    confidence_score: float

# =========================================================================
# ENDPOINTS
# =========================================================================

@app.post("/api/v1/predict-readmission", response_model=RiskPredictionResponse, tags=["Machine Learning"])
async def predict_readmission(dossier: PatientDossier):
    """
    Infers readmission probability using an ensemble random forest classifier (scikit-learn).
    Computes local feature contribution weights (SHAP values) to report causal factors.
    """
    start_time = time.time()
    
    # 1. Base ML Inference Simulation
    # Calculate score based on clinical coefficients
    base_probability = 15.0
    
    # Add weight for age
    if dossier.age > 70:
        base_probability += 15.5
    elif dossier.age > 50:
        base_probability += 8.0
        
    # Add weight for prior admissions (huge readmission risk driver)
    base_probability += (dossier.past_admissions_12m * 12.0)
    
    # Add weight for abnormal lab counts
    base_probability += (dossier.lab_abnormalities_count * 4.5)
    
    # Cap score at 98.5%
    risk_score = min(base_probability, 98.5)
    
    # Determine risk tier
    if risk_score >= 70.0:
        risk_level = "HIGH"
    elif risk_score >= 40.0:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
        
    # 2. Compute Causal SHAP Factors
    factors = []
    if dossier.past_admissions_12m >= 2:
        factors.append(f"Frequent re-hospitalization ({dossier.past_admissions_12m} in 12 months)")
    if dossier.age > 70:
        factors.append("Advanced patient age (>70 years)")
    if dossier.lab_abnormalities_count >= 3:
        factors.append(f"Lab instability ({dossier.lab_abnormalities_count} elevated biomarkers)")
    if len(dossier.medications) >= 4:
        factors.append("Polypharmacy risks (>=4 active prescriptions)")
        
    if not factors:
        factors.append("Baseline clinical parameters stable")
        
    # 3. Compile Tailored Interventions
    interventions = []
    if risk_level == "HIGH":
        interventions.append("Schedule 48-hour post-discharge telephone follow-up")
        interventions.append("Coordinate home health nurse safety visit")
        interventions.append("Review medications reconciliation with primary caregiver")
    elif risk_level == "MEDIUM":
        interventions.append("Confirm primary care provider appointment within 7 days")
        interventions.append("Provide patient-specific graphical education packets")
    else:
        interventions.append("Deliver standard discharge summary guidelines")
        
    inference_time = (time.time() - start_time) * 1000.0
    
    return RiskPredictionResponse(
        patient_id=dossier.patient_id,
        risk_score=round(risk_score, 1),
        risk_level=risk_level,
        contributing_factors=factors,
        suggested_interventions=interventions,
        inference_time_ms=round(inference_time, 2)
    )

@app.post("/api/v1/generate-summary", response_model=SOAPSummaryResponse, tags=["Generative LLM"])
async def generate_discharge_summary(request: SummaryGenerationRequest):
    """
    Leverages a fine-tuned clinical LLM to parse EHR logs and vital metrics
    into a structured SOAP-format Patient Discharge Summary.
    """
    d = request.dossier
    
    # Simulate LLM prompt compiling and generation latency
    # In production, this imports langchain or openai client.
    
    # Prompt Template (Mock context layout)
    prompt_template = f"""
    SYSTEM: You are a clinical document assistant. Compile a structured discharge summary.
    INPUT PATIENT DIAGNOSIS: {d.diagnosis}
    MEDICATIONS RECONCILIATION: {d.medications}
    ADDITIONAL INST: {request.custom_instructions or 'None'}
    """
    
    # Simulate API roundtrip latency
    time.sleep(0.4) 
    
    # Generate mock responses corresponding to patient diagnosis
    overview_text = f"Patient {d.patient_id}, a {d.age}-year-old {d.gender}, admitted for evaluation and treatment of {d.diagnosis}. Inpatient vitals successfully stabilized prior to final release."
    diagnosis_text = f"Primary Diagnosis: {d.diagnosis}.\nSecondary findings: Hyperlipidemia, hypertensive heart disease."
    
    meds_text = "Reconciliation complete. Prescribed outpatient medicines:\n" + "\n".join([f"- {med} PO Daily" for med in d.medications])
    
    followup_text = "1. Confirm outpatient physician checkups.\n2. Review red flag symptom guidelines (chest pain, shortness of breath).\n3. Follow custom instruction bounds."
    
    if "low-sodium" in (request.custom_instructions or "").lower():
        followup_text += "\n4. CRITICAL: Strictly restrict sodium to < 2000mg/day as ordered."

    return SOAPSummaryResponse(
        patient_id=d.patient_id,
        overview=overview_text,
        diagnosis_and_procedures=diagnosis_text,
        medications_reconciliation=meds_text,
        followup_plan=followup_text,
        llm_version="discharge-llama-70b-v2.4",
        tokens_consumed=1240,
        confidence_score=0.94
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
