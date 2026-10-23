import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const PRODUCTS = [
  { id: '1', name: 'Wireless Headphones', price: '$99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
  { id: '2', name: 'Smart Watch Series 8', price: '$299', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500' },
  { id: '3', name: 'Gaming Mouse', price: '$45', image: 'https://images.unsplash.com/photo-1527814050087-379381547969?w=500' },
  { id: '4', name: 'Mechanical Keyboard', price: '$120', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500' },
];

export default function ShopScreen() {
  const renderItem = ({ item }: { item: typeof PRODUCTS[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Tech Shop</Text>
      <FlatList 
        data={PRODUCTS} 
        renderItem={renderItem} 
        keyExtractor={(item) => item.id} 
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 50 },
  headerText: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 10 },
  card: { flex: 1, backgroundColor: '#fff', margin: 5, borderRadius: 10, padding: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  productImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 10 },
  productName: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  productPrice: { fontSize: 14, color: 'tomato', marginVertical: 5 },
  buyButton: { backgroundColor: 'tomato', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 5, marginTop: 5 },
  buyButtonText: { color: '#fff', fontWeight: 'bold' }
});