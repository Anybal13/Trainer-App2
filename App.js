import React, { useState, useEffect, useRef } from "react";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const FULL_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const EXERCISE_LIBRARY = {
  cardio: [
    { name: "Course à pied", unit: "km", icon: "🏃" },
    { name: "Vélo", unit: "velo", icon: "🚴" },
    { name: "Corde à sauter", unit: "min", icon: "🪢" },
    { name: "Natation", unit: "m", icon: "🏊" },
    { name: "Rameur", unit: "min", icon: "🚣" },
    { name: "Elliptique", unit: "min", icon: "⚡" },
    { name: "HIIT", unit: "min", icon: "🔥" },
    { name: "HIIT Intervalles", unit: "rounds", icon: "⚡" },
    { name: "Marche rapide", unit: "km", icon: "🚶" },
    { name: "Vélo d'appartement", unit: "velo", icon: "🚲" },
  ],
  musculation: [
    { name: "Développé couché", unit: "reps", icon: "🏋️" },
    { name: "Squat", unit: "reps", icon: "🦵" },
    { name: "Soulevé de terre", unit: "reps", icon: "💪" },
    { name: "Tractions", unit: "reps", icon: "⬆️" },
    { name: "Dips", unit: "reps", icon: "⬇️" },
    { name: "Curl biceps", unit: "reps", icon: "💪" },
    { name: "Presse militaire", unit: "reps", icon: "🙌" },
    { name: "Fentes", unit: "reps", icon: "🦵" },
    { name: "Gainage", unit: "sec", icon: "🧱" },
    { name: "Pompes", unit: "reps", icon: "🤸" },
  ],
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultPlans = [];

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#fff",
    fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  bgGrid: {
    position: "fixed", inset: 0, zIndex: 0,
    backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  content: { position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", paddingBottom: 90 },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 20px 12px",
  },
  logo: { fontSize: 28, marginRight: 10 },
  appName: { fontSize: 28, fontWeight: 900, letterSpacing: 4, color: "#fff", lineHeight: 1 },
  appSub: { fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase" },
  todayBadge: {
    display: "flex", flexDirection: "column", alignItems: "flex-end",
    background: "#161620", borderRadius: 10, padding: "8px 14px",
    border: "1px solid #222",
  },
  todayBanner: {
    margin: "0 16px 10px", padding: "14px 16px",
    background: "linear-gradient(135deg, #161620 0%, #1a1a28 100%)",
    borderRadius: 14, border: "1px solid #2a2a3a",
  },
  todayPill: {
    background: "transparent", border: "1.5px solid", borderRadius: 20,
    padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700,
    letterSpacing: 1, fontFamily: "inherit", display: "flex", gap: 6, alignItems: "center",
    transition: "all 0.2s",
  },
  nav: {
    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
    display: "flex", background: "#0f0f18",
    borderTop: "1px solid #1e1e2e", padding: "8px 0 12px",
  },
  navBtn: (active, color = "#e85d04") => ({
    flex: 1, background: "none", border: "none", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    color: active ? color : "#444", fontFamily: "inherit",
    fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
    transition: "color 0.2s",
  }),
  navIcon: { fontSize: 20 },
  section: { padding: "10px 16px" },
  sectionTitle: {
    fontSize: 13, fontWeight: 800, letterSpacing: 3, color: "#555",
    textTransform: "uppercase", marginBottom: 12,
  },
  card: {
    background: "#111118", border: "1px solid #1e1e2e",
    borderRadius: 16, padding: "16px", marginBottom: 12,
    transition: "border-color 0.2s",
  },
  planCard: (color) => ({
    background: "#111118", border: `1px solid ${color}33`,
    borderRadius: 16, padding: "16px", marginBottom: 12,
    borderLeft: `4px solid ${color}`,
  }),
  chip: (color) => ({
    display: "inline-block", background: `${color}22`, color,
    borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700,
    letterSpacing: 1, textTransform: "uppercase",
  }),
  btn: (color = "#e85d04", ghost = false) => ({
    background: ghost ? "transparent" : color,
    color: ghost ? color : "#fff",
    border: `1.5px solid ${color}`,
    borderRadius: 10, padding: "9px 18px", cursor: "pointer",
    fontSize: 13, fontWeight: 800, letterSpacing: 1,
    fontFamily: "inherit", textTransform: "uppercase",
    transition: "all 0.2s",
  }),
  input: {
    background: "#0f0f18", border: "1px solid #2a2a3a", borderRadius: 10,
    color: "#fff", padding: "10px 14px", fontSize: 14, fontFamily: "inherit",
    width: "100%", boxSizing: "border-box", outline: "none",
  },
  label: { fontSize: 11, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, display: "block" },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
    zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center",
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#111118", borderRadius: "20px 20px 0 0",
    border: "1px solid #2a2a3a", padding: "24px 20px 32px",
    width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto",
  },
  modalTitle: { fontSize: 22, fontWeight: 900, letterSpacing: 2, marginBottom: 20 },
  dayGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 12 },
  dayBtn: (active, color) => ({
    background: active ? color : "#1a1a22",
    border: `1.5px solid ${active ? color : "#2a2a3a"}`,
    borderRadius: 8, padding: "8px 0", cursor: "pointer",
    color: active ? "#fff" : "#555", fontSize: 11, fontWeight: 800,
    fontFamily: "inherit", textTransform: "uppercase", letterSpacing: 1,
    transition: "all 0.2s",
  }),
  timerCircle: (pct) => ({
    width: 180, height: 180, borderRadius: "50%",
    background: `conic-gradient(#e85d04 ${pct * 360}deg, #1a1a22 0deg)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 20px", position: "relative",
  }),
  timerInner: {
    width: 150, height: 150, borderRadius: "50%",
    background: "#0f0f18", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
  },
  statCard: (color) => ({
    background: "#111118", border: `1px solid ${color}33`,
    borderRadius: 16, padding: "16px", flex: 1,
    borderTop: `3px solid ${color}`,
  }),
  statNum: { fontSize: 36, fontWeight: 900, lineHeight: 1 },
  statLabel: { fontSize: 11, color: "#666", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 },
  weekRow: { display: "flex", gap: 4, marginBottom: 16 },
  weekDay: (active, hasWorkout) => ({
    flex: 1, aspectRatio: "1", borderRadius: 8,
    background: hasWorkout ? (active ? "#e85d04" : "#1e1e2e") : "#111118",
    border: `1px solid ${active ? "#e85d04" : hasWorkout ? "#2a2a3a" : "#1a1a22"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 10, color: active ? "#fff" : "#444", fontWeight: 800,
    letterSpacing: 1, textTransform: "uppercase",
  }),
  progressBar: (pct, color) => ({
    height: 6, borderRadius: 3, background: "#1a1a22", overflow: "hidden",
    position: "relative",
  }),
  progressFill: (pct, color) => ({
    height: "100%", width: `${pct}%`, background: color,
    borderRadius: 3, transition: "width 0.6s ease",
  }),
  row: { display: "flex", gap: 10, marginBottom: 12 },
  exRow: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#0f0f18", borderRadius: 10, padding: "10px 12px", marginBottom: 8,
  },
};

