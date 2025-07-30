import {CameraView} from "expo-camera"
import React from "react";


export interface CameraViewProps{
    cameraRef: React.RefObject<CameraView>;
    isRecording: boolean;
    onRecord: () => void;
    onStopRecord: () => void;
}