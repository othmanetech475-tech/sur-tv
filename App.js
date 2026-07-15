import React from 'react';
import { StyleSheet, View, Text, StatusBar, SafeAreaView } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function App() {
  const videoSource = "http://sanstv.com:2052/live/02078356168270/JFQ9IXEDvsTOZrx/2392114.ts";

  // استخدام الصيغة المحدثة والمتوافقة مع SDK 52
  const player = useVideoPlayer({ uri: videoSource }, player => {
    player.loop = false;
    player.play();
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>sur TV</Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.playerWrapper}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          startsPictureInPictureAutomatically
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.streamTitle}>البث المباشر المخصص</Text>
        <Text style={styles.streamStatus}>حالة الاتصال: مستقر وضمن التطبيق ✅</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c0c0e' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#1f1f23' },
  headerTitle: { color: '#00d2ff', fontSize: 22, fontWeight: 'bold' },
  liveBadge: { backgroundColor: '#ff003c', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 },
  liveText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  playerWrapper: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  detailsContainer: { padding: 20 },
  streamTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  streamStatus: { color: '#a0a0a5', fontSize: 14 },
});
