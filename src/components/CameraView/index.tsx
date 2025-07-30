import React from "react";
import {Text, TouchableOpacity, View} from "react-native";

import {CameraViewProps} from "./props"
import { styles } from "./styles"
import { Camera, CameraView } from "expo-camera";



export default function cameraView({
    cameraRef,
    isRecording,
    onRecord,
    onStopRecord,
}: CameraViewProps){
    return (
        <CameraView style={styles.container} ref={cameraRef}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                onPress={isRecording ? onStopRecord : onRecord}
                style={styles.buttonRecord}>
                    <Text style={styles.buttonText}>
                        {isRecording ? "Stop Recordig" : "Start Recordng"}
                    </Text>
                </TouchableOpacity>
            </View>
        </CameraView>







    ); 
}