import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  StatusBar, Pressable, ScrollView, Switch, FlatList,
  Animated, Easing, Modal, Linking, Platform, Alert,
  KeyboardAvoidingView, TouchableOpacity, ActivityIndicator,
  Dimensions
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { width: SW, height: SH } = Dimensions.get('window');

// â”€â”€ COLORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const C = {
  bg: '#050505', card: '#121212', primary: '#39FF14',
  secondary: '#FFD700', text: '#FFFFFF', dim: '#888888',
  border: '#333333', danger: '#FF4444', link: '#4DA6FF',
  alt: '#0f0f0f', overlay: 'rgba(0,0,0,0.92)',
};

// â”€â”€ MOCK DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const VEHICLES = [
  { id:'v1', name:'Interceptor One', model:'2023 Cybertruck', health:92, range:320, tire:45, status:'ONLINE', mileage:'12,450', vin:'5YJ3E1EB1NF000001' },
  { id:'v2', name:'Shadow Runner',   model:'2021 Tesla Model 3', health:78, range:240, tire:42, status:'OFFLINE', mileage:'34,210', vin:'5YJ3E1EA5MF123456' },
];

const DTC_CODES = [
  { code:'P0030', title:'O2 Sensor Heater Circuit', severity:'HIGH', sensor:'Bank 1, Sensor 1', parts:[{name:'Bosch 17025 O2 Sensor',price:'$145.00'},{name:'22mm O2 Socket',price:'$12.99'}], chemical:'Try Cataclean fuel additive to clear carbon buildup before replacing sensor.' },
  { code:'P0420', title:'Catalyst Efficiency Below Threshold', severity:'MED', sensor:'Bank 1', parts:[{name:'MagnaFlow Catalytic Converter',price:'$389.00'},{name:'Anti-seize compound',price:'$8.99'}], chemical:'Use Oxicat catalyst cleaner through fuel tank - may resolve soft codes.' },
  { code:'C0035', title:'Left Front Wheel Speed Sensor', severity:'HIGH', sensor:'ABS Module', parts:[{name:'Dorman ABS Speed Sensor',price:'$67.00'},{name:'Brake cleaner spray',price:'$6.99'}], chemical:'N/A - electrical fault requires sensor replacement.' },
];

const FORUM_POSTS = [
  { id:'p1', user:'Alex_Turbo',   avatar:'AT', title:'Rough idle on cold start - 2018 Civic Si', tag:'SOLVED', votes:42, comments:18, time:'2h ago', body:'Fixed it! Was a vacuum leak at the intake manifold gasket.' },
  { id:'p2', user:'SarahTunes',   avatar:'ST', title:'Finally finished the new intake setup! ðŸš€',  tag:'MODS',   votes:156,comments:45, time:'5h ago', body:'Full cold air intake, gains 18hp on the dyno.' },
  { id:'p3', user:'GearHead_99',  avatar:'GH', title:'Engine knock at 3k RPM - help needed',       tag:'HELP',   votes:15, comments:10, time:'1d ago', body:'Sounds like rod knock. Already checked oil level, its fine.' },
  { id:'p4', user:'VoltMaster',   avatar:'VM', title:'EV conversion progress thread - Week 12',    tag:'BUILD',  votes:203,comments:67, time:'3d ago', body:'Swapped the original motor for a Tesla drive unit.' },
  { id:'p5', user:'TurboTanya',   avatar:'TT', title:'Best budget OBD2 scanner under $50?',        tag:'TOOL',   votes:88, comments:32, time:'4d ago', body:'Just picked up the BAFX Bluetooth unit. Works great.' },
];

const VIDEOS = [
  { id:'v1', title:'Start your car with a CAPACITOR?', author:'Scotty Kilmer', views:'2.1M', duration:'12:34', category:'Emergency' },
  { id:'v2', title:'How to fix P0030 Code FAST',       author:'RPP Tech',     views:'15k',  duration:'8:22',  category:'Diagnostic' },
  { id:'v3', title:'Best OBD2 Scanners of 2025',       author:'Car Wizard',   views:'400k', duration:'18:05', category:'Reviews' },
  { id:'v4', title:'Full brake job - step by step',    author:'ChrisFix',     views:'5.2M', duration:'25:10', category:'Repair' },
  { id:'v5', title:'Understanding DTC codes guide',    author:'RPP Tech',     views:'89k',  duration:'14:30', category:'Education' },
];

const RESOURCES = [
  { id:'r1', name:'Emergency Power',    icon:'âš¡', desc:'Jump Starters, Solar, Capacitors', count:24 },
  { id:'r2', name:'Chemical Repair',    icon:'ðŸ§ª', desc:'Head Gasket Fix, Stop-Leak, Cataclean', count:18 },
  { id:'r3', name:'Fluids & Systems',   icon:'ðŸ›¢', desc:'Synthetics, Additives, Flushes', count:31 },
  { id:'r4', name:'Aesthetic Restore',  icon:'âœ¨', desc:'Headlight Kits, Scratch Removal', count:15 },
  { id:'r5', name:'Security & Cams',    icon:'ðŸ“·', desc:'Dash Cams, Faraday Boxes, GPS', count:22 },
  { id:'r6', name:'Inspection Tools',   icon:'ðŸ”¬', desc:'Borescopes, Circuit Testers, DVOM', count:19 },
  { id:'r7', name:'OBD2 Scanners',      icon:'ðŸ”Œ', desc:'Professional & DIY Grade', count:12 },
  { id:'r8', name:'Hand Tools',         icon:'ðŸ”§', desc:'Wrenches, Sockets, Torque', count:45 },
];

const RECALLS = [
  { id:'r1', title:'TSB-23-01: High Voltage Wiring Harness', severity:'HIGH', date:'2023-11-14', status:'OPEN' },
  { id:'r2', title:'Recall: Trunk Latch Failure NHTSA-23-091', severity:'MED', date:'2023-09-02', status:'OPEN' },
  { id:'r3', title:'TSB-22-14: Touchscreen Firmware Update', severity:'LOW', date:'2022-06-18', status:'REMEDY AVAIL' },
];

const MECHANICS = [
  { id:'m1', name:'AutoElite Pro Shop', rating:4.9, reviews:312, distance:'0.8mi', price:'$$', specialty:'Diagnostics & EV', open:true },
  { id:'m2', name:'QuickFix Mobile',    rating:4.7, reviews:189, distance:'1.2mi', price:'$',  specialty:'General Repair',   open:true },
  { id:'m3', name:'TechMotor Center',   rating:4.8, reviews:427, distance:'2.1mi', price:'$$$',specialty:'German & Electric', open:false },
];