// ─── Plan Modal ───────────────────────────────────────────────────────────────
function PlanModal({ plan, onSave, onClose }) {
  const [name, setName] = useState(plan?.name || "");
  const [type, setType] = useState(plan?.type || "musculation");
  const [color, setColor] = useState(plan?.color || "#e85d04");
  const [days, setDays] = useState(plan?.days || []);
  const [exercises, setExercises] = useState(plan?.exercises || []);
  const [showLib, setShowLib] = useState(false);

  const toggleDay = (d) => setDays(days.includes(d) ? days.filter(x => x !== d) : [...days, d]);

  const addExercise = (ex) => {
    setExercises([...exercises, { ...ex, id: generateId(), sets: 3, reps: ex.unit === "km" ? 5 : 10, weight: 0 }]);
    setShowLib(false);
  };

  const removeEx = (id) => setExercises(exercises.filter(e => e.id !== id));

  const updateEx = (id, field, val) => setExercises(exercises.map(e => e.id === id ? { ...e, [field]: val } : e));

  const colors = ["#e85d04", "#0096c7", "#7b2d8b", "#2d9e4e", "#c9a227", "#d62839"];

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={S.modalTitle}>{plan?.id ? "Modifier" : "Nouveau"} Programme</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>

        <label style={S.label}>Nom du programme</label>
        <input style={{ ...S.input, marginBottom: 16 }} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Push Pull Legs..." />

        <label style={S.label}>Type</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["musculation", "cardio"].map(t => (
            <button key={t} onClick={() => setType(t)} style={{ ...S.btn(type === t ? color : "#2a2a3a", type !== t), flex: 1 }}>
              {t === "musculation" ? "🏋️ Musculation" : "🏃 Cardio"}
            </button>
          ))}
        </div>

        <label style={S.label}>Couleur</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {colors.map(c => (
            <button key={c} onClick={() => setColor(c)} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: `3px solid ${color === c ? "#fff" : "transparent"}`, cursor: "pointer" }} />
          ))}
        </div>

        <label style={S.label}>Jours d'entraînement</label>
        <div style={S.dayGrid}>
          {DAYS.map((d, i) => (
            <button key={i} onClick={() => toggleDay(i)} style={S.dayBtn(days.includes(i), color)}>{d}</button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, marginTop: 8 }}>
          <label style={{ ...S.label, margin: 0 }}>Exercices ({exercises.length})</label>
          <button onClick={() => setShowLib(!showLib)} style={S.btn(color, true)}>+ Ajouter</button>
        </div>

        {showLib && (
          <div style={{ background: "#0f0f18", borderRadius: 12, padding: 12, marginBottom: 12, maxHeight: 200, overflowY: "auto" }}>
            {EXERCISE_LIBRARY[type].map((ex, i) => (
              <button key={i} onClick={() => addExercise(ex)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: "8px 4px", fontSize: 14, fontFamily: "inherit", borderBottom: "1px solid #1a1a22", textAlign: "left" }}>
                <span>{ex.icon}</span> {ex.name} <span style={{ color: "#555", fontSize: 12 }}>({ex.unit})</span>
              </button>
            ))}
          </div>
        )}

        {exercises.map(ex => (
          <div key={ex.id} style={S.exRow}>
            <span style={{ fontSize: 20 }}>{ex.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{ex.name}</div>
              <div style={{ display: "flex", gap: 6 }}>
                {ex.unit !== "velo" && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>Séries</div>
                    <input style={{ ...S.input, padding: "4px 8px", fontSize: 13 }} type="number" value={ex.sets} onChange={e => updateEx(ex.id, "sets", +e.target.value)} />
                  </div>
                )}
                {ex.unit !== "velo" && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>
                      {ex.unit === "reps" ? "Répétitions" : ex.unit}
                    </div>
                    <input style={{ ...S.input, padding: "4px 8px", fontSize: 13 }} type="number" value={ex.reps} onChange={e => updateEx(ex.id, "reps", +e.target.value)} />
                  </div>
                )}
                {ex.unit === "velo" && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>⏱ Temps objectif (min)</div>
                    <input style={{ ...S.input, padding: "4px 8px", fontSize: 13 }} type="number" value={ex.duration || ""} onChange={e => updateEx(ex.id, "duration", +e.target.value)} placeholder="ex: 45" />
                  </div>
                )}
                {ex.unit === "reps" && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>Poids (kg)</div>
                    <input style={{ ...S.input, padding: "4px 8px", fontSize: 13 }} type="number" value={ex.weight} onChange={e => updateEx(ex.id, "weight", +e.target.value)} />
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => removeEx(ex.id)} style={{ background: "none", border: "none", color: "#d62839", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>
        ))}

        <button onClick={() => onSave({ ...plan, name, type, color, days, exercises })} style={{ ...S.btn(color), width: "100%", padding: "14px", fontSize: 16, marginTop: 8 }}>
          💾 Sauvegarder
        </button>
      </div>
    </div>
  );
}

// ─── Seance Modal (same as PlanModal but without days) ────────────────────────
function SeanceModal({ seance, onSave, onClose }) {
  const [name, setName] = useState(seance?.name || "");
  const [type, setType] = useState(seance?.type || "musculation");
  const [color, setColor] = useState(seance?.color || "#e85d04");
  const [exercises, setExercises] = useState(seance?.exercises || []);
  const [showLib, setShowLib] = useState(false);

  const addExercise = (ex) => {
    setExercises([...exercises, { ...ex, id: generateId(), sets: 3, reps: ex.unit === "km" ? 5 : 10, weight: 0 }]);
    setShowLib(false);
  };
  const removeEx = (id) => setExercises(exercises.filter(e => e.id !== id));
  const updateEx = (id, field, val) => setExercises(exercises.map(e => e.id === id ? { ...e, [field]: val } : e));
  const colors = ["#e85d04", "#0096c7", "#7b2d8b", "#2d9e4e", "#c9a227", "#d62839"];

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={S.modalTitle}>{seance?.id ? "Modifier" : "Nouvelle"} Séance</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>

        <label style={S.label}>Nom de la séance</label>
        <input style={{ ...S.input, marginBottom: 16 }} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Cardio matin, Jambes..." />

        <label style={S.label}>Type</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["musculation", "cardio"].map(t => (
            <button key={t} onClick={() => setType(t)} style={{ ...S.btn(type === t ? color : "#2a2a3a", type !== t), flex: 1 }}>
              {t === "musculation" ? "🏋️ Musculation" : "🏃 Cardio"}
            </button>
          ))}
        </div>

        <label style={S.label}>Couleur</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {colors.map(c => (
            <button key={c} onClick={() => setColor(c)} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: `3px solid ${color === c ? "#fff" : "transparent"}`, cursor: "pointer" }} />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, marginTop: 8 }}>
          <label style={{ ...S.label, margin: 0 }}>Exercices ({exercises.length})</label>
          <button onClick={() => setShowLib(!showLib)} style={S.btn(color, true)}>+ Ajouter</button>
        </div>

        {showLib && (
          <div style={{ background: "#0f0f18", borderRadius: 12, padding: 12, marginBottom: 12, maxHeight: 200, overflowY: "auto" }}>
            {EXERCISE_LIBRARY[type].map((ex, i) => (
              <button key={i} onClick={() => addExercise(ex)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: "8px 4px", fontSize: 14, fontFamily: "inherit", borderBottom: "1px solid #1a1a22", textAlign: "left" }}>
                <span>{ex.icon}</span> {ex.name} <span style={{ color: "#555", fontSize: 12 }}>({ex.unit})</span>
              </button>
            ))}
          </div>
        )}

        {exercises.map(ex => (
          <div key={ex.id} style={S.exRow}>
            <span style={{ fontSize: 20 }}>{ex.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{ex.name}</div>
              <div style={{ display: "flex", gap: 6 }}>
                {ex.unit !== "velo" && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>Séries</div>
                    <input style={{ ...S.input, padding: "4px 8px", fontSize: 13 }} type="number" value={ex.sets} onChange={e => updateEx(ex.id, "sets", +e.target.value)} />
                  </div>
                )}
                {ex.unit !== "velo" && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>{ex.unit === "reps" ? "Répétitions" : ex.unit}</div>
                    <input style={{ ...S.input, padding: "4px 8px", fontSize: 13 }} type="number" value={ex.reps} onChange={e => updateEx(ex.id, "reps", +e.target.value)} />
                  </div>
                )}
                {ex.unit === "velo" && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>⏱ Temps objectif (min)</div>
                    <input style={{ ...S.input, padding: "4px 8px", fontSize: 13 }} type="number" value={ex.duration || ""} onChange={e => updateEx(ex.id, "duration", +e.target.value)} placeholder="ex: 45" />
                  </div>
                )}
                {ex.unit === "reps" && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>Poids (kg)</div>
                    <input style={{ ...S.input, padding: "4px 8px", fontSize: 13 }} type="number" value={ex.weight} onChange={e => updateEx(ex.id, "weight", +e.target.value)} />
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => removeEx(ex.id)} style={{ background: "none", border: "none", color: "#d62839", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>
        ))}

        <button onClick={() => onSave({ ...seance, name, type, color, exercises })} style={{ ...S.btn(color), width: "100%", padding: "14px", fontSize: 16, marginTop: 8 }}>
          💾 Sauvegarder
        </button>
      </div>
    </div>
  );
}

