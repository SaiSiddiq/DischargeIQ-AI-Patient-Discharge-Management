/* ==========================================
   DischargeIQ - Application Logic & State
   ========================================== */

// 1. Upgraded Mock Database State with Sequential Workflow Stages
let patients = [
    {
        id: "PT-2041",
        name: "James T. Harrison",
        age: 72,
        gender: "Male",
        department: "Cardiology",
        diagnosis: "Congestive Heart Failure (CHF) Exacerbation",
        doctor: "Dr. Amit Sharma",
        admissionDate: "June 18, 2026",
        riskScore: 78,
        workflow_stage: "READY", // Stage 1
        history: "History of hypertension, Type 2 Diabetes, and previous coronary artery bypass graft (CABG) in 2021. Non-adherent with low-sodium diet guidelines.",
        medications: [
            "Furosemide 40mg PO Daily",
            "Lisinopril 10mg PO Daily",
            "Carvedilol 6.25mg PO Twice Daily",
            "Metformin 500mg PO Twice Daily"
        ],
        riskFactors: [
            "NT-proBNP > 4000 pg/ml at admission",
            "Advanced age (>70 years)",
            "High social vulnerability index (lives alone)",
            "3 hospitalizations in past 12 months"
        ],
        checklist: [
            { id: "vitals_stable", text: "Confirm inpatient vital stability (temp < 100.4F, stable MAP)", checked: false },
            { id: "nok_contact", text: "Verify next-of-kin transport and contact info", checked: false },
            { id: "chart_sign", text: "Inspect EHR clinical notes completion", checked: false }
        ],
        summary: {
            overview: "72-year-old male admitted with progressive dyspnea and peripheral edema secondary to Congestive Heart Failure exacerbation. Treated with IV diuretics resulting in net negative 4.2L fluid balance and resolution of orthopnea.",
            diagnosis: "Acute decompensated congestive heart failure (NYHA Class III), Essential hypertension, Type 2 diabetes mellitus.",
            meds: "1. Furosemide 40mg PO daily (Diuretic) - monitor weight daily.\n2. Lisinopril 10mg PO daily (ACE-inhibitor) - hold if systolic BP < 95.\n3. Carvedilol 6.25mg PO twice daily (Beta-blocker).\n4. Metformin 500mg PO twice daily with meals.",
            followup: "1. Cardiologist appointment scheduled for July 1st, 2026 at 10:00 AM with Dr. Sharma.\n2. Call clinic immediately if weight increases by >3 lbs in 24 hours or >5 lbs in 1 week.\n3. Restrict sodium intake to < 2000mg per day and fluid intake to < 1.5L per day."
        }
    },
    {
        id: "PT-1988",
        name: "Eleanor Vance",
        age: 64,
        gender: "Female",
        department: "Neurology",
        diagnosis: "Transient Ischemic Attack (TIA)",
        doctor: "Dr. Amit Sharma",
        admissionDate: "June 20, 2026",
        riskScore: 24,
        workflow_stage: "NURSE_REVIEW", // Stage 2
        history: "No prior neurological events. Mild hyperlipidemia. Active smoker (1/2 pack/day). Found to have 30% carotid stenosis on carotid duplex ultrasound.",
        medications: [
            "Aspirin 81mg PO Daily",
            "Atorvastatin 40mg PO Daily",
            "Amlodipine 5mg PO Daily"
        ],
        riskFactors: [
            "Active tobacco use",
            "Moderate carotid bifurcation stenosis"
        ],
        checklist: [
            { id: "vitals_stable", text: "Confirm inpatient vital stability (temp < 100.4F, stable MAP)", checked: true },
            { id: "nok_contact", text: "Verify next-of-kin transport and contact info", checked: true },
            { id: "chart_sign", text: "Inspect EHR clinical notes completion", checked: true }
        ],
        summary: {
            overview: "64-year-old female admitted following transient left-sided numbness and dysarthria lasting 25 minutes. Brain MRI was negative for acute infarction. Carotid duplex showed mild bilateral carotid stenosis.",
            diagnosis: "Transient ischemic attack (TIA), Tobacco use disorder, Hyperlipidemia.",
            meds: "1. Aspirin 81mg PO daily (Antiplatelet).\n2. Atorvastatin 40mg PO daily (HMG-CoA reductase inhibitor).\n3. Amlodipine 5mg PO daily (Calcium channel blocker).",
            followup: "1. Follow up with Stroke Prevention Clinic on July 8, 2026.\n2. Strict smoking cessation. Referral to quitline processed.\n3. Return to emergency department immediately if experiencing recurrent facial drooping, arm weakness, or speech difficulty."
        }
    },
    {
        id: "PT-2099",
        name: "Marcus Brody",
        age: 45,
        gender: "Male",
        department: "Orthopedics",
        diagnosis: "Left Tibia Fracture Post-Op Care",
        doctor: "Dr. Rachel Sen",
        admissionDate: "June 19, 2026",
        riskScore: 15,
        workflow_stage: "BILLING_CLEARANCE", // Stage 5
        history: "Closed left tibia-fibula fracture sustained in a bicycling accident. Underwent successful open reduction internal fixation (ORIF) on June 19th. No medical comorbidities.",
        medications: [
            "Oxycodone 5mg PO every 6 hours PRN pain",
            "Acetaminophen 650mg PO every 6 hours scheduled",
            "Enoxaparin 40mg SQ Daily"
        ],
        riskFactors: [
            "Temporary immobility",
            "Post-surgical pain management requirement"
        ],
        checklist: [
            { id: "vitals_stable", text: "Confirm inpatient vital stability", checked: true },
            { id: "nok_contact", text: "Verify next-of-kin transport and contact info", checked: true },
            { id: "chart_sign", text: "Inspect EHR clinical notes completion", checked: true }
        ],
        summary: {
            overview: "45-year-old active male admitted following left tibia fracture. Underwent ORIF without complications. Tolerating pain well on oral regimens. Ambulating safely with crutches, non-weight bearing on left leg.",
            diagnosis: "Closed fracture of left tibia, status post ORIF.",
            meds: "1. Oxycodone 5mg PO every 6 hours PRN for severe pain (dispensed 12 tablets).\n2. Acetaminophen 650mg PO every 6 hours scheduled.\n3. Enoxaparin 40mg SQ daily for DVT prophylaxis (continue for 10 days).",
            followup: "1. Follow up at Orthopedic Clinic on July 3, 2026 for suture removal.\n2. Strict non-weight bearing on the left lower extremity. Physical therapy to continue outpatient.\n3. Monitor incision site daily for signs of infection (increased redness, warmth, drainage)."
        }
    },
    {
        id: "PT-1732",
        name: "Sofia Rodriguez",
        age: 81,
        gender: "Female",
        department: "General Medicine",
        diagnosis: "Severe Community-Acquired Pneumonia",
        doctor: "Dr. Vikram Mehta",
        admissionDate: "June 15, 2026",
        riskScore: 82,
        workflow_stage: "AI_SUMMARY", // Stage 3
        history: "Severe COPD on 2L home O2, moderate dementia, chronic kidney disease (CKD Stage III). Admitted with septic shock secondary to lobar pneumonia, requiring ICU admission and vasopressor support initially.",
        medications: [
            "Levofloxacin 500mg PO Daily",
            "Prednisone 40mg PO Daily",
            "Tiotropium 18mcg Inhaler Daily"
        ],
        riskFactors: [
            "Chronic obstructive pulmonary disease dependency",
            "Moderate cognitive impairment (needs family caregiver)",
            "CKD stage III limiting antibiotic clearances",
            "Severe ICU stay during admission"
        ],
        checklist: [
            { id: "vitals_stable", text: "Confirm vital stability", checked: true },
            { id: "nok_contact", text: "Verify next-of-kin transport and contact info", checked: true },
            { id: "chart_sign", text: "Inspect EHR clinical notes completion", checked: true }
        ],
        summary: {
            overview: "81-year-old female with COPD and dementia admitted with severe community-acquired pneumonia and sepsis. Discharged in hemodynamically stable condition after completing course of IV antibiotics, transitioning to oral therapy. Oxygen requirements returned to baseline of 2L/min.",
            diagnosis: "Severe community-acquired pneumonia, COPD exacerbation, Sepsis resolved.",
            meds: "1. Levofloxacin 500mg PO daily (complete 3 more days, total 10-day course).\n2. Prednisone 40mg PO daily (finish remaining 2 days, then discontinue).\n3. Tiotropium 18mcg inhaler (1 puff daily).\n4. Donepezil 10mg PO daily.",
            followup: "1. Appointment scheduled with Primary Care Physician Dr. Mehta on June 29, 2026.\n2. Family caregiver to monitor O2 saturation via pulse oximetry. Alert clinic if SpO2 drops below 89%.\n3. Call clinic immediately for worsening shortness of breath, high fevers, or yellow/green sputum."
        }
    },
    {
        id: "PT-2155",
        name: "David Kim",
        age: 58,
        gender: "Male",
        department: "Cardiology",
        diagnosis: "Acute Coronary Syndrome (NSTEMI)",
        doctor: "Dr. Amit Sharma",
        admissionDate: "June 21, 2026",
        riskScore: 48,
        workflow_stage: "READY",
        history: "Hyperlipidemia, Obesity. Presented with substernal chest pressure. Coronary angiogram showed 80% stenosis of LAD, successfully treated with a drug-eluting stent. Echo shows ejection fraction of 52%.",
        medications: [
            "Clopidogrel 75mg PO Daily",
            "Aspirin 81mg PO Daily",
            "Metoprolol Succinate 25mg PO Daily",
            "Atorvastatin 80mg PO Daily"
        ],
        riskFactors: [
            "Recent percutaneous coronary intervention (PCI)",
            "Dual antiplatelet therapy (DAPT) bleed risk",
            "Newly diagnosed coronary artery disease"
        ],
        checklist: [
            { id: "vitals_stable", text: "Confirm vital stability", checked: false },
            { id: "nok_contact", text: "Verify next-of-kin transport and contact info", checked: false },
            { id: "chart_sign", text: "Inspect EHR clinical notes completion", checked: false }
        ],
        summary: {
            overview: "58-year-old male admitted with NSTEMI. Angiography revealed LAD stenosis, successfully stented with a drug-eluting stent. Tolerated procedure well. Post-stent course uncomplicated. Cardiac enzymes normalized.",
            diagnosis: "Non-ST elevation myocardial infarction (NSTEMI), Atherosclerotic heart disease, Hyperlipidemia.",
            meds: "1. Aspirin 81mg PO daily.\n2. Clopidogrel 75mg PO daily (DAPT - MUST continue for 12 months).\n3. Metoprolol Succinate 25mg PO daily.\n4. Atorvastatin 80mg PO daily.",
            followup: "1. Follow up with cardiologist on July 6, 2026.\n2. Refer to Cardiac Rehabilitation - program scheduled to start July 10.\n3. Return to ED immediately if chest pain recurs. Instructed on sublingual nitroglycerin use (take 1, if pain persists after 5 mins call 911)."
        }
    },
    {
        id: "PT-1999",
        name: "Theresa Gallagher",
        age: 69,
        gender: "Female",
        department: "General Medicine",
        diagnosis: "Cellulitis with Osteomyelitis Suspicion",
        doctor: "Dr. Vikram Mehta",
        admissionDate: "June 17, 2026",
        riskScore: 38,
        workflow_stage: "DISCHARGED", // Stage 7 (Final)
        history: "Chronic venous insufficiency, neuropathy, and poorly controlled peripheral arterial disease (PAD). Presented with severe redness and swelling of the right lower extremity.",
        medications: [
            "Cephalexin 500mg PO every 6 hours",
            "Gabapentin 300mg PO three times daily"
        ],
        riskFactors: [
            "Poor peripheral perfusion",
            "Diabetes-related sensory loss in feet"
        ],
        checklist: [
            { id: "vitals_stable", text: "Confirm vital stability", checked: true },
            { id: "nok_contact", text: "Verify next-of-kin transport and contact info", checked: true },
            { id: "chart_sign", text: "Inspect EHR clinical notes completion", checked: true }
        ],
        summary: {
            overview: "69-year-old female with history of peripheral neuropathy admitted with right lower leg cellulitis. Responded well to IV Cefazolin. MRI did not show evidence of osteomyelitis. Discharge on oral antibiotics to complete course.",
            diagnosis: "Right lower leg cellulitis, Peripheral vascular disease.",
            meds: "1. Cephalexin 500mg PO every 6 hours (complete 7-day course).\n2. Gabapentin 300mg PO three times daily.",
            followup: "1. Follow up with Wound Care Clinic on June 30, 2026.\n2. Elevate right leg above heart level when sitting.\n3. Contact clinic if skin redness expands or drainage increases."
        }
    }
];

