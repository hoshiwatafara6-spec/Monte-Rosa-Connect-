'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Page() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      const { data } = await supabase.from('students').select('*')
      if (data) setStudents(data)
      setLoading(false)
    }
    getData()
  }, [])

  return (
    <div style={{ padding:20, background:'#f5f7fb', minHeight:'100vh', fontFamily:'Arial' }}>
      <h1>Monte Rosa Fundah v3 - REAL DB</h1>
      <p style={{ color:'green' }}>● LIVE + Supabase Connected</p>
      
      <div style={{ background:'white', padding:20, borderRadius:12, marginTop:20 }}>
        <h3>Students: {loading ? 'Loading...' : students.length}</h3>
        {students.length === 0 && !loading && <p>No students - Add one in Supabase > Table Editor > students > Insert Row</p>}
        {students.map(s=>(
          <div key={s.id} style={{ borderBottom:'1px solid #eee', padding:'10px 0' }}>
            {s.student_id} - {s.full_name} - {s.form}
          </div>
        ))}
      </div>
    </div>
  )
}
