import { Client, Account, Databases, Storage } from 'appwrite';

export const client = new Client();

client.setEndpoint('https://cloud.appwrite.io/v1').setProject('almost-wishlist');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
