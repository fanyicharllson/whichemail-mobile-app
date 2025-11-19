import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Linking, ScrollView, Text, TouchableOpacity, View,} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {Ionicons} from '@expo/vector-icons';
import {router, useLocalSearchParams} from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import LoadingScreen from '@/components/common/LoadingScreen';
import EmptyState from '@/components/common/EmptyState';
import {getCategoryById} from '@/constants/categories';
import {useDeleteService, useService, useToggleFavorite} from '@/services/queries/serviceQueries';
import {secureStorage} from '@/services/secureStorage';
import {showToast} from '@/utils/toast';
import ErrorScreen from "@/components/common/ErrorScreen";
import {authenticateUser} from "@/utils/authUtils";
import {useTheme} from "@/components/ThemeProvider";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ServiceDetail() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const {data: service, isLoading, error: serviceError, refetch} = useService(id as string);
    const {mutate: deleteService, isPending: deleting} = useDeleteService();
    const insets = useSafeAreaInsets();
    

    const [password, setPassword] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const {actualTheme} = useTheme();
     const { mutate: toggleFavorite, isPending: togglingFavorite } = useToggleFavorite();
    

    useEffect(() => {
        // Check if password exists when component mounts
        const checkPasswordExists = async () => {
            if (!service?.id) return;
            try {
                const savedPassword = await secureStorage.getPassword(service.id);
                if (savedPassword) {
                    setPassword(savedPassword);
                }
            } catch (error) {
                console.error('Error checking password:', error);
            }
        };

        if (service?.hasPassword && service?.id) {
            checkPasswordExists();
        }
    }, [service]);

    const handleViewPassword = async () => {
        if (!password || showPassword) {
            setShowPassword(!showPassword);
            return;
        }
        setLoadingPassword(true);

        const result = await authenticateUser({
            purpose: 'view-password',
        })

        setLoadingPassword(false);

        if (result.success) {
            setShowPassword(true);
        }
    };

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await Clipboard.setStringAsync(text);
            showToast.success(`${label} Copied!`, 'Copied to clipboard');
        } catch (error) {
            console.error(`Error copying text: ${error}`);
            showToast.error('Copy Failed', 'Unable to copy to clipboard');
        }
    };

    const copyPasswordToClipboard = async () => {
        if (!password) return;

        const result = await authenticateUser({
            purpose: 'copy-password',
        });

        if (result.success) {
            await Clipboard.setStringAsync(password);
            showToast.success('Password Copied!', 'Will be cleared in 30 seconds');

            // Auto-clear clipboard after 30 seconds
            setTimeout(async () => {
                await Clipboard.setStringAsync('');
            }, 30000);
        }
    };

    const openWebsite = () => {
        if (!service?.website) return;
        const url = service.website.match(/^https?:\/\//) ? service.website : `https://${service.website}`;
        Linking.openURL(url).catch(() => {
            showToast.error('Error', 'Unable to open website');
        });
    };

    const handleEdit = () => {
        if (!service?.id) return;
        router.push(`/service/edit/${service.id}`);
    };

    const handleDelete = () => {
        if (!service?.id || deleting) return;

        Alert.alert(
            'Delete Service',
            `Are you sure you want to delete ${service.serviceName}? This action cannot be undone.`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        // Delete password from SecureStore if exists
                        if (password) {
                            await secureStorage.deletePassword(service.id);
                        }

                        deleteService(service.id, {
                            onSuccess: () => {
                                showToast.success('Service Deleted', `${service.serviceName} has been removed`);
                                router.back();
                            },
                        });
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return <LoadingScreen message={`Loading details...`}/>;
    }

    if (serviceError) {
        return <ErrorScreen onRetry={() => refetch()}/>
    }

    if (!service) {
        return (
            <View className="flex-1 bg-slate-50 dark:bg-slate-900">
                <StatusBar style={actualTheme === 'dark' ? 'light' : 'dark'}/>
                <View
                    className="bg-white dark:bg-slate-800 pt-14 pb-4 px-6 border-b border-slate-200 dark:border-slate-700">
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600"
                            accessibilityLabel="Go back"
                        >
                            <Ionicons name="chevron-back" size={22} color="#0f172a"/>
                        </TouchableOpacity>
                        <Text className="text-slate-900 dark:text-slate-100 font-bold text-xl">Service</Text>
                        <View className="w-10"/>
                    </View>
                </View>
                <View className="px-6 pt-6">
                    <EmptyState
                        icon="alert-circle"
                        title="Service Not Found"
                        message="The service you're looking for doesn't exist."
                        actionLabel="Go Back"
                        onAction={() => router.back()}
                    />
                </View>
            </View>
        );
    }


    const category = getCategoryById(service.categoryId);

    return (
       <View className="flex-1 bg-slate-50 dark:bg-slate-950">
    <StatusBar style={actualTheme === 'dark' ? 'light' : 'dark'}/>

    {/* Header with Colored Backdrop */}
    <View className="bg-indigo-600 dark:bg-indigo-950 pt-14 pb-6 px-6 shadow-lg">
        <View className="flex-row items-center justify-between">
            <TouchableOpacity
                onPress={() => router.back()}
                className="w-11 h-11 rounded-xl items-center justify-center bg-white/20 dark:bg-white/10 active:bg-white/30 dark:active:bg-white/20"
                accessibilityLabel="Go back"
            >
                <Ionicons name="chevron-back" size={24} color="#ffffff"/>
            </TouchableOpacity>
            <Text className="text-white font-bold text-xl flex-1 text-center mx-3"
                  numberOfLines={1}>
                {service.serviceName}
            </Text>
            <View className="flex-row gap-2">
                <TouchableOpacity
                    onPress={() => toggleFavorite({ 
                        serviceId: service.id, 
                        isFavorite: !service.isFavorite 
                    })}
                    disabled={togglingFavorite}
                    className="w-11 h-11 rounded-xl items-center justify-center bg-white/20 dark:bg-white/10 active:bg-white/30 dark:active:bg-white/20"
                    accessibilityLabel={service.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    {togglingFavorite ? (
                        <ActivityIndicator size="small" color="#fbbf24" />
                    ) : (
                        <Ionicons 
                            name={service.isFavorite ? "star" : "star-outline"} 
                            size={22} 
                            color="#fbbf24" 
                        />
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleEdit}
                    className="w-11 h-11 rounded-xl items-center justify-center bg-white/20 dark:bg-white/10 active:bg-white/30 dark:active:bg-white/20"
                    accessibilityLabel="Edit service"
                >
                    <Ionicons name="pencil" size={22} color="#60a5fa"/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleDelete}
                    className="w-11 h-11 rounded-xl items-center justify-center bg-white/20 dark:bg-white/10 active:bg-white/30 dark:active:bg-white/20"
                    accessibilityLabel="Delete service"
                    disabled={deleting}
                >
                    <Ionicons name="trash" size={22} color="#f87171"/>
                </TouchableOpacity>
            </View>
        </View>
        
        {/* Quick Info Banner */}
        <View className="mt-4 bg-white/10 dark:bg-white/5 rounded-xl px-4 py-2.5">
            <Text className="text-white/90 dark:text-white/80 text-xs text-center">
                Tap 📋 to copy • Tap 👁️ to view password • All data encrypted
            </Text>
        </View>
    </View>

    <ScrollView 
    className="flex-1 px-5 pt-6" 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
                        paddingBottom: Math.max(insets.bottom + 70, 80),
                    }}
    >
        {/* Hero Service Card */}
        <View className="bg-white dark:bg-slate-900 rounded-3xl p-5 mb-5 shadow-lg border border-slate-200 dark:border-slate-800">
            <View className="flex-row items-center">
                <View 
                    className="w-16 h-16 rounded-2xl items-center justify-center mr-4 border-2"
                    style={{
                        backgroundColor: actualTheme === 'dark' 
                            ? category.color + '20' 
                            : category.color + '15',
                        borderColor: actualTheme === 'dark'
                            ? category.color + '40'
                            : category.color + '30'
                    }}
                >
                    <Ionicons name={category.icon as any} size={30} color={category.color}/>
                </View>
                <View className="flex-1">
                    <Text className="text-slate-900 dark:text-slate-50 font-bold text-xl mb-2">
                        {service.serviceName}
                    </Text>
                    <View className="flex-row items-center flex-wrap gap-2">
                        <View className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-300 dark:border-indigo-800">
                            <Text className="text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                                {category.name}
                            </Text>
                        </View>
                        {service.hasPassword ? (
                            <View className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800">
                                <Text className="text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                                    🔒 Secured
                                </Text>
                            </View>
                        ) : (
                            <View className="px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800">
                                <Text className="text-amber-700 dark:text-amber-300 text-xs font-bold">
                                    ⚠️ No Password
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>

        {/* Information Card */}
        <View className="bg-white dark:bg-slate-900 rounded-3xl p-1 mb-5 shadow-lg border border-slate-200 dark:border-slate-800">
            {/* Email Section */}
            <View className="flex-row items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
                <View className="w-11 h-11 rounded-xl items-center justify-center bg-blue-100 dark:bg-blue-950/70 mr-3 border border-blue-200 dark:border-blue-900">
                    <Ionicons name="mail" size={20} color="#3b82f6"/>
                </View>
                <View className="flex-1">
                    <Text className="text-slate-400 dark:text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">
                        Email Address
                    </Text>
                    <Text className="text-slate-900 dark:text-slate-100 font-semibold text-base">
                        {service.email}
                    </Text>
                    <Text className="text-slate-400 dark:text-slate-600 text-xs mt-0.5">
                        Used for login and recovery
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => copyToClipboard(service.email, 'Email')}
                    className="bg-blue-50 dark:bg-blue-950/50 rounded-xl p-2.5 active:scale-95 border border-blue-100 dark:border-blue-900"
                >
                    <Ionicons name="copy-outline" size={20} color="#3b82f6"/>
                </TouchableOpacity>
            </View>

            {/* Website Section */}
            {service.website && (
                <View className="flex-row items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
                    <View className="w-11 h-11 rounded-xl items-center justify-center bg-violet-100 dark:bg-violet-950/70 mr-3 border border-violet-200 dark:border-violet-900">
                        <Ionicons name="globe" size={20} color="#8b5cf6"/>
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-400 dark:text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">
                            Website
                        </Text>
                        <Text className="text-violet-600 dark:text-violet-400 font-semibold text-base">
                            {service.website}
                        </Text>
                        <Text className="text-slate-400 dark:text-slate-600 text-xs mt-0.5">
                            Tap to open in browser
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={openWebsite}
                        className="bg-violet-50 dark:bg-violet-950/50 rounded-xl p-2.5 active:scale-95 border border-violet-100 dark:border-violet-900"
                    >
                        <Ionicons name="open-outline" size={20} color="#8b5cf6"/>
                    </TouchableOpacity>
                </View>
            )}

            {/* Password Section */}
            {password && (
                <View className="flex-row items-center px-4 py-4">
                    <View className="w-11 h-11 rounded-xl items-center justify-center bg-emerald-100 dark:bg-emerald-950/70 mr-3 border border-emerald-200 dark:border-emerald-900">
                        <Ionicons name="lock-closed" size={20} color="#10b981"/>
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-400 dark:text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">
                            Password
                        </Text>
                        <Text className="text-slate-900 dark:text-slate-100 font-semibold text-base tracking-wider">
                            {showPassword ? password : '••••••••••'}
                        </Text>
                        <Text className="text-slate-400 dark:text-slate-600 text-xs mt-0.5">
                            {showPassword ? 'Tap to hide' : 'Requires biometric unlock'}
                        </Text>
                    </View>
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={handleViewPassword}
                            className="bg-emerald-50 dark:bg-emerald-950/50 rounded-xl p-2.5 active:scale-95 border border-emerald-100 dark:border-emerald-900"
                            disabled={loadingPassword}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#10b981"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={copyPasswordToClipboard}
                            className="bg-emerald-50 dark:bg-emerald-950/50 rounded-xl p-2.5 active:scale-95 border border-emerald-100 dark:border-emerald-900"
                        >
                            <Ionicons name="copy-outline" size={20} color="#10b981"/>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>

        {/* Security Notice */}
        {password && (
            <View className="bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl p-5 mb-5 border-2 border-emerald-200 dark:border-emerald-900/50">
                <View className="flex-row items-start">
                    <View className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 items-center justify-center mr-3 border border-emerald-200 dark:border-emerald-800">
                        <Ionicons name="shield-checkmark" size={22} color="#10b981"/>
                    </View>
                    <View className="flex-1">
                        <Text className="text-emerald-900 dark:text-emerald-100 font-bold text-base mb-1.5">
                            🔐 Bank-Level Security
                        </Text>
                        <Text className="text-emerald-700 dark:text-emerald-300 text-sm leading-5">
                            Your password is encrypted with AES-256 encryption and stored securely on your device. Biometric authentication (fingerprint or face ID) is required to view or copy it.
                        </Text>
                    </View>
                </View>
            </View>
        )}

        {/* No Password Warning */}
        {!password && (
            <View className="bg-amber-50 dark:bg-amber-950/30 rounded-3xl p-5 mb-5 border-2 border-amber-200 dark:border-amber-900/50">
                <View className="flex-row items-start">
                    <View className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 items-center justify-center mr-3 border border-amber-200 dark:border-amber-800">
                        <Ionicons name="warning" size={22} color="#f59e0b"/>
                    </View>
                    <View className="flex-1">
                        <Text className="text-amber-900 dark:text-amber-100 font-bold text-base mb-1.5">
                            ⚠️ No Password Saved
                        </Text>
                        <Text className="text-amber-700 dark:text-amber-300 text-sm leading-5">
                            This service doesn&apos;t have a saved password. Tap &quot;Edit&quot; above to add one for better security tracking.
                        </Text>
                    </View>
                </View>
            </View>
        )}

        {/* Notes Section */}
        {service.notes && (
            <View className="bg-white dark:bg-slate-900 rounded-3xl p-5 mb-5 shadow-lg border border-slate-200 dark:border-slate-800">
                <View className="flex-row items-center mb-3">
                    <View className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/70 items-center justify-center mr-2.5 border border-amber-200 dark:border-amber-900">
                        <Ionicons name="document-text" size={18} color="#f59e0b"/>
                    </View>
                    <Text className="text-slate-900 dark:text-slate-100 font-bold text-base">
                        Additional Notes
                    </Text>
                </View>
                <Text className="text-slate-700 dark:text-slate-300 text-sm leading-6">
                    {service.notes}
                </Text>
            </View>
        )}

        {/* Quick Actions Info Card */}
        <View className="bg-blue-50 dark:bg-blue-950/30 rounded-3xl p-5 mb-5 border border-blue-200 dark:border-blue-900/50">
            <View className="flex-row items-start mb-3">
                <View className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 items-center justify-center mr-2.5 border border-blue-200 dark:border-blue-800">
                    <Ionicons name="information-circle" size={20} color="#3b82f6"/>
                </View>
                <Text className="text-blue-900 dark:text-blue-100 font-bold text-base flex-1">
                    💡 Quick Actions
                </Text>
            </View>
            <View className="space-y-2">
                <Text className="text-blue-700 dark:text-blue-300 text-sm leading-5 mb-2">
                    • <Text className="font-semibold">Copy icons (📋)</Text> - Instantly copy email or password to clipboard
                </Text>
                <Text className="text-blue-700 dark:text-blue-300 text-sm leading-5 mb-2">
                    • <Text className="font-semibold">Eye icon (👁️)</Text> - Toggle password visibility (requires biometrics)
                </Text>
                <Text className="text-blue-700 dark:text-blue-300 text-sm leading-5 mb-2">
                    • <Text className="font-semibold">Globe icon (🌐)</Text> - Open website directly in your browser
                </Text>
                <Text className="text-blue-700 dark:text-blue-300 text-sm leading-5">
                    • <Text className="font-semibold">Star icon (⭐)</Text> - Add to favorites for quick access
                </Text>
            </View>
        </View>

        {/* Metadata Card */}
        <View className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-5 mb-8 border border-slate-200 dark:border-slate-800">
            <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 items-center justify-center mr-2 border border-slate-200 dark:border-slate-700">
                    <Ionicons name="time-outline" size={16} color="#64748b"/>
                </View>
                <Text className="text-slate-600 dark:text-slate-400 text-xs">
                    Created on {new Date(service.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    })} at {new Date(service.createdAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}
                </Text>
            </View>
            <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 items-center justify-center mr-2 border border-slate-200 dark:border-slate-700">
                    <Ionicons name="refresh-outline" size={16} color="#64748b"/>
                </View>
                <Text className="text-slate-600 dark:text-slate-400 text-xs">
                    Last updated {new Date(service.updatedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    })} at {new Date(service.updatedAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}
                </Text>
            </View>
        </View>

        <View className="h-6"/>
    </ScrollView>
     {/* Floating Action Button */}
        <View className='absolute bottom-24 right-5'>
            <TouchableOpacity
            onPress={() => router.push('/service/add/add')}
            className="bg-blue-600 dark:bg-blue-700 w-16 h-16 rounded-full items-center justify-center shadow-lg active:scale-95"
            activeOpacity={0.9}
            >
                 <Ionicons name="add" size={28} color="white"/>
                 </TouchableOpacity>
        </View>
</View>
    );
}