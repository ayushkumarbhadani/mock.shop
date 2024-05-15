
import Carousel from 'react-native-reanimated-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel as WebCrausel } from 'react-responsive-carousel';
import img1 from '@/assets/images/banners/1.png';
import img2 from '@/assets/images/banners/2.png';
import img3 from '@/assets/images/banners/3.png';
import img4 from '@/assets/images/banners/4.png';
import { Dimensions, Image, Platform, Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { router } from 'expo-router';

export default () => {
    const data = [
        {
            image: img1,
            id: 'gid://shopify/Product/7982904639510',
            staticImageLink: '../assets/images/banners/1.png'
        },
        {
            image: img2,
            id: 'gid://shopify/Product/7982905098262',
            staticImageLink: '../assets/images/banners/2.png'
        },
        {
            image: img3,
            id: 'gid://shopify/Product/7983593095190',
            staticImageLink: '../assets/images/banners/3.png'
        },
        {
            image: img4,
            id: 'gid://shopify/Product/7983593357334',
            staticImageLink: '../assets/images/banners/4.png'
        },
    ];
    const width = Dimensions.get('window').width;
    return (
        Platform.OS === 'web' ? (
            <WebCrausel showArrows={true} onClickItem={(index, child) => {
                router.push({ pathname: "/product", params: data[index] });
            }}
                showThumbs={false} width={width} showStatus={false} swipeable={true} autoPlay={true} interval={2000} infiniteLoop={true}>
                {
                    data.map((item: any, index: number) => {
                        return (
                            <img key={index} src={item.staticImageLink} />
                        )
                    })
                }
            </WebCrausel>
        ) :
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={data}
                scrollAnimationDuration={1000}
                pagingEnabled={true}
                renderItem={({ item, index }) => (
                    <Link href={{ pathname: 'product', params: item }} asChild>
                        <Pressable>
                            <View className='' key={index}>
                                <View className='w-full rounded-xl overflow-hidden'>
                                    <Image className='rounded-xl w-full h-full' source={item.image} resizeMode='contain' />
                                </View>
                            </View>
                        </Pressable>
                    </Link>
                )}
            />
    )
}