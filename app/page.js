'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Page() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('students').select('*')
      if (data) setStudents(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ padding:'20px', background:'#f5f7fb', minHeight:'100vh', fontFamily:'Arial' }}>
      <h1 style={{ fontSize:22, fontWeight:'bold' }}>Monte Rosa Fundah v3 - REAL DB</h1>
      <p style={{ color:'green', marginTop:8 }}>● LIVE + Supabase Connected - Scalable</p>

      <div style={{ background:'white', padding:20, borderRadius:12, marginTop:20, boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
        <h3>Students from Supabase: {loading ? 'Loading...' : students.length}</h3>
        <div style={{ marginTop:15 }}>
          {loading && <p>Loading students...</p>}
          {!loading && students.length===0 && <p style={{ color:'#666' }}>No students yet - Go to Supabase > Table Editor > students > Insert Row > Add student_id MR-001, full_name, form</p>}
          {students.map(s=>(
            <div key={s.id} style={{ borderBottom:'1px solid #eee', padding:'10px 0', display:'flex', justifyContent:'space-between' }}>
              <span><b>{s.student_id}</b> - {s.full_name}</span>
              <span>{s.form} - {s.status}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ marginTop:20, fontSize:12, color:'#888', textAlign:'center' }}>
        Made by Tafara Hoshiwa & Joseph Kamondo<br/>Scalable Fundah - No Sheets
      </p>
    </div>
  )
  }
