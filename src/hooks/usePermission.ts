import { useState, useCallback, useEffect } from "react";

type PermissionState = "granted" | "denied" | "prompt" | "unavailable";

interface UsePermissionsReturn {
  cameraStatus: PermissionState;
  audioStatus: PermissionState;
  cameraGranted: boolean; // Tambahkan computed boolean
  microphoneGranted: boolean; // Tambahkan computed boolean
  requestPermissions: (type: "camera" | "audio" | "both") => Promise<void>;
  checkPermissions: () => Promise<void>;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [cameraStatus, setCameraStatus] = useState<PermissionState>("prompt");
  const [audioStatus, setAudioStatus] = useState<PermissionState>("prompt");

  // Computed boolean values
  const cameraGranted = cameraStatus === "granted";
  const microphoneGranted = audioStatus === "granted";

  const checkPermissions = useCallback(async () => {
    try {
      // Check camera permission
      const cameraPerm = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      setCameraStatus(cameraPerm.state);
      cameraPerm.onchange = () => setCameraStatus(cameraPerm.state);

      // Check microphone permission
      const audioPerm = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      setAudioStatus(audioPerm.state);
      audioPerm.onchange = () => setAudioStatus(audioPerm.state);
    } catch (e) {
      console.error("Permission API not fully supported:", e);
      // Fallback: set to prompt if API not supported
      setCameraStatus("prompt");
      setAudioStatus("prompt");
    }
  }, []);

  const requestPermissions = useCallback(
    async (type: "camera" | "audio" | "both") => {
      const constraints: MediaStreamConstraints = {};
      if (type === "camera" || type === "both") constraints.video = true;
      if (type === "audio" || type === "both") constraints.audio = true;

      try {
        if (Object.keys(constraints).length > 0) {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          // Stop the stream immediately, we only needed it for permission
          stream.getTracks().forEach((track) => track.stop());

          // Check permissions again after request
          await checkPermissions();
        }
      } catch (err) {
        console.error("Error requesting permissions:", err);
        // Update status based on error
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          if (type === "camera" || type === "both") setCameraStatus("denied");
          if (type === "audio" || type === "both") setAudioStatus("denied");
        }
      }
    },
    [checkPermissions]
  );

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    cameraStatus,
    audioStatus,
    cameraGranted,
    microphoneGranted,
    requestPermissions,
    checkPermissions,
  };
};
