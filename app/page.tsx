'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Page(){
  const [tab, setTab] = useState('student');
  const [admission, setAdmission] = useState('PRT001');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [attendance, setAttendance] = useState('Present');
  const [campus] = useState('Preston Campus');

  const campuses = ['Preston Campus','Borrowdale Campus','Chisipite Campus','Mabvuku Campus'];
  const attendOptions = ['Present','Absent','Late','Sick','Half-Day','Excused','Suspended','On Leave','A','B','C','D','E','F','G','Z'];

  const handleStudentLogin = async () => {
    setLoading(true);
    try{
      const { data: ks } = await supabase.from('kill_switch').select('*').limit(1);
      if(ks && ks[0]?.is_active){ alert('System paused by admin'); setLoading(false); return; }
    }catch(e){}
    try{
      const { data } = await supabase.from('students').select('*').eq('admission_no', admission).limit(1);
      if(data && data.length>0) setUser(data[0]);
      else setUser({ admission_no: admission, name: 'Hoshi Student', class: 'Form 3', balance: 450, campus });
    }catch{
      setUser({ admission_no: admission, name: 'Hoshi Student', class: 'Form 3', balance: 450, campus });
    }
    setLoading(false);
  };

  const markAttendance = async () => {
    setLoading(true);
    try{
      await supabase.from('attendance').insert({ admission_no: user.admission_no, status: attendance, date: new Date().toISOString().split('T')[0], campus: user.campus });
      alert(`Marked ${attendance} for ${user.admission_no}`);
    }catch(e){ alert(`Marked ${attendance} (offline demo)`); }
    setLoading(false);
  };

  if(user){
    return (
      <div style={{minHeight:'100vh', background:'linear-gradient(135deg,#0a4eb3 0%,#4a90e2 100%)', padding:20}}>
        <div style={{maxWidth:900, margin:'0 auto', background:'white', borderRadius:24, padding:24, boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h2 style={{margin:0, color:'#0a4eb3'}}>Monte Rosa Connect - {user.campus||campus}</h2>
            <button onClick={()=>setUser(null)} style={{padding:'8px 16px', borderRadius:20, border:'1px solid #ddd', background:'white'}}>Logout</button>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:20}}>
            <div style={{background:'#f0f7ff', padding:16, borderRadius:16}}>
              <div style={{fontSize:12, color:'#666'}}>Student</div>
              <div style={{fontWeight:700, fontSize:18}}>{user.name} - {user.admission_no}</div>
              <div style={{marginTop:8}}>Class: {user.class}</div>
              <div style={{marginTop:8, color: user.balance>0?'#c00':'#0a0', fontWeight:700}}>Fees Balance: ${user.balance}</div>
            </div>
            <div style={{background:'#f8f8ff', padding:16, borderRadius:16}}>
              <div style={{fontWeight:700, marginBottom:8}}>QC Attendance A-Z</div>
              <select value={attendance} onChange={e=>setAttendance(e.target.value)} style={{width:'100%', padding:12, borderRadius:12, border:'1px solid #ccc'}}>
                {attendOptions.map(o=> <option key={o} value={o}>{o}</option>)}
              </select>
              <button onClick={markAttendance} disabled={loading} style={{marginTop:12, width:'100%', padding:12, borderRadius:24, background:'#0a4eb3', color:'white', border:'none', fontWeight:700}}>{loading?'Saving...':'Mark Attendance'}</button>
            </div>
          </div>
          <div style={{marginTop:20, display:'flex', gap:12, flexWrap:'wrap'}}>
            {campuses.map(c=> <span key={c} style={{padding:'6px 12px', background: c=== (user.campus||campus)?'#0a4eb3':'#eee', color: c=== (user.campus||campus)?'white':'#333', borderRadius:20, fontSize:12}}>{c}</span>)}
          </div>
          <div style={{marginTop:20, padding:12, background:'#eef', borderRadius:12, fontSize:13}}>Bursar: Payment proof upload coming | Owner: Global stats + Kill switch active check OK</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(135deg,#061a40 0%,#0a4eb3 50%,#4a90e2 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
      <div style={{width:'100%', maxWidth:380, background:'white', borderRadius:24, padding:28, boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{textAlign:'center', marginBottom:20}}>
          <div style={{width:56, height:56, background:'#0a4eb3', borderRadius:16, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:800, fontSize:22}}>MR</div>
          <h1 style={{margin:'12px 0 4px', fontSize:22, fontWeight:800, color:'#0a1120'}}>Monte Rosa Connect</h1>
          <p style={{margin:0, fontSize:13, color:'#666'}}>4 Campuses • Elite Management</p>
        </div>
        <div style={{display:'flex', background:'#f0f2f5', borderRadius:20, padding:4, gap:4, marginBottom:20}}>
          {[
            {id:'student', label:'Student'},
            {id:'parent', label:'Parent'},
            {id:'qc', label:'QC'},
            {id:'mgmt', label:'Owner'}
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1, padding:'8px 0', borderRadius:16, border:'none', background: tab===t.id?'white':'transparent', boxShadow: tab===t.id?'0 2px 8px rgba(0,0,0,0.1)':'none', fontWeight:700, fontSize:12, color: tab===t.id?'#0a4eb3':'#666'}}>{t.label}</button>
          ))}
        </div>
        {tab==='student' && (
          <div>
            <label style={{fontSize:12, fontWeight:600, color:'#333'}}>Admission No</label>
            <input value={admission} onChange={e=>setAdmission(e.target.value.toUpperCase())} placeholder="PRT001" style={{width:'100%', padding:14, borderRadius:12, border:'1px solid #ddd', marginTop:6, marginBottom:12, boxSizing:'border-box'}} />
            <button onClick={handleStudentLogin} disabled={loading} style={{width:'100%', padding:14, borderRadius:24, background:'#0a4eb3', color:'white', border:'none', fontWeight:700, fontSize:15}}>{loading?'Checking...':'Login as Student'}</button>
          </div>
        )}
        {tab==='parent' && (
          <div>
            <label style={{fontSize:12, fontWeight:600}}>Phone Number</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="077..." style={{width:'100%', padding:14, borderRadius:12, border:'1px solid #ddd', marginTop:6, marginBottom:16, boxSizing:'border-box'}} />
            <button onClick={handleStudentLogin} style={{width:'100%', padding:14, borderRadius:24, background:'#0a4eb3', color:'white', border:'none', fontWeight:700}}>Login as Parent</button>
          </div>
        )}
        {tab==='qc' && (
          <div>
            <label style={{fontSize:12, fontWeight:600}}>QC Staff Code</label>
            <input placeholder="QC001" style={{width:'100%', padding:14, borderRadius:12, border:'1px solid #ddd', marginTop:6, marginBottom:16, boxSizing:'border-box'}} />
            <button onClick={handleStudentLogin} style={{width:'100%', padding:14, borderRadius:24, background:'#0a4eb3', color:'white', border:'none', fontWeight:700}}>Login QC Dashboard (A-Z)</button>
          </div>
        )}
        {tab==='mgmt' && (
          <div>
            <label style={{fontSize:12, fontWeight:600}}>Owner/Bursar Code</label>
            <input placeholder="OWNER2026" type="password" style={{width:'100%', padding:14, borderRadius:12, border:'1px solid #ddd', marginTop:6, marginBottom:16, boxSizing:'border-box'}} />
            <button onClick={handleStudentLogin} style={{width:'100%', padding:14, borderRadius:24, background:'#0a1120', color:'white', border:'none', fontWeight:700}}>Login Management</button>
          </div>
        )}
        <div style={{marginTop:16, textAlign:'center', fontSize:11, color:'#aaa'}}>Project: flyiqhekiyhnvqxhbadj • Cobalt Elite</div>
      </div>
    </div>
  );
        }
