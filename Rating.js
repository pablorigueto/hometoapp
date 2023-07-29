import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Rating({ rating }) {
 
  const filledStars = rating === null ? 0 : Math.min(5, Math.max(0, rating)); // Ensure rating is between 0 and 5
  const r = Array(5).fill('staro').map((item, index) => (index < filledStars ? 'star' : 'staro'));

  return (
    <View style={styles.rating}>
      {/* <Text style={styles.ratingNumber}>{filledStars}</Text> */}
      {r.map((type, index) => {
        return <AntDesign key={index} name={type} size={22} color="#000" />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  ratingNumber: { marginRight: 4, fontFamily: 'Roboto', fontSize: 14, color: '#000' },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
});
