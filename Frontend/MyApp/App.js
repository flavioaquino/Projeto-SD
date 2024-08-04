import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const App = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://projeto-sd.onrender.com/produtos');
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addItem = async () => {
    try {
      const newItem = { id: Date.now(), nome: name, preco: parseFloat(price), quantidade: parseInt(quantity) };
      await axios.post('https://projeto-sd.onrender.com/produtos', newItem);
      fetchItems();
      setName('');
      setPrice('');
      setQuantity('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://projeto-sd.onrender.com/produtos/${id}`);
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  const editQuantity = async (id) => {
    try {
      const updatedItem = { ...selectedItem, quantidade: parseInt(quantity) };
      await axios.put(`https://projeto-sd.onrender.com/produtos/${id}`, updatedItem);
      fetchItems();
      setSelectedItem(null);
      setQuantity('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter item price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter item quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <Button title="Add Item" onPress={addItem} />
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setSelectedItem(item)}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{item.nome}</Text>
              <Text style={styles.itemPrice}>{parseFloat(item.preco).toFixed(2)} R$</Text>
              <Text style={styles.itemQuantity}>{item.quantidade}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {selectedItem && (
        <View style={styles.buttonsContainer}>
          <Button title="Edit Quantity" onPress={() => editQuantity(selectedItem.id)} />
          <Button
            title="Delete Product"
            onPress={() => {
              Alert.alert(
                "Delete Product",
                "Are you sure you want to delete this product?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "OK", onPress: () => deleteItem(selectedItem.id) }
                ]
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    flex: 1,
    fontWeight: 'bold',
  },
  itemPrice: {
    width: 80,
    textAlign: 'right',
  },
  itemQuantity: {
    width: 60,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default App;