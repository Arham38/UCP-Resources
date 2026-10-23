import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const POSTS = [
  { id: '1', user: 'ali_dev', avatar: 'https://i.pravatar.cc/150?img=11', image: 'https://picsum.photos/400/400?random=1', likes: 120, caption: 'Just deployed my first React Native app! 🚀' },
  { id: '2', user: 'design_guru', avatar: 'https://i.pravatar.cc/150?img=32', image: 'https://picsum.photos/400/400?random=2', likes: 85, caption: 'Exploring UI/UX trends for 2026. 🎨' },
  { id: '3', user: 'tech_bro', avatar: 'https://i.pravatar.cc/150?img=68', image: 'https://picsum.photos/400/400?random=3', likes: 210, caption: 'Coffee and coding. Perfect combination ☕💻' },
];

export default function HomeScreen() {
  const renderPost = ({ item }: { item: typeof POSTS[0] }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.user}</Text>
        <Feather name="more-horizontal" size={20} color="black" style={{ marginLeft: 'auto' }} />
      </View>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postActions}>
        <TouchableOpacity><Feather name="heart" size={24} color="black" style={styles.actionIcon} /></TouchableOpacity>
        <TouchableOpacity><Feather name="message-circle" size={24} color="black" style={styles.actionIcon} /></TouchableOpacity>
        <TouchableOpacity><Feather name="send" size={24} color="black" style={styles.actionIcon} /></TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 'auto' }}><Feather name="bookmark" size={24} color="black" /></TouchableOpacity>
      </View>
      <Text style={styles.likes}>{item.likes} likes</Text>
      <Text style={styles.caption}><Text style={styles.captionUser}>{item.user}</Text> {item.caption}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SocialApp</Text>
        <Feather name="bell" size={24} color="black" />
      </View>
      <FlatList data={POSTS} keyExtractor={(item) => item.id} renderItem={renderPost} showsVerticalScrollIndicator={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  postContainer: { marginBottom: 20 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: 'bold', fontSize: 16 },
  postImage: { width: '100%', height: 400 },
  postActions: { flexDirection: 'row', padding: 10 },
  actionIcon: { marginRight: 15 },
  likes: { fontWeight: 'bold', paddingHorizontal: 10, marginBottom: 5 },
  caption: { paddingHorizontal: 10, color: '#333' },
  captionUser: { fontWeight: 'bold' },
});