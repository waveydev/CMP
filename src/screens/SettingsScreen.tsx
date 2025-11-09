import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, List, Button, Avatar } from 'react-native-paper';
import { useAuth } from '../auth/AuthProvider';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title
          title="Settings"
          left={(props) => <Avatar.Icon {...props} icon="cog" style={{ backgroundColor: '#ECFDF5' }} color="#047857" />}
        />
        <Card.Content>
          <List.Section>
            <List.Item title="Role" description={user?.role || '-'} left={(p) => <List.Icon {...p} icon="account-badge" />} />
            <List.Item title="Region" description={user?.region || '-'} left={(p) => <List.Icon {...p} icon="map" />} />
          </List.Section>
          <Button mode="contained" onPress={logout} style={styles.logoutBtn}>
            Log Out
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  logoutBtn: { marginTop: 8, backgroundColor: '#10B981' },
});
