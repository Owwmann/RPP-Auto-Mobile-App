import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/theme';

export default function DiagnosticsScreen() {
  const [step, setStep] = useState(0); // 0: Start, 1: Scanning, 2: Input, 3: Result

  const renderContent = () => {
    switch(step) {
      case 0:
        return (
           <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
             <View style={styles.circle}><Icon name="robot" size={60} color={COLORS.primary} /></View>
             <Text style={styles.prompt}>How can I assist with your vehicle today?</Text>
            
             <Pressable style={styles.optionBtn} onPress={() => setStep(1)}>
               <View style={styles.iconSquare}><Icon name="connection" size={24} color={COLORS.primary} /></View>
               <View style={{marginLeft: 15}}>
                 <Text style={styles.btnTitle}>CONNECT OBD2 SCANNER</Text>
                 <Text style={styles.btnSub}>Wireless bridge to vehicle ECU</Text>
               </View>
             </Pressable>
            
             <Pressable style={styles.optionBtn} onPress={() => setStep(2)}>
               <View style={[styles.iconSquare, {borderColor: COLORS.secondary}]}><Icon name="stethoscope" size={24} color={COLORS.secondary} /></View>
               <View style={{marginLeft: 15}}>
                 <Text style={styles.btnTitle}>MANUAL SYMPTOM INPUT</Text>
                 <Text style={styles.btnSub}>Describe noise, smell, or feel</Text>
               </View>
             </Pressable>
           </View>
        );
      case 1:
        // Simulating the "Scanning" circle (Image 12, 13)
        setTimeout(() => setStep(3), 2000);
        return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={[styles.circle, {width: 200, height: 200, borderRadius: 100}]}>
              <Text style={{color: COLORS.primary, fontSize: 24, fontWeight: 'bold'}}>SCANNING...</Text>
            </View>
            <Text style={{color: COLORS.textDim, marginTop: 20}}>Analyzing ECU Vitals</Text>
          </View>
        );
      case 2:
        // Manual Input (Image 14-19)
        return (
          <View style={{flex: 1, padding: 20, paddingTop: 60}}>
             <Text style={styles.stepTitle}>STEP 01: OBSERVATION</Text>
             <Text style={styles.bigQuestion}>What type of anomaly are you detecting?</Text>
             <View style={{flexDirection: 'row', gap: 15, marginTop: 40}}>
                <Pressable style={styles.bigSelect} onPress={() => setStep(1)}>
                   <Icon name="ear-hearing" size={40} color={COLORS.primary} />
                   <Text style={styles.selectText}>ABNORMAL NOISE</Text>
                </Pressable>
                <Pressable style={styles.bigSelect} onPress={() => setStep(1)}>
                   <Icon name="air-filter" size={40} color={COLORS.secondary} />
                   <Text style={[styles.selectText, {color: COLORS.secondary}]}>STRANGE SMELL</Text>
                </Pressable>
             </View>
          </View>
        );
      case 3:
        // Results (Image 25)
        return (
          <View style={{flex: 1, padding: 20, paddingTop: 40}}>
             <View style={{alignItems: 'center', marginBottom: 30}}>
                <View style={[styles.circle, {borderColor: COLORS.primary, borderWidth: 4}]}>
                  <Text style={{fontSize: 40, color: 'white', fontWeight: 'bold'}}>94%</Text>
                  <Text style={{color: '#666', fontSize: 10}}>CONFIDENCE</Text>
                </View>
             </View>
            
             <View style={styles.resultCard}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={styles.codeTitle}>O2 Sensor Heater Circuit</Text>
                  <View style={styles.badge}><Text style={styles.badgeText}>HIGH SEVERITY</Text></View>
                </View>
                <Text style={styles.code}>CODE: P0030</Text>
                <Text style={styles.desc}>Heater control circuit bank 1 sensor 1 malfunction detected.</Text>
                <View style={styles.estBox}>
                   <Text style={{color: '#888'}}>EST. REPAIR COST</Text>
                   <Text style={{color: COLORS.primary, fontWeight: 'bold'}}>$140 - $280</Text>
                </View>
             </View>
             <Pressable style={[styles.optionBtn, {marginTop: 20, backgroundColor: COLORS.primary, borderWidth: 0}]} onPress={() => setStep(0)}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>FIND MECHANIC</Text>
             </Pressable>
          </View>
        );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  circle: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  prompt: { color: 'white', fontSize: 18, textAlign: 'center', maxWidth: '80%', marginBottom: 40, fontWeight: '600' },
  optionBtn: { width: '90%', flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  iconSquare: { width: 50, height: 50, borderRadius: 10, borderWidth: 1, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  btnTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  btnSub: { color: '#666', fontSize: 12 },
  stepTitle: { color: COLORS.primary, letterSpacing: 2, marginBottom: 10 },
  bigQuestion: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  bigSelect: { flex: 1, height: 160, backgroundColor: '#0f0f0f', borderWidth: 1, borderColor: '#333', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  selectText: { color: COLORS.primary, marginTop: 15, fontWeight: 'bold' },
  resultCard: { backgroundColor: '#111', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#333' },
  codeTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', width: '70%' },
  badge: { borderWidth: 1, borderColor: '#FF4444', padding: 5, borderRadius: 4 },
  badgeText: { color: '#FF4444', fontSize: 10, fontWeight: 'bold' },
  code: { color: COLORS.secondary, marginVertical: 10, fontWeight: 'bold', backgroundColor: 'rgba(255, 215, 0, 0.1)', alignSelf: 'flex-start', padding: 4 },
  desc: { color: '#ccc', lineHeight: 20, marginBottom: 20 },
  estBox: { borderWidth: 1, borderColor: '#333', borderStyle: 'dashed', padding: 15, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 8 }
});
