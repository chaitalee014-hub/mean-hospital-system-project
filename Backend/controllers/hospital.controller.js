import Hospital from "../models/hospital.model.js";

export const addHospital = async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json({ message: "Hospital added", hospital });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
