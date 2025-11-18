import { appwriteConfig } from "@/utils/expoContants";
import { showToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { ID } from "appwrite";
import { Platform } from "react-native";
import { tablesDB, appwriteDbConfig, functions } from "../appwrite/appwrite";
import { useUser } from "./userQueries";
import { isValidEmail } from "@/utils/validation";

interface FeedbackData {
  rating: number;
  feedback: string;
  email: string;
}

// Function to send email notification 
const sendEmailNotification = async (
  feedbackData: FeedbackData & { userId: string; userName?: string }
) => {
  try {
    await functions.createExecution({
      functionId: "send-feedback-email", 
      body: JSON.stringify(feedbackData),
      async: true, // Don't wait for response
    });
    console.log("Email notification triggered");
  } catch (error) {
    console.error("Failed to trigger email function:", error);
  }
};

export const useFeedback = () => {
  const { data: user } = useUser();

  return useMutation({
    mutationFn: async (feedbackData: FeedbackData) => {
      if (!user?.$id) {
        throw new Error("User not authenticated");
      }

      // If an email was provided, validate it. Appwrite enforces email format server-side.
      if (feedbackData.email && !isValidEmail(feedbackData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Save feedback to Appwrite database
      const dataPayload: any = {
        userId: user.$id,
        userName: user.name || "Anonymous",
        rating: feedbackData.rating,
        feedbacks: feedbackData.feedback || "",
        createdAt: new Date().toISOString(),
        deviceInfo: Platform.OS, // track platform
      };

      // Only include email when provided (and valid). Avoid sending empty string which
      // violates Appwrite's email format validation when attribute requires a valid email.
      if (feedbackData.email) {
        dataPayload.email = feedbackData.email;
      }

      const feedbackDoc = await tablesDB.createRow({
        databaseId: appwriteDbConfig.databaseId,
        tableId: appwriteConfig.tableFeedbackId,
        rowId: ID.unique(),
        data: dataPayload,
      });

      // Send email notification in the background
      sendEmailNotification({
        ...feedbackData,
        userId: user.$id,
        userName: user.name,
      }).catch(console.error);

      return feedbackDoc;
    },
    onSuccess: () => {
      showToast.success("Thank you for your feedback! 🎉");
    },
    onError: (error: any) => {
      console.error("Failed to submit feedback:", error);
      showToast.error(
        "Failed to submit feedback",
        error?.message || "Please try again"
      );
    },
  });
};