let activities = [
    { type: "approve", text: "<strong>Dr. Sharma</strong> signed clinical summary for <strong>James T. Harrison (PT-2041)</strong>", time: "10:30 AM" },
    { type: "alert", text: "AI Risk engine predicted <strong>78% (High Risk)</strong> for <strong>James T. Harrison</strong>", time: "09:45 AM" },
    { type: "checklist", text: "<strong>Nurse Linda</strong> completed checklist for <strong>Eleanor Vance (PT-1988)</strong>", time: "08:15 AM" },
    { type: "summary", text: "Billing Clearance submitted for <strong>Marcus Brody (PT-2099)</strong>", time: "Yesterday" }
];

let notifications = [
    { id: 1, title: "Discharge Signed & Approved", desc: "Dr. Amit Sharma approved and signed off on the clinical summary for Marcus Brody (PT-2099).", time: "10:30 AM", type: "success", read: false },
    { id: 2, title: "Risk Level Recalculated", desc: "AI Engine predicted a 78% readmission probability for James Harrison (PT-2041) due to clinical stability metrics.", time: "09:45 AM", type: "danger", read: false }
];

let departments = [
    { name: "Cardiology", beds: 18, discharges: 42, threshold: "10%", status: "Active" },
    { name: "Neurology", beds: 12, discharges: 24, threshold: "12%", status: "Active" },
    { name: "Orthopedics", beds: 15, discharges: 35, threshold: "8%", status: "Active" },
    { name: "Pediatrics", beds: 8, discharges: 18, threshold: "5%", status: "Active" },
    { name: "General Medicine", beds: 30, discharges: 85, threshold: "15%", status: "Overloaded" }
];

let doctors = [
    { name: "Dr. Amit Sharma", role: "Chief Medical Officer", department: "Cardiology", discharges: 48 },
    { name: "Dr. Rachel Sen", role: "Attending Physician", department: "Orthopedics", discharges: 35 },
    { name: "Dr. Vikram Mehta", role: "Attending Physician", department: "General Medicine", discharges: 62 },
    { name: "Dr. Susan Carter", role: "Resident Doctor", department: "Neurology", discharges: 19 }
];

let auditLogs = [
    { time: "11:30:12", user: "Dr. Amit Sharma", action: "USER_LOGIN", details: "Logged in from IP 192.168.1.104" },
    { time: "11:02:45", user: "System Scheduler", action: "HL7_SYNC", details: "Successfully synchronized patient rosters with EHR systems" },
    { time: "10:30:11", user: "Dr. Amit Sharma", action: "DISCHARGE_SIGN_OFF", details: "Approved summary for PT-2099 (Marcus Brody)" },
    { time: "09:45:02", user: "AI_RISK_ENGINE", action: "RISK_INFERENCE", details: "Calculated risk score 78% for PT-2041" }
];

// 2. Global UI Application State
let currentUser = null;
let currentRole = "CMO";
let activeTab = "dashboard";
let selectedPatientId = "PT-2041";
let charts = {};

// Workflow Sequence mapping
const workflowStages = [
    { code: "READY", name: "Patient Ready", step: 1, role: "Nurse" },
    { code: "NURSE_REVIEW", name: "Nurse Review", step: 2, role: "Nurse" },
    { code: "AI_SUMMARY", name: "AI Summary Gen", step: 3, role: "AI Engine" },
    { code: "DOCTOR_APPROVAL", name: "Doctor Approval", step: 4, role: "Doctor" },
    { code: "BILLING_CLEARANCE", name: "Billing Clearance", step: 5, role: "Billing Admin" },
    { code: "PHARMACY_CLEARANCE", name: "Pharmacy Clearance", step: 6, role: "Pharmacist" },
    { code: "DISCHARGED", name: "Discharged", step: 7, role: "System" }
];

// 3. Application Lifecycle Functions
window.addEventListener("DOMContentLoaded", () => {
    const savedUser = sessionStorage.getItem("dischargeiq_user");
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById("loginOverlay").classList.remove("active");
        initApp();
    } else {
        document.getElementById("loginOverlay").classList.add("active");
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("currentDate").textContent = new Date().toLocaleDateString('en-US', options);

    const sidebarItems = document.querySelectorAll(".sidebar-item");
    sidebarItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const target = item.getAttribute("data-target");
            navigateToTab(target);
        });
    });
});

function fillDemoCredentials() {
    document.getElementById("loginEmail").value = "admin@dischargeiq.com";
    document.getElementById("loginPassword").value = "admin123";
}

function handleLogin() {
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPassword").value;
    const alertBox = document.getElementById("loginAlert");

    if (email === "admin@dischargeiq.com" && pass === "admin123") {
        currentUser = {
            name: "Dr. Amit Sharma",
            email: email,
            role: "Chief Medical Officer",
            avatar: "AS"
        };
        sessionStorage.setItem("dischargeiq_user", JSON.stringify(currentUser));
        alertBox.style.display = "none";
        document.getElementById("loginOverlay").classList.remove("active");
        
        addAuditLogEntry("USER_LOGIN", "Chief Medical Officer logged in via portal.");
        initApp();
    } else {
        alertBox.style.display = "block";
    }
}

function handleLogout() {
    sessionStorage.removeItem("dischargeiq_user");
    currentUser = null;
    document.getElementById("loginOverlay").classList.add("active");
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
    
    if (charts.trend) charts.trend.destroy();
    if (charts.dept) charts.dept.destroy();
    if (charts.riskDist) charts.riskDist.destroy();
    if (charts.monthlyReadmission) charts.monthlyReadmission.destroy();
    if (charts.drivers) charts.drivers.destroy();
    if (charts.modelImportance) charts.modelImportance.destroy();
    if (charts.modelDrift) charts.modelDrift.destroy();
    if (charts.modelDist) charts.modelDist.destroy();
    charts = {};
}

