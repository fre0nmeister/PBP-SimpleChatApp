// screens/ChatScreen.tsx
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import {
  messagesCollection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  auth,
  signOut,
} from '../firebase';

import {
  clearCredentials,
  saveCachedMessages,
  getCachedMessages,
} from '../storage';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';

type MessageType = {
  id: string;
  text: string;
  user: string;
  imageBase64?: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ route, navigation }: Props) {
  const userEmail =
    route.params?.email || auth.currentUser?.email || 'Anonymous';
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    await clearCredentials();
    await signOut(auth);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Logout" onPress={handleLogout} color="red" />
      ),
      title: `Chat: ${userEmail}`,
    });
  }, [navigation, userEmail]);

  useEffect(() => {
    let isMounted = true;

    const loadLocal = async () => {
      try {
        const cached = await getCachedMessages();
        if (isMounted && cached && cached.length > 0) {
          setMessages(cached);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadLocal();

    const q = query(messagesCollection, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(
      q,
      snapshot => {
        if (snapshot.empty) {
          console.log(
            'Snapshot Firebase kosong. Mengabaikan update agar data lokal tidak hilang.',
          );
          return;
        }

        const list: MessageType[] = [];
        snapshot.forEach(doc => {
          list.push({
            id: doc.id,
            ...(doc.data() as Omit<MessageType, 'id'>),
          });
        });

        if (isMounted) {
          setMessages(list);
          saveCachedMessages(list);
        }
      },
      error => {
        console.log('Firebase Offline:', error);
      },
    );

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;
    await addDoc(messagesCollection, {
      text: message,
      user: userEmail,
      createdAt: serverTimestamp(),
      imageBase64: null,
    });
    setMessage('');
  };

  const handleImagePick = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.5,
      maxWidth: 500,
      maxHeight: 500,
      includeBase64: true,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error Picker', response.errorMessage);
        return;
      }

      const asset = response.assets?.[0];
      if (!asset?.base64) {
        Alert.alert('Gagal', 'Tidak bisa memproses gambar ini.');
        return;
      }

      setUploading(true);
      try {
        const imageString = `data:${asset.type};base64,${asset.base64}`;

        await addDoc(messagesCollection, {
          text: '',
          user: userEmail,
          imageBase64: imageString,
          createdAt: serverTimestamp(),
        });
      } catch (error: any) {
        console.error('Gagal kirim gambar:', error);
        Alert.alert(
          'Gagal Upload',
          'Koneksi bermasalah atau gambar terlalu besar.',
        );
      } finally {
        setUploading(false);
      }
    });
  };

  const renderItem = ({ item }: { item: MessageType }) => (
    <View
      style={[
        styles.msgBox,
        item.user === userEmail ? styles.myMsg : styles.otherMsg,
      ]}
    >
      <Text style={styles.sender}>{item.user}</Text>

      {item.imageBase64 && (
        <Image
          source={{ uri: item.imageBase64 }}
          style={styles.chatImage}
          resizeMode="cover"
        />
      )}

      {item.text ? <Text style={{ color: 'black' }}>{item.text}</Text> : null}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={styles.inputRow}>
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.camButton}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={{ fontSize: 20 }}>📷</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Kirim" onPress={sendMessage} disabled={uploading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  msgBox: { padding: 10, marginVertical: 6, borderRadius: 6, maxWidth: '80%' },
  myMsg: { backgroundColor: '#d1f0ff', alignSelf: 'flex-end' },
  otherMsg: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sender: { fontSize: 10, color: 'gray', marginBottom: 4 },

  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
    height: 40,
  },
  camButton: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 50,
    marginRight: 10,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: '#eee',
  },
});
