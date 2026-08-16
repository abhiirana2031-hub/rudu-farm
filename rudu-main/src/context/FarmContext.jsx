import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_FARMERS,
  INITIAL_RATE_RULES,
  INITIAL_ENTRIES,
  INITIAL_EMPLOYEES,
  INITIAL_PAYOUTS,
  INITIAL_MILK_SALES
} from '../mockData/initialData';

const FarmContext = createContext();

export const FarmProvider = ({ children }) => {
  // Role & View state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rudu_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState(() => {
    const savedUser = localStorage.getItem('rudu_auth_user');
    if (savedUser) {
      try { return JSON.parse(savedUser).role || 'admin'; } catch (e) {}
    }
    return localStorage.getItem('rudu_role') || 'admin';
  });

  const [selectedFarmerId, setSelectedFarmerId] = useState('RF1024');
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop' or 'mobile'

  const loginUser = (userObj) => {
    const userWithDefaults = {
      id: userObj.id || `USER-${Date.now().toString().slice(-4)}`,
      name: userObj.name || 'User',
      email: userObj.email || 'user@rudufarm.com',
      role: userObj.role || 'admin',
      designation: userObj.designation || (userObj.role === 'admin' ? 'Dairy Owner / Manager' : userObj.role === 'employee' ? 'Milk Collection Agent' : 'Registered Farmer'),
      avatar: userObj.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      ...userObj
    };
    setCurrentUser(userWithDefaults);
    setCurrentRole(userWithDefaults.role);
    localStorage.setItem('rudu_auth_user', JSON.stringify(userWithDefaults));
    localStorage.setItem('rudu_role', userWithDefaults.role);
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('rudu_auth_user');
    setIsAuthModalOpen(true);
  };

  // URL Route Listener for /admin and /bmc direct access
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('/admin') || hash.includes('admin')) {
        loginUser({
          id: 'ADM-001',
          name: 'Rajesh Sharma',
          email: 'admin@rudufarm.com',
          role: 'admin',
          designation: 'Dairy Owner / Manager'
        });
      } else if (path.includes('/bmc') || path.includes('/operator') || hash.includes('bmc') || hash.includes('operator')) {
        loginUser({
          id: 'EMP-102',
          name: 'Amit Kumar',
          email: 'amit@rudufarm.com',
          role: 'employee',
          designation: 'Milk Collection Agent (BMC)'
        });
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  // Application Data State
  const [farmers, setFarmers] = useState(() => {
    const saved = localStorage.getItem('rudu_farmers');
    return saved ? JSON.parse(saved) : INITIAL_FARMERS;
  });

  const [rateRules, setRateRules] = useState(() => {
    const saved = localStorage.getItem('rudu_rate_rules');
    return saved ? JSON.parse(saved) : INITIAL_RATE_RULES;
  });

  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('rudu_entries');
    return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('rudu_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [payouts, setPayouts] = useState(() => {
    const saved = localStorage.getItem('rudu_payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUTS;
  });

  const [milkSales, setMilkSales] = useState(() => {
    const saved = localStorage.getItem('rudu_milk_sales');
    return saved ? JSON.parse(saved) : INITIAL_MILK_SALES;
  });

  // Modal Control
  const [activeModal, setActiveModal] = useState(null); // 'milkEntry', 'addFarmer', 'printSlip', 'makePayment'
  const [selectedSlipEntry, setSelectedSlipEntry] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('rudu_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('rudu_farmers', JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    localStorage.setItem('rudu_rate_rules', JSON.stringify(rateRules));
  }, [rateRules]);

  useEffect(() => {
    localStorage.setItem('rudu_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('rudu_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('rudu_payouts', JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem('rudu_milk_sales', JSON.stringify(milkSales));
  }, [milkSales]);

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
      collectedBy: currentRole === 'employee' ? 'Amit Kumar' : 'Admin Staff',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setEntries(prev => [entryObj, ...prev]);

    // Update Farmer Stats
    setFarmers(prev => prev.map(f => {
      if (f.id === newEntry.farmerId) {
        return {
          ...f,
          totalSupplied: Math.round((f.totalSupplied + qty) * 10) / 10,
          thisMonthSupplied: Math.round((f.thisMonthSupplied + qty) * 10) / 10,
          totalEarned: f.totalEarned + totalAmount,
          pendingPayout: f.pendingPayout + totalAmount
        };
      }
      return f;
    }));

    return entryObj;
  };

  const addFarmer = (newFarmer) => {
    const farmerObj = {
      id: `RF${Math.floor(1000 + Math.random() * 9000)}`,
      name: newFarmer.name,
      phone: newFarmer.phone || '+91 90000 00000',
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
    return farmerObj;
  };

  const deleteFarmer = (farmerId) => {
    setFarmers(prev => prev.filter(f => f.id !== farmerId));
  };

  const addEmployee = (newEmp) => {
    const empObj = {
      id: `EMP${Math.floor(100 + Math.random() * 900)}`,
      name: newEmp.name,
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
    return empObj;
  };

  const deleteEmployee = (empId) => {
    setEmployees(prev => prev.filter(e => e.id !== empId));
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

    // Update Farmer Cleared / Pending Payouts
    setFarmers(prev => prev.map(f => {
      if (f.id === payoutData.farmerId) {
        return {
          ...f,
          clearedPayout: f.clearedPayout + amount,
          pendingPayout: Math.max(0, f.pendingPayout - amount)
        };
      }
      return f;
    }));
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
    localStorage.removeItem('rudu_farmers');
    localStorage.removeItem('rudu_rate_rules');
    localStorage.removeItem('rudu_entries');
    localStorage.removeItem('rudu_employees');
    localStorage.removeItem('rudu_payouts');
    localStorage.removeItem('rudu_milk_sales');
    setFarmers(INITIAL_FARMERS);
    setRateRules(INITIAL_RATE_RULES);
    setEntries(INITIAL_ENTRIES);
    setEmployees(INITIAL_EMPLOYEES);
    setPayouts(INITIAL_PAYOUTS);
    setMilkSales(INITIAL_MILK_SALES);
  };

  return (
    <FarmContext.Provider value={{
      currentUser,
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
      addMilkSale
    }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
