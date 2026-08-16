import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/client';

const FarmContext = createContext();

export const FarmProvider = ({ children }) => {
  // Role & View state
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore authenticated session from localStorage or verify on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('rudu_auth_user');
      const savedRole = localStorage.getItem('rudu_auth_role');
      if (savedUser && savedRole) {
        try {
          setCurrentUser(JSON.parse(savedUser));
          setCurrentRole(savedRole);
        } catch (e) {}
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            let role = userData.role || 'admin'; 
            
            const userObj = {
              id: user.uid,
              name: userData.name || user.displayName || 'User',
              email: user.email,
              role: role,
              designation: role === 'admin' ? 'Dairy Owner / Manager' : 'Operator',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            };
            
            setCurrentUser(userObj);
            setCurrentRole(role);
            localStorage.setItem('rudu_auth_user', JSON.stringify(userObj));
            localStorage.setItem('rudu_auth_role', role);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [selectedFarmerId, setSelectedFarmerId] = useState('RF1024');
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop' or 'mobile'

  const loginUser = (userObj) => {
    // legacy mock wrapper
  };

  const logoutUser = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('rudu_auth_user');
        localStorage.removeItem('rudu_auth_role');
      }
      setCurrentUser(null);
      setCurrentRole(null);
      await signOut(auth);
      setIsAuthModalOpen(true);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Application Data State
  const [farmers, setFarmers] = useState(INITIAL_FARMERS);
  const [rateRules, setRateRules] = useState(INITIAL_RATE_RULES);
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);
  const [milkSales, setMilkSales] = useState(INITIAL_MILK_SALES);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [sessionConfig, setSessionConfig] = useState(INITIAL_SESSION_CONFIG);
  const [activeSession, setActiveSession] = useState(null);
  const [fast2smsApiKey, setFast2smsApiKey] = useState('');
  const [collectionCenters, setCollectionCenters] = useState([
    { id: 'CC001', name: 'Rudu Main Center', location: 'Village Road, Sector 1', capacity: 5000, status: 'Active', contact: '' },
  ]);

  // Realtime Firestore Sync Effect
  useEffect(() => {
    // 1. Sync Farmers from Firestore
    const unsubFarmers = onSnapshot(collection(db, 'farmers'), (snap) => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setFarmers(loaded);
      }
    }, (err) => console.warn("Firestore Farmers sync error:", err));

    // 2. Sync Milk Entries from Firestore
    const unsubEntries = onSnapshot(collection(db, 'entries'), (snap) => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEntries(loaded);
      }
    }, (err) => console.warn("Firestore Entries sync error:", err));

    // 3. Sync Payouts from Firestore
    const unsubPayouts = onSnapshot(collection(db, 'payouts'), (snap) => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPayouts(loaded);
      }
    }, (err) => console.warn("Firestore Payouts sync error:", err));

    // 4. Sync Employees from Firestore
    const unsubEmployees = onSnapshot(collection(db, 'employees'), (snap) => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEmployees(loaded);
      }
    }, (err) => console.warn("Firestore Employees sync error:", err));

    // 5. Sync Centers from Firestore
    const unsubCenters = onSnapshot(collection(db, 'centers'), (snap) => {
      if (!snap.empty) {
        const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setCollectionCenters(loaded);
      }
    }, (err) => console.warn("Firestore Centers sync error:", err));

    return () => {
      unsubFarmers();
      unsubEntries();
      unsubPayouts();
      unsubEmployees();
      unsubCenters();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const load = (key, setter, fallback) => {
        const saved = localStorage.getItem(key);
        if (saved) setter(JSON.parse(saved));
        else if (fallback) setter(fallback);
      };
      
      load('rudu_farmers_v2', setFarmers);
      load('rudu_rate_rules_v2', setRateRules);
      load('rudu_entries_v2', setEntries);
      load('rudu_employees_v2', setEmployees);
      load('rudu_payouts_v2', setPayouts);
      load('rudu_milk_sales_v2', setMilkSales);
      load('rudu_sessions_v2', setSessions);
      load('rudu_session_config_v2', setSessionConfig);
      load('rudu_active_session_v2', setActiveSession);
      load('rudu_collection_centers_v1', setCollectionCenters);
    }
  }, []);

  // Modal Control
  const [activeModal, setActiveModal] = useState(null); // 'milkEntry', 'addFarmer', 'printSlip', 'makePayment'
  const [selectedSlipEntry, setSelectedSlipEntry] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('rudu_role', currentRole);
  }, [currentRole]);

  // Persist Data automatically (debounced slightly to avoid thrashing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rudu_farmers_v2', JSON.stringify(farmers));
      localStorage.setItem('rudu_rate_rules_v2', JSON.stringify(rateRules));
      localStorage.setItem('rudu_entries_v2', JSON.stringify(entries));
      localStorage.setItem('rudu_employees_v2', JSON.stringify(employees));
      localStorage.setItem('rudu_payouts_v2', JSON.stringify(payouts));
      localStorage.setItem('rudu_milk_sales_v2', JSON.stringify(milkSales));
      localStorage.setItem('rudu_sessions_v2', JSON.stringify(sessions));
      localStorage.setItem('rudu_session_config_v2', JSON.stringify(sessionConfig));
      localStorage.setItem('rudu_collection_centers_v1', JSON.stringify(collectionCenters));
      localStorage.setItem('rudu_fast2sms_api_key', JSON.stringify(fast2smsApiKey));
      if (activeSession) {
        localStorage.setItem('rudu_active_session_v2', JSON.stringify(activeSession));
      } else {
        localStorage.removeItem('rudu_active_session_v2');
      }
    }
  }, [farmers, rateRules, entries, employees, payouts, milkSales, sessions, sessionConfig, activeSession, collectionCenters, fast2smsApiKey]);

  // Collection Center CRUD
  const addCollectionCenter = (centerData) => {
    const newCenter = {
      id: `CC${String(Date.now()).slice(-5)}`,
      name: centerData.name || 'New Center',
      location: centerData.location || '',
      capacity: parseInt(centerData.capacity) || 0,
      contact: centerData.contact || '',
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    setCollectionCenters(prev => [...prev, newCenter]);
    setDoc(doc(db, 'centers', newCenter.id), newCenter).catch(e => console.error("Firestore center write error:", e));
    return newCenter;
  };

  const updateCollectionCenter = (centerId, updates) => {
    setCollectionCenters(prev =>
      prev.map(c => c.id === centerId ? { ...c, ...updates } : c)
    );
    const existing = collectionCenters.find(c => c.id === centerId);
    if (existing) {
      setDoc(doc(db, 'centers', centerId), { ...existing, ...updates }, { merge: true }).catch(e => console.error(e));
    }
  };

  const deleteCollectionCenter = (centerId) => {
    setCollectionCenters(prev => prev.filter(c => c.id !== centerId));
    deleteDoc(doc(db, 'centers', centerId)).catch(e => console.error(e));
  };

  // Rate Engine Formula
  const calculateRate = (fatInput, snfInput) => {
    const fat = parseFloat(fatInput) || 0;
    const snf = parseFloat(snfInput) || 0;

    const fatDiff = fat - rateRules.standardFat;
    const snfDiff = snf - rateRules.standardSNF;

    const fatBonus = fatDiff * (rateRules.fatBonusPerUnit * 10);
    const snfBonus = snfDiff * (rateRules.snfBonusPerUnit * 10);

    let calculated = rateRules.baseRate + fatBonus + snfBonus;
    if (calculated < rateRules.minRate) calculated = rateRules.minRate;
    if (calculated > rateRules.maxRate) calculated = rateRules.maxRate;

    return Math.round(calculated * 100) / 100;
  };

  // Actions
  const addMilkEntry = (newEntry) => {
    const rate = calculateRate(newEntry.fat, newEntry.snf);
    const qty = parseFloat(newEntry.quantity) || 0;
    const totalAmount = Math.round(qty * rate * 100) / 100;

    const entryObj = {
      id: `ENTRY-${Date.now().toString().slice(-4)}`,
      farmerId: newEntry.farmerId,
      farmerName: newEntry.farmerName || farmers.find(f => f.id === newEntry.farmerId)?.name || 'Farmer',
      date: newEntry.date || new Date().toISOString().split('T')[0],
      shift: newEntry.shift || 'Morning',
      quantity: qty,
      fat: parseFloat(newEntry.fat) || 0,
      snf: parseFloat(newEntry.snf) || 0,
      temperature: parseFloat(newEntry.temperature) || 4.0,
      rate: rate,
      totalAmount: totalAmount,
      status: 'Pending',
      collectedBy: currentRole === 'employee' ? currentUser?.name || 'Amit Kumar' : 'Admin Staff',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sessionId: activeSession ? activeSession.id : null
    };

    setEntries(prev => [entryObj, ...prev]);
    setDoc(doc(db, 'entries', entryObj.id), entryObj).catch(e => console.error("Firestore entry save error:", e));

    if (activeSession) {
      const updatedSession = {
        ...activeSession,
        entriesCount: activeSession.entriesCount + 1,
        volumeLogged: activeSession.volumeLogged + qty,
        collectionValue: activeSession.collectionValue + totalAmount
      };
      setActiveSession(updatedSession);
      setSessions(prev => prev.map(s => s.id === activeSession.id ? updatedSession : s));
    }

    // Update Farmer Stats
    setFarmers(prev => prev.map(f => {
      if (f.id === newEntry.farmerId) {
        const updatedFarmer = {
          ...f,
          totalSupplied: Math.round((f.totalSupplied + qty) * 10) / 10,
          thisMonthSupplied: Math.round((f.thisMonthSupplied + qty) * 10) / 10,
          totalEarned: f.totalEarned + totalAmount,
          pendingPayout: f.pendingPayout + totalAmount
        };
        setDoc(doc(db, 'farmers', f.id), updatedFarmer, { merge: true }).catch(e => console.error(e));
        return updatedFarmer;
      }
      return f;
    }));

    // Trigger Non-blocking SMS Notification
    const targetFarmer = farmers.find(f => f.id === newEntry.farmerId);
    if (targetFarmer && targetFarmer.phone) {
      fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'MILK_COLLECTION',
          tenantId: 'default',
          payload: {
            farmerPhone: targetFarmer.phone,
            farmerName: entryObj.farmerName,
            quantity: qty,
            amount: totalAmount,
            collectionId: entryObj.id
          }
        })
      }).catch(err => console.error("Non-blocking Milk Collection SMS trigger error:", err));
    }

    return entryObj;
  };

  const addFarmer = (newFarmer) => {
    const cleanPhone = (newFarmer.phone || '').replace(/\D/g, '');
    const defaultPin = cleanPhone.length >= 4 ? cleanPhone.slice(-4) : '1234';

    const farmerObj = {
      id: `RF${Math.floor(1000 + Math.random() * 9000)}`,
      name: newFarmer.name,
      phone: newFarmer.phone || '+91 90000 00000',
      pin: newFarmer.pin || newFarmer.password || defaultPin,
      password: newFarmer.pin || newFarmer.password || defaultPin,
      village: newFarmer.village || 'Kheda',
      aadhaarNumber: newFarmer.aadhaarNumber || '9842 1048 5912',
      address: newFarmer.address || 'Local Village',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      bankName: newFarmer.bankName || 'State Bank of India',
      accNumber: newFarmer.accNumber ? `XXXX-XXXX-${newFarmer.accNumber.slice(-4)}` : 'XXXX-XXXX-0000',
      ifsc: newFarmer.ifsc || 'SBIN0001000',
      branchName: newFarmer.branchName || 'Kheda Main Branch',
      upiId: newFarmer.upiId || `${newFarmer.name ? newFarmer.name.toLowerCase().replace(/\s+/g, '') : 'farmer'}@upi`,
      cowsCount: parseInt(newFarmer.cowsCount) || 2,
      buffalosCount: parseInt(newFarmer.buffalosCount) || 1,
      totalSupplied: 0,
      thisMonthSupplied: 0,
      totalEarned: 0,
      clearedPayout: 0,
      pendingPayout: 0,
      advanceBalance: 0
    };

    setFarmers(prev => [farmerObj, ...prev]);
    setDoc(doc(db, 'farmers', farmerObj.id), farmerObj).catch(e => console.error("Firestore farmer save error:", e));
    return farmerObj;
  };

  const deleteFarmer = (farmerId) => {
    setFarmers(prev => prev.filter(f => f.id !== farmerId));
    deleteDoc(doc(db, 'farmers', farmerId)).catch(e => console.error("Firestore farmer delete error:", e));
  };

  const addEmployee = (newEmp) => {
    const empObj = {
      id: `EMP${Math.floor(100 + Math.random() * 900)}`,
      name: newEmp.name,
      email: newEmp.email || `${newEmp.name.toLowerCase().replace(/\s+/g, '')}@rudufarm.com`,
      password: newEmp.password || newEmp.pin || 'Operator@123',
      pin: newEmp.password || newEmp.pin || '1234',
      role: newEmp.role || 'Milk Collection Agent',
      center: newEmp.center || 'Kheda Center',
      phone: newEmp.phone || '+91 98000 00000',
      status: 'Active',
      shift: newEmp.shift || 'Morning & Evening',
      salary: newEmp.salary || '₹18,000 / mo',
      todayEntriesCount: 0,
      todayVolumeLogged: 0.0,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setEmployees(prev => [empObj, ...prev]);
    setDoc(doc(db, 'employees', empObj.id), empObj).catch(e => console.error("Firestore employee save error:", e));
    return empObj;
  };

  const deleteEmployee = (empId) => {
    setEmployees(prev => prev.filter(e => e.id !== empId));
    deleteDoc(doc(db, 'employees', empId)).catch(e => console.error("Firestore employee delete error:", e));
  };

  const processPayment = (payoutData) => {
    const amount = parseFloat(payoutData.amount) || 0;
    const payoutObj = {
      id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
      farmerId: payoutData.farmerId,
      farmerName: payoutData.farmerName || farmers.find(f => f.id === payoutData.farmerId)?.name || 'Farmer',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      method: payoutData.method || 'Bank Transfer (UPI)',
      reference: payoutData.reference || `UPI/${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'Cleared',
      notes: payoutData.notes || 'Milk Settlement Payout'
    };

    setPayouts(prev => [payoutObj, ...prev]);
    setDoc(doc(db, 'payouts', payoutObj.id), payoutObj).catch(e => console.error("Firestore payout save error:", e));

    // Update Farmer Cleared / Pending Payouts
    setFarmers(prev => prev.map(f => {
      if (f.id === payoutData.farmerId) {
        const updatedFarmer = {
          ...f,
          clearedPayout: f.clearedPayout + amount,
          pendingPayout: Math.max(0, f.pendingPayout - amount)
        };
        setDoc(doc(db, 'farmers', f.id), updatedFarmer, { merge: true }).catch(e => console.error(e));
        return updatedFarmer;
      }
      return f;
    }));

    // Trigger Non-blocking Payment SMS Notification
    const targetFarmer = farmers.find(f => f.id === payoutData.farmerId);
    if (targetFarmer && targetFarmer.phone) {
      fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PAYMENT',
          tenantId: 'default',
          payload: {
            farmerPhone: targetFarmer.phone,
            amount: amount,
            transactionId: payoutObj.reference || payoutObj.id
          }
        })
      }).catch(err => console.error("Non-blocking Payment SMS trigger error:", err));
    }
  };

  const processOperatorPayment = (payoutData) => {
    const amount = parseFloat(payoutData.amount) || 0;
    const payoutObj = {
      id: `OP-PAY-${Math.floor(100 + Math.random() * 900)}`,
      farmerId: payoutData.empId,
      farmerName: `Staff: ${payoutData.empName}`,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      method: payoutData.method || 'Bank Transfer (UPI)',
      reference: payoutData.reference || `SALARY-UPI/${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'Cleared',
      type: 'Operator Salary',
      notes: payoutData.notes || 'Operator Monthly Salary Settlement'
    };

    setPayouts(prev => [payoutObj, ...prev]);
  };

  const updateRateRules = (newRules) => {
    setRateRules(prev => ({ ...prev, ...newRules }));
  };

  const openSlip = (entry) => {
    setSelectedSlipEntry(entry);
    setActiveModal('printSlip');
  };

  const addMilkSale = (newSale) => {
    const saleObj = {
      id: `SALE-${Date.now().toString().slice(-4)}`,
      date: newSale.date || new Date().toISOString().split('T')[0],
      buyerName: newSale.buyerName,
      quantity: parseFloat(newSale.quantity) || 0,
      rate: parseFloat(newSale.rate) || 0,
      totalAmount: Math.round((parseFloat(newSale.quantity) * parseFloat(newSale.rate)) * 100) / 100,
      milkType: newSale.milkType || 'Mixed',
      paymentStatus: newSale.paymentStatus || 'Pending',
      notes: newSale.notes || '',
      soldBy: newSale.soldBy || currentUser?.name || 'Amit Kumar',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMilkSales(prev => [saleObj, ...prev]);
    return saleObj;
  };

  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rudu_user');
      localStorage.removeItem('rudu_active_session_v2');
    }
    setFarmers(INITIAL_FARMERS);
    setRateRules(INITIAL_RATE_RULES);
    setEntries(INITIAL_ENTRIES);
    setEmployees(INITIAL_EMPLOYEES);
    setPayouts(INITIAL_PAYOUTS);
    setMilkSales(INITIAL_MILK_SALES);
    setSessions(INITIAL_SESSIONS);
    setSessionConfig(INITIAL_SESSION_CONFIG);
    setActiveSession(null);
  };

  const startSession = (operatorId, operatorName, shift, scheduledStart, scheduledEnd) => {
    const newSession = {
      id: `SES-${Date.now().toString().slice(-4)}`,
      operatorId,
      operatorName,
      shift,
      scheduledStart,
      scheduledEnd,
      actualLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      actualLogout: null,
      logoutReason: null,
      status: 'Active',
      entriesCount: 0,
      volumeLogged: 0,
      collectionValue: 0,
      date: new Date().toISOString().split('T')[0]
    };
    setActiveSession(newSession);
    setSessions(prev => [newSession, ...prev]);
  };

  const endSession = (reason = 'Manual Logout') => {
    if (!activeSession) return;
    
    const updatedSession = {
      ...activeSession,
      actualLogout: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      status: 'Completed',
      logoutReason: reason
    };
    
    setSessions(prev => prev.map(s => s.id === activeSession.id ? updatedSession : s));
    setActiveSession(null);
  };

  const forceLogoutOperator = (sessionId) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId && s.status === 'Active') {
        return {
          ...s,
          actualLogout: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          status: 'Completed',
          logoutReason: 'Admin Terminated'
        };
      }
      return s;
    }));
    // Note: if the admin terminates their own active session this handles it locally.
    // In a real app this would notify the client via websocket.
  };

  const updateSessionTimes = (sessionId, newStart, newEnd, reason) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          actualLogin: newStart,
          scheduledEnd: newEnd,
          extensionReason: reason,
          extended: true
        };
      }
      return s;
    }));
    
    if (activeSession && activeSession.id === sessionId) {
      setActiveSession(prev => ({
        ...prev,
        actualLogin: newStart,
        scheduledEnd: newEnd,
        extensionReason: reason,
        extended: true
      }));
    }
  };

  const updateSessionConfig = (newConfig) => {
    setSessionConfig(newConfig);
  };

  return (
    <FarmContext.Provider value={{
      currentUser,
      setCurrentUser,
      authLoading,
      isAuthModalOpen,
      setIsAuthModalOpen,
      loginUser,
      logoutUser,
      currentRole,
      setCurrentRole,
      selectedFarmerId,
      setSelectedFarmerId,
      viewportMode,
      setViewportMode,
      farmers,
      rateRules,
      entries,
      employees,
      payouts,
      activeModal,
      setActiveModal,
      selectedSlipEntry,
      setSelectedSlipEntry,
      calculateRate,
      addMilkEntry,
      addFarmer,
      deleteFarmer,
      addEmployee,
      deleteEmployee,
      processPayment,
      processOperatorPayment,
      updateRateRules,
      openSlip,
      resetAllData,
      milkSales,
      addMilkSale,
      sessions,
      sessionConfig,
      activeSession,
      startSession,
      endSession,
      forceLogoutOperator,
      extendSession: updateSessionTimes,
      updateSessionTimes,
      updateSessionConfig,
      collectionCenters,
      addCollectionCenter,
      updateCollectionCenter,
      deleteCollectionCenter,
      fast2smsApiKey,
      setFast2smsApiKey,
    }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
