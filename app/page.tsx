"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [language, setLanguage] = useState("")
  const [speaker, setSpeaker] = useState("")
  const [scripts, setScripts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})

  const fetchScripts = async () => {
    if (!language || !speaker) {
      alert("Please select a language and enter your ID.")
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from("scripts")
      .select("*")
      .eq("language", language)
      .eq("speaker", speaker)
      .order("script_name")

    if (error) {
      console.error(error)
      alert("Error fetching scripts")
    } else {
      setScripts(data || [])
    }

    setLoading(false)
  }

  const groupedScripts = scripts.reduce((acc: any, script: any) => {
    const key = `${script.script_name}-${script.role}`
    if (!acc[key]) acc[key] = []
    acc[key].push(script.text)
    return acc
  }, {})

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="min-h-screen bg-[#F5EBDC] flex flex-col items-center p-8 text-black">

      {/* Logo */}
      <img
        src="/lifewood-logo.png"
        alt="Lifewood"
        className="w-64 mb-6"
      />

      <div className="bg-white shadow-xl rounded-2xl p-12 w-full max-w-6xl border border-gray-200">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6">
          Recording Scripts
        </h1>

        {/* Instructions */}
        <div className="bg-[#F9FAF7] border border-gray-200 p-6 rounded-xl mb-8 text-sm leading-relaxed text-center">
          <p className="mb-4">
            Welcome to Lifewood's Multilingual Speech Recording Project.
            After calling the provided number, make sure you enter your ID correctly and then you can start speaking. Talk naturally. 
            You are free to improvise and adjust the scripts. You may change words or add filler sounds ("umm", "hmm", "lah") as long as they sound natural.
            Don’t pause too long between lines. 0.5–1 second is enough. If you make a mistake, just continue. DO NOT end the call.
          </p>
          <p>
            <strong>Select the language you want and enter your ID to see your scripts.</strong>
          </p>
        </div>

        {/* Controls */}
        <div className="text-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full max-w-md mx-auto border border-gray-300 bg-white text-black p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#0F5B3C]"
          >
            <option value="">Select Language</option>
            <option value="Malay">Malay</option>
            <option value="English">English</option>
            <option value="Mandarin">Mandarin</option>
            <option value="Cantonese">Cantonese</option>
          </select>

          <input
            type="text"
            placeholder="Enter Speaker ID (e.g. #000123)"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            className="w-full max-w-md mx-auto border border-gray-300 bg-white text-black placeholder-gray-600 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#0F5B3C]"
          />

          <button
            onClick={fetchScripts}
            className="w-full max-w-md mx-auto bg-[#0F5B3C] text-white p-3 rounded-lg font-semibold hover:bg-[#0c4a31] transition mb-10"
          >
            {loading ? "Loading..." : "View Scripts"}
          </button>
        </div>

        {/* Results */}
        {Object.keys(groupedScripts).length === 0 && !loading && (
          <p className="text-center">No scripts found.</p>
        )}

        {Object.entries(groupedScripts).map(([key, lines]: any, index) => (
          <div key={index} className="mb-8">

            {/* Collapsible Header */}
            <div
              onClick={() => toggleSection(key)}
              className="cursor-pointer bg-[#0F5B3C] text-white px-6 py-3 rounded-lg font-semibold flex justify-between items-center"
            >
              <span>{key}</span>
              <span>{openSections[key] ? "−" : "+"}</span>
            </div>

            {/* Script Content */}
            {openSections[key] && (
              <div className="mt-4 bg-[#F9FAF7] p-6 rounded-lg">
                {lines.map((line: string, i: number) => (
                  <div
                    key={i}
                    className="border-t border-b border-gray-300 py-3 text-left"
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  )
}