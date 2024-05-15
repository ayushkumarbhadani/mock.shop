import { Dimensions, FlatList, Image, Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useCart } from './_layout';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function Cart() {
  const { cartItem, updateQuantity, removeItemFromCart } = useCart();

  const totalPrice = () => {
    return cartItem.reduce((total: number, item: any) => total + (item.quantity * item.price.amount), 0);
  }

  return (
    <View className="flex-1 ">
      <View className='p-5 '>
        <Text className='bg-white font-bold text-3xl'>Your Cart</Text>
      </View>
      <View className='flex-1'>
        <View className='flex-1 gap-2'>
          <FlatList
            data={cartItem}
            ItemSeparatorComponent={() => <View className='p-2'></View>}
            ListEmptyComponent={() => <Text className='text-center text-xl font-bold'>Your Cart is empty</Text>}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <View className='bg-purple-500/10 rounded-md overflow-hidden max-w-screen-xl mx-auto w-full' key={item.productId + index}>
                  <Link href={{ pathname: "/product", params: { id: item?.productId } }}>
                    <View className='flex-row w-full gap-2 justify-start flex-wrap'>
                      <View className={`min-h-52 mx-auto w-full ${Dimensions.get('window').width > 500 ? "max-w-52" : "max-w-full"}`}>
                        <Image source={{ uri: item.image.url }} className='min-w-52 w-full min-h-52 max-w-full aspect-square' />
                      </View>
                      <View className='w-1/2 p-5 flex-grow mx-auto min-w-96'>
                        <View className='gap-2'>
                          <Text className='font-bold text-xl'>{item.productName}</Text>
                          <Text>{item.title}</Text>
                          <Text className='font-bold text-md'>{item.price.amount} {item.price.currencyCode}</Text>
                          <View className='items-center flex-row gap-5'>
                            <Pressable onPress={(e) => {
                              e.preventDefault();
                              if (item.quantity > 1) {
                                updateQuantity(item.id, item.quantity - 1)
                              } else {
                                removeItemFromCart(index);
                              }
                            }}>
                              <View className='h-8 w-8 items-center justify-center rounded-full bg-gray-300 '>
                                <Ionicons name='remove' size={20} color="#333333" style={[{ marginBottom: -3 }]} />
                              </View>
                            </Pressable>
                            <Text className=''>{item.quantity}</Text>
                            <Pressable onPress={(e) => {
                              e.preventDefault();
                              updateQuantity(item.id, item.quantity + 1)
                            }}>
                              <View className='h-8 w-8 items-center justify-center rounded-full bg-gray-300 '>
                                <Ionicons name='add' size={20} color="#333333" style={[{ marginBottom: -3 }]} />
                              </View>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Link>
                </View>
              )
            }}
          />
        </View>
        {cartItem.length > 0 &&
          <View className='items-center justify-center p-5 gap-5 shadow-md bg-white'>
            <View className=''>
              <Text className='font-bold text-lg'>Total: {totalPrice()} {cartItem[0].price.currencyCode}</Text>
            </View>
            <Pressable>
              <View className='bg-purple-500 px-10 py-5 rounded-full'>
                <Text className='text-white font-bold text-xl'>Checkout</Text>
              </View>
            </Pressable>
          </View>
        }
      </View>
    </View>
  );
}