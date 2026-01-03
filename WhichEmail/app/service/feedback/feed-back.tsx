import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { showToast } from '@/utils/toast';
import { useFeedback } from '@/services/hooks/useFeedBack';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedbackScreen({ navigation }: any) {
  const { colorScheme } = useColorScheme();
  const actualTheme = colorScheme ?? 'light';
    const insets = useSafeAreaInsets();
  
  
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  
  const { mutate: submitFeedback, isPending } = useFeedback();

  const handleSubmit = () => {
    if (rating === 0) {
      showToast.error('Please select a rating');
      return;
    }

    submitFeedback(
      {
        rating,
        feedback: feedback.trim(),
        email: email.trim(),
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-slate-900"
    >
      <ScrollView 
      className="flex-1" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 70, 80),
            paddingTop: insets.top
        }}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-4 self-start"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={actualTheme === 'dark' ? '#f1f5f9' : '#0f172a'}
            />
          </TouchableOpacity>
          
          <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Share Your Feedback
          </Text>
          <Text className="text-slate-600 dark:text-slate-400">
            Help us improve WhichEmail by sharing your thoughts
          </Text>
        </View>

        <View className="px-6 py-6">
          {/* Rating Section */}
          <View className="mb-8">
            <Text className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
              How would you rate your experience?
            </Text>
            <View className="flex-row justify-center gap-4 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  className="p-2"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={40}
                    color={star <= rating ? '#3b82f6' : '#94a3b8'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text className="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">
                {rating === 5 && "Amazing! We're glad you love it 🎉"}
                {rating === 4 && "Great! Thanks for your support 👍"}
                {rating === 3 && "Good! We'll keep improving ✨"}
                {rating === 2 && "We hear you. Let us know how to improve 🤔"}
                {rating === 1 && "Sorry to hear that. Please tell us what went wrong 😔"}
              </Text>
            )}
          </View>

          {/* Feedback Text */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Tell us more (Optional)
            </Text>
            <View className="border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden">
              <TextInput
                value={feedback}
                onChangeText={setFeedback}
                placeholder="What do you like? What could be better?"
                placeholderTextColor={actualTheme === 'dark' ? '#64748b' : '#94a3b8'}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className="px-4 py-3 text-slate-900 dark:text-slate-100 min-h-[120px]"
                maxLength={500}
              />
            </View>
            <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
              {feedback.length}/500
            </Text>
          </View>

          {/* Email (Optional) */}
          <View className="mb-8">
            <Text className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Your Email (Optional)
            </Text>
            <View className="border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden flex-row items-center px-4">
              <Ionicons
                name="mail-outline"
                size={20}
                color={actualTheme === 'dark' ? '#64748b' : '#94a3b8'}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={actualTheme === 'dark' ? '#64748b' : '#94a3b8'}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 px-3 py-4 text-slate-900 dark:text-slate-100"
              />
            </View>
            <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              We&apos;ll only use this to respond to your feedback
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isPending || rating === 0}
            className={`rounded-xl py-4 flex-row items-center justify-center ${
              rating === 0 || isPending
                ? 'bg-slate-300 dark:bg-slate-700'
                : 'bg-blue-500 dark:bg-blue-600'
            }`}
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text className="text-white font-semibold text-base ml-2">
                  Submit Feedback
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Privacy Note */}
          <View className="mt-6 flex-row items-start bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <Ionicons
              name="shield-checkmark"
              size={20}
              color="#3b82f6"
              style={{ marginTop: 2 }}
            />
            <Text className="flex-1 text-xs text-slate-600 dark:text-slate-400 ml-3 leading-5">
              Your feedback helps us improve WhichEmail. We respect your privacy and will never share your information.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}