import { FlatList, Image, ScrollView, Text, View } from 'react-native';
import { request, gql } from 'graphql-request';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import Crausel from '@/components/Crausel';

export default function HomeScreen() {
  const [data, setData] = useState<any>([]);
  const getData = async () => {
  const query = gql`
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            description
            featuredImage {
              id
              url
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

  return (
    <ScrollView>
      <Crausel />
      <View>
        <View className='p-5 pt-10'>
          <Text className='bg-white font-bold text-3xl'>Explore our new items</Text>
        </View>
        <View className=''>
          {data?.products?.edges?.length > 0 && <FlatList
            data={data?.products.edges}
            ListHeaderComponent={() => {
              return <View className='my-5'></View>
            }}
            contentContainerStyle={{ padding: 20 }}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => {
              return <View className='p-2'></View>
            }}
            horizontal={true}
            renderItem={({ item }) => {
              return <Link href={{ pathname: "/product", params: { id: item?.node?.id, title: item?.node?.title } }}>
                <View className='items-center'>
                  <View className=' items-center p-5 rounded-xl bg-white shadow-md' style={{ elevation: 10 }}>
                    <Image width={250} height={250}
                      className='rounded-xl h-[250px] w-[250px]'
                      source={{ uri: item?.node?.featuredImage.url }}
                      resizeMode='cover'
                    />
                    <Text className='font-bold p-2'>{item?.node?.title}</Text>
                  </View>
                </View>
              </Link>
            }}
          />
          }
        </View>
      </View>
    </ScrollView>
  );
}