// â”€â”€ REUSABLE COMPONENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NeonBtn = ({ title, onPress, style, small, outline, danger }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const press  = () => { Animated.sequence([Animated.timing(scale,{toValue:0.96,duration:80,useNativeDriver:true}),Animated.timing(scale,{toValue:1,duration:80,useNativeDriver:true})]).start(); onPress && onPress(); };
  const bg = danger ? C.danger : outline ? 'transparent' : C.primary;
  const tc = (outline || danger) ? C.text : '#000';
  const bc = danger ? C.danger : C.primary;
  return (
    <Animated.View style={{transform:[{scale}]}}>
      <Pressable onPress={press} style={[s.neonBtn, {backgroundColor:bg, borderColor:bc, borderWidth:outline?1:0, height:small?42:55}, style]} android_ripple={{color:'rgba(0,0,0,0.3)'}}>
        <Text style={[s.btnTxt, {color:tc, fontSize:small?13:15}]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

const Card = ({ children, style }) => <View style={[s.card, style]}>{children}</View>;
const SectionHdr = ({ title, right }) => (
  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:20,marginBottom:10}}>
    <Text style={s.sectionHdr}>{title}</Text>
    {right && <Text style={{color:C.primary,fontSize:12}}>{right}</Text>}
  </View>
);

const SeverityBadge = ({ level }) => {
  const colors = { HIGH: C.danger, MED: C.secondary, LOW: '#4DA6FF' };
  return <View style={{backgroundColor:colors[level]+'20',borderWidth:1,borderColor:colors[level],paddingHorizontal:8,paddingVertical:2,borderRadius:4}}><Text style={{color:colors[level],fontSize:10,fontWeight:'bold'}}>{level}</Text></View>;
};

const TagBadge = ({ tag }) => {
  const map = { SOLVED:{bg:'rgba(57,255,20,0.15)',bc:C.primary,tc:C.primary}, HELP:{bg:'rgba(255,68,68,0.15)',bc:C.danger,tc:C.danger}, MODS:{bg:'rgba(77,166,255,0.15)',bc:C.link,tc:C.link}, BUILD:{bg:'rgba(255,215,0,0.15)',bc:C.secondary,tc:C.secondary}, TOOL:{bg:'rgba(136,136,136,0.15)',bc:C.dim,tc:C.dim} };
  const style = map[tag] || map.TOOL;
  return <View style={{backgroundColor:style.bg,borderWidth:1,borderColor:style.bc,paddingHorizontal:6,paddingVertical:2,borderRadius:4}}><Text style={{color:style.tc,fontSize:9,fontWeight:'bold'}}>{tag}</Text></View>;
};

const Avatar = ({ initials, size=36 }) => (
  <View style={{width:size,height:size,borderRadius:size/2,backgroundColor:'#222',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.border}}>
    <Text style={{color:C.primary,fontWeight:'bold',fontSize:size/3}}>{initials}</Text>
  </View>
);

const HealthBar = ({ pct, color }) => (
  <View style={{height:4,backgroundColor:'#222',borderRadius:2,marginTop:6}}>
    <View style={{width:`${pct}%`,height:'100%',backgroundColor:color||C.primary,borderRadius:2}}/>
  </View>
);

const SpinRing = ({ size=200, color }) => {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.loop(Animated.timing(spin,{toValue:1,duration:3000,easing:Easing.linear,useNativeDriver:true})).start(); },[]);
  const rotate = spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']});
  return (
    <Animated.View style={{width:size,height:size,borderRadius:size/2,borderWidth:2,borderColor:color||C.primary,borderStyle:'dashed',position:'absolute',transform:[{rotate}]}}>
      <View style={{width:10,height:10,borderRadius:5,backgroundColor:color||C.primary,position:'absolute',top:0,alignSelf:'center'}}/>
    </Animated.View>
  );
};

// â”€â”€ SCREEN 1: SPLASH / BOOT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SplashScreen = ({ navigation }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade,{toValue:1,duration:1200,useNativeDriver:true}),
      Animated.timing(progress,{toValue:1,duration:2000,useNativeDriver:false}),
    ]).start(() => navigation.replace('Login'));
  },[]);
  const width = progress.interpolate({inputRange:[0,1],outputRange:['0%','100%']});
  return (
    <SafeAreaView style={[s.center,{backgroundColor:C.bg,flex:1}]}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Animated.View style={{opacity:fade,alignItems:'center'}}>
        <View style={s.logoCircle}>
          <Text style={{fontSize:40}}>ðŸ”§</Text>
        </View>
        <Text style={s.appTitle}>RPP AUTO</Text>
        <Text style={s.sysStatus}>SYSTEMS BOOTING â€¢ v2.4.0</Text>
        <View style={{width:200,height:2,backgroundColor:'#222',borderRadius:1,marginTop:40}}>
          <Animated.View style={{height:'100%',backgroundColor:C.primary,borderRadius:1,width}}/>
        </View>
        <Text style={{color:C.dim,fontSize:11,marginTop:12,fontFamily:Platform.OS==='ios'?'Courier':'monospace'}}>Initializing diagnostic modules...</Text>
      </Animated.View>
      <Text style={s.secureFooter}>SECURE // ENCRYPTED // v2.4.0</Text>
    </SafeAreaView>
  );
};

