import axiosInstance from "./axiosInstance";

//* Endpoints for the API

//| GET Methods
const getHealthCheck = async () => {
  try {
    const response = await axiosInstance.get("/api/health");

    console.log("Health check response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching health check:", error);
    throw error;
  }
};

const getLetters = async () => {
  try {
    const response = await axiosInstance.get("/api/available-letters");

    console.log("Fetched letters:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching letters:", error);
    throw error;
  }
};

const getWords = async () => {
  try {
    const response = await axiosInstance.get("/api/available-words");

    console.log("Fetched words:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching words:", error);
    throw error;
  }
};

//| POST Methods
const postPredictStatic = async () => {
  try {
    const response = await axiosInstance.post("/api/predict-static-sign");

    console.log("Prediction response:", response.data);
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

    console.log("Dynamic prediction response:", response.data);
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

    console.log("Text to sign response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error posting text to sign:", error);
    throw error;
  }
};

const postUpload = async () => {
  try {
    const response = await axiosInstance.post("/api/upload");

    console.log("File upload response:", response.data);
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
