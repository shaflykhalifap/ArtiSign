import { useState, useCallback } from "react";

type PermissionState = "granted" | "denied" | "prompt" | "unavailable";
type RequestedPermission = "camera" | "audio";

interface UsePermissionsReturn {
  cameraStatus: PermissionState;
  audioStatus: PermissionState;
  requestPermissions: (type: "camera" | "audio" | "both") => Promise<void>;
  checkPermissions: () => Promise<void>; // Untuk memeriksa status awal
}

export const usePermissions = (): UsePermissionsReturn => {
  const [cameraStatus, setCameraStatus] = useState<PermissionState>("prompt");
  const [audioStatus, setAudioStatus] = useState<PermissionState>("prompt");

  const checkPermissions = useCallback(async () => {
    try {
      const cameraPerm = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      setCameraStatus(cameraPerm.state);
      cameraPerm.onchange = () => setCameraStatus(cameraPerm.state);

      const audioPerm = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      setAudioStatus(audioPerm.state);
      audioPerm.onchange = () => setAudioStatus(audioPerm.state);
    } catch (e) {
      console.error(
        "Permission API not fully supported or error checking permissions.",
        e
      );
    }
  }, []);

  const requestPermissions = useCallback(
    async (type: "camera" | "audio" | "both") => {
      const constraints: MediaStreamConstraints = {};
      if (type === "camera" || type === "both") constraints.video = true;
      if (type === "audio" || type === "both") constraints.audio = true;

      try {
        if (Object.keys(constraints).length > 0) {
          await navigator.mediaDevices.getUserMedia(constraints);
          // Jika berhasil, status akan otomatis update via Permission API onchange
          // atau panggil checkPermissions lagi jika tidak menggunakan onchange
        }
      } catch (err) {
        console.error("Error requesting permissions:", err);
        // Status akan otomatis update ke 'denied' via Permission API onchange
        // atau panggil checkPermissions lagi
      } finally {
        await checkPermissions();
      }
    },
    [checkPermissions]
  );

  return { cameraStatus, audioStatus, requestPermissions, checkPermissions };
};