function navigateToTab(tabId) {
    activeTab = tabId;
    
    const views = document.querySelectorAll(".page-view");
    views.forEach(view => {
        if (view.id === tabId) {
            view.classList.add("active");
        } else {
            view.classList.remove("active");
        }
    });

    const sidebarItems = document.querySelectorAll(".sidebar-item");
    sidebarItems.forEach(item => {
        if (item.getAttribute("data-target") === tabId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    const headerTitleMap = {
        "dashboard": "Dashboard Overview",
        "patients": "Patient Roster & Discharges",
        "patientDetails": "Patient Clinical Profile",
        "summaries": "AI Discharge Summary Review",
        "analytics": "Readmission Analytics",
        "modelCenter": "AI Model Monitoring & Explainability Center",
        "notifications": "Notifications & Alerts Timeline",
        "settings": "Settings & Administrator Panel",
        "designSystem": "Design System Sandbox"
    };
    
    document.getElementById("pageTitle").textContent = headerTitleMap[tabId] || "DischargeIQ";

    if (tabId === "dashboard") {
        updateKPIs();
        renderDashboardTable();
        renderDashboardActivities();
        renderDashboardCharts();
    } else if (tabId === "patients") {
        renderPatientsList();
    } else if (tabId === "patientDetails") {
        if (selectedPatientId) {
            loadPatientDetails(selectedPatientId);
        }
    } else if (tabId === "summaries") {
        if (selectedPatientId) {
            loadSummaryForm(selectedPatientId);
        }
    } else if (tabId === "analytics") {
        renderAnalyticsCharts();
    } else if (tabId === "modelCenter") {
        renderModelCenter();
    } else if (tabId === "notifications") {
        renderNotificationsFeed();
    } else if (tabId === "settings") {
        renderSettingsTables();
        renderAuditLogs();
    }

    document.querySelector(".content-body").scrollTop = 0;
}

function initApp() {
    document.getElementById("userName").textContent = currentUser.name;
    document.getElementById("avatarName").textContent = currentUser.avatar;
    
    // Set global role selector initial state
    const roleSelector = document.getElementById("globalRoleSelector");
    if (roleSelector) roleSelector.value = "CMO";
    
    updateKPIs();
    renderDashboardTable();
    renderDashboardActivities();
    renderNotificationsFeed();
    renderDashboardCharts();
    
    addAuditLogEntry("APP_INIT", "App database modules initialized successfully.");
}

function updateKPIs() {
    const total = patients.length;
    const ready = patients.filter(p => p.workflow_stage === "READY" || p.workflow_stage === "NURSE_REVIEW").length;
    const pending = patients.filter(p => p.workflow_stage === "DOCTOR_APPROVAL" || p.workflow_stage === "AI_SUMMARY").length;
    const highRisk = patients.filter(p => p.riskScore >= 70).length;

    document.getElementById("kpiTotalPatients").textContent = total;
    document.getElementById("kpiReadyPatients").textContent = ready;
    document.getElementById("kpiPendingApproval").textContent = pending;
    document.getElementById("kpiHighRisk").textContent = highRisk;

    // Render Sparklines
    drawSparkline('sparklineTotal', [6, 7, 5, 8, 7, 9, total], '#2563EB');
    drawSparkline('sparklineReady', [2, 3, 1, 2, 4, 3, ready], '#10B981');
    drawSparkline('sparklinePending', [1, 2, 3, 2, 1, 2, pending], '#F59E0B');
    drawSparkline('sparklineRisk', [3, 2, 2, 1, 3, 2, highRisk], '#EF4444');

    // Fill AI Health Insights List (Epic style)
    renderAIInsightsList();

    // Fill Doctor Approval Queue
    renderDoctorApprovalQueue();

    // Fill Active Discharge Pipeline Stepper counts
    renderDischargePipelineStepper();

    // Fill Predictive Risk Heatmap
    renderRiskHeatmap();

    // Analytics overview cards
    const analyticsHigh = document.getElementById("analyticsHighRisk");
    const analyticsRiskVal = document.getElementById("analyticsAvgRisk");
    const analyticsAuditVal = document.getElementById("analyticsTotalAudits");
    
    if (analyticsHigh) analyticsHigh.textContent = highRisk;
    if (analyticsRiskVal) {
        const sum = patients.reduce((acc, curr) => acc + curr.riskScore, 0);
        analyticsRiskVal.textContent = Math.round(sum / total) + "%";
    }
    if (analyticsAuditVal) {
        analyticsAuditVal.textContent = auditLogs.length;
    }
}

// Sparkline drawing helper
function drawSparkline(canvasId, data, color) {
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) return;

    if (charts[canvasId]) charts[canvasId].destroy();

    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                data: data,
                borderColor: color,
                borderWidth: 1.5,
                fill: false,
                pointRadius: 0,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
}

// AI Insights Feed
function renderAIInsightsList() {
    const container = document.getElementById("aiInsightsList");
    if (!container) return;

    container.innerHTML = "";
    
    const highRiskPatients = patients.filter(p => p.riskScore >= 70 && p.workflow_stage !== "DISCHARGED");
    
    if (highRiskPatients.length === 0) {
        container.innerHTML = `
            <div style="font-size: 13px; color: var(--text-secondary); text-align: center; padding: 20px 0;">
                ✓ 0 Critical readmission alarms active.
            </div>
        `;
        return;
    }

    highRiskPatients.forEach(p => {
        const item = document.createElement("div");
        item.className = "ai-insight-alert-item";
        item.innerHTML = `
            <div class="ai-insight-alert-header">
                <strong>${p.name}</strong>
                <span style="color: var(--danger); font-weight:700;">${p.riskScore}% Risk</span>
            </div>
            <div style="font-size:11px; color: var(--text-secondary); margin-top:4px;">
                • Follow-up Care Coordination recommended.<br>
                • Cardiology / Specialist clinic review suggested.
            </div>
            <button class="btn btn-secondary btn-sm" onclick="selectAndShowDetails('${p.id}')" style="width:100%; margin-top:8px; font-size:11px; padding:4px;">Review Prediction</button>
        `;
        container.appendChild(item);
    });
}

// Doctor Approval Queue
function renderDoctorApprovalQueue() {
    const container = document.getElementById("doctorApprovalQueue");
    const countLabel = document.getElementById("queueCount");
    if (!container) return;

    container.innerHTML = "";

    const queue = patients.filter(p => p.workflow_stage === "NURSE_REVIEW" || p.workflow_stage === "DOCTOR_APPROVAL" || p.workflow_stage === "AI_SUMMARY");
    
    if (countLabel) countLabel.textContent = `${queue.length} pending`;

    if (queue.length === 0) {
        container.innerHTML = `
            <div style="font-size: 13px; color: var(--text-secondary); text-align: center; padding: 20px 0;">
                ✓ No pending discharge sign-offs.
            </div>
        `;
        return;
    }

    queue.forEach(p => {
        const item = document.createElement("div");
        item.className = "approval-queue-item";
        item.innerHTML = `
            <div class="queue-patient-info">
                <span class="queue-patient-name">${p.name}</span>
                <span class="queue-patient-dept">${p.department} | ${p.id}</span>
            </div>
            <button class="btn btn-primary btn-sm" onclick="selectApprovalFromQueue('${p.id}')">
                ${p.workflow_stage === "NURSE_REVIEW" ? "Compile" : "Review"}
            </button>
        `;
        container.appendChild(item);
    });
}

function selectApprovalFromQueue(patientId) {
    selectedPatientId = patientId;
    const p = patients.find(pat => pat.id === patientId);
    if (!p) return;

    if (p.workflow_stage === "NURSE_REVIEW") {
        navigateToTab("patientDetails");
    } else {
        navigateToTab("summaries");
    }
}

// Discharge Pipeline Stepper counts
function renderDischargePipelineStepper() {
    const container = document.getElementById("pipelineStepper");
    if (!container) return;

    container.innerHTML = "";

    const counts = {
        READY: patients.filter(p => p.workflow_stage === "READY").length,
        NURSE: patients.filter(p => p.workflow_stage === "NURSE_REVIEW").length,
        DOC: patients.filter(p => p.workflow_stage === "AI_SUMMARY" || p.workflow_stage === "DOCTOR_APPROVAL").length,
        BILL: patients.filter(p => p.workflow_stage === "BILLING_CLEARANCE").length,
        PHARM: patients.filter(p => p.workflow_stage === "PHARMACY_CLEARANCE").length,
        DONE: patients.filter(p => p.workflow_stage === "DISCHARGED").length
    };

    const pipelineSteps = [
        { name: "Ready", count: counts.READY, color: "#3B82F6" },
        { name: "Nurse Rev", count: counts.NURSE, color: "#F59E0B" },
        { name: "Doc Appr", count: counts.DOC, color: "#8B5CF6" },
        { name: "Billing", count: counts.BILL, color: "#EC4899" },
        { name: "Pharmacy", count: counts.PHARM, color: "#10B981" },
        { name: "Discharged", count: counts.DONE, color: "#64748B" }
    ];

    pipelineSteps.forEach(step => {
        const node = document.createElement("div");
        node.className = "pipeline-step-node";
        node.style.borderTop = `4px solid ${step.color}`;
        node.innerHTML = `
            <span class="pipeline-step-val">${step.count}</span>
            <span class="pipeline-step-name">${step.name}</span>
        `;
        container.appendChild(node);
    });
}

// Patient Risk Heatmap
function renderRiskHeatmap() {
    const tbody = document.querySelector("#riskHeatmap tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const heatmapList = [...patients]
        .filter(p => p.workflow_stage !== "DISCHARGED")
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5);

    heatmapList.forEach(p => {
        const dotColorClass = p.riskScore >= 70 ? "dot-red" : p.riskScore >= 40 ? "dot-yellow" : "dot-green";
        const tr = document.createElement("tr");
        tr.style.cursor = "pointer";
        tr.onclick = () => selectAndShowDetails(p.id);
        tr.innerHTML = `
            <td style="font-weight: 500;">${p.name}</td>
            <td style="color: var(--text-secondary);">${p.department}</td>
            <td style="text-align: right; padding-right:16px; font-weight:700;">
                <span class="pulsing-dot ${dotColorClass}"></span>
                ${p.riskScore}%
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Modal Actions for Registering New Patients
function openNewPatientModal() {
    document.getElementById("newPatientModal").classList.add("active");
}

function closeNewPatientModal() {
    document.getElementById("newPatientModal").classList.remove("active");
    document.getElementById("newPatientForm").reset();
}

function submitNewPatient() {
    const name = document.getElementById("newPatName").value;
    const age = parseInt(document.getElementById("newPatAge").value);
    const gender = document.getElementById("newPatGender").value;
    const dept = document.getElementById("newPatDept").value;
    const diagnosis = document.getElementById("newPatDiag").value;

    const id = `PT-${Math.floor(Math.random() * 9000) + 1000}`;
    const risk = Math.floor(Math.random() * 65) + 15; // 15% to 80%

    const newPat = {
        id: id,
        name: name,
        age: age,
        gender: gender,
        department: dept,
        diagnosis: diagnosis,
        doctor: "Dr. Amit Sharma",
        admissionDate: new Date().toISOString().split('T')[0],
        riskScore: risk,
        workflow_stage: "READY",
        history: "No critical previous medical events recorded. Newly admitted patient.",
        medications: ["Acetaminophen 500mg PO PRN"],
        riskFactors: ["Newly registered profile baseline indicators"],
        checklist: [
            { id: "vitals_stable", text: "Confirm vital stability", checked: false },
            { id: "nok_contact", text: "Verify next-of-kin transport", checked: false },
            { id: "chart_sign", text: "Inspect EHR clinical notes", checked: false }
        ],
        summary: {
            overview: `Patient ${name} registered on active census. Clinical status stable.`,
            diagnosis: diagnosis,
            meds: "Acetaminophen outpatient care plan.",
            followup: "Follow up with primary care clinic."
        }
    };

    patients.unshift(newPat);

    addAuditLogEntry("PATIENT_REGISTRATION", `Registered new inpatient ${id} (${name}) under ${dept} department.`);
    alert(`Successfully registered Inpatient ${name}! Patient assigned ID: ${id}. Initial AI Readmission risk: ${risk}%`);
    closeNewPatientModal();

    updateKPIs();
    renderDashboardTable();
    renderPatientsList();
}

function getWorkflowBadge(stageCode) {
    const stageMap = {
        "READY": "badge-review",
        "NURSE_REVIEW": "badge-pending",
        "AI_SUMMARY": "badge-review",
        "DOCTOR_APPROVAL": "badge-pending",
        "BILLING_CLEARANCE": "badge-pending",
        "PHARMACY_CLEARANCE": "badge-approved",
        "DISCHARGED": "badge-discharged"
    };
    
    const labelMap = {
        "READY": "Patient Ready",
        "NURSE_REVIEW": "Nurse Review",
        "AI_SUMMARY": "AI summary gen",
        "DOCTOR_APPROVAL": "Doctor Approval",
        "BILLING_CLEARANCE": "Billing clearance",
        "PHARMACY_CLEARANCE": "Pharmacy clearance",
        "DISCHARGED": "Discharged"
    };

    return `<span class="badge ${stageMap[stageCode] || 'badge-review'}">${labelMap[stageCode] || stageCode}</span>`;
}

function renderDashboardTable() {
    const tbody = document.querySelector("#dashboardPatientsTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    const priorityPatients = [...patients]
        .filter(p => p.workflow_stage !== "DISCHARGED")
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 4);

    priorityPatients.forEach(p => {
        const riskClass = p.riskScore >= 70 ? "risk-high" : p.riskScore >= 40 ? "risk-medium" : "risk-low";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${p.id}</strong></td>
            <td>${p.name}</td>
            <td>${p.department}</td>
            <td>
                <div class="progress-bar-container">
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill ${riskClass}" style="width: ${p.riskScore}%; background-color: var(${riskClass === 'risk-high' ? '--danger' : riskClass === 'risk-medium' ? '--warning' : '--success'})"></div>
                    </div>
                    <span class="progress-val">${p.riskScore}%</span>
                </div>
            </td>
            <td>${getWorkflowBadge(p.workflow_stage)}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="selectAndShowDetails('${p.id}')">View</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderDashboardActivities() {
    // Activities rendering is handled by specific widgets now
}

function renderDashboardCharts() {
    const trendCtx = document.getElementById('trendChart')?.getContext('2d');
    if (trendCtx) {
        if (charts.trend) charts.trend.destroy();
        charts.trend = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Jun 18', 'Jun 19', 'Jun 20', 'Jun 21', 'Jun 22', 'Jun 23', 'Jun 24'],
                datasets: [
                    {
                        label: 'Successful Discharges',
                        data: [12, 19, 15, 8, 14, 21, 16],
                        borderColor: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.35
                    },
                    {
                        label: 'Readmission Alarms',
                        data: [2, 4, 3, 1, 5, 2, 3],
                        borderColor: '#EF4444',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 12, font: { family: 'Inter', size: 11 } }
                    }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    const forecastCtx = document.getElementById('predictedReadmissionsChart')?.getContext('2d');
    if (forecastCtx) {
        if (charts.forecast) charts.forecast.destroy();
        charts.forecast = new Chart(forecastCtx, {
            type: 'bar',
            data: {
                labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Gen Medicine'],
                datasets: [{
                    label: 'Predicted Readmissions',
                    data: [12, 8, 3, 1, 15],
                    backgroundColor: ['#2563EB', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444'],
                    borderRadius: 4,
                    barThickness: 32
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { stepSize: 3 } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

function renderPatientsList() {
    const tbody = document.querySelector("#patientsListTable tbody");
    tbody.innerHTML = "";

    const query = document.getElementById("patientSearch").value.toLowerCase();
    const dept = document.getElementById("filterDept").value;
    const risk = document.getElementById("filterRisk").value;
    const status = document.getElementById("filterStatus").value;

    const filtered = patients.filter(p => {
        const matchQuery = p.name.toLowerCase().includes(query) || 
                           p.id.toLowerCase().includes(query) || 
                           p.diagnosis.toLowerCase().includes(query);
        const matchDept = dept === "All" || p.department === dept;
        let matchRisk = true;
        if (risk === "High") matchRisk = p.riskScore >= 70;
        else if (risk === "Medium") matchRisk = p.riskScore >= 40 && p.riskScore < 70;
        else if (risk === "Low") matchRisk = p.riskScore < 40;

        let matchStatus = true;
        if (status !== "All") {
            if (status === "Pending") matchStatus = p.workflow_stage === "READY" || p.workflow_stage === "NURSE_REVIEW";
            else if (status === "Review") matchStatus = p.workflow_stage === "AI_SUMMARY" || p.workflow_stage === "DOCTOR_APPROVAL";
            else if (status === "Approved") matchStatus = p.workflow_stage === "BILLING_CLEARANCE" || p.workflow_stage === "PHARMACY_CLEARANCE";
            else if (status === "Discharged") matchStatus = p.workflow_stage === "DISCHARGED";
        }

        return matchQuery && matchDept && matchRisk && matchStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 40px 0;">No patients found matching the criteria.</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        const riskClass = p.riskScore >= 70 ? "risk-high" : p.riskScore >= 40 ? "risk-medium" : "risk-low";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${p.id}</strong></td>
            <td>
                <div style="font-weight: 600;">${p.name}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${p.gender}, ${p.age} yrs</div>
            </td>
            <td>${p.age}</td>
            <td>${p.department}</td>
            <td>
                <div class="progress-bar-container">
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill ${riskClass}" style="width: ${p.riskScore}%; background-color: var(${riskClass === 'risk-high' ? '--danger' : riskClass === 'risk-medium' ? '--warning' : '--success'})"></div>
                    </div>
                    <span class="progress-val">${p.riskScore}%</span>
                </div>
            </td>
            <td>${getWorkflowBadge(p.workflow_stage)}</td>
            <td style="text-align: right; padding-right: 24px;">
                <div style="display: flex; gap: 6px; justify-content: flex-end;">
                    <button class="btn btn-secondary btn-sm" onclick="selectAndShowDetails('${p.id}')">View Details</button>
                    ${p.workflow_stage === "NURSE_REVIEW" ? 
                        `<button class="btn btn-primary btn-sm" onclick="triggerAISummaryGeneration('${p.id}')">⚡ AI Summary</button>` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterPatients() {
    renderPatientsList();
}

// Upgraded Patient Details View showing the sequential clinical pathways
function loadPatientDetails(patientId) {
    const p = patients.find(pat => pat.id === patientId);
    if (!p) return;

    selectedPatientId = patientId;

    document.getElementById("detailsAvatar").textContent = p.name.split(' ').map(n => n[0]).join('');
    document.getElementById("detailsName").textContent = p.name;
    document.getElementById("detailsId").textContent = p.id;
    document.getElementById("detailsAgeSex").textContent = `${p.age} / ${p.gender}`;
    document.getElementById("detailsDept").textContent = p.department;
    document.getElementById("detailsDiagnosis").textContent = p.diagnosis;
    document.getElementById("detailsDoctor").textContent = p.doctor;
    document.getElementById("detailsHistory").textContent = p.history;

    const badge = document.getElementById("detailsStatusBadge");
    badge.outerHTML = `<span class="badge" id="detailsStatusBadge">${getWorkflowBadge(p.workflow_stage)}</span>`;

    // Load Medications List
    const medUl = document.getElementById("detailsMedications");
    medUl.innerHTML = "";
    p.medications.forEach(med => {
        const li = document.createElement("li");
        li.className = "med-pill";
        li.textContent = med;
        medUl.appendChild(li);
    });

    // Load AI Prediction card values
    const scoreVal = document.getElementById("detailsRiskScore");
    const levelVal = document.getElementById("detailsRiskLevel");
    scoreVal.textContent = `${p.riskScore}%`;
    levelVal.textContent = p.riskScore >= 70 ? "High Risk" : p.riskScore >= 40 ? "Medium Risk" : "Low Risk";
    levelVal.className = `ai-risk-level ${p.riskScore >= 70 ? 'high' : p.riskScore >= 40 ? 'medium' : 'low'}`;

    // Load risk factors list
    const factorUl = document.getElementById("detailsRiskFactors");
    factorUl.innerHTML = "";
    p.riskFactors.forEach(fact => {
        const li = document.createElement("li");
        li.className = "factor-item";
        li.innerHTML = `<span class="factor-bullet">■</span> <span>${fact}</span>`;
        factorUl.appendChild(li);
    });

    // Generate Visual Pathway Steps Column (Vertical Timeline)
    renderVerticalWorkflowTracker(p);

    // Generate SHAP local feature attribution bars
    renderShapattribution(p);

    // Generate AI recommendations
    renderAIRecommendations(p);

    // Render Checklist & Actions depending on current Workflow Stage
    renderWorkflowActionsPanel(p);
}

function renderVisualWorkflowTracker(p) {
    const trackerContainer = document.querySelector(".workflow-steps");
    if (!trackerContainer) return;

    trackerContainer.innerHTML = "";
    
    // Find current step index
    const currentStep = workflowStages.find(s => s.code === p.workflow_stage);
    const activeStepNum = currentStep ? currentStep.step : 1;

    workflowStages.forEach((stage, idx) => {
        const stepDiv = document.createElement("div");
        stepDiv.style.display = "flex";
        stepDiv.style.flexDirection = "column";
        stepDiv.style.alignItems = "center";
        stepDiv.style.position = "relative";
        stepDiv.style.flex = "1";
        stepDiv.style.minWidth = "80px";

        const isCompleted = stage.step < activeStepNum;
        const isActive = stage.step === activeStepNum;

        let iconColor = "var(--text-muted)";
        let borderClass = "1px solid var(--border)";
        let bgStyle = "#FFFFFF";

        if (isCompleted) {
            iconColor = "var(--success)";
            bgStyle = "var(--success-light)";
        } else if (isActive) {
            iconColor = "var(--primary)";
            bgStyle = "var(--primary-light)";
        }

        stepDiv.innerHTML = `
            <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${bgStyle}; border: 1.5px solid ${iconColor}; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color: ${iconColor}; margin-bottom: 6px;">
                ${isCompleted ? '✓' : stage.step}
            </div>
            <span style="font-size: 11px; font-weight: ${isActive ? '600' : '500'}; color: ${isActive ? 'var(--text-primary)' : 'var(--text-secondary)'}; text-align: center; white-space: nowrap;">
                ${stage.name}
            </span>
        `;
        trackerContainer.appendChild(stepDiv);
    });
}

function renderWorkflowActionsPanel(p) {
    const checkContainer = document.getElementById("detailsChecklist");
    const progressLabel = document.getElementById("detailsChecklistProgress");
    const headerBtn = document.getElementById("detailsGenerateSummaryBtn");
    
    checkContainer.innerHTML = "";

    // 1. Stage: READY (Nurse Review Checklist)
    if (p.workflow_stage === "READY") {
        progressLabel.style.display = "inline";
        headerBtn.style.display = "none";
        
        const checkedCount = p.checklist.filter(c => c.checked).length;
        progressLabel.textContent = `${checkedCount}/${p.checklist.length}`;

        p.checklist.forEach(item => {
            const div = document.createElement("div");
            div.className = "rec-item";
            div.innerHTML = `
                <input type="checkbox" class="rec-checkbox" id="check-${item.id}" ${item.checked ? 'checked' : ''} onchange="toggleWorkflowChecklistItem('${p.id}', '${item.id}', this.checked)">
                <label class="rec-label" for="check-${item.id}">${item.text}</label>
            `;
            checkContainer.appendChild(div);
        });

        // Add action button under list
        const actionBtn = document.createElement("button");
        actionBtn.className = "btn btn-primary";
        actionBtn.style.width = "100%";
        actionBtn.style.marginTop = "12px";
        actionBtn.textContent = "Submit Nurse Review Clearance";
        actionBtn.disabled = checkedCount < p.checklist.length;
        actionBtn.onclick = () => {
            advancePatientWorkflow(p.id, "NURSE_REVIEW");
        };
        checkContainer.appendChild(actionBtn);

    // 2. Stage: NURSE_REVIEW (Ready for AI generation)
    } else if (p.workflow_stage === "NURSE_REVIEW") {
        progressLabel.style.display = "none";
        headerBtn.style.display = "block";
        headerBtn.onclick = () => triggerAISummaryGeneration(p.id);

        checkContainer.innerHTML = `
            <div style="text-align: center; padding: 10px 0;">
                <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px;">
                    Nurse clearance checklist is fully verified. Click below to request AI engine summary compilation.
                </p>
                <button class="btn btn-primary" onclick="triggerAISummaryGeneration('${p.id}')" style="width: 100%;">
                    ⚡ Compile AI SOAP Summary
                </button>
            </div>
        `;

    // 3. Stage: AI_SUMMARY (Summary generated, awaiting Doctor signature)
    } else if (p.workflow_stage === "AI_SUMMARY" || p.workflow_stage === "DOCTOR_APPROVAL") {
        progressLabel.style.display = "none";
        headerBtn.style.display = "none";

        checkContainer.innerHTML = `
            <div style="text-align: center; padding: 10px 0;">
                <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px;">
                    AI Summary has been compiled. Dr. Sharma must review, modify if needed, and sign off the document.
                </p>
                <button class="btn btn-primary" onclick="navigateToTab('summaries')" style="width: 100%;">
                    ✍️ Open SOAP Summary Editor
                </button>
            </div>
        `;

    // 4. Stage: BILLING_CLEARANCE (Awaiting Finance Approval)
    } else if (p.workflow_stage === "BILLING_CLEARANCE") {
        progressLabel.style.display = "none";
        headerBtn.style.display = "none";

        checkContainer.innerHTML = `
            <div style="padding: 10px 0;">
                <h4 style="font-size: 13px; font-weight:600; margin-bottom: 10px;">Billing Clearance Card</h4>
                <div style="font-size:12px; color: var(--text-secondary); display:flex; flex-direction:column; gap:6px; margin-bottom: 16px; background:#ffffff; border:1px solid var(--border); padding:10px; border-radius:4px;">
                    <div>• <strong>Insurance</strong>: Blue Shield PPO</div>
                    <div>• <strong>Co-Pay / Deductible</strong>: $150.00</div>
                    <div>• <strong>Pre-Auth Token</strong>: Auth_998242A</div>
                    <div style="color:var(--warning); font-weight:600;">• Status: Awaiting Financial Clearance</div>
                </div>
                <button class="btn btn-primary" onclick="advancePatientWorkflow('${p.id}', 'PHARMACY_CLEARANCE')" style="width: 100%;">
                    💰 Submit Billing & Insurance Clearance
                </button>
            </div>
        `;

    // 5. Stage: PHARMACY_CLEARANCE (Awaiting Outpatient Med dispenser clearance)
    } else if (p.workflow_stage === "PHARMACY_CLEARANCE") {
        progressLabel.style.display = "none";
        headerBtn.style.display = "none";

        checkContainer.innerHTML = `
            <div style="padding: 10px 0;">
                <h4 style="font-size: 13px; font-weight:600; margin-bottom: 10px;">Pharmacy Clearance Card</h4>
                <div style="font-size:12px; color: var(--text-secondary); display:flex; flex-direction:column; gap:6px; margin-bottom: 16px; background:#ffffff; border:1px solid var(--border); padding:10px; border-radius:4px;">
                    <div>• <strong>Discharge Prescriptions</strong>:</div>
                    <div style="padding-left:10px;">${p.medications.map(m => `- ${m}`).join('<br>')}</div>
                    <div style="color:var(--warning); font-weight:600;">• Status: Awaiting Med Dispensation Release</div>
                </div>
                <button class="btn btn-primary" onclick="advancePatientWorkflow('${p.id}', 'DISCHARGED')" style="width: 100%;">
                    💊 Dispense Meds & Finalize Discharge
                </button>
            </div>
        `;

    // 6. Stage: DISCHARGED (Final Release Complete)
    } else if (p.workflow_stage === "DISCHARGED") {
        progressLabel.style.display = "none";
        headerBtn.style.display = "none";

        checkContainer.innerHTML = `
            <div style="text-align: center; padding: 10px 0;">
                <div style="font-size: 28px; margin-bottom:8px;">🎉</div>
                <h4 style="font-size: 14px; font-weight:600; color:var(--success); margin-bottom: 8px;">Discharge Process Completed</h4>
                <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 14px;">
                    Patient was cleared on all nurse checks, clinician approvals, finance tokens, and pharmacy releases.
                </p>
                <button class="btn btn-outline" onclick="downloadSummaryPDF()" style="width: 100%;">
                    📥 Download Clinical Summary PDF
                </button>
            </div>
        `;
    }
}

function toggleWorkflowChecklistItem(patientId, itemId, checked) {
    const p = patients.find(pat => pat.id === patientId);
    if (!p) return;

    const item = p.checklist.find(i => i.id === itemId);
    if (item) {
        item.checked = checked;
        addAuditLogEntry("NURSE_CHECKLIST_UPDATE", `Toggled checklist item [${itemId}] to ${checked} for patient ${p.id}`);
        
        // Refresh details layout
        loadPatientDetails(p.id);
    }
}

function advancePatientWorkflow(patientId, nextStageCode) {
    const p = patients.find(pat => pat.id === patientId);
    if (!p) return;

    p.workflow_stage = nextStageCode;
    
    // Add logs
    addAuditLogEntry("WORKFLOW_STAGE_ADVANCE", `Patient ${p.id} workflow advanced to [${nextStageCode}]`);

    // Add activities
    let actionText = "";
    if (nextStageCode === "NURSE_REVIEW") {
        actionText = `<strong>Nurse Linda</strong> approved clinical checklists for <strong>${p.name}</strong>`;
        activities.unshift({ type: "checklist", text: actionText, time: "Just now" });
    } else if (nextStageCode === "PHARMACY_CLEARANCE") {
        actionText = `<strong>Billing Admin</strong> cleared insurance deductibles for <strong>${p.name}</strong>`;
        activities.unshift({ type: "approve", text: actionText, time: "Just now" });
    } else if (nextStageCode === "DISCHARGED") {
        actionText = `<strong>Pharmacist</strong> dispensed discharge meds. <strong>${p.name}</strong> is fully discharged.`;
        activities.unshift({ type: "approve", text: actionText, time: "Just now" });
        
        notifications.unshift({
            id: Date.now(),
            title: "Patient Fully Discharged",
            desc: `Clinical course closed. James Harrison (PT-2041) cleared and discharged.`,
            time: "Just now",
            type: "success",
            read: false
        });
    }

    // Refresh layout
    loadPatientDetails(p.id);
    updateKPIs();
}

// AI Discharge Summary Panel
function triggerAISummaryGeneration(patientId) {
    selectedPatientId = patientId;
    const p = patients.find(pat => pat.id === patientId);
    if (!p) return;

    // Trigger visual loading indicator to wow the user (Resume effect)
    const btn = document.getElementById("detailsGenerateSummaryBtn");
    btn.innerHTML = `<span style="display:inline-block; animation:spin 1s linear infinite;">🔄</span> Generating...`;
    btn.disabled = true;

    setTimeout(() => {
        // Shift stage to AI summary generated
        p.workflow_stage = "DOCTOR_APPROVAL";
        
        addAuditLogEntry("AI_SUMMARY_GEN", `Generated clinical summary for ${p.id} (${p.name})`);
        
        activities.unshift({
            type: "summary",
            text: `AI summary draft generated for <strong>${p.name} (${p.id})</strong>`,
            time: "Just now"
        });

        notifications.unshift({
            id: Date.now(),
            title: "Summary Completed",
            desc: `AI finished generating the clinical SOAP discharge summary document for ${p.name}. Ready for signatures.`,
            time: "Just now",
            type: "info",
            read: false
        });

        navigateToTab("summaries");
        btn.innerHTML = "⚡ Generate AI Summary";
        btn.disabled = false;

    }, 800);
}

function loadSummaryForm(patientId) {
    const p = patients.find(pat => pat.id === patientId);
    if (!p) return;

    document.getElementById("summaryPatientName").textContent = p.name;
    document.getElementById("summaryPatientMeta").textContent = `${p.gender}, ${p.age} years old | Primary Diagnosis: ${p.diagnosis}`;
    
    const statusB = document.getElementById("summaryStatus");
    statusB.className = `badge badge-pending`;
    statusB.textContent = "Awaiting Signature";

    // Load fields
    document.getElementById("sumOverview").value = p.summary.overview;
    document.getElementById("sumDiagnosis").value = p.summary.diagnosis;
    document.getElementById("sumMeds").value = p.summary.meds;
    document.getElementById("sumFollowup").value = p.summary.followup;

    // Load meta
    const confidencePct = 100 - Math.round(p.riskScore / 5);
    document.getElementById("metadataConfidence").textContent = `${confidencePct}%`;
    const bar = document.getElementById("metadataConfidenceBar");
    if (bar) {
        bar.style.width = `${confidencePct}%`;
        if (confidencePct >= 85) {
            bar.style.backgroundColor = "var(--success)";
        } else if (confidencePct >= 70) {
            bar.style.backgroundColor = "var(--warning)";
        } else {
            bar.style.backgroundColor = "var(--danger)";
        }
    }
    document.getElementById("metadataTime").textContent = "June 24, 2026 11:34 AM";
    document.getElementById("metadataDoctor").textContent = p.doctor;
}

function approveDischargeSummary() {
    const p = patients.find(pat => pat.id === selectedPatientId);
    if (!p) return;

    p.summary.overview = document.getElementById("sumOverview").value;
    p.summary.diagnosis = document.getElementById("sumDiagnosis").value;
    p.summary.meds = document.getElementById("sumMeds").value;
    p.summary.followup = document.getElementById("sumFollowup").value;

    // Doctor signature advances stage to Billing clearance
    p.workflow_stage = "BILLING_CLEARANCE";
    
    activities.unshift({
        type: "approve",
        text: `<strong>Dr. Sharma</strong> approved and signed off discharge for <strong>${p.name} (${p.id})</strong>`,
        time: "Just now"
    });

    addAuditLogEntry("DISCHARGE_SIGN_OFF", `Approved summary and signed discharge certificate for ${p.id} (${p.name})`);

    notifications.unshift({
        id: Date.now(),
        title: "Discharge Signed & Approved",
        desc: `Dr. Amit Sharma signed clinical release code for ${p.name} (${p.id}). Discharge order sent to billing workspace.`,
        time: "Just now",
        type: "success",
        read: false
    });

    alert(`Discharge successfully approved! Patient ${p.name} (${p.id}) has been updated to Billing Clearance stage.`);
    navigateToTab("dashboard");
}

function rejectDischargeSummary() {
    const p = patients.find(pat => pat.id === selectedPatientId);
    if (!p) return;

    p.workflow_stage = "READY";
    addAuditLogEntry("DISCHARGE_REJECTED", `Discharge request rejected by CMO for ${p.id} (${p.name})`);

    activities.unshift({
        type: "alert",
        text: `<strong>Dr. Sharma</strong> returned discharge request for <strong>${p.name}</strong> to nurse checklists`,
        time: "Just now"
    });

    alert(`Discharge request rejected. Patient status returned to Nurse checklists.`);
    navigateToTab("patients");
}

function requestCorrection() {
    alert("Simulation: Direct clinical message dispatched to attending physician requesting dosage check.");
    addAuditLogEntry("CLARIFICATION_REQUEST", `Clarification request sent for patient ${selectedPatientId}`);
}

function downloadSummaryPDF() {
    alert("PDF Generator: Compiling HL7 CCDA schemas... Summary downloaded successfully as DischargeIQ_Summary_" + selectedPatientId + ".pdf");
}

function renderAnalyticsCharts() {
    const riskCtx = document.getElementById('riskDistChart')?.getContext('2d');
    if (riskCtx) {
        if (charts.riskDist) charts.riskDist.destroy();
        charts.riskDist = new Chart(riskCtx, {
            type: 'bar',
            data: {
                labels: ['Low Risk (<40%)', 'Medium Risk (40-69%)', 'High Risk (≥70%)'],
                datasets: [{
                    label: 'Active Inpatients Count',
                    data: [3, 1, 2],
                    backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                    borderRadius: 4,
                    barThickness: 50
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { stepSize: 1 } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    const monthlyCtx = document.getElementById('monthlyReadmissionChart')?.getContext('2d');
    if (monthlyCtx) {
        if (charts.monthlyReadmission) charts.monthlyReadmission.destroy();
        charts.monthlyReadmission = new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        type: 'bar',
                        label: 'Readmissions Count',
                        data: [15, 12, 18, 9, 14, 11],
                        backgroundColor: 'rgba(37, 99, 235, 0.75)',
                        borderRadius: 4
                    },
                    {
                        type: 'line',
                        label: 'CMO Limit Goal',
                        data: [12, 12, 12, 12, 12, 12],
                        borderColor: '#EF4444',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { boxWidth: 12 } }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    const driversCtx = document.getElementById('driversChart')?.getContext('2d');
    if (driversCtx) {
        if (charts.drivers) charts.drivers.destroy();
        charts.drivers = new Chart(driversCtx, {
            type: 'bar',
            data: {
                labels: [
                    'Medication Non-Adherence', 
                    'Delayed Follow-up Visit', 
                    'Social Support Deficit', 
                    'Comorbidity Complexity', 
                    'Inadequate Health Literacy'
                ],
                datasets: [{
                    label: 'Contribution Factor Weight (%)',
                    data: [35, 28, 18, 12, 7],
                    backgroundColor: '#64748B',
                    borderRadius: 4,
                    barThickness: 20
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, grid: { color: '#F1F5F9' } },
                    y: { grid: { display: false } }
                }
            }
        });
    }
}

function renderNotificationsFeed() {
    const feed = document.getElementById("notificationsFeed");
    const unreadBadge = document.getElementById("unreadBadge");
    
    if (!feed) return;

    feed.innerHTML = "";
    
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
        unreadBadge.style.display = "block";
        document.getElementById("notifySummaryText").textContent = `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.`;
    } else {
        unreadBadge.style.display = "none";
        document.getElementById("notifySummaryText").textContent = "You have 0 unread alerts.";
    }

    notifications.forEach(n => {
        const item = document.createElement("div");
        item.className = "timeline-card";
        if (!n.read) {
            item.style.borderLeft = "3.5px solid var(--primary)";
        }
        
        let typeClass = "";
        if (n.type === "success") typeClass = "success";
        else if (n.type === "warning") typeClass = "warning";
        else if (n.type === "danger") typeClass = "danger";

        item.innerHTML = `
            <div class="timeline-dot ${typeClass}"></div>
            <div class="timeline-header">
                <span class="timeline-title">${n.title}</span>
                <span class="timeline-time">${n.time}</span>
            </div>
            <p class="timeline-desc">${n.desc}</p>
            ${!n.read ? `<button class="btn btn-secondary btn-sm" onclick="markSingleRead(${n.id})" style="padding: 2px 6px; font-size:10px; margin-top:8px;">Mark as Read</button>` : ''}
        `;
        feed.appendChild(item);
    });
}

function markSingleRead(id) {
    const n = notifications.find(not => not.id === id);
    if (n) {
        n.read = true;
        renderNotificationsFeed();
    }
}

function markAllNotificationsRead() {
    notifications.forEach(n => n.read = true);
    renderNotificationsFeed();
}

function switchSettingsTab(tabId) {
    const panels = document.querySelectorAll(".settings-panel");
    panels.forEach(p => {
        if (p.id === `settings-${tabId}`) {
            p.classList.add("active");
        } else {
            p.classList.remove("active");
        }
    });

    const items = document.querySelectorAll(".settings-nav-item");
    items.forEach(i => {
        if (i.getAttribute("data-tab") === tabId) {
            i.classList.add("active");
        } else {
            i.classList.remove("active");
        }
    });
}

function renderSettingsTables() {
    const dBody = document.querySelector("#doctorsSettingsTable tbody");
    if (dBody) {
        dBody.innerHTML = "";
        doctors.forEach(doc => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${doc.name}</strong></td>
                <td>${doc.role}</td>
                <td>${doc.department}</td>
                <td>${doc.discharges}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" style="color:var(--danger);" onclick="alert('Simulation: Role adjustments restricted to Root Administrators.')">Edit Role</button>
                </td>
            `;
            dBody.appendChild(tr);
        });
    }

    const depBody = document.querySelector("#deptSettingsTable tbody");
    if (depBody) {
        depBody.innerHTML = "";
        departments.forEach(dept => {
            const statusClass = dept.status === "Active" ? "badge-approved" : "badge-pending";
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${dept.name} Ward</strong></td>
                <td>${dept.beds} / 40 occupied</td>
                <td>${dept.discharges} / mo</td>
                <td>${dept.threshold} readmission</td>
                <td><span class="badge ${statusClass}">${dept.status}</span></td>
            `;
            depBody.appendChild(tr);
        });
    }
}

function renderAuditLogs() {
    const viewport = document.getElementById("auditLogsViewport");
    if (!viewport) return;

    viewport.innerHTML = "";
    auditLogs.forEach(log => {
        const entry = document.createElement("div");
        entry.className = "audit-entry";
        entry.innerHTML = `
            <span class="audit-time">[${log.time}]</span> 
            <span class="audit-user">&lt;${log.user}&gt;</span> 
            <span class="audit-action">${log.action}</span> - 
            <span class="audit-details">${log.details}</span>
        `;
        viewport.appendChild(entry);
    });
    viewport.scrollTop = viewport.scrollHeight;
}

function addAuditLogEntry(action, details) {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const user = currentUser ? currentUser.name : "Unauthenticated Client";
    auditLogs.push({ time, user, action, details });
    
    if (auditLogs.length > 50) auditLogs.shift();
    
    renderAuditLogs();
}

function saveAISettings() {
    const thresholdHigh = document.getElementById("slideThresholdHigh").value;
    const thresholdMed = document.getElementById("slideThresholdMedium").value;
    const model = document.getElementById("selectAIModel").value;

    addAuditLogEntry("AI_CONFIG_SAVE", `Updated High Risk to ${thresholdHigh}%, Medium Risk to ${thresholdMed}%, and Model to ${model}`);
    alert("AI configurations saved successfully and pushed to blockchain security audit logs.");
}

// Database Operations & Online Synchronization Functions
function pingDatabaseConnection() {
    const btn = document.getElementById("btnTestDBConnection");
    const originalText = btn.innerHTML;
    btn.innerHTML = `⚡ Ping testing...`;
    btn.disabled = true;

    setTimeout(() => {
        const latency = Math.floor(Math.random() * 15) + 8; // 8ms to 23ms
        const pools = Math.floor(Math.random() * 8) + 6; // 6 to 13 active pools
        
        document.getElementById("dbPingLatency").textContent = `${latency} ms`;
        document.getElementById("dbPingLatency").style.color = "var(--success)";
        document.getElementById("dbPoolsCount").textContent = `${pools} / 20 connections`;

        addAuditLogEntry("DB_PING_TEST", `Ping test successful. Neon Host latency: ${latency}ms. Connection Pools: ${pools}/20`);
        alert(`Database Connection Active!\nPing response from neon-postgres-pool.us-east-2.neon.tech: ${latency}ms\nConnection Pool size: ${pools} active slots`);

        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 450);
}

async function syncOnlineClinicalData() {
    const btn = document.getElementById("btnSyncEHRData");
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="sync-spin" style="display:inline-block;">🔄</span> Synchronizing...`;
    btn.disabled = true;

    const connDot = document.getElementById("headerConnectionDot");
    const connText = document.getElementById("headerConnectionText");
    connDot.className = "connection-dot warning";
    connText.textContent = "Neon DB Syncing...";

    addAuditLogEntry("EHR_SYNC_START", "Initiating fetch request to online dataset API.");

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error("Network response was not ok");
        const usersData = await response.json();

        const departmentsList = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine"];
        const diagnosesList = [
            "Acute Coronary Syndrome",
            "Ischemic Stroke",
            "Total Knee Arthroplasty Post-Op",
            "Severe Asthma Bronchospasm",
            "Acute Pyelonephritis"
        ];
        const doctorsList = ["Dr. Amit Sharma", "Dr. Rachel Sen", "Dr. Vikram Mehta", "Dr. Susan Carter"];

        patients = usersData.map((user, idx) => {
            const risk = Math.floor(Math.random() * 85) + 10;
            const stages = ["READY", "NURSE_REVIEW", "DOCTOR_APPROVAL", "BILLING_CLEARANCE", "PHARMACY_CLEARANCE", "DISCHARGED"];
            const stage = stages[idx % stages.length];
            const dept = departmentsList[idx % departmentsList.length];
            const diag = diagnosesList[idx % diagnosesList.length];
            const doc = doctorsList[idx % doctorsList.length];

            return {
                id: `PT-ONLINE-${user.id}`,
                name: user.name,
                age: 30 + (idx * 5),
                gender: idx % 2 === 0 ? "Male" : "Female",
                department: dept,
                diagnosis: diag,
                doctor: doc,
                admissionDate: "2026-06-20",
                riskScore: risk,
                workflow_stage: stage,
                history: `Patient matched online profile. Email: ${user.email}. Address: ${user.address.street}, ${user.address.city}.`,
                medications: ["Atorvastatin 20mg PO", "Lisinopril 5mg PO"],
                riskFactors: ["Online synced baseline data profile"],
                checklist: [
                    { id: "vitals_stable", text: "Confirm vital stability", checked: stage !== "READY" },
                    { id: "nok_contact", text: "Verify next-of-kin transport", checked: stage !== "READY" },
                    { id: "chart_sign", text: "Inspect EHR clinical notes", checked: stage !== "READY" }
                ],
                summary: {
                    overview: `Patient ${user.name} matched online records. Clinical course stable.`,
                    diagnosis: diag,
                    meds: "Atorvastatin 20mg daily.",
                    followup: "Follow up with outpatient clinic in 1 week."
                }
            };
        });

        const now = new Date();
        document.getElementById("dbSyncTime").textContent = now.toLocaleDateString() + " " + now.toLocaleTimeString();

        connDot.className = "connection-dot";
        connText.textContent = "Neon DB Connected";

        addAuditLogEntry("EHR_SYNC_SUCCESS", `Synchronized ${patients.length} patient records from online API.`);
        alert(`Successfully fetched and synchronized ${patients.length} patient records from JSONPlaceholder API! Roster updated.`);

        updateKPIs();
        renderDashboardTable();
        renderPatientsList();

    } catch (error) {
        addAuditLogEntry("EHR_SYNC_ERROR", `Failed online dataset fetch: ${error.message}`);
        connDot.className = "connection-dot disconnected";
        connText.textContent = "DB Sync Failed";
        alert("EHR Synchronization failed. Check internet access. Fallback to local offline cache active.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function selectAndShowDetails(patientId) {
    selectedPatientId = patientId;
    navigateToTab("patientDetails");
}

/* ==========================================
   New Hospital Cockpit Helper Implementations
   ========================================== */

// 1. Role-Based Switcher
function switchUserRole(roleCode) {
    currentRole = roleCode;
    
    // Update global selector value in header to match
    const roleSelector = document.getElementById("globalRoleSelector");
    if (roleSelector) {
        roleSelector.value = roleCode;
    }
    
    if (roleCode === "CMO") {
        currentUser.name = "Dr. Amit Sharma";
        currentUser.role = "Chief Medical Officer";
        currentUser.avatar = "AS";
    } else if (roleCode === "NURSE") {
        currentUser.name = "Nurse Linda Vance";
        currentUser.role = "Charge Ward Nurse";
        currentUser.avatar = "LV";
    } else if (roleCode === "ADMIN") {
        currentUser.name = "Admin IT Manager";
        currentUser.role = "System Administrator";
        currentUser.avatar = "AM";
    }
    
    // Update profile in sidebar
    document.getElementById("userName").textContent = currentUser.name;
    document.getElementById("avatarName").textContent = currentUser.avatar;
    document.querySelector(".user-role").textContent = currentUser.role;
    
    addAuditLogEntry("ROLE_CHANGE", `Switched clinical context to role: [${roleCode}] (${currentUser.role})`);
    
    // Customize dashboard experience based on role
    const quickBar = document.querySelector(".quick-actions-bar");
    if (quickBar) {
        if (roleCode === "NURSE") {
            quickBar.style.borderLeft = "4px solid var(--warning)";
            document.querySelector(".quick-actions-title").textContent = "Nurse Cockpit Actions";
        } else if (roleCode === "ADMIN") {
            quickBar.style.borderLeft = "4px solid var(--success)";
            document.querySelector(".quick-actions-title").textContent = "System Admin Actions";
        } else {
            quickBar.style.borderLeft = "4px solid var(--primary)";
            document.querySelector(".quick-actions-title").textContent = "Clinical Cockpit Actions";
        }
    }
    
    // Disable or enable Doctor actions in summaries view based on role
    const approveBtn = document.getElementById("btnApproveSummary");
    if (approveBtn) {
        if (roleCode === "NURSE") {
            approveBtn.disabled = true;
            approveBtn.style.opacity = "0.5";
            approveBtn.title = "Discharge sign-off restricted to Chief Medical Officers (CMO) or Attending Physicians.";
        } else {
            approveBtn.disabled = false;
            approveBtn.style.opacity = "1";
            approveBtn.title = "";
        }
    }

    // Refresh layout
    if (activeTab === "dashboard") {
        updateKPIs();
        renderDashboardTable();
        renderDashboardCharts();
    } else if (activeTab === "patientDetails") {
        loadPatientDetails(selectedPatientId);
    } else if (activeTab === "summaries") {
        loadSummaryForm(selectedPatientId);
    }
    
    alert(`Switched View: Displaying cockpit context as ${currentUser.role}`);
}

// 2. Search Everywhere Implementation
function handleGlobalSearch(query) {
    const resultsContainer = document.getElementById("globalSearchResults");
    if (!resultsContainer) return;
    
    if (!query || query.trim().length === 0) {
        resultsContainer.style.display = "none";
        resultsContainer.innerHTML = "";
        return;
    }
    
    const term = query.toLowerCase().trim();
    let matches = [];
    
    // Search Patients
    patients.forEach(p => {
        if (p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term) || p.diagnosis.toLowerCase().includes(term)) {
            matches.push({
                type: "patient",
                title: `${p.name} (${p.id})`,
                desc: `${p.department} - ${p.diagnosis} [Risk: ${p.riskScore}%]`,
                action: () => {
                    selectAndShowDetails(p.id);
                }
            });
        }
    });
    
    // Search ICD-10 Codes
    const icd10Codes = [
        { code: "I50.9", title: "Congestive Heart Failure, Unspecified", dept: "Cardiology" },
        { code: "G45.9", title: "Transient Cerebral Ischemic Attack, Unspecified", dept: "Neurology" },
        { code: "S82.209A", title: "Fracture of Shaft of Tibia", dept: "Orthopedics" },
        { code: "J18.9", title: "Pneumonia, Unspecified Organism", dept: "General Medicine" },
        { code: "I21.3", title: "ST Elevation Myocardial Infarction", dept: "Cardiology" }
    ];
    icd10Codes.forEach(code => {
        if (code.code.toLowerCase().includes(term) || code.title.toLowerCase().includes(term)) {
            matches.push({
                type: "icd10",
                title: `Code ${code.code}: ${code.title}`,
                desc: `Clinical Mapping - Admitting Department: ${code.dept}`,
                action: () => {
                    alert(`Standardized EHR Protocol mapping: ICD-10 ${code.code} triggers inpatient care guidelines under ${code.dept}.`);
                }
            });
        }
    });
    
    // Search Audit Actions
    auditLogs.forEach(log => {
        if (log.action.toLowerCase().includes(term) || log.details.toLowerCase().includes(term)) {
            matches.push({
                type: "audit",
                title: `Audit: ${log.action}`,
                desc: `[${log.time}] User ${log.user} - ${log.details}`,
                action: () => {
                    navigateToTab("settings");
                    switchSettingsTab("audit");
                }
            });
        }
    });
    
    if (matches.length === 0) {
        resultsContainer.innerHTML = `<div style="padding: 12px 14px; font-size:12px; color:var(--text-muted); text-align:center;">No results found in EHR systems.</div>`;
    } else {
        resultsContainer.innerHTML = "";
        matches.slice(0, 5).forEach(m => {
            const div = document.createElement("div");
            div.className = "search-result-item";
            div.innerHTML = `
                <div class="search-result-title">${m.title}</div>
                <div class="search-result-desc">${m.desc}</div>
            `;
            div.onclick = () => {
                m.action();
                resultsContainer.style.display = "none";
                document.getElementById("globalSearchInput").value = "";
            };
            resultsContainer.appendChild(div);
        });
    }
    resultsContainer.style.display = "block";
}

// Close search dropdown on click outside
document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("globalSearchResults");
    const searchInput = document.getElementById("globalSearchInput");
    if (dropdown && e.target !== dropdown && e.target !== searchInput) {
        dropdown.style.display = "none";
    }
});

// 3. Interoperability Exporter
let currentInteropTab = "FHIR";

function openInteropModal() {
    if (!selectedPatientId) {
        alert("Select a patient to export interoperability records.");
        return;
    }
    document.getElementById("interopModal").classList.add("active");
    renderInteropCode();
}

function closeInteropModal() {
    document.getElementById("interopModal").classList.remove("active");
}

function toggleInteropTab(tabCode) {
    currentInteropTab = tabCode;
    document.getElementById("btnTabFHIR").classList.toggle("active", tabCode === "FHIR");
    document.getElementById("btnTabHL7").classList.toggle("active", tabCode === "HL7");
    renderInteropCode();
}

function renderInteropCode() {
    const codeContainer = document.getElementById("interopCodeContent");
    if (!codeContainer) return;
    
    if (currentInteropTab === "FHIR") {
        codeContainer.textContent = generateFHIRJson(selectedPatientId);
    } else {
        codeContainer.textContent = generateHL7v2(selectedPatientId);
    }
}

function copyInteropCode() {
    const code = document.getElementById("interopCodeContent").textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert("Interop schema copied to clipboard successfully!");
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}

function generateFHIRJson(patientId) {
    const p = patients.find(pat => pat.id === patientId);
    if (!p) return "{}";
    
    const resource = {
        resourceType: "Bundle",
        id: `bundle-discharge-${p.id.toLowerCase()}`,
        type: "document",
        timestamp: new Date().toISOString(),
        entry: [
            {
                fullUrl: `urn:uuid:patient-${p.id.toLowerCase()}`,
                resource: {
                    resourceType: "Patient",
                    id: p.id,
                    active: true,
                    name: [
                        {
                            use: "official",
                            family: p.name.split(' ').slice(-1)[0],
                            given: p.name.split(' ').slice(0, -1)
                        }
                    ],
                    gender: p.gender.toLowerCase(),
                    birthDate: new Date(new Date().getFullYear() - p.age, 0, 1).toISOString().split('T')[0],
                    managingOrganization: {
                        display: "DischargeIQ General Hospital"
                    }
                }
            },
            {
                fullUrl: `urn:uuid:encounter-${p.id.toLowerCase()}`,
                resource: {
                    resourceType: "Encounter",
                    id: `enc-${p.id.toLowerCase()}`,
                    status: "finished",
                    class: {
                        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                        code: "IMP",
                        display: "inpatient encounter"
                    },
                    subject: {
                        reference: `Patient/${p.id}`,
                        display: p.name
                    },
                    period: {
                        start: p.admissionDate,
                        end: new Date().toISOString().split('T')[0]
                    },
                    hospitalization: {
                        dischargeDisposition: {
                            coding: [
                                {
                                    system: "http://terminology.hl7.org/CodeSystem/discharge-disposition",
                                    code: "home",
                                    display: "Discharged to Home"
                                }
                            ]
                        }
                    }
                }
            },
            {
                fullUrl: `urn:uuid:composition-discharge-${p.id.toLowerCase()}`,
                resource: {
                    resourceType: "Composition",
                    id: `comp-discharge-${p.id.toLowerCase()}`,
                    status: "final",
                    type: {
                        coding: [
                            {
                                system: "http://loinc.org",
                                code: "18842-5",
                                display: "Discharge summary Note"
                            }
                        ]
                    },
                    subject: {
                        reference: `Patient/${p.id}`,
                        display: p.name
                    },
                    date: new Date().toISOString(),
                    author: [
                        {
                            display: p.doctor
                        }
                    ],
                    title: "Clinical Discharge Summary",
                    section: [
                        {
                            title: "Discharge Diagnosis",
                            code: {
                                coding: [
                                    {
                                        system: "http://loinc.org",
                                        code: "11535-2",
                                        display: "Hospital discharge diagnosis"
                                    }
                                ]
                            },
                            text: {
                                status: "generated",
                                div: `<div xmlns="http://www.w3.org/1999/xhtml">${p.summary.diagnosis}</div>`
                            }
                        },
                        {
                            title: "Hospital Course & Overview",
                            code: {
                                coding: [
                                    {
                                        system: "http://loinc.org",
                                        code: "8648-2",
                                        display: "Hospital course"
                                    }
                                ]
                            },
                            text: {
                                status: "generated",
                                div: `<div xmlns="http://www.w3.org/1999/xhtml">${p.summary.overview}</div>`
                            }
                        },
                        {
                            title: "Discharge Medications",
                            code: {
                                coding: [
                                    {
                                        system: "http://loinc.org",
                                        code: "10183-2",
                                        display: "Hospital discharge medications"
                                    }
                                ]
                            },
                            text: {
                                status: "generated",
                                div: `<div xmlns="http://www.w3.org/1999/xhtml"><pre>${p.summary.meds}</pre></div>`
                            }
                        }
                    ]
                }
            }
        ]
    };
    return JSON.stringify(resource, null, 4);
}

function generateHL7v2(patientId) {
    const p = patients.find(pat => pat.id === patientId);
    if (!p) return "";
    
    const nowStr = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);
    const dobStr = new Date(new Date().getFullYear() - p.age, 0, 1).toISOString().replace(/[-:T]/g, "").slice(0, 8);
    const admStr = p.admissionDate.replace(/[-]/g, "") || nowStr.slice(0, 8);
    const disStr = new Date().toISOString().replace(/[-]/g, "").slice(0, 8);
    
    let icd10 = "J18.9^Pneumonia, Unspecified Organism";
    if (p.department === "Cardiology") icd10 = "I50.9^Heart Failure, Unspecified";
    else if (p.department === "Neurology") icd10 = "G45.9^Transient Cerebral Ischemic Attack";
    else if (p.department === "Orthopedics") icd10 = "S82.209A^Fracture of Shaft of Tibia";
    
    let segments = [];
    segments.push(`MSH|^~\\&|DischargeIQ|DischargeIQ_Hosp|||${nowStr}||REF^I12^REF_I12|MSG000${p.id.slice(-4)}|P|2.5.1`);
    segments.push(`PID|1||${p.id}^^^MRN||${p.name.split(' ').reverse().join('^')}||${dobStr}|${p.gender === 'Male' ? 'M' : 'F'}|||100 Hospital Way^^Chicago^IL^60611`);
    segments.push(`PV1|1|I|${p.department}^^104A|||||||||||||||IP|||||||||||||||||||||||||${admStr}|${disStr}`);
    segments.push(`DG1|1||${icd10}|||A`);
    
    const overviewEscaped = p.summary.overview.replace(/\|/g, "\\|");
    const medsEscaped = p.summary.meds.replace(/\|/g, "\\|").replace(/\n/g, "\\.br\\");
    const followupEscaped = p.summary.followup.replace(/\|/g, "\\|").replace(/\n/g, "\\.br\\");
    
    segments.push(`OBX|1|TX|Overview^Discharge Overview||${overviewEscaped}||||||F`);
    segments.push(`OBX|2|TX|Medications^Discharge Meds||${medsEscaped}||||||F`);
    segments.push(`OBX|3|TX|Followup^Follow-up Instructions||${followupEscaped}||||||F`);
    
    return segments.join("\n");
}

// 4. Vertical Patient Timeline Renderer
function renderVerticalWorkflowTracker(p) {
    const timelineContainer = document.getElementById("detailsVerticalTimeline");
    if (!timelineContainer) return;
    
    timelineContainer.innerHTML = "";
    
    const currentStep = workflowStages.find(s => s.code === p.workflow_stage);
    const activeStepNum = currentStep ? currentStep.step : 1;
    
    workflowStages.forEach((stage, idx) => {
        const item = document.createElement("div");
        item.className = "vertical-timeline-item";
        
        const isCompleted = stage.step < activeStepNum;
        const isActive = stage.step === activeStepNum;
        
        if (isCompleted) {
            item.classList.add("completed");
        } else if (isActive) {
            item.classList.add("active");
        } else {
            item.classList.add("pending");
        }
        
        let timeText = "Pending";
        if (isCompleted || isActive) {
            const admDateObj = new Date(p.admissionDate);
            const offsetDays = stage.step - 1;
            admDateObj.setDate(admDateObj.getDate() + offsetDays);
            const timeOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            
            const targetDate = admDateObj > new Date() ? new Date() : admDateObj;
            timeText = targetDate.toLocaleDateString('en-US', timeOptions);
        }
        
        const descMap = {
            "READY": `Inpatient registered under attending ${p.doctor}.`,
            "NURSE_REVIEW": "Nurse checked vital stability and transport contact info.",
            "AI_SUMMARY": "AI Engine compiled draft SOAP discharge summaries.",
            "DOCTOR_APPROVAL": `Attending ${p.doctor} reviewed and signed discharge release.`,
            "BILLING_CLEARANCE": "Billing department cleared insurance pre-auth tokens.",
            "PHARMACY_CLEARANCE": "Hospital pharmacy dispensed discharge medication packs.",
            "DISCHARGED": "EHR course finalized. Patient released to home."
        };
        
        item.innerHTML = `
            <div class="vertical-timeline-marker">
                ${isCompleted ? '✓' : stage.step}
            </div>
            <div class="vertical-timeline-content">
                <div class="vertical-timeline-title">${stage.name}</div>
                <div class="vertical-timeline-subtitle">${descMap[stage.code] || ''} (${stage.role})</div>
                <div class="vertical-timeline-time">${timeText}</div>
            </div>
        `;
        timelineContainer.appendChild(item);
    });
}

// 5. AI recommendations
function renderAIRecommendations(p) {
    const container = document.getElementById("detailsRecommendations");
    if (!container) return;
    
    container.innerHTML = "";
    
    let recommendationsList = [];
    
    if (p.department === "Cardiology") {
        recommendationsList = [
            {
                protocol: "ACC/AHA HF-3",
                evidence: "Class I, Level A",
                title: "Post-Discharge Cardiologist Visit",
                desc: "Schedule cardiologist follow-up outpatient visit within 7-10 days to monitor stability."
            },
            {
                protocol: "ACC/AHA HF-5",
                evidence: "Class I, Level B",
                title: "Medication Adherence Counseling",
                desc: "Conduct session on daily weights, sodium restriction (<2000mg/day), and diuretic holding parameters."
            },
            {
                protocol: "ACC/AHA HF-11",
                evidence: "Class IIa, Level B-R",
                title: "Home Health Nursing Monitor",
                desc: "Order home nursing visits for vital sign collection and medication compliance checks in week 1."
            }
        ];
    } else if (p.department === "Neurology") {
        recommendationsList = [
            {
                protocol: "AHA/ASA Stroke-4",
                evidence: "Class I, Level A",
                title: "Tobacco Cessation Plan",
                desc: "Process referral to smoking cessation quitlines and dispatch nicotine replacement patch script."
            },
            {
                protocol: "AHA/ASA Stroke-7",
                evidence: "Class I, Level B",
                title: "Carotid Duplex Follow-up",
                desc: "Order outpatient carotid duplex ultrasound in 30 days to assess stenosis progression."
            },
            {
                protocol: "AHA/ASA Stroke-12",
                evidence: "Class IIa, Level C",
                title: "Outpatient Stroke Clinic Appointment",
                desc: "Coordinate appointments with Stroke Prevention Specialists for lipid management target reviews."
            }
        ];
    } else if (p.department === "Orthopedics") {
        recommendationsList = [
            {
                protocol: "AAOS ORIF-2",
                evidence: "Class I, Level B",
                title: "Outpatient Physical Therapy Schedule",
                desc: "Ensure outpatient PT sessions are scheduled 2x weekly starting next Monday."
            },
            {
                protocol: "AAOS ORIF-5",
                evidence: "Class I, Level C",
                title: "Surgical Incision Audit Education",
                desc: "Educate patient / caregiver on monitoring incision for purulent discharge, heat, or redness."
            }
        ];
    } else {
        recommendationsList = [
            {
                protocol: "ATS community-Pneumonia",
                evidence: "Class I, Level B",
                title: "48-Hour Telephone Follow-up",
                desc: "Nurse-initiated check call on symptom resolution and prescription fill confirmations."
            },
            {
                protocol: "ATS community-Pneumonia-5",
                evidence: "Class I, Level B",
                title: "Symptom Alarm Warning Audit",
                desc: "Review return-to-ED triggers: shortness of breath at rest, fevers > 101.5F, or altered confusion."
            }
        ];
    }
    
    recommendationsList.forEach(rec => {
        const card = document.createElement("div");
        card.className = "recommendation-card";
        card.innerHTML = `
            <div class="recommendation-header">
                <span style="font-weight:700; color:var(--primary);">${rec.protocol}</span>
                <span style="color:var(--text-muted); font-style:italic;">Evidence: ${rec.evidence}</span>
            </div>
            <div class="recommendation-title">${rec.title}</div>
            <p class="recommendation-desc">${rec.desc}</p>
        `;
        container.appendChild(card);
    });
}

// 6. SHAP Interactive Attribution Renderer
function renderShapattribution(p) {
    const container = document.getElementById("detailsShapFactors");
    if (!container) return;
    
    container.innerHTML = "";
    
    let shapAttributions = [];
    
    if (p.id === "PT-2041") { // James Harrison
        shapAttributions = [
            { name: "Medication Non-Adherence History", weight: 28, positive: true, reason: "Patient has 3 missed pharmacy fills in the past 12 months for essential heart failure medications." },
            { name: "Prior Congestive Heart Failure", weight: 21, positive: true, reason: "Cardiovascular comorbidities are highly correlated with 30-day readmissions." },
            { name: "Advanced Age (> 70 Years)", weight: 17, positive: true, reason: "Geriatric patients represent higher baseline risk due to polypharmacy complications." },
            { name: "Lives Alone (Social Deficit)", weight: 11, positive: true, reason: "Absence of a home caregiver reduces follow-up compliance and early symptom detection." },
            { name: "Vital Stability Index (Normal MAP)", weight: 12, positive: false, reason: "Patient's stable blood pressure and oxygenation during discharge serve as a strong protective factor." }
        ];
    } else if (p.id === "PT-1732") { // Sofia Rodriguez
        shapAttributions = [
            { name: "Severe COPD Comorbidity", weight: 32, positive: true, reason: "Chronic respiratory conditions limit cardiopulmonary reserve and increase recurrence risks." },
            { name: "Cognitive Impairment (Dementia)", weight: 24, positive: true, reason: "Memory deficits increase risk of self-administration medication errors." },
            { name: "CKD Stage III Status", weight: 15, positive: true, reason: "Kidney dysfunction impairs clinical excretion of antibiotics and diuretics." },
            { name: "ICU Stay Requirement", weight: 11, positive: true, reason: "Patients who require ICU care have higher post-intensive care syndrome risks." },
            { name: "Stable Discharge Temperature", weight: 8, positive: false, reason: "Afebrility for >24 hours confirms successful resolution of septic community infection." }
        ];
    } else {
        shapAttributions = [
            { name: "Comorbidity Score (ICD Codes)", weight: Math.max(10, Math.round(p.riskScore * 0.4)), positive: true, reason: "Higher counts of active diagnoses correlate with increased ML risk predictions." },
            { name: "Department Baseline Prevalence", weight: Math.max(10, Math.round(p.riskScore * 0.3)), positive: true, reason: "Department admission rate weight mapped in baseline model nodes." },
            { name: "Age Weight Mappings", weight: Math.max(10, Math.round(p.riskScore * 0.2)), positive: true, reason: "Higher age classes increase model baseline risk parameters." },
            { name: "Discharge Vitals Stability", weight: 15, positive: false, reason: "Consistent normal vitals mitigate overall risk score outputs." }
        ];
    }
    
    shapAttributions.forEach(factor => {
        const row = document.createElement("div");
        row.className = "shap-factor-row";
        row.style.cursor = "pointer";
        row.onclick = () => {
            alert(`SHAP Detail Audit:\n\n• Factor: ${factor.name}\n• Weight Contribution: ${factor.positive ? '+' : '-'}${factor.weight}%\n\nClinical Explanation:\n${factor.reason}`);
        };
        
        const sign = factor.positive ? "+" : "-";
        const fillClass = factor.positive ? "pos" : "neg";
        const signClass = factor.positive ? "pos" : "neg";
        
        row.innerHTML = `
            <div class="shap-bar-header">
                <span class="shap-bar-name">${factor.name}</span>
                <span class="shap-bar-weight ${signClass}">${sign}${factor.weight}%</span>
            </div>
            <div class="shap-bar-track">
                <div class="shap-bar-fill ${fillClass}" style="width: ${factor.weight}%;"></div>
            </div>
        `;
        container.appendChild(row);
    });
}

// 7. Category-Based Notifications
let currentNotificationFilter = "all";

function filterNotifications(category) {
    currentNotificationFilter = category;
    
    // Toggle active filter button style
    const btnIds = {
        all: "btnNotifyFilterAll",
        critical: "btnNotifyFilterCritical",
        pending: "btnNotifyFilterPending",
        completed: "btnNotifyFilterCompleted"
    };
    
    Object.keys(btnIds).forEach(cat => {
        const btn = document.getElementById(btnIds[cat]);
        if (btn) {
            btn.classList.toggle("active", cat === category);
        }
    });
    
    renderNotificationsFeed();
}

// 8. AI Model Center Visualizations
function renderModelCenter() {
    // Feature Importance
    const featureCtx = document.getElementById('modelFeatureImportanceChart')?.getContext('2d');
    if (featureCtx) {
        if (charts.modelImportance) charts.modelImportance.destroy();
        charts.modelImportance = new Chart(featureCtx, {
            type: 'bar',
            data: {
                labels: [
                    'Prior Hospitalizations (12mo)', 
                    'Medication Non-Adherence Weight', 
                    'LVEF Ejection Fraction (<45%)', 
                    'Advanced Age (>75 Years)', 
                    'High Social Vulnerability Index',
                    'Elevated Serum Creatinine'
                ],
                datasets: [{
                    label: 'Mean Absolute SHAP Value',
                    data: [0.38, 0.31, 0.26, 0.19, 0.14, 0.09],
                    backgroundColor: 'rgba(139, 92, 246, 0.85)',
                    borderRadius: 4,
                    barThickness: 16
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, grid: { color: '#F1F5F9' } },
                    y: { grid: { display: false } }
                }
            }
        });
    }
    
    // Calibration / Drift
    const driftCtx = document.getElementById('modelDriftChart')?.getContext('2d');
    if (driftCtx) {
        if (charts.modelDrift) charts.modelDrift.destroy();
        charts.modelDrift = new Chart(driftCtx, {
            type: 'line',
            data: {
                labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8', 'Wk 9', 'Wk 10', 'Wk 11', 'Wk 12'],
                datasets: [
                    {
                        label: 'Observed Risk (Actual Readmits)',
                        data: [0.12, 0.13, 0.11, 0.12, 0.14, 0.13, 0.12, 0.15, 0.13, 0.12, 0.14, 0.13],
                        borderColor: '#2563EB',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.2
                    },
                    {
                        label: 'Expected Risk (Model Predicted)',
                        data: [0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13],
                        borderColor: 'rgba(100, 116, 139, 0.5)',
                        borderDash: [5, 5],
                        borderWidth: 1.5,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { boxWidth: 10 } }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Density
    const densityCtx = document.getElementById('modelPredictionDistChart')?.getContext('2d');
    if (densityCtx) {
        if (charts.modelDist) charts.modelDist.destroy();
        charts.modelDist = new Chart(densityCtx, {
            type: 'line',
            data: {
                labels: ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%'],
                datasets: [{
                    label: 'Prediction Density (Count of Patients)',
                    data: [15, 42, 38, 24, 18, 12, 6, 2, 1],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Terminal Logs
    const terminal = document.getElementById("modelRetrainLogs");
    if (terminal) {
        terminal.textContent = `[2026-06-18 04:12:05] -- Epoch 50/50: loss = 0.084, val_loss = 0.102
[2026-06-18 04:12:30] -- Model v2.4-MD evaluation complete: ROC AUC = 0.892, Recall = 0.824
[2026-06-18 04:13:00] -- Deploying model candidate v2.4-MD to production server...
[2026-06-18 04:13:15] -- Deployment SUCCESS. Pushed weights artifact_id=w_9984_model24
[2026-06-20 00:00:00] -- Initiating automated data drift check...
[2026-06-20 00:00:05] -- Drift Check SUCCESS. Population Stability Index (PSI) = 0.042
[2026-06-24 11:34:00] -- Realtime inference pipeline connected. Database trigger: Neon PG sync
[2026-06-24 11:50:00] -- Active predictions validated: 12,482 evaluations recorded.`;
        terminal.scrollTop = terminal.scrollHeight;
    }
}

