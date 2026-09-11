import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide?: () => void;
}

export const MyToast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onHide,
}) => {
  const translateY = useSharedValue(-200);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withTiming(0, {
        duration: 350,
        easing: Easing.out(Easing.ease),
      });
    } else {
      translateY.value = withTiming(
        -200,
        {
          duration: 300,
          easing: Easing.in(Easing.ease),
        },
        (finished) => {
          if (finished && typeof onHide === 'function') {
            onHide();
          }
        }
      );
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute top-8 left-0 right-0 z-50 items-center justify-center px-4"
      pointerEvents="none"
    >
      <Animated.View className="bg-text-primary py-3 rounded-full 
      shadow-lg border border-slate-700 
      max-w-[90%] items-center">
        <View className='px-6 flex-row'>
          <Ionicons name='warning-outline' size={18} className='mr-2' />
          <Text className="text-black text-base font-medium break-words">
            {message}
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};