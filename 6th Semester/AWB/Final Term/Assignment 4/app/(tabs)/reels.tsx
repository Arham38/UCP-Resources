import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

export default function ReelsScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop' }} 
        style={styles.videoBackground} 
      />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Reels</Text>
          <Feather name="camera" size={28} color="white" />
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.userInfo}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
            <Text style={styles.username}>@fitness_freak</Text>
            <TouchableOpacity style={styles.followButton}><Text style={styles.followText}>Follow</Text></TouchableOpacity>
          </View>
          <Text style={styles.description}>Morning workout routine! 💪🔥 #fitness #gym</Text>
        </View>

        <View style={styles.actionColumn}>
          <View style={styles.actionItem}><Feather name="heart" size={30} color="white" /><Text style={styles.actionText}>12k</Text></View>
          <View style={styles.actionItem}><Feather name="message-circle" size={30} color="white" /><Text style={styles.actionText}>450</Text></View>
          <View style={styles.actionItem}><Feather name="send" size={30} color="white" /><Text style={styles.actionText}>Share</Text></View>
          <View style={styles.actionItem}><Feather name="more-vertical" size={30} color="white" /></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoBackground: { width: width, height: height, position: 'absolute', opacity: 0.8 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  bottomSection: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { color: 'white', fontWeight: 'bold', fontSize: 16, marginRight: 10 },
  followButton: { borderWidth: 1, borderColor: 'white', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  followText: { color: 'white', fontSize: 12 },
  description: { color: 'white', fontSize: 14, width: '80%' },
  actionColumn: { position: 'absolute', bottom: 40, right: 20, alignItems: 'center' },
  actionItem: { alignItems: 'center', marginBottom: 20 },
  actionText: { color: 'white', fontSize: 12, marginTop: 5 },
});