// â”€â”€ SCREEN 2: LOGIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const LoginScreen = ({ navigation }) => {
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [passVis,setPassVis]=useState(false);
  const [focusEmail,setFocusEmail]=useState(false);
  const [focusPass,setFocusPass]=useState(false);
  const [loading,setLoading]=useState(false);
  const shake = useRef(new Animated.Value(0)).current;
  const doShake = () => { Animated.sequence([...Array(4).fill(null).map((_,i)=>Animated.timing(shake,{toValue:i%2===0?10:-10,duration:60,useNativeDriver:true})),Animated.timing(shake,{toValue:0,duration:60,useNativeDriver:true})] ).start(); };
  const handleLogin = () => {
    if(!email || !pass){ doShake(); Alert.alert('RPP Auto','Please enter credentials to continue.'); return; }
    setLoading(true);
    setTimeout(()=>{ setLoading(false); navigation.replace('MainApp'); },1800);
  };
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
        <ScrollView contentContainerStyle={s.loginContent} keyboardShouldPersistTaps="handled">
          <View style={s.logoCircle}><Text style={{fontSize:40}}>ðŸ”§</Text></View>
          <Text style={s.appTitle}>RPP AUTO</Text>
          <Text style={s.sysStatus}>SYSTEMS ONLINE â€¢ v2.4.0</Text>
          <Animated.View style={{width:'100%',marginTop:40,transform:[{translateX:shake}]}}>
            <Text style={s.screenTitle}>Authentication</Text>
            <Text style={{color:C.dim,marginBottom:24,fontSize:14}}>Enter credentials to access diagnostics.</Text>
            <Text style={s.inputLbl}>USER ID / EMAIL</Text>
            <View style={[s.inputWrap,focusEmail&&s.inputFocused]}>
              <Text style={{color:C.dim,marginRight:10,fontSize:18}}>âœ‰</Text>
              <TextInput style={s.input} placeholder="name@example.com" placeholderTextColor="#555" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" onFocus={()=>setFocusEmail(true)} onBlur={()=>setFocusEmail(false)}/>
            </View>
            <Text style={[s.inputLbl,{marginTop:16}]}>PASSCODE</Text>
            <View style={[s.inputWrap,focusPass&&s.inputFocused]}>
              <Text style={{color:C.dim,marginRight:10,fontSize:18}}>ðŸ”’</Text>
              <TextInput style={s.input} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" placeholderTextColor="#555" value={pass} onChangeText={setPass} secureTextEntry={!passVis} onFocus={()=>setFocusPass(true)} onBlur={()=>setFocusPass(false)}/>
              <Pressable onPress={()=>setPassVis(!passVis)} hitSlop={12}><Text style={{color:C.dim,fontSize:18}}>{passVis?'ðŸ™ˆ':'ðŸ‘ '}</Text></Pressable>
            </View>
            <Pressable style={{alignSelf:'flex-end',marginTop:12,marginBottom:28,flexDirection:'row',alignItems:'center'}} onPress={()=>Alert.alert('Recover Access','A reset link will be sent to your email.')}>
              <Text style={{color:C.secondary,fontWeight:'bold',fontSize:14}}>ðŸ›¡ Recover Access</Text>
            </Pressable>
            <NeonBtn title={loading?'AUTHENTICATING...':'INITIALIZE SESSION'} onPress={handleLogin}/>
            {loading && <ActivityIndicator color={C.primary} style={{marginTop:16}}/>}
            <View style={{flexDirection:'row',justifyContent:'center',marginTop:24}}>
              <Text style={{color:C.dim}}>New vehicle in fleet? </Text>
              <Pressable onPress={()=>Alert.alert('Register Unit','Vehicle registration opens after login.')}><Text style={{color:C.text,fontWeight:'bold'}}>Register Unit â†’</Text></Pressable>
            </View>
          </Animated.View>
          <Text style={s.secureFooter}>SECURE // ENCRYPTED</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// â”€â”€ SCREEN 3: DASHBOARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DashboardScreen = ({ navigation }) => {
  const [showRecalls,setShowRecalls]=useState(false);
  const [showResources,setShowResources]=useState(false);
  const [selectedVeh,setSelectedVeh]=useState(VEHICLES[0]);
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(()=>{ Animated.loop(Animated.sequence([Animated.timing(pulse,{toValue:1.04,duration:900,useNativeDriver:true}),Animated.timing(pulse,{toValue:1,duration:900,useNativeDriver:true})])).start(); },[]);
  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <ScrollView contentContainerStyle={{padding:20,paddingBottom:100}}>
        {/* Header */}
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <View>
            <Text style={{color:C.dim,fontSize:12}}>Welcome back,</Text>
            <Text style={{color:C.text,fontSize:22,fontWeight:'bold'}}>Commander Anderson</Text>
          </View>
          <View style={{alignItems:'flex-end'}}>
            <Text style={{color:C.secondary,fontSize:22}}>â›…</Text>
            <Text style={{color:C.text,fontWeight:'bold'}}>62Â°F</Text>
          </View>
        </View>

        {/* Recalls Alert */}
        <Pressable style={s.alertBanner} onPress={()=>setShowRecalls(true)} android_ripple={{color:'rgba(0,0,0,0.2)'}}>
          <Text style={{color:'#000',fontWeight:'bold',flex:1}}>âš  3 ACTIVE RECALLS â€” VIN MATCH DETECTED</Text>
          <Text style={{color:'#000'}}>VIEW â†’</Text>
        </Pressable>

        {/* Stats Row */}
        <View style={{flexDirection:'row',gap:12,marginBottom:20}}>
          <Card style={{flex:1}}>
            <Text style={s.cardLbl}>FLEET HEALTH</Text>
            <Text style={[s.statBig,{color:C.primary}]}>98%</Text>
            <Text style={{color:C.primary,fontSize:10}}>âœ“ All Systems Nominal</Text>
            <HealthBar pct={98}/>
          </Card>
          <Card style={{flex:1}}>
            <Text style={s.cardLbl}>ACTIVE ALERTS</Text>
            <Text style={[s.statBig,{color:C.secondary}]}>2</Text>
            <Text style={{color:C.secondary,fontSize:10}}>âš  Maintenance Due</Text>
            <HealthBar pct={40} color={C.secondary}/>
          </Card>
        </View>

        {/* Vehicle Cards */}
        <SectionHdr title="MY FLEET" right="MANAGE â†’"/>
        {VEHICLES.map(v=>(
          <Pressable key={v.id} style={[s.vehicleCard,selectedVeh.id===v.id&&{borderColor:C.primary}]} onPress={()=>setSelectedVeh(v)} android_ripple={{color:'rgba(57,255,20,0.07)'}}>
            <View style={[s.onlineTag,{borderColor:v.status==='ONLINE'?C.primary:C.dim}]}>
              <Text style={{color:v.status==='ONLINE'?C.primary:C.dim,fontSize:10,fontWeight:'bold'}}>â— {v.status}</Text>
            </View>
            <Text style={{fontSize:60,textAlign:'center',marginVertical:10}}>ðŸš—</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <View><Text style={{color:C.text,fontSize:18,fontWeight:'bold'}}>{v.name}</Text><Text style={{color:C.dim,fontSize:12}}>{v.model}</Text></View>
              <Text style={{color:v.health>85?C.primary:C.secondary,fontSize:22,fontWeight:'bold'}}>{v.health}%</Text>
            </View>
            <HealthBar pct={v.health} color={v.health>85?C.primary:C.secondary}/>
            <View style={{flexDirection:'row',gap:8,marginTop:12}}>
              <View style={s.miniStat}><Text style={s.miniLbl}>RANGE</Text><Text style={s.miniVal}>{v.range} mi</Text></View>
              <View style={s.miniStat}><Text style={s.miniLbl}>TIRE PRESS</Text><Text style={s.miniVal}>{v.tire} PSI</Text></View>
              <View style={s.miniStat}><Text style={s.miniLbl}>MILEAGE</Text><Text style={s.miniVal}>{v.mileage}</Text></View>
            </View>
          </Pressable>
        ))}

        {/* Quick Actions */}
        <SectionHdr title="QUICK ACTIONS"/>
        <View style={{flexDirection:'row',gap:10,marginBottom:16}}>
          <Pressable style={[s.quickAction]} onPress={()=>navigation.navigate('Scan')} android_ripple={{color:'rgba(57,255,20,0.1)'}}>
            <Animated.Text style={{fontSize:28,transform:[{scale:pulse}]}}>ðŸ” </Animated.Text>
            <Text style={[s.qaText,{color:C.primary}]}>AI Scan</Text>
          </Pressable>
          <Pressable style={s.quickAction} onPress={()=>setShowResources(true)} android_ripple={{color:'rgba(255,215,0,0.1)'}}>
            <Text style={{fontSize:28}}>ðŸ› </Text>
            <Text style={[s.qaText,{color:C.secondary}]}>Resources</Text>
          </Pressable>
          <Pressable style={s.quickAction} onPress={()=>navigation.navigate('Book')} android_ripple={{color:'rgba(77,166,255,0.1)'}}>
            <Text style={{fontSize:28}}>ðŸ”§</Text>
            <Text style={[s.qaText,{color:C.link}]}>Mechanic</Text>
          </Pressable>
          <Pressable style={s.quickAction} onPress={()=>navigation.navigate('Community')} android_ripple={{color:'rgba(255,255,255,0.05)'}}>
            <Text style={{fontSize:28}}>ðŸ‘¥</Text>
            <Text style={s.qaText}>Community</Text>
          </Pressable>
        </View>

        {/* Recalls Modal */}
        <Modal visible={showRecalls} animationType="slide" transparent onRequestClose={()=>setShowRecalls(false)}>
          <View style={s.modalOverlay}>
            <View style={s.modalBox}>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:20}}>
                <Text style={s.screenTitle}>Active Recalls & TSBs</Text>
                <Pressable onPress={()=>setShowRecalls(false)} hitSlop={12}><Text style={{color:C.text,fontSize:22}}>âœ•</Text></Pressable>
              </View>
              {RECALLS.map(r=>(
                <View key={r.id} style={[s.card,{marginBottom:10}]}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
                    <SeverityBadge level={r.severity}/>
                    <Text style={{color:C.dim,fontSize:11}}>{r.date}</Text>
                  </View>
                  <Text style={{color:C.text,fontWeight:'bold',marginBottom:4}}>{r.title}</Text>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{color:r.status==='OPEN'?C.danger:C.primary,fontSize:11,fontWeight:'bold'}}>{r.status}</Text>
                    <Pressable onPress={()=>Alert.alert('NHTSA','Opening NHTSA database...')}><Text style={{color:C.link,fontSize:12}}>View Details â†’</Text></Pressable>
                  </View>
                </View>
              ))}
              <NeonBtn title="SCHEDULE RECALL REPAIR" onPress={()=>{setShowRecalls(false);navigation.navigate('Book');}} style={{marginTop:10}}/>
            </View>
          </View>
        </Modal>

        {/* Resources Modal */}
        <Modal visible={showResources} animationType="slide" transparent onRequestClose={()=>setShowResources(false)}>
          <View style={s.modalOverlay}>
            <View style={[s.modalBox,{height:'85%'}]}>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:20}}>
                <Text style={s.screenTitle}>Parts & Tools Hub</Text>
                <Pressable onPress={()=>setShowResources(false)} hitSlop={12}><Text style={{color:C.text,fontSize:22}}>âœ•</Text></Pressable>
              </View>
              <FlatList data={RESOURCES} numColumns={2} keyExtractor={i=>i.id}
                renderItem={({item})=>(
                  <Pressable style={s.resourceItem} onPress={()=>Alert.alert(item.name,item.desc)} android_ripple={{color:'rgba(57,255,20,0.1)'}}>
                    <Text style={{fontSize:32}}>{item.icon}</Text>
                    <Text style={{color:C.text,fontWeight:'bold',marginTop:8,textAlign:'center',fontSize:12}}>{item.name}</Text>
                    <Text style={{color:C.dim,fontSize:9,textAlign:'center',marginTop:4}}>{item.desc}</Text>
                    <Text style={{color:C.primary,fontSize:10,marginTop:6}}>{item.count} items â†’</Text>
                  </Pressable>
                )}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

