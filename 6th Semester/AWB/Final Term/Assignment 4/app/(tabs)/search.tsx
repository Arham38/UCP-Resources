import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const numColumns = 3;
const windowWidth = Dimensions.get('window').width;
const imageSize = windowWidth / numColumns;

const EXPLORE_DATA = Array.from({ length: 24 }).map((_, i) => ({
  id: String(i),
  image: `https://picsum.photos/200/200?random=${i + 10}`,
}));

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#666" />
          <TextInput placeholder="Search users, tags, places..." style={styles.searchInput} placeholderTextColor="#666" />
        </View>
      </View>
      <FlatList
        data={EXPLORE_DATA}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.gridImage} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  searchHeader: { paddingHorizontal: 10, paddingBottom: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 10, height: 40 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  gridImage: { width: imageSize, height: imageSize, borderWidth: 1, borderColor: '#fff' },
});