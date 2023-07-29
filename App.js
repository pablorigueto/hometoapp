/**
 * Inspiration: https://dribbble.com/shots/8257559-Movie-2-0
 *
 */
import * as React from 'react';
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { getMovies } from './api';
import Rating from './Rating';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading...</Text>
  </View>
);

const Backdrop = ({ movies, scrollX }) => {
  return (
    <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}>
      <FlatList
        data={movies.reverse()}
        //keyExtractor={(item) => item.key + '-backdrop'}
        keyExtractor={(item) => item.nodeid}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.image) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [0, width],
            extrapolate:'clamp'
          });
          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: 'absolute',
                width: translateX,
                height,
                overflow: 'hidden',
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: 'absolute',
                }}
              />
            </Animated.View>
          );
        }}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'white']}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: 'absolute',
          bottom: 0,
        }}
      />
    </View>
  );
};

export default function App() {
  const [movies, setMovies] = React.useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const fetchData = async () => {
    const movies = await getMovies();
    console.log(movies);

    // const movies = [{"backdrop":"test",
    //   "description":"test.",
    //   "key":"805320",
    //   "poster": './assets/image11.png',
    //   "rating":8.1,
    //   "releaseDate":"2023-07-14",
    //   "title":"Test"
    //   },
    //   {
    //     "backdrop":"https://image.tmdb.org/t/p/w370_and_h556_multi_faces/hjyqNFHx5wIO8dqaRi0v2ix1wiR.jpg",
    //     "description":"Based on true events and the novel of the same name. Vice detective Bob Hightower finds his ex-wife murdered and daughter kidnapped by a cult. Frustrated by the botched official investigations, he quits the force and infiltrates the cult to hunt down the leader with the help of the cult’s only female victim escapee, Case Hardin.",
    //     "genres":[
    //        "Action",
    //        "Crime",
    //        "Horror"
    //     ],
    //     "key":"808396",
    //     "poster":"https://image.tmdb.org/t/p/w440_and_h660_face/5kiLS9nsSJxDdlYUyYGiSUt8Fi8.jpg",
    //     "rating":6.3,
    //     "releaseDate":"2023-06-22",
    //     "title":"God Is a Bullet"
    //  }
    // ];

      // [empty_item, ...movies, empty_item]
      setMovies([{ key: 'empty-left' }, ...movies, { key: 'empty-right' }]);

    };

    if (movies.length === 0) {
      fetchData(movies);
    }
  }, [movies]);

  if (movies.length === 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Backdrop movies={movies} scrollX={scrollX} />
      <StatusBar hidden />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(item) => item.nodeid}
        horizontal
        bounces={false}
        decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
        renderToHardwareTextureAndroid
        contentContainerStyle={{ alignItems: 'center' }}
        snapToInterval={ITEM_SIZE}
        snapToAlignment='start'
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.image) {
            return <View style={{ width: EMPTY_ITEM_SIZE }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: 'clamp',
          });

// When animationValue is -1, extendValue will be -100, identityValue will be 0, and clampValue will be 0.
// When animationValue is 0.5, extendValue will be 50, identityValue will be 50, and clampValue will be 50.
// When animationValue is 2, extendValue will be 200, identityValue will be 100, and clampValue will be 100.

          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: 'center',
                  transform: [{ translateY }],
                  //transform: 'scaleX(2) rotateX(15deg)',
                  backgroundColor: 'white',
                  borderRadius: 10,
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.posterImage}
                  resizeMode="cover"
                />

                <Text style={{ fontSize: 24, color: '#272727' }} numberOfLines={1}>
                  {item.ntitle}
                </Text>

                <Rating rating={item.vote} style={{color: '#272727'}}/>

                <Text style={{color: '#272727'}}>
                  <Icon name="location-pin" size={17.5} color="#000"/>
                   {item.distance} km
                </Text>

                <Text style={{ fontSize: 16, color: '#272727' }} numberOfLines={3}>
                  {item.type}
                </Text>
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    borderRadius: 5,
    margin: 0,
    marginBottom: 5,
  },
});