// â”€â”€ SCREEN 4: DIAGNOSTICS / SCAN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ScanScreen = ({ navigation }) => {
  const [step,setStep]=useState('MENU'); // MENU | SCAN | OBD | RESULT
  const [scanning,setScanning]=useState(false);
  const [progress,setProgress]=useState(0);
  const [result,setResult]=useState(null);
  const [showWiring,setShowWiring]=useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const startScan = (mode) => {
    setStep('SCAN');
    setScanning(true);
    setProgress(0);
    let p=0;
    const iv = setInterval(()=>{ p+=Math.random()*15; if(p>=100){ clearInterval(iv); setScanning(false); setResult(DTC_CODES[0]); setStep('RESULT'); } setProgress(Math.min(p,100)); },300);
  };

  if(step==='MENU') return (
    <SafeAreaView style={s.screen}>
      <ScrollView contentContainerStyle={{padding:20,paddingBottom:100}}>
        <Text style={s.screenTitle}>AI Diagnostics</Text>
        <Text style={{color:C.dim,marginBottom:24}}>Connect your OBD2 device or enter symptoms manually.</Text>
        <Card style={{alignItems:'center',padding:30,marginBottom:20}}>
          <View style={{position:'relative',width:160,height:160,alignItems:'center',justifyContent:'center'}}>
            <SpinRing size={160}/>
            <View style={{width:100,height:100,borderRadius:50,backgroundColor:'rgba(57,255,20,0.05)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.primary}}>
              <Text style={{fontSize:40}}>ðŸ¤–</Text>
            </View>
          </View>
          <Text style={[s.sysStatus,{marginTop:20}]}>AI_ASSISTANT // V.4.2</Text>
          <Text style={{color:C.text,marginTop:8,textAlign:'center'}}>Hello, Driver.</Text>
          <Text style={{color:C.dim,textAlign:'center',fontSize:13}}>Ready to analyze system vitals.</Text>
        </Card>
        <NeonBtn title="ðŸ”Œ  CONNECT OBD2 & SCAN" onPress={()=>startScan('OBD')} style={{marginBottom:12}}/>
        <NeonBtn title="ðŸ¤–  AI SYMPTOM ANALYSIS" onPress={()=>startScan('AI')} style={{marginBottom:12}} outline/>
        <NeonBtn title="ðŸ“‹  ENTER DTC CODE MANUALLY" onPress={()=>Alert.alert('Manual Entry','Enter your DTC code (e.g. P0030)')} outline/>
        <SectionHdr title="RECENT SCANS"/>
        {DTC_CODES.slice(0,2).map(d=>(
          <Pressable key={d.code} style={[s.card,{flexDirection:'row',alignItems:'center',marginBottom:8}]} onPress={()=>{setResult(d);setStep('RESULT');}}>
            <View style={{flex:1}}>
              <Text style={{color:C.secondary,fontWeight:'bold'}}>{d.code}</Text>
              <Text style={{color:C.text,fontSize:13}}>{d.title}</Text>
            </View>
            <SeverityBadge level={d.severity}/>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );

  if(step==='SCAN') return (
    <SafeAreaView style={[s.screen,s.center]}>
      <View style={{position:'relative',width:200,height:200,alignItems:'center',justifyContent:'center',marginBottom:40}}>
        <SpinRing size={200}/>
        <SpinRing size={150}/>
        <View style={{width:100,height:100,borderRadius:50,backgroundColor:'rgba(57,255,20,0.05)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.primary}}>
          <Text style={{fontSize:40}}>ðŸ¤–</Text>
        </View>
      </View>
      <Text style={s.sysStatus}>SCANNING ECU...</Text>
      <View style={{width:SW*0.7,height:4,backgroundColor:'#222',borderRadius:2,marginTop:20,marginBottom:8}}>
        <View style={{width:`${progress}%`,height:'100%',backgroundColor:C.primary,borderRadius:2}}/>
      </View>
      <Text style={{color:C.dim,fontSize:13}}>{Math.floor(progress)}% Complete</Text>
      <Text style={{color:C.dim,fontSize:11,marginTop:10,fontFamily:Platform.OS==='ios'?'Courier':'monospace'}}>
        {progress<30?'Reading sensor data...':progress<60?'Analyzing fault codes...':progress<85?'Cross-referencing TSB database...':'Generating repair protocol...'}
      </Text>
    </SafeAreaView>
  );

  if(step==='RESULT' && result) return (
    <SafeAreaView style={s.screen}>
      <ScrollView contentContainerStyle={{padding:20,paddingBottom:100}}>
        <Pressable onPress={()=>setStep('MENU')} style={{flexDirection:'row',alignItems:'center',marginBottom:20}}>
          <Text style={{color:C.primary,fontSize:16}}>â† Back</Text>
        </Pressable>
        <Card style={{marginBottom:16}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
            <View style={{flex:1}}>
              <Text style={{color:C.text,fontSize:18,fontWeight:'bold',marginBottom:4}}>{result.title}</Text>
              <Text style={{color:C.secondary,fontSize:22,fontWeight:'bold',marginVertical:8}}>CODE: {result.code}</Text>
              <Text style={{color:C.dim,fontSize:12}}>Sensor: {result.sensor}</Text>
            </View>
            <SeverityBadge level={result.severity}/>
          </View>
          <Pressable style={s.techDataBtn} onPress={()=>setShowWiring(true)} android_ripple={{color:'rgba(0,0,0,0.2)'}}>
            <Text style={{color:'#000',fontWeight:'bold'}}>ðŸ“ VIEW OEM WIRING SCHEMATIC</Text>
          </Pressable>
        </Card>

        <SectionHdr title="REQUIRED PARTS & TOOLS"/>
        {result.parts.map((p,i)=>(
          <View key={i} style={[s.card,{flexDirection:'row',alignItems:'center',marginBottom:8}]}>
            <Text style={{fontSize:20,marginRight:12}}>{i===0?'ðŸ”©':'ðŸ”§'}</Text>
            <Text style={{color:C.text,flex:1,fontSize:13}}>{p.name}</Text>
            <Pressable onPress={()=>Alert.alert('Purchase','Opening AutoZone/Amazon for '+p.name)} style={{backgroundColor:'rgba(57,255,20,0.1)',paddingHorizontal:10,paddingVertical:4,borderRadius:4,borderWidth:1,borderColor:C.primary}}>
              <Text style={{color:C.primary,fontWeight:'bold',fontSize:12}}>{p.price}</Text>
            </Pressable>
          </View>
        ))}

        <SectionHdr title="CHEMICAL ALTERNATIVES"/>
        <Card style={{flexDirection:'row',alignItems:'center',borderColor:C.secondary}}>
          <Text style={{fontSize:30,marginRight:12}}>ðŸ§ª</Text>
          <View style={{flex:1}}>
            <Text style={{color:C.secondary,fontWeight:'bold',marginBottom:4}}>Chemical Attempt First</Text>
            <Text style={{color:C.dim,fontSize:12}}>{result.chemical}</Text>
          </View>
        </Card>

        <SectionHdr title="AI REPAIR STEPS"/>
        {['Disconnect negative battery terminal','Locate O2 sensor on exhaust manifold','Apply penetrating oil, wait 15 min','Remove with offset socket','Install new sensor hand-tight, then torque to spec','Clear codes and verify fix'].map((step,i)=>(
          <View key={i} style={{flexDirection:'row',alignItems:'flex-start',marginBottom:10}}>
            <View style={{width:24,height:24,borderRadius:12,backgroundColor:C.primary,alignItems:'center',justifyContent:'center',marginRight:12}}>
              <Text style={{color:'#000',fontSize:11,fontWeight:'bold'}}>{i+1}</Text>
            </View>
            <Text style={{color:C.text,fontSize:13,flex:1,lineHeight:20}}>{step}</Text>
          </View>
        ))}

        <View style={{flexDirection:'row',gap:10,marginTop:20}}>
          <NeonBtn title="BOOK MECHANIC" onPress={()=>navigation.navigate('Book')} style={{flex:1}} outline/>
          <NeonBtn title="NEW SCAN" onPress={()=>setStep('MENU')} style={{flex:1}}/>
        </View>
      </ScrollView>

      <Modal visible={showWiring} animationType="slide" transparent onRequestClose={()=>setShowWiring(false)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalBox,{height:'70%'}]}>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:16}}>
              <Text style={s.screenTitle}>OEM Wiring Diagram</Text>
              <Pressable onPress={()=>setShowWiring(false)}><Text style={{color:C.text,fontSize:22}}>âœ•</Text></Pressable>
            </View>
            <Text style={{color:C.secondary,marginBottom:16,fontWeight:'bold'}}>{result.code} â€” {result.title}</Text>
            <View style={{flex:1,backgroundColor:'#0a0a0a',borderRadius:10,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.border}}>
              <Text style={{fontSize:40,marginBottom:10}}>ðŸ“ </Text>
              <Text style={{color:C.primary,fontWeight:'bold',marginBottom:8}}>Wiring Schematic Loaded</Text>
              <Text style={{color:C.dim,textAlign:'center',fontSize:12,paddingHorizontal:20}}>ECM Pin A12 â†’ O2 Sensor White (Heater +){'\n'}ECM Pin B7 â†’ O2 Sensor Black (Heater -){'\n'}O2 Sensor Signal â†’ ECM Pin C3 (0.1â€“0.9V)</Text>
            </View>
            <Pressable style={[s.techDataBtn,{marginTop:16}]} onPress={()=>Linking.openURL('https://www.alldata.com')}>
              <Text style={{color:'#000',fontWeight:'bold'}}>ðŸ”— OPEN ALLDATA / MITCHELL 1</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );

  return <SafeAreaView style={s.screen}><View style={s.center}><ActivityIndicator color={C.primary}/></View></SafeAreaView>;
};

// â”€â”€ SCREEN 5: COMMUNITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CommunityScreen = ({ navigation }) => {
  const [tab,setTab]=useState('FORUM');
  const [filter,setFilter]=useState('ALL');
  const [selectedPost,setSelectedPost]=useState(null);
  const filters=['ALL','SOLVED','HELP','MODS','BUILD','TOOL'];
  const filteredPosts = filter==='ALL'?FORUM_POSTS:FORUM_POSTS.filter(p=>p.tag===filter);
  return (
    <SafeAreaView style={s.screen}>
      <View style={{padding:20,paddingBottom:0}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <Text style={s.screenTitle}>Community Grid</Text>
          <Pressable onPress={()=>Alert.alert('Notifications','You have 3 new replies')} style={{width:36,height:36,borderRadius:18,backgroundColor:C.card,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:C.border}}>
            <Text>ðŸ””</Text>
          </Pressable>
        </View>
        <View style={{flexDirection:'row',marginBottom:12}}>
          {['FORUM','VIDEOS'].map(t=>(
            <Pressable key={t} onPress={()=>setTab(t)} style={[s.tabBtn,tab===t&&s.tabActive]}>
              <Text style={{color:tab===t?C.primary:C.dim,fontWeight:'bold',fontSize:13}}>{t}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {tab==='FORUM'?(
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft:20,paddingBottom:10,maxHeight:50}}>
            {filters.map(f=>(
              <Pressable key={f} onPress={()=>setFilter(f)} style={[s.pill,filter===f&&{backgroundColor:C.primary}]} android_ripple={{color:'rgba(0,0,0,0.2)'}}>
                <Text style={{color:filter===f?'#000':C.dim,fontSize:12,fontWeight:'bold'}}>{f}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <FlatList data={filteredPosts} keyExtractor={i=>i.id} contentContainerStyle={{padding:20}}
            renderItem={({item})=>(
              <Pressable style={s.postCard} onPress={()=>setSelectedPost(item)} android_ripple={{color:'rgba(255,255,255,0.03)'}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Avatar initials={item.avatar}/>
                    <View style={{marginLeft:10}}>
                      <Text style={{color:C.text,fontWeight:'bold',fontSize:13}}>{item.user}</Text>
                      <Text style={{color:C.dim,fontSize:11}}>{item.time}</Text>
                    </View>
                  </View>
                  <TagBadge tag={item.tag}/>
                </View>
                <Text style={{color:C.text,fontSize:15,fontWeight:'bold',marginBottom:10}}>{item.title}</Text>
                <View style={{flexDirection:'row',gap:20}}>
                  <Pressable style={{flexDirection:'row',alignItems:'center'}} onPress={()=>Alert.alert('Voted!','Upvoted post.')}>
                    <Text style={{color:C.primary,marginRight:5}}>â–²</Text><Text style={{color:C.dim}}>{item.votes}</Text>
                  </Pressable>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{color:C.dim,marginRight:5}}>ðŸ’¬</Text><Text style={{color:C.dim}}>{item.comments}</Text>
                  </View>
                  <Pressable onPress={()=>Alert.alert('Share','Copying post link...')}>
                    <Text style={{color:C.dim}}>â†— Share</Text>
                  </Pressable>
                </View>
              </Pressable>
            )}
          />
          <Modal visible={!!selectedPost} animationType="slide" transparent onRequestClose={()=>setSelectedPost(null)}>
            <View style={s.modalOverlay}>
              <View style={[s.modalBox,{height:'70%'}]}>
                {selectedPost&&<>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:16}}>
                    <TagBadge tag={selectedPost.tag}/>
                    <Pressable onPress={()=>setSelectedPost(null)}><Text style={{color:C.text,fontSize:22}}>âœ•</Text></Pressable>
                  </View>
                  <Text style={{color:C.text,fontSize:17,fontWeight:'bold',marginBottom:8}}>{selectedPost.title}</Text>
                  <View style={{flexDirection:'row',alignItems:'center',marginBottom:16}}>
                    <Avatar initials={selectedPost.avatar}/>
                    <Text style={{color:C.dim,marginLeft:10}}>{selectedPost.user} â€¢ {selectedPost.time}</Text>
                  </View>
                  <Text style={{color:C.text,lineHeight:22,marginBottom:20}}>{selectedPost.body}</Text>
                  <NeonBtn title="REPLY TO POST" onPress={()=>Alert.alert('Reply','Opening comment editor...')}/>
                </>}
              </View>
            </View>
          </Modal>
        </>
      ):(
        <FlatList data={VIDEOS} keyExtractor={i=>i.id} contentContainerStyle={{padding:20}}
          renderItem={({item})=>(
            <Pressable style={s.videoCard} onPress={()=>Alert.alert('Video','Opening: '+item.title)} android_ripple={{color:'rgba(255,255,255,0.05)'}}>
              <View style={s.videoThumb}>
                <Text style={{fontSize:50}}>â–¶</Text>
                <View style={{position:'absolute',bottom:8,right:8,backgroundColor:'rgba(0,0,0,0.8)',padding:4,borderRadius:3}}>
                  <Text style={{color:'white',fontSize:11,fontWeight:'bold'}}>{item.duration}</Text>
                </View>
                <View style={{position:'absolute',top:8,left:8}}>
                  <TagBadge tag={item.category.toUpperCase().slice(0,4)}/>
                </View>
              </View>
              <View style={{padding:12}}>
                <Text style={{color:C.text,fontWeight:'bold',fontSize:15,marginBottom:4}}>{item.title}</Text>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{color:C.dim,fontSize:12}}>{item.author}</Text>
                  <Text style={{color:C.dim,fontSize:12}}>{item.views} views</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
};

// â”€â”€ SCREEN 6: BOOK MECHANIC â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BookScreen = ({ navigation }) => {
  const [selected,setSelected]=useState(null);
  return (
    <SafeAreaView style={s.screen}>
      <ScrollView contentContainerStyle={{padding:20,paddingBottom:100}}>
        <Pressable onPress={()=>navigation.goBack()} style={{marginBottom:16}}>
          <Text style={{color:C.primary}}>â† Back</Text>
        </Pressable>
        <Text style={s.screenTitle}>Book a Mechanic</Text>
        <Text style={{color:C.dim,marginBottom:20}}>Certified professionals near you</Text>
        <View style={{backgroundColor:C.card,borderRadius:10,padding:12,flexDirection:'row',alignItems:'center',marginBottom:20,borderWidth:1,borderColor:C.border}}>
          <Text style={{color:C.dim,marginRight:8}}>ðŸ“ </Text>
          <Text style={{color:C.text,flex:1}}>New Castle, Indiana</Text>
          <Text style={{color:C.primary,fontSize:12}}>CHANGE</Text>
        </View>
        {MECHANICS.map(m=>(
          <Pressable key={m.id} style={[s.card,{marginBottom:12},selected===m.id&&{borderColor:C.primary}]} onPress={()=>setSelected(m.id)} android_ripple={{color:'rgba(57,255,20,0.07)'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
              <Text style={{color:C.text,fontWeight:'bold',fontSize:16,flex:1}}>{m.name}</Text>
              <View style={{backgroundColor:m.open?'rgba(57,255,20,0.15)':'rgba(255,68,68,0.15)',paddingHorizontal:8,paddingVertical:2,borderRadius:4,borderWidth:1,borderColor:m.open?C.primary:C.danger}}>
                <Text style={{color:m.open?C.primary:C.danger,fontSize:10,fontWeight:'bold'}}>{m.open?'OPEN':'CLOSED'}</Text>
              </View>
            </View>
            <Text style={{color:C.dim,fontSize:12,marginBottom:8}}>{m.specialty}</Text>
            <View style={{flexDirection:'row',gap:16}}>
              <Text style={{color:C.secondary}}>â­ {m.rating}</Text>
              <Text style={{color:C.dim,fontSize:12}}>{m.reviews} reviews</Text>
              <Text style={{color:C.dim,fontSize:12}}>{m.distance}</Text>
              <Text style={{color:C.primary,fontSize:12}}>{m.price}</Text>
            </View>
            {selected===m.id&&<NeonBtn title="CONFIRM BOOKING" onPress={()=>Alert.alert('Booked!','Appointment confirmed with '+m.name)} style={{marginTop:12}} small/>}
          </Pressable>
        ))}
        <SectionHdr title="PAYMENT METHOD"/>
        <View style={[s.card,{flexDirection:'row',alignItems:'center'}]}>
          <Text style={{fontSize:24,marginRight:12}}>ðŸ’³</Text>
          <View style={{flex:1}}>
            <Text style={{color:C.text,fontWeight:'bold'}}>Stripe Payment</Text>
            <Text style={{color:C.dim,fontSize:12}}>Secure in-app payment processing</Text>
          </View>
          <Text style={{color:C.primary}}>SET UP â†’</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// â”€â”€ SCREEN 7: PROFILE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ProfileScreen = ({ navigation }) => {
  const [darkMode,setDarkMode]=useState(true);
  const [notifications,setNotifications]=useState(true);
  const [offlineMode,setOfflineMode]=useState(false);
  const [showVehicles,setShowVehicles]=useState(false);
  return (
    <SafeAreaView style={s.screen}>
      <ScrollView contentContainerStyle={{paddingBottom:100}}>
        <View style={{alignItems:'center',paddingTop:40,paddingBottom:24,borderBottomWidth:1,borderBottomColor:C.border}}>
          <View style={{width:90,height:90,borderRadius:45,backgroundColor:'#222',alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:C.primary,marginBottom:12}}>
            <Text style={{fontSize:45}}>ðŸ‘¤</Text>
            <View style={{position:'absolute',bottom:-4,right:-4,backgroundColor:C.primary,paddingHorizontal:6,paddingVertical:2,borderRadius:4}}>
              <Text style={{color:'#000',fontSize:9,fontWeight:'bold'}}>PRO</Text>
            </View>
          </View>
          <Text style={[s.screenTitle,{marginBottom:4}]}>Alex_Turbo</Text>
          <Text style={{color:C.dim,fontSize:13}}>@alexturbo99 â€¢ Member since 2023</Text>
          <View style={{flexDirection:'row',gap:20,marginTop:16,backgroundColor:C.card,padding:16,borderRadius:12,borderWidth:1,borderColor:C.border,width:'85%'}}>
            {[['3','VEHICLES'],['42','POSTS'],['850','REP']].map(([n,l])=>(
              <View key={l} style={{alignItems:'center',flex:1}}>
                <Text style={{color:C.primary,fontSize:22,fontWeight:'bold'}}>{n}</Text>
                <Text style={{color:C.dim,fontSize:10,marginTop:4}}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{padding:20}}>
          <SectionHdr title="ACCOUNT ACCESS"/>
          <Pressable style={[s.card,{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}]} onPress={()=>Linking.openURL('https://rpp-auto.com/portal')} android_ripple={{color:'rgba(77,166,255,0.1)'}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Text style={{fontSize:24,marginRight:14}}>ðŸŒ </Text>
              <View>
                <Text style={{color:C.text,fontWeight:'bold'}}>Web Portal Access</Text>
                <Text style={{color:C.dim,fontSize:11}}>Manage fleet on desktop browser</Text>
              </View>
            </View>
            <Text style={{color:C.link}}>â†—</Text>
          </Pressable>
          <Pressable style={[s.card,{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}]} onPress={()=>setShowVehicles(true)} android_ripple={{color:'rgba(57,255,20,0.07)'}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Text style={{fontSize:24,marginRight:14}}>ðŸš—</Text>
              <View>
                <Text style={{color:C.text,fontWeight:'bold'}}>My Garage</Text>
                <Text style={{color:C.dim,fontSize:11}}>{VEHICLES.length} vehicles registered</Text>
              </View>
            </View>
            <Text style={{color:C.primary}}>â†’</Text>
          </Pressable>

          <SectionHdr title="SYSTEM PREFERENCES"/>
          {[
            {icon:'ðŸŒ™',label:'Dark Mode',val:darkMode,set:setDarkMode,col:C.primary},
            {icon:'ðŸ””',label:'Notifications',val:notifications,set:setNotifications,col:C.primary},
            {icon:'âœˆ',label:'Offline Mode',val:offlineMode,set:setOfflineMode,col:C.secondary},
          ].map(pref=>(
            <View key={pref.label} style={s.settingRow}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{fontSize:22,marginRight:14}}>{pref.icon}</Text>
                <Text style={s.settingTxt}>{pref.label}</Text>
              </View>
              <Switch value={pref.val} onValueChange={pref.set} trackColor={{true:pref.col}} thumbColor="#FFF"/>
            </View>
          ))}

          <SectionHdr title="SUBSCRIPTION"/>
          <Card style={{borderColor:C.secondary}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <View>
                <Text style={{color:C.secondary,fontWeight:'bold',fontSize:16}}>PRO MEMBER</Text>
                <Text style={{color:C.dim,fontSize:12}}>All features unlocked â€¢ No hidden fees</Text>
              </View>
              <Text style={{fontSize:30}}>ðŸ‘‘</Text>
            </View>
          </Card>

          <NeonBtn title="SIGN OUT" onPress={()=>navigation.replace('Login')} style={{marginTop:24}} danger/>
        </View>
      </ScrollView>

      <Modal visible={showVehicles} animationType="slide" transparent onRequestClose={()=>setShowVehicles(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:16}}>
              <Text style={s.screenTitle}>My Garage</Text>
              <Pressable onPress={()=>setShowVehicles(false)}><Text style={{color:C.text,fontSize:22}}>âœ•</Text></Pressable>
            </View>
            {VEHICLES.map(v=>(
              <Card key={v.id} style={{marginBottom:10}}>
                <Text style={{color:C.text,fontWeight:'bold',fontSize:15}}>{v.name}</Text>
                <Text style={{color:C.dim,fontSize:12}}>{v.model}</Text>
                <Text style={{color:C.dim,fontSize:11,marginTop:4}}>VIN: {v.vin}</Text>
                <HealthBar pct={v.health}/>
              </Card>
            ))}
            <NeonBtn title="+ ADD VEHICLE" onPress={()=>Alert.alert('Add Vehicle','VIN scanner opening...')} style={{marginTop:10}} outline/>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// â”€â”€ NAVIGATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TABS = [
  {name:'Dashboard',comp:DashboardScreen,icon:'ðŸ '},
  {name:'Scan',comp:ScanScreen,icon:'ðŸ” '},
  {name:'Community',comp:CommunityScreen,icon:'ðŸ‘¥'},
  {name:'Profile',comp:ProfileScreen,icon:'ðŸ‘¤'},
];

function TabGroup() {
  return (
    <Tab.Navigator screenOptions={({route})=>({
      headerShown:false,
      tabBarStyle:{backgroundColor:'#080808',borderTopColor:'#1a1a1a',height:65,paddingBottom:8,paddingTop:6},
      tabBarActiveTintColor:C.primary,
      tabBarInactiveTintColor:C.dim,
      tabBarIcon:({focused})=>{
        const tab = TABS.find(t=>t.name===route.name);
        return (
          <View style={{alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:22,opacity:focused?1:0.5}}>{tab?.icon}</Text>
            {focused&&<View style={{width:4,height:4,borderRadius:2,backgroundColor:C.primary,marginTop:2}}/>}
          </View>
        );
      },
      tabBarLabel:({focused,color})=><Text style={{color,fontSize:10,fontWeight:focused?'bold':'normal'}}>{route.name}</Text>
    })}>
      {TABS.map(t=><Tab.Screen key={t.name} name={t.name} component={t.comp}/>)}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Splash"   component={SplashScreen}/>
        <Stack.Screen name="Login"    component={LoginScreen}/>
        <Stack.Screen name="MainApp"  component={TabGroup}/>
        <Stack.Screen name="Book"     component={BookScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// â”€â”€ STYLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const s = StyleSheet.create({
  screen:{flex:1,backgroundColor:C.bg},
  center:{flex:1,alignItems:'center',justifyContent:'center'},
  // Login
  loginContent:{padding:24,paddingTop:60,paddingBottom:60,alignItems:'center'},
  logoCircle:{width:80,height:80,borderRadius:40,borderWidth:2,borderColor:'#333',borderStyle:'dashed',alignItems:'center',justifyContent:'center',marginBottom:16,backgroundColor:'#0a0a0a'},
  appTitle:{color:C.text,fontSize:30,fontWeight:'bold',letterSpacing:2,marginBottom:4},
  sysStatus:{color:C.primary,fontSize:12,fontFamily:Platform.OS==='ios'?'Courier':'monospace',letterSpacing:2},
  screenTitle:{color:C.text,fontSize:22,fontWeight:'bold',marginBottom:4},
  secureFooter:{position:'absolute',bottom:24,color:'#2a2a2a',fontSize:10,letterSpacing:3},
  inputLbl:{color:'#444',fontSize:11,fontWeight:'bold',letterSpacing:1,marginBottom:8},
  inputWrap:{flexDirection:'row',alignItems:'center',backgroundColor:C.card,borderWidth:1,borderColor:C.border,borderRadius:8,paddingHorizontal:14,height:52,marginBottom:4},
  inputFocused:{borderColor:C.primary},
  input:{flex:1,color:C.text,fontSize:16},
  neonBtn:{height:55,borderRadius:8,alignItems:'center',justifyContent:'center',width:'100%',elevation:4},
  btnTxt:{fontWeight:'bold',letterSpacing:0.5},
  // Cards & Layout
  card:{backgroundColor:C.card,borderRadius:12,padding:16,borderWidth:1,borderColor:C.border},
  sectionHdr:{color:C.dim,fontSize:11,fontWeight:'bold',letterSpacing:2},
  cardLbl:{color:C.dim,fontSize:10,letterSpacing:1,marginBottom:6},
  statBig:{fontSize:28,fontWeight:'bold',marginBottom:4},
  // Dashboard
  alertBanner:{backgroundColor:C.secondary,padding:14,borderRadius:8,flexDirection:'row',alignItems:'center',marginBottom:16},
  vehicleCard:{backgroundColor:'#0a0a0a',borderRadius:14,padding:16,borderWidth:1,borderColor:C.border,marginBottom:14},
  onlineTag:{position:'absolute',top:14,right:14,paddingHorizontal:8,paddingVertical:4,borderRadius:4,borderWidth:1},
  miniStat:{flex:1,backgroundColor:'#151515',padding:10,borderRadius:8},
  miniLbl:{color:'#555',fontSize:9,letterSpacing:1},
  miniVal:{color:C.text,fontWeight:'bold',fontSize:13,marginTop:2},
  quickAction:{flex:1,backgroundColor:C.card,padding:14,borderRadius:10,alignItems:'center',borderWidth:1,borderColor:C.border},
  qaText:{color:C.dim,fontSize:11,marginTop:4,fontWeight:'bold'},
  // Community
  tabBtn:{marginRight:24,paddingBottom:10},
  tabActive:{borderBottomWidth:2,borderBottomColor:C.primary},
  pill:{paddingVertical:6,paddingHorizontal:14,borderRadius:20,borderWidth:1,borderColor:C.border,marginRight:8},
  postCard:{backgroundColor:'#080808',marginBottom:12,borderTopWidth:1,borderBottomWidth:1,borderColor:'#1a1a1a',padding:16,borderRadius:10},
  videoCard:{backgroundColor:C.card,marginBottom:16,borderRadius:12,overflow:'hidden',borderWidth:1,borderColor:C.border},
  videoThumb:{height:170,backgroundColor:'#000',alignItems:'center',justifyContent:'center'},
  // Modals
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.92)',justifyContent:'flex-end'},
  modalBox:{backgroundColor:'#111',borderTopLeftRadius:24,borderTopRightRadius:24,padding:24,paddingBottom:40},
  // Resources
  resourceItem:{flex:1,margin:6,backgroundColor:'#080808',padding:16,borderRadius:12,borderWidth:1,borderColor:C.border,alignItems:'center'},
  // Diagnostics
  techDataBtn:{backgroundColor:C.secondary,padding:14,borderRadius:8,flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:14,gap:8},
  // Profile
  settingRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:16,borderBottomWidth:1,borderBottomColor:'#1a1a1a'},
  settingTxt:{color:C.text,fontSize:16},
});
