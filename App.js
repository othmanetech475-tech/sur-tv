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
  Dimensions
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const { width } = Dimensions.get('window');

// 1. قاعدة بيانات القنوات والأقسام (يمكنك تعديلها وإضافة قنواتك الخاصة هنا)
const DATA = [
  {
    id: '1',
    category: 'قنوات رياضية',
    channels: [
      { id: '101', name: 'beIN SPORTS HD', logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
      { id: '102', name: 'SSC Sports', logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
    ]
  },
  {
    id: '2',
    category: 'قنوات إخبارية',
    channels: [
      { id: '201', name: 'الجزيرة الإخبارية', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
      { id: '202', name: 'العربية مباشر', logo: 'https://images.unsplash.com/photo-1495020689067-958852a6565d?w=150', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
    ]
  },
  {
    id: '3',
    category: 'قنوات إسلامية',
    channels: [
      { id: '301', name: 'قناة القرآن الكريم', logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
      { id: '302', name: 'قناة السنة النبوية', logo: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=150', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
    ]
  }
];

// مكون مشغل الفيديو المستقل لمنع إعادة التحميل العشوائي
const VideoPlayerComponent = ({ url }) => {
  const player = useVideoPlayer(url, (playerInstance) => {
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

  // إخفاء الشاشة الترحيبية بعد 3 ثوانٍ تلقائياً
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // تصفية القنوات بناءً على القسم النشط
  const currentChannels = DATA.find(item => item.category === selectedCategory)?.channels || [];

  // 1. عرض واجهة الشاشة الترحيبية الأنيقة (Splash Screen)
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

  // 2. عرض الواجهة الرئيسية للتطبيق (بعد تصفح الأقسام والقنوات)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0c0e" />
      
      {/* مشغل الفيديو الديناميكي (يظهر فقط عند اختيار قناة) */}
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
        /* هيدر التطبيق (يظهر فقط في وضع التصفح) */
        <View style={styles.header}>
          <Text style={styles.headerLogo}>sur TV</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>مباشر</Text>
          </View>
        </View>
      )}

      {/* قائمة الأقسام (أفقية للتنقل السريع) */}
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
                onPress={() => setSelectedCategory(item.category)}
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

      {/* شبكة القنوات التابعة للقسم المختار */}
      <View style={styles.channelsContainer}>
        <FlatList
          data={currentChannels}
          keyExtractor={(item) => item.id}
          numColumns={2}
          key={selectedCategory} // لإعادة تهيئة القائمة بسلاسة عند تغيير القسم
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.channelCard}
              onPress={() => setActiveChannel(item)}
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

// التنسيقات الجمالية والألوان النيونية والداكنة
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0e',
  },
  // تنسيقات الشاشة الترحيبية
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
  // الهيدر
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
  headerBadge: {
    backgroundColor: '#ff003c',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // مشغل الفيديو العلوي
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
  // تصنيفات الأقسام
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
  // قائمة القنوات الشبكية
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
