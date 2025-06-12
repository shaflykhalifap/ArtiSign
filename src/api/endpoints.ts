import axiosInstance from "./axiosInstance";

//* Endpoints for the API

//| GET Methods
const getHealthCheck = async () => {
  try {
    const response = await axiosInstance.get("/api/health");

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getLetters = async () => {
  try {
    const response = await axiosInstance.get("/api/available-letters");

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getWords = async () => {
  try {
    const response = await axiosInstance.get("/api/available-words");

    return response.data;
  } catch (error) {
    console.error("Error fetching words:", error);
    throw error;
  }
};

//| POST Methods
const postPredictStatic = async (landmarks: number[]) => {
  try {
    const response = await axiosInstance.post("/api/predict-static-sign", {
      landmarks: landmarks,
    });

    return response.data;
  } catch (error) {
    console.error("Error posting prediction:", error);
    throw error;
  }
};

const postPredictDynamic = async (
  landmarkSequence: number[][],
  modelChoice: "transformer" | "lstm" = "transformer"
) => {
  try {
    const response = await axiosInstance.post("/api/predict-dynamic-sign", {
      landmark_sequence: landmarkSequence,
      model_choice: modelChoice,
    });

    return response.data;
  } catch (error) {
    console.error("Error posting dynamic prediction:", error);
    throw error;
  }
};

const postTextToSign = async (text: string) => {
  try {
    const response = await axiosInstance.post("/api/text-to-sign", {
      text: text,
    });

    return response.data;
  } catch (error) {
    console.error("Error posting text to sign:", error);
    throw error;
  }
};

const postUpload = async () => {
  try {
    const response = await axiosInstance.post("/api/upload");

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export {
  getLetters,
  getWords,
  getHealthCheck,
  postPredictStatic,
  postPredictDynamic,
  postTextToSign,
  postUpload,
};
