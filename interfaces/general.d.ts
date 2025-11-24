
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
