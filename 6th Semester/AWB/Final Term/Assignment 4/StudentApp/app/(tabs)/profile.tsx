import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const USER_POSTS = Array.from({ length: 15 }).map((_, i) => ({
  id: String(i),
  image: `https://picsum.photos/200/200?random=${i + 50}`,
}));

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>@arham_dev</Text>
        <Feather name="menu" size={24} color="black" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=60' }} style={styles.profileAvatar} />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}><Text style={styles.statNumber}>15</Text><Text style={styles.statLabel}>Posts</Text></View>
            <View style={styles.statItem}><Text style={styles.statNumber}>2.5k</Text><Text style={styles.statLabel}>Followers</Text></View>
            <View style={styles.statItem}><Text style={styles.statNumber}>300</Text><Text style={styles.statLabel}>Following</Text></View>
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.name}>Arham</Text>
          <Text style={styles.bio}>Software Engineer 💻 | UI/UX Enthusiast 🎨</Text>
          <Text style={styles.link}>github.com/arham</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton}><Text style={styles.editButtonText}>Edit Profile</Text></TouchableOpacity>
          <TouchableOpacity style={styles.editButton}><Text style={styles.editButtonText}>Share Profile</Text></TouchableOpacity>
        </View>

        <FlatList
          data={USER_POSTS}
          numColumns={3}
          keyExtractor={(item) => item.id}
          scrollEnabled={false} // Since it's inside a ScrollView
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.postGridImage} />
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10 },
  username: { fontSize: 20, fontWeight: 'bold' },
  profileInfo: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, marginRight: 20 },
  statsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 14, color: '#666' },
  bioContainer: { paddingHorizontal: 20, marginTop: 15 },
  name: { fontWeight: 'bold', fontSize: 16 },
  bio: { marginTop: 3, color: '#333' },
  link: { color: '#00376b', marginTop: 3 },
  buttonContainer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 15, marginBottom: 15, gap: 10 },
  editButton: { flex: 1, backgroundColor: '#efefef', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  editButtonText: { fontWeight: 'bold', color: '#333' },
  postGridImage: { width: '33.33%', height: 130, borderWidth: 1, borderColor: '#fff' },
});