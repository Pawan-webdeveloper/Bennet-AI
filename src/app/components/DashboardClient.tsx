'use client'
import { div } from 'motion/react-client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const DashboardClient = ({ownerId}: {ownerId:string} ) => {

    const navigate = useRouter()

    const [businessName, setBusinessName] = useState('')
    const [supportEmail, setSupportEmail] = useState('')
    const [knowledge, setKnowledge] = useState('')
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSetting = async ()=> {
        setLoading(true)
       
        try {
            const result = await axios.post('/api/settings',{ownerId,businessName, knowledge, supportEmail})
            console.log(result)
            setLoading(false)
             setSaved(true)
        setTimeout(()=> setSaved(false), 3000)
        } catch (error) {
            console.log(error)
            
        }
    }

    useEffect(()=> {
        if(ownerId){
            const handleGetDetails = async ()=> {
               try {
            const result = await axios.post('/api/settings/get',{ownerId})
            console.log(result)
            setBusinessName(result.data?.businessName || '')
            setKnowledge(result.data?.knowledge || '')
            setSupportEmail(result.data?.supportEmail || '')
            
        } catch (error) {
            console.log(error)
            
        } 
            }
            handleGetDetails()
        }
    }, [ownerId])
  return (
        <div className='min-h-screen bg-zinc-50 text-zinc-900'>
             <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed bg-white/70 top-0 left-0 border-b border-zinc-900 z-50 backdrop-blur-xl w-full"
        >
          <div className="flex items-center justify-between px-6 max-w-7xl mx-auto h-16">
            <div className="font-bold tracking-light text-lg" onClick={()=> navigate.push('/')}>
              Bennet <span className="text-zinc-400">AI</span>
            </div>
            <button className='px-4 py-2 rounded-lg  border border-zinc-300 text-sm hover:bg-zinc-100 transition' onClick={()=> navigate.push("/embed")} >Embed ChatBot</button>
          </div>
        </motion.div>

         <div className='flex justify-center px-4 py-14 mt-20'>
            <motion.div
            className='w-full max-w-3xl rounded-2xl shadow-xl bg-white p-10'
            >
                <div className='mb-10'>
                    <h1 className='text-2xl font-semibold'>ChatBot Settings</h1>
                    <p className='text-zinc-500 mt-1'>Configure your ChatBot preferences here.</p>
                </div>
                <div className=''>
                    <h1 className='text-lg font-medium mb-4'>Business Details</h1>
                </div>
                <div className='space-y-4'>
                    <input type="text" className='w-full rounded-xl px-4 py-3 border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' placeholder='Business Name' value={businessName} onChange={(e) => setBusinessName(e.target.value)}/>
                     <input type="text" className='w-full rounded-xl px-4 py-3 border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' placeholder='Support Email' value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)}/>
                </div>
                <div className='mb-1 mt-6'>
                    <h1 className='text-lg font-medium mb-4'>Knowledge Base</h1>
                    <p className='text-sm text-zinc-500 mb-4'>Add FAQ's, policies, delivery info, refunds, etc.</p>
                </div>
                <div className='space-y-4'>
                    <textarea className='w-full h-54 rounded-xl px-4 py-3 border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/80' placeholder={'Example: Your business name, services, contact information...'} value={knowledge} onChange={(e) => setKnowledge(e.target.value)}/>
                     
                </div>
                <div className='flex items-center gap-6'>
                    <motion.button
                    whileHover={{scale: 1.03}}
                    whileTap={{scale:0.97}}
                    className='px-7 py-3 mt-2 bg-black hover:bg-zinc-600 rounded-xl text-white text-sm font-medium transition disables:opacity-60'
                    disabled={loading}
                    onClick={handleSetting}
                    > 
                    {loading? "Saving.." : "Save"}
                        
                    </motion.button>
                    {saved && <motion.span 
                    initial={{opacity: 0, y: 6}}
                    animate={{opacity: 1, y:0}}
                    className='text-sm font-medium text-emerald-600'>Setting Saved</motion.span>}
                    
                </div>
            </motion.div>
         </div>
        </div>
  )
}

export default DashboardClient