// ─── Log Session Modal ────────────────────────────────────────────────────────
function LogModal({ session, onSave, onClose, onStartTimer }) {
  const [exData, setExData] = useState(session.exercises.map(e => ({
    ...e,
    done: false,
    actualReps: e.reps,
    actualWeight: e.weight || 0,
    actualDist: e.reps,
    actualTime: e.duration || "",
    actualCalories: "",
  })));
  const [photos, setPhotos] = useState([]);
  const [perf, setPerf] = useState({
    calories: "", duration: "", avgSpeed: "", maxSpeed: "",
    avgHeartRate: "", maxHeartRate: "", distance: "", elevation: "",
    rpe: "", temperature: "",
  });
  const [showPerf, setShowPerf] = useState(false);

  const updateEx = (id, field, val) => setExData(exData.map(e => e.id === id ? { ...e, [field]: val } : e));
  const updatePerf = (field, val) => setPerf(p => ({ ...p, [field]: val }));

  const handlePhotoAdd = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos(prev => [...prev, { id: generateId(), src: ev.target.result }]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (id) => setPhotos(photos.filter(p => p.id !== id));
  const photoInputId = `photo-input-${session.plan.id}`;

  const plan = session.plan;
  const isCardio = plan.type === "cardio";

  const perfFields = isCardio ? [
    { key: "calories", label: "Calories brûlées", unit: "kcal", icon: "🔥", placeholder: "ex: 450" },
    { key: "duration", label: "Durée totale", unit: "min", icon: "⏱", placeholder: "ex: 45" },
    { key: "distance", label: "Distance", unit: "km", icon: "📍", placeholder: "ex: 8.5" },
    { key: "avgSpeed", label: "Vitesse moyenne", unit: "km/h", icon: "⚡", placeholder: "ex: 12" },
    { key: "maxSpeed", label: "Vitesse max", unit: "km/h", icon: "🚀", placeholder: "ex: 18" },
    { key: "avgHeartRate", label: "FC moyenne", unit: "bpm", icon: "❤️", placeholder: "ex: 145" },
    { key: "maxHeartRate", label: "FC max", unit: "bpm", icon: "💓", placeholder: "ex: 178" },
    { key: "elevation", label: "Dénivelé", unit: "m", icon: "⛰️", placeholder: "ex: 120" },
    { key: "rpe", label: "Effort perçu (1-10)", unit: "/10", icon: "💪", placeholder: "ex: 7" },
    { key: "temperature", label: "Température", unit: "°C", icon: "🌡️", placeholder: "ex: 18" },
  ] : [
    { key: "calories", label: "Calories brûlées", unit: "kcal", icon: "🔥", placeholder: "ex: 320" },
    { key: "duration", label: "Durée totale", unit: "min", icon: "⏱", placeholder: "ex: 60" },
    { key: "avgHeartRate", label: "FC moyenne", unit: "bpm", icon: "❤️", placeholder: "ex: 130" },
    { key: "maxHeartRate", label: "FC max", unit: "bpm", icon: "💓", placeholder: "ex: 165" },
    { key: "rpe", label: "Effort perçu (1-10)", unit: "/10", icon: "💪", placeholder: "ex: 8" },
  ];

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={S.modalTitle}>📓 Séance en cours</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ ...S.chip(plan.color), marginBottom: 16 }}>{plan.name}</div>

        {exData.map(ex => (
          <div key={ex.id} style={{ ...S.exRow, flexDirection: "column", alignItems: "stretch", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{ex.icon}</span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{ex.name}</span>
              <button onClick={() => updateEx(ex.id, "done", !ex.done)} style={{ background: ex.done ? "#2d9e4e" : "#1a1a22", border: `1.5px solid ${ex.done ? "#2d9e4e" : "#2a2a3a"}`, borderRadius: 8, color: "#fff", padding: "4px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 700 }}>
                {ex.done ? "✓ Fait" : "Marquer fait"}
              </button>
            </div>

            {ex.unit === "velo" ? (
              <div>
                {ex.duration && (
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    <div style={{ background: "#1a1a22", borderRadius: 8, padding: "5px 10px", fontSize: 11, color: "#666" }}>
                      🎯 Objectif : <span style={{ color: "#ccc", fontWeight: 700 }}>⏱ {ex.duration} min</span>
                    </div>
                  </div>
                )}
                <div style={{ fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Résultats</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>📍 Km réalisés</div>
                    <input style={{ ...S.input, padding: "6px 10px" }} type="number" value={ex.actualDist} onChange={e => updateEx(ex.id, "actualDist", e.target.value)} placeholder="km" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>⏱ Temps (min)</div>
                    <input style={{ ...S.input, padding: "6px 10px" }} type="number" value={ex.actualTime} onChange={e => updateEx(ex.id, "actualTime", e.target.value)} placeholder={ex.duration ? `obj: ${ex.duration}` : "min"} />
                    {ex.actualTime && ex.duration && +ex.actualTime > 0 && (
                      <div style={{ fontSize: 10, marginTop: 3, color: +ex.actualTime >= +ex.duration ? "#2d9e4e" : "#e85d04", fontWeight: 700 }}>
                        {+ex.actualTime >= +ex.duration ? "✓ Objectif atteint !" : `${+ex.duration - +ex.actualTime} min restantes`}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>🔥 Calories</div>
                    <input style={{ ...S.input, padding: "6px 10px" }} type="number" value={ex.actualCalories} onChange={e => updateEx(ex.id, "actualCalories", e.target.value)} placeholder="kcal" />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>
                    {ex.unit === "reps" ? `Reps (prévu: ${ex.reps})` : ex.unit === "km" ? `Km (prévu: ${ex.reps})` : `Durée (prévu: ${ex.reps} ${ex.unit})`}
                  </div>
                  <input style={{ ...S.input, padding: "6px 10px" }} type="number" value={ex.unit === "reps" ? ex.actualReps : ex.actualDist} onChange={e => updateEx(ex.id, ex.unit === "reps" ? "actualReps" : "actualDist", +e.target.value)} />
                </div>
                {ex.unit === "reps" && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>Poids kg (prévu: {ex.weight})</div>
                    <input style={{ ...S.input, padding: "6px 10px" }} type="number" value={ex.actualWeight} onChange={e => updateEx(ex.id, "actualWeight", +e.target.value)} />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* ── Performance metrics section ── */}
        <div style={{ border: "1px solid #2a2a3a", borderRadius: 14, marginBottom: 16, overflow: "hidden" }}>
          <button onClick={() => setShowPerf(!showPerf)} style={{ width: "100%", background: "#0f0f18", border: "none", color: "#fff", padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
              <span>📊</span> Paramètres de performance
              {Object.values(perf).some(v => v !== "") && (
                <span style={{ background: plan.color, borderRadius: 10, padding: "1px 7px", fontSize: 10 }}>
                  {Object.values(perf).filter(v => v !== "").length}
                </span>
              )}
            </span>
            <span style={{ color: "#555", fontSize: 18 }}>{showPerf ? "▲" : "▼"}</span>
          </button>
          {showPerf && (
            <div style={{ padding: "16px", background: "#0a0a0f" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {perfFields.map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      <span>{f.icon}</span>
                      <span style={{ letterSpacing: 1, textTransform: "uppercase" }}>{f.label}</span>
                    </div>
                    <div style={{ position: "relative" }}>
                      <input style={{ ...S.input, padding: "7px 44px 7px 10px", fontSize: 13 }} type="number" value={perf[f.key]} onChange={e => updatePerf(f.key, e.target.value)} placeholder={f.placeholder} />
                      <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#555", pointerEvents: "none" }}>{f.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Photos section ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <label style={S.label}>📷 Photos</label>
            <label htmlFor={photoInputId} style={{ ...S.btn(plan.color, true), fontSize: 11, padding: "5px 12px", cursor: "pointer" }}>+ Ajouter</label>
          </div>
          <input id={photoInputId} type="file" accept="image/*" multiple onChange={handlePhotoAdd} style={{ display: "none" }} />

          {photos.length === 0 ? (
            <label htmlFor={photoInputId} style={{ width: "100%", background: "#0f0f18", border: "2px dashed #2a2a3a", borderRadius: 12, padding: "20px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxSizing: "border-box" }}>
              <span style={{ fontSize: 28 }}>📷</span>
              <span style={{ fontSize: 12, color: "#555" }}>Ajouter des photos de la séance</span>
            </label>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {photos.map(p => (
                <div key={p.id} style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden" }}>
                  <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button onClick={() => removePhoto(p.id)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", color: "#fff", width: 22, height: 22, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
              ))}
              <label htmlFor={photoInputId} style={{ aspectRatio: "1", background: "#0f0f18", border: "2px dashed #2a2a3a", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#444" }}>+</label>
            </div>
          )}
        </div>

        <button onClick={() => onSave({ planId: session.plan.id, planName: session.plan.name, type: session.plan.type, color: session.plan.color, exercises: exData, photos, perf })} style={{ ...S.btn(plan.color), width: "100%", padding: "14px", fontSize: 16 }}>
          ✅ Terminer la séance
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("seance");
  const [plans, setPlans] = useState(defaultPlans);
  const [seances, setSeances] = useState([]);
  const [log, setLog] = useState([]);
  const [showSeanceModal, setShowSeanceModal] = useState(false);
  const [editingSeance, setEditingSeance] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("stopwatch");
  const [countdownInit, setCountdownInit] = useState(60);
  const timerRef = useRef(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logSession, setLogSession] = useState(null);
  // sessionChecks: { "planId-weekKey-dayIdx": true/false }
  const [sessionChecks, setSessionChecks] = useState({});

  const getWeekKey = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week}`;
  };

  const toggleCheck = (planId, dayIdx) => {
    const key = `${planId}-${getWeekKey()}-${dayIdx}`;
    setSessionChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isChecked = (planId, dayIdx) => {
    const key = `${planId}-${getWeekKey()}-${dayIdx}`;
    return !!sessionChecks[key];
  };

  // Timer
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (timerMode === "countdown") {
            if (s <= 1) { setTimerRunning(false); return 0; }
            return s - 1;
          }
          return s + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerMode]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startCountdown = (secs) => {
    setTimerMode("countdown");
    setCountdownInit(secs);
    setTimerSeconds(secs);
    setTimerRunning(true);
    setTab("timer");
  };

  const timerPct = timerMode === "countdown" ? timerSeconds / (countdownInit || 1) : (timerSeconds % 60) / 60;

  const savePlan = (plan) => {
    if (plan.id && plans.find(p => p.id === plan.id)) {
      setPlans(plans.map(p => p.id === plan.id ? plan : p));
    } else {
      setPlans([...plans, { ...plan, id: generateId() }]);
    }
    setShowPlanModal(false);
    setEditingPlan(null);
  };

  const deletePlan = (id) => setPlans(plans.filter(p => p.id !== id));

  const saveSeance = (seance) => {
    if (seance.id && seances.find(s => s.id === seance.id)) {
      setSeances(seances.map(s => s.id === seance.id ? seance : s));
    } else {
      setSeances([...seances, { ...seance, id: generateId() }]);
    }
    setShowSeanceModal(false);
    setEditingSeance(null);
  };

  const deleteSeance = (id) => setSeances(seances.filter(s => s.id !== id));

  const saveSession = (session) => {
    setLog([{ ...session, id: generateId(), date: new Date().toISOString() }, ...log]);
    // Auto-check today's box for this plan
    const key = `${session.planId}-${getWeekKey()}-${todayIdx}`;
    setSessionChecks(prev => ({ ...prev, [key]: true }));
    setShowLogModal(false);
    setLogSession(null);
  };

  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const todayPlans = plans.filter(p => p.days.includes(todayIdx));

  // Calendar state
  const nowDate = new Date();
  const [calYear, setCalYear] = useState(nowDate.getFullYear());
  const [calMonth, setCalMonth] = useState(nowDate.getMonth());
  const [selectedDate, setSelectedDate] = useState(nowDate.getDate());
  const [calExpanded, setCalExpanded] = useState(false);

  const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => {
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1; // Mon=0
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
    setSelectedDate(null);
  };

  const getDateDayIdx = (y, m, d) => {
    const day = new Date(y, m, d).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const isToday = (y, m, d) => y === nowDate.getFullYear() && m === nowDate.getMonth() && d === nowDate.getDate();
  const isSelected = (d) => d === selectedDate;

  const getPlansForDate = (y, m, d) => {
    const dayIdx = getDateDayIdx(y, m, d);
    return plans.filter(p => p.days.includes(dayIdx));
  };

  const hasLogOnDate = (y, m, d) => {
    return log.some(s => {
      const ld = new Date(s.date);
      return ld.getFullYear() === y && ld.getMonth() === m && ld.getDate() === d;
    });
  };

  const selectedDayIdx = selectedDate ? getDateDayIdx(calYear, calMonth, selectedDate) : null;
  const selectedPlans = selectedDate ? getPlansForDate(calYear, calMonth, selectedDate) : [];

  // Stats
  const totalSessions = log.length;
  const thisWeek = log.filter(s => (new Date() - new Date(s.date)) < 7 * 86400000).length;
  const cardioSessions = log.filter(s => s.type === "cardio").length;
  const muscleSessions = log.filter(s => s.type === "musculation").length;
  const avgFeeling = log.length ? (log.reduce((a, s) => a + s.feeling, 0) / log.length).toFixed(1) : "—";
  const totalCalories = log.reduce((a, s) => a + (s.perf?.calories ? +s.perf.calories : 0), 0);

  // Weekly grid (last 7 days)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
    const dateStr = d.toDateString();
    const hasLog = log.some(s => new Date(s.date).toDateString() === dateStr);
    const isToday = i === 6;
    return { label: DAYS[dayIdx], hasLog, isToday };
  });

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={S.bgGrid} />
      <div style={S.content}>
        {/* Header */}
        <header style={S.header}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={S.logo}>⚡</span>
            <div style={{ marginLeft: 8 }}>
              <div style={S.appName}>TRAINER</div>
              <div style={S.appSub}>Planificateur sportif</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <label htmlFor="import-data" style={{ background: "#1a1a22", border: "1px solid #2a2a3a", borderRadius: 8, color: "#888", padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", letterSpacing: 1 }}>
              ⬆ Import
            </label>
            <input id="import-data" type="file" accept=".json" onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                try {
                  const data = JSON.parse(ev.target.result);
                  if (data.seances) setSeances(data.seances);
                  if (data.plans) setPlans(data.plans);
                  if (data.log) setLog(data.log);
                  alert("✅ Données importées avec succès !");
                } catch {
                  alert("❌ Fichier invalide.");
                }
              };
              reader.readAsText(file);
              e.target.value = "";
            }} style={{ display: "none" }} />
            <button onClick={() => {
              const data = JSON.stringify({ seances, plans, log }, null, 2);
              const blob = new Blob([data], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `trainer-backup-${new Date().toISOString().slice(0,10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }} style={{ background: "#1a1a22", border: "1px solid #2a2a3a", borderRadius: 8, color: "#888", padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", letterSpacing: 1 }}>
              ⬇ Export
            </button>
          </div>
        </header>

        {/* Today banner */}
        {todayPlans.length > 0 && (
          <div style={{ margin: "0 16px 12px", padding: "14px 16px", background: "#111118", borderRadius: 14, border: "1px solid #2a2a3a" }}>
            <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>🔥 Programme du jour</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {todayPlans.map(p => (
                <button key={p.id} onClick={() => { setLogSession({ plan: p, exercises: p.exercises }); setShowLogModal(true); }}
                  style={{ ...S.btn(p.color, true), fontSize: 12, padding: "6px 14px", display: "flex", gap: 6, alignItems: "center" }}>
                  {p.type === "cardio" ? "🏃" : "🏋️"} {p.name} →
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── SÉANCE TAB ─────────────────────── */}
        {tab === "seance" && (
          <div style={S.section}>

            {/* ── Calendrier semaine ── */}
            <div style={{ background: "#111118", borderRadius: 16, border: "1px solid #1e1e2e", padding: "16px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2, color: "#fff", textTransform: "uppercase", lineHeight: 1 }}>{MONTHS_FR[calMonth]}</div>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: 3 }}>{calYear}</div>
                </div>
                <button onClick={() => setCalExpanded(!calExpanded)} style={{ background: calExpanded ? "#e85d0422" : "#1a1a22", border: `1px solid ${calExpanded ? "#e85d04" : "#2a2a3a"}`, borderRadius: 8, color: calExpanded ? "#e85d04" : "#666", padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
                  {calExpanded ? "▲ Réduire" : "▼ Voir le mois"}
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 4 }}>
                {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: "#444", letterSpacing: 1, padding: "2px 0" }}>{d}</div>)}
              </div>

              {!calExpanded && (() => {
                const firstDay = getFirstDayOfMonth(calYear, calMonth);
                const allCells = [...Array(firstDay).fill(null), ...Array.from({ length: getDaysInMonth(calYear, calMonth) }, (_, i) => i + 1)];
                const weeks = [];
                for (let i = 0; i < allCells.length; i += 7) weeks.push(allCells.slice(i, i + 7));
                const activeWeekIdx = weeks.findIndex(w => w.some(d => d && isToday(calYear, calMonth, d)));
                const displayWeekIdx = selectedDate ? weeks.findIndex(w => w.includes(selectedDate)) : activeWeekIdx;
                const wi = displayWeekIdx >= 0 ? displayWeekIdx : activeWeekIdx >= 0 ? activeWeekIdx : 0;
                const displayWeek = weeks[wi] || [];
                return (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <button onClick={() => { const pw = weeks[wi - 1]; if (pw) { const d = pw.find(x => x); if (d) setSelectedDate(d); } else prevMonth(); }} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, padding: "2px 6px" }}>‹</button>
                      <span style={{ fontSize: 11, color: "#555", letterSpacing: 1 }}>Semaine {wi + 1}/{weeks.length}</span>
                      <button onClick={() => { const nw = weeks[wi + 1]; if (nw) { const d = nw.find(x => x); if (d) setSelectedDate(d); } else nextMonth(); }} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, padding: "2px 6px" }}>›</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                      {displayWeek.map((d, i) => {
                        if (!d) return <div key={i} />;
                        const dayIdx = getDateDayIdx(calYear, calMonth, d);
                        const daySeances = seances.filter(s => s.days && s.days.includes(dayIdx));
                        const hasSession = hasLogOnDate(calYear, calMonth, d);
                        const todayCell = isToday(calYear, calMonth, d);
                        const sel = isSelected(d);
                        const has = daySeances.length > 0;
                        const c = has ? daySeances[0].color : null;
                        return (
                          <button key={d} onClick={() => setSelectedDate(sel ? null : d)} style={{ aspectRatio: "1", borderRadius: 8, border: `1.5px solid ${sel ? "#fff" : todayCell ? "#e85d04" : has ? `${c}66` : "#1a1a22"}`, background: sel ? "#fff" : todayCell ? "#e85d0422" : has ? `${c}11` : "transparent", color: sel ? "#000" : todayCell ? "#e85d04" : has ? c : "#555", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: sel || todayCell ? 900 : 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: 0, gap: 1 }}>
                            {d}
                            {hasSession && <div style={{ position: "absolute", top: 1, right: 3, fontSize: 8, color: "#2d9e4e", fontWeight: 900 }}>✓</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {calExpanded && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <button onClick={prevMonth} style={{ background: "none", border: "1px solid #2a2a3a", borderRadius: 8, color: "#888", width: 30, height: 30, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                    <button onClick={nextMonth} style={{ background: "none", border: "1px solid #2a2a3a", borderRadius: 8, color: "#888", width: 30, height: 30, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                    {Array.from({ length: getFirstDayOfMonth(calYear, calMonth) }, (_, i) => <div key={`e-${i}`} />)}
                    {Array.from({ length: getDaysInMonth(calYear, calMonth) }, (_, i) => {
                      const d = i + 1;
                      const hasSession = hasLogOnDate(calYear, calMonth, d);
                      const todayCell = isToday(calYear, calMonth, d);
                      const sel = isSelected(d);
                      return (
                        <button key={d} onClick={() => setSelectedDate(sel ? null : d)} style={{ aspectRatio: "1", borderRadius: 8, border: `1.5px solid ${sel ? "#fff" : todayCell ? "#e85d04" : "#1a1a22"}`, background: sel ? "#fff" : todayCell ? "#e85d0422" : "transparent", color: sel ? "#000" : todayCell ? "#e85d04" : "#555", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: sel || todayCell ? 900 : 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: 0 }}>
                          {d}
                          {hasSession && <div style={{ position: "absolute", top: 1, right: 2, fontSize: 7, color: "#2d9e4e", fontWeight: 900 }}>✓</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Liste séances */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={S.sectionTitle}>Mes séances</div>
              <button onClick={() => { setEditingSeance(null); setShowSeanceModal(true); }} style={S.btn("#e85d04")}>+ Nouvelle</button>
            </div>

            {seances.length === 0 && (
              <div style={{ textAlign: "center", color: "#444", padding: "30px 0", fontSize: 14 }}>
                Aucune séance créée.<br />Lance ta première activité !
              </div>
            )}

            {seances.map(s => (
              <div key={s.id} style={S.planCard(s.color)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 1, marginBottom: 4 }}>{s.name}</div>
                    <span style={S.chip(s.color)}>{s.type}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setEditingSeance(s); setShowSeanceModal(true); }} style={{ background: "none", border: "1px solid #2a2a3a", borderRadius: 8, color: "#888", cursor: "pointer", padding: "4px 10px", fontFamily: "inherit", fontSize: 12 }}>✏️</button>
                    <button onClick={() => deleteSeance(s.id)} style={{ background: "none", border: "1px solid #2a2a3a", borderRadius: 8, color: "#d62839", cursor: "pointer", padding: "4px 10px", fontFamily: "inherit", fontSize: 12 }}>🗑</button>
                  </div>
                </div>

                {s.exercises.map(e => (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #1a1a22" }}>
                    <span style={{ fontSize: 16 }}>{e.icon}</span>
                    <span style={{ flex: 1, fontSize: 13, color: "#ccc" }}>{e.name}</span>
                    <span style={{ fontSize: 12, color: "#666" }}>
                      {e.unit === "velo" ? `⏱ ${e.duration || "—"} min` : e.unit === "reps" ? `${e.sets}×${e.reps}${e.weight > 0 ? ` @ ${e.weight}kg` : ""}` : `${e.reps} ${e.unit}`}
                    </span>
                  </div>
                ))}

                <button onClick={() => { setLogSession({ plan: s, exercises: s.exercises }); setShowLogModal(true); }}
                  style={{ ...S.btn(s.color), width: "100%", marginTop: 14, padding: "10px" }}>
                  ▶ Démarrer la séance
                </button>
                <button onClick={() => {
                  const quickSession = {
                    planId: s.id, planName: s.name, type: s.type, color: s.color,
                    exercises: s.exercises.map(e => ({ ...e, done: true, actualReps: e.reps, actualWeight: e.weight || 0, actualDist: e.reps, actualTime: e.duration || "", actualCalories: "" })),
                    photos: [], perf: {}
                  };
                  setLog([{ ...quickSession, id: generateId(), date: new Date().toISOString() }, ...log]);
                }} style={{ ...S.btn("#2d9e4e", true), width: "100%", marginTop: 8, padding: "8px", fontSize: 12 }}>
                  ✓ Valider directement
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── PROGRAMME TAB ─────────────────────── */}
        {tab === "planner" && (
          <div style={S.section}>

            {/* ── Calendrier semaine ── */}
            <div style={{ background: "#111118", borderRadius: 16, border: "1px solid #1e1e2e", padding: "16px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2, color: "#fff", textTransform: "uppercase", lineHeight: 1 }}>{MONTHS_FR[calMonth]}</div>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: 3 }}>{calYear}</div>
                </div>
                <button onClick={() => setCalExpanded(!calExpanded)} style={{ background: calExpanded ? "#88888822" : "#1a1a22", border: `1px solid ${calExpanded ? "#888" : "#2a2a3a"}`, borderRadius: 8, color: calExpanded ? "#888" : "#666", padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
                  {calExpanded ? "▲ Réduire" : "▼ Voir le mois"}
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 4 }}>
                {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: "#444", letterSpacing: 1, padding: "2px 0" }}>{d}</div>)}
              </div>

              {!calExpanded && (() => {
                const firstDay = getFirstDayOfMonth(calYear, calMonth);
                const allCells = [...Array(firstDay).fill(null), ...Array.from({ length: getDaysInMonth(calYear, calMonth) }, (_, i) => i + 1)];
                const weeks = [];
                for (let i = 0; i < allCells.length; i += 7) weeks.push(allCells.slice(i, i + 7));
                const activeWeekIdx = weeks.findIndex(w => w.some(d => d && isToday(calYear, calMonth, d)));
                const displayWeekIdx = selectedDate ? weeks.findIndex(w => w.includes(selectedDate)) : activeWeekIdx;
                const wi = displayWeekIdx >= 0 ? displayWeekIdx : activeWeekIdx >= 0 ? activeWeekIdx : 0;
                const displayWeek = weeks[wi] || [];
                return (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <button onClick={() => { const pw = weeks[wi - 1]; if (pw) { const d = pw.find(x => x); if (d) setSelectedDate(d); } else prevMonth(); }} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, padding: "2px 6px" }}>‹</button>
                      <span style={{ fontSize: 11, color: "#555", letterSpacing: 1 }}>Semaine {wi + 1}/{weeks.length}</span>
                      <button onClick={() => { const nw = weeks[wi + 1]; if (nw) { const d = nw.find(x => x); if (d) setSelectedDate(d); } else nextMonth(); }} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, padding: "2px 6px" }}>›</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                      {displayWeek.map((d, i) => {
                        if (!d) return <div key={i} />;
                        const dayIdx = getDateDayIdx(calYear, calMonth, d);
                        const dayPlans = plans.filter(p => p.days.includes(dayIdx));
                        const hasSession = hasLogOnDate(calYear, calMonth, d);
                        const todayCell = isToday(calYear, calMonth, d);
                        const sel = isSelected(d);
                        const has = dayPlans.length > 0;
                        return (
                          <button key={d} onClick={() => setSelectedDate(sel ? null : d)} style={{ aspectRatio: "1", borderRadius: 8, border: `1.5px solid ${sel ? "#fff" : todayCell ? "#888" : has ? "#88888866" : "#1a1a22"}`, background: sel ? "#fff" : todayCell ? "#88888822" : has ? "#88888811" : "transparent", color: sel ? "#000" : todayCell ? "#888" : has ? "#888" : "#555", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: sel || todayCell ? 900 : 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: 0, gap: 1 }}>
                            {d}
                            {has && !sel && <div style={{ display: "flex", gap: 2 }}>{dayPlans.slice(0, 3).map((p, pi) => <div key={pi} style={{ width: 4, height: 4, borderRadius: "50%", background: p.color }} />)}</div>}
                            {hasSession && <div style={{ position: "absolute", top: 1, right: 3, fontSize: 8, color: "#2d9e4e", fontWeight: 900 }}>✓</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {calExpanded && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <button onClick={prevMonth} style={{ background: "none", border: "1px solid #2a2a3a", borderRadius: 8, color: "#888", width: 30, height: 30, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                    <button onClick={nextMonth} style={{ background: "none", border: "1px solid #2a2a3a", borderRadius: 8, color: "#888", width: 30, height: 30, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                    {Array.from({ length: getFirstDayOfMonth(calYear, calMonth) }, (_, i) => <div key={`e-${i}`} />)}
                    {Array.from({ length: getDaysInMonth(calYear, calMonth) }, (_, i) => {
                      const d = i + 1;
                      const dayIdx = getDateDayIdx(calYear, calMonth, d);
                      const dayPlans = plans.filter(p => p.days.includes(dayIdx));
                      const hasSession = hasLogOnDate(calYear, calMonth, d);
                      const todayCell = isToday(calYear, calMonth, d);
                      const sel = isSelected(d);
                      const has = dayPlans.length > 0;
                      return (
                        <button key={d} onClick={() => setSelectedDate(sel ? null : d)} style={{ aspectRatio: "1", borderRadius: 8, border: `1.5px solid ${sel ? "#fff" : todayCell ? "#888" : has ? "#88888866" : "#1a1a22"}`, background: sel ? "#fff" : todayCell ? "#88888822" : has ? "#88888811" : "transparent", color: sel ? "#000" : todayCell ? "#888" : has ? "#888" : "#555", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: sel || todayCell ? 900 : 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: 0, gap: 1 }}>
                          {d}
                          {has && !sel && <div style={{ display: "flex", gap: 2 }}>{dayPlans.slice(0, 3).map((p, pi) => <div key={pi} style={{ width: 3, height: 3, borderRadius: "50%", background: p.color }} />)}</div>}
                          {hasSession && <div style={{ position: "absolute", top: 1, right: 2, fontSize: 7, color: "#2d9e4e", fontWeight: 900 }}>✓</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={S.sectionTitle}>Mes programmes</div>
              <button onClick={() => { setEditingPlan(null); setShowPlanModal(true); }} style={S.btn("#e85d04")}>+ Nouveau</button>
            </div>

            {plans.length === 0 && (
              <div style={{ textAlign: "center", color: "#444", padding: "40px 0", fontSize: 14 }}>
                Aucun programme.<br />Crée ton premier entraînement !
              </div>
            )}

            {plans.map(p => (
              <div key={p.id} style={S.planCard(p.color)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 1, marginBottom: 4 }}>{p.name}</div>
                    <span style={S.chip(p.color)}>{p.type}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setEditingPlan(p); setShowPlanModal(true); }} style={{ background: "none", border: "1px solid #2a2a3a", borderRadius: 8, color: "#888", cursor: "pointer", padding: "4px 10px", fontFamily: "inherit", fontSize: 12 }}>✏️</button>
                    <button onClick={() => deletePlan(p.id)} style={{ background: "none", border: "1px solid #2a2a3a", borderRadius: 8, color: "#d62839", cursor: "pointer", padding: "4px 10px", fontFamily: "inherit", fontSize: 12 }}>🗑</button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {DAYS.map((d, i) => (
                    <div key={i} style={{ background: p.days.includes(i) ? `${p.color}33` : "#1a1a22", color: p.days.includes(i) ? p.color : "#444", borderRadius: 6, padding: "3px 6px", fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>{d}</div>
                  ))}
                </div>

                {p.days.length > 0 && (
                  <div style={{ background: "#0a0a0f", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Suivi cette semaine</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {p.days.map(dayIdx => {
                        const checked = isChecked(p.id, dayIdx);
                        const isTodayDay = dayIdx === todayIdx;
                        return (
                          <button key={dayIdx} onClick={() => toggleCheck(p.id, dayIdx)} style={{ display: "flex", alignItems: "center", gap: 6, background: checked ? `${p.color}22` : "#1a1a22", border: `1.5px solid ${checked ? p.color : isTodayDay ? "#444" : "#2a2a3a"}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                            <div style={{ width: 16, height: 16, borderRadius: 4, background: checked ? p.color : "transparent", border: `2px solid ${checked ? p.color : "#444"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0, transition: "all 0.2s" }}>
                              {checked ? "✓" : ""}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 800, color: checked ? p.color : isTodayDay ? "#fff" : "#666", letterSpacing: 1 }}>
                              {FULL_DAYS[dayIdx].slice(0, 3).toUpperCase()}
                            </span>
                            {isTodayDay && !checked && <span style={{ fontSize: 9, color: "#e85d04", fontWeight: 800, letterSpacing: 1 }}>AUJOURD'HUI</span>}
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 11, color: "#555" }}>
                      {p.days.filter(d => isChecked(p.id, d)).length}/{p.days.length} séances complétées
                      {p.days.filter(d => isChecked(p.id, d)).length === p.days.length && p.days.length > 0 && <span style={{ marginLeft: 8, color: p.color, fontWeight: 700 }}>🏆 Semaine parfaite !</span>}
                    </div>
                  </div>
                )}

                {p.exercises.map(e => (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #1a1a22" }}>
                    <span style={{ fontSize: 16 }}>{e.icon}</span>
                    <span style={{ flex: 1, fontSize: 13, color: "#ccc" }}>{e.name}</span>
                    <span style={{ fontSize: 12, color: "#666" }}>
                      {e.unit === "velo" ? `⏱ ${e.duration || "—"} min` : e.unit === "reps" ? `${e.sets}×${e.reps}${e.weight > 0 ? ` @ ${e.weight}kg` : ""}` : `${e.reps} ${e.unit}`}
                    </span>
                  </div>
                ))}

                <button onClick={() => { setLogSession({ plan: p, exercises: p.exercises }); setShowLogModal(true); }} style={{ ...S.btn(p.color), width: "100%", marginTop: 14, padding: "10px" }}>
                  ▶ Démarrer la séance
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── LOG TAB ─────────────────────────── */}
        {tab === "log" && (
          <div style={S.section}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={S.sectionTitle}>Journal ({totalSessions})</div>
            </div>

            {log.length === 0 && (
              <div style={{ textAlign: "center", color: "#444", padding: "40px 0", fontSize: 14 }}>
                Aucune séance enregistrée.<br />Lance un programme pour commencer !
              </div>
            )}

            {log.map(s => {
              const d = new Date(s.date);
              const doneCount = s.exercises.filter(e => e.done).length;
              return (
                <div key={s.id} style={S.planCard(s.color)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 900 }}>{s.planName}</div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                        {d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                      </div>
                    </div>
                    <button onClick={() => setLog(log.filter(l => l.id !== s.id))} style={{ background: "none", border: "1px solid #2a2a3a", borderRadius: 8, color: "#d62839", cursor: "pointer", padding: "4px 10px", fontFamily: "inherit", fontSize: 12 }}>🗑</button>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <span style={S.chip(s.color)}>{s.type}</span>
                    <span style={{ ...S.chip("#2a2a3a"), color: "#888" }}>{doneCount}/{s.exercises.length} exercices</span>
                  </div>

                  {s.exercises.map(e => (
                    <div key={e.id} style={{ padding: "7px 0", borderBottom: "1px solid #1a1a22", opacity: e.done ? 1 : 0.45 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: e.unit === "velo" ? 5 : 0 }}>
                        <span>{e.done ? "✅" : "⬜"}</span>
                        <span style={{ flex: 1, fontSize: 12, color: "#ccc" }}>{e.icon} {e.name}</span>
                        {e.unit !== "velo" && (
                          <span style={{ fontSize: 11, color: "#666" }}>
                            {e.unit === "reps"
                              ? `${e.actualReps} reps${e.actualWeight > 0 ? ` @ ${e.actualWeight}kg` : ""}`
                              : `${e.actualDist} ${e.unit}`}
                          </span>
                        )}
                      </div>
                      {e.unit === "velo" && (
                        <div style={{ display: "flex", gap: 6, marginLeft: 24, flexWrap: "wrap" }}>
                          {e.duration && (
                            <div style={{ background: "#1a1a22", borderRadius: 6, padding: "3px 8px", fontSize: 11 }}>
                              <span style={{ color: "#555" }}>🎯 obj: </span>
                              <span style={{ color: "#888" }}>⏱ {e.duration} min</span>
                            </div>
                          )}
                          {(e.actualDist || e.actualTime || e.actualCalories) && (
                            <div style={{ background: e.done ? "#2d9e4e22" : "#1a1a22", border: `1px solid ${e.done ? "#2d9e4e44" : "transparent"}`, borderRadius: 6, padding: "3px 8px", fontSize: 11, display: "flex", gap: 6 }}>
                              {e.actualDist && <span style={{ color: "#ccc", fontWeight: 700 }}>📍 {e.actualDist} km</span>}
                              {e.actualTime && <span style={{ color: "#aaa" }}>⏱ {e.actualTime} min</span>}
                              {e.actualCalories && <span style={{ color: "#e85d04", fontWeight: 700 }}>🔥 {e.actualCalories} kcal</span>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {s.perf && Object.values(s.perf).some(v => v !== "" && v !== undefined) && (
                    <div style={{ marginTop: 12, background: "#0f0f18", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>📊 Performance</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {[
                          { key: "calories", label: "Calories", unit: "kcal", icon: "🔥" },
                          { key: "duration", label: "Durée", unit: "min", icon: "⏱" },
                          { key: "distance", label: "Distance", unit: "km", icon: "📍" },
                          { key: "avgSpeed", label: "Vit. moy.", unit: "km/h", icon: "⚡" },
                          { key: "maxSpeed", label: "Vit. max", unit: "km/h", icon: "🚀" },
                          { key: "avgHeartRate", label: "FC moy.", unit: "bpm", icon: "❤️" },
                          { key: "maxHeartRate", label: "FC max", unit: "bpm", icon: "💓" },
                          { key: "elevation", label: "Dénivelé", unit: "m", icon: "⛰️" },
                          { key: "rpe", label: "Effort", unit: "/10", icon: "💪" },
                          { key: "temperature", label: "Temp.", unit: "°C", icon: "🌡️" },
                        ].filter(f => s.perf[f.key] !== "" && s.perf[f.key] !== undefined).map(f => (
                          <div key={f.key} style={{ background: "#1a1a22", borderRadius: 8, padding: "5px 10px", fontSize: 12 }}>
                            <span style={{ marginRight: 4 }}>{f.icon}</span>
                            <span style={{ color: "#888" }}>{f.label}: </span>
                            <span style={{ fontWeight: 700, color: s.color }}>{s.perf[f.key]}</span>
                            <span style={{ color: "#555", fontSize: 10 }}> {f.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {s.photos && s.photos.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>📷 Photos</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                        {s.photos.map(p => (
                          <div key={p.id} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden" }}>
                            <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── STATS TAB ───────────────────────── */}
        {tab === "stats" && (
          <div style={S.section}>
            <div style={S.sectionTitle}>Progression</div>

            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <div style={S.statCard("#e85d04")}>
                <div style={{ ...S.statNum, color: "#e85d04" }}>{totalSessions}</div>
                <div style={S.statLabel}>Séances total</div>
              </div>
              <div style={S.statCard("#0096c7")}>
                <div style={{ ...S.statNum, color: "#0096c7" }}>{thisWeek}</div>
                <div style={S.statLabel}>Cette semaine</div>
              </div>
              <div style={S.statCard("#2d9e4e")}>
                <div style={{ ...S.statNum, color: "#2d9e4e" }}>{log.filter(s => { const d = new Date(s.date); const n = new Date(); return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth(); }).length}</div>
                <div style={S.statLabel}>Ce mois</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <div style={S.statCard("#7b2d8b")}>
                <div style={{ ...S.statNum, color: "#7b2d8b" }}>{log.filter(s => s.photos?.length > 0).length}</div>
                <div style={S.statLabel}>Avec photos</div>
              </div>
              <div style={S.statCard("#888")}>
                <div style={{ ...S.statNum, color: "#888" }}>{plans.length}</div>
                <div style={S.statLabel}>Programmes</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <div style={S.statCard("#c9a227")}>
                <div style={{ ...S.statNum, color: "#c9a227", fontSize: totalCalories > 9999 ? 24 : 36 }}>{totalCalories > 0 ? totalCalories.toLocaleString() : "—"}</div>
                <div style={S.statLabel}>Calories totales</div>
              </div>
              <div style={S.statCard("#d62839")}>
                <div style={{ ...S.statNum, color: "#d62839" }}>{log.filter(s => s.perf?.avgHeartRate).length > 0 ? Math.round(log.filter(s => s.perf?.avgHeartRate).reduce((a, s) => a + +s.perf.avgHeartRate, 0) / log.filter(s => s.perf?.avgHeartRate).length) : "—"}</div>
                <div style={S.statLabel}>FC moy. (bpm)</div>
              </div>
            </div>

            <div style={{ ...S.card, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14, letterSpacing: 1 }}>RÉPARTITION DES SÉANCES</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#e85d04" }}>🏋️ Musculation</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{muscleSessions}</span>
                </div>
                <div style={S.progressBar()}>
                  <div style={S.progressFill(totalSessions ? (muscleSessions / totalSessions) * 100 : 0, "#e85d04")} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#0096c7" }}>🏃 Cardio</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{cardioSessions}</span>
                </div>
                <div style={S.progressBar()}>
                  <div style={S.progressFill(totalSessions ? (cardioSessions / totalSessions) * 100 : 0, "#0096c7")} />
                </div>
              </div>
            </div>

            {/* Weekly chart */}
            <div style={{ ...S.card, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14, letterSpacing: 1 }}>ACTIVITÉ — 7 DERNIERS JOURS</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                {weekDays.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: "100%", height: d.hasLog ? 60 : 8, background: d.hasLog ? (d.isToday ? "#e85d04" : "#e85d0466") : "#1a1a22", borderRadius: 4, transition: "height 0.4s" }} />
                    <span style={{ fontSize: 9, color: d.isToday ? "#e85d04" : "#444", fontWeight: 800, letterSpacing: 1 }}>{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly chart */}
            <div style={S.card}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14, letterSpacing: 1 }}>ACTIVITÉ — CE MOIS</div>
              {(() => {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const monthLog = log.filter(s => {
                  const d = new Date(s.date);
                  return d.getFullYear() === year && d.getMonth() === month;
                });
                const activeDays = new Set(monthLog.map(s => new Date(s.date).getDate()));
                return (
                  <div>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 12 }}>
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const active = activeDays.has(day);
                        const isToday = day === now.getDate();
                        return (
                          <div key={day} style={{ width: "calc(14.28% - 3px)", aspectRatio: "1", borderRadius: 4, background: active ? "#e85d04" : isToday ? "#e85d0422" : "#1a1a22", border: `1px solid ${isToday ? "#e85d04" : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: active ? "#fff" : isToday ? "#e85d04" : "#444", fontWeight: 700 }}>
                            {day}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: 12, color: "#555" }}>
                      <span style={{ color: "#e85d04", fontWeight: 700 }}>{activeDays.size}</span> jour{activeDays.size > 1 ? "s" : ""} d'activité ce mois
                    </div>
                  </div>
                );
              })()}
            </div>

            {log.length === 0 && (
              <div style={{ textAlign: "center", color: "#444", padding: "20px 0", fontSize: 13 }}>
                Lance des séances pour voir tes stats s'afficher !
              </div>
            )}
          </div>
        )}

        {/* ── TIMER TAB ───────────────────────── */}
        {tab === "timer" && (
          <div style={{ ...S.section, textAlign: "center" }}>
            <div style={S.sectionTitle}>Chronomètre</div>

            {/* Mode toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28, justifyContent: "center" }}>
              {["stopwatch", "countdown"].map(m => (
                <button key={m} onClick={() => { setTimerMode(m); setTimerRunning(false); setTimerSeconds(m === "countdown" ? countdownInit : 0); }}
                  style={{ ...S.btn("#e85d04", timerMode !== m), fontSize: 12, padding: "8px 20px" }}>
                  {m === "stopwatch" ? "⏱ Chrono" : "⏳ Compte à rebours"}
                </button>
              ))}
            </div>

            {/* Circle */}
            <div style={S.timerCircle(timerPct)}>
              <div style={S.timerInner}>
                <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: 2, color: "#fff", lineHeight: 1 }}>{formatTime(timerSeconds)}</div>
                <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>
                  {timerMode === "countdown" ? "restant" : "écoulé"}
                </div>
              </div>
            </div>

            {/* Countdown presets */}
            {timerMode === "countdown" && (
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                {[30, 60, 90, 120, 180, 300].map(s => (
                  <button key={s} onClick={() => { setCountdownInit(s); setTimerSeconds(s); setTimerRunning(false); }}
                    style={{ background: countdownInit === s ? "#e85d0433" : "#1a1a22", border: `1.5px solid ${countdownInit === s ? "#e85d04" : "#2a2a3a"}`, borderRadius: 8, color: countdownInit === s ? "#e85d04" : "#888", padding: "6px 10px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 700 }}>
                    {s < 60 ? `${s}s` : `${s / 60}min`}
                  </button>
                ))}
              </div>
            )}

            {/* Controls */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setTimerRunning(!timerRunning)}
                style={{ ...S.btn("#e85d04"), padding: "14px 32px", fontSize: 18, minWidth: 120 }}>
                {timerRunning ? "⏸ Pause" : "▶ Start"}
              </button>
              <button onClick={() => { setTimerRunning(false); setTimerSeconds(timerMode === "countdown" ? countdownInit : 0); }}
                style={{ ...S.btn("#2a2a3a", true), padding: "14px 20px", fontSize: 18, borderColor: "#2a2a3a", color: "#888" }}>
                ↺
              </button>
            </div>

            {/* Rest presets */}
            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Repos muscu</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {[{ label: "Court", s: 45 }, { label: "Standard", s: 90 }, { label: "Long", s: 180 }].map(p => (
                  <button key={p.s} onClick={() => startCountdown(p.s)}
                    style={{ background: "#1a1a22", border: "1px solid #2a2a3a", borderRadius: 10, color: "#ccc", padding: "10px 18px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 700 }}>
                    {p.label}<br /><span style={{ color: "#666", fontWeight: 400 }}>{p.s}s</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={S.nav}>
        {[
          { id: "seance", icon: "▶", label: "Séance", color: "#e85d04" },
          { id: "planner", icon: "📅", label: "Programme", color: "#888" },
          { id: "log", icon: "📓", label: "Journal", color: "#e85d04" },
          { id: "stats", icon: "📊", label: "Progrès", color: "#e85d04" },
          { id: "timer", icon: "⏱", label: "Chrono", color: "#e85d04" },
        ].map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={S.navBtn(tab === n.id, n.color)}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      {/* Modals */}
      {showSeanceModal && (
        <SeanceModal seance={editingSeance} onSave={saveSeance} onClose={() => { setShowSeanceModal(false); setEditingSeance(null); }} />
      )}
      {showPlanModal && (
        <PlanModal plan={editingPlan} onSave={savePlan} onClose={() => { setShowPlanModal(false); setEditingPlan(null); }} />
      )}
      {showLogModal && logSession && (
        <LogModal session={logSession} onSave={saveSession} onClose={() => { setShowLogModal(false); setLogSession(null); }} onStartTimer={startCountdown} />
      )}
    </div>
  );
}
