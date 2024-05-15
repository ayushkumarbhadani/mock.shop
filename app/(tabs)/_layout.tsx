import { Link, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';
import { useState, createContext, useContext, useEffect } from 'react';

export type CartContextType = {
  cartItem: any[];
  addItemToCart: (item: any) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeItemFromCart: (index: number) => void;
};


const CartContext = createContext<CartContextType>({
  cartItem: [],
  addItemToCart: function (item: any): void { },
  updateQuantity: function (productId: string, newQuantity: number): void { },
  removeItemFromCart: function (index: number): void { }
});

export default function TabLayout() {

  const [cartItem, setCartItem] = useState<any>([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  const addItemToCart = (item: any) => {
    setCartItem([...cartItem, item]);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = cartItem.map((item: any) => {
      if (item.id == productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItem(updatedCart);
  };

  const removeItemFromCart = (index: number) => {
    const newCart = [...cartItem];
    newCart.splice(index, 1);
    setCartItem(newCart);
  };

  useEffect(() => {
    const totalCount = cartItem.reduce((total: number, item: any) => total + item.quantity, 0);
    setCartItemCount(totalCount);
  }, [cartItem]);

  const Header = () => {
    return <View className='flex-row justify-between p-5'>
      <Text className='text-2xl italic'>Mock.Shop</Text>
      <Link href="/cart">
        <View>
          <Ionicons name='cart-outline' size={28} color="#333333" style={[{ marginBottom: -3 }]} />
          <View className='bg-orange-500 rounded-full absolute -right-2 -top-2 h-6 w-6 items-center justify-center'>
            <Text className='font-bold'>{cartItemCount}</Text>
          </View>
        </View>
      </Link>
    </View>
  }
  return (
    <CartContext.Provider value={{ cartItem, addItemToCart, updateQuantity, removeItemFromCart }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <Header />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}></Stack>
      </SafeAreaView>
    </CartContext.Provider>
  );
}

export const useCart = () => {
  return useContext(CartContext);
};