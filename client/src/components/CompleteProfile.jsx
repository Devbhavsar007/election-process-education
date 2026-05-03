import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Globe, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { completeProfile } from '../services/api.js';
import './CompleteProfile.css';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh','Andaman & Nicobar','Dadra & Nagar Haveli','Lakshadweep'];
const LANGS = [{code:'hi',label:'Hindi'},{code:'bn',label:'Bengali'},{code:'ta',label:'Tamil'},{code:'te',label:'Telugu'},{code:'mr',label:'Marathi'},{code:'gu',label:'Gujarati'},{code:'kn',label:'Kannada'},{code:'ml',label:'Malayalam'},{code:'pa',label:'Punjabi'},{code:'or',label:'Odia'},{code:'as',label:'Assamese'},{code:'ur',label:'Urdu'},{code:'en',label:'English'},{code:'sd',label:'Sindhi'},{code:'ne',label:'Nepali'},{code:'ks',label:'Kashmiri'},{code:'sa',label:'Sanskrit'},{code:'mai',label:'Maithili'},{code:'kok',label:'Konkani'},{code:'doi',label:'Dogri'},{code:'bho',label:'Bhojpuri'},{code:'mni',label:'Manipuri'}];

const CompleteProfile = ({ onNavigate }) => {
  const { user, setUser } = useAuth();
  const [age, setAge] = useState('');
  const [state, setState] = useState('');
  const [constituency, setConstituency] = useState('');
  const [preferredLang, setPreferredLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await completeProfile({ age: Number(age), state, constituency, preferredLang });
      setUser(res.data.user);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally { setLoading(false); }
  };

  return (
    <section className="profile-section">
      <motion.div className="profile-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="profile-header">
          <div className="profile-icon-wrap"><User size={28} /></div>
          <h2>Complete Your Profile</h2>
          <p>Help us personalize your voter journey</p>
        </div>
        {error && <div className="profile-error">{error}</div>}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="input-group"><label>Age</label><input type="number" min="18" max="120" placeholder="Your age" value={age} onChange={e => setAge(e.target.value)} required /></div>
          <div className="input-group">
            <label>State / UT</label>
            <select value={state} onChange={e => setState(e.target.value)} required>
              <option value="">Select state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="input-group"><label>Constituency</label><input type="text" placeholder="e.g., Chennai South" value={constituency} onChange={e => setConstituency(e.target.value)} required /></div>
          <div className="input-group">
            <label>Preferred Language</label>
            <select value={preferredLang} onChange={e => setPreferredLang(e.target.value)}>
              {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
          <motion.button type="submit" className="profile-submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
            {loading ? 'Saving...' : 'Continue to Dashboard'} <ArrowRight size={18} />
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};
export default CompleteProfile;
