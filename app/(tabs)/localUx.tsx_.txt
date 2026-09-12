import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

// 1. Definisi Tipe Data
export interface CollectionItem {
  id: string;
  title: string;
  isSynced: boolean;
}

export interface SyncOperation {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: CollectionItem;
}

export default function SimpleLocalSyncApp() {
  // 2. Tentukan Type Parameter pada useState
  const [items, setItems] = useState<CollectionItem[]>([
    { id: '1', title: 'Barang A', isSynced: true },
    { id: '2', title: 'Barang B', isSynced: true },
  ]);

  // Mengatasi error 'never[]' dengan memberi type <SyncOperation[]>
  const [syncQueue, setSyncQueue] = useState<SyncOperation[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // TAMBAH DATA (Instan ke Lokal)
  const handleAddItem = (): void => {
    if (!inputText.trim()) return;

    const newItem: CollectionItem = {
      id: `local_${Date.now()}`,
      title: inputText,
      isSynced: false,
    };

    // A. Update koleksi lokal secara instan
    setItems((prev) => [...prev, newItem]);

    // B. Masukkan ke antrean sync
    setSyncQueue((prev) => [...prev, { action: 'CREATE', payload: newItem }]);

    setIsSyncing(false)

    setInputText('');
  };

  // KIRIM KE SERVER (Saat User Klik "Save / Sync")
  const handleSyncToServer = async (): Promise<void> => {
    if (syncQueue.length === 0) {
      alert('Tidak ada perubahan lokal yang perlu disimpan.');
      return;
    }

    setIsSyncing(true);

    try {
      // Simulasi delay jaringan 1.5 detik
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Jika berhasil dikirim ke server:
      // A. Tandai semua item di koleksi lokal sebagai isSynced = true
      setItems((prev) =>
        prev.map((item) => ({ ...item, isSynced: true }))
      );

      // B. Kosongkan antrean sync
      setSyncQueue([]);
    } catch (error) {
      alert('Gagal sinkronisasi data ke server.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Koleksi Data Lokal (JSON + TypeScript)</Text>

      {/* Input Tambah Data */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nama barang baru..."
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="+ Lokal" onPress={handleAddItem} />
      </View>

      {/* List Item */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: CollectionItem }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{item.title}</Text>
            <Text style={item.isSynced ? styles.synced : styles.pending}>
              {item.isSynced ? '✓ Tersimpan di Server' : '⏳ Pending Lokal'}
            </Text>
          </View>
        )}
      />

      {/* Tombol Final Save/Sync */}
      <View style={styles.syncContainer}>
        <Text style={styles.queueText}>
          Antrean Sync Pending: {syncQueue.length} item
        </Text>
        <Button
          title={isSyncing ? 'Mengirim Data...' : 'Kirim Ke Server (Final Save)'}
          onPress={handleSyncToServer}
          disabled={isSyncing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#f5f5f5' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  inputRow: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, backgroundColor: '#fff' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#fff', borderRadius: 5, marginBottom: 8 },
  itemText: { fontSize: 15 },
  synced: { color: 'green', fontSize: 12 },
  pending: { color: 'orange', fontSize: 12, fontWeight: 'bold' },
  syncContainer: { marginBottom: 150, marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderColor: '#ddd' },
  queueText: { marginBottom: 10, fontSize: 13, color: '#555' },
});