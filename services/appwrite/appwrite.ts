import {Account, Client, Functions, TablesDB} from 'appwrite';
import {appwriteConfig} from "@/utils/expoContants";

export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);

export const appwriteDbConfig = {
    databaseId: appwriteConfig.databaseId,
};
export const functions = new Functions(client);