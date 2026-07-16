import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  SafeAreaView, 
  StatusBar, 
  ActivityIndicator,
  Dimensions,
  Linking
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const { width, height } = Dimensions.get('window');

// 1. قاعدة بيانات القنوات والأقسام
const DATA = [
  {
    id: '1',
    category: 'قنوات رياضية',
    channels: [
      { id: '101', name: 'BEIN MAX 1 SD', logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300', url: 'http://sanstv.com:2052/live/02078356168270/JFQ9IXEDvsTOZrx/2159465.ts' },
      { id: '102', name: 'BEIN MAX 2 SD', logo: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=300', url: 'http://sanstv.com:2052/live/02078356168270/JFQ9IXEDvsTOZrx/2159466.ts' },
      { id: '103', name: 'BEIN MAX 3 SD', logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300', url: 'http://sanstv.com:2052/live/02078356168270/JFQ9IXEDvsTOZrx/2392071.ts' },
      { id: '104', name: 'BEIN MAX 4 SD', logo: 'https://images.unsplash.com/photo-1540747737956-378724044602?w=300', url: 'http://sanstv.com:2052/live/02078356168270/JFQ9IXEDvsTOZrx/2392072.ts' },
    ]
  },
  {
    id: '2',
    category: 'قنوات أطفال',
    channels: [
      { id: '201', name: 'سبيستون (Spacetoon)', logo: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
      { id: '202', name: 'كرتون نتورك (CN)', logo: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
      { id: '203', name: 'طيور الجنة', logo: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' }
    ]
  },
  {
    id: '3',
    category: 'قسم مسلسلات',
    channels: [
      { id: '301', name: 'مسلسل قيامة أرطغرل', logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
      { id: '302', name: 'مسلسل صراع العروش', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
      { id: '303', name: 'المسلسلات التاريخية', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' }
    ]
  },
  {
    id: '4',
    category: 'قسم أفلام',
    channels: [
      { id: '401', name: 'فيلم الأكشن والقتال', logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
      { id: '402', name: 'فيلم الخيال العلمي', logo: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
      { id: '403', name: 'سينما هوليوود HD', logo: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' }
    ]
  },
  {
    id: '5',
    category: 'قنوات إخبارية',
    channels: [
      { id: '501', name: 'الجزيرة الإخبارية', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
      { id: '502', name: 'العربية مباشر', logo: 'https://images.unsplash.com/photo-1495020689067-958852a6565d?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
    ]
  },
  {
    id: '6',
    category: 'قنوات إسلامية',
    channels: [
      { id: '601', name: 'قناة القرآن الكريم', logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
      { id: '602', name: 'قناة السنة النبوية', logo: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
    ]
  }
];

// المكون الذكي لمشغل الفيديو متجاوز الحظر والصيغ المعقدة
const VideoPlayerComponent = ({ url }) => {
  // نقوم بتمرير مصدر الفيديو ككائن تفصيلي يحتوي على الهوية (User-Agent) والنوعية (MimeType)
  const player = useVideoPlayer({
    uri: url,
    mimeType: 'video/mp2t', // إجبار أندرويد على قراءة البث كصيغة MPEG-TS فورية
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Connection': 'keep-alive'
    }
  }, (playerInstance) => {
    playerInstance.loop = false;
    playerInstance.play();
  });

  return (
    <VideoView 
      style={styles.fullVideo} 
      player={player} 
      allowsFullscreen 
      allowsPictureInPicture 
    />
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(DATA[0].category);
  const [activeChannel, setActiveChannel] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const openSocialLink = (url) => {
    setShowMenu(false);
    Linking.openURL(url).catch(err => console.error("Couldn't open link", err));
  };

  const currentChannels = DATA.find(item => item.category === selectedCategory)?.channels || [];

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0c0c0e" />
        <View style={styles.splashLogoContainer}>
          <Text style={styles.splashLogoText}>sur TV</Text>
          <Text style={styles.splashSubtitle}>بوابتك للبث المباشر الفاخر</Text>
        </View>
        <ActivityIndicator size="large" color="#00d2ff" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0c0e" />
      
      {activeChannel ? (
        <View style={styles.playerWrapper}>
          <VideoPlayerComponent url={activeChannel.url} />
          <View style={styles.playerInfoRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.liveDot} />
              <Text style={styles.activeChannelTitle}>{activeChannel.name}</Text>
            </View>
            <TouchableOpacity 
              style={styles.closePlayerButton} 
              onPress={() => setActiveChannel(null)}
            >
              <Text style={styles.closeButtonText}>إغلاق المشغل ✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.header}>
          <Text style={styles.headerLogo}>sur TV</Text>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => setShowMenu(!showMenu)}
          >
            <Text style={styles.menuButtonText}>☰ تواصل</Text>
          </TouchableOpacity>
        </View>
      )}

      {showMenu && (
        <View style={styles.menuDropdownContainer}>
          <Text style={styles.menuDropdownTitle}>روابط التواصل الاجتماعي</Text>
          
          <TouchableOpacity 
            style={styles.menuDropdownItem} 
            onPress={() => openSocialLink('https://t.me/surtv_official')}
          >
            <Text style={styles.menuDropdownItemText}>✈️ تليجرام (Telegram)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuDropdownItem} 
            onPress={() => openSocialLink('https://wa.me/212600000000')}
          >
            <Text style={styles.menuDropdownItemText}>💬 واتساب (WhatsApp)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuDropdownItem} 
            onPress={() => openSocialLink('https://facebook.com/surtv')}
          >
            <Text style={styles.menuDropdownItemText}>🔵 فيسبوك (Facebook)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuDropdownItem, { borderBottomWidth: 0 }]} 
            onPress={() => setShowMenu(false)}
          >
            <Text style={[styles.menuDropdownItemText, { color: '#ff003c', textAlign: 'center' }]}>✕ إغلاق القائمة</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isActive = item.category === selectedCategory;
            return (
              <TouchableOpacity 
                style={[styles.categoryTab, isActive && styles.activeCategoryTab]}
                onPress={() => {
                  setSelectedCategory(item.category);
                  setShowMenu(false);
                }}
              >
                <Text style={[styles.categoryTabText, isActive && styles.activeCategoryTabText]}>
                  {item.category}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      <View style={styles.channelsContainer}>
        <FlatList
          data={currentChannels}
          keyExtractor={(item) => item.id}
          numColumns={2}
          key={selectedCategory} 
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.channelCard}
              onPress={() => {
                setActiveChannel(item);
                setShowMenu(false);
              }}
              activeOpacity={0.8}
            >
              <Image 
                source={{ uri: item.logo }} 
                style={styles.channelLogo} 
                resizeMode="cover"
              />
              <View style={styles.channelInfo}>
                <Text style={styles.channelName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.liveIndicatorContainer}>
                  <View style={styles.greenDot} />
                  <Text style={styles.liveText}>بث مباشر</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0e',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#0c0c0e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogoContainer: {
    alignItems: 'center',
  },
  splashLogoText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#00d2ff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 210, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  splashSubtitle: {
    fontSize: 16,
    color: '#a0a0a5',
    marginTop: 10,
    fontWeight: '300',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a22',
  },
  headerLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00d2ff',
  },
  menuButton: {
    backgroundColor: '#ff003c',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#ff003c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  menuDropdownContainer: {
    position: 'absolute',
    top: 65,
    left: 20,
    backgroundColor: '#121214',
    borderWidth: 1.5,
    borderColor: '#ff003c',
    borderRadius: 12,
    width: width * 0.6,
    zIndex: 9999,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  menuDropdownTitle: {
    color: '#a0a0a5',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f26',
    paddingBottom: 6,
  },
  menuDropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f26',
  },
  menuDropdownItemText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  playerWrapper: {
    width: '100%',
    backgroundColor: '#000',
  },
  fullVideo: {
    width: '100%',
    height: 220,
  },
  playerInfoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121214',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a22',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff003c',
    marginLeft: 8,
  },
  activeChannelTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  closePlayerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeButtonText: {
    color: '#ff003c',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    marginVertical: 15,
  },
  categoryTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#16161a',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#22222b',
  },
  activeCategoryTab: {
    backgroundColor: '#00d2ff',
    borderColor: '#00d2ff',
  },
  categoryTabText: {
    color: '#a0a0a5',
    fontSize: 13,
    fontWeight: 'bold',
  },
  activeCategoryTabText: {
    color: '#0c0c0e',
  },
  channelsContainer: {
    flex: 1,
  },
  channelCard: {
    flex: 1,
    backgroundColor: '#121214',
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f1f26',
    elevation: 3,
  },
  channelLogo: {
    width: '100%',
    height: 100,
    backgroundColor: '#1f1f26',
  },
  channelInfo: {
    padding: 10,
    alignItems: 'flex-end',
  },
  channelName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  liveIndicatorContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4caf50',
    marginLeft: 5,
  },
  liveText: {
    color: '#4caf50',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
