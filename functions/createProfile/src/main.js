import { Client, Databases, Permission, Role } from 'node-appwrite';

export default async ({ req, res, log, error }) => {

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  const user = req.body;
  const userId = user.userId;

  try {
    await databases.getDocument('main', 'profile', userId);
    log('Exists');
  } catch(err) {
    await databases.createDocument('main', 'profile', userId, {
      color: '#1ed9e3',
      items: '[]'
    }, [
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ]);
    log('Created');
  }

  return res.send('OK');
};
