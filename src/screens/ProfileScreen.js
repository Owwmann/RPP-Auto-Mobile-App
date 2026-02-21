import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/theme';

export default function ProfileScreen() {
  const [isDark, setIsDark] = useState(true);
  const [isNotif, setIsNotif] = useState(true);

  const Option = ({icon, title, sub, toggle, val}) => (
    <View style={styles.optionRow}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
         <View style={styles.iconBox}><Icon name={icon} size={20} color={COLORS.primary} /></View>
         <View>
           <Text style={styles.optTitle}>{title}</Text>
           {sub && <Text style={styles.optSub}>{sub}</Text>}
         </View>
      </View>
      {toggle ? (
         <Switch
           value={val}
           onValueChange={() => {}}
           trackColor={{ false: "#767577", true: COLORS.primary }}
           thumbColor={"#f4f3f4"}
         />
      ) : (
         <Icon name="chevron-right" size={24} color="#444" />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{alignItems: 'center', marginVertical: 30}}>
           <View style={styles.avatar}>
              <Icon name="account" size={60} color="#fff" />
              <View style={styles.proBadge}><Text style={styles.proText}>PRO</Text></View>
           </View>
           <Text style={styles.name}>Alex_Turbo</Text>
           <Text style={styles.handle}>@alexturbo99 • Member since 2023</Text>
          
           <View style={styles.statRow}>
             <View style={styles.stat}><Text style={styles.statNum}>3</Text><Text style={styles.statLbl}>VEHICLES</Text></View>
             <View style={styles.stat}><Text style={styles.statNum}>42</Text><Text style={styles.statLbl}>POSTS</Text></View>
             <View style={styles.stat}><Text style={styles.statNum}>850</Text><Text style={styles.statLbl}>REPUTATION</Text></View>
           </View>
        </View>

        <Text style={styles.header}>SYSTEM PREFERENCES</Text>
        <Option icon="theme-light-dark" title="Dark Mode" sub="Always active in RPP Auto" toggle val={isDark} />
        <Option icon="bell-ring-outline" title="Notifications" sub="Alerts & diagnostic updates" toggle val={isNotif} />
       
        <Text style={styles.header}>ACCOUNT & SECURITY</Text>
        <Option icon="account-cog-outline" title="Profile Details" />
        <Option icon="credit-card-outline" title="Subscription & Billing" />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.primary, marginBottom: 15 },
  proBadge: { position: 'absolute', bottom: 0, backgroundColor: COLORS.primary, paddingHorizontal: 8, borderRadius: 4 },
  proText: { color: 'black', fontWeight: 'bold', fontSize: 10 },
  name: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  handle: { color: '#666', marginTop: 5 },
  statRow: { flexDirection: 'row', marginTop: 25, width: '90%', justifyContent: 'space-between', backgroundColor: '#111', padding: 15, borderRadius: 10 },
  stat: { alignItems: 'center', flex: 1 },
  statNum: { color: COLORS.primary, fontSize: 20, fontWeight: 'bold' },
  statLbl: { color: '#666', fontSize: 10, marginTop: 4 },
  header: { color: COLORS.secondary, fontSize: 12, marginLeft: 20, marginTop: 20, marginBottom: 10, fontWeight: 'bold' },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, marginHorizontal: 15, marginBottom: 10, backgroundColor: '#121212', borderRadius: 8, borderWidth: 1, borderColor: '#222' },
  iconBox: { marginRight: 15 },
  optTitle: { color: 'white', fontSize: 16 },
  optSub: { color: '#666', fontSize: 12 }
});
