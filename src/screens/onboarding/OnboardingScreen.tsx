/**
 * RPP AUTO - Onboarding Screen
 * ==============================
 * 3-slide education carousel with Recession Proof branding
 * Slides: AI Diagnostics, Smart Maintenance, Locate Mechanics
 */

import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import theme from '../../theme/theme';

const {width} = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: 'brain' as const,
    title: 'AI-Powered Diagnostics',
    description: 'Get instant vehicle diagnostics powered by advanced AI technology. Know what\'s wrong before you visit a mechanic.',
    color: theme.colors.brand.green,
  },
  {
    icon: 'wrench' as const,
    title: 'Smart Maintenance',
    description: 'Track service history, set reminders, and never miss important maintenance. Keep your vehicle running smoothly.',
    color: theme.colors.brand.yellow,
  },
  {
    icon: 'map-marker' as const,
    title: 'Locate Mechanics',
    description: 'Find trusted mechanics near you with ratings, pricing, and availability. Book appointments instantly.',
    color: theme.colors.brand.green,
  },
];

export default function OnboardingScreen({onComplete}: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({x: index * width, animated: true});
    setCurrentSlide(index);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={slide.icon}
                size={100}
                color={slide.color}
              />
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

        {currentSlide < slides.length - 1 && (
          <TouchableOpacity onPress={onComplete} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.sizes.body * theme.typography.lineHeights.relaxed,
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: theme.colors.brand.green,
    width: 24,
  },
  dotInactive: {
    backgroundColor: theme.colors.border.default,
  },
  button: {
    ...theme.components.button.primary,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.background.primary,
    fontSize: theme.typography.sizes.h4,
    fontWeight: theme.typography.weights.semibold,
  },
  skipButton: {
    marginTop: theme.spacing.md,
  },
  skipText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.body,
  },
});
