import React, { useState, useMemo } from 'react';
import { 
  Car, User, Shield, Coffee, VolumeX, MessageSquare, 
  QrCode, AlertTriangle, ArrowRight, Briefcase, Plus, 
  Check, X, PhoneCall, Filter, Thermometer, Radio, 
  Navigation, Utensils, Building2, Hourglass, Zap, Share2
} from 'lucide-react';

// ============================================================================
// 1. DATA TYPE SCHEMAS & INTERFACES (STRICT TYPESCRIPT CONTRACTS)
// ============================================================================
type CommuteVibe = 'Quiet Commute' | 'Networking Mode';
type UserRole = 'Driver' | 'Rider' | 'Both';
type AudioPreference = 'Local FM / Music' | 'Business Podcasts' | 'Absolute Silence';
type BridgeRoute = 'Via Subhash Bridge (Riverfront)' | 'Via Nehru Bridge' | 'Via S.G. Highway Bypass';

interface CorporateUser {
  id: string;
  name: string;
  email: string;
  company: string;
  officeBuilding: string;
  phone: string;
  role: UserRole;
  vibe: CommuteVibe;
  audioPref: AudioPreference;
  vehicle?: {
    makeModel: string;
    color: string;
    plateNumber: string;
  };
}

interface RidePool {
  id: string;
  driverId: string;
  driverName: string;
  driverCompany: string;
  driverVibe: CommuteVibe;
  driverAudio: AudioPreference;
  vehicleInfo: string;
  departureHub: string;
  preferredBridge: BridgeRoute;
  dropoffBlock: string;
  departureTime: string;
  availableSeats: number;
  totalSeats: number;
  allowsChaiStop: boolean;
  baseCost: number;
  acSurcharge: number;
  status: 'scheduled' | 'delayed' | 'completed';
}

// ============================================================================
// 2. STATIC CONFIGURATION DICTIONARIES & REGIONAL CORE OPTIONS
// ============================================================================
const AHMEDABAD_HUBS: string[] = ['South Bopal', 'Iskcon Cross Roads', 'Vastrapur Lake', 'Prahladnagar Garden', 'Visat Circle'];
const BRIDGE_ROUTES: BridgeRoute[] = ['Via Subhash Bridge (Riverfront)', 'Via Nehru Bridge', 'Via S.G. Highway Bypass'];
const GIFT_CITY_BLOCKS: string[] = ['GIFT Tower A', 'GIFT Tower B', 'Tapasya Block', 'Pragya Tower', 'Savvy Pragya'];
const VALID_COMPANIES: string[] = ['TCS', 'HSBC', 'Capgemini', 'Bank of America', 'IFSCA', 'Google'];

// Feature 1: Real-Time Traffic Telemetry Dataset Matrix (Vastrapur Bypass Optimization)
const HUB_TRAFFIC_DATA: Record<string, { status: 'Red' | 'Amber' | 'Green'; delayMins: number; bypassAdvice: string }> = {
  'South Bopal': { status: 'Green', delayMins: 2, bypassAdvice: 'All clear. Proceed directly to the main terminal circle.' },
  'Iskcon Cross Roads': { status: 'Red', delayMins: 16, bypassAdvice: 'Massive flyover bottleneck. Walk 150m past the BRTS cage to bypass the local intersection crawl.' },
  'Vastrapur Lake': { status: 'Amber', delayMins: 8, bypassAdvice: 'Heavy mall crossing congestion. Board outside the corporate bank branch opposite the lake corner.' },
  'Prahladnagar Garden': { status: 'Amber', delayMins: 6, bypassAdvice: 'Mild corporate exit rush. Move to the main wide avenue crossing for immediate pickup.' },
  'Visat Circle': { status: 'Red', delayMins: 12, bypassAdvice: 'Chandkheda highway junction block. Meet your driver right at the entry point of the SP Ring Road loop.' }
};

// Seed Data mimicking live ongoing routes inside the corridor pipeline
const INITIAL_MOCK_RIDES: RidePool[] = [
  {
    id: 'ride-1',
    driverId: 'drv-1',
    driverName: 'Rahul Sharma',
    driverCompany: 'TCS',
    driverVibe: 'Networking Mode',
    driverAudio: 'Local FM / Music',
    vehicleInfo: 'Tata Nexon EV (White)',
    departureHub: 'South Bopal',
    preferredBridge: 'Via Subhash Bridge (Riverfront)',
    dropoffBlock: 'GIFT Tower A',
    departureTime: '08:15 AM',
    availableSeats: 3,
    totalSeats: 4,
    allowsChaiStop: true,
    baseCost: 120,
    acSurcharge: 25,
    status: 'scheduled'
  },
  {
    id: 'ride-2',
    driverId: 'drv-2',
    driverName: 'Sneha Patel',
    driverCompany: 'HSBC',
    driverVibe: 'Quiet Commute',
    driverAudio: 'Absolute Silence',
    vehicleInfo: 'Honda City (Grey)',
    departureHub: 'Prahladnagar Garden',
    preferredBridge: 'Via S.G. Highway Bypass',
    dropoffBlock: 'Tapasya Block',
    departureTime: '08:00 AM',
    availableSeats: 1,
    totalSeats: 3,
    allowsChaiStop: false,
    baseCost: 140,
    acSurcharge: 25,
    status: 'scheduled'
  },
  {
    id: 'ride-3',
    driverId: 'drv-3',
    driverName: 'Amit Verma',
    driverCompany: 'Bank of America',
    driverVibe: 'Networking Mode',
    driverAudio: 'Business Podcasts',
    vehicleInfo: 'Hyundai i20 (Blue)',
    departureHub: 'Iskcon Cross Roads',
    preferredBridge: 'Via Nehru Bridge',
    dropoffBlock: 'Pragya Tower',
    departureTime: '08:30 AM',
    availableSeats: 2,
    totalSeats: 4,
    allowsChaiStop: true,
    baseCost: 110,
    acSurcharge: 25,
    status: 'delayed'
  }
];

