import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/theme';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{padding: 20}}>
       
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.username}>Commander Anderson</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
             <Icon name="weather-cloudy" size={24} color={COLORS.secondary} />
             <Text style={styles.weather}>62°F</Text>
          </View>
        </View>

        {/* Fleet Status Cards */}
        <View style={styles.row}>
          <View style={[styles.card, {flex: 1, marginRight: 10}]}>
            <Text style={styles.cardTitle}>FLEET HEALTH</Text>
            <Text style={styles.bigStat}>98%</Text>
            <Text style={styles.nominal}><Icon name="check-circle" /> All Systems Nominal</Text>
          </View>
          <View style={[styles.card, {flex: 1}]}>
             <Text style={styles.cardTitle}>ACTIVE ALERTS</Text>
             <Text style={[styles.bigStat, {color: COLORS.secondary}]}>2</Text>
             <Text style={styles.warning}><Icon name="alert-circle" /> Maintenance Due</Text>
          </View>
        </View>

        {/* Car Card */}
        <Text style={styles.sectionTitle}>MY VEHICLES</Text>
        <View style={styles.carCard}>
          <View style={styles.tag}><Text style={styles.tagText}>● ONLINE</Text></View>
          {/* Placeholder for Car Image - Using Icon for code simplicity */}
          <View style={{alignItems: 'center', marginVertical: 20}}>
            <Icon name="car-sports" size={120} color="#333" />
          </View>
          <View style={styles.carInfo}>
            <View>
              <Text style={styles.carName}>Interceptor One</Text>
              <Text style={styles.carSub}>2023 CYBER TRUCK</Text>
            </View>
            <Text style={styles.percent}>92%</Text>
          </View>
          <View style={styles.statsRow}>
             <View style={styles.miniStat}><Text style={styles.statLabel}>RANGE</Text><Text style={styles.statVal}>320 mi</Text></View>
             <View style={styles.miniStat}><Text style={styles.statLabel}>TIRE PRESS</Text><Text style={styles.statVal}>45 PSI</Text></View>
          </View>
        </View>

        {/* Diagnostics Action */}
        <Text style={styles.sectionTitle}>DIAGNOSTICS CENTER</Text>
        <Pressable style={styles.actionBtn}>
          <View style={styles.iconBox}><Icon name="scan-helper" size={24} color={COLORS.primary} /></View>
          <View style={{flex: 1, marginLeft: 15}}>
            <Text style={styles.actionTitle}>AI System Scan</Text>
            <Text style={styles.actionSub}>Connect OBD2 or Input Symptoms</Text>
          </View>
          <Icon name="chevron-right" size={24} color={COLORS.primary} />
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 },
  welcome: { color: COLORS.textDim, fontSize: 14 },
  username: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  weather: { color: COLORS.text, fontSize: 14 },
  row: { flexDirection: 'row', marginBottom: 25 },
  card: { backgroundColor: COLORS.card, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { color: COLORS.textDim, fontSize: 10, marginBottom: 5 },
  bigStat: { color: COLORS.primary, fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  nominal: { color: COLORS.primary, fontSize: 10 },
  warning: { color: COLORS.secondary, fontSize: 10 },
  sectionTitle: { color: COLORS.text, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  carCard: { backgroundColor: '#0f0f0f', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#222', marginBottom: 20 },
  tag: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(57, 255, 20, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: COLORS.primary },
  tagText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },
  carInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  carName: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  carSub: { color: COLORS.textDim, fontSize: 12 },
  percent: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 10 },
  miniStat: { backgroundColor: '#1a1a1a', flex: 1, padding: 10, borderRadius: 6 },
  statLabel: { color: '#666', fontSize: 10 },
  statVal: { color: '#FFF', fontWeight: 'bold' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a0a0a', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: COLORS.primary },
  iconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(57, 255, 20, 0.1)', alignItems: 'center', justifyContent: 'center' },
  actionTitle: { color: COLORS.text, fontWeight: 'bold', fontSize: 16 },
  actionSub: { color: COLORS.textDim, fontSize: 12 }
});
