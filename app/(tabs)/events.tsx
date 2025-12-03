import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
    interpolate,
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = height * 0.45;
const SPACING = 16;
const TOTAL_SIZE = CARD_WIDTH + SPACING;

const events = [
  {
    id: '1',
    uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    location: "Barcelona",
    title: "Music Festival",
    description: "A fun beach party event",
  },
  {
    id: '2',
    uri: "https://images.unsplash.com/photo-1468071174046-657d9d351a40",
    location: "London",
    title: "Theatre Night",
    description: "A night of drama and art",
  },
  {
    id: '3',
    uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    location: "Berlin",
    title: "Tech Summit",
    description: "Future of technology",
  },
  {
    id: '4',
    uri: "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
    location: "Sydney",
    title: "Beach Party",
    description: "Chill vibes at the beach",
  },
];

interface EventCardProps {
  item: typeof events[0];
  index: number;
  scrollX: any;
  onPress: () => void;
}

function EventCard({ item, index, scrollX, onPress }: EventCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [0.9, 1, 0.9],
      "clamp"
    );

    return {
      transform: [{ scale }],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const imageTranslateX = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [-50, 0, 50],
      "clamp"
    );

    return {
      transform: [{ translateX: imageTranslateX }],
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <View style={{ overflow: "hidden", borderRadius: 20 }}>
          <Animated.Image
            source={{ uri: item.uri }}
            style={[styles.image, imageStyle]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textBox}>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Events() {
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const activeIndexShared = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / TOTAL_SIZE;

    const newIndex = Math.round(scrollX.value);
    const clamped = Math.max(0, Math.min(events.length - 1, newIndex));

    if (clamped !== activeIndexShared.value) {
      activeIndexShared.value = clamped;
      runOnJS(setActiveIndex)(clamped);
    }
  });

  const handleEventSelect = (event: any) => {
    // Navigate to home (restaurants list) with selected event info
    router.push({
      pathname: '/(tabs)/home',
      params: {
        eventId: event.id,
        eventName: event.title,
        eventLocation: event.location,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Animated.Image
        key={activeIndex}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(400)}
        source={{ uri: events[activeIndex].uri }}
        style={styles.background}
        blurRadius={30}
      />
      <View style={styles.overlay} />

      {/* Title Overlay */}
      <View style={styles.headerText}>
        <Text style={styles.headerLocation}>
          {events[activeIndex].location}
        </Text>
        <Text style={styles.headerTitle}>
          {events[activeIndex].title}
        </Text>
      </View>

      {/* Horizontal Scroller */}
      <View style={styles.scrollerContainer}>
        <Animated.FlatList
          data={events}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={TOTAL_SIZE}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: (width - CARD_WIDTH) / 2,
            gap: SPACING,
            alignItems: 'center',
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <EventCard 
              item={item} 
              index={index} 
              scrollX={scrollX}
              onPress={() => handleEventSelect(item)}
            />
          )}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  scrollerContainer: {
    height: CARD_HEIGHT + 80,
    justifyContent: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  headerText: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  headerLocation: {
    color: "white",
    fontSize: 12,
    letterSpacing: 2,
  },
  headerTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  image: {
    width: "100%",
    height: "65%",
  },
  textBox: {
    padding: 12,
  },
  location: {
    color: "#aaa",
    fontSize: 12,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  desc: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },
});
