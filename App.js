import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import axios from 'axios';

const App = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [maxItems, setMaxItems] = useState(1000);

  useEffect(() => {
    fetchMoreData();
  }, []);

  const fetchMoreData = async () => {
    if (isLoading || items.length >= maxItems) return;
    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://picsum.photos/v2/list?page=${page}&limit=50`
      );
      if (response.status === 200) {
        setItems(prevItems => [...prevItems, ...response.data]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Text>No more items</Text>
      )}
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Image source={{ uri: `https://picsum.photos/id/${index}/100/100` }} style={{ width: 100, height: 100 }} />
      <Text style={styles.text}>Image by {item.author}</Text>
    </View>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ListFooterComponent={renderFooter}
      onEndReached={fetchMoreData}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
