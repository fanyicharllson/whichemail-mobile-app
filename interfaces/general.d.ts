
interface GeminiMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

interface GeminiResponse {
    candidates: {
        content: {
            parts: { text: string }[];
        };
    }[];
}

interface SmartSearchParams {
    query: string;
    services: Service[];
}

interface HeroCardProps {
  userName?: string;
  totalServices: number;
  services?: Service[];
  onQuickAction?: () => void;
  onAIChat?: () => void;
  onServiceOfDay?: (service: Service) => void;
}
interface QuickActionsMenuProps {
    userName?: string;
    totalServices: number;
    uniqueEmails: number;
}
interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
}
