import Doctor from "../models/doctor.model.js";

export const chatbotReply = async (req, res) => {
  try {

    const msg = (req.body.message || "").toLowerCase();

    if (!msg) {
      return res.json({ reply: "Please type something." });
    }

    // ================= GREETING =================
    if (/hi|hello|hey/.test(msg)) {
      return res.json({
        reply: `👋 Hello!
Welcome to CityCare Hospital.

How can I assist you today?
👉 You can ask about:
• Doctors
• Appointment
• Emergency
• Treatments`
      });
    }

    // ================= THANK YOU =================
    if (/thank|thanks/.test(msg)) {
      return res.json({
        reply: "🙏 You're welcome! Stay healthy 😊"
      });
    }

    // ================= APPOINTMENT =================
    if (/appointment|book|booking|schedule/.test(msg)) {
      return res.json({
        reply: `📅 Appointment Booking Steps:

1️⃣ Login / Register  
2️⃣ Select Doctor  
3️⃣ Choose Date & Time  
4️⃣ Confirm Booking  

✅ Benefits:
• No waiting
• Easy scheduling
• Instant confirmation`
      });
    }

    // ================= EMERGENCY =================
    if (/emergency|urgent/.test(msg)) {
      return res.json({
        reply: `🚑 Emergency Help:

👉 Click Emergency button  
👉 Nearby doctors get alert  
👉 Quick response system  

⚡ Use in critical situations only`
      });
    }

    // ================= SYMPTOMS → DOCTOR =================
    if (/chest|heart/.test(msg)) {
      return res.json({
        reply: `💡 Chest pain detected

👉 Recommended: Cardiologist  

⚠️ Don't ignore:
• Severe pain
• Breathing issue  

➡️ Book appointment immediately`
      });
    }

    if (/skin|pimple|rash/.test(msg)) {
      return res.json({
        reply: `💡 Skin issue

👉 Recommended: Dermatologist  

➡️ Book consultation for proper treatment`
      });
    }

    // ================= DOCTOR SEARCH =================
    // ================= DOCTOR SEARCH =================
if (/doctor|specialist|cardio|heart|neuro|brain|gyne|skin|derma|ortho|bone|child|pediatric/.test(msg)) {

  let specialization = "";

  if (/cardio|heart/.test(msg)) specialization = "cardiologist";
  else if (/neuro|brain/.test(msg)) specialization = "neurologist";
  else if (/gyne/.test(msg)) specialization = "gynecologist";
  else if (/skin|derma/.test(msg)) specialization = "dermatologist";
  else if (/ortho|bone/.test(msg)) specialization = "orthopedic";
  else if (/child|pediatric/.test(msg)) specialization = "pediatrician";

  let doctors;

  if (specialization) {
    doctors = await Doctor.find({
      specialization: new RegExp(specialization, "i")
    });
  } else {
    doctors = await Doctor.find(); // all doctors
  }

  if (!doctors.length) {
    return res.json({
      reply: `❌ No ${specialization || ""} doctors available at the moment.`
    });
  }

  const list = doctors.map(d => `
👨‍⚕️ Dr. ${d.name}
🩺 Specialization: ${d.specialization}
⭐ Experience: ${d.experience || "N/A"} years}
  `).join("\n\n");

  return res.json({
    reply: `👨‍⚕️ Available ${specialization || "Doctors"}:\n${list}`
  });
}
    // ================= HOSPITAL INFO =================
    if (/hospital|about|chairman/.test(msg)) {
      return res.json({
        reply: `🏥 CityCare Hospital

📍 Location: Ahmedabad  
👨‍⚕️ Chairman: Dr XYZ  

💡 Specialties:
• Cardiology  
• Neurology  
• Pediatrics  

🏆 Centre of Excellence:
• Robotic Surgery  
• Advanced ICU  
• AI Diagnostics`
      });
    }

    // ================= DEFAULT =================
    return res.json({
      reply: `🤖 I can help you with:

• Doctor search  
• Appointment booking  
• Emergency  
• Hospital info  

👉 Try asking something specific`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
};