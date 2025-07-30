import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView, TouchableOpacity } from 'react-native';

// Importa 'Camera' para permissões e 'CameraView' para o componente JSX
import { Camera, CameraView } from "expo-camera"; 
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const cameraRef = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);
  // O vídeo gravado terá uma propriedade 'uri' que usaremos
  const [video, setVideo] = useState<{ uri: string } | undefined>();

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);

  useEffect(() => {
    (async () => {
      // Usa o módulo 'Camera' para solicitar as permissões
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  // Funções para controlar a gravação
  const recordVideo = async () => {
    if (!cameraRef.current) return;
    
    setIsRecording(true);
    try {
      const videoRecordPromise = cameraRef.current.recordAsync();
      if (videoRecordPromise) {
        const data = await videoRecordPromise;
        setVideo(data);
      }
    } catch (e) {
      console.error("Erro ao gravar vídeo:", e);
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };
  
  // Funções para manipular o vídeo após a gravação
  const saveVideo = () => {
    if (video) {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        alert("Vídeo salvo!");
        setVideo(undefined);
      });
    }
  };

  const shareVideo = () => {
    if (video) {
      shareAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    }
  };

  const discardVideo = () => {
    setVideo(undefined);
  };
  
  // Renderização condicional baseada nas permissões
  if (hasCameraPermission === false || hasMicrophonePermission === false) {
    return <Text style={styles.text}>App requer permissão de câmera e microfone.</Text>;
  }

  if (hasMediaLibraryPermission === false) {
    return <Text style={styles.text}>App requer permissão da biblioteca de mídias.</Text>;
  }

  // Se um vídeo foi gravado, mostra a tela de pré-visualização
  if (video) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Pré-visualização</Text>
        {/* Aqui você poderia adicionar um componente de player de vídeo */}
        {/* <Video source={{ uri: video.uri }} /> */}
        <View style={styles.menuButtonContainer}>
          <Button title="Compartilhar" onPress={shareVideo} />
          <Button title="Salvar" onPress={saveVideo} />
          <Button title="Descartar" onPress={discardVideo} />
        </View>
      </SafeAreaView>
    );
  }

  // Tela principal da câmera com o botão de gravação
  return (
    <View style={styles.container}>
      {/* A prop correta para a referência é 'ref' */}
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.recordButton} 
            onPress={isRecording ? stopRecording : recordVideo}
          >
            {/* O estilo deste View muda para criar o efeito de "gravar/parar" */}
            <View style={isRecording ? styles.stopButtonInner : styles.recordButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  recordButtonInner: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#ff4343',
  },
  stopButtonInner: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#ff4343',
  },
  menuButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  }
});