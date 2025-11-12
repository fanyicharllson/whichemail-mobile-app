import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getCategoryById } from "@/constants/categories";
import { useTheme } from "@/components/ThemeProvider";
import { useToggleFavorite } from "@/services/queries/serviceQueries";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const category = getCategoryById(service.categoryId);
  const { mutate: toggleFavorite, isPending: isTogglingFav } = useToggleFavorite();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === "dark";

  return (
    <TouchableOpacity
      onPress={() => router.push(`/service/detail/${service.id}`)}
      activeOpacity={0.85}
      style={{
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        shadowColor: category.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#f1f5f9',
      }}
    >
      {/* Color Accent Bar on Top */}
      <View
        style={{
          height: 4,
          backgroundColor: category.color,
          opacity: 0.8,
        }}
      />

      {/* Main Card Content */}
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {/* Enhanced Category Icon with Glow */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: `${category.color}15`,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
              borderWidth: 2,
              borderColor: `${category.color}30`,
              shadowColor: category.color,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Ionicons
              name={category.icon as any}
              size={28}
              color={category.color}
            />
          </View>

          {/* Service Info - Enhanced Typography */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text
                style={{
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  fontWeight: '700',
                  fontSize: 17,
                  letterSpacing: -0.3,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {service.serviceName}
              </Text>
              
              {/* Badges - Password & Favorite */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                {service.hasPassword && (
                  <View
                    style={{
                      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe',
                      borderRadius: 8,
                      paddingHorizontal: 6,
                      paddingVertical: 4,
                      marginRight: 6,
                    }}
                  >
                    <Ionicons name="lock-closed" size={12} color="#3b82f6" />
                  </View>
                )}
                
                {/* Star Button */}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite({
                      serviceId: service.id,
                      isFavorite: !service.isFavorite,
                    });
                  }}
                  disabled={isTogglingFav}
                  activeOpacity={0.6}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: service.isFavorite 
                      ? (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7')
                      : (isDark ? '#334155' : '#f1f5f9'),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  accessibilityLabel={
                    service.isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  {isTogglingFav ? (
                    <ActivityIndicator size="small" color="#f59e0b" />
                  ) : (
                    <Ionicons
                      name={service.isFavorite ? "star" : "star-outline"}
                      size={18}
                      color={service.isFavorite ? "#f59e0b" : (isDark ? '#94a3b8' : '#64748b')}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Email with Icon */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="mail-outline"
                size={14}
                color={isDark ? '#64748b' : '#94a3b8'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: isDark ? '#94a3b8' : '#64748b',
                  fontSize: 13,
                  fontWeight: '500',
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {service.email}
              </Text>
            </View>

            {/* Category Tag */}
            <View
              style={{
                marginTop: 8,
                alignSelf: 'flex-start',
                backgroundColor: `${category.color}10`,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: `${category.color}30`,
              }}
            >
              <Text
                style={{
                  color: category.color,
                  fontSize: 11,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {category.name}
              </Text>
            </View>
          </View>

          {/* Arrow Indicator with Pulse Effect */}
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: isDark ? '#334155' : '#f8fafc',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 8,
            }}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#60a5fa' : '#3b82f6'}
            />
          </View>
        </View>

        {/* Notes Preview with Enhanced Style */}
        {service.notes && (
          <View
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTopWidth: 1,
              borderTopColor: isDark ? '#334155' : '#e2e8f0',
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <View
              style={{
                backgroundColor: isDark ? '#334155' : '#f1f5f9',
                borderRadius: 6,
                padding: 4,
                marginRight: 8,
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={14}
                color={isDark ? '#94a3b8' : '#64748b'}
              />
            </View>
            <Text
              style={{
                color: isDark ? '#cbd5e1' : '#475569',
                fontSize: 13,
                fontStyle: 'italic',
                flex: 1,
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              {service.notes}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Gradient Accent (Optional) */}
      <View
        style={{
          height: 3,
          backgroundColor: category.color,
          opacity: 0.1,
        }}
      />
    </TouchableOpacity>
  );
}