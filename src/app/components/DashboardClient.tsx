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
    const [iconColor, setIconColor] = useState('#000000')
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    const presetColors = ['#000000', '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE', '#E91E8C', '#795548']

    const handleSetting = async ()=> {
        setLoading(true)
       
        try {
            const result = await axios.post('/api/settings',{ownerId,businessName, knowledge, supportEmail, iconColor})
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
            setIconColor(result.data?.iconColor || '#000000')
            
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
                <div className='mb-1 mt-6'>
                    <h1 className='text-lg font-medium mb-4'>Chatbot Icon Color</h1>
                    <p className='text-sm text-zinc-500 mb-4'>Choose the color for your chatbot icon. It updates instantly in the preview below.</p>
                </div>
                <div className='space-y-4'>
                    <div className='flex flex-wrap items-center gap-3'>
                        {presetColors.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setIconColor(color)}
                                className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${iconColor === color ? 'border-zinc-900 scale-110' : 'border-zinc-200'}`}
                                style={{ background: color }}
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                        <label className='relative w-9 h-9 rounded-full border-2 border-zinc-300 overflow-hidden cursor-pointer bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)] hover:scale-110 transition-transform' title='Custom color'>
                            <input
                                type="color"
                                value={iconColor}
                                onChange={(e) => setIconColor(e.target.value)}
                                className='absolute inset-0 opacity-0 cursor-pointer w-full h-full'
                            />
                        </label>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm text-zinc-500'>Current color:</span>
                        <span className='w-6 h-6 rounded-md border border-zinc-300' style={{ background: iconColor }} />
                        <span className='text-sm font-mono text-zinc-700'>{iconColor}</span>
                    </div>
                </div>
                <div className='mt-8'>
                    <h1 className='text-lg font-medium mb-2'>Live Preview</h1>
                    <p className='text-sm text-zinc-500 mb-6'>This is how your chatbot icon will appear on your website.</p>
                    <div className='relative h-44 rounded-xl border border-zinc-200 bg-zinc-100 overflow-hidden'>
                        <div className='flex items-center justify-center h-full text-sm text-zinc-400'>Your website goes here</div>
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className='absolute bottom-4 right-4 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-2xl cursor-pointer'
                            style={{ background: iconColor }}
                        >
                            💬
                        </motion.div>
                    </div>
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