// ============================================================================
// 3. MAIN REACT COMPONENT ENGINE
// ============================================================================
export default function App() {
  // Navigation Router & Identity Profile Context Hooks
  const [currentPage, setCurrentPage] = useState<'landing' | 'register' | 'dashboard'>('landing');
  const [currentUser, setCurrentUser] = useState<CorporateUser | null>(null);
  const [activeDashboardMode, setActiveDashboardMode] = useState<'rider' | 'driver'>('rider');
  
  // Feature 2: Climate Adaptive Cost Variable (Ahmedabad Summer Heat Monitoring)
  const currentTemp = 41; 
  
  // Reactive Filtering Controls
  const [selectedHub, setSelectedHub] = useState<string>('South Bopal');
  const [selectedBridge, setSelectedBridge] = useState<string>('all');
  const [chaiFilter, setChaiFilter] = useState<boolean>(false);
  const [vibeFilter, setVibeFilter] = useState<string>('all');

  // Unified Application Storage States (Simulated Tables)
  const [rides, setRides] = useState<RidePool[]>(INITIAL_MOCK_RIDES);
  const [myBookedRideId, setMyBookedRideId] = useState<string | null>(null);
  const [driverRequests, setDriverRequests] = useState([
    { id: 'req-1', riderName: 'Hardik Shah', company: 'Capgemini', hub: 'South Bopal', vibe: 'Quiet Commute', status: 'pending' }
  ]);
  
  // Custom Feature Interaction Flags
  const [snackChecked, setSnackChecked] = useState<boolean>(false); 
  const [jaanedoTimer, setJaanedoTimer] = useState<number | null>(null); 
  const [showUPICode, setShowUPICode] = useState<boolean>(false);
  const [selectedRideForUPI, setSelectedRideForUPI] = useState<RidePool | null>(null);
  const [showFlexRematchAlert, setShowFlexRematchAlert] = useState<boolean>(false);

  // Profile Form Controllers
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('TCS');
  const [regBuilding, setRegBuilding] = useState('GIFT Tower A');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Both');
  const [regVibe, setRegVibe] = useState<CommuteVibe>('Networking Mode');
  const [regAudio, setRegAudio] = useState<AudioPreference>('Local FM / Music');
  const [regVehicleModel, setRegVehicleModel] = useState('');
  const [regVehiclePlate, setRegVehiclePlate] = useState('');
  const [emailError, setEmailError] = useState('');

  // ============================================================================
  // 4. HANDLERS AND DISPATCH COMPUTE MATRIX
  // ============================================================================
  
  // Strict Corporate Onboarding Gating Check
  const handleEmailChange = (val: string) => {
    setRegEmail(val);
    if (!val) { setEmailError(''); return; }
    const domain = val.split('@');
    if (domain.length < 2) { setEmailError('Please verify the email input layout syntax.'); return; }
    
    const genericDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    if (genericDomains.some(d => domain[1].toLowerCase().includes(d))) {
      setEmailError('❌ Consumer email handles are blocked. Verification requires your official corporate domain address (@tcs.com, @hsbc.com, etc.).');
    } else {
      setEmailError('');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || !regEmail) return;

    const newUser: CorporateUser = {
      id: 'usr-' + Date.now(),
      name: regName || 'Corporate Professional',
      email: regEmail,
      company: regCompany,
      officeBuilding: regBuilding,
      phone: regPhone || '+91 98765 43210',
      role: regRole,
      vibe: regVibe,
      audioPref: regAudio,
      vehicle: regRole !== 'Rider' ? {
        makeModel: regVehicleModel || 'Electric Vehicle Sedan',
        color: 'Sleek Metallic',
        plateNumber: regVehiclePlate || 'GJ-01-XX-0000'
      } : undefined
    };

    setCurrentUser(newUser);
    setActiveDashboardMode(newUser.role === 'Driver' ? 'driver' : 'rider');
    setCurrentPage('dashboard');
  };

  const handleBookRide = (rideId: string) => {
    setMyBookedRideId(rideId);
    setRides(prev => prev.map(r => r.id === rideId ? { ...r, availableSeats: r.availableSeats - 1 } : r));
    
    // Asynchronous Flex-Return backup trigger deployment simulation
    const selectedRide = rides.find(r => r.id === rideId);
    if (selectedRide?.status === 'delayed' || rideId === 'ride-3') {
      setTimeout(() => {
        setShowFlexRematchAlert(true);
      }, 1000);
    }
  };

  // Feature 6: Jaanedo Countdown Buffer Execution Hook
  const triggerJaanedoBuffer = () => {
    setJaanedoTimer(5);
    const interval = setInterval(() => {
      setJaanedoTimer((prev) => {
        if (prev !== null && prev <= 1) {
          clearInterval(interval);
          alert('🕒 Jaanedo timeline finished. Asynchronous Flex-Return fallback drivers queued.');
          setShowFlexRematchAlert(true);
