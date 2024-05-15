import { Alert, Dimensions, Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { request, gql } from 'graphql-request';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useCart } from './_layout';
import Toast from 'react-native-root-toast';

interface GroupedItems {
  [key: string]: any[];
}


export default function HomeScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>({});
  const [groupedItems, setGroupedItems] = useState<GroupedItems>({});
  const [selectedProductVarient, setSelectedProductVarient] = useState();
  const [selectedKey, setSelectedKey] = useState<any>();

  const { addItemToCart, cartItem, updateQuantity } = useCart();
  const getData = async () => {
    const query = gql`
      {
        product(id: "${id}") {
          id
          title
          description
          featuredImage {
            id
            url
          }
          variants(first: 100) {
            edges {
              cursor
              node {
                id
                title
                image {
                  url
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    const response = await request("https://mock.shop/api", query);
    setData(response as unknown as any);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const updatedGroupedItems: any = {};

    data?.product?.variants?.edges.forEach(({ node }: { node: any }, index: number) => {
      const key = node.title.split(' / ')[0]; // Get the first part of the title before the slash

      if (!updatedGroupedItems[key]) {
        updatedGroupedItems[key] = []; // Initialize array if key doesn't exist
      }

      updatedGroupedItems[key].push({ ...node, index }); // Push item to corresponding key 
    });

    setGroupedItems(updatedGroupedItems);
  }, [data]);

  const selectItem = (key: any) => {
    if (groupedItems[key].length === 1) {
      setSelectedProductVarient(groupedItems[key][0].index);
    }
    setSelectedKey(key);
  }

  const getImageSize = () => {
    if (Dimensions.get('window').width > 1000) {
      return "w-[500px] h-[500px]";
    }
    return "w-[320px] h-[320px]";
  }

  return (
    <ScrollView>
      <View className="flex-1 flex-row flex-wrap justify-center gap-5">
        <View className={`w-full h-96 max-w-md ${Dimensions.get('window').width > 500 ? getImageSize() : "h-96"}`}>
          <Image resizeMode='cover' className={`w-full ${Dimensions.get('window').width > 500 ? getImageSize() : "h-96"} max-h-[768px] h-96 max-w-md`} source={{ uri: selectedProductVarient ? data?.product?.variants?.edges[selectedProductVarient]?.node?.image?.url : data?.product?.variants?.edges[0]?.node?.image?.url }} />
        </View>
        <View className='max-w-full gap-5'>
          <View className='w-full px-5 gap-5'>
            <Text className='text-3xl font-bold'>{data?.product?.title}</Text>
            <Text className='text-5xl font-bold'>{selectedProductVarient ? data?.product?.variants?.edges[selectedProductVarient]?.node?.price.amount : data?.product?.variants?.edges[0]?.node?.price.amount} {selectedProductVarient ? data?.product?.variants?.edges[selectedProductVarient]?.node?.price.currencyCode : data?.product?.variants?.edges[0]?.node?.price.currencyCode}</Text>
          </View>
          <View className='flex-row flex-wrap gap-2 px-5'>
            <View className='flex-wrap w-full gap-5'>
              <View className='w-full flex-row gap-2 justify-start flex-wrap'>
                {Object.keys(groupedItems).map((key, index) => (
                  <Pressable key={key} onPress={() => selectItem(key)}>
                    <View className={`${selectedKey == key ? "bg-purple-500/90" : "bg-purple-500/50"} px-5 py-2`}>
                      <Text className={`${selectedKey == key ? "text-white" : ""} font-bold`}>{key}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              <View className='flex-row gap-2 justify-start flex-wrap'>
                {selectedKey && groupedItems[selectedKey]?.length > 1 &&
                  groupedItems[selectedKey].map((item, index) => (
                    <Pressable key={index} onPress={() => setSelectedProductVarient(item.index)}>
                      <View>
                        <View className={selectedProductVarient === groupedItems[selectedKey][index].index && selectedKey === item.title.split(" /")[0] ? "bg-purple-500/90 px-5 py-2" : "bg-purple-500/50 px-5 py-2"}>
                          <Text className={`${selectedProductVarient === groupedItems[selectedKey][index].index && selectedKey === item.title.split(" /")[0] ? "text-white" : "text-black"} font-bold`}>{item.title.split("/ ")[1]}</Text>
                        </View>
                      </View>
                    </Pressable>
                  ))
                }
              </View>
            </View>
          </View>
          <View className='max-w-full px-5 items-start'>
            <Pressable
              className='w-full'
              onPress={() => {
                if (selectedProductVarient != null && selectedKey != null) {
                  //check if item is already in cart, if it is then update the quantity, otherwise add it.
                  let flag = false;
                  for (let i = 0; i < cartItem.length; i++) {
                    if (cartItem[i].id == data.product.variants.edges[selectedProductVarient].node.id) {
                      updateQuantity(data.product.variants.edges[selectedProductVarient].node.id, cartItem[i].quantity + 1);
                      flag = true;
                      Toast.show(`Quantity of ${data.product.title} (${data.product.variants.edges[selectedProductVarient].node.title}) has been updated to ${cartItem[i].quantity + 1} in your cart`, {
                        duration: Toast.durations.LONG,
                      })
                      break;
                    }
                  }
                  if (!flag) {
                    addItemToCart({
                      ...data.product.variants.edges[selectedProductVarient].node,
                      productName: data.product.title,
                      productId: data.product.id,
                      quantity: 1
                    });
                    Toast.show(`${data.product.title} (${data.product.variants.edges[selectedProductVarient].node.title}) added to cart`, {
                      duration: Toast.durations.LONG,
                    })
                  }

                } else {
                  if (Platform.OS === 'web') {
                    window.alert("Please select a Varient from Size/Color");
                  } else {
                    Alert.alert("Please select a Varient from Size/Color");
                  }
                }
              }}>
              <View className='bg-purple-500 px-5 py-5 w-full'>
                <Text className='font-extrabold text-xl text-white text-center select-none'>Add to Cart</Text>
              </View>
            </Pressable>
          </View>
          <View className='max-w-screen-sm p-5 w-full'>
            <Text className='font-bold text-xl'>Product Description:</Text>
            <Text>
              {data?.product?.description}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

}